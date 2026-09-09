import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      setSocket(null);
      return;
    }

    // The JWT cookie rides along automatically because withCredentials is true.
    const newSocket = io(SOCKET_URL, { withCredentials: true });
    newSocket.on("getOnlineUsers", (userIds) => setOnlineUsers(userIds));
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
