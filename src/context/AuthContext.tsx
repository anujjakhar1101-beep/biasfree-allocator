import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "employee" | "manager";

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (id: string, password: string, role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock credentials
const MOCK_EMPLOYEES = [
  { id: "EMP001", password: "emp123", name: "Alex Johnson" },
  { id: "EMP002", password: "emp123", name: "Priya Patel" },
  { id: "EMP003", password: "emp123", name: "Marcus Chen" },
  { id: "EMP004", password: "emp123", name: "Sarah Williams" },
  { id: "EMP005", password: "emp123", name: "James Rodriguez" },
];

const MOCK_MANAGERS = [
  { id: "MGR001", password: "mgr123", name: "Diana Foster" },
  { id: "MGR002", password: "mgr123", name: "Robert Kim" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("irms_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (id: string, password: string, role: UserRole): boolean => {
    const list = role === "employee" ? MOCK_EMPLOYEES : MOCK_MANAGERS;
    const match = list.find((u) => u.id === id && u.password === password);
    if (match) {
      const authUser: AuthUser = { id: match.id, role, name: match.name };
      setUser(authUser);
      localStorage.setItem("irms_user", JSON.stringify(authUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("irms_user");
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
