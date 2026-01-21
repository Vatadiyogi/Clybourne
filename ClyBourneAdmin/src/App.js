// src/App.js

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Navigate } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import routes from './routes/Route';

export const PrivateRoute = ({ children }) => { // Export PrivateRoute
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRoutes routes={routes} isAuthenticated={PrivateRoute} />
      </Suspense>
    </Router>
  );
};

export default App;
