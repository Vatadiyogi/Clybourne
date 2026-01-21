import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CommonLayout from '../../common/CommonLayout';
import DataTableComponent from '../../components/DataTable/DataTableComponent';
import Breadcrumb from '../../components/Breadcrumb';
import { apiURL } from '../../Config';
import axios from 'axios';
import Swal from 'sweetalert2';

const UserManagement = () => {
    const loggedInUserId = localStorage.getItem('user_id');
    const breadcrumbItems = [
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'User Management', active: true }
    ];

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { name: 'Name', selector: row => row.name, sortable: true, width: '20%' },
        { name: 'Email', selector: row => row.email, sortable: true, width: '25%' },
        { name: 'Role', selector: row => (row.role === "SuperAdmin" ? "Super Admin" : "Report Admin"), sortable: true, width: '15%' },
        {
            name: 'Status',
            selector: row => (row.status === 1 ? 'Active' : 'Inactive'),
            cell: row => (
                <span
                    className={`badge ${row.status === 1 ? 'badge-success' : 'badge-danger'}`}
                    onClick={() => handleStatusChange(row._id, row.status)}
                    style={{ cursor: 'pointer' }}
                >
                    {row.status === 1 ? 'Active' : 'Inactive'}
                </span>
            ),
            sortable: true,
            width: '15%',
        },
        {
            name: 'Action',
            cell: row => (
                <div>
                    {row._id !== loggedInUserId && (
                        <>
                            <Link to={`/edit-admin/${row._id}`} className="btn btn-sm btn-primary me-2">
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(row._id)}
                                className="btn btn-sm btn-danger"
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            width: '25%',
        }
    ];

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${apiURL}api/admin/admin`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleStatusChange = async (id, currentStatus) => {
        if (id === loggedInUserId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Logged In User Status will not change!`,
            }).then(() => {
                // Perform any post-submission actions, like redirecting or reloading data
                return;
            });
            return;
        }
        
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            const response = await axios.put(`${apiURL}api/admin/admin/edit/${id}`, { status: newStatus });
            if (response.status === 200) {
                setUsers(prevData =>
                    prevData.map(user =>
                        user._id === id ? { ...user, status: newStatus } : user
                    )
                );
            } else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${apiURL}api/admin/admin/delete/${id}`);
                if (response.status === 200) {
                    setUsers(prevData => prevData.filter(user => user._id !== id));
                    Swal.fire(
                        'Deleted!',
                        'The user has been deleted.',
                        'success'
                    );
                } else {
                    throw new Error('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                Swal.fire(
                    'Error!',
                    'An error occurred while deleting the user.',
                    'error'
                );
            }
        }
    };

    return (
        <CommonLayout page={'User Management'}>
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
                                                {/* <h4>User Management</h4> */}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xl-4 col-md-4 col-sm-12 col-12 pl-1">
                                                {/* Additional content */}
                                            </div>
                                            <div className="col-xl-1 col-md-1"></div>
                                            <div className="col-xl-6 col-md-6 col-sm-12 col-12 text-end">
                                                <Link to="/add-admin" className="btn btn-primary mt-2">Add Admin Users</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-content widget-content-area">
                                        {/* <hr /> */}
                                        {loading ? (
                                            <div>Loading...</div>
                                        ) : (
                                            <DataTableComponent
                                                title="User Records"
                                                columns={columns}
                                                data={users}
                                                searchFields={['name', 'email', 'role']}
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

export default UserManagement;
