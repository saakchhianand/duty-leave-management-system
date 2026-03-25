import axios from "axios";

// 🔥 use .env instead of hardcoding
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

// 🔐 attach token automatically
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ⚠️ handle response errors globally (optional but pro)
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - token expired");
      // optional: logout logic later
    }
    return Promise.reject(error);
  }
);

export default API;