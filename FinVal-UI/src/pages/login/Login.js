import React, {useEffect, useRef} from 'react';
import anime from 'animejs';
import banner from '../../assets/finimg/banner2.png';
import LoginPassword from './LoginPassword';
import LoginOtp from './LoginOtp';
import './Login.css';

const Login = () => {
    const bannerStyle = {
        backgroundImage: `url(${banner})`,
    };  
    
    const elementRef1 = useRef(null);
    const elementRef2 = useRef(null);

      
    useEffect(() => {
        // Multiple animations
    anime.timeline()
        .add({
        targets: elementRef1.current,
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutQuad',
        stagger: 200 // Stagger effect with delay between each element
        })
        .add({
            targets: elementRef2.current,
            translateY: [30, 0],
            opacity: [0, 1],
            duration: 600,
            easing: 'easeOutQuad',
            stagger: 300 // Stagger effect with delay between each element
        })
    }, []);

  return (
    <>
      <section className="page-title-parallax-background bg-dark-gray half-section ipad-top-space-margin d-none" data-parallax-background-ratio="0.5" style={bannerStyle}>
            <div className="opacity-extra-medium bg-gradient-fin-val-blue"></div>
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-12 text-center position-relative">
                        <div className="d-flex flex-column h-100px">
                            <div className="mt-auto" ref={elementRef1}>
                                <h1 className="text-white mb-0 text-shadow-extra-large fw-600 ls-minus-1px fs-50">Sign In</h1>
                            </div>
                            {/* <!-- start breadcrumb --> */}
                            <div className="mt-auto justify-content-center breadcrumb breadcrumb-style-01 alt-font text-white">
                                <ul ref={elementRef1}>
                                    <li><a href="index.html" className="text-white">Home</a></li>
                                    <li>Sign In</li>
                                </ul>
                            </div>
                            {/* <!-- end breadcrumb --> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="position-relative bg-white">
            <div className="container"  ref={elementRef2}>
                <div className="row mb-0 d-none">
                    <div className="col text-center">
                        <h2 className="fs-50 text-dark-gray fw-600 ls-minus-1px">Welcome back!</h2>
                    </div>
                </div>
                <div className="row align-items-center justify-content-center position-relative z-index-1">
                    <div className="col-xl-5 col-md-5">    
                        {/* <!-- start form --> */}
                        <LoginPassword />
                        <div className="col-12">
                            <div className="form-results mt-20px d-none"></div>
                        </div>
                    </div>
                    <div className="col-xl-2 col-md-2 text-center divider-style-01 mb-7 mt-7">
                        <div className="d-flex justify-content-center">
                            <div className="divider-shadow d-flex align-items-center w-100">
                                <span className="d-flex flex-column justify-content-center bg-white w-70px h-70px box-shadow rounded-circle fw-900 text-blue">OR</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-5 col-md-5">
                        <LoginOtp /> 
                        {/* <!-- end form --> */}
                    </div>
                </div>
            </div>
        </section>
    </>
  );
};

export default Login;
