const User = require("../models/User");

// @route GET /api/users
// Returns everyone except the logged-in user, for the sidebar contact list.
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("username email avatarColor createdAt")
      .sort({ username: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Could not load users.", error: err.message });
  }
};

module.exports = { getUsers };
