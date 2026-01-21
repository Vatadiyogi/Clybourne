import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import banner from '../../../assets/finimg/banner-without-text-final.png';

const Banner = () => {
    const bannerStyle = {
        backgroundImage: `url(${banner})`,
    };

    const elementRef1 = useRef(null);
    const elementRef2 = useRef(null);
    const elementRef3 = useRef(null);

    useEffect(() => {
        // Multiple animations
        anime.timeline()
            .add({
                targets: elementRef1.current,
                delay: 0,
                duration: 700,
                stagger: 300,
                easing: 'easeOutQuad',
                opacity: [1, 1],
                translateY: [0, 0],
            })
            .add({
                targets: elementRef2.current,
                delay: 200,
                duration: 7000,
                stagger: 300,
                easing: 'easeOutQuad',
                opacity: [1, 1],
                translateY: [0, 0],
            })
            .add({
                targets: elementRef2.current,
                delay: 200,
                duration: 7000,
                stagger: 300,
                easing: 'easeOutQuad',
                opacity: [1, 1],
                translateY: [0, 0],
            });
    }, []);

    return (
        <section className="p-0">
            <Swiper
                modules={[Autoplay, Navigation, Pagination, EffectFade]}
                effect="fade"
                slidesPerView={1}
                loop={true}
                navigation
                autoplay={{ delay: 4000, stopOnLastSlide: true, disableOnInteraction: false }}
                keyboard={{ enabled: true, onlyInViewport: true }}
                style={{ height: '70vh' }}
            >
                <SwiperSlide>
                    <div className="position-absolute left-0px top-0px w-100 h-100 cover-background" style={bannerStyle} ref={elementRef1}></div>
                    <div className="opacity-light"></div>
                    <div className="container h-100 w-100">
                        <div className="row align-items-center h-100 w-100 justify-content-left mt-1">
                            <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 position-relative p-0">
                                <div className="d-inline-block position-relative mb-35px" ref={elementRef3}>
                                    <h2 className="d-inline-block fw-400 text-base-color mb-0 fs-55">
                                        Calculate a fair valuation for your <span className="text-golden-color fw-600">Startup</span>
                                    </h2>
                                </div>

                                <a href="/" className="btn btn-box-shadow btn-large banner-btn-1 btn-round-edge fw-700" style={{ marginRight: '5px' }} ref={elementRef3}>
                                    <i className="feather icon-feather-video"></i> Watch Video
                                </a>
                                <a href="/" className="btn btn-box-shadow btn-large banner-btn-1 btn-round-edge fw-700" ref={elementRef3}>
                                    <i className="feather icon-feather-shopping-bag"></i> Buy now
                                </a>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="position-absolute left-0px top-0px w-100 h-100 cover-background" style={bannerStyle} ref={elementRef2}></div>
                    <div className="opacity-light"></div>
                    <div className="container h-100 w-100">
                        <div className="row align-items-center h-100 w-100 justify-content-left mt-1">
                            <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 position-relative p-0">
                                <div className="d-inline-block position-relative mb-35px" ref={elementRef3}>
                                    <h2 className="d-inline-block fw-400 text-base-color fs-55 mb-0">
                                        Industry leading methodology for <span className="text-sky-blue fw-600">Startup Valuation</span>
                                    </h2>
                                </div>

                                <a href="/" className="btn btn-box-shadow btn-large banner-btn btn-round-edge fw-700" style={{ marginRight: '5px' }} ref={elementRef3}>
                                    <i className="feather icon-feather-video"></i> Watch Video
                                </a>
                                <a href="/" className="btn btn-box-shadow btn-large banner-btn btn-round-edge fw-700" ref={elementRef3}>
                                    <i className="feather icon-feather-shopping-bag"></i> Buy now
                                </a>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </section>
    );
};

export default Banner;
