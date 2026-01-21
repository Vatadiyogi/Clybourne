import React, { useState } from 'react';
import axios from 'axios'; // Or import axiosInstance if using a custom instance
import { apiURL } from '../../config/Config';
import Swal from 'sweetalert2';

const LoginPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const validateForm = () => {
        let isValid = true;
        setEmailError('');
        setPasswordError('');
        setGeneralError('');

        if (!email) {
            setEmailError('Email is required.');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Email is invalid.');
            isValid = false;
        }

        if (!password) {
            setPasswordError('Password is required.');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await axios.post(apiURL + '/front/customer/login', { email, password });
            // Handle successful response, e.g., store token, redirect
            if(response.data.status === true){
                const token = response.data.data.token;
                const name = response.data.data.user.first_name;

                // Store token and name in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('name', name);
                localStorage.setItem('role', 'user');

                const selectedPlan = localStorage.getItem('selectedPlan');
                if (selectedPlan) {
                    window.location.href = '/checkout'; // Redirect to checkout page after verification
                } else {
                    // Navigate to the dashboard
                    window.location.href = response.data.data.navigate;
                }
            }else if(response.data.status === 'alert'){
                Swal.fire({
                    icon: 'warning', // Make sure to use a valid icon, e.g., 'warning' instead of 'alert'
                    title: 'Account Verification Pending',
                    text: response.data.message,
                });
            }else{
                setGeneralError(response.data.message);
            }
        } catch (err) {
            setGeneralError(err.response.data.message);
        }finally{
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="row contact-form-style-02 bg-very-light-gray border-radius-10px p-10 pt-5">
            <div className="col-md-12 text-center">
                <h6 className="alt-font text-dark-gray fw-600 ls-minus-1px">Login with password</h6>
            </div>
            <div className="col-md-12 mb-30px">
                <input
                    className={`border-radius-4px border-color-white box-shadow form-control required ${emailError ? 'border-red' : ''}`}
                    type="email"
                    name="email"
                    placeholder="Email*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <div className="text-danger mt-1">{emailError}</div>}
            </div>
            <div className="col-md-12 mb-30px">
                <input
                    className={`input-name border-radius-4px border-color-white box-shadow-double-large form-control required ${passwordError ? 'border-red' : ''}`}
                    type="password"
                    name="password"
                    placeholder="Password*"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && <div className="text-danger mt-1">{passwordError}</div>}
            </div>
            {generalError && <div className="col-md-12 text-center text-danger">{generalError}</div>}
            <div className="col-md-12 text-center sm-mt-20px">
                <button className="btn btn-large btn-round-edge bg-blue submit text-white w-100 fin-btn" type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <span>
                            <span><i className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i></span>
                            <span className="btn-double-text ms-3px" data-text="Signing In...">Signing In...</span>
                        </span>
                    ) : (
                        <span>
                            <span><i className="bi bi-lock"></i></span>
                            <span className="btn-double-text ms-3px" data-text="Sign In">Sign In</span>
                        </span>
                    )}
                </button>
            </div>
        </form>
    );
};

export default LoginPassword;
