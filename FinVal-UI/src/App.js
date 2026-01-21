// src/App.js
import React, { Suspense  } from 'react';
import { BrowserRouter as Router, Navigate } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import routes from './routes/Route';
import CommonLayout from './common/CommonLayout';
import Loader from './common/Loader';

export const PrivateRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Assuming user role is stored in localStorage
  
  if (!isAuthenticated) {
    return <Navigate to="/user-login" />;
  }

  // Check if the user's role is in the allowedRoles list
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/not-authorised" />; // Navigate to an unauthorized page or any fallback
  }

  return children;
};

const App = () => {


  return (
    <Router>
      <CommonLayout>
        <Suspense fallback={<div><Loader/></div>}>
          <AppRoutes routes={routes} />
        </Suspense>
      </CommonLayout>
    </Router>
  );
};

export default App;
