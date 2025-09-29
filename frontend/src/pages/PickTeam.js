// frontend/src/pages/PickTeam.js
import React, { useEffect, useState } from "react";
import { getMySquad, getMyStartingXI, pickStartingXI } from "../api";


export default function PickTeam() {
  const [squad, setSquad] = useState([]);
  const [startingXI, setStartingXI] = useState([]);

  // 🔒 Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      alert("You must log in to pick your team");
      window.location.href = "/auth";
      return;
    }
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const squadRes = await getMySquad();
        const xiRes = await getMyStartingXI();
        setSquad(squadRes || []);
        setStartingXI(xiRes || []);
      } catch (err) {
        // ✅ This catch block is now correct and will handle an empty squad
        console.error("Error fetching team:", err);
        setSquad([]);
        setStartingXI([]);
      }
    };
    fetchData();
  }, []);

  const handlePickXI = async () => {
    try {
      await pickStartingXI(startingXI.map((p) => p._id));
      alert("Starting XI updated!");
    } catch (err) {
      alert("Error updating XI");
    }
  };

  return (
    <div style={{ padding: "20px", color: "#fff", background: "#000" }}>
      <h2>Pick Your Team</h2>
      <h3>My Squad</h3>
      <ul>
        {squad.map((player) => (
          <li key={player._id}>
            {player.name} - {player.position}
            <button
              onClick={() =>
                setStartingXI((prev) =>
                  prev.find((p) => p._id === player._id)
                    ? prev.filter((p) => p._id !== player._id)
                    : [...prev, player]
                )
              }
            >
              {startingXI.find((p) => p._id === player._id)
                ? "Remove from XI"
                : "Add to XI"}
            </button>
          </li>
        ))}
      </ul>

      <h3>Starting XI</h3>
      <ul>
        {startingXI.map((player) => (
          <li key={player._id}>
            {player.name} - {player.position}
          </li>
        ))}
      </ul>

      <button onClick={handlePickXI}>Save XI</button>
    </div>
  );
}