import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import "./chatwindow.css";

const ChatWindow = ({ selectedUser }) => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load conversation history whenever the selected contact changes.
  useEffect(() => {
    if (!selectedUser) return;
    setLoading(true);
    setMessages([]);
    api
      .get(`/messages/${selectedUser._id}`)
      .then((res) => setMessages(res.data))
      .finally(() => setLoading(false));
  }, [selectedUser]);

  // Listen for messages/typing events pushed over the socket.
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleNewMessage = (message) => {
      const isForThisThread =
        (message.sender === selectedUser._id && message.receiver === user._id) ||
        (message.sender === user._id && message.receiver === selectedUser._id);
      if (isForThisThread) setMessages((prev) => [...prev, message]);
    };

    const handleTyping = ({ from }) => {
      if (from === selectedUser._id) setIsTyping(true);
    };
    const handleStopTyping = ({ from }) => {
      if (from === selectedUser._id) setIsTyping(false);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, selectedUser, user._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    // Optimistic UI: show the message immediately, then confirm with the server.
    const optimistic = {
      _id: `temp-${Date.now()}`,
      sender: user._id,
      receiver: selectedUser._id,
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await api.post(`/messages/${selectedUser._id}`, { text });
      setMessages((prev) => prev.map((m) => (m._id === optimistic._id ? res.data : m)));
    } catch {
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
    }
  };

  const handleTyping = () => {
    socket?.emit("typing", { to: selectedUser._id });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stopTyping", { to: selectedUser._id });
    }, 1500);
  };

  const handleStopTyping = () => {
    clearTimeout(typingTimeoutRef.current);
    socket?.emit("stopTyping", { to: selectedUser._id });
  };

  if (!selectedUser) {
    return (
      <div className="chat-empty">
        <h2>Select a conversation</h2>
        <p>Choose someone from the list to start chatting.</p>
      </div>
    );
  }

  const online = onlineUsers.includes(selectedUser._id);

  return (
    <div className="chat-window">
      <header className="chat-header">
        <span className="chat-header-avatar" style={{ background: selectedUser.avatarColor }}>
          {selectedUser.username.slice(0, 2).toUpperCase()}
        </span>
        <div>
          <h2 className="chat-header-name">{selectedUser.username}</h2>
          <p className="chat-header-status">{online ? "Online" : "Offline"}</p>
        </div>
      </header>

      <div className="chat-messages">
        {loading && <p className="chat-hint">Loading conversation…</p>}
        {!loading && messages.length === 0 && (
          <p className="chat-hint">No messages yet. Say hello!</p>
        )}
        {messages.map((m) => (
          <MessageBubble key={m._id} message={m} isOwn={m.sender === user._id} />
        ))}
        {isTyping && <p className="chat-typing">{selectedUser.username} is typing…</p>}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={handleSend} onTyping={handleTyping} onStopTyping={handleStopTyping} />
    </div>
  );
};

export default ChatWindow;
