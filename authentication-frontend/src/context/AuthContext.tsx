import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: { accessToken: string, refreshToken: string }) => void;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = ({ accessToken, refreshToken }: { accessToken: string, refreshToken: string }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
  };

  const getAccessToken = () => localStorage.getItem('accessToken');
  const getRefreshToken = () => localStorage.getItem('refreshToken');

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, getAccessToken, getRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
