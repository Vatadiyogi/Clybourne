import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import banner from '../../assets/finimg/businessmen-elegant-suits-business-meeting-discussing-new-project-office.jpg';
import blogdetails from '../../assets/finimg/blogdetails.png';
import post_1 from '../../assets/finimg/related-blog1.jpg';
import post_2 from '../../assets/finimg/recent-post-2.jpg';
import post_3 from '../../assets/finimg/recent-post-3.jpg';

const BlogDetails = () => {
    const elementRef1 = useRef(null);
    const elementRef2 = useRef(null);
    const elementRef3 = useRef(null);

    useEffect(() => {
        // Multiple animations
        anime.timeline()
            .add({
                targets: elementRef1.current,
                translateX: [30, 0],
                opacity: [0, 1],
                duration: 400,
                delay: 0,
                easing: 'easeOutQuad',
                stagger: 200 // Stagger effect with delay between each element
            })
            .add({
                targets: elementRef2.current,
                delay: 100,
                duration: 400,
                easing: 'easeOutQuad',
                opacity: [0, 1],
                translateY: [30, 0],
                stagger: 200, // Stagger effect with delay between each element
            })
            .add({
                targets: elementRef3.current,
                delay: 0,
                duration: 1200,
                easing: 'easeOutQuad',
                opacity: [0, 1],
                translateY: [50, 0],
                stagger: 200, // Stagger effect with delay between each element
            })
    }, []);

    return (
        <>
            <section className="page-title-parallax-background half-section p-0 sm-h-200px" style={{ position: "relative", height: "300px", width: "100%" }}>
                <img src={banner} alt="Business Meeting" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.2)" }}></div>
                <div className="overlay-content" style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", textAlign: "center" }}>
                    <div className="container mt-20px">
                        <div className="row align-items-center justify-content-center">
                            <div className="col-12 text-center position-relative page-title-extra-large">
                                <div className="d-flex flex-column h-100px">
                                    <div className="mt-auto" useRef={elementRef2}>
                                        <h2 className="text-white alt-font mb-0 text-shadow-extra-large fw-500 ls-minus-1px sm-fs-40" style={{ fontSize: "55px" }}>The next generation workflow <span className="text-sky-blue">solution</span></h2>
                                    </div>
                                    <div className="mt-auto justify-content-center breadcrumb breadcrumb-style-01 alt-font text-white">
                                        <ul useRef={elementRef1}>
                                            <li><a href="/" className="text-white fw-500 sm-fs-15 " style={{ fontStyle: "italic" }}>Posted on: 15 Aug 2024 | By Den viliamson</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="position-relative padding-60-60">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 pe-3 order-2 order-lg-1 lg-pe-3 md-pe-15px" style={{ borderRight: "1px solid #dbd8d8" }} useRef={elementRef3}>
                            <div className="position-sticky " style={{ marginTop: "-20px" }}>
                                <div className=" p-2 mb-30px" style={{ borderBottom: "1px solid #dbd8d8" }}>
                                    <h3 className="widget_title text-base-color pt-4 ">Recents <span className="text-sky-blue">Blogs</span></h3>
                                    <div className="recent-post-wrap">
                                        <div className="recent-post">
                                            <div className="media-img">
                                                <a href="/"><img src={post_1} alt="Blog" /></a>
                                            </div>
                                            <div className="media-body">
                                                <h4 className="post-title"><a className="text-inherit " href="/">Unsatiable entreaties may collecting Power.</a></h4>
                                                <div className="recent-post-meta "><a href="/" className="gray-text"><i className="feather icon-feather-calendar  text-sky-blue"></i>21 June, 2024</a></div>
                                            </div>
                                        </div>
                                        <div className="recent-post">
                                            <div className="media-img">
                                                <a href="/"><img src={post_2} alt="Blog" /></a>
                                            </div>
                                            <div className="media-body">
                                                <h4 className="post-title"><a className="text-inherit " href="/">Regional Manager limited time management.</a></h4>
                                                <div className="recent-post-meta"><a href="/" className="gray-text"><i className="feather icon-feather-calendar  text-sky-blue"></i>22 June, 2024</a></div>
                                            </div>
                                        </div>
                                        <div className="recent-post">
                                            <div className="media-img">
                                                <a href="/"><img src={post_3} alt="Blog" /></a></div>
                                            <div className="media-body">
                                                <h4 className="post-title"><a className="text-inherit " href="/">What’s the Holding Back It Solution Industry?</a></h4>
                                                <div className="recent-post-meta">
                                                    <a href="/" className="gray-text"><i className="feather icon-feather-calendar  text-sky-blue"></i>23 June, 2024</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <h3 className="widget_title text-base-color pt-4 ">Categories</h3>
                                    <ul className="p-0 m-0 list-style-02 ">
                                        <li className="pb-15px mb-15px border-bottom border-color-extra-medium-gray align-items-center ">
                                            <a href="/" className="text-base-color">Finance</a>
                                            <i className="feather icon-feather-arrow-right ms-auto text-base-color"></i>
                                        </li>
                                        <li className="pb-15px mb-15px border-bottom border-color-extra-medium-gray align-items-center text-base-color">
                                            <a href="/" className="text-sky-blue text-base-color-hover">Wealth management</a>
                                            <i className="feather icon-feather-arrow-right ms-auto text-sky-blue"></i>
                                        </li>
                                        <li className="pb-15px mb-15px border-bottom border-color-extra-medium-gray align-items-center">
                                            <a href="/" className="text-base-color">Business</a>
                                            <i className="feather icon-feather-arrow-right ms-auto text-base-color"></i>
                                        </li>
                                        <li className="pb-15px align-items-center">
                                            <a href="/" className="text-base-color">Audit assurance</a>
                                            <i className="feather icon-feather-arrow-right ms-auto text-base-color"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-8 order-1 order-lg-2 md-mb-50px ps-3" useRef={elementRef3}>
                            <h4 className="text-base-color fw-600 ls-minus-1px alt-font mb-2 d-block margin-7px">The next generation workflow <span className="text-sky-blue">solution</span></h4>
                            <p className="gray-text fs-16 lh-28">Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet consectetur
                                adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>

                            <img src={blogdetails} className="md-mt-15px border-radius-6px" alt="" />
                            <h5 className="text-base-color fw-600 ls-minus-1px alt-font padding-50-50 mb-0 d-block"> Wealth management range of industries</h5>

                            <div className="row row-cols-1 row-cols-lg-2 row-cols-md-2 align-items-center justify-content-center">
                                <div className="col icon-with-text-style-08 sm-mb-20px">
                                    <div className="feature-box feature-box-left-icon-middle">
                                        <div className="feature-box-icon feature-box-icon-rounded w-90px h-90px rounded-circle bg-white box-shadow-medium-bottom">
                                            <i className="feather icon-feather-briefcase icon-very-medium text-sky-blue"></i>
                                        </div>
                                        <div className="feature-box-content">
                                            <span className="d-inline-block fs-20 alt-font fw-500 text-base-color w-90 md-w-95">Travel and aviation consulting</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col last-paragraph-no-margin">
                                    <p className="gray-text fs-16 lh-28">Lorem ipsum dolor sit amet consectetur adipiscing elit eiusmod tempor.</p>
                                </div>
                            </div>

                            <div className="divider-style-03 divider-style-03-01 border-color-extra-medium-gray mb-35px mt-35px"></div>

                            <div className="row row-cols-1 row-cols-xl-2 row-cols-lg-2 row-cols-md-2 align-items-center justify-content-center">
                                <div className="col icon-with-text-style-08 sm-mb-20px">
                                    <div className="feature-box feature-box-left-icon-middle">
                                        <div className="feature-box-icon feature-box-icon-rounded w-90px h-90px rounded-circle bg-white box-shadow-medium-bottom">
                                            <i className="feather icon-feather-shopping-bag icon-very-medium text-sky-blue"></i>
                                        </div>
                                        <div className="feature-box-content">
                                            <span className="d-inline-block fs-20 alt-font fw-500 text-base-color w-90 md-w-95">Consumer products consulting</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col last-paragraph-no-margin">
                                    <p className="gray-text fs-16 lh-28">Lorem ipsum dolor sit amet consectetur adipiscing elit eiusmod tempor.</p>
                                </div>
                            </div>

                            <div className="divider-style-03 divider-style-03-01 border-color-extra-medium-gray mb-35px mt-35px"></div>

                            <div className="row row-cols-1 row-cols-xl-2 row-cols-lg-2 row-cols-md-2 align-items-center justify-content-center">
                                <div className="col icon-with-text-style-08 sm-mb-20px">
                                    <div className="feature-box feature-box-left-icon-middle">
                                        <div className="feature-box-icon feature-box-icon-rounded w-90px h-90px rounded-circle bg-white box-shadow-medium-bottom">
                                            <i className="feather icon-feather-archive icon-very-medium text-sky-blue"></i>
                                        </div>
                                        <div className="feature-box-content">
                                            <span className="d-inline-block fs-20 alt-font fw-500 text-base-color w-90 md-w-95">Financial services consulting</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col last-paragraph-no-margin">
                                    <p className="gray-text fs-16 lh-28">Lorem ipsum dolor sit amet consectetur adipiscing elit eiusmod tempor.</p>
                                </div>
                            </div>

                            <div className="bg-base-color p-7 sm-p-35px mt-5 border-radius-6px">
                                <h5 className="text-white fw-500 ls-minus-1px alt-font mb-30px d-block">Benefits and covered services</h5>
                                <div className="row row-cols-1 row-cols-xl-2 row-cols-md-2">
                                    <div className="col">
                                        <ul className="p-0 m-0 list-style-02 text-white">
                                            <li className="pb-10px"><i className="fa-solid fa-check fs-16  green-check-color me-10px"></i>Private wealth management</li>
                                            <li className="pb-10px"><i className="fa-solid fa-check fs-16  green-check-color me-10px"></i>Global wealth management</li>
                                            <li className="pb-10px"><i className="fa-solid fa-check fs-16 green-check-color me-10px"></i>Global sports & entertainment</li>
                                            <li className="pb-10px"><i className="fa-solid fa-check fs-16 green-check-color me-10px"></i>Zero broker commission</li>
                                        </ul>
                                    </div>
                                    <div className="col">
                                        <ul className="p-0 m-0 list-style-02 text-white">
                                            <li className="pb-10px"><i className="fa-solid fa-check fs-16 green-check-color me-10px"></i>Institutional cash investment</li>
                                            <li className="pb-10px"><i className="fa-solid fa-check fs-16 green-check-color me-10px"></i>Lending & cash management</li>
                                            <li className="pb-10px"><i className="fa-solid fa-check fs-16 green-check-color me-10px"></i>Full range of investments</li>
                                            <li className="pb-10px"><i className="fa-solid fa-check fs-16 green-check-color me-10px"></i>Budgeting loan management</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="padding-60-60">
                <div className="container">
                    <div className="row justify-content-center mb-2 margin-8px">
                        <div className="col-lg-7 text-center" useRef={elementRef3}>
                            <span className="fs-16 d-inline-block fw-500 text-uppercase  ls-1px" style={{ color: "#787777" }}>You may also like</span>
                            <h2 className="alt-font  fw-600 ls-minus-1px mb-0 text-base-color">Related <span style={{ color: "#4ea8f6" }}>Blogs</span></h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 ps-0 pe-0">
                            <ul className="blog-side-image blog-wrapper row gx-4 ps-0" style={{ position: 'relative' }}>
                                <li className="col-lg-4 col-sm-6 mb-4">
                                    <div className="blog-box d-md-flex d-block flex-row h-100 border-radius-6px overflow-hidden box-shadow-extra-large">
                                        <div className="blog-content w-100 h-350px sm-w-100 p-3 bg-white d-flex flex-column justify-content-center align-items-start last-paragraph-no-margin">
                                            <a href="/blog-details" className="categories-btn bg-sky-blue text-white text-uppercase fw-500 mb-20px">
                                                Business
                                            </a>
                                            <div className="heading-box-index">
                                                <a href="/blog-details" className="d-inline-block alt-font text-base-color fw-600 fs-20 lh-28">
                                                    Creativity is nothing but a mind set free.
                                                </a>
                                            </div>
                                            <p className="gray-text fs-16 lh-28">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                                industry's standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text.
                                            </p>
                                            <div className="mt-15px">
                                                <span style={{ height: '2px', width: '10px' }} className="separator bg-sky-blue"></span>
                                                <a href="/blog-details" className="gray-text text-dark-gray-hover d-inline-block fs-12 fw-500 text-uppercase">
                                                    AUG 12,2024 | <span className="text-sky-blue">Fin-Valuation</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className="col-lg-4 col-sm-6 mb-4">
                                    <div className="blog-box d-md-flex d-block flex-row h-100 border-radius-6px overflow-hidden box-shadow-extra-large">
                                        <div className="blog-content w-100 h-350px sm-w-100 p-3 bg-white d-flex flex-column justify-content-center align-items-start last-paragraph-no-margin">
                                            <a href="/blog-details" className="categories-btn bg-sky-blue text-white text-uppercase fw-500 mb-20px">
                                                Finance
                                            </a>
                                            <div className="heading-box-index">
                                                <a href="/blog-details" className="d-inline-block alt-font text-base-color fw-600 fs-20 lh-28">
                                                    A business needs a successful mix of design.
                                                </a>
                                            </div>
                                            <p className="gray-text fs-16 lh-28">
                                                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
                                                classical Latin literature from 45 BC, making it over 2000 years old. Lorem Ipsum is not simply
                                                random text.
                                            </p>
                                            <div className="mt-15px">
                                                <span style={{ height: '2px', width: '10px' }} className="separator bg-sky-blue"></span>
                                                <a href="/blog-details" className="gray-text text-dark-gray-hover d-inline-block fs-12 fw-500 text-uppercase">
                                                    AUG 11,2024 | <span className="text-sky-blue">Fin-Valuation</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className="col-lg-4 col-sm-6 mb-4">
                                    <div className="blog-box d-md-flex d-block flex-row h-100 border-radius-6px overflow-hidden box-shadow-extra-large">
                                        <div className="blog-content w-100 h-350px sm-w-100 p-3 bg-white d-flex flex-column justify-content-center align-items-start last-paragraph-no-margin">
                                            <a href="/blog-details" className="categories-btn bg-sky-blue text-white text-uppercase fw-500 mb-20px">
                                                Business
                                            </a>
                                            <div className="heading-box-index">
                                                <a href="/blog-details" className="d-inline-block alt-font text-base-color fw-600 fs-20 lh-28">
                                                    A dream doesn't become reality through magic.
                                                </a>
                                            </div>
                                            <p className="gray-text fs-16 lh-28">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                                industry's standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text.
                                            </p>
                                            <div className="mt-15px">
                                                <span style={{ height: '2px', width: '10px' }} className="separator bg-sky-blue"></span>
                                                <a href="/blog-details" className="gray-text text-dark-gray-hover d-inline-block fs-12 fw-500 text-uppercase">
                                                    AUG 10,2024 | <span className="text-sky-blue">Fin-Valuation</span>
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
        </>
    );
};

export default BlogDetails;