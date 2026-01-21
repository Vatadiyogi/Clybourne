import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from '../App';

const AppRoutes = ({ routes }) => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            route.private ? (
              <PrivateRoute>
                  <route.component />
              </PrivateRoute>
            ) : (
                <route.component />
            )
          }
        />
      ))}
    </Routes>
  );
};

export default AppRoutes;
