import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { apiURL } from '../../config/Config'; // Adjust the import path based on your project structure

const Verify = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Extract token from URL path
    const path = window.location.pathname;
    const tokenFromPath = path.split('/').pop();
    setToken(tokenFromPath);
  }, []);

  // Handle verification
  const handleVerification = async () => {
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Token is missing from the URL. Please try again.',
      }).then(() => {
        navigate('/'); // Redirect to home or another page
      });
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      const response = await axios.get(`${apiURL}/front/customer/verify_account_token/`+ token );
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Verified!',
          text: 'You have successfully verified your account.',
        }).then(() => {
          navigate('/user-login'); // Redirect to login page after successful verification
        });
      }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred. Please try again.';
        Swal.fire({
            title: 'Error!',
            text:  errorMessage,
            icon: 'error',
            confirmButtonText: 'OK'
          });
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div style={styles.container}>
      <p style={styles.text}>Click the button below to verify your account:</p>
      <button
        type="button"
        onClick={handleVerification}
        className="bg-blue h-40px ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn d-inline-block ls-05px"
        disabled={loading} // Disable button while loading
      >
        {loading ? 'Verifying...' : 'Verify Account'}
      </button>
    </div>
  );
};

// Basic styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f2f3f6',
  },
  text: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
};

export default Verify;
