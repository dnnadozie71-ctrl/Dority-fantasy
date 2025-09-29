import React, { useEffect, useState } from "react";
import { getAllPlayers, buyPlayer, sellPlayer } from "../api";
import PlayerCard from "../components/PlayerCard";


const teamColors = {
  "Inter Milan": "#030c30ff",
  "AC Milan": "#380404ff",
  "Napoli": "#4c6ef5",
  "Juventus": "#000000",
};

export default function PlayersList({ userId }) {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [activeTeam, setActiveTeam] = useState("All");

  useEffect(() => {
    getAllPlayers()
      .then((playersData) => {
        setPlayers(playersData);
        setFilteredPlayers(playersData);
      })
      .catch((err) => console.error("Error fetching players:", err));
  }, []);

  const filterByTeam = (team) => {
    setActiveTeam(team);
    setFilteredPlayers(
      team === "All" ? players : players.filter((p) => p.team === team)
    );
  };

  const handleBuy = (player) => {
    if (!userId) {
      alert("You must be logged in!");
      return;
    }
    buyPlayer({ userId, playerId: player._id })
      .then(() => alert("Player bought!"))
      .catch((err) =>
        alert(err.response?.data?.message || "Failed to buy player")
      );
  };

  const handleSell = (playerId) => {
    if (!userId) {
      alert("You must be logged in!");
      return;
    }
    sellPlayer({ userId, playerId })
      .then(() => alert("Player sold!"))
      .catch((err) =>
        alert(err.response?.data?.message || "Failed to sell player")
      );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#4c6ef5" }}>All Players</h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => filterByTeam("All")}
          style={filterButtonStyle(activeTeam === "All", "#000")}
        >
          All
        </button>
        {Object.keys(teamColors).map((team) => (
          <button
            key={team}
            onClick={() => filterByTeam(team)}
            style={filterButtonStyle(activeTeam === team, teamColors[team])}
          >
            {team}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          justifyItems: "center",
        }}
      >
        {filteredPlayers.map((p) => (
          <PlayerCard
            key={p._id}
            player={p}
            onBuy={() => handleBuy(p)}
            onSell={() => handleSell(p._id)}
          />
        ))}
      </div>
    </div>
  );
}

const filterButtonStyle = (active, color) => ({
  backgroundColor: active ? color : "#f0f0f0",
  color: active ? "#fff" : "#000",
  marginRight: "10px",
  padding: "8px 16px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
});
