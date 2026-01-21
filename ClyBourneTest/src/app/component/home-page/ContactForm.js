'use client';
import React, { useEffect, useState } from 'react';
import { SectionWrapper } from '../generalComponent/SectionWrapper';
import countries from 'i18n-iso-countries';
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
import * as Yup from 'yup';
import { ErrorMessage, Field, Formik } from 'formik';
import { Select } from 'antd';
import { toast } from 'react-toastify';
import axios from 'axios';
import Axios from '../../../utils/api';

const ContactForm = () => {
    const [allCountries, setAllCountries] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const all = countries.getNames('en', { select: 'official' });
        const list = Object.entries(all).map(([key, value]) => ({
            value,
            label: value,
        }));
        setAllCountries(list);
    }, []);

    const initialValues = {
        fullName: '',
        companyName: '',
        country: '',
        email: '',
        message: '',
    };

    const validationSchema = Yup.object({
        fullName: Yup.string()
            .trim()
            .required('Full Name is required')
            .matches(/^[A-Za-z\s]+$/, 'Name should only contain alphabets')
            .min(2, 'Name must be at least 2 characters')
            .max(50, 'Name must be less than 50 characters'),
        companyName: Yup.string()
            .trim()
            .required('Company Name is required')
            .min(2, 'Company name must be at least 2 characters')
            .max(100, 'Company name must be less than 100 characters'),
        country: Yup.string()
            .required('Country of operation is required'),
        email: Yup.string()
            .trim()
            .required('E-mail is required')
            .email('Invalid email format')
            .max(100, 'Email must be less than 100 characters'),
        message: Yup.string()
            .max(500, 'Message must be less than 500 characters'),
    });

    const handleSubmit = async (values, { resetForm }) => {
        setIsSubmitting(true);
        try {
            // Transform field names to match backend API
            const payload = {
                full_name: values.fullName,
                company_name: values.companyName,
                country_of_operation: values.country,
                email: values.email,
                message: values.message || '',
            };

            console.log("Submitting payload:", payload);

            // Make API call to your backend
            const response = await Axios.post('/api/enquiry/contact/submit', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000, // 10 seconds timeout
            });

            console.log("API Response:", response.data);

            if (response.data && response.data.status === true) {
                toast.success(response.data.message || 'Form Submitted Successfully!');
                resetForm();
            } else {
                toast.error(response.data?.message || 'Form submission failed. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            
            // Handle different types of errors
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const errorData = error.response.data;
                toast.error(errorData?.message || `Server error: ${error.response.status}`);
            } else if (error.request) {
                // The request was made but no response was received
                toast.error('No response from server. Please check your connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error('Error submitting form. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SectionWrapper customClass="bg-white" >
            {/* Header */}
            <div className="text-center">
                <h4 className="text-themeblue lg:text-lg md:text-sm text-xs font-normal pb-4">
                    <span className='border-b-2 border-themeblue pb-[2px]'>Contact Us</span>
                </h4>
                <h2 className="text-3xl sm:text-4xl md:text-6xl text-themeblue">
                    Need Help? <br />
                    <span className='text-themegreen'>Let's Simplify Your Valuation Journey</span>
                </h2>
                <p className="mt-1 mb-12 text-lg text-themeblue">
                    Reach our experts for support or start your $109 valuation now.
                </p>
            </div>

            {/* Form */}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnMount={true}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, setFieldValue, setFieldTouched, handleSubmit, isValid, dirty }) => (
                    <form 
                        className="max-w-5xl mx-auto px-4 grid gap-4" 
                        onSubmit={handleSubmit}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#373743]">
                            <div>
                                <Field
                                    name="fullName"
                                    type="text"
                                    placeholder="Full Name*"
                                    className="form-input rounded-lg px-4 py-2 border-none bg-[#f5f5f5] outline-none w-full text-sm"
                                    disabled={isSubmitting}
                                />
                                <ErrorMessage 
                                    name="fullName" 
                                    component="div" 
                                    className="text-red-500 text-xs mt-1" 
                                />
                            </div>
                            <div>
                                <Field
                                    name="companyName"
                                    type="text"
                                    placeholder="Company Name*"
                                    className="form-input rounded-lg px-4 py-2 border-none bg-[#f5f5f5] outline-none w-full text-sm"
                                    disabled={isSubmitting}
                                />
                                <ErrorMessage 
                                    name="companyName" 
                                    component="div" 
                                    className="text-red-500 text-xs mt-1" 
                                />
                            </div>
                            <div>
                                <Select
                                    name="country"
                                    value={values.country || undefined}
                                    onChange={(value) => setFieldValue("country", value)}
                                    onBlur={() => setFieldTouched("country", true)}
                                    placeholder="Country of Operation*"
                                    showSearch
                                    allowClear
                                    options={allCountries}
                                    filterOption={(input, option) =>
                                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                    }
                                    className="w-full text-sm custom-select"
                                    style={{
                                        backgroundColor: "#f5f5f5",
                                        borderRadius: "0.5rem",
                                        outline: "none",
                                    }}
                                    disabled={isSubmitting}
                                    loading={allCountries.length === 0}
                                />
                                <ErrorMessage 
                                    name="country" 
                                    component="div" 
                                    className="text-red-500 text-xs mt-1" 
                                />
                            </div>
                            <div>
                                <Field
                                    name="email"
                                    type="email"
                                    placeholder="E-mail*"
                                    className="form-input rounded-lg px-4 py-2 border-none bg-[#f5f5f5] outline-none w-full text-sm"
                                    disabled={isSubmitting}
                                />
                                <ErrorMessage 
                                    name="email" 
                                    component="div" 
                                    className="text-red-500 text-xs mt-1" 
                                />
                            </div>
                        </div>

                        <div>
                            <Field
                                as="textarea"
                                rows="5"
                                placeholder="Message"
                                name="message"
                                className="w-full resize-none text-themeblack rounded-lg px-4 py-2 bg-[#f5f5f5] outline-none text-sm"
                                disabled={isSubmitting}
                            />
                            <ErrorMessage 
                                name="message" 
                                component="div" 
                                className="text-red-500 text-xs mt-1" 
                            />
                        </div>

                        <div className="text-center pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || !isValid || !dirty}
                                className={`
                                    bg-themegreen px-8 py-2 text-white transition rounded 
                                    ${isSubmitting || !isValid || !dirty 
                                        ? 'opacity-50 cursor-not-allowed' 
                                        : 'hover:bg-themegreen'
                                    }
                                `}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : 'Submit'}
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
        </SectionWrapper>
    );
};

export default ContactForm;