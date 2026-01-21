import React, { useState } from 'react';
import { formatDate } from "../../../common/numberUtils";
import { Link } from "react-router-dom";
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css'; // Optional, for basic styling
import { useNavigate } from 'react-router-dom';
  
const Table = ({data}) => {
    const [expandedRows, setExpandedRows] = React.useState({});
    const navigate = useNavigate();

    const toggleRow = (index) => {
        setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const newOrder = async () => {
        navigate({
            pathname: `/valuation-form`,
        });
    }

 const renderLink = (status, id, submittedOn, custody ,resubmit_time, resubmit_pending, orderplan) => {
    
    if (status === 'Help Requested' && custody === "Company") {
        return <Link to={`/preview-data/${id}`} className="fs-12 m-0 lh-1 pt-10px pb-10px text-white fs-12 fw-400 text-capitalize fin-btn d-inline-block ls-05px w-110px text-center border-radius-4px">
            <i className="bi bi-info-circle"></i> View Details
        </Link>;
    }

    if (status === 'Help Requested' && custody === "Customer") {
        if(orderplan?.planOrderId?.planStatusType === 'expired'){
            return <><Link to={`/preview-data/${id}`} className="fs-12 m-0 lh-1 pt-10px pb-10px text-white fs-12 fw-400 text-capitalize fin-btn d-inline-block ls-05px w-110px text-center border-radius-4px">
                <i className="bi bi-info-circle"></i> View Details
            </Link>
            <br/><span class="text-red text-center fs-12">Plan Expired</span></>;
        }else {
            return <Link to={`/valuation-form/${id}`} className="fs-12 m-0 lh-1 pt-10px pb-10px text-white fs-12 fw-400 text-capitalize fin-btn d-inline-block ls-05px w-110px text-center border-radius-4px"><i className="bi bi-pencil"></i> Edit</Link>;
        } 
    }

    if(status === 'Completed' && resubmit_pending === 1){
        return <div className="btn-group text-nowrap">
                    <Link
                        to = {`/valuation-form/${id}`}  
                        className="fs-12 m-0 lh-1 pt-10px pb-10px text-white fs-12 fw-400 text-capitalize fin-btn d-inline-block ls-05px w-80px text-center border-radius-4px"
                        style={{ borderBottomRightRadius: "0px", borderTopRightRadius: "0px" }}
                    >
                        <i className="bi bi-pencil-square"></i> Modify
                    </Link>
                    <Tooltip
                        placement="top" // Tooltip position
                        overlay={<span>{`${resubmit_time} hours remaining to re-submit`}</span>} // Tooltip content
                        trigger={['hover']} // Trigger on hover
                        >
                        <span
                            className="bg-red pt-10px pb-10px fw-400 text-white w-30px text-center border-radius-4px"
                            style={{ borderBottomLeftRadius: "0px", borderTopLeftRadius: "0px" }}
                        >
                            <i className="bi bi-clock"></i>
                        </span>
                        </Tooltip>
                </div>
    }

    if(status === 'Completed' && resubmit_pending === 0){
        return <Link to={`/preview-data/${id}`} className="fs-12 m-0 lh-1 pt-10px pb-10px text-white fs-12 fw-400 text-capitalize fin-btn d-inline-block ls-05px w-110px text-center border-radius-4px">
            <i className="bi bi-info-circle"></i> View Details
        </Link>;
    }

    if(status === 'Pending Submission'){
       if(orderplan?.planOrderId?.planStatusType === 'expired'){
            return <><Link to={`/preview-data/${id}`} className="fs-12 m-0 lh-1 pt-10px pb-10px text-white fs-12 fw-400 text-capitalize fin-btn d-inline-block ls-05px w-110px text-center border-radius-4px">
                <i className="bi bi-info-circle"></i> View Details
            </Link>
            <br/><span class="text-red text-center fs-12">Plan Expired</span></>;
       }else {
            return <Link to={`/valuation-form/${id}`} className="fs-12 m-0 lh-1 pt-10px pb-10px text-white fs-12 fw-400 text-capitalize fin-btn d-inline-block ls-05px w-110px text-center border-radius-4px"><i className="bi bi-pencil"></i> Edit</Link>;
       } 
    }
    
    switch (status) {
        case 'Help Requested':
           return <Link to={`/valuation-form/${id}`} className="fs-12 m-0 lh-1 pt-10px pb-10px text-white fs-12 fw-400 text-capitalize fin-btn d-inline-block ls-05px w-110px text-center border-radius-4px"><i className="bi bi-pencil"></i> Edit</Link>;    

        case 'Submitted':
           return <Link to={`/preview-data/${id}`} className="fs-12 m-0 lh-1 pt-10px pb-10px text-white fs-12 fw-400 text-capitalize fin-btn d-inline-block ls-05px w-110px text-center border-radius-4px"><i className="bi bi-info-circle"></i> View Details</Link>;

        case 'Re-Submitted':
           return <Link to={`/preview-data/${id}`} className="fs-12 m-0 lh-1 pt-10px pb-10px text-white fs-12 fw-400 text-capitalize fin-btn d-inline-block ls-05px w-110px text-center border-radius-4px"><i className="bi bi-info-circle"></i> View Details</Link>;
        
        case 'Completed (Revised)':
        return <Link to={`/preview-data/${id}`} className="fs-12 m-0 lh-1 pt-10px pb-10px text-white fs-12 fw-400 text-capitalize fin-btn d-inline-block ls-05px w-110px text-center border-radius-4px">
                <i className="bi bi-info-circle"></i> View Details
            </Link>;
      
        default:
            return <Link to={`/preview-data/${id}`} className="fs-12 m-0 lh-1 pt-10px pb-10px text-white fs-12 fw-400 text-capitalize fin-btn d-inline-block ls-05px w-110px text-center border-radius-4px">
                <i className="bi bi-info-circle"></i> View Details
            </Link>;
    }
    };

  return (
    <>
        <form className="contact-form-style-04 myform-01 justify-content-center mt-15px">
            <div className="row justify-content-between">
                <div className="col-sm-3">
                    <div className="input-group mb-10px w-180px">
                        <span className="input-group-text p-5px h-30px justify-content-center border-radius-0px fs-14">Show</span>
                        <div className="select">
                            <select className="form-control h-30px" name="select" aria-label="select-industry">
                                <option value="10">10</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="1000">1000</option>
                                <option value="All">All</option>
                            </select>
                        </div>
                        <span className="input-group-text p-5px h-30px justify-content-center border-radius-0px fs-14">entries</span>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="input-group mb-10px">
                        <span className="input-group-text p-0 w-35px h-30px justify-content-center border-radius-0px">
                            <i className="bi bi-search align-middle fs-18 lh-1"></i>
                        </span>
                        <input className="mb-0 form-control bg-white h-30px" type="text" name="search" value=""/>
                        <button className="bg-blue h-30px lh-1 ps-10px pe-10px fs-12 m-0  text-white fs-12 fw-600 text-capitalize fin-btn d-inline-block ls-05px border-0" type="button">Search</button>
                    </div>
                </div>
            </div>
        </form>
        <div className="table-responsive">
            <table className="table table-striped table-bordered fs-14 lh-normal mytable border-light-blue align-middle">
                <thead className="border-solid border-1 border-light-blue">
                    <tr>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue">Order#</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue desktop-only">Plan Id</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue">Company Name</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue">Status</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue w-50px mobile-only">Details</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue desktop-only">Country</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue desktop-only">Created On</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue desktop-only">Submitted On</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue desktop-only">Completed On</th>
                        <th scope="col" className="text-nowrap bg-blue text-white fw-600 border-solid border-1 border-light-blue desktop-only">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((order, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                {/* Show "Order#" in all views */}
                                <td className="align-middle text-center fs-14">
                                    {order['customerOrderSequence']}
                                </td>
                                {/* "Plan Id" visible only on desktop */}
                                <td className="align-middle text-center fs-14 desktop-only">
                                    {order?.orderplan?.planOrderId?.planSeqId ?? ''}
                                </td>
                                <td className="fs-14">
                                    {order['companyName']}
                                    {order['status'] === 'Completed' && (
                                        <>
                                            <br />
                                            <a 
                                                href={order.report_url} 
                                                target="_blank" 
                                                className="bg-green text-nowrap text-white border-radius-5px pe-5px ps-5px pb-1 fs-11 ls-normal mobile-text-wrap-normal"  
                                                rel="noopener noreferrer"
                                                download
                                            >
                                                <i className="bi bi-download"></i> Valuation report
                                            </a>
                                        </>
                                    )}
                                    {order['status'] === 'Re-Submitted' && (
                                        <>
                                            <br />
                                            <a 
                                                href={order.report_url} 
                                                className="bg-green text-nowrap text-white border-radius-5px pe-5px ps-5px pb-1 fs-11 ls-normal mobile-text-wrap-normal"  
                                                rel="noopener noreferrer"
                                                target="_blank"
                                                download
                                            >
                                                <i className="bi bi-download"></i> Valuation report
                                            </a>
                                            <br/>
                                            <span className="bg-red text-nowrap text-white border-radius-5px pe-5px ps-5px pb-1 fs-11 ls-normal d-inline-block mt-5px mobile-text-wrap-normal">
                                                <i className="bi bi-arrow-clockwise"></i> Revised valuation report - Pending
                                            </span>
                                        </>
                                    )}
                                    {order['status'] === 'Completed (Revised)' && (
                                        <>
                                            <br />
                                            <a 
                                                href={order.report_url} 
                                                className="bg-green text-nowrap text-white border-radius-5px pe-5px ps-5px pb-1 fs-11 ls-normal mobile-text-wrap-normal"  
                                                rel="noopener noreferrer"
                                                target="_blank"
                                                download
                                            >
                                                <i className="bi bi-download"></i> Revised Valuation report
                                            </a>
                                        </>
                                    )}
                                </td>
                                <td className="fs-14 status-cell">{order['status']}</td>
                                {/* Mobile toggle button for details */}
                                <td className="align-middle text-center mobile-only">
                                    <button 
                                        onClick={() => toggleRow(index)} 
                                        className="btn btn-link p-0 border-0 toggle-details"
                                    >
                                        {expandedRows[index] ? <i className="bi bi-dash-circle-fill sm-fs-15 text-blue"></i> : <i className="bi bi-plus-circle-fill sm-fs-15 text-blue"></i>}
                                    </button>
                                </td>
                                <td className="fs-14 desktop-only">{order['country']}</td>
                                <td className="fs-14 desktop-only">{formatDate(order['createdAt'])}</td>
                                <td className="fs-14 desktop-only">{order['submittedOn'] && formatDate(order['submittedOn'])}</td>
                                <td className="fs-14 desktop-only">{order['completedOn'] && formatDate(order['completedOn'])}</td>
                                <td className="fs-14 desktop-only">{renderLink(order['status'], order['_id'], order['submittedOn'], order['custody'], order['remaining_hours'], order['resubmit_pending'], order['orderplan'])}</td>
                            </tr>
                            {expandedRows[index] && (
                                <tr className="bg-light mobile-only">
                                    <td colSpan="5">
                                        <div className="p-3">
                                            {/* Replace "Order#" with "Plan Id" in expanded details */}
                                            <p className="sm-mb-10px"><strong>Plan Id:</strong> {order?.orderplan?.planOrderId?.planSeqId ?? 'N/A'}</p>
                                            <p className="sm-mb-10px"><strong>Country:</strong> {order['country']}</p>
                                            <p className="sm-mb-10px"><strong>Created On:</strong> {formatDate(order['createdAt'])}</p>
                                            <p className="sm-mb-10px"><strong>Submitted On:</strong> {order['submittedOn'] && formatDate(order['submittedOn'])}</p>
                                            <p className="sm-mb-10px"><strong>Completed On:</strong> {order['completedOn'] && formatDate(order['completedOn'])}</p>
                                            <p className="sm-mb-10px"><strong>Action:</strong> {renderLink(order['status'], order['_id'], order['submittedOn'], order['custody'], order['remaining_hours'], order['resubmit_pending'], order['orderplan'])}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
        
    </>
  )
}

export default Table;