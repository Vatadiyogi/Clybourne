import logo from "../../assets/finimg/logo.png";
import goldenlogo from "../../assets/finimg/logo-golden.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from "react-router-dom";
import './Navbar.css';
import React, { useState } from 'react';



const Navbar = () => {

    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear(); // Clear all data from localStorage
        window.location.href = '/user-login';
    };
    // State to control the entire navbar collapse
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);

    // Initial dropdown state, all set to closed
    const initialDropdownState = {
        myAccount: true,
        product: false,
    };

    // State to control each dropdown’s visibility
    const [dropdownOpen, setDropdownOpen] = useState(initialDropdownState);

    // Toggle the main navbar visibility
    const toggleNavbar = () => {
        setIsNavbarCollapsed(!isNavbarCollapsed);
    };

    // Close navbar when any link is clicked and reset dropdowns
    const closeNavbar = () => {
        setIsNavbarCollapsed(true);
        setDropdownOpen(initialDropdownState); // Reset dropdowns
    };

    // Toggle individual dropdown menus
    const toggleDropdown = (dropdownName) => {
        setDropdownOpen((prevState) => ({
            ...prevState,
            [dropdownName]: !prevState[dropdownName],
        }));
    };


    return (
        <>
            <header>
                <nav className="navbar navbar-expand-lg mini-header position-relative">
                    <div className="container-fluid">
                        <div className="col-auto me-lg-0 me-auto">
                            <Link className="navbar-brand" to="/">
                                <img src={logo} data-at2x={logo} alt="" className="default-logo" width="91"
                                    height="30" />
                                <img src={logo} data-at2x={logo} alt="" className="alt-logo" width="0"
                                    height="0" />
                                <img src={goldenlogo} data-at2x={goldenlogo} alt="" className="mobile-logo"
                                    width="0" height="0" />
                            </Link>
                        </div>
                        <div className="col-auto menu-order position-static">
                            <button
                                className="navbar-toggler float-start"
                                type="button"
                                onClick={toggleNavbar}
                                aria-expanded={!isNavbarCollapsed}
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-line"></span>
                                <span className="navbar-toggler-line"></span>
                                <span className="navbar-toggler-line"></span>
                                <span className="navbar-toggler-line"></span>
                            </button>
                            <div className={`collapse navbar-collapse justify-content-center ${isNavbarCollapsed ? '' : 'show'}`} id="navbarNav">
                                <ul className="navbar-nav">
                                    {/* My Account Dropdown */}
                                    <li className="nav-item dropdown d-none sm-d-block">
                                        <a
                                            href="#!"
                                            className="nav-link my-account-click"
                                            onClick={() => toggleDropdown('myAccount')}
                                        >
                                            My Account
                                        </a>
                                        <i
                                            className={`fa-solid fa-angle-down dropdown-toggle ${dropdownOpen.myAccount ? 'show' : ''}`}
                                            role="button"
                                            aria-expanded={dropdownOpen.myAccount}
                                            onClick={() => toggleDropdown('myAccount')}
                                        ></i>
                                        {dropdownOpen.myAccount && (
                                            <ul className="dropdown-menu menu-li-hover my-account-ul d-block">
                                                <li><Link to="/valuation-form" onClick={closeNavbar}><i class='bi bi-pencil-square me-5px text-blue'></i>New Order</Link></li>
                                                <li><Link to="/orders" onClick={closeNavbar}><i class='bi bi-box-seam me-5px text-blue'></i>My Orders</Link></li>
                                                <li><Link to="/my-plan" onClick={closeNavbar}><i class='bi bi-clipboard-check me-5px text-blue'></i>Plans & Billing</Link></li>
                                                <li><Link to="upgrade-plan" onClick={closeNavbar}><i class='bi bi-box-arrow-up me-5px text-blue'></i>Upgrade Plan</Link></li>
                                                <li><Link to="profile" onClick={closeNavbar}><i class='bi bi-person me-5px text-blue'></i>My Profile</Link></li>
                                                <li><a href="#!" onClick={(e) => { handleLogout(e); closeNavbar(); }}><i class='bi bi-power me-5px text-blue'></i>Logout</a></li>
                                            </ul>
                                        )}
                                    </li>

                                    {/* Other Navbar Links */}
                                    <li className="nav-item"><Link to="/" className="nav-link" onClick={closeNavbar}>Home</Link></li>
                                    <li className="nav-item"><Link to="/about" className="nav-link" onClick={closeNavbar}>About</Link></li>

                                    {/* Product Dropdown */}
                                    <li className="nav-item dropdown simple-dropdown hover-dropdown">
                                        <a
                                            href="#!"
                                            className="nav-link"
                                            onClick={() => toggleDropdown('product')}
                                        >
                                            Product
                                        </a>
                                        <i
                                            className={`fa-solid fa-angle-down dropdown-toggle ${dropdownOpen.product ? 'show' : ''}`}
                                            role="button"
                                            aria-expanded={dropdownOpen.product}
                                            onClick={() => toggleDropdown('product')}
                                        ></i>
                                        {dropdownOpen.product && (
                                            <ul className="dropdown-menu menu-li-hover">
                                                <li><Link to="/how-it-works" onClick={closeNavbar}>How it works</Link></li>
                                                <li><a href="#!" onClick={closeNavbar}>Finance planning</a></li>
                                                <li><a href="#!" onClick={closeNavbar}>Wealth management</a></li>
                                                <li><a href="#!" onClick={closeNavbar}>Strategic planning</a></li>
                                                <li><a href="#!" onClick={closeNavbar}>Audit assurance</a></li>
                                            </ul>
                                        )}
                                    </li>

                                    <li className="nav-item"><Link to="/team" className="nav-link" onClick={closeNavbar}>Team</Link></li>
                                    <li className="nav-item"><Link to="/pricing" className="nav-link" onClick={closeNavbar}>Pricing</Link></li>
                                    <li className="nav-item"><Link to="/blog" className="nav-link" onClick={closeNavbar}>Blog</Link></li>
                                    <li className="nav-item"><Link to="/contact" className="nav-link" onClick={closeNavbar}>Contact</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-auto text-end d-flex">
                            <div className="header-icon lh-1">
                                <div className="header-button fs-16">Hi, {localStorage.getItem('name')}</div>
                            </div>
                            {role && role !== 'admin' &&
                                <div className="header-icon lh-1 ms-15px">
                                    <li className="nav-item dropdown simple-dropdown list-unstyled">
                                        <a href="#!" className="text-white lh-1 text-golden-hover dropdown-toggle new-class" id="navbarDropdownMenuLink_1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="bi bi-person-circle m-0"></i>
                                        </a>
                                        <ul className="dropdown-menu end-0 m-0 ps-10px pt-0 pe-10px pb-15px fs-12 box-shadow sm-d-none" aria-labelledby="navbarDropdownMenuLink" style={{ minWidth: '130px', 'left': '-60.7969px' }} >
                                            <li className="mt-15px">
                                                <Link to="/valuation-form" className="text-golden-hover">
                                                    <i class='bi bi-pencil-square me-5px text-blue'></i>New Order
                                                </Link>
                                            </li>
                                            <div className="divider-style-03 divider-style-03-01 mt-10px mb-10px w-100" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}></div>
                                            <li className="mt-10px">
                                                <Link to="/orders" className="text-golden-hover">
                                                    <i class='bi bi-box-seam me-5px text-blue'></i>My Orders
                                                </Link>
                                            </li>
                                            <div className="divider-style-03 divider-style-03-01 mt-10px mb-10px w-100" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}></div>
                                            <li className="mt-10px">
                                                <Link to="/my-plan" className="text-golden-hover">
                                                    <i class='bi bi-clipboard-check me-5px text-blue'></i>Plans & Billing
                                                </Link>
                                            </li>
                                            <div className="divider-style-03 divider-style-03-01 mt-10px mb-10px w-100" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}></div>
                                            <li className="mt-10px">
                                                <Link to="upgrade-plan" className="text-golden-hover">
                                                    <i class='bi bi-box-arrow-up me-5px text-blue'></i>Upgrade Plan
                                                </Link>
                                            </li>
                                            <div className="divider-style-03 divider-style-03-01 mt-10px mb-10px w-100" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}></div>
                                            <li className="mt-10px">
                                                <Link to="profile" className="text-golden-hover">
                                                    <i class='bi bi-person me-5px text-blue'></i>My Profile
                                                </Link>
                                            </li>
                                            <div className="divider-style-03 divider-style-03-01 mt-10px mb-10px w-100" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}></div>
                                            <li className="mt-10px">
                                                <a href="#!" onClick={handleLogout} className="text-golden-hover">
                                                    <i class='bi bi-power me-5px text-blue'></i>Logout
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </div>
                            }
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Navbar;
