import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommonLayout from "../../../common/CommonLayout";
import Breadcrumb from '../../../components/Breadcrumb';
import PlanForm from './PlanForm';
import axios from 'axios';
import Swal from 'sweetalert2';
import { apiURL } from '../../../Config';

const AddPlan = () => {
    const { id } = useParams();
    const isEditing = !!id; // Check if there's an id to determine if it's edit mode
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const breadcrumbItems = [
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'Setup', link: '/dashboard' },
        { label: 'Advisor Plans', link: '/plans' },
        { label: isEditing ? 'Edit Plan' : 'Add Plan', active: true }
    ];

    const [plan, setPlan] = useState({
        name: '',
        description: '',
        userplandescription: '',
        price: '',
        reports: '',
        accessDays: '',
        displaySequence: '',
        planType: ''
    });


    useEffect(() => {
        if (id) {
            fetchPlan(id);
        }
    }, [id]);

    const fetchPlan = async (id) => {
        try {
            const response = await axios.get(`${apiURL}api/admin/plan/${id}`);
            const { name, description, userplandescription ,price, reports, accessDays, displaySequence, planType } = response.data;
    
            // Ensure price is formatted correctly from Decimal128
            // const formattedPrice = price ? parseFloat(price.toString()) : '';
            const formattedPrice = price?.toFixed(2) || '';
            setPlan({
                name,
                description,
                userplandescription,
                price: formattedPrice,
                reports,
                accessDays,
                displaySequence,
                planType
            });
        } catch (error) {
            console.error('Error fetching plan:', error);
        }
    }; 

    const handleChange = (e, editor) => {
        const { name, value } = e.target || editor;
    
        const updateState = (updatedValue) => {
            setPlan(prevState => ({ ...prevState, [name]: updatedValue }));
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' })); // Clear the error for the specific field
        };
    
        if (name === 'price') {
            const decimalPattern = /^\d*\.?\d{0,2}$/;
            if (value === '' || decimalPattern.test(value)) {
                updateState(value);
            }
        } else if (['reports', 'accessDays', 'displaySequence'].includes(name)) {
            const numericPattern = /^\d*$/;
            if (value === '' || numericPattern.test(value)) {
                updateState(value);
            }
        } else {
            updateState(value);
        }
    };
    

    const handleBlur = (e) => {
        const { name, value } = e.target;
    
        if (name === 'price' && value.trim() !== '') {
            const formattedPrice = parseFloat(value).toFixed(2);
            setPlan(prevState => ({ ...prevState, [name]: formattedPrice }));
        }
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!plan.name.trim()) {
            errors.name = 'Plan Name is required';
            isValid = false;
        }

        if (!plan.planType || plan.planType === 'Select Plan Type') {
            errors.planType = 'Plan Type is required';
            isValid = false;
        }

        if (!plan.price || isNaN(plan.price) || parseFloat(plan.price) <= 0) {
            errors.price = 'Price must be a positive number';
            isValid = false;
        }

        if (!plan.reports || isNaN(plan.reports) || parseInt(plan.reports) <= 0) {
            errors.reports = 'Number of Reports must be a positive number';
            isValid = false;
        }

        if (!plan.accessDays || isNaN(plan.accessDays) || parseInt(plan.accessDays) <= 0) {
            errors.accessDays = 'Access Days must be a positive number';
            isValid = false;
        }

        if (!plan.displaySequence || isNaN(plan.displaySequence) || parseInt(plan.displaySequence) <= 0) {
            errors.displaySequence = 'Display Sequence must be a positive number';
            isValid = false;
        }

        if (!plan.description || !plan.description.trim()) {
            errors.description = 'Description is required';
            isValid = false;
        }

        if (!plan.userplandescription || !plan.userplandescription.trim()) {
            errors.userplandescription = 'User Plan Description is required';
            isValid = false;
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
                ...plan,
                price: parseFloat(plan.price) // Ensure price is a number
            };

            try {
                const response = id 
                    ? await axios.put(`${apiURL}api/admin/plan/edit/${id}`, formData)
                    : await axios.post(`${apiURL}api/admin/plan/store`, formData);

                setLoading(false);

                if (response.status === 200 || response.status === 201) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: `Plan ${id ? 'updated' : 'added'} successfully!`,
                    }).then(() => {
                        // Perform any post-submission actions, like redirecting or reloading data
                        window.location.reload(); 
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.message || `Failed to ${id ? 'update' : 'add'} plan`,
                    });
                }
            } catch (error) {
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `An error occurred while ${id ? 'updating' : 'adding'} the plan.`,
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
                                                <h4>{id ? 'Edit Plan' : 'Add Plan'}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-content widget-content-area">
                                        <PlanForm
                                            plan={plan}
                                            errors={errors}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            handleSubmit={handleSubmit}
                                            id={id}
                                            loading={loading}
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

export default AddPlan;
