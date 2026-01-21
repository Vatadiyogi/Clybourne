import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import CommonLayout from '../../common/CommonLayout';
import axios from 'axios';
import Swal from 'sweetalert2';
import { apiURL } from '../../Config';
import UserForm from './UserForm';

const AddAdmin = () => {
    const { id } = useParams();
    const isEditing = !!id; // Check if there's an id to determine if it's edit mode
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const breadcrumbItems = [
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'User Management', link: '/user-management' },
        { label: isEditing ? 'Edit Admin User' : 'Add Admin User', active: true }
    ];

    const [admin, setAdmin] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Admin', // Default role, adjust as necessary
    });

    useEffect(() => {
        if (id) {
            fetchAdmin(id);
        }
    }, [id]);

    const fetchAdmin = async (id) => {
        try {
            const response = await axios.get(`${apiURL}api/admin/admin/${id}`);
            const { name, email, role } = response.data;

            setAdmin({
                name,
                email,
                role,
            });
        } catch (error) {
            console.error('Error fetching Admin:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setAdmin(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: '' // Clear the error for the specific field
        }));
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;
    
        if (!admin.name || !admin.name.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        }
    
        if (!admin.email || !admin.email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(admin.email)) {
            errors.email = 'Email is invalid';
            isValid = false;
        }
    
        if (!isEditing || (isEditing && admin.password && admin.password.trim())) {
            // Password required only when adding new admin or editing with password change
            if (!admin.password || !admin.password.trim()) {
                errors.password = 'Password is required';
                isValid = false;
            }
        }
    
        setErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();

        if (isValid) {
            setLoading(true);

            const formData = {
                ...admin,
                // You may add additional data transformations or validations here
            };

            try {
                const response = id 
                    ? await axios.put(`${apiURL}api/admin/admin/edit/${id}`, formData)
                    : await axios.post(`${apiURL}api/admin/admin/store`, formData);

                setLoading(false);

                if (response.status === 200 || response.status === 201) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: `Admin User ${id ? 'updated' : 'added'} successfully!`,
                    }).then(() => {
                        // Perform any post-submission actions, like redirecting or reloading data
                        window.location.reload(); 
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.message || `Failed to ${id ? 'update' : 'add'} admin user`,
                    });
                }
            } catch (error) {
                setLoading(false);
                console.error(`Error ${id ? 'updating' : 'adding'} admin user:`, error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `An error occurred while ${id ? 'updating' : 'adding'} the admin user.`,
                });
            }
        } else {
            console.log('Form validation failed');
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
                                                <h4>{isEditing ? 'Edit Admin User' : 'Add Admin User'}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-content widget-content-area">
                                        <UserForm
                                            admin={admin}
                                            errors={errors}
                                            handleChange={handleChange}
                                            handleSubmit={handleSubmit}
                                            loading={loading}
                                            id={id}
                                        />
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

export default AddAdmin;
