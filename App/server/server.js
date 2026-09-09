require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

connectDB();

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// ---- Socket.IO real-time layer ----
const io = new Server(server, {
  cors: { origin: CLIENT_URL, credentials: true },
});

// userId -> socketId, so REST controllers can push events to a specific user.
const onlineUsers = new Map();
app.locals.io = io;
app.locals.onlineUsers = onlineUsers;

// Authenticate each socket connection using the same JWT cookie as the REST API.
io.use((socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie || "";
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    if (!tokenMatch) return next(new Error("Not authenticated"));

    const decoded = jwt.verify(tokenMatch[1], process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error("Not authenticated"));
  }
});

io.on("connection", (socket) => {
  onlineUsers.set(socket.userId, socket.id);
  io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

  socket.on("typing", ({ to }) => {
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) io.to(targetSocketId).emit("typing", { from: socket.userId });
  });

  socket.on("stopTyping", ({ to }) => {
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) io.to(targetSocketId).emit("stopTyping", { from: socket.userId });
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.userId);
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
