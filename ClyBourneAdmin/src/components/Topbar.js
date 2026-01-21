import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profile from '../assets/images/profile.jpg';

const Topbar = () => {
    const name = localStorage.getItem('name');
    const navigate = useNavigate();
    
    const handleLogout = (event) => {
        event.preventDefault();
        // Clear specified items from local storage
        localStorage.removeItem('name');
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        // Redirect to login page
        navigate('/');
    };

    return ( 
        <div className="header-container container-xxl">
            <header className="header navbar navbar-expand-sm expand-header">
                <Link to='/' className="sidebarCollapse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </Link>
                <ul className="navbar-item flex-row ms-lg-auto ms-0">
                    <li className="nav-item dropdown user-profile-dropdown order-lg-0 order-1">
                        <Link to="/dashboard" className="nav-link dropdown-toggle user" id="userProfileDropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <div className="avatar-container">
                                <div className="avatar avatar-sm avatar-indicators avatar-online">
                                    <img alt="avatar" src={profile} className="rounded-circle" />
                                </div>
                            </div>
                        </Link>
                        <div className="dropdown-menu position-absolute" aria-labelledby="userProfileDropdown">
                            <div className="user-profile-section">
                                <div className="media mx-auto">
                                    <div className="emoji me-2">
                                        &#x1F44B;
                                    </div>
                                    <div className="media-body">
                                        <h5>{name}</h5>
                                        <p>Admin User</p>
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown-item">
                                <Link to="/profile">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <span>Profile</span>
                                </Link>
                            </div>
                            <div className="dropdown-item">
                                <Link to="/" onClick={handleLogout}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-log-out">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    <span>Log Out</span>
                                </Link>
                            </div>
                        </div>
                    </li>
                </ul>
            </header>
        </div>
    );
};

export default Topbar;
