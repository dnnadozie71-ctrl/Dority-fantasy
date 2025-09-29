// frontend/src/pages/Leaderboard.js
import React, { useEffect, useState } from "react";
import { getUsers } from "../api";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  const handleApi = async (promise, onSuccess) => {
    try {
      const res = await promise;
      if (onSuccess) onSuccess(res);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must log in to view Leaderboard");
    window.location.href = "/auth";
    return;
  }

  handleApi(getUsers(), (res) =>
    setUsers(res.data.sort((a, b) => b.totalPoints - a.totalPoints))
  );
}, []);


  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#000",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#4c6ef5" }}>Leaderboard</h1>
      <table
        style={{
          width: "80%",
          margin: "20px auto",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #4c6ef5", color: "#bcd0ff" }}>
            <th style={thStyle}>Rank</th>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Team Name</th>
            <th style={thStyle}>Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={u._id} style={{ borderBottom: "1px solid #333" }}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{u.username}</td>
              <td style={tdStyle}>{u.teamName || "N/A"}</td>
              <td style={tdStyle}>{u.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: "12px", fontWeight: "bold", textAlign: "center" };
const tdStyle = { padding: "10px", textAlign: "center" };
