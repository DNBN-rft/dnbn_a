import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserType = 'cust' | 'store' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userType: UserType;
  login: (type: 'cust' | 'store') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);

  const login = (type: 'cust' | 'store') => {
    setIsAuthenticated(true);
    setUserType(type);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
