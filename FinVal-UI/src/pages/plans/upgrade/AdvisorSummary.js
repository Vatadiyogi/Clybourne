import React, { useEffect} from 'react';
import anime from 'animejs';
import { Link, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { formatDate, formatNumber } from '../../../common/numberUtils';
import Swal from 'sweetalert2';
import { apiURL } from '../../../config/Config';
import axios from 'axios';

const AdvisorSummary = () => {
const token = localStorage.getItem('token');    

const location = useLocation();
const planData = location.state?.plan;
const currentPlan  = location.state?.currentPlan;
const stripePromise = loadStripe('pk_test_51RpoTePjcaK1FKs1OEaDA43zko5NXGqzjoaP4dM3dMoIoKXabZ6cDUwjLTgS5G11tK6ITYi34Aie3VgoSLlrbHMz005m3lPUAv');    
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
    elements.forEach(el => {
        observer.observe(el);
    });
    return () => {
        elements.forEach(el => observer.unobserve(el));
    };
}, []);  

const handleClick = async () => {
    try {
    const requestBody = {
        'planId' : planData.id,
        'planType' : "upgrade",
    };
    const { data } = await axios.post(
        `${apiURL}/stripe/create-checkout-session`,
        requestBody,
        {
            headers: {
            Authorization: `${token}`, // Sending the token as Bearer token in headers
            },
        }
        );

        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({ sessionId: data.data.stripeToken });

        if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong.Please try again.',
        });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong.Please try again.',
        });
    }
};


  return (
    <section className="position-relative pt-15px pb-15px">
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12 order-1 order-lg-2 md-mb-50px" data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 1200, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'>
                    <div className="row align-items-center justify-content-center position-relative z-index-1">
                        <div className="col-md-11 sm-pe-0 sm-ps-0">
                            <div className="card mt-15px rounded-bottom-0 border-0 box-shadow">
                                <div className="card-header fw-600 mb-0 align-items-center bg-white text-blue">Upgrade Summary</div>
                                {planData ? 
                                <div className="card-body overflow-hidden ps-15px pe-15px pt-0 pb-0">
                                    <div className="row mt-15px">
                                        <div className="col-sm-12">
                                            <fieldset className="ps-15px pe-15px pb-15px pt-10px d-block" style={{"background":"#f2f3f6"}}>
                                                <legend className="fw-600 float-none border-1px col-auto fs-14 ps-15px pe-15px p-5px lh-1 border-radius-4px bg-light-blue text-blue m-0">Upgrade Plan Details</legend>
                                                <div className="row justify-content-center align-items-center">
                                                    <div className="col-sm-12 text-center">
                                                        <div className="pricing-table box-shadow rounded-4 rounded-bottom-0">
                                                            <div className="pricing-header text-center text-golden bg-blue rounded-4 rounded-bottom-0 p-10px d-flex justify-content-between">
                                                                <div className="fw-500 fs-16 lh-1 d-flex align-items-center">
                                                                    <i className="bi bi-box-arrow-up fs-26 me-5px lh-1"></i> You have selected to upgrade your current plan
                                                                </div>
                                                            </div>
                                                            <div className="pricing-body bg-white">
                                                                <ul className="list-style-01 p-0 mb-0">
                                                                    <li className="border-color-transparent-dark-very-light p-10px fs-16" style={{"display": "flex", "alignItems": "flex-start"}}>
                                                                        <i className="bi bi-check2-circle fs-22 fw-700" style={{"color": "rgb(20, 193, 20)", "marginRight": "8px", "marginTop": "-4px"}}></i>
                                                                        <span className="text-start lh-sm">
                                                                            Your current plan ID# {currentPlan.planSeqId} will become Inactive and currently unused reports will be transferred to new plan.
                                                                        </span>
                                                                    </li>
                                                                    <li className="border-color-transparent-dark-very-light p-10px fs-16" style={{"display": "flex", "alignItems": "flex-start"}}>
                                                                        <i className="bi bi-check2-circle fs-22 fw-700" style={{"color": "rgb(20, 193, 20)", "marginRight": "8px", "marginTop": "-4px"}}></i>
                                                                        <span className="text-start lh-sm">
                                                                            The details of new plan will be
                                                                        </span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row justify-content-center mt-15px">
                                                    <div className="col-sm-6">
                                                        <div className="border pt-10px pb-10px rounded-4 bg-white h-100">
                                                            <table className="fs-16 fw-400 lh-normal text-end me-auto ms-auto">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="p-5px pt-0 lh-1">Total Reports</td>
                                                                        <td className="center p-5px pt-0 lh-1">:</td>
                                                                        <td className="fw-600 p-5px pt-0 lh-1 text-start">{planData.reports}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="p-5px">Access days from today</td>
                                                                        <td className="center p-5px">:</td>
                                                                        <td className="fw-600 p-5px text-start">{planData.access_days}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="p-5px">Plan Expiry Date</td>
                                                                        <td className="center p-5px">:</td>
                                                                        <td className="fw-600 p-5px text-start">{formatDate(planData.expiresAt)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="p-5px">Total amount to pay for upgrade</td>
                                                                        <td className="center p-5px">:</td>
                                                                        <td className="fw-600 p-5px text-start">USD {formatNumber(planData.upgrade_price)}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12 text-center">
                                            <Link to="/upgrade-plan" className="bg-blue h-40px lh-40 p-0 fs-12 mb-15px sm-mb-5px sm-pt-5px text-white fs-12 fw-600 text-capitalize fin-btn d-inline-block ls-05px w-100px border-radius-4px">
                                                <i className="feather icon-feather-arrow-left-circle m-0 fs-16 align-text-bottom"></i> Back
                                            </Link>
                                            <button onClick={handleClick} type="button" className="bg-blue h-40px lh-40 p-0 ps-15px pe-15px fs-12 m-15px sm-mt-5px text-white fs-12 fw-600 text-capitalize fin-btn d-inline-block ls-05px border-radius-4px border-none">
                                                Continue to Payment <i className="feather icon-feather-arrow-right-circle m-0 fs-16 align-text-bottom"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                : 
                                <div className="row mt-15px">
                                    <div className="col-sm-12">
                                        <div className="card-header fw-600 mb-0 align-items-center bg-white text-blue">No Summary</div>
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    </section>
  );
}

export default AdvisorSummary;