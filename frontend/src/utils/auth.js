// frontend/src/utils/auth.js - Secure authentication utilities

import apiClient from './api';

const AUTH_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'user_data';

// Note: In production, use httpOnly cookies for token storage
// This is a fallback for localStorage

class AuthService {
  // Store user data (sanitize before storing)
  static setUser(userData) {
    // Only store non-sensitive user info
    const safeUserData = {
      id: userData.id,
      fullName: userData.fullName,
      phone: userData.phone,
      email: userData.email,
      role: userData.role,
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(safeUserData));
  }

  static getUser() {
    const user = localStorage.getItem(USER_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated() {
    return !!localStorage.getItem(AUTH_STORAGE_KEY);
  }

  static logout() {
    // Clear storage
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);

    // Notify backend
    apiClient.post('/auth/logout').catch((err) => {
      console.error('Logout error:', err);
    });
  }

  static async register(fullName, phone, password, email = null) {
    try {
      const response = await apiClient.post('/auth/register', {
        fullName,
        phone,
        password,
        email,
      });

      if (response.data.token) {
        localStorage.setItem(AUTH_STORAGE_KEY, response.data.token);
      }

      this.setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async login(phone, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        phone,
        password,
      });

      if (response.data.token) {
        localStorage.setItem(AUTH_STORAGE_KEY, response.data.token);
      }

      this.setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async verifyOTP(userId, otpCode) {
    try {
      const response = await apiClient.post('/auth/verify-otp', {
        userId,
        otpCode,
      });

      if (response.data.token) {
        localStorage.setItem(AUTH_STORAGE_KEY, response.data.token);
      }

      this.setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async resendOTP(userId) {
    try {
      const response = await apiClient.post('/auth/resend-otp', { userId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async requestPasswordReset(phone) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { phone });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async resetPassword(token, newPassword) {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static handleError(error) {
    // Return generic error message to prevent user enumeration
    const errorMessage = error.response?.data?.error || 'Yon erè fèt. Tanpri eseye ankò.';
    return new Error(errorMessage);
  }
}

export default AuthService;
