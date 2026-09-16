'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: string | null;
  role: string | null;
  login: (name: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setUser(localStorage.getItem('atsira_display_name'));
    setRole(localStorage.getItem('atsira_role'));
  }, []);

  const login = (name: string, role: string) => {
    localStorage.setItem('atsira_display_name', name);
    localStorage.setItem('atsira_role', role);
    setUser(name);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem('atsira_display_name');
    localStorage.removeItem('atsira_role');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
