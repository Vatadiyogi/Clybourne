import React, { useEffect, useState } from 'react';
import anime from 'animejs';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { apiURL } from '../../../../config/Config';
import Loader from '../../../../common/Loader';
import { formatDate, formatNumber } from '../../../../common/numberUtils';
import Swal from 'sweetalert2';

const stripePromise = loadStripe('pk_test_51RpoTePjcaK1FKs1OEaDA43zko5NXGqzjoaP4dM3dMoIoKXabZ6cDUwjLTgS5G11tK6ITYi34Aie3VgoSLlrbHMz005m3lPUAv');
const Checkout = () => {
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState({});
  const planId = localStorage.getItem('selectedPlan');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchPlans = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const response = await axios.get(`${apiURL}/plan/${planId}`);
      if (response.data.status) {
        const fetchedPlans = response.data.data.plan;
        setPlanData(fetchedPlans); // Set the fetched plan data
      } else {
        console.error('Failed to fetch plan data');
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false); // Set loading to false after the request is done
    }
  };

  useEffect(() => {
    if (planId) {
      fetchPlans();
    }

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
    try {
      const requestBody = {
        'planId': planId,
        'planType': "new",
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
      if (data.data.setupIntentClientSecret) {
        // Use the client secret from the setup intent to save the payment method
        const setupIntentResult = await stripe.confirmCardSetup(data.data.setupIntentClientSecret);
        if (setupIntentResult.error) {
          console.error("Error saving payment method:", setupIntentResult.error.message);
          Swal.fire({
            icon: 'errror',
            text: 'Somor',
            title: 'Erething went wrong.Please try again.',
          });
          return;
        }
      }
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

  const handleBack = () => {
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
            {loading ? (
              <Loader />
            ) : planData ? (
              <div className="row align-items-center justify-content-center position-relative z-index-1">
                <div className="col-md-11">
                  <div className="card mt-15px rounded-bottom-0 border-0 box-shadow">
                    <div className="card-header fw-600 mb-0 align-items-center bg-white text-blue">Checkout</div>
                    <div className="card-body overflow-hidden ps-15px pe-15px pt-0 pb-0">
                      {/* Plan Details */}
                      <div className="row mt-15px">
                        <div className="col-sm-12">
                          <fieldset className="ps-15px pe-15px pb-15px pt-10px d-block" style={{ background: '#f2f3f6' }}>
                            <legend className="fw-600 float-none border-1px col-auto fs-14 ps-15px pe-15px p-5px lh-1 border-radius-4px bg-light-blue text-blue m-0">Plan Details</legend>
                            <div className="row justify-content-center mt-15px">
                              <div className="col-sm-6">
                                <div className="border pt-10px pb-10px rounded-4 bg-white h-100">
                                  <table className="fs-16 fw-400 lh-normal text-end me-auto ms-auto">
                                    <tbody>
                                      <tr>
                                        <td className="p-5px pt-0 lh-1">Plan Name</td>
                                        <td className="center p-5px pt-0 lh-1">:</td>
                                        <td className="fw-600 p-5px pt-0 lh-1 text-start">{planData.name || 'N/A'}</td>
                                      </tr>
                                      <tr>
                                        <td className="p-5px pt-0 lh-1">Plan Type</td>
                                        <td className="center p-5px pt-0 lh-1">:</td>
                                        <td className="fw-600 p-5px pt-0 lh-1 text-start">{planData.planType || 'N/A'}</td>
                                      </tr>
                                      <tr>
                                        <td className="p-5px pt-0 lh-1">Reports</td>
                                        <td className="center p-5px pt-0 lh-1">:</td>
                                        <td className="fw-600 p-5px pt-0 lh-1 text-start">{planData.reports || 'N/A'}</td>
                                      </tr>
                                      <tr>
                                        <td className="p-5px pt-0 lh-1">Access Days</td>
                                        <td className="center p-5px pt-0 lh-1">:</td>
                                        <td className="fw-600 p-5px pt-0 lh-1 text-start">{planData.accessDays || 'N/A'}</td>
                                      </tr>
                                      <tr>
                                        <td className="p-5px pt-0 lh-1">Price (USD)</td>
                                        <td className="center p-5px pt-0 lh-1">:</td>
                                        <td className="fw-600 p-5px pt-0 lh-1 text-start">{formatNumber(planData.price) || 'N/A'}</td>
                                      </tr>
                                      <tr>
                                        <td className="p-5px pt-0 lh-1">Expiry Date</td>
                                        <td className="center p-5px pt-0 lh-1">:</td>
                                        <td className="fw-600 p-5px pt-0 lh-1 text-start">{formatDate(planData.expiresAt) || 'N/A'}</td>
                                      </tr>
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
                        <div className="col-sm-12 text-center">
                          <button type="button" onClick={handleBack} className="bg-blue h-40px lh-40 p-0 fs-12 mb-15px text-white fs-12 fw-600 text-capitalize fin-btn d-inline-block ls-05px w-100px border-radius-4px">
                            <i className="feather icon-feather-arrow-left-circle m-0 fs-16 align-text-bottom"></i> Back
                          </button>
                          <button
                            type="button"
                            onClick={handleClick}
                            className="bg-blue h-40px lh-40 p-0 ps-15px pe-15px fs-12 m-15px text-white fs-12 fw-600 text-capitalize fin-btn d-inline-block ls-05px border-radius-4px"
                          >
                            Continue to Payment <i className="feather icon-feather-arrow-right-circle m-0 fs-16 align-text-bottom"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>No Data</>
            )}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Checkout;
