import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // On load, ask the server if our httpOnly cookie is still valid.
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  const register = async (username, email, password) => {
    const res = await api.post("/auth/register", { username, email, password });
    setUser(res.data);
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, checkingSession, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
