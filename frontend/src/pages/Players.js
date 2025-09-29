import React, { useEffect, useState } from "react";
import { getAllPlayers } from "../api";


const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await getAllPlayers(); // from API
        setPlayers(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching players:", err);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) return <p>Loading players...</p>;

  // Group players by team
  const teams = {};
  players.forEach((p) => {
    if (!teams[p.team]) teams[p.team] = [];
    teams[p.team].push(p);
  });

  return (
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#fff", color: "#000" }}>
      <h1>All Players</h1>
      {Object.keys(teams).map((team) => (
        <div key={team} style={{ marginBottom: "20px" }}>
          <h2 style={{ color: "#4c6ef5" }}>{team}</h2>
          <ul>
            {teams[team].map((player) => (
              <li key={player._id}>
                {player.name} ({player.position}) - ${player.marketvalue}M - {player.points || 0} pts
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PlayersPage;
