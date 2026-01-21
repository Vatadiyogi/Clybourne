import { Link } from "react-router-dom";
import logo from "../assets/finimg/logo-blue.png";

const Footer = () => {
    return (
      <>
      <footer className="footer-light pt-60px pb-50px bg-footer-new" style={{"backgroundColor":"#e1eafcb5"}}>
        <div className="container">
            <div className="row justify-content-center ">
                <div className="col-md-12 col-sm-10 text-center">
                    <h4 className="alt-font text-base-color fw-500 ls-minus-1px mb-4 margin-6px">Looking for fair valuation report? <Link
                            to="/pricing" className=" fw-500 " style={{"color": "#4ea8f6"}}>Buy Now</Link></h4>
                </div>
            </div>
            <div className="row justify-content-center">
                <div
                    className="col-lg-3 col-md-12 col-sm-6 order-4 order-lg-1 order-md-4 order-sm-3 md-mt-35px text-center text-sm-start text-md-center text-lg-start last-paragraph-no-margin">
                    <Link to="/" className="footer-logo mb-25px sm-mb-20px d-inline-block"><img
                            src={logo} data-at2x={logo} alt=""/></Link>
                    <p className="mb-15px text-base-color fs-16 lh-28">We are trusted by more than 5000 very happy clients for
                        finance
                        services.</p>
                    <p className="text-base-color">&copy; Copyright 2024 <Link to="/" className="fw-700 fs-22"
                            style={{"color": "#4ea8f6"}}>FinVal</Link></p>
                </div>
                <div className="col-6 col-xl-2 col-lg-3 col-md-4 offset-xl-1 order-1 order-lg-2">
                    <span className="alt-font fw-500 fs-22 d-block text-dark-gray mb-10px margin-8px"
                        style={{"color": "#4ea8f6"}}>Company</span>
                    <ul>
                        <li><Link to="/about" className="text-base-color fs-16 lh-28 hover-sky-blue">About Us</Link></li>
                        <li><Link to="/team" className="text-base-color fs-16 lh-28 hover-sky-blue">Our Team</Link></li>
                        <li><Link to="/pricing" className="text-base-color fs-16 lh-28 hover-sky-blue">Pricing</Link></li>
                        <li><Link to="/blog" className="text-base-color fs-16 lh-28 hover-sky-blue">Blog</Link></li>
                        <li><Link to="/contact" className="text-base-color fs-16 lh-28 hover-sky-blue">Contact Us</Link></li>
                    </ul>
                </div>
                <div className="col-6 col-xl-2 col-lg-3 col-md-4 order-2 order-lg-3">
                    <span className="alt-font fw-500 fs-22 d-block mb-10px margin-8px" style={{"color": "#4ea8f6"}}>Product</span>
                    <ul>
                        <li><Link to="/how-it-works" className="text-base-color fs-16 lh-28 hover-sky-blue">How It Works</Link></li>
                        <li><Link to="/" className="text-base-color fs-16 lh-28 hover-sky-blue">Finance Planning</Link></li>
                        <li><Link to="/" className="text-base-color fs-16 lh-28 hover-sky-blue">Wealth Management</Link></li>
                        <li><Link to="/" className="text-base-color fs-16 lh-28 hover-sky-blue">Strategic Planning</Link></li>
                        <li><Link to="/" className="text-base-color fs-16 lh-28 hover-sky-blue">Audit Assurance</Link></li>
                    </ul>
                </div>
                <div
                    className="col-lg-3 col-md-4 col-sm-6 offset-xl-1 order-3 order-lg-4 order-md-3 order-sm-4 sm-mt-35px xs-mt-25px text-center text-sm-start">
                    <span className="alt-font fw-500 fs-22 d-block  mb-10px margin-8px" style={{"color": "#4ea8f6"}}>Subscribe
                        newsletter</span>
                    <p className="mb-30px md-mb-20px sm-mb-15px text-base-color fs-16 lh-28">Subscribe our newsletter to get the
                        latest news
                        and updates.</p>
                    <div className="d-inline-block w-100 newsletter-style-02 position-relative">
                        <form action="email-templates/subscribe-newsletter.php" method="post"
                            className="position-relative w-100">
                            <input
                                className="bg-white border-color-white w-100 form-control required box-shadow-double-large "
                                type="email" name="email" placeholder="Enter your email" style={{"fontSize": "16px"}}/>
                            <input type="hidden" name="redirect" value="" className="fs-16"/>
                            <button className="btn submit" aria-label="submit"><i
                                    className="icon feather icon-feather-mail fs-22 " style={{"color": "#4ea8f6"}}></i></button>
                            <div
                                className="form-results border-radius-4px pt-5px pb-5px ps-15px pe-15px fs-14 lh-22 mt-10px w-100 text-center position-absolute d-none lh-20">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </footer>
      </>
    );
  };
  
  export default Footer;
  