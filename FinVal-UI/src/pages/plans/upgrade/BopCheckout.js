import { formatDate, formatNumber } from "../../../common/numberUtils";
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { apiURL } from '../../../config/Config';
const token = localStorage.getItem('token');

const stripePromise = loadStripe('pk_test_51RpoTePjcaK1FKs1OEaDA43zko5NXGqzjoaP4dM3dMoIoKXabZ6cDUwjLTgS5G11tK6ITYi34Aie3VgoSLlrbHMz005m3lPUAv');



const BopCheckout = ({currentPlan, data}) => {
    const handleClick = async () => {
        
        try {
            const requestBody = {
                'planId' : data.id,
                'planType' : "upgrade",
            };
        const response = await axios.post(
            `${apiURL}/stripe/create-checkout-session`,
            requestBody,
            {
              headers: {
                Authorization: `${token}`, // Sending the token as Bearer token in headers
              },
            }
          );
          console.log(response);
          const stripe = await stripePromise;
          const { error } = await stripe.redirectToCheckout({ sessionId: response.data.data.stripeToken });
    
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
    <div className="row mt-15px">
        <div className="col-sm-12">
            <fieldset className="ps-15px pe-15px pb-15px pt-10px d-block" style={{"background":"#f2f3f6"}}>
                
                <div className="row justify-content-center align-items-center">
                    <div className="col-sm-12 text-center">
                        <div className="pricing-table box-shadow rounded-4 rounded-bottom-0">
                            <div className="pricing-header text-center text-golden bg-blue rounded-4 rounded-bottom-0 p-10px d-flex justify-content-between">
                                <div className="fw-500 fs-16 lh-1 d-flex align-items-center">
                                    <i className="bi bi-box-arrow-up fs-26 me-5px lh-1"></i> Summary of this upgrade
                                </div>
                            </div>
                            <div className="pricing-body bg-white">
                                <ul className="list-style-01 p-0 mb-0">
                                    <li className="border-color-transparent-dark-very-light p-10px fs-16" style={{"display": "flex", "alignItems": "flex-start"}}>
                                        <i className="bi bi-check2-circle fs-22 fw-700" style={{"color": "rgb(20, 193, 20)", "marginRight": "8px", "marginTop": "-4px"}}></i>
                                        <span className="text-start lh-sm">
                                           Your Current Plan ID# {currentPlan.planSeqId} will be upgraded from Business Owner Plan to <b>Business Owner Plus</b>
                                        </span>
                                    </li>
                                    <li className="border-color-transparent-dark-very-light p-10px fs-16" style={{"display": "flex", "alignItems": "flex-start"}}>
                                        <i className="bi bi-check2-circle fs-22 fw-700" style={{"color": "rgb(20, 193, 20)", "marginRight": "8px", "marginTop": "-4px"}}></i>
                                        <span className="text-start lh-sm">
                                            Following additional features will be added.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div> 

                <div className="row justify-content-center mt-15px">
                   <div className="col-sm-10">
                        <div className="border pt-10px pb-10px rounded-4 bg-white h-100">
                        <table className="fs-16 fw-400 lh-normal text-end me-auto ms-auto">
                            <tbody>
                            <tr>
                                <td className="p-5px pt-1 lh-1">Additional Access Days from today</td>
                                <td className="center p-5px pt-0 lh-1">:</td>
                                <td className="fw-600 p-5px pt-0 lh-1 text-start">{data.access_days || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="p-5px pt-1 lh-1">New Plan Expiry Date</td>
                                <td className="center p-5px pt-0 lh-1">:</td>
                                <td className="fw-600 p-5px pt-0 lh-1 text-start">{formatDate(data.expiresAt) || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="p-5px pt-1 lh-1">Special Support</td>
                                <td className="center p-5px pt-0 lh-1">:</td>
                                <td className="fw-600 p-5px pt-0 lh-1 text-start">Full Support to complete the input financial data entry</td>
                            </tr>
                            <tr>
                                <td className="p-5px pt-1 lh-1">Total Amount to pay for upgrade </td>
                                <td className="center p-5px pt-0 lh-1">:</td>
                                <td className="fw-600 p-5px pt-0 lh-1 text-start">USD {formatNumber(data.upgrade_price) || 'N/A'}</td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </fieldset>
            <div className="row">
                <div className="col-sm-12 text-center">
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
  )
}

export default BopCheckout;