import React, { useState } from 'react';
import axios from 'axios'; // Or import axiosInstance if using a custom instance
import { Link } from 'react-router-dom';
import { apiURL } from '../../config/Config';
import Swal from 'sweetalert2';

const LoginOtp = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [error, setError] = useState('');
    
    const maskEmail = (email) => {
        const [localPart, domain] = email.split('@');
        const maskedLocalPart = localPart[0] + localPart.slice(1, -1).replace(/./g, 'x') + localPart.slice(-1);
        return `${maskedLocalPart}@${domain}`;
    };

    const validateEmail = () => {
        setEmailError('');
        if (!email) {
            setEmailError('Email is required.');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Email is invalid.');
            return false;
        }
        return true;
    };

    const validateOtp = () => {
        setOtpError('');
        if (!otp) {
            setOtpError('OTP is required.');
            return false;
        }
        return true;
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!validateEmail()) return;

        setIsLoading(true);

        try {
            const response = await axios.post(apiURL + '/front/customer/send_otp', { email });
            console.log(response.data.message);
            if(response.data.status === true){
                setIsOtpSent(true);
            }else if(response.data.status === 'alert'){
                Swal.fire({
                    icon: 'warning', // Make sure to use a valid icon, e.g., 'warning' instead of 'alert'
                    title: 'Account Verification Pending',
                    text: response.data.message,
                });
            }else{
                setError('Failed to send OTP. Please try again.');
            }
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
            console.error(err);
        }finally{
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!validateOtp()) return;

        setIsLoading(true);

        try {
            const response = await axios.post(apiURL + '/front/customer/login_with_otp', { email, otp });
            // Handle successful response, e.g., store token, redirect
            const token = response.data.data.userdata.token;
            const name = response.data.data.userdata.user.first_name;

            // Store token and name in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('name', name);
            localStorage.setItem('role', 'user');

            setIsLoading(false);

            const selectedPlan = localStorage.getItem('selectedPlan');
            if (selectedPlan) {
                window.location.href = '/checkout';// Redirect to checkout page after verification
            } else {
                // Navigate to the dashboard
                // console.log(response.data.data.userdata.navigate);
                window.location.href = response.data.data.userdata.navigate;
            }
        } catch (err) {
            setError('OTP verification failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <form className="row contact-form-style-02 bg-very-light-gray border-radius-10px p-10 pt-5">
            <div className="col-md-12 text-center">
                <h6 className="alt-font text-dark-gray fw-600 ls-minus-1px">Login with OTP on Email</h6>
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
            {!isOtpSent ? (
                <div className="col-md-12 text-center sm-mt-20px">
                    <button className="btn btn-large btn-round-edge bg-blue submit text-white w-100 fin-btn" type="submit" onClick={handleSendOtp} disabled={isLoading}>
                        {isLoading ? (
                            <span>
                                <span><i className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i></span>
                                <span className="btn-double-text ms-3px" data-text="Sending...">Sending...</span>
                            </span>
                        ) : (
                            <span>
                                <span><i className="bi bi-envelope-at"></i></span>
                                <span className="btn-double-text ms-3px" data-text="Send OTP on Email">Send OTP on Email</span>
                            </span>
                        )}
                    </button>
                    <span className="fs-14 lh-22 d-block mt-15px">Don't have an account? <Link to="/user-signup" className="text-dark-gray text-decoration-line-bottom fw-500">Sign Up</Link></span>
                </div>
            ) : (
                <div className="col-md-12 mb-30px">
                    <span className="fs-14 lh-22 d-block mb-15px">Please enter the One Time Password sent to Email ID: <span className="text-dark-gray text-decoration-line-bottom fw-700">{maskEmail(email)}</span></span>
                    <input
                        className={`border-radius-4px border-color-white box-shadow form-control required ${otpError ? 'border-red' : ''}`}
                        type="text"
                        name="otp"
                        placeholder="Enter OTP received in email"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    {otpError && <div className="text-danger mt-1">{otpError}</div>}
                    {error && <div className="text-center text-danger">{error}</div>}
                    <br/>
                    <div className="col-md-12 text-center sm-mt-20px">
                        <button className="btn btn-large btn-round-edge bg-blue submit text-white w-100 fin-btn" type="submit" onClick={handleVerifyOtp} disabled={isLoading}>
                            {isLoading ? (
                                <span className="d-flex align-items-center justify-content-center">
                                    <span><i className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i></span>
                                    <span className="btn-double-text ms-5px" data-text="Verifying...">Verifying...</span>
                                </span>
                            ) : (
                                <span className="d-flex align-items-center justify-content-center">
                                    <span><i className="bi bi-patch-check"></i></span>
                                    <span className="btn-double-text ms-5px" data-text="Verify Code & Sign In">Verify Code & Sign In</span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            )}
            <div className="col-12">
                <div className="form-results mt-20px d-none"></div>
            </div>
        </form>
    );
};

export default LoginOtp;
