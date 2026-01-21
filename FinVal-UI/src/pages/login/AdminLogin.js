import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiURL } from "../../config/Config"; // Make sure to import FRONTEND_URL
import Loader from "../../common/Loader"; // Assuming you have a Loader component
import Swal from "sweetalert2";

const AdminLogin = () => {
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate(); // React Router's navigate hook

  // Frontend auto-login handler
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const orderId = urlParams.get('orderId');
  
    if (token) {
      // API request using axios
      axios.post(`${apiURL}/auth/admin-login`, { token, orderId })
        .then((response) => {
          const data = response.data;
          if (data.status) {
            // Save token to local storage and redirect to the form page
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('role', data.data.role);
            localStorage.setItem('name', data.data.name);

            navigate({
                pathname: `/valuation-form/${orderId}`,
                search: `?step=0`,
            });
          } else {
            Swal.fire('Auto-login failed!');
          }
        })
        .catch((error) => {
          Swal.fire('An error occurred while logging in.');
        })
        .finally(() => {
          setLoading(false); // Stop loading after the request completes
        });
    } else {
      setLoading(false); // Stop loading if no token is found
    }
  }, [navigate]);
  
  // Render the loader while loading is true
  if (loading) {
    return <Loader />;
  }

  // Render nothing once the login is done or failed
  return null;
};

export default AdminLogin;
