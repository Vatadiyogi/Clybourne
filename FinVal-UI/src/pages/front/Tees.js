import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const Testimonial = () => {
    const elementRef8 = useRef(null);

    useEffect(() => {
        // Multiple animations
        anime.timeline()
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
            <section className="big-section position-relative pt-60px pb-0">
                <div id="particles-01" data-particle="true" data-particle-options='{"particles": {"number": {"value": 20,"density": {"enable": true,"value_area": 1000}},"color":{"value":["#ff5b74", "#820f89"]},"shape": {"type": "circle","stroke":{"width":0,"color":"#000000"}},"opacity": {"value": 0.7,"random": false,"anim": {"enable": false,"speed": 2,"sync": false}},"size": {"value": 6,"random": true,"anim": {"enable": false,"sync": true}},"move": {"enable": true,"speed":2,"direction": "right","random": false,"straight": false}},"interactivity": {"detect_on": "canvas","events": {"onhover": {"enable": false,"mode": "repulse"},"onclick": {"enable": false,"mode": "push"},"resize": true}},"retina_detect": false}'
                    className="position-absolute top-0px left-0px w-100  h-100 z-index-minus-1 bg-white"></div>
                <div className="container">
                    <div className="row justify-content-center overlap-section  g-0">
                        <div className="col-auto text-center last-paragraph-no-margin bg-white pt-20px pb-20px ps-6 pe-6 border-radius-100px" useRef={elementRef8}>
                            <div className="d-inline-block  fs-24 align-middle fw-700 text-base-color">
                                <span className="text-decoration-line-bottom-medium fw-600">Loved by most valuable
                                    <span style={{ color: "#4ea8f6" }}>customers</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 text-center"
                            data-anime='{ "rotateX": [-40, 0], "opacity": [0,1], "duration": 1200, "delay": 100, "staggervalue": 150, "easing": "easeOutQuad" }'>
                            <div className="swiper swiper-horizontal-3d pt-8 lg-pt-10  md-pt-12 sm-pt-15  swiper-pagination-bottom testimonials-style-04 "
                                data-slider-options='{ "loop": true, "slidesPerView": 1,"centeredSlides":true,"effect":"coverflow","coverflowEffect":{"rotate":0,"stretch":100,"depth":150,"modifier":1.5,"slideShadows":true}, "navigation": { "nextEl": ".swiper-button-next-nav.slider-navigation-style-04", "prevEl": ".swiper-button-previous-nav.slider-navigation-style-04" }, "autoplay": { "delay": 5000, "disableOnInteraction": false }, "pagination": { "el": ".swiper-pagination-04", "clickable": true, "dynamicBullets": true }, "breakpoints": { "768": { "slidesPerView": 2 } } }'>
                                <div className="swiper-wrapper">
                                    <div className="swiper-slide bg-white border-radius-4px">
                                        <div className="position-relative ps-10 pe-10 md-ps-10 md-pe-10 sm-ps-7 sm-pe-7 pt-20 pb-10 lg-pt-22 md-pt-30 sm-pt-20">
                                            <img alt="" src="https://craftohtml.themezaa.com/images/avtar-24.jpg" className="absolute-middle-center top-0px rounded-circle w-150px xs-w-100px border border-color-white box-shadow-extra-large border-8" />
                                            <div className="testimonials-content">
                                                <span className=" fs-20 lh-30 fw-600 mb-5px d-block" style={{ color: "#4ea8f6" }}>Just love their design for all stunning details!</span>
                                                <p className="mb-25px fs-16 lh-28" style={{ color: "#787777" }}>These sounded far better than expected for the price. The cord is a tad shorter than others I have purchased so take note. Great for a good value.</p>
                                            </div>
                                            <div className="testimonials-author fs-18 mb-5px fw-600 d-inline-block" style={{ color: "#ffc30f" }}> Alexander Harvard</div>
                                            <div className="testimonials-position fs-15 lh-20" style={{ color: "#787777" }}>Themezaa Design</div>
                                        </div>
                                    </div>
                                    
                                    <div className="swiper-slide bg-white border-radius-4px">
                                        <div className="position-relative ps-10 pe-10 md-ps-10 md-pe-10 sm-ps-7 sm-pe-7 pt-20 pb-10 lg-pt-22 md-pt-30 sm-pt-20">
                                            <img alt="" src="https://craftohtml.themezaa.com/images/avtar-24.jpg" className="absolute-middle-center top-0px rounded-circle w-150px xs-w-100px border border-color-white box-shadow-extra-large border-8" />
                                            <div className="testimonials-content">
                                                <span className="text-base-color fs-18 lh-30 fw-600 mb-5px d-block" style={{ color: "#4ea8f6" }}>Every element is designed beautifully!</span>
                                                <p className="mb-25px fs-16 lh-28" style={{ color: "#787777" }}>These are great headphones for music and movies for the price. I have never owned a big-money pair of headphones. It's a good pair of headphones.</p>
                                            </div>
                                            <div className="testimonials-author fs-18 mb-5px fw-600 d-inline-block" style={{ color: "#ffc30f" }}>Shoko Mugikura</div>
                                            <div className="testimonials-position fs-15 lh-20" style={{ color: "#787777" }}>Google Design</div>
                                        </div>
                                    </div>
                                    
                                    <div className="swiper-slide bg-white border-radius-4px">
                                        <div className="position-relative ps-10 pe-10 md-ps-10 md-pe-10 sm-ps-7 sm-pe-7 pt-20 pb-10 lg-pt-22 md-pt-30 sm-pt-20">
                                            <img alt="" src="https://craftohtml.themezaa.com/images/avtar-24.jpg" className="absolute-middle-center top-0px rounded-circle w-150px xs-w-100px border border-color-white box-shadow-extra-large border-8" />
                                            <div className="testimonials-content">
                                                <span className=" fs-18 lh-30 fw-600 mb-5px d-block" style={{ color: "#4ea8f6" }}>Simple and easy to integrate the website!</span>
                                                <p className="mb-25px fs-16 lh-28" style={{ color: "#787777" }}>I was surprised at the sound quality from these phones right out of the box. I'm a fan of the sound and normally use with my home equipment.</p>
                                            </div>
                                            <div className="testimonials-author fs-18 mb-5px fw-600 d-inline-block" style={{ color: "#ffc30f" }}> Herman Miller</div>
                                            <div className="testimonials-position fs-15 lh-20" style={{ color: "#787777" }}>Apple Design</div>
                                        </div>
                                    </div>
                                    
                                    <div className="swiper-slide bg-white border-radius-4px">
                                        <div className="position-relative ps-13 pe-13 md-ps-10 md-pe-10 sm-ps-7 sm-pe-7 pt-20 pb-10 lg-pt-22 md-pt-30 sm-pt-20">
                                            <img alt="" src="https://craftohtml.themezaa.com/images/avtar-24.jpg" className="absolute-middle-center top-0px rounded-circle w-150px xs-w-100px border border-color-white box-shadow-extra-large border-8" />
                                            <div className="testimonials-content">
                                                <span className="fs-18 lh-30 fw-600 mb-5px d-block" style={{ color: "#4ea8f6" }}>Every element is designed beautifully!</span>
                                                <p className="mb-25px fs-16 lh-28" style={{ color: "#787777" }}>These are great headphones for music and movies for the price. I have never owned a big-money pair of headphones. It's a good pair of headphones.</p>
                                            </div>
                                            <div className="testimonials-author fs-18 mb-5px fw-600 d-inline-block" style={{ color: "#ffc30f" }}> Shoko Mugikura</div>
                                            <div className="testimonials-position fs-15 lh-20" style={{ color: "#787777" }}>Google Design</div>
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

export default Testimonial;
