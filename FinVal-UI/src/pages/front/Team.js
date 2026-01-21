import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import banner from '../../assets/finimg/new-abouts-us-banner.png';
import team_main from '../../assets/finimg/team-main-removebg-preview.png';
import team_1 from '../../assets/finimg/team-1.jpg';
import team_2 from '../../assets/finimg/team-2.jpg';
import team_3 from '../../assets/finimg/team-3.jpg';
import team_4 from '../../assets/finimg/team-04.jpg';

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
                duration: 600,
                stagger: 200, // Stagger effect with delay between each element
                easing: 'easeOutQuad',
                opacity: [0, 1],
                translateY: [50, 0]
            })
            .add({
                targets: elementRef3.current,
                delay: 200,
                duration: 800,
                stagger: 200, // Stagger effect with delay between each element
                easing: 'easeOutQuad',
                opacity: [0, 1],
                translateY: [0, 0],
                perspective: [800,800],
                scale: [1.1, 1],
                rotateX: [30, 0]
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
                                    <h1 className="text-base-color alt-font mb-0 fw-600 ls-minus-1px">Our <span className="text-sky-blue">Team</span></h1>
                                </div>
                                <div className="mt-auto justify-content-center breadcrumb breadcrumb-style-01 alt-font text-white">
                                    <p className="text-base-color">Our dedicated team is here to fully support you and your business.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-0 bg-very-light-gray-contact" style={{ paddingTop: "60px" }}>
                <div className="container">
                    <div className="row  flex-column-reverse flex-lg-row text-center text-lg-start overflow-hidden">
                        <div className="col-xl-5 col-lg-6 col-md-8 col-sm-11" >
                            <img className="w-100" src={team_main} alt="" useRef={elementRef2} />
                        </div>
                        <div className="col-xl-5 offset-xl-1 col-lg-6 " useRef={elementRef1}>
                            <span className="ps-25px pe-25px mb-20px text-uppercase text-base-color fs-14 lh-40 fw-700 border-radius-100px bg-gradient-very-light-gray-transparent d-inline-flex align-self-start"><i className="bi bi-chat-square-dots fs-16 me-5px"></i>Words of team leader</span>

                            <h2 className="alt-font fw-600 text-base-color ls-minus-2px shadow-none mb-2 lh-50" data-shadow-animation="true" data-animation-delay="900">Teamwork wins <span className="text-sky-blue">championships.</span></h2>
                            <p className="w-90 xs-w-100 mx-auto mx-lg-0 gray-text fs-16 lh-28">Lorem ipsum dolor amet consectetur adipiscing elit eiusmod tempor incididunt labore et dolore magna ut enim ad consectetur minim veniam.
                                Lorem ipsum dolor amet consectetur adipiscing elit eiusmod tempor incididunt labore et dolore magna ut enim ad consectetur minim veniam.
                            </p>
                            <span className="fs-22 d-block text-base-color">@ <span className="fw-600">Matthew</span> taylor</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="padding-60-60 bg-white">
                <div className="container">
                    <div className="row justify-content-center mb-2">
                        <div className="col-lg-7 text-center margin-8px" useRef={elementRef2}>
                            <span className="fs-17 d-inline-block fw-500 text-uppercase  ls-1px " style={{ color: "#787777" }}>Finance consultants </span>
                            <h2 className="alt-font  fw-600 ls-minus-1px mb-0 text-base-color">Leadership <span style={{ color: "#4ea8f6" }}>Team</span></h2>
                        </div>
                    </div>
                    <div className="row row-cols-1 row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 justify-content-center" useRef={elementRef3}>
                        <div className="col text-center team-style-05  sm-mb-35px">
                            <div className="position-relative mb-25px last-paragraph-no-margin">
                                <img src={team_1} alt="" />
                                <div className="w-100 h-100 d-flex flex-column justify-content-end align-items-center p-40px lg-p-30px team-content bg-gradient-light-sky-transparent">
                                    <p className="text-white lh-32 w-70 xl-w-80 md-w-65 xs-w-60 absolute-middle-center opacity-7">Lorem ipsum simply text printing typesetting.</p>
                                    <div className="social-icon">
                                        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="text-white"><i className="fa-brands fa-facebook-f"></i></a>
                                        <a href="http://www.dribbble.com" target="_blank" rel="noreferrer" className="text-white"><i className="fa-brands fa-dribbble"></i></a>
                                        <a href="https://www.twitter.com/" target="_blank" rel="noreferrer" className="text-white"><i className="fa-brands fa-twitter"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="alt-font fw-500 text-base-color lh-28 fs-21">Jeremy dupont</div>
                            <span className="text-sky-blue fs-16">Founder</span>
                        </div>
                        
                        <div className="col text-center team-style-05  sm-mb-35px">
                            <div className="position-relative mb-25px last-paragraph-no-margin">
                                <img src={team_2} alt="" />
                                <div className="w-100 h-100 d-flex flex-column justify-content-end align-items-center p-40px lg-p-30px team-content bg-gradient-light-sky-transparent">
                                    <p className="text-white lh-32 w-70 xl-w-80 md-w-65 xs-w-60 absolute-middle-center opacity-7">Lorem ipsum simply text printing typesetting.</p>
                                    <div className="social-icon">
                                        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="text-white"><i className="fa-brands fa-facebook-f"></i></a>
                                        <a href="http://www.dribbble.com" target="_blank" rel="noreferrer" className="text-white"><i className="fa-brands fa-dribbble"></i></a>
                                        <a href="https://www.twitter.com/" target="_blank" rel="noreferrer" className="text-white"><i className="fa-brands fa-twitter"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="alt-font fw-500 text-base-color lh-28 fs-21">Jessica dover</div>
                            <span className="text-sky-blue fs-16">Analyst</span>
                        </div>
                        
                        <div className="col text-center team-style-05  sm-mb-35px">
                            <div className="position-relative mb-25px last-paragraph-no-margin">
                                <img src={team_3} alt="" />
                                <div className="w-100 h-100 d-flex flex-column justify-content-end align-items-center p-40px lg-p-30px team-content bg-gradient-light-sky-transparent">
                                    <p className="text-white lh-32 w-70 xl-w-80 md-w-65 xs-w-60 absolute-middle-center opacity-7">Lorem ipsum simply text printing typesetting.</p>
                                    <div className="social-icon">
                                        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="text-white"><i className="fa-brands fa-facebook-f"></i></a>
                                        <a href="http://www.dribbble.com" target="_blank" rel="noreferrer" className="text-white"><i className="fa-brands fa-dribbble"></i></a>
                                        <a href="https://www.twitter.com/" target="_blank" rel="noreferrer" className="text-white"><i className="fa-brands fa-twitter"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="alt-font fw-500 text-base-color lh-28 fs-21">Matthew taylor</div>
                            <span className="text-sky-blue fs-16">Advisor</span>
                        </div>
                        
                        <div className="col text-center team-style-05  sm-mb-35px">
                            <div className="position-relative mb-25px last-paragraph-no-margin">
                                <img src={team_4} alt="" />
                                <div className="w-100 h-100 d-flex flex-column justify-content-end align-items-center p-40px lg-p-30px team-content bg-gradient-light-sky-transparent">
                                    <p className="text-white lh-32 w-70 xl-w-80 md-w-65 xs-w-60 absolute-middle-center opacity-7">Lorem ipsum simply text printing typesetting.</p>
                                    <div className="social-icon">
                                        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="text-white"><i className="fa-brands fa-facebook-f"></i></a>
                                        <a href="http://www.dribbble.com" target="_blank" rel="noreferrer" className="text-white"><i className="fa-brands fa-dribbble"></i></a>
                                        <a href="https://www.twitter.com/" target="_blank" rel="noreferrer" className="text-white"><i className="fa-brands fa-twitter"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="alt-font fw-500 text-base-color lh-28 fs-21">Johncy parker</div>
                            <span className="text-sky-blue fs-16">Analyst</span>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default Team;
