// src/PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

export const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  // return isAuthenticated ? <Navigate to="/dashboard" /> : children;
  return isAuthenticated ? children : children;

};

export default PublicRoute;
