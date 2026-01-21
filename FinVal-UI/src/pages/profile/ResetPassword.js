import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../../common/Loader'; // Assuming you have a Loader component
import { apiURL } from '../../config/Config'; // Assuming the base API URL is defined in Config
import Swal from 'sweetalert2';

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false); // Control form visibility
    const [formData, setFormData] = useState({
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({}); // Track input errors

    const token = localStorage.getItem('token'); // Get the token from localStorage

    const sendOtp = async () => {
        try {
            setLoading(true);
            await axios.post(`${apiURL}/front/customer/change_password_otp`, {}, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setOtpSent(true); // Show the form after OTP is sent
        } catch (error) {
            console.error('Error sending OTP:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.otp) newErrors.otp = 'OTP is required';
        if (!formData.newPassword) newErrors.newPassword = 'New password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
        if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${apiURL}/front/customer/reset_password`, formData, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if(response.status){
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Password Updated Successfully',
                  }).then(() => {
                    // Refresh the page after success
                    window.location.reload();
                });
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong.Please try again.',
                });
            }
            // Reset success - handle success UI here, if needed
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong.Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="resetLoginPassword" className="zoom-anim-dialog p-0 contact-form-style-01 position-relative text-center col-xl-4 col-lg-6 col-md-8 col-12 mx-auto text-center">
            <div className="p-30px bg-white">
                <p className="fs-18 fw-600 mb-10">Reset Login Password</p>
                <span className="fs-14 lh-22 d-block mb-15px">Please enter the security code sent to your email</span>
                
                {loading && <Loader />} {/* Show loader when loading */}
                
                {!otpSent && !loading && (
                    <button onClick={sendOtp} className="btn btn-large btn-round-edge bg-blue submit text-white w-100 fin-btn">
                        Send Verification Code
                    </button>
                )}

                {otpSent && (
                    <form onSubmit={handleSubmit}>
                        <div className="position-relative form-group mb-20px">
                            <span className="form-icon"><i className="bi bi-chat-square-dots"></i></span>
                            <input 
                                type="text" 
                                name="otp" 
                                className="form-control" 
                                placeholder="Enter security code*" 
                                value={formData.otp} 
                                onChange={handleInputChange} 
                                
                            />
                            {errors.otp && <span className="error-text">{errors.otp}</span>}
                        </div>
                        <div className="position-relative form-group mb-20px">
                            <span className="form-icon"><i className="bi bi-lock"></i></span>
                            <input 
                                type="password" 
                                name="newPassword" 
                                className="form-control" 
                                placeholder="Enter new password*" 
                                value={formData.newPassword} 
                                onChange={handleInputChange} 
                                
                            />
                            {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
                        </div>
                        <div className="position-relative form-group mb-20px">
                            <span className="form-icon"><i className="bi bi-file-lock"></i></span>
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                className="form-control" 
                                placeholder="Re-enter new password*" 
                                value={formData.confirmPassword} 
                                onChange={handleInputChange} 
                                
                            />
                            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                        </div>
                        <div className="position-relative form-group form-textarea">
                            <button className="btn btn-large btn-round-edge bg-blue submit text-white w-100 fin-btn" type="submit" disabled={loading}>
                                <span>
                                    <span><i className="bi bi-repeat align-middle"></i></span>
                                    <span className="btn-double-text align-middle">Reset Login Password</span>
                                </span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
