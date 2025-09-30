// frontend/src/pages/Home.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState(null);
  const [userProgress, setUserProgress] = useState({
    hasSquad: false,
    squadSize: 0,
    hasStartingXI: false,
    hasFormation: false
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Check user progress
      setUserProgress({
        hasSquad: userData.squad && userData.squad.length > 0,
        squadSize: userData.squad ? userData.squad.length : 0,
        hasStartingXI: userData.startingXI && userData.startingXI.length === 11,
        hasFormation: userData.formation && userData.formation !== ""
      });
    }
  }, []);

  const stepStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(15px)",
    borderRadius: "20px",
    padding: "25px",
    margin: "15px",
    color: "#333",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    transition: "all 0.3s ease",
    textAlign: "center",
    minWidth: "280px"
  };

  const completedStepStyle = {
    ...stepStyle,
    background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
    color: "white"
  };

  const buttonStyle = {
    padding: "12px 24px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "16px",
    transition: "all 0.3s ease",
    border: "none",
    cursor: "pointer",
    display: "inline-block",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #4c6ef5 0%, #845ef7 100%)",
    color: "white",
    boxShadow: "0 6px 20px rgba(76, 110, 245, 0.3)"
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
    color: "white",
    boxShadow: "0 6px 20px rgba(39, 174, 96, 0.3)"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ 
          fontSize: "3.5rem", 
          fontWeight: "800",
          background: "linear-gradient(135deg, #4c6ef5 0%, #3b5bdb 50%, #845ef7 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "20px",
          textShadow: "0 4px 20px rgba(76, 110, 245, 0.3)"
        }}>
          Welcome to Dority Fantasy
        </h1>
        <p style={{ 
          fontSize: "1.4rem", 
          color: "#94a3b8", 
          maxWidth: "600px", 
          margin: "0 auto",
          fontWeight: "500"
        }}>
          {user ? `Welcome back, ${user.username}!` : "Your ultimate fantasy football experience"} Build your dream team and compete with friends!
        </p>
      </div>

      {user ? (
        // Logged in user - show progress steps
        <div>
          <h2 style={{ 
            textAlign: "center", 
            color: "white", 
            fontSize: "2rem", 
            marginBottom: "30px",
            fontWeight: "600"
          }}>
            🏆 Build Your Dream Team
          </h2>
          
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            justifyContent: "center", 
            maxWidth: "1200px", 
            margin: "0 auto" 
          }}>
            
            {/* Step 1: Buy Players */}
            <div style={userProgress.squadSize >= 15 ? completedStepStyle : stepStyle}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>
                {userProgress.squadSize >= 15 ? "✅" : "1️⃣"} Buy 15 Players
              </h3>
              <p style={{ marginBottom: "15px", fontSize: "1rem" }}>
                Budget: 100M | Squad: {userProgress.squadSize}/15 players
              </p>
              {userProgress.squadSize >= 15 ? (
                <p style={{ fontWeight: "600" }}>Squad Complete! 🎉</p>
              ) : (
                <Link to="/players" style={primaryButtonStyle}>
                  Buy Players
                </Link>
              )}
            </div>

            {/* Step 2: Pick Team */}
            <div style={userProgress.hasStartingXI ? completedStepStyle : stepStyle}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>
                {userProgress.hasStartingXI ? "✅" : "2️⃣"} Pick Your XI
              </h3>
              <p style={{ marginBottom: "15px", fontSize: "1rem" }}>
                Select 11 starters + 4 subs from your squad
              </p>
              {userProgress.hasStartingXI ? (
                <p style={{ fontWeight: "600" }}>Team Selected! ⚽</p>
              ) : userProgress.squadSize >= 15 ? (
                <Link to="/pick-team" style={secondaryButtonStyle}>
                  Pick Team
                </Link>
              ) : (
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  Complete step 1 first
                </p>
              )}
            </div>

            {/* Step 3: Set Formation */}
            <div style={userProgress.hasFormation ? completedStepStyle : stepStyle}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>
                {userProgress.hasFormation ? "✅" : "3️⃣"} Set Formation
              </h3>
              <p style={{ marginBottom: "15px", fontSize: "1rem" }}>
                Choose your formation (4-3-3, 4-4-2, etc.)
              </p>
              {userProgress.hasFormation ? (
                <p style={{ fontWeight: "600" }}>Formation Set! 🎯</p>
              ) : userProgress.hasStartingXI ? (
                <Link to="/dashboard" style={secondaryButtonStyle}>
                  Set Formation
                </Link>
              ) : (
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  Complete step 2 first
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ 
            textAlign: "center", 
            marginTop: "50px",
            padding: "30px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            maxWidth: "800px",
            margin: "50px auto 0"
          }}>
            <h3 style={{ color: "white", marginBottom: "20px", fontSize: "1.3rem" }}>
              Quick Actions
            </h3>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
              <Link to="/transfers" style={primaryButtonStyle}>
                Transfer Market
              </Link>
              <Link to="/leaderboard" style={secondaryButtonStyle}>
                Leaderboard
              </Link>
              <Link to="/groups" style={primaryButtonStyle}>
                Groups
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // Not logged in - show welcome
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            display: "flex", 
            gap: "20px", 
            justifyContent: "center", 
            flexWrap: "wrap",
            marginBottom: "40px"
          }}>
            <Link to="/auth" style={primaryButtonStyle}>
              Get Started
            </Link>
            <Link to="/players" style={secondaryButtonStyle}>
              View Players
            </Link>
          </div>
          
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            padding: "40px",
            backdropFilter: "blur(10px)",
            maxWidth: "600px",
            margin: "0 auto",
            color: "white"
          }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
              How It Works
            </h3>
            <div style={{ textAlign: "left", fontSize: "1.1rem", lineHeight: "1.6" }}>
              <p>🔸 Sign up and get 100M budget</p>
              <p>🔸 Buy 15 players from Serie A teams</p>
              <p>🔸 Pick your starting XI + 4 subs</p>
              <p>🔸 Set your formation and compete!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
