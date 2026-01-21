import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommonLayout from "../../../common/CommonLayout";
import Breadcrumb from '../../../components/Breadcrumb';
import TemplateForm from './TemplateForm';
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
        { label: 'Email Templates', link: '/email-templates' },
        { label: isEditing ? 'Edit Template' : 'Add Template', active: true }
    ];

    const [template, setTemplate] = useState({
        templateId: '',
        title : '',
        subject : '',
        description: ''
    });


    useEffect(() => {
        if (id) {
            fetchTemplate(id);
        }
    }, [id]);

    const fetchTemplate = async (id) => {
        try {
            const response = await axios.get(`${apiURL}api/admin/email/${id}`);
            const { templateId, title, subject, description } = response.data.data.template;
    
            setTemplate({
                templateId,
                title,
                subject,
                description
            });
        } catch (error) {
            console.error('Error fetching plan:', error);
        }
    };
    
    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!template.title.trim()) {
            errors.title = 'Template Name is required';
            isValid = false;
        }

        if (!template.subject.trim()) {
            errors.subject = 'Template Subject is required';
            isValid = false;
        }

        if (!template.description || !template.description.trim()) {
            errors.description = 'Description is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleChange = (e, editor) => {
        const { name, value } = e.target || editor;
    
        const updateState = (updatedValue) => {
            setTemplate(prevState => ({ ...prevState, [name]: updatedValue }));
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' })); // Clear the error for the specific field
        };
    
        updateState(value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
        
        if (isValid) {
            setLoading(true);

            const formData = {
                ...template,
            };

            try {
                const response = id 
                    ? await axios.put(`${apiURL}api/admin/email/edit/${id}`, formData)
                    : await axios.post(`${apiURL}api/admin/email/store`, formData);

                setLoading(false);

                if (response.status === 200 || response.status === 201) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: `Email Template ${id ? 'updated' : 'added'} successfully!`,
                    }).then(() => {
                        // Perform any post-submission actions, like redirecting or reloading data
                        window.location.reload(); 
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.message || `Failed to ${id ? 'Update' : 'Add'} Email Template`,
                    });
                }
            } catch (error) {
                setLoading(false);
                console.error(`Error ${id ? 'updating' : 'adding'} Email Template:`, error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `An error occurred while ${id ? 'updating' : 'adding'}  Email Template.`,
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
                                                <h4>{id ? 'Edit Email Template' : 'Add Email Template'}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-content widget-content-area">
                                        <TemplateForm
                                            template={template}
                                            errors={errors}
                                            handleChange={handleChange}
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
