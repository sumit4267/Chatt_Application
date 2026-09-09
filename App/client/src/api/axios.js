import axios from "axios";

// withCredentials lets the browser send/receive the httpOnly JWT cookie.
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default api;
