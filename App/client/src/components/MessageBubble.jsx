const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const MessageBubble = ({ message, isOwn }) => (
  <div className={`bubble-row ${isOwn ? "own" : ""}`}>
    <div className={`bubble ${isOwn ? "bubble-own" : "bubble-other"}`}>
      <p className="bubble-text">{message.text}</p>
      <span className="bubble-time">{formatTime(message.createdAt)}</span>
    </div>
  </div>
);

export default MessageBubble;
