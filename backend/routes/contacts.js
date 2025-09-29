// backend/routes/contacts.js
const express = require("express");
const Contact = require("../models/Contact");
const router = express.Router();

router.post("/send", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: "All fields are required" });
  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: "Message saved successfully!" });
  } catch (err) {
    console.error("Error saving contact message:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

module.exports = router;
