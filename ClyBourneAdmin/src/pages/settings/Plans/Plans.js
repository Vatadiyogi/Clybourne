import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CommonLayout from "../../../common/CommonLayout";
import DataTableComponent from "../../../components/DataTable/DataTableComponent";
import Breadcrumb from "../../../components/Breadcrumb";
import { apiURL } from "../../../Config";

const Plans = () => {
    const breadcrumbItems = [
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'Setup', link: '/dashboard' },
        { label: 'All Plans', active: true }
    ];

    const [data, setData] = useState([]); // State for plan data
    const [loading, setLoading] = useState(true); // Loading state

    const columns = [
        { 
            name: 'Display Order', 
            selector: row => row.displaySequence, 
            sortable: true, 
            style: { 
                whiteSpace: 'normal', 
                wordWrap: 'break-word' 
            },
            width: '120px'
        },
        { 
            name: 'Id', 
            selector: row => row.sequenceId, 
            sortable: true, 
            style: { 
                whiteSpace: 'normal', 
                wordWrap: 'break-word' 
            },
            width: '100px'
        },
        { 
            name: 'Plan Name', 
            selector: row => row.name, 
            sortable: true, 
            style: { 
                whiteSpace: 'normal', 
                wordWrap: 'break-word' 
            },
            width: '200px'
        },
        { 
            name: 'Plan Type', 
            selector: row => row.planType, 
            sortable: true, 
            style: { 
                whiteSpace: 'normal', 
                wordWrap: 'break-word' 
            },
            width: '150px'
        },
        { 
            name: 'Number of Reports', 
            selector: row => row.reports, 
            sortable: true, 
            style: { 
                whiteSpace: 'normal', 
                wordWrap: 'break-word' 
            },
            width: '150px'
        },
        { 
            name: 'Access Days', 
            selector: row => row.accessDays, 
            sortable: true, 
            style: { 
                whiteSpace: 'normal', 
                wordWrap: 'break-word' 
            },
            width: '120px'
        },
        { 
            name: 'Price (USD)', 
            selector: row => row.price, 
            sortable: true, 
            style: { 
                whiteSpace: 'normal', 
                wordWrap: 'break-word' 
            },
            width: '150px'
        },
        {
            name: 'Status',
            selector: row => row.status === 1 ? 'Active' : 'Inactive',
            cell: row => (
                <span 
                    className={`badge ${row.status === 1 ? 'badge-success' : 'badge-danger'}`} 
                    onClick={() => handleStatusChange(row._id, row.status)}
                    style={{ cursor: 'pointer', whiteSpace: 'normal', wordWrap: 'break-word' }}
                >
                    {row.status === 1 ? 'Active' : 'Inactive'}
                </span>
            ),
            sortable: true,
            style: { 
                whiteSpace: 'normal', 
                wordWrap: 'break-word' 
            },
            width: '120px'
        },
        {
            name: 'Action',
            cell: row => (
                <div>
                    <Link to={`/edit-plan/${row._id}`} className="btn btn-sm btn-primary me-2">Edit</Link>
                    {/* Add delete functionality if needed */}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            style: { 
                whiteSpace: 'normal', 
                wordWrap: 'break-word' 
            },
            width: '150px'
        }
    ];
    
    const fetchPlans = async () => {
        try {
            const response = await fetch(`${apiURL}api/admin/plan/`);
            const responseData = await response.json();

            if (response.ok) {
                const formattedData = responseData.map(plan => ({
                    ...plan,
                    price: plan.price.$numberDecimal ? parseFloat(plan.price.$numberDecimal) : plan.price
                }));
                setData(formattedData);
            } else {
                throw new Error('Failed to fetch plans');
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            const response = await axios.put(`${apiURL}api/admin/plan/edit/${id}`, { status: newStatus });
            if (response.status === 200) {
                setData(prevData =>
                    prevData.map(plan =>
                        plan._id === id ? { ...plan, status: newStatus } : plan
                    )
                );
            } else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchPlans();
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
                                                {/* <h4>Plans</h4> */}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xl-4 col-md-4 col-sm-12 col-12 pl-1">
                                            </div>
                                            <div className="col-xl-1 col-md-1"></div>
                                            <div className="col-xl-6 col-md-6 col-sm-12 col-12 text-end">
                                                <Link to="/add-plan" className="btn btn-primary mt-2">Add Plans</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-content widget-content-area">
                                        {loading ? (
                                            <div className="loader mx-auto"></div>
                                        ) : <DataTableComponent
                                                title="Plan Records"
                                                columns={columns}
                                                data={data}
                                                searchFields={['sequenceId', 'planType', 'reports', 'price', 'status']}
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

export default Plans;
