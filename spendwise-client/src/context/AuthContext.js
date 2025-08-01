import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token for axios requests and fetch user data on mount
  useEffect(() => {
    if (token) {
      // Set the auth token for all axios requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user data and transactions
      const fetchUserData = async () => {
        try {
          // Fetch user profile
          const [userResponse, transactionsResponse] = await Promise.all([
            api.get('/users/me'),
            api.get('/transactions')
          ]);
          
          setUser(userResponse.data);
          setTransactions(transactionsResponse.data);
          setError(null);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to load user data');
          
          // If token is invalid, clear it
          if (error.response?.status === 401) {
            logout();
          }
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserData();
    } else {
      // Clear auth header if no token
      delete api.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);
  
  // Function to refresh transactions
  const refreshTransactions = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
      return response.data;
    } catch (error) {
      console.error('Error refreshing transactions:', error);
      setError('Failed to refresh transactions');
      throw error;
    }
  }, [token]);

  // Register new user
  const register = async (userData) => {
    try {
      // Remove confirmPassword before sending to the server
      const { confirmPassword, ...registrationData } = userData;
      
      const response = await api.post('/users/register', registrationData);
      const { token, user: userDataResponse } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userDataResponse);
      
      // Fetch transactions after successful registration
      await refreshTransactions();
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await api.post('/users/login', { 
        email, 
        password 
      });
      
      const { token, user: userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);
      
      // Fetch transactions after successful login
      await refreshTransactions();
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setTransactions([]);
    setError(null);
  };

  // Add a new transaction
  const addTransaction = async (transactionData) => {
    try {
      const response = await api.post('/transactions', transactionData);
      await refreshTransactions();
      return response.data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update a transaction
  const updateTransaction = async (id, transactionData) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      await refreshTransactions();
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      await refreshTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/auth/update-profile', userData);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put('http://localhost:5000/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  // Check if user is authenticated with token validation
  const isAuthenticated = useCallback(() => {
    if (!token) return false;
    
    // Check if token is expired
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false; // Invalid JWT format
      
      const payload = JSON.parse(atob(tokenParts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < now) {
        // Token expired, log out the user
        logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }, [token, logout]);

  const value = {
    user,
    token,
    transactions,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;
