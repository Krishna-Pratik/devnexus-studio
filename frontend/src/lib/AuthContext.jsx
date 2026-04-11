import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('token')));
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setIsLoadingAuth(true);
    console.info('[Auth] initializeAuth start', { hasToken: Boolean(localStorage.getItem('token')) });

    try {
      const currentUser = await apiFetch('/auth/me');
      setUser(currentUser);
      setIsAuthenticated(true);
      console.info('[Auth] initializeAuth success');
    } catch (_error) {
      setIsAuthenticated(false);
      setUser(null);
      console.warn('[Auth] initializeAuth failed');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const refreshUser = async () => {
    setIsLoadingAuth(true);
    console.info('[Auth] refreshUser start', { hasToken: Boolean(localStorage.getItem('token')) });
    try {
      const currentUser = await apiFetch('/auth/me');
      setUser(currentUser);
      setIsAuthenticated(true);
      console.info('[Auth] refreshUser success');
    } catch (_error) {
      setUser(null);
      setIsAuthenticated(false);
      console.warn('[Auth] refreshUser failed');
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
      const token = authResponse?.token || authResponse?.jwt || authResponse?.data?.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      setIsAuthenticated(true);
      if (authResponse?._id || authResponse?.email) {
        setUser(authResponse);
      }
      console.info('[Auth] login success', { hasToken: Boolean(token) });
      await refreshUser();
      return authResponse;
    } catch (error) {
      console.error('[Auth] login failed', error);
      throw error;
    }
  };

  const signup = async (name, email, password, confirmPassword = password) => {
    try {
      const authResponse = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const token = authResponse?.token || authResponse?.jwt || authResponse?.data?.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      setIsAuthenticated(true);
      if (authResponse?._id || authResponse?.email) {
        setUser(authResponse);
      }
      console.info('[Auth] signup success', { hasToken: Boolean(token) });
      await refreshUser();
      return authResponse;
    } catch (error) {
      console.error('[Auth] signup failed', error);
      throw error;
    }
  };

  const googleAuth = async (credential) => {
    try {
      const authResponse = await apiFetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential }),
      });
      const token = authResponse?.token || authResponse?.jwt || authResponse?.data?.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      setIsAuthenticated(true);
      if (authResponse?._id || authResponse?.email) {
        setUser(authResponse);
      }
      console.info('[Auth] googleAuth success', { hasToken: Boolean(token) });
      await refreshUser();
      return authResponse;
    } catch (error) {
      console.error('[Auth] googleAuth failed', error);
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
    localStorage.removeItem('token');
    console.info('[Auth] logout complete');
    
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
