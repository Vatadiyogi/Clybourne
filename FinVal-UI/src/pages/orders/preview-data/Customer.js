import React, {useEffect} from "react";
import anime from "animejs";

const Customer  = ({data}) => {
   const customer = data.customer; 
   useEffect(() => {
    const elements = document.querySelectorAll('[data-anime]');
    elements.forEach(el => {
        const animeConfig = JSON.parse(el.getAttribute('data-anime'));
        anime({
        targets: el,
        ...animeConfig,
        });
    });
    }, []);
   return (
    <div className="row row-cols-1 row-cols-lg-3 row-cols-md-3 justify-content-center align-items-center" data-anime='{ "el": "childs", "rotateZ": [5, 0], "translateY": [50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
        <div className="col icon-with-text-style-10 mt-15px fin-box">
            <div className="feature-box bg-white justify-content-center box-shadow p-15px  border-radius-5px border-1 border-solid border-light-blue">
                <div className="row row-cols-2 align-items-center justify-content-start w-100">
                    <div className="feature-box-icon feature-box-icon-rounded w-60px h-60px rounded-circle">
                        <i className="line-icon-User text-blue text-dark-blue-hover fs-30 fw-500"></i>
                    </div>
                    <div className="col-8 feature-box-content last-paragraph-no-margin lh-normal text-start">
                        <p className=" lh-normal fs-14">Name</p>
                        <span className="d-block fw-600 text-black mb-0 fs-18">{customer.customerName}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="col icon-with-text-style-10 mt-15px fin-box">
            <div className="feature-box bg-white justify-content-center box-shadow p-15px border-radius-5px border-1 border-solid border-light-blue">
                <div className="row row-cols-2 align-items-center justify-content-start w-100">
                    <div className="feature-box-icon feature-box-icon-rounded w-60px h-60px rounded-circle">
                        <i className="line-icon-Bulleted-List text-blue text-dark-blue-hover fs-30 fw-500"></i>
                    </div>
                    <div className="col-8 feature-box-content last-paragraph-no-margin lh-normal text-start">
                        <p className="fs-14  lh-normal">Plan Type</p>
                        <span className="d-block fw-600 text-black mb-0 fs-18">{data.order.plan?.planType}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="col icon-with-text-style-10 mt-15px fin-box">
            <div className="feature-box bg-white justify-content-center box-shadow p-15px border-radius-5px border-1 border-solid border-light-blue">
                <div className="row row-cols-2 align-items-center justify-content-start w-100">
                    <div className="feature-box-icon feature-box-icon-rounded w-60px h-60px rounded-circle">
                        <i className="line-icon-File-ClipboardFileText text-blue text-dark-blue-hover fs-30 fw-500"></i>
                    </div>
                    <div className="col-8 feature-box-content last-paragraph-no-margin lh-normal text-start">
                        <p className="fs-14  lh-normal ">Report Order Sequence</p>
                        <span className="d-block fw-600 text-black mb-0 fs-18">{data.order.customerSequence}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
   )
}

export default Customer;