import { useState } from "react";

const MessageInput = ({ onSend, onTyping, onStopTyping }) => {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping?.();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
    onStopTyping?.();
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Write a message…"
        value={text}
        onChange={handleChange}
        onBlur={onStopTyping}
      />
      <button type="submit" disabled={!text.trim()}>
        Send
      </button>
    </form>
  );
};

export default MessageInput;
