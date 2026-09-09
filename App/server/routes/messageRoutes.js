const express = require("express");
const { sendMessage, getMessages } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:receiverId", protect, sendMessage);
router.get("/:otherUserId", protect, getMessages);

module.exports = router;
