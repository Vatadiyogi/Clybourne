import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import banner from '../../../assets/finimg/new-abouts-us-banner.png';
import blog from '../../../assets/finimg/blog1.jpg';
import Plans from './Plans';

const Team = () => {
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

    useEffect(() => {
        anime.timeline()
            .add({
                targets: elementRef1.current,
                delay: 0,
                duration: 600,
                stagger: 100, // Stagger effect with delay between each element
                easing: 'easeOutQuad',
                opacity: [0, 1],
                translateX: [50, 0]
            })
            .add({
                targets: elementRef5.current,
                delay: 0,
                duration: 600,
                stagger: 100, // Stagger effect with delay between each element
                easing: 'easeOutQuad',
                opacity: [0, 1],
                translateY: [50, 0],
            })
            .add({
                targets: elementRef2.current,
                delay: 0,
                duration: 600,
                stagger: 100, // Stagger effect with delay between each element
                easing: 'easeOutQuad',
                opacity: [0, 1]
            })
            .add({
                targets: elementRef2.current,
                delay: 0,
                easing: 'easeOutQuad',
                effect: "slide",
                color: "#63b6ff",
                direction: "lr"
            })
            .add({
                targets: elementRef4.current,
                delay: 500,
                easing: 'easeOutQuad',
                effect: "slide",
                color: "#63b6ff",
                direction: "lr"
            })
    }, []);

    return (
        <>

            <section className="page-title-parallax-background half-section" style={bannerStyle}>
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-12 text-center position-relative page-title-extra-large mt-15px">
                            <div className="d-flex flex-column h-100px">
                                <div className="mt-auto" useRef={elementRef1}>
                                    <h1 className="text-base-color alt-font mb-0 fw-600 ls-minus-1px">Pricing <span className="text-sky-blue">Plans</span></h1>
                                </div>
                                <div className="mt-auto justify-content-center breadcrumb breadcrumb-style-01 alt-font text-white">
                                    <p className="text-base-color sm-fs-15">Set the price based on how long you plan to use FinVal and benefit from a simple, one-time payment pricing.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Plans elementRef2={elementRef2} />

            <section className="bg-white padding-60-60 " >
                <div className="container margin-7px" style={{ marginBottom: "-7px" }}>
                    <div className="row text-center text-lg-start justify-content-center" useRef={elementRef1}>
                        <div className="col-xl-4 col-lg-5 md-mb-30px">
                            <h2 className="alt-font fw-600 text-base-color ls-minus-1px mb-0 shadow-none" data-shadow-animation="true" data-animation-delay="700">Everything is
                                <span className="text-sky-blue"> included.
                                    <span className="bg-base-color h-10px sm-h-8px bottom-20px md-bottom-17px opacity-5 separator-animation"></span>
                                </span>
                            </h2>
                        </div>
                        <div className="col-lg-7 offset-xl-1">
                            <div className="row">
                                <div className="col-md-6 last-paragraph-no-margin sm-mb-25px">
                                    <span className="alt-font fw-500 fs-22 text-base-color mb-5px d-block">Secure payments</span>
                                    <p className="w-80 xl-w-85 lg-w-100 md-mx-auto gray-text fs-16 lh-28">Lorem ipsum is simply dummy text printing typesetting.</p>
                                </div>
                                <div className="col-md-6 last-paragraph-no-margin">
                                    <span className="alt-font fw-500 fs-22 text-base-color mb-5px d-block">Money back guarantee</span>
                                    <p className="w-80 xl-w-85 lg-w-100 md-mx-auto gray-text fs-16 lh-28">Lorem ipsum is simply dummy text printing typesetting.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="big-section padding-60-60 position-relative">
                <div className="container">
                    <div className="row ">
                        <div className="col-lg-6 col-md-11 md-mb-10 xs-mb-25 pb-20px">
                            <figure className="position-relative m-0 md-ps-40px" useRef={elementRef3}>
                                <img src={blog} alt="" className="border-radius-5px w-100" style={{ height: "600px" }} />
                                    <figcaption className="position-absolute bottom-minus-20px xs-bottom-minus-60px left-minus-50px lg-left-minus-20px xs-left-minus-0px text-white text-center last-paragraph-no-margin w-60 lg-w-70 md-w-60 xs-w-280px atropos" data-atropos>
                                        <div className="atropos-scale" useRef={elementRef4}>
                                            <div className="atropos-rotate">
                                                <div className="atropos-inner border-radius-5px text-white ps-12 pe-12 pt-60px pb-60px sm-p-20px sm-pt-30px sm-pb-30px bg-sky-blue">
                                                    <div data-atropos-offset="3">
                                                        <i className="line-icon-Money-Bag icon-double-large mb-25px fw-600"></i>
                                                        <span className="fs-22 mb-5px d-block fw-600">Endless possibilities</span>
                                                        <p className="opacity-8 fw-500">Lorem ipsum is simply dummy printing typesetting industry.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </figcaption>
                            </figure>
                        </div>
                        <div className="col-xl-6  col-lg-6" useRef={elementRef5}>
                            <h2 className="fw-600 text-base-color ls-minus-1px margin-8px">Most commonly <br />asked<span style={{ color: "#4ea8f6" }}> questions.</span></h2>
                            <div className="row justify-content-center">
                                <div className="col-12">
                                    <div className="accordion accordion-style-04" id="accordion-style-04"
                                        data-active-icon="fa-angle-down" data-inactive-icon="fa-angle-right">
                                        <div className="accordion-item active-accordion">
                                            <div className="accordion-header border-bottom border-color-extra-medium-gray mb-0">
                                                <a href="/" data-bs-toggle="collapse" data-bs-target="#accordion-style-04-01" aria-expanded="true" data-bs-parent="#accordion-style-04">
                                                    <div className="accordion-title position-relative mb-0 pe-20px text-base-color fw-600 alt-font fs-18">
                                                        <span>User-Friendly Interface</span>
                                                        <i className="fa-solid fa-angle-down icon-small"></i>
                                                    </div>
                                                </a>
                                            </div>
                                            <div id="accordion-style-04-01" className="accordion-collapse collapse show" data-bs-parent="#accordion-style-04">
                                                <div className="accordion-body bg-white last-paragraph-no-margin">
                                                    <p className="gray-text fs-16 lh-28">XYZ is designed with simplicity in mind. Users can navigate the platform effortlessly, inputting relevant data and receiving
                                                        comprehensive valuation reports in a matter of days. The intuitive interface makes business valuation accessible to a broader audience</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="accordion-item">
                                            <div className="accordion-header border-bottom border-color-extra-medium-gray mb-0">
                                                <a href="/" data-bs-toggle="collapse" data-bs-target="#accordion-style-04-02" aria-expanded="false" data-bs-parent="#accordion-style-04">
                                                    <div className="accordion-title position-relative mb-0 pe-20px text-base-color fw-600 alt-font fs-18">
                                                        <span>Customizable Reporting</span>
                                                        <i className="fa-solid fa-angle-right icon-small"></i>
                                                    </div>
                                                </a>
                                            </div>

                                            <div id="accordion-style-04-02" className="accordion-collapse collapse" data-bs-parent="#accordion-style-04">
                                                <div className="accordion-body bg-white last-paragraph-no-margin">
                                                    <p className="gray-text fs-16 lh-28">Recognizing the diverse needs of businesses, XYZ offers
                                                        customizable reporting features. Users can tailor reports to focus on specific metrics, enabling them to extract the insights most relevant to their
                                                        decision-making process</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="accordion-item">
                                            <div className="accordion-header border-bottom border-color-extra-medium-gray mb-0">
                                                <a href="/" data-bs-toggle="collapse" data-bs-target="#accordion-style-04-03" aria-expanded="false" data-bs-parent="#accordion-style-04">
                                                    <div className="accordion-title position-relative mb-0 pe-20px text-base-color fw-600 alt-font fs-18">
                                                        <span>Security and Compliance</span>
                                                        <i className="fa-solid fa-angle-right icon-small"></i>
                                                    </div>
                                                </a>
                                            </div>
                                            <div id="accordion-style-04-03" className="accordion-collapse collapse" data-bs-parent="#accordion-style-04">
                                                <div className="accordion-body bg-white last-paragraph-no-margin">
                                                    <p className="gray-text fs-16 lh-28">We prioritize the security of your sensitive financial
                                                        data. The team at FA Fin Advisors always strives to ensure that information is protected at every step</p>
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
                                                    <p className="gray-text fs-16 lh-28">While XYZ is a powerful standalone tool, FA Fin
                                                        Advisors is committed to providing ongoing support. Our team of experienced investment
                                                        bankers is available to answer queries, provide guidance, and assist users in interpreting and applying valuation results to their strategic objectives</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Team;
