import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Signup.css";

export default function Signup({ onSignupSuccess }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    teamName: "",
  });
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [filterTeam, setFilterTeam] = useState("All");

  // Fetch available players
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/players");
        setPlayers(res.data);
      } catch (err) {
        console.error("Error fetching players:", err);
      }
    };
    fetchPlayers();
  }, []);

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.teamName.trim()) {
      newErrors.teamName = "Team name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle selecting/unselecting players
  const togglePlayer = (playerId) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId));
    } else {
      if (selectedPlayers.length < 15) {
        setSelectedPlayers([...selectedPlayers, playerId]);
      } else {
        alert("You can select maximum 15 players for your squad");
      }
    }
  };

  // Get filtered players
  const filteredPlayers = filterTeam === "All" 
    ? players 
    : players.filter(player => player.team === filterTeam);

  // Get unique teams
  const teams = ["All", ...new Set(players.map(player => player.team))];

  // Handle step navigation
  const nextStep = () => {
    if (step === 1 && validateForm()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  // Submit signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        username: form.username,
        email: form.email,
        password: form.password,
        teamName: form.teamName,
        selectedPlayers,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        onSignupSuccess && onSignupSuccess(res.data.user);
        alert("Account created successfully! Welcome to Dority Fantasy! Now let's build your team!");
        
        // Redirect to transfers page to buy players
        setTimeout(() => {
          window.location.href = "/transfers";
        }, 2000);
      }
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Join Dority Fantasy</h1>
          <p>Create your account and start building your dream team!</p>
          <div className="progress-bar">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <span>1</span>
              <label>Account Details</label>
            </div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <span>2</span>
              <label>Build Your Squad</label>
            </div>
          </div>
        </div>

        {step === 1 && (
          <form className="signup-form" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                className={errors.username ? 'error' : ''}
                required
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Team Name</label>
              <input
                type="text"
                name="teamName"
                placeholder="Enter your fantasy team name"
                value={form.teamName}
                onChange={handleChange}
                className={errors.teamName ? 'error' : ''}
                required
              />
              {errors.teamName && <span className="error-message">{errors.teamName}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                required
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary">
              Continue to Squad Selection →
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="squad-selection">
            <div className="squad-header">
              <h3>Build Your Squad</h3>
              <p>Select up to 15 players for your squad ({selectedPlayers.length}/15 selected)</p>
              
              <div className="team-filter">
                <label>Filter by team:</label>
                <select value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)}>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="players-grid">
              {filteredPlayers.map((player) => (
                <div
                  key={player._id}
                  className={`player-card ${selectedPlayers.includes(player._id) ? "selected" : ""}`}
                  onClick={() => togglePlayer(player._id)}
                >
                  <div className="player-info">
                    <h4>{player.name}</h4>
                    <p className="position">{player.position}</p>
                    <p className="team">{player.team}</p>
                    <p className="value">${player.marketvalue}M</p>
                  </div>
                  {selectedPlayers.includes(player._id) && (
                    <div className="selected-indicator">✓</div>
                  )}
                </div>
              ))}
            </div>

            <div className="squad-actions">
              <button type="button" className="btn btn-secondary" onClick={prevStep}>
                ← Back to Account Details
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading || selectedPlayers.length === 0}
              >
                {loading ? "Creating Account..." : `Create Account with ${selectedPlayers.length} Players`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
