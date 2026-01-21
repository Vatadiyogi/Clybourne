import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import banner_change from '../../../assets/finimg/bannner-animate-change2.png';
import { Link } from 'react-router-dom';

const BannerFooter = () => {

    const elementRef4 = useRef(null);
    const elementRef5 = useRef(null);

    useEffect(() => {
        anime.timeline()
        .add({
            targets: elementRef4.current,
            delay: 0,
            duration: 1000,
            easing: 'easeOutQuad',
            opacity: [0, 1],
            willchange: "transform",
            perspective: [1200, 1200],
            translateY: [0, 0],
            scale: [1.1, 1],
            rotateX: [30, 0],
            stagger: 300
        })
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime.timeline()
                        .add({
                            targets: elementRef5.current,
                            delay: 0,
                            duration: 800,
                            easing: 'easeOutQuad',
                            opacity: [0, 1],
                            translateX: [50, 0],
                            stagger: 200
                        });
    
                    observer.unobserve(entry.target); // Unobserve once the animation starts
                }
            });
        });
    
        // Only observe if the elements exist
        if (elementRef4.current) observer.observe(elementRef4.current);
        if (elementRef5.current) observer.observe(elementRef5.current);
    
        // Cleanup on component unmount
        return () => {
            if (elementRef4.current) observer.unobserve(elementRef4.current);
            if (elementRef5.current) observer.unobserve(elementRef5.current);
        };
    }, []);
    

  return (
    <section className="big-section overflow-visible cover-background sm-background-image-none" style={{ backgroundColor: "#fff", paddingBottom: "60px", paddingTop: "110px", zIndex: "1000" }}>
        <div className="container">
            <div className="row row-cols-1 row-cols-lg-4 row-cols-md-2 justify-content-center z-index-1" style={{ marginTop: "-120px", zIndex: "2000" }} ref={elementRef4}>
                <div className="col icon-with-text-style-04 transition-inner-all md-mb-30px">
                    <div className="feature-box bg-white h-100 justify-content-start p-15 pe-10px ps-10px lg-p-15 box-shadow-quadruple-large box-shadow-quadruple-large-hover border-radius-5px box-shadow-new">
                        <div className="feature-box-icon feature-box-icon-rounded mx-auto fs-24 fw-500">
                            <i className="line-icon-Money-Bag fs-45 fw-600" style={{ color: "#4ea8f6", marginBottom: "2px" }}></i>
                        </div>
                        <div className="feature-box-content">
                            <span className="d-inline-block alt-font fs-22 fw-600 mb-5px text-base-color">Save Money</span>
                            <p className="mb-0 fs-16" style={{ color: "#787777" }}>Traditional Cost: US$10,000 <br />per valuation.<br />
                                Our Platform Cost: US$109 <br />per valuation.</p>
                        </div>
                        <div className="feature-box-overlay bg-white border-radius-6px"></div>
                    </div>
                </div>

                <div className="col icon-with-text-style-04 transition-inner-all md-mb-30px">
                    <div className="feature-box bg-white h-100 justify-content-start p-15 pe-10px ps-10px lg-p-15 box-shadow-quadruple-large box-shadow-quadruple-large-hover border-radius-5px box-shadow-new">
                        <div className="feature-box-icon feature-box-icon-rounded mx-auto fs-24 fw-500">
                            <i className="line-icon-Computer-Secure fs-45 fw-600" style={{ color: "#4ea8f6" }}></i>
                        </div>
                        <div className="feature-box-content">
                            <span className="d-inline-block alt-font fs-22 fw-600 mb-5px text-base-color">Privacy</span>
                            <p className="mb-0 fs-16" style={{ color: "#787777" }}>Our topmost priority is your privacy we don't share or divulge your information.</p>
                        </div>
                        <div className="feature-box-overlay bg-white border-radius-6px"></div>
                    </div>
                </div>

                <div className="col icon-with-text-style-04 transition-inner-all md-mb-30px">
                    <div className="feature-box bg-white h-100 justify-content-start p-15 pe-10px ps-10px lg-p-15 box-shadow-quadruple-large box-shadow-quadruple-large-hover border-radius-5px box-shadow-new">
                        <div className="feature-box-icon feature-box-icon-rounded mx-auto  fs-24  fw-500">
                            <i className="line-icon-Handshake fs-45 fw-600" style={{ color: "#4ea8f6" }}></i>
                        </div>
                        <div className="feature-box-content">
                            <span className="d-inline-block alt-font fs-22 fw-600 mb-5px text-base-color">Reliable</span>
                            <p className="mb-0 fs-16" style={{ color: "#787777" }}>Curated with care by our valuation experts and data scientists.</p>
                        </div>
                        <div className="feature-box-overlay bg-white border-radius-6px"></div>
                    </div>
                </div>

                <div className="col icon-with-text-style-04 transition-inner-all">
                    <div className="feature-box bg-white h-100 justify-content-start p-15 pe-10px ps-10px lg-p-15 box-shadow-quadruple-large box-shadow-quadruple-large-hover border-radius-5px box-shadow-new">
                        <div className="feature-box-icon feature-box-icon-rounded mx-auto fs-24 fw-500">
                            <i className="line-icon-Support fs-45 fw-700" style={{ color: "#4ea8f6" }}></i>
                        </div>
                        <div className="feature-box-content">
                            <span className="d-inline-block alt-font fs-22  fw-600 mb-5px text-base-color">Support</span>
                            <p className="mb-0 fs-16" style={{ color: "#787777" }}>Get in touch if you need any assistance! We will be pleased to serve you.</p>
                        </div>
                        <div className="feature-box-overlay bg-white border-radius-6px"></div>
                    </div>
                </div>
            </div>

            <div className="row " style={{ paddingTop: "60px" }}>
                <div className="col-xl-8 col-lg-7 col-md-7 margin-8px" ref={elementRef5}>
                    <h2 className="alt-font fw-600 ls-minus-2px text-base-color mb-2">Our Valuation<span style={{ color: "#4ea8f6" }}> Platform</span></h2>
                    <div className="mb-3">
                        <div className="col icon-with-text-style-08 mb-10px">
                            <div className="feature-box feature-box-left-icon-middle overflow-hidden">
                                <div className="feature-box-content">
                                    <span className="w-90 md-w-90 sm-w-90 xs-w-100 d-block lh-28 fs-16 margin-8px" style={{ color: "#787777" }}>Here's how to utilize the accessible valuation platform
                                        from FinVal to receive reliable outputs.</span>
                                </div>
                            </div>
                        </div>

                        <div className="col icon-with-text-style-08">
                            <div className="feature-box feature-box-left-icon-middle overflow-hidden">
                                <div className="feature-box-content">
                                    <span className="w-90 md-w-90 sm-w-90 xs-w-100 d-block lh-28 fs-16 margin-8px" style={{ color: "#787777" }}>It's
                                        as easy as filling out a form, and can use it frequently to learn more about
                                        your company and entice investors.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-inline-block">
                        <Link to="/about" className="btn btn-large  btn-box-shadow fw-400 me-35px sm-me-25px btn-round-edge" style={{ color: "white", backgroundColor: "#4ea8f6" }}>About company</Link>
                        <Link to="/how-it-works" className="btn btn-link btn-extra-large thin xs-mt-15px xs-mb-15px" style={{ color: "#4ea8f6" }}>How we <span>work</span></Link>
                    </div>
                </div>

                <div className="col-xl-4 col-lg-5 col-md-5 sm-mt-10px" ref={elementRef5}>
                    <img src={banner_change} className="rounded-5px" style={{ marginBottom: "-30px" }} alt="Finval's accessible valuation platform" />
                </div>
            </div>
        </div>
    </section>
  );
};

export default BannerFooter;
