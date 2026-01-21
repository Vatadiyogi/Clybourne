import { formatDate, formatNumber } from "../../../common/numberUtils";
import moment from 'moment';

const CurrentPlan = ({data}) => {
// Calculate Plan Days Utilized
  const startAtDate = moment(data.startAt); // Convert startAt to moment date
  const currentDate = moment(); // Current date
  const planDaysUtilized = currentDate.diff(startAtDate, 'days'); // Difference in days

  return (
    <div className="row mt-15px">
        <div className="col-sm-12">
        <div className="row justify-content-center align-items-center pb-15px">
            <div className="col-sm-12 text-center">
                <div className="pricing-table box-shadow rounded-4 rounded-bottom-0">
                    <div className="pricing-header text-center text-golden bg-blue rounded-4 rounded-bottom-0 p-10px d-flex justify-content-between">
                        <div className="fw-500 fs-16 lh-1 d-flex align-items-center">
                            <i className="bi bi-box-arrow-up fs-26 me-5px lh-1"></i> Upgrade your current plan
                        </div>
                    </div>
                    <div className="pricing-body bg-white">
                        <ul className="list-style-01 p-0 mb-0">
                            <li className="border-color-transparent-dark-very-light p-10px fs-16" style={{"display": "flex", "alignItems": "flex-start"}}>
                                <i className="bi bi-check2-circle fs-22 fw-700" style={{"color": "rgb(20, 193, 20)", "marginRight": "8px", "marginTop": "-4px"}}></i>
                                <span className="text-start lh-sm">
                                    Don't let your unutilized reports expire. Add reports and exlent the plan access days.
                                </span>
                            </li>
                            <li className="border-color-transparent-dark-very-light p-10px fs-16" style={{"display": "flex", "alignItems": "flex-start"}}>
                                <i className="bi bi-check2-circle fs-22 fw-700" style={{"color": "rgb(20, 193, 20)", "marginRight": "8px", "marginTop": "-4px"}}></i>
                                <span className="text-start lh-sm">
                                    Upgrade to a higher value and reduce your cost per report.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div> 
            <fieldset className="ps-15px pe-15px pb-15px pt-10px d-block" style={{"background":"#f2f3f6"}}> 
                <legend className="fw-600 float-none border-1px col-auto fs-14 ps-15px pe-15px p-5px lh-1 border-radius-4px bg-light-blue text-blue m-0">Current Plan Details</legend>
                <div className="row justify-content-center mt-15px">
                    <div className="col-lg-4 md-mb-5px">
                        <div className="border pt-10px pb-10px rounded-4 bg-white h-100">
                            <table className="fs-16 fw-400 lh-normal text-end me-auto ms-auto">
                                <tbody>
                                    <tr>
                                        <td className="p-5px pt-0 lh-1">Plan ID</td>
                                        <td className="center p-5px pt-0 lh-1">:</td>
                                        <td className="fw-600 p-5px pt-0 lh-1 text-start">{data.planSeqId}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-5px">Plan Type</td>
                                        <td className="center p-5px">:</td>
                                        <td className="fw-600 p-5px text-start">{data.planType}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-5px">Order Type</td>
                                        <td className="center p-5px">:</td>
                                        <td className="fw-600 p-5px text-start">{data.orderType === "new" ? "New Order" : "Upgrade Order"}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-5px">Total Amount Paid</td>
                                        <td className="center p-5px">:</td>
                                        <td className="fw-600 p-5px text-start">USD {formatNumber(data.amount)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-lg-4 md-mb-5px">
                        <div className="border xs-mt-15px pt-10px pb-10px rounded-4 bg-white h-100 xs-h-auto d-flex justify-content-center align-items-center">
                            <table className="fs-16 fw-400 lh-normal text-end me-auto ms-auto">
                                <tbody>
                                    <tr>
                                        <td className="p-5px">Plan Order Date</td>
                                        <td className="center p-5px">:</td>
                                        <td className="fw-600 p-5px text-start">{formatDate(data.createdAt)}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-5px">Plan Activation Date</td>
                                        <td className="center p-5px">:</td>
                                        <td className="fw-600 p-5px text-start">{formatDate(data.startAt)}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-5px">Plan Expire Date</td>
                                        <td className="center p-5px">:</td>
                                        <td className="fw-600 p-5px text-start">{formatDate(data.expiresAt)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-lg-4 md-mb-5px">
                        <div className="border xs-mt-15px pt-10px pb-10px rounded-4 bg-white h-100 xs-h-auto">
                            <table className="fs-16 fw-400 lh-normal text-end me-auto ms-auto">
                                <tbody>
                                    <tr>
                                        <td className="p-5px">Number of Reports</td>
                                        <td className="center p-5px">:</td>
                                        <td className="fw-600 p-5px text-start">{data.balanceQuota}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-5px">Access Day</td>
                                        <td className="center p-5px">:</td>
                                        <td className="fw-600 p-5px text-start">{data.accessDays}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-5px">Plan Reports Utilized</td>
                                        <td className="center p-5px">:</td>
                                        <td className="fw-600 p-5px text-start">{data.orders.length}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-5px">Plan Days Utilized</td>
                                        <td className="center p-5px">:</td>
                                        <td className="fw-600 p-5px text-start">{planDaysUtilized || 0}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    </div> 
  )
}

export default CurrentPlan;