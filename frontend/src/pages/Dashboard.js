// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";


export default function Dashboard() {
  const [formation, setFormation] = useState("4-4-2");
  const [teamName, setTeamName] = useState("Your Team");
  const [userTeam, setUserTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const MAX_BUDGET = 100;
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      alert("You must log in to pick your team");
      window.location.href = "/auth";
      return;
    }

    const fetchTeam = async () => {
      try {
        // ✅ EDITED: Correct the URL to match the server route
        const res = await axios.get("http://localhost:5000/api/my-team", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Now correctly accesses the 'team' and 'teamName' properties
        setUserTeam(res.data.team || []);
        setTeamName(res.data.teamName || "Your Team");
      } catch (err) {
        // ⚠️ Handles the case where the user has no team gracefully
        console.error("Failed to fetch team:", err.response?.data || err.message);
        setUserTeam([]);
        setTeamName("Your Team");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);
  if (loading) return <p>Loading team...</p>;

  const totalSpent = userTeam.reduce((sum, p) => sum + (p.marketvalue || 0), 0);
  const budgetLeft = MAX_BUDGET - totalSpent;
  const totalPoints = userTeam.reduce((sum, p) => sum + (p.points || 0), 0);

  const formations = {
    "4-4-2": { defenders: 4, midfielders: 4, forwards: 2 },
    "4-3-3": { defenders: 4, midfielders: 3, forwards: 3 },
    "3-5-2": { defenders: 3, midfielders: 5, forwards: 2 },
    "5-3-2": { defenders: 5, midfielders: 3, forwards: 2 },
  };

  const currentFormation = formations[formation];

  const goalkeepers = userTeam.filter(
    (p) => p.position.toLowerCase() === "goalkeeper"
  );
  const defenders = userTeam.filter(
    (p) => p.position.toLowerCase() === "defender"
  );
  const midfielders = userTeam.filter(
    (p) => p.position.toLowerCase() === "midfielder"
  );
  const forwards = userTeam.filter((p) => p.position.toLowerCase() === "forward");

  const teamColors = {
    "Inter Milan": "#1e3a8a",
    "AC Milan": "#b91c1c",
    Napoli: "#1e40af",
    Juventus: "#111827",
  };

  const positions = {
    goalkeeper: [{ top: "90%", left: "50%" }],
    defenders: [
      { top: "70%", left: "15%" },
      { top: "70%", left: "35%" },
      { top: "70%", left: "65%" },
      { top: "70%", left: "85%" },
    ],
    midfielders: [
      { top: "50%", left: "10%" },
      { top: "50%", left: "40%" },
      { top: "50%", left: "60%" },
      { top: "50%", left: "90%" },
    ],
    forwards: [
      { top: "20%", left: "35%" },
      { top: "20%", left: "65%" },
    ],
  };

  const renderPlayer = (player, pos) => (
    <div
      key={player._id}
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        transform: "translate(-50%, -50%)",
        backgroundColor: teamColors[player.team] || "#222",
        color: "#fff",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        textAlign: "center",
        padding: "4px",
      }}
    >
      <b>{player.name}</b>
      <div>{player.points} pts</div>
    </div>
  );

  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#004400",
        color: "#fff",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#4c6ef5" }}>
        {teamName}
      </h1>

      <div
        style={{
          textAlign: "center",
          marginBottom: "15px",
          color: "#bcd0ff",
        }}
      >
        <div>💰 Budget Left: ${budgetLeft}M</div>
        <div>💸 Spent: ${totalSpent}M</div>
        <div>⚽ Total Points: {totalPoints}</div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <label style={{ marginRight: "10px" }}>Formation:</label>
        <select
          value={formation}
          onChange={(e) => setFormation(e.target.value)}
          style={{
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid #4c6ef5",
            backgroundColor: "#000",
            color: "#bcd0ff",
          }}
        >
          {Object.keys(formations).map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Pitch */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "800px",
          height: "600px",
          margin: "0 auto",
          backgroundColor: "#006400",
          border: "2px solid #fff",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {/* Markings */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: "100%",
              height: "2px",
              backgroundColor: "#fff",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100px",
              height: "100px",
              marginTop: "-50px",
              marginLeft: "-50px",
              border: "2px solid #fff",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "35%",
              width: "30%",
              height: "60px",
              border: "2px solid #fff",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "35%",
              width: "30%",
              height: "60px",
              border: "2px solid #fff",
            }}
          />
        </div>

        {goalkeepers.map((p, idx) => renderPlayer(p, positions.goalkeeper[idx]))}
        {defenders
          .slice(0, currentFormation.defenders)
          .map((p, idx) => renderPlayer(p, positions.defenders[idx]))}
        {midfielders
          .slice(0, currentFormation.midfielders)
          .map((p, idx) => renderPlayer(p, positions.midfielders[idx]))}
        {forwards
          .slice(0, currentFormation.forwards)
          .map((p, idx) => renderPlayer(p, positions.forwards[idx]))}
      </div>
    </div>
  );
}