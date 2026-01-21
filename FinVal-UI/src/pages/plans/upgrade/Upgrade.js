import React, {useState, useEffect} from 'react';
import anime from 'animejs';
import CurrentPlan from './CurrentPlan';
import { apiURL } from '../../../config/Config';
import axios from 'axios';
import BopCheckout from './BopCheckout';
import AdvisorUpgrade from './AdvisorUpgrade';
import Loader from '../../../common/Loader';

const Upgrade = () => {
    let [currentPlan, setCurrentPlan] = useState(null);
    let [upgradePlan, setUpgradePlan] = useState(null);
    const [isScreenLoading, setScreenLoading] = useState(true);

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

useEffect(() => {
    const fetchTableData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(apiURL + '/plan/customer_upgrade_plans', {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        });   
        const data = await response;
        if (data && data.status) {
            setCurrentPlan(data.data.data.current_plan || []);
            setUpgradePlan(data.data.data.upgrade_data || null);
        } else {
          console.error('Failed to fetch table data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching table data:', error);
      }finally{
        setScreenLoading(false);
      }
    };

    fetchTableData();
  }, []);


   return (
    <section className="position-relative pt-15px pb-15px">
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12 order-1 order-lg-2 md-mb-50px" data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 1200, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'>
                    <div className="row align-items-center justify-content-center position-relative z-index-1">
                        <div className="col-md-11 sm-ps-0 sm-pe-0">
                            <div className="card mt-15px rounded-bottom-0 border-0 box-shadow">
                                <div className="card-header fw-600 mb-0 align-items-center bg-white text-blue">Upgrade Plan</div>
                                <div className="card-body overflow-hidden ps-15px pe-15px pt-0 pb-0">
                                    {currentPlan && currentPlan.length > 0 ? (
                                        <>
                                            <CurrentPlan data={currentPlan[0]} />
                                            {upgradePlan ? (
                                                upgradePlan.planType === "BOP" ? (
                                                    <BopCheckout currentPlan={currentPlan[0]} data={upgradePlan} />
                                                ) : currentPlan[0].planType === 'A' ? (
                                                    <AdvisorUpgrade currentPlan={currentPlan[0]} data={upgradePlan} />
                                                ) : (
                                                    // This handles if it's not BOP or 'A', or if you have another fallback
                                                    <div className="row mt-25px text-center">
                                                        <div className="col-sm-12">
                                                            <p>No Upgrade Option</p>
                                                        </div>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="row mt-25px text-center">
                                                    <div className="col-sm-12">
                                                        <p>No Upgrade Option</p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="row mt-15px">
                                            <div className="col-sm-12">
                                                <p>No Active Plan</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    </section>

   );
}

export default Upgrade;