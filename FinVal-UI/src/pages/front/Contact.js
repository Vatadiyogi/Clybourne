import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import banner from '../../assets/finimg/new-abouts-us-banner1.png';

const Contact = () => {
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
        // Multiple animations
        anime.timeline()
            .add({
                targets: elementRef1.current,
                delay: 0,
                duration: 400,
                stagger: 200, // Stagger effect with delay between each element
                easing: 'easeOutQuad',
                opacity: [0, 1],
                translateY: [30, 0]
            })
            .add({
                targets: elementRef2.current,
                delay: 0,
                duration: 400,
                stagger: 200, // Stagger effect with delay between each element
                easing: 'easeOutQuad',
                opacity: [0, 1],
                translateX: [30, 0]
            })
            .add({
                targets: elementRef3.current,
                delay: 0,
                duration: 1200,
                stagger: 150, // Stagger effect with delay between each element
                easing: 'easeOutQuad',
                opacity: [0, 1],
                translateX: [-50, 0]
            })
            .add({
                targets: elementRef4.current,
                delay: 0,
                duration: 1400,
                stagger: 150, // Stagger effect with delay between each element
                easing: 'easeOutQuad',
                opacity: [0, 1],
                translateY: [0, 0]
            })
            .add({
                targets: elementRef5.current,
                delay: 0,
                duration: 1200,
                stagger: 150, // Stagger effect with delay between each element
                easing: 'easeOutQuad',
                opacity: [0, 1],
                translateX: [50, 0]
            })
    }, []);

    return (
        <>
            <section className="d-none page-title-parallax-background half-section ipad-top-space-margin" style={bannerStyle}>
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-12 text-center position-relative page-title-extra-large">
                            <div className="d-flex flex-column h-100px">
                                <div className="mt-auto" useRef={elementRef1}>
                                    <h1 className="text-white alt-font mb-0 text-shadow-extra-large fw-500 ls-minus-1px">Contact us
                                    </h1>
                                </div>

                                <div className="mt-auto justify-content-center breadcrumb breadcrumb-style-01 alt-font text-white">
                                    <ul useRef={elementRef2}>
                                        <li><a href="/" className="text-white">Home</a></li>
                                        <li>Contact</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-very-light-gray-contact position-relative padding-60-60" >
                <div className="container">
                    <div className="row">
                        <div className="col-xl-5 col-lg-6 md-mb-50px appear anime-child anime-complete"  useRef={elementRef3}>
                            <div className="bg-white border-radius-6px box-shadow-quadruple-large p-5 ps-5 pe-5 lg-ps-6 lg-pe-6 h-100 d-flex flex-wrap flex-column justify-content-center appear anime-child anime-complete" useRef={elementRef4}>
                                <span className="ps-25px pe-25px mb-20px text-uppercase text-base-color fs-12 lh-40 fw-700 border-radius-100px bg-gradient-very-light-gray-transparent d-inline-flex align-self-start" ><i className="bi bi-chat-square-dots fs-16 me-5px"></i>Lets's work together</span>
                                <h4 className="text-base-color ls-minus-1px fw-700 mb-15px">Call Or Visit <span className="text-sky-blue">Us !</span></h4>
                                <p className="sm-w-100 gray-text fs-17 lh-28">We're here to help and answer any question you might have.</p>
                                <div className="row row-cols-1 row-cols-sm-2">
                                    <div className="col last-paragraph-no-margin" style={{ paddingRight: "2px" }}>
                                        <p className="text-sky-blue fw-600 fs-18 fs-18">Visit Us</p>
                                        <a href="https://maps.google.com/maps?ll=-37.805688,144.962312&amp;z=17&amp;t=m&amp;hl=en-US&amp;gl=IN&amp;mapclient=embed&amp;cid=13153204942596594449" target="_blank" className="gray-text fs-16 lh-28">401 Broadway, 24th Floor, Orchard View, India</a>
                                    </div>
                                    <div className="col last-paragraph-no-margin mb-25px">
                                        <p className="text-sky-blue fw-600 fs-18">Call us directly?</p>
                                        <a href="tel:12345678910" className="gray-text  fs-16 lh-28">+1 234 567 8910</a>
                                    </div>
                                    <div className="col last-paragraph-no-margin mb-25px">
                                        <p className="text-sky-blue fw-600 fs-18">Need live support?</p>
                                        <a href="mailto:info@domain.com" className="gray-text fs-16 lh-28">info@FinVal.com</a>
                                    </div>
                                    <div className="col last-paragraph-no-margin sm-mb-25px">
                                        <p className="text-sky-blue fw-600 fs-18">Join growing team?</p>
                                        <a href="mailto:join@domain.com" className="gray-text fs-16 lh-28">join@domain.com</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 offset-xl-1 md-mb-50px sm-mb-0 appear anime-child anime-complete" useRef={elementRef5}>
                            <h3 className="text-base-color ls-minus-2px fw-700">Looking for any <span className="text-sky-blue">help?</span></h3>
                            <form method="post" className="contact-form-style-03">
                                <label for="exampleInputEmail1" className="form-label fs-13 text-uppercase text-base-color fw-700 mb-0">Enter your name*</label>
                                <div className="position-relative form-group mb-20px">
                                    <span className="form-icon"><i className="bi bi-emoji-smile text-sky-blue"></i></span>
                                    <input className="fs-15 ps-0 border-radius-0px border-color-dark-gray bg-transparent form-control required " style={{ color: "#6c6a6a !important" }} id="exampleInputEmail1" type="text" name="name" placeholder="What's your good name" fdprocessedid="6q84wb" />
                                </div>

                                <label for="exampleInputEmail1" className="form-label fs-13 text-uppercase text-base-color fw-700 mb-0">Email address*</label>
                                <div className="position-relative form-group mb-20px">
                                    <span className="form-icon"><i className="bi bi-envelope text-sky-blue"></i></span>
                                    <input className="fs-15 ps-0 border-radius-0px border-color-dark-gray bg-transparent form-control required" id="exampleInputEmail2" type="email" name="email" placeholder="Enter your email address" fdprocessedid="ri8d4" />
                                </div>

                                <label for="exampleInputEmail1" className="form-label fs-13 text-uppercase text-base-color fw-700 mb-0">Your message</label>
                                <div className="position-relative form-group form-textarea mb-0">
                                    <textarea className="fs-15 ps-0 border-radius-0px border-color-dark-gray bg-transparent form-control" name="comment" placeholder="Describe about your project" rows="2"></textarea>
                                    <span className="form-icon"><i className="bi bi-chat-square-dots text-sky-blue"></i></span>
                                </div>

                                <div className="row mt-25px align-items-center">
                                    <div className="col-xl-7 col-lg-12 col-sm-7 lg-mb-30px md-mb-0">
                                        <p className="mb-0 fs-14 lh-22 text-center text-sm-start">We will never collect information about you without your explicit consent.</p>
                                    </div>
                                    <div className="col-xl-5 col-lg-12 col-sm-5 text-center text-sm-end text-lg-start text-xl-end xs-mt-25px">
                                        <input id="exampleInputEmail3" type="hidden" name="redirect" value="" />
                                        <button className="btn sky-blue-big-btn  btn-medium btn-round-edge btn-box-shadow submit" type="submit" fdprocessedid="qw2h8">Send message</button>
                                    </div>
                                    <div className="col-12 mt-20px mb-0 text-center text-md-start">
                                        <div className="form-results d-none"></div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;
