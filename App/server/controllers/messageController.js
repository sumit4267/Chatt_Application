const Message = require("../models/Message");
const mongoose = require("mongoose");

// @route POST /api/messages/:receiverId
const sendMessage = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { text } = req.body;
    const senderId = req.user._id;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid recipient." });
    }
    if (receiverId === senderId.toString()) {
      return res.status(400).json({ message: "You can't message yourself." });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text: text.trim(),
    });

    // Real-time push: if the receiver has an active socket, deliver instantly.
    const { io, onlineUsers } = req.app.locals;
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Could not send message.", error: err.message });
  }
};

// @route GET /api/messages/:otherUserId
const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const myId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: "Invalid conversation partner." });
    }

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Could not load messages.", error: err.message });
  }
};

module.exports = { sendMessage, getMessages };
