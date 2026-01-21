import React, { useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import anime from 'animejs';
import banner from '../../assets/finimg/about-us-banner7.png';
import about_section from '../../assets/finimg/about.jpg';
import banner_about_section from '../../assets/finimg/bannner-animate-change.png';
import Testimonial from './Testimonial';

const About = () => {
    const bannerStyle = {
        backgroundImage: `url(${banner})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        width: "100%",
        height: "300px !important"
    };

    const elementRef1 = useRef(null);
    const elementRef2 = useRef(null);
    const elementRef3 = useRef(null);
    const elementRef4 = useRef(null);
    const elementRef5 = useRef(null);
    const elementRef6 = useRef(null);
    const elementRef7 = useRef(null);
    const elementRef8 = useRef(null);

    useEffect(() => {
        // Multiple animations
        anime.timeline()
            .add({
                targets: elementRef1.current,
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 400,
                delay: 0,
                easing: 'easeOutQuad',
                stagger: 200 // Stagger effect with delay between each element
            })
            .add({
                targets: elementRef2.current,
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 600,
                delay: 0,
                easing: 'easeOutQuad',
                stagger: 300 // Stagger effect with delay between each element
            })
            .add({
                targets: elementRef3.current,
                translateY: [50, 0],
                opacity: [0, 1],
                duration: 600,
                delay: 0,
                easing: 'easeOutQuad',
                stagger: 100 // Stagger effect with delay between each element
            })
            .add({
                targets: elementRef4.current,
                effect: "slide",
                color: "#63b6ff",
                delay: 0,
                direction: 'lr',
                duration: 1000 // Stagger effect with delay between each element
            })
            .add({
                targets: elementRef5.current,
                perspective: [1200, 1200],
                delay: 0,
                duration: 600,
                stagger: 150, // Stagger effect with delay between each element
                scale: [0.95, 1],
                easing: 'easeOutQuad',
                rotateY: [-30, 0],
                opacity: [0, 1]
            })
            .add({
                targets: elementRef6.current,
                delay: 0,
                duration: 800,
                stagger: 200, // Stagger effect with delay between each element
                easing: 'easeOutQuad',
                opacity: [0, 1],
                translateX: [50, 0]
            })
            .add({
                targets: elementRef7.current,
                delay: 100,
                duration: 600,
                stagger: 150, // Stagger effect with delay between each element
                easing: 'easeOutQuad',
                opacity: [0, 1],
                translate: [0, 0]
            })
            .add({
                targets: elementRef8.current,
                delay: 100,
                duration: 1200,
                stagger: 150, // Stagger effect with delay between each element
                easing: 'easeOutQuad',
                opacity: [0, 1],
                translateY: [0, 0]
            })
    }, []);

    return (
        <>
            <section className="page-title-parallax-background half-section"
                style={bannerStyle}>
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-12  position-relative page-title-extra-large mt-30px">
                            <div className="d-flex flex-column h-100px">
                                <div className="mt-auto" ref={elementRef1}>
                                    <h1 className="text-base-color alt-font mb-0 fw-500 ls-minus-1px">About <span style={{ color: "#ffc30f" }}>FinVal</span></h1>
                                </div>
                                <div className="mt-auto  breadcrumb breadcrumb-style-01  alt-font justify-content-center" style={{ width: "410px" }}>
                                    <ul ref={elementRef2} className="fs-20 text-base-color fw-600">
                                        <li><Link to="/" className="text-base-color">Home</Link></li>
                                        <li >About</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-bottom border-color-extra-medium-gray padding-60-60" style={{ backgroundColor: "white", borderTop: "1px solid #ecf0f2" }}>
                <div className="container">
                    <div className="row ">
                        <div className="col-xl-7 col-lg-7 md-mb-9 sm-mb-50px" ref={elementRef3}>
                            <h2 className="alt-font fw-600 ls-minus-2px  text-base-color shadow-none lh-1 margin-4px mb-2" data-shadow-animation="true"
                                data-animation-delay="700">Our Valuation <span className="text-sky-blue">Platform.</span>
                            </h2>
                            <div className="row">
                                <div className="col-lg-12 col-md-12 mb-25px last-paragraph-no-margin">
                                    <p className="w-100 md-w-100 sm-w-100 gray-text fs-16 lh-28">FA Fin Advisors is happy to introduce XYZ
                                        Business Valuation Software, a cutting-edge business valuation software service designed
                                        to empower SMEs with precision, efficiency, and strategic insights. At FA Fin Advisors,
                                        we understand the challenges entrepreneurs and decision-makers face in assessing their
                                        businesses' true value. With XYZ Software, we aim to simplify this complex process by
                                        providing a user-friendly platform that does not just rely on AI-based automated
                                        valuation reports, but nurtures your inputs and adds our 15+ years of expert analysis on
                                        valuations across industries and geographies to offer customized and reliable valuation
                                        results.</p>
                                </div>
                            </div>

                            <a href="/" className="btn btn-large btn-box-shadow fw-400 me-35px sm-me-25px btn-round-edge sky-blue-big-btn">Buy Now</a>
                        </div>
                        <div className="col-xl-5  col-lg-5  position-relative md-mb-6 sm-mb-50px">
                            <div className="overflow-hidden text-end w-90 sm-w-100 ms-auto" ref={elementRef4}>
                                <img src={about_section} alt="" style={{ height: "450px" }} className="w-100 border-radius-5px sm-height-400" />
                            </div>
                        </div>
                    </div>

                    <div className="row row-cols-2 row-cols-md-4 justify-content-center counter-style-02 pt-60px">
                        <div className="col text-center sm-mb-35px margin-8px">
                            <h2 className="vertical-counter d-inline-flex alt-font text-base-color fw-600 mb-0 ls-minus-3px sm-ls-minus-2px">6350</h2>
                            <span className="d-block fs-14 alt-font text-uppercase sm-lh-22 text-sky-blue fw-700" >Happy Clients</span>
                        </div>

                        <div className="col text-center sm-mb-35px margin-8px">
                            <h2 className="vertical-counter d-inline-flex alt-font text-base-color fw-600 mb-0 ls-minus-3px sm-ls-minus-2px">5298</h2>
                            <span className="d-block fs-14 alt-font text-uppercase text-sky-blue sm-lh-22 fw-700">Work completed</span>
                        </div>

                        <div className="col text-center sm-mb-35px margin-8px">
                            <h2 className="vertical-counter d-inline-flex alt-font text-base-color fw-600 mb-0 ls-minus-3px sm-ls-minus-2px">5864</h2>
                            <span className="d-block fs-14 alt-font text-uppercase sm-lh-22 text-sky-blue fw-700">Photo capture</span>
                        </div>

                        <div className="col text-center sm-mb-35px margin-8px">
                            <h2 className="vertical-counter d-inline-flex alt-font text-base-color fw-600 mb-0 ls-minus-3px sm-ls-minus-2px">3450</h2>
                            <span className="d-block fs-14 alt-font text-uppercase sm-lh-22 text-sky-blue fw-700">Telephonic talk</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="big-section p-0 position-relative z-index-1 bg-very-light-gray-contact ">
                <div className="container-fluid p-0">
                    <div className="row row-cols-1 row-cols-xl-4 row-cols-lg-4 row-cols-md-4 row-cols-sm-2 justify-content-center text-center icon-with-style-2 g-0" useRef={elementRef5}>
                        <div className="col icon-with-text-style-05 transition-inner-all">
                            <div
                                className="feature-box hover-box dark-hover border-end xs-border-end-0 border-color-extra-medium-gray border-color-transparent-on-hover lg-border-bottom last-paragraph-no-margin">
                                <div className="content-slide-up content-scale p-20 xxl-p-10 xl-p-6 lg-p-8 xs-p-10">
                                    <div className="feature-box-icon">
                                        <i
                                            className="line-icon-Love-User icon-extra-large text-sky-blue mb-25px justify-content-center fw-600"></i>
                                    </div>
                                    <div className="feature-box-content">
                                        <span className="d-inline-block alt-font text-base-color fs-22 fw-600 mb-5px">User-Friendly
                                            Interface</span>
                                        <p className="text-visible text-light-opacity xs-w-85 mx-auto mx-sm-0 fs-16 lh-28">XYZ is designed with
                                            simplicity in mind</p>
                                    </div>
                                    <div className="feature-box-overlay bg-sky-blue"></div>
                                </div>
                            </div>
                        </div>

                        <div className="col icon-with-text-style-05 transition-inner-all">
                            <div
                                className="feature-box hover-box dark-hover h-100 border-end xs-border-end-0 border-color-extra-medium-gray border-color-transparent-on-hover lg-border-bottom last-paragraph-no-margin">
                                <div className="content-slide-up content-scale p-20 xxl-p-10 xl-p-6 lg-p-8 xs-p-10">
                                    <div className="feature-box-icon">
                                        <i
                                            className="line-icon-Bar-Chart2 icon-extra-large text-sky-blue mb-25px justify-content-center fw-600"></i>
                                    </div>
                                    <div className="feature-box-content">
                                        <span className="d-inline-block alt-font text-base-color fs-22 fw-600 mb-5px">Customizable
                                            Reporting</span>
                                        <p className="text-visible text-light-opacity xs-w-85 mx-auto mx-sm-0 fs-16 lh-28">XYZ offers
                                            customizable reporting features</p>
                                    </div>
                                    <div className="feature-box-overlay bg-sky-blue"></div>
                                </div>
                            </div>
                        </div>

                        <div className="col icon-with-text-style-05 transition-inner-all">
                            <div
                                className="feature-box hover-box dark-hover h-100 border-end sm-border-end-0 border-color-extra-medium-gray border-color-transparent-on-hover sm-border-bottom last-paragraph-no-margin">
                                <div className="content-slide-up content-scale p-20 xxl-p-10 xl-p-6 lg-p-8 xs-p-10">
                                    <div className="feature-box-icon">
                                        <i className="line-icon-Security-Check icon-extra-large text-sky-blue mb-25px justify-content-center fw-600"></i>
                                    </div>
                                    <div className="feature-box-content">
                                        <span className="d-inline-block alt-font text-base-color fs-22 fw-600 mb-5px">Security and Compliance</span>
                                        <p className="text-visible text-light-opacity xs-w-85 mx-auto mx-sm-0 fs-16 lh-28">We prioritize the security of your sensitive financial data.</p>
                                    </div>
                                    <div className="feature-box-overlay bg-sky-blue"></div>
                                </div>
                            </div>
                        </div>

                        <div className="col icon-with-text-style-05 transition-inner-all">
                            <div className="feature-box hover-box dark-hover h-100 border-color-extra-medium-gray border-color-transparent-on-hover last-paragraph-no-margin">
                                <div className="content-slide-up content-scale p-20 xxl-p-10 xl-p-6 lg-p-8 xs-p-10">
                                    <div className="feature-box-icon">
                                        <i className="line-icon-Business-ManWoman icon-extra-large text-sky-blue mb-25px justify-content-center fw-600"></i>
                                    </div>
                                    <div className="feature-box-content">
                                        <span className="d-inline-block alt-font text-base-color fs-22 fw-600 mb-5px">Expert Support</span>
                                        <p className="text-visible text-light-opacity xs-w-85 mx-auto mx-sm-0 fs-16 lh-28">FA Fin Advisors is committed to providing ongoing support.</p>
                                    </div>
                                    <div className="feature-box-overlay bg-sky-blue"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="big-section padding-60-60" style={{ backgroundColor: "white" }}>
                <div className="container">
                    <div className="row  justify-content-center" >
                        <div className=" offset-xl-1 col-xl-4 col-lg-5 col-md-5" useRef={elementRef6}>
                            <img src={banner_about_section} alt="" />
                        </div>
                        <div className="col-lg-7  col-md-9 text-center text-lg-start margin-7px" useRef={elementRef7}>
                            <div className="col icon-with-text-style-08 mb-10px">
                                <div className="feature-box feature-box-left-icon-middle overflow-hidden">

                                    <div className="feature-box-content">
                                        <span className="w-90 md-w-90 sm-w-90 xs-w-100 d-block fs-16 lh-28 "
                                            style={{ color: "#787777" }}>FA Fin Advisors is happy to introduce XYZ Business Valuation
                                            Software, a cutting-edge business valuation software service designed to empower SMEs with
                                            precision, efficiency, and strategic insights.</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col icon-with-text-style-08 mb-10px">
                                <div className="feature-box feature-box-left-icon-middle overflow-hidden">
                                    <div className="feature-box-content">
                                        <span className="w-90 md-w-90 sm-w-90 xs-w-100 d-block fs-16 lh-28" style={{ color: "#787777" }}>At FA Fin Advisors, we understand the challenges
                                            entrepreneurs and decision-makers face in assessing their businesses' true value.</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col icon-with-text-style-08">
                                <div className="feature-box feature-box-left-icon-middle overflow-hidden">
                                    <div className="feature-box-content">
                                        <span className="w-90 md-w-90 sm-w-90 xs-w-100 d-block fs-16 lh-28" style={{ color: "#787777" }}>With XYZ
                                            Software, we aim to simplify this complex process by providing a user-friendly platform that
                                            does not just rely on AI-based automated valuation reports, but nurtures your inputs adds
                                            our 15+ years of expert analysis on valuations across industries and geographies to offer
                                            customized and reliable valuation results.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="big-section overflow-hidden bg-very-light-gray-contact padding-60-60">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-5 col-lg-6 md-mb-50px" useRef={elementRef3}>
                            <h2 className="alt-font text-base-color fw-600 ls-minus-1px mb-40px sm-mb-25px">Key Features</h2>
                            <div className="accordion accordion-style-04" id="accordion-style-04" data-active-icon="fa-angle-down" data-inactive-icon="fa-angle-right">
                                <div className="accordion-item active-accordion">
                                    <div className="accordion-header border-bottom border-color-extra-medium-gray mb-0">
                                        <a href="/" data-bs-toggle="collapse" data-bs-target="#accordion-style-04-01" aria-expanded="true" data-bs-parent="#accordion-style-04">
                                            <div
                                                className="accordion-title position-relative mb-0 pe-20px text-base-color fw-600 alt-font fs-18">
                                                <span>User-Friendly Interface</span>
                                                <i className="fa-solid fa-angle-down icon-small"></i>
                                            </div>
                                        </a>
                                    </div>
                                    <div id="accordion-style-04-01" className="accordion-collapse collapse show"
                                        data-bs-parent="#accordion-style-04">
                                        <div className="accordion-body bg-white last-paragraph-no-margin">
                                            <p className="gray-text fs-16 lh-28">XYZ is designed with simplicity in mind. Users can navigate the
                                                platform effortlessly, inputting relevant data and receiving comprehensive
                                                valuation reports in a matter of days. The intuitive interface makes business
                                                valuation accessible to a broader audience</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <div className="accordion-header border-bottom border-color-extra-medium-gray mb-0">
                                        <a href="/" data-bs-toggle="collapse" data-bs-target="#accordion-style-04-02" aria-expanded="false" data-bs-parent="#accordion-style-04">
                                            <div
                                                className="accordion-title position-relative mb-0 pe-20px text-base-color fw-600 alt-font fs-18">
                                                <span>Customizable Reporting</span>
                                                <i className="fa-solid fa-angle-right icon-small"></i>
                                            </div>
                                        </a>
                                    </div>
                                    <div id="accordion-style-04-02" className="accordion-collapse collapse"
                                        data-bs-parent="#accordion-style-04">
                                        <div className="accordion-body bg-white last-paragraph-no-margin">
                                            <p className="gray-text fs-16 lh-28">Recognizing the diverse needs of businesses, XYZ offers
                                                customizable reporting features. Users can tailor reports to focus on specific
                                                metrics, enabling them to extract the insights most relevant to their
                                                decision-making process</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <div className="accordion-header border-bottom border-color-extra-medium-gray mb-0">
                                        <a href="/" data-bs-toggle="collapse" data-bs-target="#accordion-style-04-03" aria-expanded="false" data-bs-parent="#accordion-style-04">
                                            <div
                                                className="accordion-title position-relative mb-0 pe-20px text-base-color fw-600 alt-font fs-18">
                                                <span>Security and Compliance</span>
                                                <i className="fa-solid fa-angle-right icon-small"></i>
                                            </div>
                                        </a>
                                    </div>
                                    <div id="accordion-style-04-03" className="accordion-collapse collapse" data-bs-parent="#accordion-style-04">
                                        <div className="accordion-body bg-white last-paragraph-no-margin">
                                            <p className="gray-text fs-16 lh-28">We prioritize the security of your sensitive financial data.
                                                The team at FA Fin Advisors always strives to ensure that information is
                                                protected at every step</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <div className="accordion-header border-bottom border-color-extra-medium-gray mb-0">
                                        <a href="/" data-bs-toggle="collapse" data-bs-target="#accordion-style-04-04" aria-expanded="false" data-bs-parent="#accordion-style-04">
                                            <div className="accordion-title position-relative mb-0 pe-20px text-base-color fw-600 alt-font fs-18">
                                                <span>Expert Support</span>
                                                <i className="fa-solid fa-angle-right icon-small"></i>
                                            </div>
                                        </a>
                                    </div>
                                    <div id="accordion-style-04-04" className="accordion-collapse collapse" data-bs-parent="#accordion-style-04">
                                        <div className="accordion-body bg-white last-paragraph-no-margin">
                                            <p className="gray-text fs-16 lh-28">While XYZ is a powerful standalone tool, FA Fin Advisors is
                                                committed to providing ongoing support. Our team of experienced investment
                                                bankers is available to answer queries, provide guidance, and assist users in
                                                interpreting and applying valuation results to their strategic objectives</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-6 offset-xl-1 col-lg-6 position-relative" useRef={elementRef6}>
                            <div className="outside-box-right-25 md-me-0">
                                <img src="https://craftohtml.themezaa.com/images/demo-seo-agency-process-01.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Testimonial />
        </>
    );
};

export default About;
