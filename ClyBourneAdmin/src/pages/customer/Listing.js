import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CommonLayout from "../../common/CommonLayout";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import Breadcrumb from "../../components/Breadcrumb";
import { apiURL } from "../../Config";
import { formatDate } from "../../common/utils/dateUtils";

const Listing = () => {
    const breadcrumbItems = [
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'Customers', active: true },
    ];

    const [data, setData] = useState([]); // State for plan data
    const [loading, setLoading] = useState(true); // Loading state

    const columns = [
        {
            name: 'Name',
            selector: row => `${row.first_name} ${row.last_name}`,
            sortable: true,
            wrap: true 
        },
        { name: 'Email', selector: row => row.email, sortable: true, wrap: true },
        { name: 'Company', selector: row => row.company, sortable: true },
        { name: 'Active Plan', selector: row => row.activePlanType, sortable: true },
        // {
        //     name: 'Status',
        //     selector: row => row.status === 1 ? 'Active' : 'Inactive',
        //     cell: row => (
        //         <span 
        //             className={`badge ${row.status === 1 ? 'badge-success' : 'badge-danger'}`} 
        //             onClick={() => handleStatusChange(row._id, row.status)}
        //             style={{ cursor: 'pointer' }}
        //         >
        //             {row.status === 1 ? 'Active' : 'Inactive'}
        //         </span>
        //     ),
        //     sortable: true
        // },
        {
            name: 'Email Verified',
            selector: row => row.status === 1 ? 'Yes' : 'No',
            sortable: true
        },
        {
            name: 'Created On',
            selector: row => row.createdAt, // Provide the raw date for sorting
            sortable: true,
            cell: row => (
                <div>
                    {row.createdAt ? formatDate(row.createdAt) : ''}
                </div>
            )
        },
        {
            name: 'Action',
            cell: row => (
                <div>
                    <Link to={`/customer-detail/${row._id}`} className="btn btn-sm btn-primary me-2">View</Link>
                    {/* Add delete functionality if needed */}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`${apiURL}api/admin/customer/`);
            if (response.status === 200) {
                setData(response.data);
            } else {
                throw new Error('Failed to fetch customers');
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    // const handleStatusChange = async (id, currentStatus) => {
    //     try {
    //         const newStatus = currentStatus === 1 ? 0 : 1;
    //         const response = await axios.put(`${apiURL}api/admin/customer/edit/${id}`, { status: newStatus });
    //         if (response.status === 200) {
    //             setData(prevData =>
    //                 prevData.map(plan =>
    //                     plan._id === id ? { ...plan, status: newStatus } : plan
    //                 )
    //             );
    //         } else {
    //             throw new Error('Failed to update status');
    //         }
    //     } catch (error) {
    //     }
    // };

    useEffect(() => {
        fetchCustomers();
    }, []);

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
                                                {/* <h4>Customers</h4> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-content widget-content-area">
                                        {loading ? (
                                            <div className="loader mx-auto"></div>
                                        ) : <DataTableComponent
                                                title="Customer Records"
                                                columns={columns}
                                                data={data}
                                                searchFields={['first_name', 'last_name' ,'email', 'company', 'activePlanType', 'status']}
                                                pagination
                                                striped
                                                highlightOnHover
                                                className="table style-1 dt-table-hover"
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>          
        </CommonLayout>
    );
}

export default Listing;
