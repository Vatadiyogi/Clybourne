// src/components/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from '../App';
import { PublicRoute } from './PublicRoute';

const AppRoutes = ({ routes }) => {
  return (
    <Routes>
      {routes.map((route, index) => {
        const Component = route.component;
        return (
          <Route
            key={index}
            path={route.path}
            element={
              route.private ? (
                <PrivateRoute allowedRoles={route.allowedRoles}>
                  <Component />
                </PrivateRoute>
              ) : (
                <PublicRoute>
                  <Component />
                </PublicRoute>
              )
            }
          />
        );
      })}
    </Routes>
  );
};

export default AppRoutes;
