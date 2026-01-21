import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import logo from "../assets/finimg/logo.png";
import goldenlogo from "../assets/finimg/logo-golden.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Auth/Navbar.css';

const Navbar = () => {
    useEffect(() => {
        const navLinks = document.querySelectorAll(".new-nav-link");
        const navbarCollapse = document.querySelector(".collapse.navbar-collapse");
    
        navLinks.forEach((link) => {
          link.addEventListener("click", () => {
            if (navbarCollapse) {
                navbarCollapse.classList.remove("show");
            }
          });
        });
    
        // Cleanup listeners when the component unmounts
        return () => {
          navLinks.forEach((link) => {
            link.removeEventListener("click", () => {
              if (navbarCollapse) {
                navbarCollapse.classList.remove("show");
              }
            });
          });
        };
      }, []);
    
  return (
    <>
        <header>
            <nav className="navbar navbar-expand-lg mini-header position-relative">
                <div className="container-fluid"> 
                    <div className="col-auto me-lg-0 me-auto">
                        <Link className="navbar-brand" to="/">
                            <img src={logo} data-at2x={logo} alt="" className="default-logo"/>
                            <img src={logo} data-at2x={logo} alt="" className="alt-logo"/>
                            <img src={goldenlogo} data-at2x={goldenlogo} alt="" className="mobile-logo" />
                        </Link>
                    </div>
                    <div className="col-auto menu-order position-static">
                        <button className="navbar-toggler float-start" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-line"></span>
                            <span className="navbar-toggler-line"></span>
                            <span className="navbar-toggler-line"></span>
                            <span className="navbar-toggler-line"></span>
                        </button>
                        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                            <ul className="navbar-nav alt-font"> 
                                <li className="nav-item"><a href="/" className="nav-link  new-nav-link">Home</a></li>
                                <li className="nav-item"><Link to="/about" className="nav-link  new-nav-link">About</Link></li>
                                <li className="nav-item dropdown simple-dropdown hover-dropdown">
                                    <a href="#!" className="nav-link">Product</a>
                                    <i className="fa-solid fa-angle-down dropdown-toggle" id="navbarDropdownMenuLink_1" role="button" aria-expanded="false"></i>
                                    <ul className="dropdown-menu menu-li-hover" aria-labelledby="navbarDropdownMenuLink">
                                        <li><Link to="/how-it-works" className="text-base-color new-nav-link">How it works</Link></li>
                                        <li><a href="#!" className="text-base-color">Finance planning</a></li>
                                        <li><a href="#!" className="text-base-color">Wealth management</a></li>
                                        <li><a href="#!" className="text-base-color">Strategic planning</a></li>
                                        <li><a href="#!" className="text-base-color">Audit assurance</a></li>
                                    </ul>
                                </li>
                                <li className="nav-item"><Link to="/team" className="nav-link  new-nav-link">Team</Link></li>
                                <li className="nav-item"><Link to="/pricing" className="nav-link  new-nav-link">Pricing</Link></li>
                                <li className="nav-item"><Link to="/blog" className="nav-link  new-nav-link">Blog</Link></li>
                                <li className="nav-item"><Link to="/contact" className="nav-link  new-nav-link">Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-auto text-end d-none d-xs-flex d-sm-flex"> 
                        <div className="header-icon lh-1">
                            <div className="header-button">
                                <Link to="/pricing" className="btn text-transform-none golden-btn lh-1"><i className="feather icon-feather-shopping-bag m-0"></i> BUY NOW</Link>
                            </div>
                        </div>&nbsp;
                        <div className="header-icon lh-1">
                            <div className="header-button">
                                <Link to="/user-login" className="btn text-transform-none golden-btn lh-1"><i className="bi bi-person-circle m-0"></i> LOGIN</Link>
                            </div>
                        </div>
                        {/* <div className="header-icon lh-1 ms-15px">
                            <Link to="/user-login" className="text-white lh-1 text-golden-hover"><i className="bi bi-person-circle m-0"></i></Link>
                        </div> */}
                    </div>
                </div>
            </nav>
        </header>
    </>
  );
};

export default Navbar;
