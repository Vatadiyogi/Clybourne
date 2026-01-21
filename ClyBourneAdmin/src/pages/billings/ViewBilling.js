import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommonLayout from "../../common/CommonLayout";
import Breadcrumb from "../../components/Breadcrumb";
import "./ViewBilling.css";
import { apiURL } from '../../Config';

const ViewBilling = () => {
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    const breadcrumbItems = [
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'Billings', link: '/billings' },
        { label: 'Billing Detail', active: true }
    ];

    const fetchTransaction = async (id) => {
        try {
            const response = await axios.get(`${apiURL}api/admin/transaction/${id}`);
            setTransaction(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchTransaction(id);
        }
    }, [id]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching transaction data</div>;
    }

    return (
        <CommonLayout>
            <div id="content" className="main-content">
                <div className="container">
                    <div className="container">
                        <div className="page-meta pb-2">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                        <div className="row">
                            <div id="flHorizontalForm" className="col-lg-12 layout-spacing">
                                <div className="statbox widget box box-shadow">
                                    <div className="widget-header">
                                        <div className="row">
                                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                <h4>Billing Detail</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-content widget-content-area">
                                        <ul className="list-group">
                                        <li className="list-group-item">
                                                <strong>Order Id:</strong> {transaction.orderId}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Customer Id:</strong> {transaction.customerId.customerId}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Customer Email:</strong> {transaction.email}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Plan Id:</strong> {transaction.planSeqId}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Plan Type:</strong> {transaction.planType}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Transaction Amount:</strong> ${transaction.amount.toFixed(2)}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Order Type:</strong> {transaction.orderType}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Payment Type:</strong> {transaction.gatewayType}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Transaction Id:</strong> {transaction.txnId}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Payment Status:</strong> {transaction.status}
                                            </li>
                                        </ul>
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

export default ViewBilling;
