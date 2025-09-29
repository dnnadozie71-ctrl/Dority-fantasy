// frontend/src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const buttonStyle = {
    padding: "12px 25px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "0.3s",
    border: "2px solid transparent",
  };

  const hoverEffect = (e, bg, border = "transparent") => {
    e.currentTarget.style.backgroundColor = bg;
    e.currentTarget.style.borderColor = border;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #000 40%, #4c6ef5 100%)",
        padding: "20px",
        textAlign: "center",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
        Welcome to Dority Fantasy
      </h1>
      <p style={{ fontSize: "20px", maxWidth: "600px", marginBottom: "30px" }}>
        Your ultimate school fantasy football league. Build your team, compete
        with friends, and dominate the leaderboard!
      </p>

      {/* Buttons Section */}
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          to="/players"
          style={{
            ...buttonStyle,
            backgroundColor: "#4c6ef5",
            color: "white",
          }}
          onMouseOver={(e) => hoverEffect(e, "#3b5bdb")}
          onMouseOut={(e) => hoverEffect(e, "#4c6ef5")}
        >
          View Players
        </Link>
        <Link
          to="/transfers"
          style={{
            ...buttonStyle,
            backgroundColor: "#000",
            color: "white",
            border: "2px solid #4c6ef5",
          }}
          onMouseOver={(e) => hoverEffect(e, "#111", "#3b5bdb")}
          onMouseOut={(e) => hoverEffect(e, "#000", "#4c6ef5")}
        >
          Transfers
        </Link>
        <Link
          to="/pick-team"
          style={{
            ...buttonStyle,
            backgroundColor: "#4c6ef5",
            color: "white",
          }}
          onMouseOver={(e) => hoverEffect(e, "#3b5bdb")}
          onMouseOut={(e) => hoverEffect(e, "#4c6ef5")}
        >
          Pick Team
        </Link>
        <Link
          to="/leaderboard"
          style={{
            ...buttonStyle,
            backgroundColor: "#000",
            color: "white",
            border: "2px solid #4c6ef5",
          }}
          onMouseOver={(e) => hoverEffect(e, "#111", "#3b5bdb")}
          onMouseOut={(e) => hoverEffect(e, "#000", "#4c6ef5")}
        >
          Leaderboard
        </Link>
        <Link
          to="/groups"
          style={{
            ...buttonStyle,
            backgroundColor: "#4c6ef5",
            color: "white",
          }}
          onMouseOver={(e) => hoverEffect(e, "#3b5bdb")}
          onMouseOut={(e) => hoverEffect(e, "#4c6ef5")}
        >
          Groups
        </Link>
        <Link
          to="/dashboard"
          style={{
            ...buttonStyle,
            backgroundColor: "#000",
            color: "white",
            border: "2px solid #4c6ef5",
          }}
          onMouseOver={(e) => hoverEffect(e, "#111", "#3b5bdb")}
          onMouseOut={(e) => hoverEffect(e, "#000", "#4c6ef5")}
        >
          Dashboard
        </Link>
        <Link
          to="/contact"
          style={{
            ...buttonStyle,
            backgroundColor: "#4c6ef5",
            color: "white",
          }}
          onMouseOver={(e) => hoverEffect(e, "#3b5bdb")}
          onMouseOut={(e) => hoverEffect(e, "#4c6ef5")}
        >
          Contact
        </Link>
        <Link
          to="/auth"
          style={{
            ...buttonStyle,
            backgroundColor: "#000",
            color: "white",
            border: "2px solid #4c6ef5",
          }}
          onMouseOver={(e) => hoverEffect(e, "#111", "#3b5bdb")}
          onMouseOut={(e) => hoverEffect(e, "#000", "#4c6ef5")}
        >
          Login / Register
        </Link>
      </div>
    </div>
  );
}
