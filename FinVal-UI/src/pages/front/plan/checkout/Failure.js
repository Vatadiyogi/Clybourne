import React, { useEffect, useState } from 'react';
import anime from 'animejs';
import { useNavigate } from 'react-router-dom';

const Failure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle anime.js animations
    const elements = document.querySelectorAll('[data-anime]');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const animeConfig = JSON.parse(el.getAttribute('data-anime'));
          anime({
            targets: el,
            ...animeConfig,
          });
          observer.unobserve(el);
        }
      });
    });
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const handleClick = async () => {
    if (localStorage.getItem('selectedPlan')) {
        localStorage.removeItem('selectedPlan');
    }
    navigate('/pricing');
  };

  return (
    <section className="position-relative pt-15px pb-15px">
     
        <div className="container-fluid">
          <div className="row">
            <div
              className="col-lg-12 order-1 order-lg-2 md-mb-50px"
              data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 1200, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'
            >
                <div className="row align-items-center justify-content-center position-relative z-index-1">
                    <div className="col-md-11">
                    <div className="card mt-15px rounded-bottom-0 border-0 box-shadow">
                        <div className="card-header fw-600 mb-0 align-items-center bg-white text-blue">Payment Failure</div>
                        <div className="card-body overflow-hidden ps-15px pe-15px pt-0 pb-0">
                        {/* Plan Details */}
                        <div className="row mt-15px">
                            <div className="col-sm-12">
                            <fieldset className="ps-15px pe-15px pb-15px pt-10px d-block" style={{ background: '#f2f3f6' }}>
                                <legend className="fw-600 float-none border-1px col-auto fs-14 ps-15px pe-15px p-5px lh-1 border-radius-4px bg-light-blue text-blue m-0">Payment Failure</legend>
                                <div className="row justify-content-center mt-15px">
                                <div className="col-sm-10">
                                    <div className="border pt-10px pb-10px rounded-4 bg-white h-100">
                                    <table className="fs-16 fw-400 lh-normal text-end me-auto ms-auto">
                                        <tbody>
                                        <tr>
                                            <td className="fw-600 p-5px pt-0 lh-1 text-center">Payment Failed.</td>
                                        </tr>
                                        <br/>
                                        {/* Add more rows as needed */}
                                        </tbody>
                                    </table>
                                    </div>
                                </div>
                                </div>
                            </fieldset>
                            </div>
                        </div>
                        {/* Continue to Payment */}
                        <div className="row">
                            <div className="col-sm-12 text-center mt-2">
                            <button type="button" onClick={handleClick} className="bg-blue h-40px lh-40 p-0 fs-12 mb-15px text-white fs-12 fw-600 text-capitalize fin-btn d-inline-block ls-05px w-100px border-radius-4px">
                                <i className="feather icon-feather-arrow-left-circle m-0 fs-16 align-text-bottom"></i> Pricing 
                            </button>
                            
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
  );
};

export default Failure;
