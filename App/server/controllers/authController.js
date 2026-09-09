const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: "Username or email already in use." });
    }

    const user = await User.create({ username, email, password });
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatarColor: user.avatarColor,
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed.", error: err.message });
  }
};

// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatarColor: user.avatarColor,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
};

// @route POST /api/auth/logout
const logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out." });
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    avatarColor: req.user.avatarColor,
  });
};

module.exports = { register, login, logout, getMe };
