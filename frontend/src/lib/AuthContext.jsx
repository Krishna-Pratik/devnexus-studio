import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setIsLoadingAuth(true);

    try {
      const currentUser = await apiFetch('/auth/me');
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (_error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const refreshUser = async () => {
    setIsLoadingAuth(true);
    try {
      const currentUser = await apiFetch('/auth/me');
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (_error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const login = async (email, password) => {
    try {
      const authResponse = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      await refreshUser();
      return authResponse;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name, email, password, confirmPassword = password) => {
    try {
      const authResponse = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      await refreshUser();
      return authResponse;
    } catch (error) {
      throw error;
    }
  };

  const googleAuth = async (credential) => {
    try {
      const authResponse = await apiFetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential }),
      });
      await refreshUser();
      return authResponse;
    } catch (error) {
      throw error;
    }
  };

  const logout = async (shouldRedirect = true) => {
    try {
      await apiFetch('/auth/logout', {
        method: 'POST',
      });
    } catch (_error) {
      // Client state is still cleared if logout request fails.
    }

    setUser(null);
    setIsAuthenticated(false);
    
    if (shouldRedirect) {
      window.location.href = '/login';
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isInitializing: isLoadingAuth,
      isLoadingAuth,
      login,
      signup,
      googleAuth,
      logout,
      navigateToLogin,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
