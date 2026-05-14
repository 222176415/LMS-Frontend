import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5243/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Structural Interceptor: Automatically appends the Bearer Token to all requests if present
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("lms_bearer_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
