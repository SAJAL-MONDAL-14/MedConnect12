import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("medconnect_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (userData, token) => {
    const userObj = { ...userData, token };
    setUser(userObj);
    localStorage.setItem("medconnect_user", JSON.stringify(userObj));
    if (token) localStorage.setItem("medconnect_token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("medconnect_user");
    localStorage.removeItem("medconnect_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
