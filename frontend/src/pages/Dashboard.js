import React, { useEffect, useState } from "react";

const formations = [
  { name: "4-3-3", layout: [4, 3, 3] },
  { name: "4-4-2", layout: [4, 4, 2] },
  { name: "3-5-2", layout: [3, 5, 2] },
  { name: "5-3-2", layout: [5, 3, 2] },
  { name: "4-2-3-1", layout: [4, 2, 3, 1] }
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [startingXI, setStartingXI] = useState([]);
  const [subs, setSubs] = useState([]);
  const [formation, setFormation] = useState(formations[0].name);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("Please log in to view your dashboard.");
      window.location.href = "/auth";
      return;
    }
    const userData = JSON.parse(savedUser);
    setUser(userData);
    
    // Get team data from localStorage (saved by PickTeam)
    const savedStartingXI = userData.startingXI || [];
    const savedSubs = userData.subs || [];
    
    setStartingXI(savedStartingXI);
    setSubs(savedSubs);
    setFormation(userData.formation || formations[0].name);
    
    console.log("Dashboard Debug - Starting XI:", savedStartingXI);
    console.log("Dashboard Debug - Subs:", savedSubs);
  }, []);

  const handleFormationChange = (e) => {
    setFormation(e.target.value);
    if (user) {
      const updatedUser = { ...user, formation: e.target.value };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  if (!user || startingXI.length !== 11 || subs.length !== 4) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        padding: "20px",
        textAlign: "center"
      }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "40px",
          maxWidth: "500px"
        }}>
          <h2 style={{ color: "#4c6ef5", marginBottom: "20px" }}>⚽ Complete Your Team Selection!</h2>
          <p style={{ marginBottom: "20px", fontSize: "1.2rem" }}>
            You must pick 11 starters and 4 subs before accessing the dashboard.
          </p>
          
          {/* Debug Info */}
          <div style={{ 
            background: "rgba(255, 255, 255, 0.1)", 
            padding: "15px", 
            borderRadius: "10px", 
            marginBottom: "20px",
            fontSize: "0.9rem",
            textAlign: "left"
          }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#f39c12" }}>Current Status:</h4>
            <p style={{ margin: "5px 0" }}>👥 Squad: {user?.squad?.length || 0}/15 players</p>
            <p style={{ margin: "5px 0" }}>🏟️ Starting XI: {startingXI.length}/11 players</p>
            <p style={{ margin: "5px 0" }}>🔄 Substitutes: {subs.length}/4 players</p>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            {(!user?.squad || user.squad.length < 15) && (
              <a href="/players" style={{
                padding: "12px 24px",
                borderRadius: "12px",
                textDecoration: "none",
                background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
                color: "white",
                fontWeight: "600"
              }}>
                Buy Players
              </a>
            )}
            
            {user?.squad?.length >= 15 && (
              <a href="/pick-team" style={{
                padding: "12px 24px",
                borderRadius: "12px",
                textDecoration: "none",
                background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
                color: "white",
                fontWeight: "600"
              }}>
                Pick Your Team
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  const renderFormation = () => {
    const selected = formations.find(f => f.name === formation);
    if (!selected) return null;
    let idx = 0;
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        margin: "40px 0"
      }}>
        {selected.layout.map((num, rowIdx) => (
          <div key={rowIdx} style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            {[...Array(num)].map((_, i) => {
              const player = startingXI[idx];
              idx++;
              return (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.95)",
                  borderRadius: "12px",
                  padding: "10px 18px",
                  color: "#333",
                  minWidth: "120px",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}>
                  <div style={{ fontWeight: "700", fontSize: "1rem" }}>{player ? player.name : "-"}</div>
                  <div style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>{player ? `${player.position} | ${player.team}` : ""}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
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
          Dashboard
        </h1>
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          padding: "20px",
          maxWidth: "600px",
          margin: "0 auto",
          color: "white"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#94a3b8" }}>Select Formation</h3>
          <select value={formation} onChange={handleFormationChange} style={{
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            background: "rgba(255,255,255,0.95)",
            color: "#333",
            border: "none",
            marginBottom: "20px"
          }}>
            {formations.map(f => (
              <option key={f.name} value={f.name}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        {renderFormation()}
      </div>
      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "15px",
        padding: "25px",
        margin: "20px 0",
        color: "white"
      }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "20px", color: "#f39c12", textAlign: "center" }}>
           Substitutes ({subs.length}/4)
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", minHeight: "100px" }}>
          {subs.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: "1.1rem", textAlign: "center", width: "100%" }}>
              No substitutes selected.
            </p>
          ) : (
            subs.map(player => (
              <div key={player._id} style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "15px",
                padding: "15px",
                margin: "8px",
                color: "#333",
                textAlign: "center",
                minWidth: "200px"
              }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "1.1rem" }}>{player.name}</h4>
                <p style={{ margin: "0 0 8px 0", color: "#7f8c8d", fontSize: "0.9rem" }}>
                  {player.position} | {player.team}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
