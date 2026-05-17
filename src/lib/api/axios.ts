import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: attach token + disable cache ────────────────────────
api.interceptors.request.use((config) => {
  config.headers["Cache-Control"] = "no-cache";
  config.headers.Pragma = "no-cache";
  config.headers.Expires = "0";


  if (typeof window !== "undefined") {
    const token = localStorage.getItem("library_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// ── Response interceptor: handle 401 → redirect to login ────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      // Clear session and redirect to login
      localStorage.removeItem("library_access_token");
      localStorage.removeItem("library_role");

      // Avoid redirect loop if already on login page
      if (window.location.pathname !== "/") {
        window.location.href = "/?session_expired=1";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
