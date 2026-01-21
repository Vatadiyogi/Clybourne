import React, { useEffect, useState } from 'react';
import anime from 'animejs';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Assuming axios is used for API calls
import { apiURL } from '../../config/Config';
import { formatDate } from '../../common/dateUtils';
import PlanHistory from './PlanHistory';
import Loader from '../../common/Loader';

const New = () => {

    const [currentplanData, setCurrentPlanData] = useState(null); // State to store plan data
    const [historyplanData, setHistoryPlanData] = useState(null); // State to store plan data
    const [contentArray, setContentArray] = useState([]);
    const [loading, setLoading] = useState(true); // State to manage loading
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch plan data from API
        const fetchPlanData = async () => {
            setLoading(true); // Show loader
            try {
                const response = await axios.get(apiURL + '/plan/customer_plans', {
                    headers: {
                        Authorization: `${token}`
                    },
                });
                const data = response.data;
                if (data.status) {
                    setCurrentPlanData(data.data.current_plan);
                    setHistoryPlanData(data.data.old_plans);
                    if (data.data.current_plan && data.data.current_plan.planId && data.data.current_plan.planId.description) {
                        const parsedArray = parseHtmlList(data.data.current_plan.planId.userplandescription);
                        setContentArray(parsedArray);
                    }
                } else {
                    setCurrentPlanData(null); // No active plan
                    setHistoryPlanData(null);
                }
            } catch (err) {
                console.error("Error fetching plan data:", err);
                // Handle error appropriately here
            } finally {
                setLoading(false); // Hide loader
            }
        };

        fetchPlanData();

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

    const parseHtmlList = (htmlString) => {
        const convertString = htmlString
            .replace("<ul>", "")
            .replace("</ul>", "")
            .split("</li><li>")
            .map((item) => item.replace("<li>", "").replace("</li>", ""));
        return convertString;
    };

    return (
        <section className="position-relative pt-30px pb-30px">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 order-1 order-lg-2 md-mb-50px" data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 1200, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'>
                        {loading ? (
                            <Loader /> // Loader shown while fetching data
                        ) : (
                            <div className="row align-items-center justify-content-center position-relative z-index-1">
                                <div className="col-md-11 sm-ps-0 sm-pe-0">
                                    <div className="card mt-15px rounded-bottom-0 border-0 box-shadow">
                                        <div className="card-header fw-600 mb-0 align-items-center bg-white text-blue">Plans & Billings</div>
                                        <div className="card-body overflow-hidden ps-15px pe-15px pt-0 pb-0">
                                            <div className="mt-1 d-flex justify-content-end">
                                                <Link to="/pricing" className="fs-12 m-0 lh-1 pt-10px pb-10px text-white fs-12 fw-400 text-capitalize fin-btn d-inline-block ls-05px w-110px text-center border-radius-4px">
                                                    Add New Plan
                                                </Link>
                                            </div>
                                            <div class="row mt-13px">
                                                <div class="col-sm-12">
                                                    <fieldset class="ps-15px pe-15px pb-15px pt-10px d-block" style={{ "background": "#f2f3f6" }}>
                                                        <legend class="fw-600 float-none border-1px col-auto fs-14 ps-15px pe-15px p-5px lh-1 border-radius-4px bg-light-blue text-blue m-0">Current Plan</legend>
                                                        {currentplanData ?
                                                            <div class="row justify-content-center">
                                                                <div class="col-sm-5 d-flex">
                                                                    <div class="border pt-30px pb-30px rounded-4 bg-white d-flex align-items-center justify-content-center w-100">
                                                                        <table class="fs-16 fw-400 lh-normal text-end me-auto ms-auto">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="ps-5px pb-5px pe-5px pt-0 lh-1">Plan Id</td>
                                                                                    <td class="center ps-5px pb-5px pe-5px pt-0 lh-1">:</td>
                                                                                    <td class="fw-600 ps-5px pb-5px pe-5px pt-0 lh-1 text-start">{currentplanData.planSeqId}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="p-5px">Number of Reports</td>
                                                                                    <td class="center p-5px">:</td>
                                                                                    <td class="fw-600 p-5px text-start">{currentplanData.balanceQuota}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="p-5px">Reports currently unutilized</td>
                                                                                    <td class="center p-5px">:</td>
                                                                                    <td class="fw-600 p-5px text-start">{currentplanData.balanceQuota - currentplanData.orders.length}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="p-5px">Plan Type</td>
                                                                                    <td class="center p-5px">:</td>
                                                                                    <td class="fw-600 p-5px text-start">{currentplanData.planId && currentplanData.planId.name}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="p-5px">Plan Expiry Date</td>
                                                                                    <td class="center p-5px">:</td>
                                                                                    <td class="fw-600 p-5px text-start">{formatDate(currentplanData.expiresAt)}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                                <div class="col-sm-7 text-center d-flex">
                                                                    <div class="pricing-table box-shadow rounded-4 rounded-bottom-0">
                                                                        <div class="pricing-header text-center text-golden bg-blue rounded-4 rounded-bottom-0 ps-10px pe-10px p-5px d-flex justify-content-between">
                                                                            <div class="fw-500 fs-16 lh-1 d-flex align-items-center">
                                                                                <i class="line-icon-Wacom-Tablet fs-26 me-5px lh-1"></i> Plan Includes
                                                                            </div>
                                                                            {currentplanData.planType === "BO" || currentplanData.planType === "A" ?
                                                                                <Link to="/upgrade-plan" class="fs-12 lh-1 pt-10px pb-10px text-blue fs-12 fw-500 text-capitalize d-inline-block ls-05px w-130px text-center bg-golden bg-light-golden-hover border-radius-4px sm-w-100px"><i class="bi bi-box-arrow-up fs-14"></i> Upgrade Plan</Link>
                                                                                : ''
                                                                            }
                                                                        </div>
                                                                        <div class="pricing-body bg-white">
                                                                            <ul class="list-style-01 p-0 mb-0">
                                                                                {contentArray.map((item, index) => (
                                                                                    <li key={index} className="border-color-transparent-dark-very-light pe-10px ps-10px p-5px fs-14" style={{ display: "flex", alignItems: "flex-start" }}>
                                                                                        <i className="bi bi-check2-circle fs-18 fw-700 lh-1" style={{ color: "rgb(20, 193, 20)", marginRight: "8px" }}></i>
                                                                                        <span className="text-start lh-sm">{item}</span>
                                                                                    </li>
                                                                                ))
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            : <>No Active Plan</>
                                                        }
                                                    </fieldset>
                                                </div>
                                            </div>
                                            <fieldset className="ps-15px pe-15px pt-10px mt-15px mb-15px">
                                                <legend className="fw-600 float-none border-1px col-auto fs-14 ps-15px pe-15px p-5px lh-1 border-radius-4px bg-light-blue text-blue m-0">Order History</legend>
                                                <div className="table-responsive">
                                                    {historyplanData && historyplanData.length > 0 ?
                                                        <PlanHistory data={historyplanData} />
                                                        : "No Order History"}
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default New;