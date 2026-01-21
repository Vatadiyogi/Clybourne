import React, {useEffect} from 'react';
import Layout from '../components/Layout/Layout';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Auth/Sidebar';
import AuthNavbar from '../components/Auth/Navbar';
import routes from '../routes/Route';
import axios from 'axios';
import { apiURL } from '../config/Config';

const CommonLayout = ({ children }) => {
  const isLoggedIn = localStorage.getItem('token') !== null; 
  const location = useLocation();
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  // Check if the current path is a private route
  const isPrivate = routes.some(route => {
    // Use matchPath to match the current path with the route definition
    return matchPath(route.path, location.pathname) && route.private;
  });

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Call your API to validate the token
          const response = await axios.get(apiURL + '/front/customer/verify-token', {
            headers: {
              Authorization: `${token}`,
            },
          });
          if (response.status !== 200) {
            localStorage.clear();
            navigate('/'); // Redirect to login page
          }
        } catch (error) {
          // Token is invalid, handle error
          localStorage.clear();
          navigate('/'); // Redirect to login page
        }
      }
    };

    checkToken();
  }, [navigate]);

  return (
    <Layout>
      {isLoggedIn ? (
        // For logged-in users
        isPrivate ? (
          // For private routes
          role && role !== 'admin' ? (
            // If the user is not an admin, show Sidebar and AuthNavbar
            <div className="home">
              <Sidebar />
              <AuthNavbar />
              {children}
            </div>
          ) : (
            // If the user is an admin and trying to access restricted routes
            <>
              <AuthNavbar />
              {children}
            </> // You could return a NotAuthorized component here
          )
        ) : (
          // For public routes (but logged-in users)
          <div>
            <AuthNavbar />
            {children}
          </div>
        )
      ) : (
        // For non-logged-in users
        <>
          <Navbar />
          {children}
          <Footer />
        </>
      )}
    </Layout>
  );
};

export default CommonLayout;
