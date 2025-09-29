import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeftOnRectangleIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';

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

// Add response interceptor to handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("401 Unauthorized - clearing token and redirecting");
      // Token is invalid, clear it and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// ✅ FIXED: Better error handling
const handleApi = (error) => {
  if (error.response && error.response.data) {
    console.error("API Error:", error.response.data);
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
// ===== END OF API FUNCTIONS =====

// A simple modal/message box component to replace alerts
const MessageBox = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
    <div className="bg-white text-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
      <p className="font-semibold text-lg">{message}</p>
      <button
        onClick={onClose}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
      >
        OK
      </button>
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
  const [budget, setBudget] = useState(0);
  const [mySquad, setMySquad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    // ✅ IMPROVED: Better token validation
    console.log("Checking authentication...");
    console.log("Token exists:", !!token);
    console.log("User exists:", !!savedUser);

    if (!token || token === 'null' || token === 'undefined') {
      console.log("Invalid or missing token:", token);
      setShowLoginMessage(true);
      setTimeout(() => {
        window.location.href = "/auth";
      }, 2000);
      return;
    }

    // ✅ NEW: Check if JWT token is expired (optional but recommended)
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      const isExpired = tokenPayload.exp * 1000 < Date.now();
      if (isExpired) {
        console.log("Token is expired");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setShowLoginMessage(true);
        setTimeout(() => {
          window.location.href = "/auth";
        }, 2000);
        return;
      }
    } catch (e) {
      console.log("Could not decode token (might not be JWT format):", e.message);
      // Continue anyway - some tokens might not be JWT format
    }

    const fetchData = async () => {
      try {
        console.log("Fetching players...");
        const allPlayers = await getAllPlayers();
        setPlayers(allPlayers);

        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
          setBudget(userData.budget || 100);
          setMySquad(userData.squad || []);
        }
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError("Failed to fetch players: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBuy = async (playerId) => {
    try {
      setError(null); // Clear previous errors
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
      setError(err.message || "Failed to buy player");
    }
  };

  const handleSell = async (playerId) => {
    try {
      setError(null); // Clear previous errors
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
      setError(err.message || "Failed to sell player");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-900 text-white"><p>Loading players...</p></div>;
  
  if (showLoginMessage) {
    return (
      <MessageBox
        message="You must log in to make transfers."
        onClose={() => setShowLoginMessage(false)}
      />
    );
  }

  const isMySquadValid = Array.isArray(mySquad);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-2">Transfers</h1>
        <p className="text-center text-xl text-yellow-400 font-semibold mb-6">Budget: ${budget}</p>
        
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4 text-center">
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 px-4 py-1 bg-red-700 hover:bg-red-800 rounded text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {players.map((player) => {
            const inSquad = isMySquadValid && mySquad.some((p) => p._id === player._id);

            return (
              <div
                key={player._id}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition-all hover:border-blue-500 transform hover:scale-105"
              >
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mb-4">
                  <span className="text-white text-3xl font-bold">{player.position[0]}</span>
                </div>
                <h3 className="text-xl font-bold text-white truncate w-full">{player.name}</h3>
                <p className="text-gray-400 font-medium">{player.position} | {player.team}</p>
                <p className="text-green-400 font-bold text-lg mt-1">Price: ${player.marketvalue}M</p>

                {!inSquad ? (
                  <button
                    onClick={() => handleBuy(player._id)}
                    className={btnStyle('green')}
                    disabled={player.marketvalue > budget}
                  >
                    <ShoppingCartIcon className="h-5 w-5" /> Buy
                  </button>
                ) : (
                  <button
                    onClick={() => handleSell(player._id)}
                    className={btnStyle('red')}
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" /> Sell
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}