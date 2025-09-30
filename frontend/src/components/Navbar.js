// frontend/src/components/Navbar.js
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth");
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/players", label: "Players" },
    { path: "/pick-team", label: "Pick Team" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/leaderboard", label: "Leaderboard" },
    { path: "/groups", label: "Groups" },
    { path: "/news", label: "News" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav
      style={{
        backgroundColor: "#000",
        borderBottom: "2px solid #4c6ef5",
        padding: "10px 20px",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            color: "#4c6ef5",
            fontSize: "22px",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          ⚽ Fantasy League
        </Link>

        {/* Desktop Menu */}
        <div
          className="desktop-menu"
          style={{ display: "flex", gap: "20px", alignItems: "center" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color:
                  location.pathname === link.path ? "#4c6ef5" : "#bcd0ff",
                fontWeight:
                  location.pathname === link.path ? "bold" : "normal",
                textDecoration: "none",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.target.style.color =
                  location.pathname === link.path ? "#4c6ef5" : "#bcd0ff")
              }
            >
              {link.label}
            </Link>
          ))}

          {/* Right-side Auth Controls */}
          {user ? (
            <>
              <span style={{ color: "#bcd0ff", marginRight: "10px" }}>
                Hi, {user.username}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#4c6ef5",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              style={{
                backgroundColor: "#4c6ef5",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Login / Signup
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="mobile-menu-btn"
          style={{
            background: "none",
            border: "none",
            color: "#4c6ef5",
            fontSize: "26px",
            display: "none",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div
          className="mobile-menu"
          style={{
            backgroundColor: "#000",
            borderTop: "1px solid #333",
            padding: "10px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color:
                  location.pathname === link.path ? "#4c6ef5" : "#bcd0ff",
                fontWeight:
                  location.pathname === link.path ? "bold" : "normal",
                textDecoration: "none",
                padding: "10px",
                width: "100%",
                textAlign: "center",
                transition: "0.3s",
              }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <span style={{ color: "#bcd0ff", margin: "10px 0" }}>
                Hi, {user.username}
              </span>
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                style={{
                  backgroundColor: "#4c6ef5",
                  color: "#fff",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginBottom: "10px",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              style={{
                backgroundColor: "#4c6ef5",
                color: "#fff",
                padding: "8px 15px",
                borderRadius: "6px",
                textDecoration: "none",
                marginBottom: "10px",
              }}
              onClick={() => setOpen(false)}
            >
              Login / Signup
            </Link>
          )}
        </div>
      )}

      {/* Responsive Styling */}
      <style>
        {`
          @media (max-width: 768px) {
            .desktop-menu { display: none; }
            .mobile-menu-btn { display: block !important; }
          }
        `}
      </style>
    </nav>
  );
}
