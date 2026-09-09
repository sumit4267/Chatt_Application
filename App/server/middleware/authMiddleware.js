const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the httpOnly JWT cookie and attaches the logged-in user to req.user.
// This is the "authentication" gate: no valid token, no access.
const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired session." });
  }
};

module.exports = { protect };
