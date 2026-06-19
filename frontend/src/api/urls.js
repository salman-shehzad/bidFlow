const API_PORT = "5000";

const replaceLocalhostForLan = (url) => {
  if (typeof window === "undefined") return url;
  const host = window.location.hostname;
  const isLanHost = host && host !== "localhost" && host !== "127.0.0.1";
  if (!isLanHost) return url;
  return url.replace("localhost", host).replace("127.0.0.1", host);
};

export const apiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:${API_PORT}/api`;
  return replaceLocalhostForLan(configured);
};

export const socketBaseUrl = () => {
  const configured = import.meta.env.VITE_SOCKET_URL || `http://${window.location.hostname}:${API_PORT}`;
  return replaceLocalhostForLan(configured).replace(/\/$/, "");
};
