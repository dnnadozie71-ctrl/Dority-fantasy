import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Players from "./pages/Players";
import PickTeam from "./pages/PickTeam";
import Leaderboard from "./pages/Leaderboard";
import Groups from "./pages/Groups";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import AuthPage from "./pages/AuthPage";
import News from "./pages/News";
import Transfers from "./pages/Transfers";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div style={{ paddingTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/players" element={<Players userId={user?._id} />} />
          <Route path="/pick-team" element={<PickTeam userId={user?._id} />} />
          <Route path="/dashboard" element={<Dashboard userId={user?._id} />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/groups" element={<Groups userId={user?._id} />} />
          <Route path="/contact" element={<Contact />} />
          {/* 🔑 Pass onAuth instead of setUser */}
          <Route path="/auth" element={<AuthPage onAuth={setUser} />} />
          <Route path="/news" element={<News />} />
          <Route path="/transfers" element={<Transfers userId={user?._id} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
