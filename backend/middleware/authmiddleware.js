// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user by the ID from the decoded token
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      // ✅ EDITED: Use a 401 status for an authenticated user who is not found
      // This is more semantically correct than a 404, as the user is "unauthorized"
      // to access the resource, even with a seemingly valid token.
      return res.status(401).json({ message: "User not found" });
    }
    
    // Attach the user object to the request for subsequent middleware
    req.user = user; 
    next();

  } catch (err) {
    // ✅ This block correctly handles expired or invalid tokens
    return res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = auth;