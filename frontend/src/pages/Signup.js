import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Signup({ onSignupSuccess }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle selecting/unselecting players
  const togglePlayer = (playerId) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId));
    } else {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  // Submit signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        ...form,
        selectedPlayers,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        onSignupSuccess(res.data.user);
      }
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <h3>Select Your Players</h3>
        <div className="players-grid">
          {players.map((player) => (
            <div
              key={player._id}
              className={`player-card ${
                selectedPlayers.includes(player._id) ? "selected" : ""
              }`}
              onClick={() => togglePlayer(player._id)}
            >
              <p>{player.name}</p>
              <small>{player.position}</small>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
