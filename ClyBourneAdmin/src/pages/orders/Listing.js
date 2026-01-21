import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CommonLayout from "../../common/CommonLayout";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import Breadcrumb from "../../components/Breadcrumb";
import { apiURL } from "../../Config";
import { formatDate } from "../../common/utils/dateUtils";
import Filter from "./Filter";
import AssignOrderModal from "./modals/AssignOrderModal";
import CustodyModal from "./modals/CustodyModal";

const Listing = () => {
    const breadcrumbItems = [
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'All Report Orders', active: true },
    ];

    const [data, setData] = useState([]); // State for plan data
    const [loading, setLoading] = useState(true); // Loading state
    const [showModal, setShowModal] = useState(false); // Modal state
    const [showCustodyModal, setCustodyModal] = useState(false); // Modal state
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [currentAssignedUser, setCurrentAssignedUser] = useState(null);
    const [currentCustody, setCurrentCustody] = useState(null);
    const user_id = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');


    const columns = [
        { name: 'ID', selector: row => row.orderId, sortable: true, wrap: true, width: '5%' },
        // { name: 'Plan ID', selector: row => row.planData?.planSeqId, sortable: true, wrap: true, width: '6%' },
        { name: 'Plan ID', selector: row => row.planData?.planSeqId , sortable: true, width: '6%' , cell: row => (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {row.planData?.planSeqId}
            </div>
        ) },
        { name: 'Customer (Company Name)', selector: row => row.contact ? `${row.contact.email}` : '', sortable: true, wrap: true, width: '13%', cell: row => (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {row.contact ? `${row.contact.email}` : ''}
                &nbsp;({row.business?.companyName || ''})
            </div>
        ) },
        // { name: 'Company Name', selector: row => row.business?.companyName || '', sortable: true, wrap: true, width: '9%', cell: row => (
        //     <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
        //         {row.business?.companyName || ''}
        //     </div>
        // ) },
        { name: 'Country', selector: row => row.business?.country || '', sortable: true, wrap: true, width: '9%', cell: row => (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {row.business?.country || ''}
            </div>
        ) },
        { name: 'Status', selector: row => row.matadata?.status || '', sortable: true, wrap: true, width: '9%', cell: row => (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {row.matadata?.status || ''}
            </div>
        )  },
        {
            name: 'Created On',
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
        { name: 'Last Submitted On', selector: row => row.submittedOn ? row.submittedOn : '', sortable: true, wrap: true,width: '8%', cell: row => (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {row.submittedOn ? formatDate(row.submittedOn) : ''}
            </div>
        )   },
        { name: 'Report Due Date', selector: row => row.due_date ? row.due_date : '', sortable: true, wrap: true, width: '10%', cell: row => (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {row.due_date ? formatDate(row.due_date) : ''}
            </div>
        )   },
        { name: 'Assigned To', selector: row => row.assignedUser?.name || '', sortable: true, wrap: true, width: '10%', cell: row => (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {row.assignedUser?.name || ''}
            </div>
        )   },
        { name: 'Custody', selector: row => row.custody || '', sortable: true, wrap: true , width: '10%', cell: row => (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {row.custody || ''}
            </div>
        )  },
        {
            name: 'Action',
            cell: row => (
                <div className="btn-group">
                    <button type="button" className="btn btn-dark btn-sm">Action</button>
                    <button type="button" className="btn btn-dark btn-sm dropdown-toggle dropdown-toggle-split" id="dropdownMenuReference1" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-reference="parent">
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-custom-style" aria-labelledby={`dropdownMenuButton-${row._id}`}>
                        {renderButtons(row)}
                    </ul>

                </div>
            ),
            ignoreRowClick: true,
            width: '10%'
        }
    ];

    const renderButtons = (row) => {
        const userId = localStorage.getItem('user_id'); // Replace with actual logic to get current logged-in user ID
        const role = localStorage.getItem('role');
        const isAssignedToCurrentUser = row.assigned_to === userId;

        if (row.matadata?.status === "Submitted" && row.custody === "Company") {
            return (
                <>
                    {isAssignedToCurrentUser ? (
                            <li>
                                <Link to={`/view-orders/${row._id}`} className="dropdown-item">Open Initial Order</Link>
                            </li>
                        ) : (
                            <li>
                                <Link to={`/view-order-inputs/${row._id}`} className="dropdown-item">View Initial Order</Link>
                            </li>
                        )}
                        
                        {role === 'SuperAdmin' && (
                            <li>
                                <Link
                                    className="dropdown-item"
                                    onClick={() => {
                                        setSelectedOrderId(row._id);
                                        setCurrentAssignedUser(row.assigned_to || "");
                                        setShowModal(true);
                                    }}
                                >
                                    Assign Order
                                </Link>
                            </li>
                        )}
                </>
            );
        } else if (row.matadata?.status === "Completed" && row.custody === "Customer") {
            return (
                <li>
                    <Link to={`/view-order-inputs/${row._id}`} className="dropdown-item">View Initial Order</Link>
                </li>
            );
        } else if (row.matadata?.status === "Re-Submitted" && row.custody === "Company") {
            return (
                <>
                    <li>
                        <Link to={`/view-order-inputs/${row._id}?type=initials`} className="dropdown-item">View Initial Order</Link>
                    </li>
                    {isAssignedToCurrentUser ? (
                        <li>
                            <Link to={`/view-orders/${row._id}`} className="dropdown-item">Open Revised Order</Link>
                        </li>
                    ) : (
                        <li>
                            <Link to={`/view-order-inputs/${row._id}`} className="dropdown-item">View Revised Order</Link>
                        </li>
                    )}

                    {role === 'SuperAdmin' && (
                        <li>
                            <Link
                                className="dropdown-item"
                                onClick={() => {
                                    setSelectedOrderId(row._id);
                                    setCurrentAssignedUser(row.assigned_to || "");
                                    setShowModal(true);
                                }}
                            >
                                Assign Order
                            </Link>
                        </li>
                    )}
                </>
            );
        } else if (row.matadata?.status === "Completed (Revised)" && row.custody === "Company") {
            return (
                <>
                    <li>
                        <Link to={`/view-order-inputs/${row._id}?type=initials`} className="dropdown-item">View Initial Order</Link>
                    </li>
                    <li>
                        <Link to={`/view-order-inputs/${row._id}`} className="dropdown-item">View Revised Order</Link>
                    </li>
                </>
            );
        } else if (row.matadata?.status === "Help Requested" && row.custody === "Customer") {
            return (
                <>
                    <li>
                        <Link
                            className="dropdown-item"
                            onClick={() => {
                                setSelectedOrderId(row._id);
                                setCurrentCustody(row.custody || "");
                                setCustodyModal(true);
                            }}
                        >
                            Change Custody
                        </Link>
                    </li>
                    <li>
                        <Link to={`/view-order-inputs/${row._id}`} className="dropdown-item">View Order Data</Link>
                    </li>
                </>
            );
        } else if (row.matadata?.status === "Help Requested" && row.custody === "Company") {
            return (
                <>
                    <li>
                        <Link
                            className="dropdown-item"
                            onClick={() => {
                                setSelectedOrderId(row._id);
                                setCurrentCustody(row.custody || "");
                                setCustodyModal(true);
                            }}
                        >
                            Change Custody
                        </Link>
                    </li>
                    {isAssignedToCurrentUser ? (
                        <li>
                            <Link to={`/view-orders/${row._id}`} className="dropdown-item">Open Order Data</Link>
                        </li>
                    ) : (
                        <li>
                            <Link to={`/view-order-inputs/${row._id}`} className="dropdown-item">View Order Data</Link>
                        </li>
                    )}
                    {role === 'SuperAdmin' && (
                        <li>
                            <Link
                                className="dropdown-item"
                                onClick={() => {
                                    setSelectedOrderId(row._id);
                                    setCurrentAssignedUser(row.assigned_to || "");
                                    setShowModal(true);
                                }}
                            >
                                Assign Order
                            </Link>
                        </li>
                    )}
                </>
            );
        } else if (row.matadata?.status === "Pending Submission" && row.custody === "Customer") {
            return (
                <>
                    <li>
                        <Link to={`/view-order-inputs/${row._id}`} className="dropdown-item">View Input Data</Link>
                    </li>
                </>
            );
        }
        return (
            <li>
                <Link to={`/view-order-inputs/${row._id}`} className="dropdown-item">View Order Input</Link>
            </li>
        );
    };

    const fetchOrders = async (filters) => {
        try {
            const response = await axios.get(`${apiURL}api/admin/orders/`, {
                params: {
                    ...filters,
                    user_id: user_id,
                    role: role,
                },
            });
            if (response.status === 200) {
                const transformedData = response.data.map(item => ({
                    ...item,
                    assignedUser: item.assignedUser || { name: '' } // Handle missing assignedUser
                }));
                setData(transformedData);
            } else {
                throw new Error('Failed to fetch transactions');
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filters) => {
        setLoading(true);
        fetchOrders(filters);
    };

    const handleAssignSuccess = () => {
        fetchOrders({});
    };

    const handleCustodySuccess = () => {
        fetchOrders({});
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
                                                {/* <h4 style={{ padding: '10px',paddingBottom: '1px' }}>All Report Orders</h4> */}
                                            </div>
                                        </div>
                                    </div>
                                    <Filter onFilterChange={handleFilterChange} />
                                    <div className="widget-content widget-content-area">
                                        {loading ? (
                                            <div className="loader mx-auto"></div>
                                        ) : (
                                            <DataTableComponent
                                                title="Order Records"
                                                columns={columns}
                                                data={data}
                                                searchFields={['orderId', 'contact.name', 'business.companyName', 'business.country', 'matadata.status', 'createdAt', 'last_submitted_date', 'due_date', 'assignedUser.name', 'custody']}
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
            <AssignOrderModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                orderId={selectedOrderId}
                currentAssignedUser={currentAssignedUser}
                onAssignSuccess={handleAssignSuccess}
            />
            <CustodyModal 
              show={showCustodyModal}
              handleClose={() => setCustodyModal(false)}
              orderId={selectedOrderId}
              currentCustody={currentCustody}
              onCustodySuccess={handleCustodySuccess}
            />
        </CommonLayout>
    );
};

export default Listing;
