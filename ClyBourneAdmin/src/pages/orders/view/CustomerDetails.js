// src/components/CustomerDetails.js
import React from 'react';
import './View.css';

const CustomerDetails = ({ order }) => (
    <div id="card_1" className="customer col-xxl-12 col-xl-12 col-lg-12 col-md-12">
    <h5>Customer Details</h5>
    <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-8 mx-auto">
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="label-value">
                                <span className="label">Customer Name: </span> {order.customerName} 
                            </div>
                        </div>
                        <div className="col-md-4">
                                <div className="label-value">
                                <span className="label">Customer Email: </span> {order.customerEmail} 
                                    
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="label-value">
                                    <span className="label">Customer Contact:</span> {order.customerContact}
                                </div>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="label-value">
                                <span className="label">Plan Type: </span>  {order.planData?.planType}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="label-value">
                                <span className="label">Plan Sequence ID: </span> {order.planData?.planOrderId?.planSeqId || 'N/A'}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</div>

);

export default CustomerDetails;
