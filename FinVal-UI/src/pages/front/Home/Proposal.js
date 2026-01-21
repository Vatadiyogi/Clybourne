import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import blog_1 from '../../../assets/finimg/money-time-effort.jpg';
import blog_2 from '../../../assets/finimg/businessmen-elegant-suits-business-meeting-discussing-new-project-office.jpg';
import blog_3 from '../../../assets/finimg/customized-valuation-approach.jpg';
import blog_4 from '../../../assets/finimg/curated-with-personal-touch.jpg';
import blog_5 from '../../../assets/finimg/pay-less.jpg';
import blog_6 from '../../../assets/finimg/people-office.jpg';

const Proposal = () => {
    const elementRef2 = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime.timeline()
                    .add({
                        targets: elementRef2.current,
                        delay: 200,
                        duration: 7000,
                        stagger: 300, // Stagger effect with delay between each element
                        easing: 'easeOutQuad',
                        opacity: [1, 1],
                        translateY: [0, 0]
                    })
    
                    observer.unobserve(entry.target); // Unobserve once the animation starts
                }
            });
        });
    
        // Only observe if the elements exist
        if (elementRef2.current) observer.observe(elementRef2.current);
    
        // Cleanup on component unmount
        return () => {
            if (elementRef2.current) observer.unobserve(elementRef2.current);
        };
    }, []);
    
   return (
    <section className="bg-very-light-gray overflow-hidden big-section padding-60-60">
        <div className="container">
            <div className="row justify-content-center margin-8px">
                <div className="col-lg-7 text-center" useRef={elementRef2}>
                    <span className="fs-16 d-inline-block fw-500 text-uppercase  ls-1px" style={{ color: "#787777" }}>to assist you</span>
                    <h2 className="alt-font  fw-600 ls-minus-1px text-base-color mb-2 margin-8px">How we <span style={{ color: "#4ea8f6" }}>propose</span></h2>
                </div>
            </div>

            <div className="row appear anime-complete" useRef={elementRef2}>
            <div className="col-12 filter-content p-md-0">
    <ul
        className="portfolio-wrapper grid grid-3col xxl-grid-1col xl-grid-1col lg-grid-1col md-grid-1col sm-grid-1col xs-grid-1col gi gutter-extra-large"
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "10px",
        }}
    >
        {/* Grid Item 1 */}
        <li className="grid-item design transition-inner-all pt-0">
            <div className="services-box-style-06 border-radius-6px hover-box overflow-hidden box-shadow-large">
                <div className="image">
                    <a href="/">
                        <img
                            src={blog_1}
                            alt=""
                            style={{ height: "200px", objectFit: "cover", width: "100%" }}
                        />
                    </a>
                </div>
                <div className="bg-white position-relative" style={{ height: "260px" }}>
                    <div style={{ padding: "15px" }}>
                        <div className="mb-5px">
                            <div className="heading-box-index">
                                <a
                                    href="/"
                                    className="d-inline-block alt-font text-base-color fw-600 mb-2 fs-18 lh-28"
                                >
                                    Value Your Business in Just 24 Hours
                                </a>
                            </div>
                            <p
                                className="sm-mb-15px fs-16 lh-28"
                                style={{ color: "#787777" }}
                            >
                                Fill out the requested information in the valuation dashboard, and
                                you'll get intuitive results in a professional report in less than a
                                day.
                            </p>
                        </div>
                    </div>
                    <div style={{ position: "absolute", bottom: "10px", left: "30%" }}>
                        <a
                            href="/"
                            className="btn btn-box-shadow btn-large btn-round-edge d-table d-lg-inline-block md-mx-auto"
                            style={{
                                backgroundColor: "#4ea8f6",
                                color: "white",
                                padding: "12px",
                            }}
                        >
                            LEARN MORE
                        </a>
                    </div>
                </div>
            </div>
        </li>
        <li className="grid-item development business marketing transition-inner-all pt-0">
            <div className="services-box-style-06 border-radius-6px hover-box overflow-hidden box-shadow-large">
                <div className="image">
                    <a href="/">
                        <img
                            src={blog_2}
                            alt=""
                            style={{ height: "200px", objectFit: "cover", width: "100%" }}
                        />
                    </a>
                </div>
                <div className="bg-white position-relative" style={{ height: "260px" }}>
                    <div style={{ padding: "15px" }}>
                        <div className="mb-5px">
                            <div className="heading-box-index">
                                <a
                                    href="/"
                                    className="d-inline-block alt-font text-base-color fw-600 mb-2 fs-18 lh-28"
                                >
                                    Benchmark Your Company
                                </a>
                            </div>
                            <p
                                className="sm-mb-15px fs-16 lh-28"
                                style={{ color: "#787777" }}
                            >
                                Benchmark the valuation multiples with other companies in similar
                                industries to extract a reliable market value for your business.
                            </p>
                        </div>
                    </div>
                    <div style={{ position: "absolute", bottom: "10px", left: "30%" }}>
                        <a
                            href="/"
                            className="btn btn-box-shadow btn-large btn-round-edge d-table d-lg-inline-block md-mx-auto"
                            style={{
                                backgroundColor: "#4ea8f6",
                                color: "white",
                                padding: "12px",
                            }}
                        >
                            LEARN MORE
                        </a>
                    </div>
                </div>
            </div>
        </li>
        <li className="grid-item design transition-inner-all pt-0">
            <div className="services-box-style-06 border-radius-6px hover-box overflow-hidden box-shadow-large">
                <div className="image">
                    <a href="/">
                        <img
                            src={blog_3}
                            alt=""
                            style={{ height: "200px", objectFit: "cover", width: "100%" }}
                        />
                    </a>
                </div>
                <div className="bg-white position-relative" style={{ height: "260px" }}>
                    <div style={{ padding: "15px" }}>
                        <div className="mb-5px">
                            <div className="heading-box-index">
                                <a
                                    href="/"
                                    className="d-inline-block alt-font text-base-color fw-600 mb-2 fs-18 lh-28"
                                >
                                    Customized Valuation Approach
                                </a>
                            </div>
                            <p
                                className="sm-mb-15px fs-16 lh-28"
                                style={{ color: "#787777" }}
                            >
                                While most of the valuation portals are using DCF only approach, we employ a weighted average approach that includes results of DCF and Relative Valuation.
                            </p>
                        </div>
                    </div>
                    <div style={{ position: "absolute", bottom: "10px", left: "30%" }}>
                        <a
                            href="/"
                            className="btn btn-box-shadow btn-large btn-round-edge d-table d-lg-inline-block md-mx-auto"
                            style={{
                                backgroundColor: "#4ea8f6",
                                color: "white",
                                padding: "12px",
                            }}
                        >
                            LEARN MORE
                        </a>
                    </div>
                </div>
            </div>
        </li>
        <li className="grid-item design transition-inner-all pt-0">
            <div className="services-box-style-06 border-radius-6px hover-box overflow-hidden box-shadow-large">
                <div className="image">
                    <a href="/">
                        <img
                            src={blog_4}
                            alt=""
                            style={{ height: "200px", objectFit: "cover", width: "100%" }}
                        />
                    </a>
                </div>
                <div className="bg-white position-relative" style={{ height: "260px" }}>
                    <div style={{ padding: "15px" }}>
                        <div className="mb-5px">
                            <div className="heading-box-index">
                                <a
                                    href="/"
                                    className="d-inline-block alt-font text-base-color fw-600 mb-2 fs-18 lh-28"
                                >
                                    Curated with Personal Touch
                                </a>
                            </div>
                            <p
                                className="sm-mb-15px fs-16 lh-28"
                                style={{ color: "#787777" }}
                            >
                                We combine Business Intelligence with Human Intelligence to offer trusted and customized valuation reports that are specific to your business.
                            </p>
                        </div>
                    </div>
                    <div style={{ position: "absolute", bottom: "10px", left: "30%" }}>
                        <a
                            href="/"
                            className="btn btn-box-shadow btn-large btn-round-edge d-table d-lg-inline-block md-mx-auto"
                            style={{
                                backgroundColor: "#4ea8f6",
                                color: "white",
                                padding: "12px",
                            }}
                        >
                            LEARN MORE
                        </a>
                    </div>
                </div>
            </div>
        </li>
        <li className="grid-item design transition-inner-all pt-0">
            <div className="services-box-style-06 border-radius-6px hover-box overflow-hidden box-shadow-large">
                <div className="image">
                    <a href="/">
                        <img
                            src={blog_5}
                            alt=""
                            style={{ height: "200px", objectFit: "cover", width: "100%" }}
                        />
                    </a>
                </div>
                <div className="bg-white position-relative" style={{ height: "260px" }}>
                    <div style={{ padding: "15px" }}>
                        <div className="mb-5px">
                            <div className="heading-box-index">
                                <a
                                    href="/"
                                    className="d-inline-block alt-font text-base-color fw-600 mb-2 fs-18 lh-28"
                                >
                                    Pay Less
                                </a>
                            </div>
                            <p
                                className="sm-mb-15px fs-16 lh-28"
                                style={{ color: "#787777" }}
                            >
                               No need to spend heavily for your company valuation and put in hours and hours of human efforts to value your business.
                            </p>
                        </div>
                    </div>
                    <div style={{ position: "absolute", bottom: "10px", left: "30%" }}>
                        <a
                            href="/"
                            className="btn btn-box-shadow btn-large btn-round-edge d-table d-lg-inline-block md-mx-auto"
                            style={{
                                backgroundColor: "#4ea8f6",
                                color: "white",
                                padding: "12px",
                            }}
                        >
                            LEARN MORE
                        </a>
                    </div>
                </div>
            </div>
        </li>
        <li className="grid-item design transition-inner-all pt-0">
            <div className="services-box-style-06 border-radius-6px hover-box overflow-hidden box-shadow-large">
                <div className="image">
                    <a href="/">
                        <img
                            src={blog_6}
                            alt=""
                            style={{ height: "200px", objectFit: "cover", width: "100%" }}
                        />
                    </a>
                </div>
                <div className="bg-white position-relative" style={{ height: "260px" }}>
                    <div style={{ padding: "15px" }}>
                        <div className="mb-5px">
                            <div className="heading-box-index">
                                <a
                                    href="/"
                                    className="d-inline-block alt-font text-base-color fw-600 mb-2 fs-18 lh-28"
                                >
                                    Reliable Data Sources
                                </a>
                            </div>
                            <p
                                className="sm-mb-15px fs-16 lh-28"
                                style={{ color: "#787777" }}
                            >
                              Data used to source valuation multiples and other vital parameters is extracted from trusted and reliable sources.
                            </p>
                        </div>
                    </div>
                    <div style={{ position: "absolute", bottom: "10px", left: "30%" }}>
                        <a
                            href="/"
                            className="btn btn-box-shadow btn-large btn-round-edge d-table d-lg-inline-block md-mx-auto"
                            style={{
                                backgroundColor: "#4ea8f6",
                                color: "white",
                                padding: "12px",
                            }}
                        >
                            LEARN MORE
                        </a>
                    </div>
                </div>
            </div>
        </li>
        
    </ul>
</div>

            </div>
        </div>
    </section>
   );
}

export default Proposal;