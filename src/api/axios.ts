import axios from "axios";
import { storage } from "../utils/storage";

const api = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.status === 401 &&
      error.config?.url !== "/api/auth/login"
    ) {
      storage.removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
