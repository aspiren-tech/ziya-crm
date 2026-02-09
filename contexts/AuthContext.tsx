import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiContext';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);
  const { crmApi } = useApi();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you would validate the token with an API call
      // For now, we'll just set the authenticated state
      setIsAuthenticated(true);
      // Set a mock user since we're not actually validating the token
      setUser({
        id: 'user_1',
        name: 'Demo User',
        email: 'demo@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=6366F1&color=fff'
      });
      // Set the token in the API instance
      crmApi.setToken(token);
    }
  }, [crmApi]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll create a mock token
      // In a real app, you would call crmApi.login({ email, password })
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const mockToken = `mock_token_${Date.now()}`;
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setIsAuthenticated(true);
      crmApi.setToken(mockToken);
      
      // Set mock user data
      setUser({
        id: 'user_1',
        name: 'Demo User',
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=6366F1&color=fff`
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll simulate signup
      // In a real app, you would call crmApi.signup({ email, password, name })
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // After signup, log the user in
      await login(email, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    crmApi.setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};