import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CommonLayout from "../../common/CommonLayout";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import Breadcrumb from "../../components/Breadcrumb";
import { apiURL } from "../../Config";
import { formatDate } from "../../common/utils/dateUtils";
import Filter from "./Filter";

const Listing = () => {
    const breadcrumbItems = [
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'Billings', active: true },
    ];

    const [data, setData] = useState([]); // State for plan data
    const [loading, setLoading] = useState(true); // Loading state

    const columns = [
        {
            name: 'Transaction Date',
            selector: row => row.createdAt, // Provide the raw date for sorting
            sortable: true,
            wrap: true,
            width: '10%',
            cell: row => (
                <div style={{ whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                    {row.createdAt ? formatDate(row.createdAt) : ''}
                </div>
            )
        },
        { name: 'Plan Order ID', selector: row => row.orderId, sortable: true, wrap: true, width:'10%' },
        { name: 'Customer Email', selector: row => row.email, sortable: true, wrap: true, width:'10%' },
        { name: 'Country', selector: row => row.country, sortable: true, wrap: true, width:'10%' },
        { name: 'Customer Plan ID', selector: row => row.planSeqId, sortable: true, wrap: true, width:'10%' },
        { name: 'Plan Type', selector: row => row.planType, sortable: true, wrap: true, width:'10%' },
        { name: 'Order Type', selector: row => row.orderType, sortable: true, wrap: true, width:'10%' },
        { name: 'Report Count', selector: row => row.reportCount, sortable: true, wrap: true, width:'10%' },
        { name: 'Transaction Amount', selector: row => row.amount.toFixed(2), sortable: true, wrap: true, width:'10%' },
        {
            name: 'Action',
            cell: row => (
                <div>
                    <Link to={`/view-billings/${row._id}`} className="btn btn-sm btn-primary me-2">View Details</Link>
                </div>
            ),
            ignoreRowClick: true,
            width:'10%'
        }
    ];

    const fetchTransactions = async (filters) => {
        try {
            const response = await axios.get(`${apiURL}api/admin/transaction/`, {
                params: filters
            });
            if (response.status === 200) {
                setData(response.data);
            } else {
                throw new Error('Failed to fetch transactions');
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // fetchTransactions({});
    }, []);

    const handleFilterChange = (filters) => {
        setLoading(true);
        fetchTransactions(filters);
    };

    return (
        <CommonLayout>
            <div id="content" className="main-content">
                <div className="layout-px-spacing">
                    <div className="middle-content container-xxl p-0">
                        <Breadcrumb items={breadcrumbItems} />
                        <div className="row layout-spacing">
                            <div className="col-lg-12">
                                <div className="statbox widget box box-shadow">
                                    <div className="widget-header pb-2">
                                        <div className="row">
                                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                                {/* <h4>Billing Transactions</h4> */}
                                            </div>
                                        </div>
                                    </div>
                                    <Filter onFilterChange={handleFilterChange} />
                                    <div className="widget-content widget-content-area">
                                        {loading ? (
                                            <div className="loader mx-auto"></div>
                                        ) : (
                                            <DataTableComponent
                                                title="Customer Records"
                                                columns={columns}
                                                data={data}
                                                searchFields={['createdAt', 'orderId', 'email', 'country', 'planSeqId', 'planType', 'orderType', 'reportCount', 'amount']}
                                                pagination
                                                striped
                                                highlightOnHover
                                                className="table style-1 dt-table-hover"
                                            />
                                        )}
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

export default Listing;
