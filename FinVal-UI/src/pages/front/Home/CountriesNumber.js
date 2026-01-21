import React, { useEffect } from 'react';
import anime from 'animejs';

const CountriesNumber = () => {

  useEffect(() => {
    // Select all elements with data-anime attribute
    const elements = document.querySelectorAll('[data-anime]');
    
    // Create an IntersectionObserver instance
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger the anime.js animation on the intersected element
          const el = entry.target;
          const animeConfig = JSON.parse(el.getAttribute('data-anime'));
          anime({
            targets: el,
            ...animeConfig,
          });

          // Stop observing the element after animation starts
          observer.unobserve(el);
        }
      });
    });

    // Observe each element
    elements.forEach(el => {
      observer.observe(el);
    });

    // Cleanup on component unmount
    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="big-section overflow-hidden bg-white padding-60-60">
      <div className="container">
        <div className="row pb-60px">
          <div className="col-md-12 text-center text-md-start" 
               data-anime='{"opacity": [0,1], "duration": 600, "delay": 0, "easing": "easeOutQuad"}'>
            <div className="fs-70 xxl-fs-55 sm-fs-45 fw-600 alt-font ls-minus-4px sm-ls-minus-2px text-base-color margin-7px">
              100+ Countries
            </div>
          </div>
          <div className="col-12">
            <div className="row align-items-center align-items-lg-end">
              <div className="col-lg-3 col-md-4 text-md-end text-center md-mt-30px md-mb-20px sm-d-none" 
                   data-anime='{"opacity": [0,1], "duration": 600, "delay": 0, "easing": "easeOutQuad"}'>
                <div className="position-relative">
                  <img src="images/demo-branding-agency-about-01.png" className="animation-rotation" alt="" />
                  <div className="absolute-middle-center w-100 z-index-minus-1">
                    <img src="images/demo-branding-agency-about-02.png" alt="" />
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 text-center text-md-start"
                   data-anime='{"opacity": [0,1], "duration": 600, "delay": 0, "easing": "easeOutQuad"}'>
                <div className="fs-55 xxl-fs-50 sm-fs-40 fw-600 alt-font ls-minus-4px sm-ls-minus-2px margin-7px" style={{ color: "#4ea8f6" }}>
                  Use our
                </div>
              </div>

              <div className="col-lg-5 last-paragraph-no-margin md-mt-30px"
                   data-anime='{"opacity": [0,1], "duration": 600, "delay": 0, "easing": "easeOutQuad"}'>
                <p className="w-95 md-w-80 mx-auto text-center text-lg-start sm-w-100 fs-16 lh-28" style={{ color: "#787777" }}>
                  FinVal Online Valuation Portal in 100+ Countries and value your business at any time
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-0 counter-style-04" 
             data-anime='{"translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "easing": "easeOutQuad"}'>
          <div className="col-lg-3 col-md-6 feature-box text-start hover-box border-start sm-border border-color-extra-medium-gray ps-35px pe-35px pt-25px pb-25px">
            <div className="feature-box-content">
              <p className="fw-600 w-90 fs-17 lh-28" style={{ color: "#787777" }}>North America</p>
              <h2 className="vertical-counter d-inline-flex text-dark-gray fw-700 ls-minus-2px mt-2 mb-0 ls-minus-1px">
                <sup className="text-jade top-0">
                  <i className="feather icon-feather-arrow-up icon-extra-large" style={{ color: "#4ea8f6" }}></i></sup>8500
              </h2>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 feature-box text-start hover-box border-start sm-border border-color-extra-medium-gray md-border-end ps-35px pe-35px pt-25px pb-25px">
            <div className="feature-box-content">
              <p className="fw-600 w-90 fs-17 lh-28" style={{ color: "#787777" }}>Europe</p>
              <h2 className="vertical-counter d-inline-flex text-dark-gray fw-700 ls-minus-2px mt-2 mb-0 ls-minus-1px">
                <sup className="text-jade top-0">
                  <i className="feather icon-feather-arrow-up icon-extra-large" style={{ color: "#4ea8f6" }}></i></sup>660
              </h2>
            </div>
          </div>

            <div className="col-lg-3 col-md-6 feature-box text-start hover-box border-start sm-border border-color-extra-medium-gray ps-35px pe-35px pt-25px pb-25px lg-ps-25px lg-pe-25px sm-mb-30px">
                <div className="feature-box-content">
                    <p className=" fw-600 w-90 fs-17 lh-28" style={{ color: "#787777" }}>Middle East</p>
                    <h2 className="vertical-counter d-inline-flex text-dark-gray fw-700 ls-minus-2px mt-2 mb-0 ls-minus-1px" data-text=" " data-to="6834"><sup className="text-jade top-0">
                        <i className="feather icon-feather-arrow-up icon-extra-large" style={{ color: "#4ea8f6" }}></i></sup>6834
                    </h2>
                </div>
            </div>
            <div className="col-lg-3 col-md-6 feature-box text-start hover-box border-start sm-border border-color-extra-medium-gray md-border-end ps-35px pe-35px pt-25px pb-25px lg-ps-25px lg-pe-25px">
                <div className="feature-box-content">
                    <p className="fw-600 w-90 fs-17 lh-28" style={{ color: "#787777" }}>Asia</p>
                    <h2 className="vertical-counter d-inline-flex text-dark-gray fw-700 ls-minus-2px mt-2 mb-0 ls-minus-1px"
                        data-text=" " data-to="38"><sup className="text-jade top-0">
                            <i className="feather icon-feather-arrow-up icon-extra-large" style={{ color: "#4ea8f6" }}></i></sup>38
                    </h2>
                </div>
            </div>
        </div>
    </div>
    </section>
 );
}

export default CountriesNumber;