// frontend/src/pages/Admin.js
import React, { useEffect, useState } from "react";
import { getAllPlayers } from "../api";

export default function Admin() {
  const [players, setPlayers] = useState([]);

  const handleApi = async (promise, onSuccess) => {
    try {
      const res = await promise;
      if (onSuccess) onSuccess(res);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    handleApi(getAllPlayers(), (res) => setPlayers(res.data));
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "#000", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ color: "#4c6ef5", textAlign: "center" }}>Admin Panel</h1>
      <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #4c6ef5", color: "#bcd0ff" }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Position</th>
            <th style={thStyle}>Price</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p._id} style={{ borderBottom: "1px solid #333" }}>
              <td style={tdStyle}>{p.name}</td>
              <td style={tdStyle}>{p.position}</td>
              <td style={tdStyle}>{p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: "12px", fontWeight: "bold", textAlign: "center" };
const tdStyle = { padding: "10px", textAlign: "center" };
