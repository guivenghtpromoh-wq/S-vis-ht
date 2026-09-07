// frontend/src/context/AuthContext.js - Secure auth context

import React, { createContext, useState, useEffect, useCallback } from 'react';
import AuthService from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  const SESSION_TIMEOUT_MINUTES = 30; // Session timeout
  const WARNING_TIMEOUT_MINUTES = 28; // Show warning 2 minutes before logout

  // Initialize auth state
  useEffect(() => {
    const savedUser = AuthService.getUser();
    if (savedUser && AuthService.isAuthenticated()) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  // Session timeout management
  useEffect(() => {
    if (!user) return;

    const resetTimer = () => {
      if (sessionTimeout) clearTimeout(sessionTimeout);

      // Warning timeout
      const warningTimer = setTimeout(() => {
        alert('Seshan ou ap ekspire nan 2 minit. Tanpri sav travay ou.');
      }, WARNING_TIMEOUT_MINUTES * 60 * 1000);

      // Logout timeout
      const logoutTimer = setTimeout(() => {
        handleLogout();
        alert('Seshan ou ekspire. Tanpri konekte ankò.');
      }, SESSION_TIMEOUT_MINUTES * 60 * 1000);

      setSessionTimeout(logoutTimer);
    };

    // Reset timer on user activity
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('keydown', resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      if (sessionTimeout) clearTimeout(sessionTimeout);
    };
  }, [user]);

  const handleRegister = useCallback(async (fullName, phone, password, email) => {
    setError(null);
    try {
      const response = await AuthService.register(fullName, phone, password, email);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleLogin = useCallback(async (phone, password) => {
    setError(null);
    try {
      const response = await AuthService.login(phone, password);
      if (response.requiresOTP) {
        return response; // Handle OTP verification
      }
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleVerifyOTP = useCallback(async (userId, otpCode) => {
    setError(null);
    try {
      const response = await AuthService.verifyOTP(userId, otpCode);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleResendOTP = useCallback(async (userId) => {
    setError(null);
    try {
      return await AuthService.resendOTP(userId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleLogout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setError(null);
  }, []);

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    register: handleRegister,
    login: handleLogin,
    verifyOTP: handleVerifyOTP,
    resendOTP: handleResendOTP,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
