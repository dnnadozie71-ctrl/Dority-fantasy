import React from "react";

const About = () => (
  <div
    style={{
      padding: "20px",
      minHeight: "100vh",
      backgroundColor: "#000",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    <h2 style={{ color: "#4c6ef5", fontSize: "36px", marginBottom: "20px" }}>
      About Dority Fantasy League
    </h2>
    <p style={{ fontSize: "18px", maxWidth: "600px", lineHeight: "1.6" }}>
      Built for our school community. Assemble a team, earn points from real match performance,
      and challenge friends in private groups.
    </p>
  </div>
);

export default About;
