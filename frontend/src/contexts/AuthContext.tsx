"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthState {
  email: string | null;
  setEmail: (email: string | null) => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmailState] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("email");
    if (stored) setEmailState(stored);
  }, []);

  const setEmail = (value: string | null) => {
    setEmailState(value);
    if (value) {
      localStorage.setItem("email", value);
    } else {
      localStorage.removeItem("email");
    }
  };

  return <AuthContext.Provider value={{ email, setEmail }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
