import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import banner from '../../../assets/finimg/new-abouts-us-banner.png';
import collection from '../../../assets/finimg/bar-line-with-color.png';
import performance from '../../../assets/finimg/capture-the-perfomance-with-color.png';
import bar from '../../../assets/finimg/data-icon-with-color.png';
import process from '../../../assets/finimg/demo-corporate-10.webp';
import process_3 from '../../../assets/finimg/demo-corporate-03.png';
import process_6 from '../../../assets/finimg/demo-corporate-06.webp';
import process_7 from '../../../assets/finimg/demo-corporate-07.webp';
import process_8 from '../../../assets/finimg/demo-corporate-08.webp';
import process_5 from '../../../assets/finimg/demo-corporate-05.png';
import howitworrks from '../../../assets/finimg/how-it-work1.png';
import howitworrks_2 from '../../../assets/finimg/how-it-work2.png';
import howitworrks_3 from '../../../assets/finimg/how-it-work3.png';
import icon_1 from '../../../assets/finimg/demo-data-analysis-icon-01.webp';
import icon_2 from '../../../assets/finimg/demo-data-analysis-icon-02.webp';
import icon_4 from '../../../assets/finimg/demo-data-analysis-icon-04.webp';
import icon_6 from '../../../assets/finimg/demo-data-analysis-icon-06.webp';
import icon_bg_6 from '../../../assets/finimg/demo-data-analysis-bg-06.webp';
import icon_bg_7 from '../../../assets/finimg/demo-data-analysis-bg-07.png';

const HowItWorks = () => {
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

    useEffect(() => {
        // Multiple animations
        anime.timeline()
            .add({
                targets: elementRef1.current,
                delay: 100,
                duration: 400,
                stagger: 200, // Stagger effect with delay between each element
                easing: 'easeOutQuad',
                opacity: [0, 1],
                translateY: [30, 0]
            })
            .add({
                targets: elementRef2.current,
                delay: 0,
                duration: 1000,
                effect: "slide",
                direction: "lr",
                color: "#63b6ff"
            })
            .add({
                targets: elementRef3.current,
                translateX: [0, 0],
                opacity: [0, 1],
                duration: 1200,
                delay: 0,
                staggervalue: 150,
                easing: "easeOutQuad"
            })
    }, []);

    return (
        <>
            <section className="page-title-parallax-background half-section " style={bannerStyle}>
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-12 text-center position-relative page-title-extra-large mt-15px">
                            <div className="d-flex flex-column h-100px">
                                <div className="mt-auto" useRef={elementRef1}>
                                    <h1 className="text-base-color alt-font mb-0 fw-600 ls-minus-1px sm-fs-24">One-Stop Solution for Business <span className="text-sky-blue"> Valuation</span></h1>
                                </div>
                                <div className="mt-auto justify-content-center breadcrumb breadcrumb-style-01 alt-font text-base-color">
                                    <p className="text-base-color sm-fs-14 sm-lh-20">We've made every effort to make the valuation as simple and clear as possible. Here is how it goes.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white padding-60-60 d-flex justify-content-center">
                <div className="position-relative ms-4 me-4">
                    <div className="container d-flex  pt-2 pb-2  mb-4" style={{ width: "95%", border: "1px solid #e8e8e8", boxShadow: "0 15px 60px -30px rgba(0, 0, 0, .45) !important", borderRadius: "10px" }}>
                        <div className="row text-center text-lg-start overflow-hidden">
                            <div className="col-xl-5 col-lg-5   overflow-hidden text-end mt-1" useRef={elementRef2}>
                                <img src={collection} alt="Valuation report" className="w-100 border-radius-10px h-300px object-fit-cover" />
                            </div>
                            <div className="col-xl-6 col-lg-6 pb-1 mt-3" useRef={elementRef1}>
                                <span className="ps-25px pe-25px mb-20px text-uppercase text-base-color fs-12 lh-40 fw-700 border-radius-100px bg-gradient-very-light-gray-transparent d-inline-flex align-self-start">
                                    <i className="bi bi-chat-square-dots fs-16 me-5px"></i>Questionnaire
                                </span>
                                <h2 className="alt-font fw-600 text-base-color ls-minus-2px shadow-none mb-2" data-shadow-animation="true" data-animation-delay="900">
                                    Streamline Data <span className="text-sky-blue">Collection<span className="bg-base-color h-10px sm-h-8px bottom-20px md-bottom-17px opacity-5 separator-animation"></span></span>
                                </h2>
                                <p className="w-100 xs-w-100  gray-text fs-18 lh-28">
                                    10 short questions that capture the qualitative aspects of business, like business
                                    experience, industry and country of operation, about company, and historical earning trend
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className=" bg-very-light-gray-contact  container d-flex  pt-2 pb-2  mb-4" style={{ width: "95%", border: "1px solid #e8e8e8", boxShadow: "0 15px 60px -30px rgba(0, 0, 0, .45) !important", borderRadius: "10px" }}>
                        <div className="row   text-center text-lg-start overflow-hidden">
                            <div className="col-xl-1 col-lg-1"></div>
                            <div className="col-xl-6 col-lg-6 pb-2 mt-3 " useRef={elementRef1}>
                                <span className="ps-25px pe-25px mb-20px text-uppercase text-base-color fs-12 lh-40 fw-700 border-radius-100px bg-gradient-very-light-gray-transparent d-inline-flex align-self-start">
                                    <i className="bi bi-chat-square-dots fs-16 me-5px"></i>Financial Projections
                                </span>
                                <h2 className="alt-font fw-600 text-base-color ls-minus-2px shadow-none mb-2" data-shadow-animation="true" data-animation-delay="900">
                                    Capture the <span className="text-sky-blue">Performance<span className="bg-base-color h-10px sm-h-8px bottom-20px md-bottom-17px opacity-5 separator-animation"></span></span>
                                </h2>
                                <p className="w-100 xs-w-100  gray-text fs-18 lh-28">
                                    To estimate the worth of future financial success, combine the most recent fiscal year's
                                    actual figures with financial estimates for the following five years
                                </p>
                            </div>
                            <div className="col-xl-5 col-lg-5 overflow-hidden text-end mt-1 mb-1" useRef={elementRef2}>
                                <img src={performance} alt="Valuation report" className="w-100 border-radius-10px h-300px object-fit-cover" />
                            </div>
                        </div>
                    </div>

                    <div className="container d-flex  pt-2 pb-2  mb-0" style={{ width: "95%", border: "1px solid #e8e8e8", boxShadow: "0 15px 60px -30px rgba(0, 0, 0, .45) !important", borderRadius: "10px" }}>
                        <div className="row   text-center text-lg-start overflow-hidden mt-3">
                            <div className="col-xl-5 col-lg-5   overflow-hidden text-end" useRef={elementRef2}>
                                <img src={bar} alt="Valuation report" className="w-100 border-radius-10px h-300px object-fit-cover" />
                            </div>
                            <div className="col-xl-6 col-lg-6 pb-4 " useRef={elementRef1}>
                                <span className="ps-25px pe-25px mb-20px text-uppercase text-base-color fs-12 lh-40 fw-700 border-radius-100px bg-gradient-very-light-gray-transparent d-inline-flex align-self-start">
                                    <i className="bi bi-chat-square-dots fs-16 me-5px"></i>Valuation parameters
                                </span>
                                <h2 className="alt-font fw-600 text-base-color ls-minus-2px shadow-none mb-2" data-shadow-animation="true" data-animation-delay="900">
                                    Valuation <span className="text-sky-blue">Inputs<span className="bg-base-color h-10px sm-h-8px bottom-20px md-bottom-17px opacity-5 separator-animation"></span></span>
                                </h2>
                                <p className="w-100 xs-w-100  gray-text fs-18 lh-28">
                                    Curated from the most dependable sources to supply the essential factors (such as multiples and discount rates) for the evaluation of your business
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="padding-60-60">
                <div className="container position-relative">
                    <div className="row align-items-center pb-60px">
                        <div className="col-xxl-6 col-lg-5 md-mb-15 sm-mb-20 text-center text-lg-start">
                            <span className="ps-25px pe-25px mb-20px text-uppercase text-base-color fs-14 lh-42px fw-700 border-radius-100px bg-gradient-very-light-gray-transparent d-inline-block">Simple process</span>
                            <h2 className="text-base-color fw-600 ls-minus-2px mb-40px">Understand the business <span style={{ color: "#4ea8f6" }}>process.</span></h2>
                            <div className="row row-cols-1 appear anime-child anime-complete" useRef={elementRef1}>
                                <div className="col-12 process-step-style-05 position-relative hover-box">
                                    <div className="process-step-item d-flex">
                                        <div className="process-step-icon-wrap position-relative">
                                            <div className="process-step-icon d-flex justify-content-center align-items-center mx-auto rounded-circle h-60px w-60px fs-14  fw-700 position-relative bg-sky-blue-light">
                                                <span className="number position-relative z-index-1 text-base-color">01</span>
                                                <div className="box-overlay bg-sky-blue rounded-circle"></div>
                                            </div>
                                            <span className="progress-step-separator-new bg-sky-blue-very-light opacity-7"></span>
                                        </div>
                                        <div className="process-content ps-30px last-paragraph-no-margin mb-30px">
                                            <span className="d-block fw-700 text-base-color mb-5px fs-18">Start market research</span>
                                            <p className="w-90 lg-w-100 lh-28 fs-16 gray-text">Lorem ipsum amet consectetur eiusmod tempor incididunt.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 process-step-style-05 position-relative hover-box">
                                    <div className="process-step-item d-flex">
                                        <div className="process-step-icon-wrap position-relative">
                                            <div className="process-step-icon d-flex justify-content-center align-items-center mx-auto rounded-circle h-60px w-60px fs-14 bg-light-red fw-700 position-relative bg-sky-blue-light">
                                                <span className="number position-relative z-index-1 text-base-color">02</span>
                                                <div className="box-overlay bg-sky-blue  rounded-circle"></div>
                                            </div>
                                            <span className="progress-step-separator-new bg-sky-blue-very-light opacity-7"></span>
                                        </div>
                                        <div className="process-content ps-30px last-paragraph-no-margin mb-30px">
                                            <span className="d-block fw-700 text-base-color mb-5px fs-18">Discussion of the idea</span>
                                            <p className="w-90 lg-w-100 lh-28 fs-16 gray-text">Lorem ipsum amet consectetur eiusmod tempor incididunt.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 process-step-style-05 position-relative hover-box xs-mb-30px">
                                    <div className="process-step-item d-flex">
                                        <div className="process-step-icon-wrap position-relative">
                                            <div className="process-step-icon d-flex justify-content-center align-items-center mx-auto rounded-circle h-60px w-60px fs-14 bg-light-red fw-700 position-relative bg-sky-blue-light">
                                                <span className="number position-relative z-index-1 text-base-color">03</span>
                                                <div className="box-overlay bg-sky-blue  rounded-circle"></div>
                                            </div>
                                        </div>
                                        <div className="process-content ps-30px last-paragraph-no-margin">
                                            <span className="d-block fw-700 text-base-color mb-5px fs-18">Production planning</span>
                                            <p className="w-90 lg-w-100 lh-28 fs-16 gray-text">Lorem ipsum amet consectetur eiusmod tempor incididunt.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6  position-relative md-mb-30px sm-mb-15 appear anime-complete mt-50px" useRef={elementRef3}>
                            <img src={process} className="position-relative z-index-9 top-40px" alt="" data-no-retina="" />
                            <img src={process_3} className="absolute-middle-center xs-w-95" alt="" data-no-retina="" />
                            <img src={process_5} className="position-absolute top-50px left-0px xs-left-15px skrollable skrollable-between" data-bottom-top="transform: translateY(-50px)" data-top-bottom="transform: translateY(50px)" alt="" style={{ transform: "translateY(-27.4799px)" }} data-no-retina="" />
                            <img src={process_6} className="position-absolute top-150px left-30 skrollable skrollable-before" data-bottom-top="transform: translateY(30px)" data-top-bottom="transform: translateY(-30px)" alt="" style={{ transform: "translateY(30px)" }} data-no-retina="" />
                            <img src={process_7} className="position-absolute top-50px right-30 skrollable skrollable-between" data-bottom-top="transform: translateY(-50px)" data-top-bottom="transform: translateY(50px)" alt="" style={{ transform: "translateY(-26.1062px)" }} data-no-retina="" />
                            <img src={process_8} className="position-absolute top-100px right-0px xs-right-15px skrollable skrollable-between" data-bottom-top="transform: translateY(30px)" data-top-bottom="transform: translateY(-30px)" alt="" style={{ transform: "translateY(23.8983px)" }} data-no-retina="" />
                        </div>
                    </div>
                    <div className="row justify-content-center align-items-center">
                        <div className="col-12 text-center align-items-center appear anime-complete" useRef={elementRef1}>
                            <div className="bg-sky-blue fw-700 text-white text-uppercase border-radius-30px ps-20px pe-20px fs-12 me-10px sm-m-5px d-inline-block align-middle"> hurray</div>
                            <div className="fs-18 fw-500 text-base-color d-inline-block align-middle">Let's make something great work together.
                                <a href="/" className="text-base-color text-decoration-line-bottom fw-700">Got a project in mind?</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className=" padding-60-60 w-100 text-center bg-white">
                <div className="d-inline-block text-center ps-5 pe-5" style={{ maxWidth: "80% !important", margin: "0 auto" }}>
                    <h4 className="fw-600   mb-2 d-block  text-base-color margin-4px">Industry-leading Valuation Approach used to value your
                        <span style={{ color: "#4ea8f6" }}> Business</span>
                    </h4>
                    <p className="gray-text fs-16 lh-28 margin-4px">To provide you with a thorough and trustworthy understanding of the valuation of your
                        business, your inputs and our data are integrated into different valuation techniques.</p>
                    <img src={howitworrks} className=" md-mt-15px border-radius-6px" alt=""
                        style={{ boxShadow: "0 15px 60px -30px rgba(0,0,0,1)" }} />
                </div>
            </section>

            <section className="padding-60-60 w-100 text-center bg-very-light-gray-contact">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 d-flex ">
                            <div className="text-start">
                                <h2 className="fw-600 mb-2 text-base-color margin-4px">Tailor Made Approach as per
                                    <span style={{ color: "#4ea8f6" }}>Industry</span>
                                </h2>
                                <ul className="list-style-01 ps-0 mb-0">
                                    <li className="border-color-transparent-dark-very-light ps-2 pt-2 pb-2 fs-16" style={{ display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check2-circle fs-22 fw-700" style={{ color: "rgb(20, 193, 20)", marginRight: "8px", marginTop: "-4px" }}></i>
                                        <span className="text-start lh-sm">
                                            FinVal aims to facilitate easy use of the platform for all company stages and get the
                                            professional valuation report in no time.
                                        </span>
                                    </li>
                                    <li className="border-color-transparent-dark-very-light ps-2 pt-2 pb-2 fs-16" style={{ display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check2-circle fs-22 fw-700" style={{ color: "rgb(20, 193, 20)", marginRight: "8px", marginTop: "-4px" }}></i>
                                        <span className="text-start lh-sm">
                                            We will select the best-suited valuation approach based on the industry, size of the company,
                                            and years of experience.
                                        </span>
                                    </li>
                                    <li className="border-color-transparent-dark-very-light ps-2 pt-2 pb-2 fs-16" style={{ display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check2-circle fs-22 fw-700" style={{ color: "rgb(20, 193, 20)", marginRight: "8px", marginTop: "-4px" }}></i>
                                        <span className="text-start lh-sm">
                                            We will select the best-suited valuation approach based on the industry, size of the company,
                                            and years of experience.
                                        </span>
                                    </li>
                                </ul>

                            </div>
                        </div>
                        <div className="col-lg-7 ">
                            <img src={howitworrks_2} className="w-100 border-radius-6px" alt="" style={{ boxShadow: "0 15px 60px -30px rgba(0,0,0,1)" }} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white position-relative padding-60-60  half-section overflow-hidden " style={{ borderBottom: "1px solid #e1eafcb5", paddingBottom: "0px !important" }}>
                <img src={icon_bg_6} className="position-absolute top-0px left-0px skrollable skrollable-between" data-bottom-top="transform: translateY(150px)" data-top-bottom="transform: translateY(-150px)" alt="" style={{ transform: "translateY(17.3203px)" }} data-no-retina="" />
                <img src={icon_bg_7} className="position-absolute top-10 right-0px skrollable skrollable-between" data-bottom-top="transform: translateY(150px)" data-top-bottom="transform: translateY(-150px)" alt="" style={{ transform: "translateY(60.1641px)" }} data-no-retina="" />
                <div className="container position-relative z-index-1">
                    <h4 className="fw-600   mb-2 d-block  text-base-color text-center margin-4px">We provide advanced solutions to
                        <span style={{ color: "#4ea8f6" }}> growing.</span>
                    </h4>
                    <div className="row row-cols-1 row-cols-lg-4 row-cols-md-2 justify-content-center mb-3 appear anime-child anime-complete" useRef={elementRef1}>
                        <div className="col icon-with-text-style-04 transition-inner-all mb-30px">
                            <div className="feature-box bg-lavender-violet text-center justify-content-start h-100 border-radius-6px p-5 lg-p-10">
                                <div className="feature-box-icon mb-25px">
                                    <img src={icon_4} alt="" data-no-retina="" />
                                </div>
                                <div className="feature-box-content last-paragraph-no-margin">
                                    <span className="d-inline-block text-base-color fw-600 fs-18 alt-font mb-5px">Prescriptive analytics</span>
                                    <p className="gray-text fs-16">This model is idea-driven as it involves daily engagement activities with clients.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col icon-with-text-style-04 transition-inner-all mb-30px">
                            <div className="feature-box bg-ghost-white text-center justify-content-start h-100 border-radius-6px p-5 lg-p-10">
                                <div className="feature-box-icon mb-25px">
                                    <img src={icon_1} alt="" data-no-retina="" />
                                </div>
                                <div className="feature-box-content last-paragraph-no-margin">
                                    <span className="d-inline-block text-base-color fw-600 fs-18 alt-font mb-5px">Real-time segmentation</span>
                                    <p className="gray-text fs-16">This model is idea-driven as it involves daily engagement activities with clients.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col icon-with-text-style-04 transition-inner-all mb-30px">
                            <div className="feature-box bg-lavender-violet-light text-center justify-content-start h-100 border-radius-6px p-5 lg-p-10">
                                <div className="feature-box-icon mb-25px">
                                    <img src={icon_6} alt="" data-no-retina="" />
                                </div>
                                <div className="feature-box-content last-paragraph-no-margin">
                                    <span className="d-inline-block text-base-color fw-600 fs-18 alt-font mb-5px">Business intelligence</span>
                                    <p className="gray-text fs-16">This model is idea-driven as it involves daily engagement activities with clients.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col icon-with-text-style-04 transition-inner-all mb-30px">
                            <div className="feature-box bg-cosmic-latte-white text-center justify-content-start h-100 border-radius-6px p-5 lg-p-10">
                                <div className="feature-box-icon mb-25px">
                                    <img src={icon_2} alt="" data-no-retina="" />
                                </div>
                                <div className="feature-box-content last-paragraph-no-margin">
                                    <span className="d-inline-block text-base-color fw-600 fs-18 alt-font mb-5px">Exploratory data analysis</span>
                                    <p className="gray-text fs-16">This model is idea-driven as it involves daily engagement activities with clients.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="padding-60-60 w-100 text-center  bg-white">
                <div className="container">
                    <div className="row justify-content-center">
                        <h4 className="fw-600   mb-2 d-block  text-base-color margin-4px">Valuation Multiples sourced from a trusted
                            <span style={{ color: "#4ea8f6" }}>Database</span>
                        </h4>
                        <p className="gray-text fs-16 lh-28">To provide you with a thorough and trustworthy understanding of the
                            valuation of your business, your inputs and our data are integrated into different valuation techniques.</p>
                        <div className="col-lg-6 d-flex ">
                            <img src={howitworrks_2} className="w-100 border-radius-6px" alt="" style={{ boxShadow: "0 15px 60px -30px rgba(0,0,0,1)", height: "400px" }} />
                        </div>
                        <div className="col-lg-6 ">
                            <img src={howitworrks_3} className=" md-mt-15px border-radius-6px" alt="" style={{ boxShadow: "0 15px 60px -30px rgba(0,0,0,1)", height: "400px" }} />
                        </div>
                    </div>
                </div>

            </section>
        </>
    );
};

export default HowItWorks;
