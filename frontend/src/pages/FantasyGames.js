import React, { useState } from "react";

const FantasyGames = () => {
  const [tab, setTab] = useState("classic");

  return (
    <div className="section">
      <h2>Fantasy Game Modes</h2>
      <div className="chips" style={{marginTop:12}}>
        <button className="chip" onClick={() => setTab("classic")} style={{cursor:"pointer",borderColor: tab==="classic"?"#7aa2ff":"rgba(255,255,255,.08)"}}>Classic League</button>
        <button className="chip" onClick={() => setTab("h2h")} style={{cursor:"pointer",borderColor: tab==="h2h"?"#7aa2ff":"rgba(255,255,255,.08)"}}>Head-to-Head</button>
        <button className="chip" onClick={() => setTab("cup")} style={{cursor:"pointer",borderColor: tab==="cup"?"#7aa2ff":"rgba(255,255,255,.08)"}}>Cup</button>
      </div>

      <div className="card" style={{marginTop:12}}>
        {tab === "classic" && <p>Score points weekly and climb the overall leaderboard.</p>}
        {tab === "h2h" && <p>Face one opponent each week. Win = 3 pts, Draw = 1 pt.</p>}
        {tab === "cup" && <p>Knockout tournament among classmates — survive and advance.</p>}
      </div>
    </div>
  );
};

export default FantasyGames;
