// frontend/src/pages/News.js
import React, { useState } from "react";


const newsData = [
  { date: "2025-09-01", title: "Season Kickoff", content: "Dority Serie A Gets Underway" },
  { date: "2025-09-10", title: "Chukwuma Justin Transfer", content: "Dority Serie A: Chukwuma Justin to Inter Milan in a swap deal plus cash involving Ezeugo Enu and an additional £1.5m + £1.5m in add ons rising up to £3m" },
  { date: "2025-09-08", title: "Onuoha Issac Loan", content: "Onuoha Issac to Inter Milan on loan. Deal includes option to buy for £4m + £1m add-ons based on performance. First summer signing for Nerazzurri." },
  { date: "2025-09-10", title: "Amanze Chimdindu Signing", content: "Amanze Chimdindu to Juventus. Juventus signs him as a free agent after successful negotiations on personal terms." }
];

export default function News() {
  const [newsList] = useState(newsData);

  return (
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#000", color: "#fff" }}>
      <h1 style={{ textAlign: "center", color: "#4c6ef5", marginBottom: "30px" }}>Weekly Fantasy News</h1>
      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {newsList.map((news, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "#111",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
            }}
          >
            <h3 style={{ color: "#4c6ef5", marginBottom: "5px" }}>{news.title}</h3>
            <small style={{ color: "#bcd0ff" }}>{news.date}</small>
            <p style={{ marginTop: "10px", lineHeight: "1.5", color: "#e0e7ff" }}>{news.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
