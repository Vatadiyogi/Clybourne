import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import CommonLayout from '../../common/CommonLayout';
import axios from 'axios';
// import Swal from 'sweetalert2';
import CustomerForm from './CustomerForm';
import { apiURL } from '../../Config';

const ViewCustomer = () => {
    const { id } = useParams();
    // const isEditing = !!id; // Check if there's an id to determine if it's edit mode
    const [errors, setErrors] = useState({});
    // const [loading, setLoading] = useState(false);

    const breadcrumbItems = [
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'Customers', link: '/customers' },
        { label: 'Customer Detail', active: true }
    ];

    const [customer, setCustomer] = useState({
        customerId: '',
        first_name: '',
        last_name: '',
        email_name: '',
        company: '',
        industry: '',
        phone: '',
        jobTitle: '',
        country: '', 
        email: '',
        createdAt: '',
        registerDate: '',
        otp: '',
        activePlanType: '',
        activePlanSeqId : '',
        activePlanExpiryDate : '',
        TotalPlanOrderedCount: '',
    });

    useEffect(() => {
        if (id) {
            fetchCustomer(id);
        }
    }, [id]);

    const fetchCustomer = async (id) => {
        try {
            const response = await axios.get(`${apiURL}api/admin/customer/${id}`);
            const { 
                customerId,
                first_name,
                last_name,
                email_name,
                company,
                industry,
                phone,
                jobTitle,
                country, 
                email,
                createdAt,
                registerDate,
                otp,
                lastOtpDate,
                lastLoginDate,
                lastOrderDate,
                activePlanType,
                activePlanSeqId,
                activePlanExpiryDate ,
                TotalPlanOrderedCount
             } = response.data;

            setCustomer({
                customerId,
                first_name,
                last_name,
                email_name,
                company,
                industry,
                phone,
                jobTitle,
                country, 
                email,
                createdAt,
                registerDate,
                otp,
                lastOtpDate,
                lastLoginDate,
                lastOrderDate,
                activePlanType,
                activePlanSeqId,
                activePlanExpiryDate ,
                TotalPlanOrderedCount
            });
        } catch (error) {
            console.error('Error fetching Admin:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCustomer(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: '' // Clear the error for the specific field
        }));
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
                                                <h4>Customer Detail</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-content widget-content-area">
                                        <CustomerForm
                                            customer={customer}
                                            errors={errors}
                                            handleChange={handleChange}
                                            // loading={loading}
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

export default ViewCustomer;
