import React, { useEffect, useState } from "react";

export default function PickTeam() {
  const [user, setUser] = useState(null);
  const [squad, setSquad] = useState([]);
  const [startingXI, setStartingXI] = useState([]);
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("Please log in first");
      window.location.href = "/auth";
      return;
    }
    
    const userData = JSON.parse(savedUser);
    setUser(userData);
    setSquad(userData.squad || []);
    setStartingXI(userData.startingXI || []);
    setSubs(userData.subs || []);
  }, []);

  const saveTeam = () => {
    if (startingXI.length !== 11 || subs.length !== 4) {
      alert("Need 11 starters and 4 subs!");
      return;
    }

    const updatedUser = { ...user, startingXI, subs };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Team saved!");
    window.location.href = "/dashboard";
  };

  if (!user) {
    return (
      <div style={{
        padding: "20px",
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        textAlign: "center"
      }}>
        <h2 style={{ color: "#4c6ef5" }}>Please log in</h2>
      </div>
    );
  }
  
  if (!squad.length) {
    return (
      <div style={{
        padding: "20px",
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        textAlign: "center"
      }}>
        <h2 style={{ color: "#4c6ef5" }}>No Players in Squad</h2>
        <a href="/players" style={{
          color: "#4c6ef5",
          textDecoration: "none",
          fontSize: "18px"
        }}>Buy players first</a>
      </div>
    );
  }

  return (
    <div style={{
      padding: "20px",
      backgroundColor: "#000",
      color: "#fff",
      minHeight: "100vh"
    }}>
      <h1 style={{ 
        textAlign: "center", 
        color: "#4c6ef5",
        marginBottom: "30px"
      }}>Pick Your Team</h1>
      
      <h2 style={{
        color: "#f39c12",
        marginBottom: "15px"
      }}>Starting XI ({startingXI.length}/11)</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "15px",
        marginBottom: "30px"
      }}>
        {startingXI.map(p => (
          <div key={p._id} style={{
            backgroundColor: "#1e3a8a",
            color: "#fff",
            borderRadius: "10px",
            padding: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "16px" }}>{p.name}</div>
              <div style={{ color: "#94a3b8" }}>{p.position} | ${p.price}M</div>
            </div>
            <button 
              onClick={() => setStartingXI(startingXI.filter(x => x._id !== p._id))}
              style={buttonStyle("#e74c3c")}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <h2 style={{
        color: "#f39c12",
        marginBottom: "15px"
      }}>Substitutes ({subs.length}/4)</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "15px",
        marginBottom: "30px"
      }}>
        {subs.map(p => (
          <div key={p._id} style={{
            backgroundColor: "#1e3a8a",
            color: "#fff",
            borderRadius: "10px",
            padding: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "16px" }}>{p.name}</div>
              <div style={{ color: "#94a3b8" }}>{p.position} | ${p.price}M</div>
            </div>
            <button 
              onClick={() => setSubs(subs.filter(x => x._id !== p._id))}
              style={buttonStyle("#e74c3c")}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <h2 style={{
        color: "#f39c12",
        marginBottom: "15px"
      }}>Available Players</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "15px",
        marginBottom: "30px"
      }}>
        {squad.filter(p => !startingXI.find(x => x._id === p._id) && !subs.find(x => x._id === p._id)).map(p => (
          <div key={p._id} style={{
            backgroundColor: "#1e3a8a",
            color: "#fff",
            borderRadius: "10px",
            padding: "15px"
          }}>
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontWeight: "bold", fontSize: "16px" }}>{p.name}</div>
              <div style={{ color: "#94a3b8" }}>{p.position} | ${p.price}M</div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                onClick={() => startingXI.length < 11 && setStartingXI([...startingXI, p])}
                disabled={startingXI.length >= 11}
                style={buttonStyle(startingXI.length >= 11 ? "#666" : "#27ae60")}
              >
                Add to XI
              </button>
              <button 
                onClick={() => subs.length < 4 && setSubs([...subs, p])}
                disabled={subs.length >= 4}
                style={buttonStyle(subs.length >= 4 ? "#666" : "#3498db")}
              >
                Add to Subs
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button 
          onClick={saveTeam} 
          style={{
            fontSize: "18px",
            padding: "15px 30px",
            backgroundColor: "#4c6ef5",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.target.style.opacity = "0.8"}
          onMouseOut={(e) => e.target.style.opacity = "1"}
        >
          Save Team
        </button>
      </div>

      <div style={{ 
        textAlign: "center", 
        marginTop: "20px",
        fontSize: "16px"
      }}>
        <a href="/players" style={{
          color: "#4c6ef5",
          textDecoration: "none",
          marginRight: "20px"
        }}> Players</a>
        <span style={{ color: "#666" }}>|</span>
        <a href="/dashboard" style={{
          color: "#4c6ef5",
          textDecoration: "none",
          marginLeft: "20px"
        }}> Dashboard</a>
      </div>
    </div>
  );
}

const buttonStyle = (bgColor) => ({
  padding: "8px 16px",
  backgroundColor: bgColor,
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.2s"
});
