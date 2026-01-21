import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import { apiURL } from "../../Config";
import logo from "../../assets/images/logo.svg";
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false); // New state for submit loading

    // Function to check if the user is authenticated
    const isAuthenticated = () => {
        return localStorage.getItem('token') !== null;
    };

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/dashboard');
        } else {
            setLoading(false);
        }
    }, [navigate]);

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setError('Email is required');
            return false;
        } else if (!emailRegex.test(email)) {
            setError('Invalid email format');
            return false;
        }
        return true;
    };

    const validatePassword = () => {
        if (!password) {
            setError('Password is required');
            return false;
        } else if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!validateEmail() || !validatePassword()) {
            return;
        }

        setLoadingSubmit(true); // Start loading submit

        const authHash = btoa(`${"PANJADOTCOM"}:${password}`);
        const authHeader = `Basic ${authHash}`;

        try {
            const response = await axios.post(apiURL + 'api/auth/login', { email: email }, {
                headers: {
                    'Authorization': authHeader
                }
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.accessToken);
                localStorage.setItem('user_id', response.data.id);
                localStorage.setItem('name', response.data.name);
                localStorage.setItem('role', response.data.role);
                navigate('/dashboard');
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            setError('Invalid email or password');
        } finally {
            setLoadingSubmit(false); // Stop loading submit
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError('');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Layout page="login">
            <div className="auth-container d-flex">
            <div className="container mx-auto align-self-center">
                    <div className="row">
                        <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-8 col-12 d-flex flex-column align-self-center mx-auto">
                            <div className="card mt-3 mb-3">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-12 col-12">
                                            <div className="mb-4">
                                                <img src={logo} alt="Logo" className="img-fluid centered-img" />
                                            </div>
                                        </div>
                                        <div className="col-md-12 mb-2">
                                            <h2 className="sign-in-heading">Sign In</h2>
                                            <p>Enter your email and password to login</p>
                                            {error && <div className="alert alert-danger">{error}</div>}
                                        </div>
                                        <form onSubmit={handleLogin} className="col-md-12"> {/* Added form tag */}
                                            <div className="mb-3">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={email}
                                                    onChange={handleEmailChange}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label">Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={password}
                                                    onChange={handlePasswordChange}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                {loadingSubmit ? (
                                                    <button className="btn btn-secondary w-100 for-size-padding" disabled>
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        Loading...
                                                    </button>
                                                ) : (
                                                    <button type="submit" className="btn btn-secondary w-100 for-size-padding">
                                                        SIGN IN
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
