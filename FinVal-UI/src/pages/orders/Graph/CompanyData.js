import React, {useEffect} from "react";
import comNameImg from "../../../assets/finimg/company-name1.png";
import comTypeImg from "../../../assets/finimg/company-type.png";
import industryImage from "../../../assets/finimg/industry.png";
import businessAgeImg from "../../../assets/finimg/years-in-business.png";
import anime from "animejs";

const CompanyData = ({data}) => {
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
        <div className="row row-cols-1 row-cols-lg-4 row-cols-md-4 justify-content-center" data-anime='{ "el": "childs", "rotateZ": [5, 0], "translateY": [50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
        {data.companyName && 
        <div className="col icon-with-text-style-10 mt-15px pe-5px fin-box d-grid m-panding-left-5">
            <div className="feature-box bg-white justify-content-center box-shadow p-10px ps-5px pe-5px border-radius-5px">
                <div className="row row-cols-2 align-items-center justify-content-start w-100">
                    <div className="feature-box-icon feature-box-icon-rounded w-40px h-40px rounded-circle p-0">
                        <img src={comNameImg} alt="Company Name" className="w-25px" />
                    </div>
                    <div className="col-8 p-0 ps-5px feature-box-content last-paragraph-no-margin lh-normal text-start">
                        <span className="d-block fw-600 text-black mb-0 fs-13 lh-1">{data.companyName}</span>
                        <p className="fs-11 lh-normal">Company Name</p>
                    </div>
                </div>
            </div>
        </div>
        }
        {data.companyType &&
        <div className="col icon-with-text-style-10 mt-15px pe-5px ps-5px fin-box d-grid">
            <div className="feature-box bg-white justify-content-center box-shadow p-10px ps-5px pe-5px border-radius-5px">
                <div className="row row-cols-2 align-items-center justify-content-start w-100">
                    <div className="feature-box-icon feature-box-icon-rounded w-40px h-40px rounded-circle p-0">
                        <img src={comTypeImg} alt="Company Type" className="w-25px" />
                    </div>
                    <div className="col-8 p-0 ps-5px feature-box-content last-paragraph-no-margin lh-normal text-start">
                        <span className="d-block fw-600 text-black mb-0 fs-13 lh-1">{data.companyType}</span>
                        <p className="fs-11 lh-normal">Company Type</p>
                    </div>
                </div>
            </div>
        </div>
        }
        {data.industryType &&
        <div className="col icon-with-text-style-10 mt-15px pe-5px ps-5px fin-box d-grid">
            <div className="feature-box bg-white justify-content-center box-shadow p-10px ps-5px pe-5px border-radius-5px">
                <div className="row row-cols-2 align-items-center justify-content-start w-100">
                    <div className="feature-box-icon feature-box-icon-rounded w-40px h-40px rounded-circle p-0">
                        <img src={industryImage} alt="Industry" className="w-25px" />
                    </div>
                    <div className="col-8 p-0 ps-5px feature-box-content last-paragraph-no-margin lh-normal text-start">
                        <span className="d-block fw-600 text-black mb-0 fs-13 lh-1">{data.industryType}</span>
                        <p className="fs-11 lh-normal">Industry</p>
                    </div>
                </div>
            </div>
        </div>
        }
        {data.companyAge &&
        <div className="col icon-with-text-style-10 mt-15px ps-5px fin-box d-grid m-panding-right-5">
            <div className="feature-box bg-white justify-content-center box-shadow p-10px ps-5px pe-5px border-radius-5px">
                <div className="row row-cols-2 align-items-center justify-content-start w-100">
                    <div className="feature-box-icon feature-box-icon-rounded w-40px h-40px rounded-circle p-0">
                        <img src={businessAgeImg} alt="Business Age" className="w-25px" />
                    </div>
                    <div className="col-8 p-0 ps-5px feature-box-content last-paragraph-no-margin lh-normal text-start">
                        <span className="d-block fw-600 text-black mb-0 fs-13 lh-1">{data.companyAge}</span>
                        <p className="fs-11 lh-normal text-nowrap">Years in Business</p>
                    </div>
                </div>
            </div>
        </div>
        }
    </div>
                                    
    )

}
export default CompanyData;