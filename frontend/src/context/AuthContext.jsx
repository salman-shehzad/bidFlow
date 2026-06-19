import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

const loadStoredUser = () => {
  const raw = localStorage.getItem("bidflow_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("bidflow_user");
    localStorage.removeItem("bidflow_token");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("bidflow_token"));
  const [user, setUser] = useState(loadStoredUser);

  const saveSession = (payload) => {
    localStorage.setItem("bidflow_token", payload.token);
    localStorage.setItem("bidflow_user", JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    saveSession(data);
    return data.user;
  };

  const register = async (form) => {
    const { data } = await api.post("/auth/register", form);
    saveSession(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("bidflow_token");
    localStorage.removeItem("bidflow_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, setUser, login, register, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
