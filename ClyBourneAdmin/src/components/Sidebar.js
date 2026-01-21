import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/images/logo.svg";
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const role = localStorage.getItem('role');

    const isActive = (path) => location.pathname === path;

    return (
        <div className="sidebar-wrapper sidebar-theme">
            <nav id="sidebar">
                <div className="navbar-nav theme-brand flex-row text-center">
                    <div className="nav-logo">
                        <div className="nav-item theme-logo">
                            <Link to="/">
                                <img src={logo} className="navbar-logo" alt="logo" />
                            </Link>
                        </div>
                    </div>
                    <div className="nav-item sidebar-toggle">
                        <div className="btn-toggle sidebarCollapse">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevrons-left">
                                <polyline points="11 17 6 12 11 7"></polyline>
                                <polyline points="18 17 13 12 18 7"></polyline>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="shadow-bottom"></div>
                <ul className="list-unstyled menu-categories" id="accordionExample">
                    <li className={`menu ${isActive('/dashboard') ? 'active' : ''}`}>
                        <Link to="/dashboard" aria-expanded="false" className="dropdown-toggle">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                <span>Dashboard</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`menu ${isActive('/orders') ? 'active' : ''}`}>
                        <Link to="/orders" aria-expanded="false" className="dropdown-toggle">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                <span>All Reports Orders</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`menu ${isActive('/customers') ? 'active' : ''}`}>
                        <Link to="/customers" aria-expanded="false" className="dropdown-toggle">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span>Customers</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`menu ${isActive('/customer-plans') ? 'active' : ''}`}>
                        <Link to="/customer-plans" aria-expanded="false" className="dropdown-toggle">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span>Customer Plans</span>
                            </div>
                        </Link>
                    </li>
                    <li className={`menu ${isActive('/billings') ? 'active' : ''}`}>
                        <Link to="/billings" aria-expanded="false" className="dropdown-toggle">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign">
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                                <span>Billings</span>
                            </div>
                        </Link>
                    </li>
                    { role === 'SuperAdmin' && 
                    <li className={`menu ${isActive('/user-management') ? 'active' : ''}`}>
                        <Link to="/user-management" aria-expanded="false" className="dropdown-toggle">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span>Admin Users</span>
                            </div>
                        </Link>
                    </li>
                    }
                    <li className="menu">
                        <Link to="#invoice" data-bs-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-airplay">
                                    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
                                    <polygon points="12 15 17 21 7 21 12 15"></polygon>
                                </svg>
                                <span>Setup</span>
                            </div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </div>
                        </Link>
                        <ul className="submenu list-unstyled" id="invoice">
                            <li  className={`menu ${isActive('/parameters') ? 'active' : ''}`}>
                                <Link to="/parameters"> Parameters </Link>
                            </li>
                            <li  className={`menu ${isActive('/plans') ? 'active' : ''}`}>
                                <Link to="/plans"> All Plans </Link>
                            </li>
                            <li  className={`menu ${isActive('/holiday-list') ? 'active' : ''}`}>
                                <Link to="/holiday-list"> Holiday List </Link>
                            </li>   
                            <li  className={`menu ${isActive('/email-templates') ? 'active' : ''}`}>
                                <Link to="/email-templates"> Email Templates </Link>
                            </li>                       
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
