// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  username: string;
  userId: string;
};

type AuthContextType = {
  user: User | null;
  login: (params: { username: string; token: string; userId: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = ({
    username,
    token,
    userId,
  }: {
    username: string;
    token: string;
    userId: string;
  }) => {
    setUser({ username, userId });
    localStorage.setItem("inv_token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
