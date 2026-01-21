// src/components/ReportDetails.js
import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import { formatDateTime } from '../../../common/utils/dateUtils';
import { Link } from 'react-router-dom';
import Documents from './modal/Documents';
import axios from 'axios';
import { apiURL, FRONTEND_URL } from '../../../Config';
import Swal from 'sweetalert2';

const ReportDetails = ({ order }) => {
    const { id } = useParams();
    const adminId = localStorage.getItem('user_id');
    const [isDocumentModalOpen, setDocumentModalOpen] = useState(false);
    
    const handleDocumentModalOpen = () => {
        setDocumentModalOpen(true);
    };

    const handleDocumentModalClose = () => {
        setDocumentModalOpen(false);
    };

    // Admin panel code example
    const handleAdminLogin = async () => {
        try {
          const response = await axios.post(apiURL + 'api/admin/admin/generate-frontend-token', 
            { adminId: adminId }, // Send adminId as payload
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
      
          const data = response.data; // Axios automatically parses the JSON response
          if (data.status) {
            // Redirect to frontend login page with token
            window.open(`${FRONTEND_URL}admin-login?token=${data.token}&orderId=${id}`, '_blank');
          } else {
            Swal.fire('Something went wrong');
          }
        } catch (error) {
          Swal.fire('Something went wrong');
        }
      }; 

    return (
    <div id="card_1" className="report col-xxl-12 col-xl-12 col-lg-12 col-md-12">
        <h5>Report Order Details</h5>
        <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-8 mx-auto">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="label-value">
                                    <span className="label">System Order ID:</span> {order.systemOrderId}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="label-value">
                                    <span className="label">Status:</span> {order.status}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="label-value">
                                    <span className="label">Created On:</span> {order.createdOn ? formatDateTime(order.createdOn) : ''}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="label-value">
                                    <span className="label">Cust. Order Sequence:</span> {order.customerOrderSeq}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="label-value">
                                    <span className="label">Submitted By:</span> {order.submittedBy}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="label-value">
                                    <span className="label">Submitted On:</span> {order.submittedOn ? formatDateTime(order.submittedOn) : ''}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="label-value">
                                    <span className="label">Company Name:</span> {order.companyName}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="label-value">
                                    <span className="label text-danger">Report Due By:</span> {order.reportDueDate ? formatDateTime(order.reportDueDate) : ''}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="label-value">
                                    <span className="label">Completed On:</span> {order.completedOn ? formatDateTime(order.completedOn) : ''}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="label-value">
                                    <span className="label">Country:</span> {order.country}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="label-value">
                                    <span className="label">Assigned To:</span> {order.assignedTo}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="label-value">
                                    <span className="label">Resubmitted On:</span> {order.resubmittedOn ? formatDateTime(order.resubmittedOn) : ''}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4"></div>
                            <div className="col-md-4">
                                <div className="label-value">
                                    <span className="label">Custody:</span> {order.custody}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="label-value">
                                    <span className="label">Revised Completed On:</span> {order.revisedCompletedOn ? formatDateTime(order.revisedCompletedOn) : ''}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Link className="btn btn-md btn-primary me-2" to={`/view-order-inputs/${id}?type=initials`}>View Initial Input Data</Link>
                                {order.status === "Re-Submitted" &&
                                    <Link className="btn btn-md btn-primary me-2" to={`/view-order-inputs/${id}`}>View Revised Input Data</Link>
                                }
                            </div>

                            <div className="col-md-6 textRight">
                            {order.status === "Help Requested" || (order.documents && order.documents.length > 0) ?
                                <button className="btn btn-md btn-primary me-2" onClick={handleDocumentModalOpen}>
                                    View Documents
                                </button>
                                : <></>
                            }
                            {order.status === "Help Requested" && order.assignedTo && order.assignedId === adminId  &&
                                <button className="btn btn-md btn-primary me-2" onClick={handleAdminLogin}>
                                    Fill Valuation Form Data
                                </button>
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Render Document Modal */}
        {isDocumentModalOpen && <Documents documents={order.documents} onClose={handleDocumentModalClose} />}
    </div>
    )
};

export default ReportDetails;
