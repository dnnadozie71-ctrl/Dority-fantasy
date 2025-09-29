import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeftOnRectangleIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import "./Transfers.css";

// To resolve the import error, the API functions have been moved into this single file.

// ===== API FUNCTIONS =====
const BASE_URL = "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    console.log("Sending request with token:", token.substring(0, 20) + "...");
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("No token found in localStorage");
  }
  return config;
});

// Add response interceptor to handle 401 and user not found errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || 
        (error.response?.status === 404 && error.response?.data?.shouldReLogin)) {
      console.log("Authentication issue - clearing token and redirecting");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// ✅ FIXED: Better error handling with auto-relogin for user not found
const handleApi = (error) => {
  if (error.response && error.response.data) {
    console.error("API Error:", error.response.data);
    
    // Handle "User not found" specifically
    if (error.response.data.message === 'User not found' || 
        error.response.status === 404) {
      console.log("User not found - clearing auth data");
      localStorage.removeItem("token");
      localStorage.removeUser("user");
      setTimeout(() => {
        window.location.href = "/auth";
      }, 1000);
      throw new Error("User not found. Redirecting to login...");
    }
    
    // Extract the message string from the response object
    const errorMessage = error.response.data.message || 
                        (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data));
    throw new Error(errorMessage);
  } else {
    console.error("API Error:", error.message);
    throw new Error("Network error");
  }
};

const getAllPlayers = async () => {
  try {
    const res = await API.get("/players");
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

const buyPlayer = async (playerId) => {
  try {
    const res = await API.post(`/buy/${playerId}`);
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

const sellPlayer = async (playerId) => {
  try {
    const res = await API.post(`/sell/${playerId}`);
    return res.data;
  } catch (error) {
    handleApi(error);
  }
};

// ✅ NEW: Debug function to analyze token
const debugToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("=== TOKEN ANALYSIS ===");
      console.log("Full payload:", payload);
      console.log("User ID:", payload.userId || payload.id || payload.sub || payload.user);
      console.log("Issued at:", new Date(payload.iat * 1000));
      console.log("Expires at:", new Date(payload.exp * 1000));
      console.log("Is expired?", payload.exp * 1000 < Date.now());
      
      // Check if user data in localStorage matches token
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      console.log("Saved user ID:", savedUser._id || savedUser.id);
      console.log("IDs match?", (payload.userId || payload.id || payload.sub) === (savedUser._id || savedUser.id));
      console.log("=== END TOKEN ANALYSIS ===");
      return payload;
    } catch (e) {
      console.error("Could not decode token:", e);
    }
  }
  return null;
};

// ✅ NEW: Function to clear auth and force re-login
const clearAuthAndRelogin = () => {
  console.log("Clearing auth data and redirecting to login...");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/auth";
};

// Make debug functions available globally for console testing
window.debugToken = debugToken;
window.clearAuth = clearAuthAndRelogin;

// ===== END OF API FUNCTIONS =====

// A simple modal/message box component to replace alerts
const MessageBox = ({ message, onClose, showClearAuth = false }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
    <div className="bg-white text-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
      <p className="font-semibold text-lg mb-4">{message}</p>
      <div className="flex gap-2 justify-center">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
        >
          Dismiss
        </button>
        {showClearAuth && (
          <button
            onClick={clearAuthAndRelogin}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            Re-Login
          </button>
        )}
      </div>
    </div>
  </div>
);

// Style for buttons using Tailwind CSS classes
const btnStyle = (color) => `
  flex items-center justify-center gap-1
  px-4 py-2 mt-2 rounded-full font-semibold
  text-white transition-all
  ${color === 'green' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
  disabled:opacity-50 disabled:cursor-not-allowed
`;

export default function App() {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [budget, setBudget] = useState(0);
  const [mySquad, setMySquad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [showUserNotFound, setShowUserNotFound] = useState(false);

  const teams = ["All", "AC Milan", "Inter Milan", "Juventus", "Napoli"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    console.log("=== AUTHENTICATION CHECK ===");
    console.log("Token exists:", !!token);
    console.log("User exists:", !!savedUser);

    // ✅ IMPROVED: Better validation with auto-cleanup
    if (!token || token === 'null' || token === 'undefined') {
      console.log("Invalid or missing token:", token);
      setShowLoginMessage(true);
      setTimeout(() => window.location.href = "/auth", 2000);
      return;
    }

    // ✅ NEW: Check if user data is corrupted or missing
    try {
      const userData = JSON.parse(savedUser || "{}");
      if (!userData._id && !userData.id) {
        console.log("User data is corrupted or missing - clearing auth");
        clearAuthAndRelogin();
        return;
      }
    } catch (e) {
      console.log("Could not parse user data - clearing auth");
      clearAuthAndRelogin();
      return;
    }

    // ✅ IMPROVED: JWT token validation with better error handling
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      console.log("Token payload:", tokenPayload);
      
      const isExpired = tokenPayload.exp * 1000 < Date.now();
      if (isExpired) {
        console.log("Token is expired - clearing auth");
        clearAuthAndRelogin();
        return;
      }
    } catch (e) {
      console.log("Could not decode token (might not be JWT format):", e.message);
    }

    const fetchData = async () => {
      try {
        console.log("Fetching players...");
        const allPlayers = await getAllPlayers();
        setPlayers(allPlayers);
        setFilteredPlayers(allPlayers);

        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
          setBudget(userData.budget || 100);
          setMySquad(userData.squad || []);
        }
      } catch (err) {
        console.error("Error in fetchData:", err);
        
        // ✅ NEW: Handle "User not found" specifically
        if (err.message.includes("User not found") || err.message.includes("not found")) {
          setShowUserNotFound(true);
        } else {
          setError("Failed to fetch players: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter players when team selection changes
  useEffect(() => {
    if (selectedTeam === "All") {
      setFilteredPlayers(players);
    } else {
      setFilteredPlayers(players.filter(player => player.team === selectedTeam));
    }
  }, [selectedTeam, players]);

  const handleBuy = async (playerId) => {
    try {
      setError(null);
      console.log("Attempting to buy player:", playerId);
      const res = await buyPlayer(playerId);
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        squad: res.squad,
        budget: res.budget,
      };
      setBudget(res.budget);
      setMySquad(res.squad);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Buy player error:", err);
      
      // ✅ NEW: Handle user not found during transactions
      if (err.message.includes("User not found")) {
        setShowUserNotFound(true);
      } else {
        setError(err.message || "Failed to buy player");
      }
    }
  };

  const handleSell = async (playerId) => {
    try {
      setError(null);
      console.log("Attempting to sell player:", playerId);
      const res = await sellPlayer(playerId);
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        squad: res.squad,
        budget: res.budget,
      };
      setBudget(res.budget);
      setMySquad(res.squad);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Sell player error:", err);
      
      // ✅ NEW: Handle user not found during transactions
      if (err.message.includes("User not found")) {
        setShowUserNotFound(true);
      } else {
        setError(err.message || "Failed to sell player");
      }
    }
  };

  if (loading) return <div className="loading-container"><p className="loading-text">Loading players...</p></div>;
  
  if (showLoginMessage) {
    return (
      <MessageBox
        message="You must log in to make transfers."
        onClose={() => setShowLoginMessage(false)}
      />
    );
  }

  if (showUserNotFound) {
    return (
      <MessageBox
        message="Your user account was not found. Please log in again to continue."
        onClose={() => setShowUserNotFound(false)}
        showClearAuth={true}
      />
    );
  }

  const isMySquadValid = Array.isArray(mySquad);

  return (
    <div className="transfers-container">
      <div className="transfers-header">
        <h1 className="transfers-title">Transfers</h1>
        <p className="transfers-budget">Budget: ${budget}</p>
      </div>

      {/* Team Filter */}
      <div className="team-filter-container">
        <div className="team-filter-buttons">
          {teams.map((team) => (
            <button
              key={team}
              onClick={() => setSelectedTeam(team)}
              className={`team-filter-btn ${selectedTeam === team ? 'active' : 'inactive'}`}
            >
              {team}
            </button>
          ))}
        </div>
        <p className="team-filter-count">
          Showing {filteredPlayers.length} players {selectedTeam !== "All" && `from ${selectedTeam}`}
        </p>
      </div>
        
        {/* ✅ NEW: Debug panel for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-panel">
            <h3>Debug Panel:</h3>
            <button 
              onClick={debugToken}
              className="debug-btn debug-btn-primary"
            >
              Debug Token
            </button>
            <button 
              onClick={clearAuthAndRelogin}
              className="debug-btn debug-btn-danger"
            >
              Clear Auth & Re-login
            </button>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <div style={{ marginTop: '10px' }}>
              <button 
                onClick={() => setError(null)}
                className="debug-btn debug-btn-primary"
              >
                Dismiss
              </button>
              {error.includes("not found") && (
                <button 
                  onClick={clearAuthAndRelogin}
                  className="debug-btn debug-btn-danger"
                >
                  Re-Login
                </button>
              )}
            </div>
          </div>
        )}

        <div className="players-grid">
          {filteredPlayers.map((player) => {
            const inSquad = isMySquadValid && mySquad.some((p) => p._id === player._id);

            return (
              <div key={player._id} className="player-card">
                <div className="player-avatar">
                  <span>{player.position[0]}</span>
                </div>
                <h3 className="player-name">{player.name}</h3>
                <p className="player-details">{player.position} | {player.team}</p>
                <p className="player-price">Price: ${player.marketvalue}M</p>

                {!inSquad ? (
                  <button
                    onClick={() => handleBuy(player._id)}
                    className={`player-action-btn ${player.marketvalue > budget ? 'btn-disabled' : 'btn-buy'}`}
                    disabled={player.marketvalue > budget}
                  >
                    <ShoppingCartIcon style={{ width: '20px', height: '20px' }} /> Buy
                  </button>
                ) : (
                  <button
                    onClick={() => handleSell(player._id)}
                    className="player-action-btn btn-sell"
                  >
                    <ArrowLeftOnRectangleIcon style={{ width: '20px', height: '20px' }} /> Sell
                  </button>
                )}
              </div>
            );
          })}
        </div>
    </div>
  );
}