import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';

// A component to handle redirection based on auth status
const AuthRedirect = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // If isAuthenticated is a boolean, use it directly:
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// AppRoutes component to handle all routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        <AuthRedirect>
          <Navigate to="/login" replace />
        </AuthRedirect>
      } />
      
      <Route path="/login" element={
        <AuthRedirect>
          <Login />
        </AuthRedirect>
      } />
      
      <Route path="/register" element={
        <AuthRedirect>
          <Register />
        </AuthRedirect>
      } />

      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        
        {/* Redirect any other route to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
