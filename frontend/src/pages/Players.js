import React, { useEffect, useState } from "react";
import { getAllPlayers } from "../api";

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [userSquad, setUserSquad] = useState([]);
  const [budget, setBudget] = useState(100);
  const [spentAmount, setSpentAmount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getAllPlayers();
        setPlayers(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching players:", err);
        setLoading(false); // Important: Set loading to false even on error
      }
    };

    // Get user data from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      if (userData.squad) {
        setUserSquad(userData.squad);
        const spent = userData.squad.reduce((total, player) => total + player.marketvalue, 0);
        setSpentAmount(spent);
        setBudget(100 - spent);
      }
    }

    fetchPlayers();
  }, []);

  const buyPlayer = async (player) => {
    if (userSquad.length >= 15) {
      alert("You can only have 15 players in your squad!");
      return;
    }

    if (budget < player.marketvalue) {
      alert("Insufficient budget!");
      return;
    }

    if (userSquad.find(p => p._id === player._id)) {
      alert("Player already in your squad!");
      return;
    }

    const newSquad = [...userSquad, player];
    const newSpent = spentAmount + player.marketvalue;
    const newBudget = 100 - newSpent;

    setUserSquad(newSquad);
    setSpentAmount(newSpent);
    setBudget(newBudget);

    // Update localStorage
    const updatedUser = { ...user, squad: newSquad };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const sellPlayer = async (player) => {
    const newSquad = userSquad.filter(p => p._id !== player._id);
    const newSpent = spentAmount - player.marketvalue;
    const newBudget = 100 - newSpent;

    setUserSquad(newSquad);
    setSpentAmount(newSpent);
    setBudget(newBudget);

    // Update localStorage
    const updatedUser = { ...user, squad: newSquad };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const clearSquad = () => {
    console.log("clearSquad function called");
    console.log("Current userSquad length:", userSquad.length);
    
    if (userSquad.length === 0) {
      alert("Your squad is already empty!");
      return;
    }

    const confirmClear = window.confirm(`Are you sure you want to clear your entire squad? This will remove all ${userSquad.length} players and reset your budget to $100M.`);
    console.log("User confirmed:", confirmClear);
    
    if (!confirmClear) return;

    console.log("Clearing squad...");
    setUserSquad([]);
    setSpentAmount(0);
    setBudget(100);

    // Update localStorage - get fresh user data
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const updatedUser = { ...userData, squad: [], startingXI: [], subs: [] };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }

    console.log("Squad cleared successfully");
    alert("Squad cleared successfully! Your budget has been reset to $100M.");
  };

  if (loading) return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontSize: "1.5rem"
    }}>
      Loading players...
    </div>
  );

  const teams = ["All", "AC Milan", "Inter Milan", "Juventus", "Napoli"];
  const positions = ["All", "Goalkeeper", "Defender", "Midfielder", "Forward"];
  
  // Advanced filtering logic
  const filteredPlayers = players.filter(player => {
    // Team filter
    const teamMatch = selectedTeam === "All" || player.team === selectedTeam;
    
    // Position filter
    const positionMatch = selectedPosition === "All" || player.position === selectedPosition;
    
    // Search text filter (name)
    const nameMatch = searchText === "" || 
      player.name.toLowerCase().includes(searchText.toLowerCase());
    
    // Price range filter
    const minPrice = priceRange.min === "" ? 0 : parseFloat(priceRange.min);
    const maxPrice = priceRange.max === "" ? Infinity : parseFloat(priceRange.max);
    const priceMatch = player.marketvalue >= minPrice && player.marketvalue <= maxPrice;
    
    return teamMatch && positionMatch && nameMatch && priceMatch;
  });

  const playerStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(15px)",
    borderRadius: "15px",
    padding: "20px",
    margin: "10px",
    color: "#333",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    transition: "all 0.3s ease",
    minWidth: "280px",
    maxWidth: "320px"
  };

  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  const buyButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
    color: "white",
    boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)"
  };

  const sellButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
    color: "white",
    boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)"
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    background: "#95a5a6",
    color: "#7f8c8d",
    cursor: "not-allowed"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{
          fontSize: "3rem",
          fontWeight: "800",
          background: "linear-gradient(135deg, #4c6ef5 0%, #3b5bdb 50%, #845ef7 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "20px"
        }}>
          Player Market
        </h1>
        
        {/* Budget Display */}
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          padding: "20px",
          maxWidth: "600px",
          margin: "0 auto 30px",
          color: "white"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", marginBottom: "20px" }}>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem", color: "#94a3b8" }}>Budget Remaining</h3>
              <p style={{ margin: "0", fontSize: "1.8rem", fontWeight: "700", color: budget > 20 ? "#2ecc71" : "#e74c3c" }}>
                ${budget.toFixed(1)}M
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem", color: "#94a3b8" }}>Squad Size</h3>
              <p style={{ margin: "0", fontSize: "1.8rem", fontWeight: "700", color: userSquad.length === 15 ? "#2ecc71" : "#4c6ef5" }}>
                {userSquad.length}/15
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem", color: "#94a3b8" }}>Spent</h3>
              <p style={{ margin: "0", fontSize: "1.8rem", fontWeight: "700", color: "#845ef7" }}>
                ${spentAmount.toFixed(1)}M
              </p>
            </div>
          </div>
          
          {/* Squad Management Actions */}
          {userSquad.length > 0 && (
            <div style={{ textAlign: "center", borderTop: "1px solid rgba(255, 255, 255, 0.2)", paddingTop: "15px" }}>
              <button
                onClick={() => {
                  console.log("Clear squad button clicked!");
                  clearSquad();
                }}
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)",
                  fontSize: "14px",
                  padding: "12px 20px"
                }}
              >
                🗑️ Clear Entire Squad
              </button>
              <p style={{ margin: "10px 0 0 0", fontSize: "0.9rem", color: "#94a3b8" }}>
                This will remove all players and reset your budget
              </p>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          padding: "25px",
          maxWidth: "900px",
          margin: "0 auto 30px",
          color: "white"
        }}>
          <h3 style={{ textAlign: "center", margin: "0 0 20px 0", color: "#4c6ef5" }}>🔍 Player Filters</h3>
          
          {/* Search Input */}
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search players by name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 20px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontSize: "16px",
                outline: "none"
              }}
            />
          </div>

          {/* Price Range Filter */}
          <div style={{ 
            display: "flex", 
            gap: "15px", 
            justifyContent: "center", 
            alignItems: "center", 
            marginBottom: "15px",
            flexWrap: "wrap"
          }}>
            <label style={{ color: "#94a3b8", fontWeight: "600" }}>Price Range:</label>
            <input
              type="number"
              placeholder="Min (M)"
              value={priceRange.min}
              onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                width: "100px",
                outline: "none"
              }}
            />
            <span style={{ color: "#94a3b8" }}>to</span>
            <input
              type="number"
              placeholder="Max (M)"
              value={priceRange.max}
              onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                width: "100px",
                outline: "none"
              }}
            />
            <button
              onClick={() => setPriceRange({ min: "", max: "" })}
              style={{
                ...buttonStyle,
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                fontSize: "12px",
                padding: "6px 12px"
              }}
            >
              Clear
            </button>
          </div>

          {/* Quick Price Filter Buttons */}
          <div style={{ 
            display: "flex", 
            gap: "8px", 
            justifyContent: "center", 
            marginBottom: "20px",
            flexWrap: "wrap"
          }}>
            <span style={{ color: "#94a3b8", fontSize: "12px", alignSelf: "center" }}>Quick filters:</span>
            {[
              { label: "Under 5M", min: "", max: "5" },
              { label: "5-10M", min: "5", max: "10" },
              { label: "10-15M", min: "10", max: "15" },
              { label: "15-20M", min: "15", max: "20" },
              { label: "Over 20M", min: "20", max: "" }
            ].map(filter => (
              <button
                key={filter.label}
                onClick={() => setPriceRange({ min: filter.min, max: filter.max })}
                style={{
                  ...buttonStyle,
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  fontSize: "11px",
                  padding: "5px 10px"
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Team Filter */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ color: "#94a3b8", fontWeight: "600", display: "block", marginBottom: "10px" }}>Team:</label>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              {teams.map(team => (
                <button
                  key={team}
                  onClick={() => setSelectedTeam(team)}
                  style={{
                    ...buttonStyle,
                    background: selectedTeam === team 
                      ? "linear-gradient(135deg, #4c6ef5 0%, #845ef7 100%)"
                      : "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    border: selectedTeam === team ? "none" : "1px solid rgba(255, 255, 255, 0.3)",
                    fontSize: "12px",
                    padding: "8px 12px"
                  }}
                >
                  {team}
                </button>
              ))}
            </div>
          </div>

          {/* Position Filter */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ color: "#94a3b8", fontWeight: "600", display: "block", marginBottom: "10px" }}>Position:</label>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              {positions.map(position => (
                <button
                  key={position}
                  onClick={() => setSelectedPosition(position)}
                  style={{
                    ...buttonStyle,
                    background: selectedPosition === position 
                      ? "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)"
                      : "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    border: selectedPosition === position ? "none" : "1px solid rgba(255, 255, 255, 0.3)",
                    fontSize: "12px",
                    padding: "8px 12px"
                  }}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Results */}
          <div style={{ textAlign: "center", marginTop: "15px", fontSize: "14px", color: "#94a3b8" }}>
            Showing {filteredPlayers.length} of {players.length} players
            {searchText && ` • Search: "${searchText}"`}
            {(priceRange.min || priceRange.max) && ` • Price: ${priceRange.min || 0}M - ${priceRange.max || '∞'}M`}
          </div>
        </div>
      </div>

      {/* Players Grid */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "20px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {filteredPlayers.map(player => {
          const isInSquad = userSquad.find(p => p._id === player._id);
          const canBuy = !isInSquad && userSquad.length < 15 && budget >= player.marketvalue;
          
          return (
            <div key={player._id} style={{
              ...playerStyle,
              border: isInSquad ? "2px solid #2ecc71" : "1px solid rgba(255, 255, 255, 0.3)",
              transform: isInSquad ? "scale(1.02)" : "scale(1)"
            }}>
              <div style={{ textAlign: "center" }}>
                <h3 style={{ 
                  margin: "0 0 10px 0", 
                  fontSize: "1.3rem", 
                  fontWeight: "700",
                  color: "#2c3e50"
                }}>
                  {player.name}
                </h3>
                
                <div style={{ 
                  background: `linear-gradient(135deg, ${getTeamColor(player.team)} 0%, ${getTeamColor(player.team)}88 100%)`,
                  color: "white",
                  padding: "8px 15px",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  margin: "0 0 15px 0",
                  display: "inline-block"
                }}>
                  {player.team}
                </div>
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginBottom: "15px",
                  fontSize: "1rem"
                }}>
                  <span style={{ fontWeight: "600", color: "#7f8c8d" }}>Position:</span>
                  <span style={{ fontWeight: "700", color: "#2c3e50" }}>{player.position}</span>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginBottom: "15px",
                  fontSize: "1rem"
                }}>
                  <span style={{ fontWeight: "600", color: "#7f8c8d" }}>Value:</span>
                  <span style={{ fontWeight: "700", color: "#e67e22", fontSize: "1.1rem" }}>
                    ${player.marketvalue}M
                  </span>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginBottom: "20px",
                  fontSize: "1rem"
                }}>
                  <span style={{ fontWeight: "600", color: "#7f8c8d" }}>Points:</span>
                  <span style={{ fontWeight: "700", color: "#3498db" }}>{player.points || 0}</span>
                </div>

                {isInSquad ? (
                  <button
                    onClick={() => sellPlayer(player)}
                    style={sellButtonStyle}
                  >
                    Sell Player
                  </button>
                ) : (
                  <button
                    onClick={() => buyPlayer(player)}
                    disabled={!canBuy}
                    style={canBuy ? buyButtonStyle : disabledButtonStyle}
                  >
                    {userSquad.length >= 15 ? "Squad Full" : 
                     budget < player.marketvalue ? "Insufficient Budget" : "Buy Player"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* My Squad Section */}
      {userSquad.length > 0 && (
        <div style={{
          maxWidth: "1400px",
          margin: "60px auto 40px",
          padding: "0 20px"
        }}>
          <h2 style={{
            textAlign: "center",
            fontSize: "2.5rem",
            fontWeight: "700",
            background: "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "30px"
          }}>
            My Squad ({userSquad.length}/15)
          </h2>
          
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "15px"
          }}>
            {userSquad.map(player => (
              <div key={player._id} style={{
                background: "rgba(46, 204, 113, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                padding: "15px",
                border: "2px solid #2ecc71",
                color: "white",
                minWidth: "250px",
                textAlign: "center"
              }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", color: "#2ecc71" }}>
                  {player.name}
                </h4>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#94a3b8" }}>
                  {player.position} | {player.team}
                </p>
                <p style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: "600", color: "#f39c12" }}>
                  ${player.marketvalue}M
                </p>
                <button
                  onClick={() => sellPlayer(player)}
                  style={{
                    ...buttonStyle,
                    background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
                    color: "white",
                    fontSize: "12px",
                    padding: "6px 12px"
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Squad Status */}
      {userSquad.length === 15 && (
        <div style={{
          background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
          color: "white",
          padding: "20px",
          borderRadius: "15px",
          textAlign: "center",
          maxWidth: "600px",
          margin: "40px auto",
          fontWeight: "600",
          fontSize: "1.2rem"
        }}>
          🎉 Squad Complete! Ready to pick your starting XI?
          <div style={{ marginTop: "15px" }}>
            <a 
              href="/pick-team" 
              style={{
                ...buttonStyle,
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Pick Your Team
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

function getTeamColor(team) {
  const colors = {
    "AC Milan": "#FF1744",
    "Inter Milan": "#1976D2", 
    "Juventus": "#000000",
    "Napoli": "#2196F3"
  };
  return colors[team] || "#4c6ef5";
}

export default PlayersPage;
