// frontend/src/pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const res = await api.post("/users/login", {
  identifier: emailOrUsername,
  password,
});


      // ✅ Save user + token in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      setMessage(res.data.message || "Login successful");

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{ backgroundColor: "#000" }}
    >
      <div
        className="p-8 rounded-2xl shadow-lg w-96"
        style={{ backgroundColor: "#001F4D" }}
      >
        <h2
          className="text-2xl font-bold mb-4 text-center"
          style={{ color: "#00BFFF" }}
        >
          Login
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            style={{ padding: "8px", borderRadius: "8px" }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ padding: "8px", borderRadius: "8px" }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ padding: "8px", borderRadius: "8px" }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#00BFFF",
              color: "#000",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Login
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center" style={{ color: "#00BFFF" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
