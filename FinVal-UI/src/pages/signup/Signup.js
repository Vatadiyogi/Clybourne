import React, {useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import banner from '../../assets/finimg/banner2.png';
import SignUpForm from './SignUpForm';
import './Signup.css';

const Signup = () => {
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

  return(
    <>
        {/* <section className="page-title-parallax-background bg-dark-gray half-section ipad-top-space-margin" data-parallax-background-ratio="0.5"  style={bannerStyle} >
            <div className="opacity-extra-medium bg-gradient-fin-val-blue"></div>
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-12 text-center position-relative">
                        <div className="d-flex flex-column h-100px">
                            <div className="mt-auto" ref={elementRef1}>
                                <h1 className="text-white mb-0 text-shadow-extra-large fw-600 ls-minus-1px fs-50">Sign Up</h1>
                            </div>
                            <div className="mt-auto justify-content-center breadcrumb breadcrumb-style-01 alt-font text-white">
                                <ul  ref={elementRef1}>
                                    <li><Link to="/" className="text-white">Home</Link></li>
                                    <li>Sign Up</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section> */}
        {/* <!-- end page title --> */}
        {/* <!-- start section --> */}
        <section className="position-relative bg-white">
            <div className="container" ref={elementRef2}>
                <div className="row align-items-center justify-content-center position-relative z-index-1">
                    <div className="col-xl-8 col-md-8">
                        <SignUpForm />
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default Signup;