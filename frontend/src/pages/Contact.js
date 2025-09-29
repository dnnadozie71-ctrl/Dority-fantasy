// frontend/src/pages/Contact.js
import React, { useState } from "react";
import { sendContactMessage } from "../api";


export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    sendContactMessage(form)
      .then(() => {
        alert("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      })
      .catch(() => alert("Failed to send message"))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#000", color: "#fff" }}>
      <h1 style={{ color: "#4c6ef5" }}>Contact Us</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", marginTop: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%", borderRadius: "5px", border: "1px solid #4c6ef5", backgroundColor: "#111", color: "#fff" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%", borderRadius: "5px", border: "1px solid #4c6ef5", backgroundColor: "#111", color: "#fff" }}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%", borderRadius: "5px", border: "1px solid #4c6ef5", backgroundColor: "#111", color: "#fff" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#4c6ef5",
            color: "#fff",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
            fontWeight: "bold",
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
