import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSocket } from "../context/SocketContext";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { onlineUsers } = useSocket();

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        onlineUsers={onlineUsers}
      />
      <ChatWindow selectedUser={selectedUser} />
    </div>
  );
};

export default ChatPage;
