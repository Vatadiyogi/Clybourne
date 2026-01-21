import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import CommonLayout from "../../../common/CommonLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import './View.css';
import axios from "axios";
import { apiURL } from "../../../Config";
import CustomerDetails from "./CustomerDetails";
import ReportDetails from "./ReportDetails";
import UserParameters from "./UserParameters";
import ParameterForm from "./ParameterForm";
import ExcelForm from "./Excel/ExcelForm";
import DCFValuation from "./Valuation/DCFValuation";

const View = () => {
    const { id } = useParams();
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showParameterForm, setShowParameterForm] = useState(true);
    const [showDcf, setShowDcf] = useState(false);
    const [showExcelForm, setShowExcelForm] = useState(false);
    const [valuationData, setValuationData] = useState(null);

    const breadcrumbItems = [
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'All Report Orders', link: '/orders' },
        { label: 'Customer Order Evaluation Details', active: true },
    ];

    useEffect(() => {
        const fetchOrder = async (id) => {
            try {
                const response = await axios.get(`${apiURL}api/admin/orders/${id}`);
                const { customer, order, calculations } = response.data;

                // Update state with fetched order and customer data
                setOrder({
                    customerName: customer.customerName,
                    customerEmail: customer.customerEmail,
                    customerContact: customer.customerContact,
                    planType: customer.planType,
                    planSequenceId: customer.planSeq,
                    systemOrderId: order.systemOrderId,
                    status: order.status,
                    createdOn: order.createdOn,
                    customerOrderSeq: order.customerSequence,
                    submittedBy: order.submittedBy ? order.submittedBy.userName : '',
                    submittedOn: order.submittedOn,
                    companyName: order.companyName,
                    reportDueDate: order.reportDueDate,
                    completedOn: order.completedOn,
                    country: order.country,
                    assignedTo: order.assignedTo,
                    resubmittedOn: order.resubmittedOn,
                    custody: order.custody,
                    revisedCompletedOn: order.revisedCompletedOn,
                    calculations: calculations,
                    businessDetails: order.business,
                    valuationStatus: order.valuationStatus,
                    assignedId: order.assignedId?._id,
                    documents: order.documents,
                    planData: order.planData
                });
                setLoading(false);
            } catch (error) {
                setError(error.message || 'Error fetching order and customer data');
                setLoading(false);
            }
        };

        fetchOrder(id); // Assuming 'id' is passed as a parameter in the route
    }, [id]);

    const fetchValuationData = async () => {
        try {
            const response = await axios.get(`${apiURL}api/admin/orders/valuation-data/${id}`);
            return response.data;

        } catch (error) {
            console.error("Error fetching valuation data", error);
        }
    };
    
    const handleValuationSuccess = async () => {
        setShowExcelForm(false);
        setShowDcf(true);
        const data = await fetchValuationData();
        if (data) {
            console.log(data);
            setValuationData(data);
        } else {
            console.log("Valuation data is null");
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Placeholder for loading indicator
    }

    if (error) {
        return <p>Error: {error}</p>; // Display error message if fetching data fails
    }

    const handleFormSubmit = async (formValues) => {
        try {
            const body = {
                "back_end_inputs": formValues,
            };

            const response = await axios.put(`${apiURL}api/admin/orders/valuation-parameters/${id}`, body, {
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.status === 202) {
                setShowParameterForm(false);
                setShowExcelForm(true);
            }
        } catch (error) {
            console.error("Error submitting form", error);
            // Handle the error appropriately, e.g., show an error message to the user
        }
    };

    return (
        <CommonLayout>
            <div id="content" className="main-content">
                <div className="layout-px-spacing">
                    <div className="middle-content container-xxl p-0">
                        <Breadcrumb items={breadcrumbItems} />
                        {/* Display order details */}
                        <div className="row layout-spacing">
                            <div className="col-lg-12">
                                <div className="statbox widget box box-shadow">
                                    <div className="widget-header pb-2">
                                        <div className="row">
                                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                {/* <h4>Customer Order Evaluation Details</h4> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-content widget-content-area">
                                        {showParameterForm && (
                                            <>
                                                <CustomerDetails order={order} />
                                                <ReportDetails order={order} />
                                                <UserParameters data={order.calculations} />
                                                <ParameterForm data={order} onFormSubmit={handleFormSubmit} />
                                            </>
                                        )}
                                        {showDcf && 
                                            <>
                                                <CustomerDetails order={order} />
                                                <ReportDetails order={order} />
                                                <DCFValuation data={valuationData} />
                                            </>
                                        }
                                        {showExcelForm && <ExcelForm order={order} onValuationSuccess={handleValuationSuccess}/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CommonLayout>
    );
};

export default View;
