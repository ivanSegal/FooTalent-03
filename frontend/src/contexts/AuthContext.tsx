"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthState {
  email: string | null;
  token: string | null;
  setEmail: (email: string | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmailState] = useState<string | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedToken = localStorage.getItem("token");
    if (storedEmail) setEmailState(storedEmail);
    if (storedToken) setTokenState(storedToken);
  }, []);

  const setEmail = (value: string | null) => {
    setEmailState(value);
    if (value) {
      localStorage.setItem("email", value);
    } else {
      localStorage.removeItem("email");
    }
  };

  const setToken = (value: string | null) => {
    setTokenState(value);
    if (value) {
      localStorage.setItem("token", value);
    } else {
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider value={{ email, token, setEmail, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
