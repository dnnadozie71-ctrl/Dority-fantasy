// frontend/src/pages/Groups.js
import React, { useEffect, useState } from "react";
import { createGroup, joinGroup, getUserGroups } from "../api";


const Groups = ({ userId }) => {
  const [groups, setGroups] = useState([]);
  const [newName, setNewName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const fetchGroups = () => {
    if (!userId) return;
    getUserGroups(userId).then(res => setGroups(res.data)).catch(err => console.error(err));
  };

 useEffect(() => {
  const token = localStorage.getItem("token");
  const savedUser = JSON.parse(localStorage.getItem("user"));

  if (!token || !savedUser) {
    alert("You must log in to manage groups");
    window.location.href = "/auth";
    return;
  }

  const fetchGroups = async () => {
    try {
      if (!userId) return;
      const res = await getUserGroups(userId);
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchGroups();
}, [userId]);


  const handleCreate = () => {
    if (!newName.trim()) return;
    createGroup({ name: newName.trim(), userId })
      .then(res => {
        alert("Group created! Code: " + res.data.group.code);
        setNewName(""); fetchGroups();
      })
      .catch(err => alert(err.response?.data?.message || "Failed to create group"));
  };

  const handleJoin = () => {
    if (!joinCode.trim()) return;
    joinGroup({ code: joinCode.trim(), userId })
      .then(res => {
        alert("Joined group: " + res.data.group.name);
        setJoinCode(""); fetchGroups();
      })
      .catch(err => alert(err.response?.data?.message || "Failed to join group"));
  };

  return (
    <div style={{ padding: 20, minHeight: "100vh", backgroundColor: "#000", color: "#fff" }}>
      <h1 style={{ textAlign: "center", color: "#4c6ef5" }}>Your Groups</h1>

      <div style={{ marginBottom: 20 }}>
        <h2>Create Group</h2>
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Group name"
          style={{ padding: 8, marginRight: 8, borderRadius: 6, border: "1px solid #4c6ef5" }} />
        <button onClick={handleCreate} style={{ padding: 8, borderRadius: 6, backgroundColor: "#4c6ef5", color: "#fff", border: "none" }}>Create</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h2>Join Group</h2>
        <input value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="Enter code"
          style={{ padding: 8, marginRight: 8, borderRadius: 6, border: "1px solid #4c6ef5" }} />
        <button onClick={handleJoin} style={{ padding: 8, borderRadius: 6, backgroundColor: "#4c6ef5", color: "#fff", border: "none" }}>Join</button>
      </div>

      <div>
        {groups.length === 0 ? <p style={{ color: "#98a9d8" }}>No groups yet.</p> :
          <ul style={{ listStyle: "none", padding: 0 }}>
            {groups.map(g => (
              <li key={g._id} style={{ backgroundColor: "#111", padding: 12, borderRadius: 8, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{g.name}</span>
                  <span style={{ color: "#4c6ef5" }}>Code: {g.code}</span>
                </div>
              </li>
            ))}
          </ul>
        }
      </div>
    </div>
  );
};

export default Groups;
