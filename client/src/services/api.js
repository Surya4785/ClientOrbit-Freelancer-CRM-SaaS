import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

API.interceptors.request.use((req) => {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  return req;
});

export default API;