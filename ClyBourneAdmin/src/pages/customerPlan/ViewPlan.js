import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonLayout from "../../common/CommonLayout";
import Breadcrumb from "../../components/Breadcrumb";
import Filter from "./Filter";
import { apiURL } from "../../Config";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import { formatDate } from "../../common/utils/dateUtils";
import Loader from '../../common/Loader';

const ViewPlan = () => {
    const [filterData, setFilterData] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(""); // New state for selected customer
    const [customerData, setCustomerData] = useState(null); // State to store customer data
    const [loadingDropdown, setLoadingDropdown] = useState(true); // Loader for dropdown
    const [loadingCustomerData, setLoadingCustomerData] = useState(false); // Loader for customer data

    const columns = [
        { name: 'Order Date', selector: row => row.createdAt ? row.createdAt : '' , sortable: true, width: '10%',  cell: row => (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {formatDate(row.createdAt)}
            </div>
        ) },
        { name: 'Plan Type', selector: row => row.planType, sortable: true, width: '10%' },
        { name: 'Plan ID', selector: row => row.planSeqId, sortable: true, width: '10%' },
        { name: 'Order Type', selector: row => row.orderType ? row.orderType.charAt(0).toUpperCase() + row.orderType.slice(1) : '', sortable: true, width: '10%' },
        { name: 'Reports Added', selector: row => row.balanceQuota, sortable: true, width: '10%' },
        { name: 'Access Days', selector: row => row.accessDays, sortable: true, width: '10%' },
        { name: 'Reports Utilized', selector: row => row.orders.length, sortable: true, width: '10%' },
        { name: 'Plan Expiry Date', selector: row => row.expiresAt ? row.expiresAt : '' , sortable: true, width: '10%' , cell: row => (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {row.expiresAt ? formatDate(row.expiresAt) : ''}
            </div>
        ) },
        { name: 'Status', selector: row => row.planStatusType ? row.planStatusType.charAt(0).toUpperCase() + row.planStatusType.slice(1) : '', sortable: true, width: '10%' },
        { name: 'Action', selector: '', sortable: true, width: '10%' },
    ];

    const breadcrumbItems = [
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'Customer Plans', active: true }
    ];

    // Fetch dropdown data from a single API endpoint
    useEffect(() => {
        const fetchDropdownData = async () => {
            setLoadingDropdown(true); // Start loader
            try {
                const response = await axios.get(`${apiURL}api/admin/orders/dropdowns`);
                setFilterData(response.data.customerplans || []);
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            } finally {
                setLoadingDropdown(false); // Stop loader
            }
        };

        fetchDropdownData();

        // Retrieve the selected customer from local storage (if it exists)
        const storedCustomer = localStorage.getItem('selectedCustomerPlan');
        if (storedCustomer) {
            setSelectedCustomer(storedCustomer);
        }
    }, []);

    // Fetch customer data based on selected customer on page load
    useEffect(() => {
        if (selectedCustomer) {
            const fetchCustomerData = async () => {
                setLoadingCustomerData(true); // Start loader
                try {
                    const response = await axios.get(`${apiURL}api/admin/orders/customer-plan/${selectedCustomer}`);
                    setCustomerData(response.data.data || []);
                } catch (error) {
                    console.error('Error fetching customer data:', error);
                } finally {
                    setLoadingCustomerData(false); // Stop loader
                }
            };

            fetchCustomerData();
        }
    }, [selectedCustomer]);

    const handleFilterSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Fetch customer data based on the selected customer ID
        if (selectedCustomer) {
            try {
                setLoadingCustomerData(true); // Start loader
                const response = await axios.get(`${apiURL}api/admin/orders/customer-plan/${selectedCustomer}`);
                setCustomerData(response.data.data || []); // Store the fetched customer data, default to an empty array
                localStorage.setItem('selectedCustomerPlan', selectedCustomer); // Store in local storage
            } catch (error) {
                console.error('Error fetching customer data:', error);
            } finally {
                setLoadingCustomerData(false); // Stop loader
            }
        }
    };

    return (
        <CommonLayout page={'parameter'}>
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
                                                <h4>Customer Plans</h4>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Show loader while fetching dropdown data */}
                                    {loadingDropdown ? (
                                        <Loader /> // Add a loader component while fetching dropdown data
                                    ) : (
                                        <Filter data={filterData} selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} handleFilterSubmit={handleFilterSubmit} setCustomerData={setCustomerData} />
                                    )}

                                    <div className="widget-content widget-content-area">
                                        {/* Show loader while fetching customer data */}
                                        {loadingCustomerData ? (
                                            <Loader /> // Add a loader component while fetching customer data
                                        ) : (
                                            customerData && (
                                                <DataTableComponent
                                                    title="User Records"
                                                    columns={columns}
                                                    data={customerData || []} // Ensure data is an array
                                                    searchFields={['planType', 'planSeqId', 'createdAt', 'balanceQuota', 'orderType', 'expiresAt', 'accessDays','planStatusType']}
                                                    pagination
                                                    striped
                                                    highlightOnHover
                                                    className="table style-1 dt-table-hover"
                                                />
                                            )
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

export default ViewPlan;
