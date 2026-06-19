import axios from "axios";
import { apiBaseUrl, socketBaseUrl } from "./urls.js";

export const api = axios.create({
  baseURL: apiBaseUrl()
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bidflow_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const assetUrl = (path) => {
  if (!path) return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";
  if (path.startsWith("http")) return path;
  return `${socketBaseUrl()}${path}`;
};
