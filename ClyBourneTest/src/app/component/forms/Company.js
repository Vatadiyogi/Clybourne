"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';
import { components } from "react-select";
import countryList from "react-select-country-list";
import currencyCodes from "currency-codes";
import { IoMdArrowDropdown } from "react-icons/io";
import Axios from '../../../utils/api';
import CircularProgress from "@mui/material/CircularProgress";

// Dynamically import components
const Select = dynamic(() => import("react-select"), { ssr: false });
const PhoneInput = dynamic(() => import("react-phone-input-2"), { ssr: false });
const GeoMapTwo = dynamic(() => import("../charts/GeoMapTwo"), { ssr: false });
const CustomDropdown = dynamic(() => import("../../component/CustomDropdown"), { ssr: false });

import "react-phone-input-2/lib/style.css";

const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <IoMdArrowDropdown size={18} color="#1aa79c" />
        </components.DropdownIndicator>
    );
};

const Company = ({ orderId, initialData, onSave, editAllowed }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get order status and modification flag
    const [orderStatus, setOrderStatus] = useState('');
    const [isModification, setIsModification] = useState(false);

    // State variables
    const [availableSubIndustries, setAvailableSubIndustries] = useState([]);
    const [countryCode, setCountryCode] = useState("in");
    const [isLoading, setIsLoading] = useState(false);
    const [currencyOptions, setCurrencyOptions] = useState([]);

    useEffect(() => {
        // Get status from URL or localStorage
        const urlStatus = searchParams.get('status');
        const storedStatus = localStorage.getItem('orderStatus');
        const status = urlStatus || storedStatus;
        setOrderStatus(status || '');

        // Check if this is a modification flow
        const urlModify = searchParams.get('modify') === 'true';
        const storedModify = localStorage.getItem('isModification') === 'true';
        const modification = urlModify || storedModify;
        setIsModification(modification);

        console.log('Company Component - Status:', status, 'Modification:', modification);
    }, [searchParams]);

    // Determine edit permissions based on order status and modification flag
    const getEditPermissions = useCallback(() => {
        console.log('Calculating edit permissions for:', {
            orderStatus,
            isModification,
            editAllowed
        });

        // If no order status (new order)
        if (!orderStatus) {
            return { canEditAll: true, canEditCompany: true };
        }

        // Pending Submission - Full edit access
        if (orderStatus === 'Pending Submission') {
            return { canEditAll: true, canEditCompany: true };
        }

        // Completed status - Modification flow
        if (orderStatus === 'Completed' || orderStatus === 'Completed (Revised)') {
            if (isModification) {
                // Modification mode: Can edit financial/forecast/balance, but NOT company
                return { canEditAll: true, canEditCompany: false };
            } else {
                // View mode: Cannot edit anything
                return { canEditAll: false, canEditCompany: false };
            }
        }

        // Re-Submitted, Submitted - View only
        if (orderStatus === 'Re-Submitted' || orderStatus === 'Submitted') {
            return { canEditAll: false, canEditCompany: false };
        }

        // Default for other statuses
        return { canEditAll: editAllowed, canEditCompany: editAllowed };
    }, [orderStatus, isModification, editAllowed]);

    const { canEditAll, canEditCompany } = getEditPermissions();

    console.log('Final Edit Permissions:', {
        orderStatus,
        isModification,
        canEditAll,
        canEditCompany,
        editAllowed
    });

    const options = useMemo(() => {
        const countryData = countryList().getData();
        return countryData.map(country => ({
            ...country,
            code: country.value.toLowerCase()
        }));
    }, []);

    // Define default form data structure
    const getDefaultFormData = useCallback(() => ({
        companyName: "",
        companyType: "",
        industryType: "",
        similarCompany: "",
        yearsInBusiness: "",
        countryCode: "in",
        country: "",
        countryFullName: "",
        yearEndDay: "",
        yearEndMonth: "",
        yearEndYear: new Date().getFullYear(),
        earningTrend: "",
        businessDescription: "",
        email: "",
        currency: "USD",
        contact: "",
        isReadOnly: false
    }), []);

    const [formData, setFormData] = useState(getDefaultFormData());

    const selectStyles = {
        control: (base) => ({
            ...base,
            borderRadius: "6px",
            borderColor: "#d1d5db",
            boxShadow: "none",
            "&:hover": { borderColor: "#1aa79c" },
            minHeight: "38px",
            backgroundColor: !canEditCompany ? "#f3f4f6" : "white",
            cursor: !canEditCompany ? "not-allowed" : "default",
            pointerEvents: !canEditCompany ? "none" : "auto"
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: "4px",
        }),
        singleValue: (base) => ({
            ...base,
            color: !canEditCompany ? "#6b7280" : "#374151"
        }),
        placeholder: (base) => ({
            ...base,
            color: !canEditCompany ? "#9ca3af" : "#6b7280"
        })
    };

    // Map checkbox values
    const yearMapping = {
        "0-1": "0-1",
        "2-5": "2-5",
        "5+": "5+",
    };

    // Load saved data from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('companyFormData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                console.log('Loaded saved company data:', parsedData);

                // Apply read-only flag based on permissions
                if (!canEditCompany) {
                    parsedData.isReadOnly = true;
                } else {
                    parsedData.isReadOnly = false;
                }

                setFormData(parsedData);
            } catch (error) {
                console.error('Error parsing saved company data:', error);
                setFormData(getDefaultFormData());
            }
        }
    }, [getDefaultFormData, canEditCompany]);

    // Initialize form data from props/API
    useEffect(() => {
        const loadInitialData = async () => {
            console.log('Loading initial data, orderId:', orderId);

            // Check if we should load from API
            if (initialData?.order?.business?.business) {
                const businessData = initialData.order.business.business;
                console.log('Loading company data from API:', businessData);
                let contactPhone = "";
                if (businessData.contact) {
                    if (typeof businessData.contact === 'object') {
                        contactPhone = businessData.contact.fullNumber || businessData.contact.phoneNumber || "";
                    } else {
                        contactPhone = businessData.contact;
                    }
                }
                const formattedData = {
                    companyName: businessData.companyName || "",
                    companyType: businessData.companyType || "",
                    industryType: businessData.industryType || "",
                    similarCompany: businessData.similarCompany || "",
                    yearsInBusiness: businessData.companyAge || "",
                    country: businessData.country || "",
                    countryFullName: businessData.country || "",
                    yearEndDay: businessData.FinYrEndDate || "",
                    yearEndMonth: businessData.FinYrEndMonth || "",
                    yearEndYear: businessData.FinYrEnd || new Date().getFullYear(),
                    earningTrend: businessData.earningTrend || "",
                    businessDescription: businessData.description || "",
                    email: businessData.email || "",
                    currency: businessData.currency || "USD",
                    contact: contactPhone,
                    isReadOnly: !canEditCompany
                };

                setFormData(formattedData);
                localStorage.setItem('companyFormData', JSON.stringify(formattedData));
            }
        };

        loadInitialData();
    }, [initialData, orderId, canEditCompany]);

    // Fetch initial data (industries, etc.)
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            try {
                setIsLoading(true);
                const response = await Axios.get('/api/front/formdata', {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.data.status) {
                    const planData = response.data.data.planData;

                    if (!planData.ActiveplanAvailable && !planData.noPlan && !orderId) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'You do not have any active plan. Please purchase a plan first.',
                        }).then(() => {
                            router.push('/pricing');
                        });
                        return;
                    } else if (!planData.ActiveplanAvailable && planData.noPlan && !orderId) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'You do not have any active plan. Please purchase a plan first.',
                        }).then(() => {
                            router.push('/orders');
                        });
                        return;
                    } else if (planData.ActiveplanAvailable || orderId) {
                        setAvailableSubIndustries(response.data.data.subIndustries || []);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load form data.',
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [orderId, router]);

    // Currency options
    useEffect(() => {
        if (currencyCodes?.data) {
            const formatted = currencyCodes.data.map((c) => ({
                label: `${c.currency} (${c.code})`,
                value: c.code,
            }));
            setCurrencyOptions(formatted);
        }
    }, []);

    // Save to localStorage
    const saveToLocalStorage = useCallback(() => {
        localStorage.setItem('companyFormData', JSON.stringify(formData));
    }, [formData]);

    // Handler for checkbox changes
    const handleCheckboxChange = useCallback((e) => {
        if (!canEditCompany) return;

        const { name, value } = e.target;

        const newFormData = {
            ...formData,
            [name]: value,
            yearsInBusiness: yearMapping[value] || ""
        };

        setFormData(newFormData);
        localStorage.setItem('companyFormData', JSON.stringify(newFormData));
    }, [formData, canEditCompany]);

    const handleChange = useCallback((e) => {
        if (!canEditCompany) return;

        const { name, value } = e.target;

        // For other inputs
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        localStorage.setItem('companyFormData', JSON.stringify(newFormData));
    }, [formData, canEditCompany]);

    const handleSelectChange = useCallback((name, selected) => {
        if (!canEditCompany) return;

        const newFormData = {
            ...formData,
            [name]: selected.value,
            ...(name === 'country' && {
                countryFullName: selected.label,
                countryCode: selected.code
            })
        };

        setFormData(newFormData);

        // Update phone input country code
        if (name === 'country' && selected.code) {
            setCountryCode(selected.code);
        }

        localStorage.setItem('companyFormData', JSON.stringify(newFormData));
    }, [formData, canEditCompany]);

    const handlePhoneChange = useCallback((phone, country) => {
        if (!canEditCompany) return;

        const newFormData = { ...formData, contact: phone };
        setFormData(newFormData);

        if (country?.countryCode !== countryCode) setCountryCode(country.countryCode);

        localStorage.setItem('companyFormData', JSON.stringify(newFormData));
    }, [countryCode, formData, canEditCompany]);

 const validateForm = useCallback(() => {
    const requiredFields = [
        "companyName",
        "companyType",
        "industryType",
        "yearsInBusiness",
        "country",
        "yearEndDay",
        "yearEndMonth",
        "yearEndYear",
        "earningTrend",
        "businessDescription",
        "email",
        "currency",
        "contact",
    ];

    for (let field of requiredFields) {
        if (!formData[field] || formData[field] === "") {
            console.log(`Missing field: ${field}`, formData[field]);
            return { valid: false, field };
        }
        
        // Special validation for numeric fields
        if (field === 'yearEndDay' || field === 'yearEndYear') {
            const value = parseInt(formData[field]);
            if (isNaN(value)) {
                console.log(`Invalid number for field: ${field}`, formData[field]);
                return { valid: false, field: `${field} must be a number` };
            }
        }
        
        // Special validation for contact (must be a valid phone number)
        if (field === 'contact') {
            const phone = formData[field];
            // Simple validation - at least 10 digits
            const digitsOnly = phone.replace(/\D/g, '');
            if (digitsOnly.length < 10) {
                console.log(`Invalid phone number: ${phone}`);
                return { valid: false, field: "Contact must be a valid phone number" };
            }
        }
    }

    return { valid: true };
}, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Submitting form with:', {
            orderStatus,
            isModification,
            canEditAll,
            canEditCompany
        });

        // Check if form can be edited
        if (!canEditAll) {
            Swal.fire({
                icon: "info",
                title: "Read Only",
                text: getReadOnlyMessage(),
            });
            return;
        }

        // Special check for Completed status modification
        if ((orderStatus === 'Completed' || orderStatus === 'Completed (Revised)')) {
            if (!isModification) {
                Swal.fire({
                    icon: "warning",
                    title: "Cannot Edit",
                    text: "Completed orders cannot be edited directly. Please use the 'Modify' button from orders table.",
                });
                return;
            }

            // For modifications, show special warning about company info being read-only
            if (!canEditCompany) {
                Swal.fire({
                    icon: "info",
                    title: "Proceeding to Next Step",
                    text: "Company information cannot be modified for completed orders. You can edit financial, forecast, and balance sheet data.",
                    showCancelButton: true,
                    confirmButtonText: "Continue",
                    cancelButtonText: "Cancel",
                    confirmButtonColor: "#16a085",
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Save and proceed to financial step
                        saveToLocalStorage();
                        window.location.href = `/dashboard/newOrder?step=financial&orderId=${orderId}&modify=true`;
                    }
                });
                return;
            }
        }

        const check = validateForm();
        if (!check.valid) {
            Swal.fire({
                icon: "error",
                title: "Missing Field",
                text: `Please fill: ${check.field}`,
            });
            return;
        }

        try {
            setIsLoading(true);
            const token = localStorage.getItem("authToken");

            if (!token) {
                router.push('/auth/login');
                return;
            }
            // FIXED: Proper contact object structure for Mongoose schema
            const contactPhone = formData.contact || '';
            const countryCodeMatch = contactPhone.match(/^\+(\d+)/);
            const countryCode = countryCodeMatch ? countryCodeMatch[1] : '91'; // Default to India if no country code
            const payload = {
                companyName: formData.companyName,
                companyType: formData.companyType,
                industryType: formData.industryType,
                similarCompany: formData.similarCompany || "",
                companyAge: formData.yearsInBusiness,
                country: formData.countryFullName || formData.country,
                FinYrEndDate: formData.yearEndDay,
                FinYrEndMonth: formData.yearEndMonth,
                FinYrEnd: formData.yearEndYear,
                earningTrend: formData.earningTrend,
                description: formData.businessDescription,
                contact: {
                    countryCode: countryCode,
                    dialCode: `+${countryCode}`,
                    phoneNumber: contactPhone.replace(/^\+\d+/, ''), // Remove country code
                    fullNumber: contactPhone
                },
                email: formData.email,
                currency: formData.currency
            };

            console.log('Submitting payload:', payload);

            let response;
            let newOrderId = orderId;

            // Different API calls based on status and modification
            if (orderId) {
                if (isModification && (orderStatus === 'Completed' || orderStatus === 'Completed (Revised)')) {
                    // Create resubmission
                    response = await Axios.post("/api/order/resubmit", {
                        originalOrderId: orderId,
                        businessdata: payload,
                        modification_type: "re_submission"
                    }, {
                        headers: { Authorization: token },
                    });

                    if (response.data.status) {
                        newOrderId = response.data.data.order._id;
                        localStorage.setItem("currentOrderId", newOrderId);
                        // Update status to Re-Submitted
                        localStorage.setItem('orderStatus', 'Re-Submitted');
                    }
                } else {
                    // Normal update
                    response = await Axios.put("/api/order/update", {
                        orderId,
                        businessdata: payload,
                    }, {
                        headers: { Authorization: token },
                    });
                }
            } else {
                // Create new order
                response = await Axios.post("/api/order/store", payload, {
                    headers: { Authorization: token },
                });

                if (response.data.status) {
                    newOrderId = response.data.data.order._id;
                    localStorage.setItem("currentOrderId", newOrderId);
                    localStorage.setItem('orderStatus', 'Pending Submission');
                }
            }

            if (response.data.status) {
                saveToLocalStorage();

                Swal.fire({
                    icon: "success",
                    title: "Saved",
                    text: isModification ? "Modification started successfully." : "Company details saved successfully.",
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    const nextUrl = `/dashboard/newOrder?step=financial&orderId=${newOrderId}`;
                    if (isModification) {
                        window.location.href = `${nextUrl}&modify=true`;
                    } else {
                        window.location.href = nextUrl;
                    }
                });
            }
        } catch (err) {
            console.error('Save error:', err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || "Unable to save data.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getReadOnlyMessage = () => {
        switch (orderStatus) {
            case 'Completed':
            case 'Completed (Revised)':
                return isModification
                    ? "Company information cannot be modified for completed orders. You can edit financial data only."
                    : "This order is completed and cannot be edited.";
            case 'Re-Submitted':
                return "This order has been re-submitted and is awaiting review.";
            case 'Submitted':
                return "This order has been submitted and cannot be edited.";
            default:
                return "This form is read-only.";
        }
    };

    // Get status badge color
    const getStatusBadgeColor = () => {
        if (!orderStatus) return 'bg-gray-100 text-gray-800';

        switch (orderStatus) {
            case 'Pending Submission':
                return 'bg-yellow-100 text-yellow-800';
            case 'Completed':
            case 'Completed (Revised)':
                return 'bg-green-100 text-green-800';
            case 'Re-Submitted':
                return 'bg-blue-100 text-blue-800';
            case 'Submitted':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Default currency options fallback
    const defaultCurrencyOptions = [
        { value: "USD", label: "US Dollar (USD)" },
        { value: "EUR", label: "Euro (EUR)" },
        { value: "GBP", label: "British Pound (GBP)" },
        { value: "INR", label: "Indian Rupee (INR)" },
        { value: "AUD", label: "Australian Dollar (AUD)" },
        { value: "CAD", label: "Canadian Dollar (CAD)" }
    ];

    // Format years in business for display
    const formatYearsInBusiness = (years) => {
        if (!years) return "";
        switch (years) {
            case "0-1": return "0-1 Year";
            case "2-5": return "2-5 Years";
            case "5+": return "5+ Years";
            default: return years;
        }
    };

    // Format financial year end for display
    const formatFinancialYearEnd = () => {
        const { yearEndDay, yearEndMonth, yearEndYear } = formData;
        if (!yearEndDay || !yearEndMonth || !yearEndYear) return "";
        return `${yearEndDay} ${yearEndMonth} ${yearEndYear}`;
    };

    if (isLoading) {
        return (
            <div className="flex h-full justify-center items-center">
                <CircularProgress size={40} style={{ color: "#16a085" }} />
            </div>
        );
    }

    return (
        <div className='lg:ps-8 bg-gray-50 p-3 lg:pe-14 xl:pe-24 lg:pt-3'>
            <div className='flex flex-col justify-between gap-2 md:gap-0'>
                <div className='flex justify-between items-start'>
                    <div>
                        <span className='text-[22px] cxs:text-[28px] text-gray-700 font-bold font-sans'>
                            {isModification ? 'Modify Order: ' : 'New Order: '}
                        </span>
                        <span className='text-[18px] cxs:text-[26px] text-gray-700 fw-medium font-sans'> Business Detail</span>
                        <p className='text-gray-700 text-sm text-medium'>
                            {isModification
                                ? 'Modifying an existing order. Company information is read-only for completed orders.'
                                : 'Please provide your company information.'}
                        </p>
                    </div>

                    {/* Status Badge */}
                    {/* {orderStatus && (
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor()}`}>
                            Status: {orderStatus}
                            {isModification && ' (Modifying)'}
                        </div>
                    )} */}
                </div>

                {/* Edit Permissions Banner */}
                {/* {orderStatus && (
                    <div className={`mt-4 p-4 rounded-md ${
                        canEditAll ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {canEditAll ? (
                                    canEditCompany ? (
                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.5 5.914 1 1 0 11-1.414 1.414 6 6 0 01-.5-8.914l3-3z" clipRule="evenodd" />
                                        </svg>
                                    )
                                ) : (
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                           
                        </div>
                    </div>
                )} */}

                <div className="w-full flex justify-end text-[10px] cxs:text-sm">
                    <p className='text-themegreen'> (All fields are mandatory)</p>
                </div>
            </div>

            <div className="flex lg:flex-row flex-col gap-4 lg:gap-8 cxs:py-4 lg:py-6 py 2 xl:py-8">
                {/* Form Section */}
                <div className="w-full lg:w-[33%] h-fit p-2 xs:p-4 bg-white rounded-md">
                    <div className="flex gap-3 flex-col max-h-[76vh] overflow-y-auto pe-4 custom-scrollbar">
                        <form className="space-y-5 text-sm" onSubmit={handleSubmit}>
                            {/* Company Name */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName || ''}
                                    onChange={handleChange}
                                    disabled={!canEditCompany}
                                    placeholder="Your Company Name"
                                    className="w-full h-[38px] border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Company Type */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Company Type *
                                </label>
                                <Select
                                    components={{ DropdownIndicator, IndicatorSeparator: () => null }}
                                    styles={selectStyles}
                                    options={[
                                        { value: "Private", label: "Private" },
                                        { value: "Public", label: "Public" },
                                    ]}
                                    value={formData.companyType ? { value: formData.companyType, label: formData.companyType } : null}
                                    onChange={(selected) => handleSelectChange('companyType', selected)}
                                    isDisabled={!canEditCompany}
                                    placeholder="Select Type"
                                />
                            </div>

                            {/* Industry Type */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Industry Type *
                                </label>
                                <CustomDropdown
                                    data={availableSubIndustries}
                                    value={formData.industryType || ''}
                                    onChange={(e) => {
                                        if (!canEditCompany) return;
                                        const value = e.target.value;
                                        const newFormData = { ...formData, industryType: value };
                                        setFormData(newFormData);
                                        localStorage.setItem('companyFormData', JSON.stringify(newFormData));
                                    }}
                                    name="industryType"
                                    disabled={!canEditCompany}
                                    suffixIcon={<IoMdArrowDropdown size={18} color="#1aa79c" />}
                                />
                            </div>

                            {/* Similar Company */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Similar Company
                                </label>
                                <input
                                    type="text"
                                    name="similarCompany"
                                    value={formData.similarCompany || ''}
                                    placeholder='Write your similar company name'
                                    onChange={handleChange}
                                    disabled={!canEditCompany}
                                    className="w-full h-[38px] border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Years in Business */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Years in Business *
                                </label>

                                <div className="space-y-2 flex justify-between items-baseline">
                                    {[
                                        { value: "0-1", label: "0-1 Year" },
                                        { value: "2-5", label: "2-5 Years" },
                                        { value: "5+", label: "5+ Years" },
                                    ].map((option) => (
                                        <div key={option.value} className="flex items-center">
                                            <input
                                                type="radio"
                                                id={`yearsOption-${option.value}`}
                                                name="yearsInBusiness"
                                                value={option.value}
                                                checked={formData.yearsInBusiness === option.value}
                                                onChange={handleCheckboxChange}
                                                disabled={!canEditCompany}
                                                className="h-4 w-4 text-themegreen border-gray-300 focus:ring-themegreen disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            />
                                            <label
                                                htmlFor={`yearsOption-${option.value}`}
                                                className="ml-2 text-sm text-gray-700"
                                            >
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Country *
                                </label>
                                <Select
                                    components={{ DropdownIndicator }}
                                    styles={selectStyles}
                                    options={options}
                                    value={formData.country ? { value: formData.country, label: formData.countryFullName || formData.country } : null}
                                    onChange={(selected) => handleSelectChange('country', selected)}
                                    isDisabled={!canEditCompany}
                                    placeholder="Select Country"
                                />
                            </div>

                            {/* Financial Year End */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    When did your last financial year end? *
                                </label>
                                <div className="flex gap-2">
                                    <Select
                                        components={{ DropdownIndicator, IndicatorSeparator: () => null }}
                                        styles={selectStyles}
                                        options={Array.from({ length: 31 }, (_, i) => ({
                                            value: i + 1,
                                            label: String(i + 1),
                                        }))}
                                        value={formData.yearEndDay ? { value: formData.yearEndDay, label: String(formData.yearEndDay) } : null}
                                        onChange={(selected) => handleSelectChange('yearEndDay', selected)}
                                        isDisabled={!canEditCompany}
                                        placeholder="Day"
                                        className="w-1/3"
                                    />
                                    <Select
                                        components={{ DropdownIndicator, IndicatorSeparator: () => null }}
                                        styles={selectStyles}
                                        options={[
                                            "January", "February", "March", "April", "May", "June",
                                            "July", "August", "September", "October", "November", "December",
                                        ].map((m) => ({ value: m, label: m }))}
                                        value={formData.yearEndMonth ? { value: formData.yearEndMonth, label: formData.yearEndMonth } : null}
                                        onChange={(selected) => handleSelectChange('yearEndMonth', selected)}
                                        isDisabled={!canEditCompany}
                                        placeholder="Month"
                                        className="w-1/3"
                                    />
                                    <Select
                                        components={{ DropdownIndicator, IndicatorSeparator: () => null }}
                                        styles={selectStyles}
                                        options={Array.from({ length: 10 }, (_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return { value: year, label: String(year) };
                                        })}
                                        value={formData.yearEndYear ? { value: formData.yearEndYear, label: String(formData.yearEndYear) } : null}
                                        onChange={(selected) => handleSelectChange('yearEndYear', selected)}
                                        isDisabled={!canEditCompany}
                                        placeholder="Year"
                                        className="w-1/3"
                                    />
                                </div>
                            </div>

                            {/* Earning Trend */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Historical Earning Trend *
                                </label>
                                <Select
                                    components={{ DropdownIndicator, IndicatorSeparator: () => null }}
                                    styles={selectStyles}
                                    options={[
                                        { value: "declining_no_turnaround", label: "Declining Revenues 10–20% Y-o-Y, no turnaround yet" },
                                        { value: "declining_turnaround", label: "Declining Revenues 10–20% Y-o-Y, turnaround started" },
                                        { value: "steady_sustainable", label: "Steady Revenue, sustainable" },
                                        { value: "increasing_sustainable", label: "Increasing Revenues 10–20% Y-o-Y, sustainable" },
                                        { value: "increasing_non_sustainable", label: "Increasing Revenues 10–20% Y-o-Y, non-sustainable" },
                                    ]}
                                    value={formData.earningTrend ? { value: formData.earningTrend, label: formData.earningTrend } : null}
                                    onChange={(selected) => handleSelectChange('earningTrend', selected)}
                                    isDisabled={!canEditCompany}
                                    placeholder="Select Trend"
                                />
                            </div>

                            {/* Business Description */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Business Description *
                                </label>
                                <textarea
                                    name="businessDescription"
                                    value={formData.businessDescription || ''}
                                    onChange={handleChange}
                                    disabled={!canEditCompany}
                                    placeholder="Describe your business"
                                    className="w-full min-h-[100px] border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    disabled={!canEditCompany}
                                    placeholder="company@example.com"
                                    className="w-full h-[38px] border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Currency */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Currency *
                                </label>
                                <Select
                                    components={{ DropdownIndicator, IndicatorSeparator: () => null }}
                                    styles={selectStyles}
                                    options={currencyOptions.length > 0 ? currencyOptions : defaultCurrencyOptions}
                                    value={formData.currency ? { value: formData.currency, label: formData.currency } : null}
                                    onChange={(selected) => handleSelectChange('currency', selected)}
                                    isDisabled={!canEditCompany}
                                    placeholder="Select Currency"
                                />
                            </div>

                            {/* Contact */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Contact *
                                </label>
                                <PhoneInput
                                    country={countryCode}
                                    value={formData.contact || ''}
                                    onChange={handlePhoneChange}
                                    disabled={!canEditCompany}
                                    inputStyle={{
                                        width: "100%",
                                        height: "38px",
                                        borderRadius: "6px",
                                        borderColor: "#d1d5db",
                                        backgroundColor: !canEditCompany ? "#f3f4f6" : "white"
                                    }}
                                    buttonStyle={{
                                        backgroundColor: !canEditCompany ? "#f3f4f6" : "white",
                                        borderColor: "#d1d5db",
                                        borderRight: "none"
                                    }}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={!canEditAll || isLoading}
                                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${!canEditAll || isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-themegreen hover:bg-teal-700'
                                        }`}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <CircularProgress size={20} style={{ color: "white" }} />
                                            <span className="ml-2">Saving...</span>
                                        </div>
                                    ) : isModification ? (
                                        'Continue to Financial Data'
                                    ) : (
                                        'Save & Continue'
                                    )}
                                </button>

                                {!canEditAll && (
                                    <p className="text-red-500 text-xs mt-2 text-center">
                                        {getReadOnlyMessage()}
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="w-full lg:w-[67%]">
                    <div className="flex gap-3 flex-col cxs:grid cxs:grid-cols-3 cxs:gap-4 w-full">
                        {/* Company Name Preview */}
                        {formData.companyName && (
                            <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4">
                                <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen'></span>
                                <p className='text-gray-400 text-xs mb-1 text-medium'>Company Name</p>
                                <p className='text-gray-700 text-xs mb-1 text-medium'>{formData.companyName}</p>
                            </div>
                        )}

                        {/* Company Type Preview */}
                        {formData.companyType && (
                            <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4">
                                <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen'></span>
                                <p className='text-gray-400 text-xs mb-1 text-medium'>Company Type</p>
                                <p className='text-gray-700 text-xs mb-1 text-medium'>{formData.companyType}</p>
                            </div>
                        )}

                        {/* Industry Type Preview */}
                        {formData.industryType && (
                            <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4">
                                <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen'></span>
                                <p className='text-gray-400 text-xs mb-1 text-medium'>Industry Type</p>
                                <p className='text-gray-700 text-xs mb-1 text-medium'>{formData.industryType}</p>
                            </div>
                        )}

                        {/* Country Preview with Map */}
                        {formData.country && (
                            <div className="h-34 col-span-2 bg-white rounded-lg w-full relative p-3 flex gap-1 xs:gap-0 justify-between items-center">
                                <div>
                                    <span className="inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen"></span>
                                    <p className="text-gray-400 text-xs font-medium mb-1">Country</p>
                                    <p className="text-gray-700 text-xs mb-1 text-medium">{formData.countryFullName || formData.country}</p>
                                </div>
                                <div className="relative w-[80%] h-32">
                                    <GeoMapTwo height={128} selectedCountry={formData.country} />
                                </div>
                            </div>
                        )}

                        {/* Years in Business Preview */}
                        {formData.yearsInBusiness && (
                            <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4">
                                <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen'></span>
                                <p className='text-gray-400 text-xs mb-1 text-medium'>Years in Business</p>
                                <p className='text-gray-700 text-xs mb-1 text-medium'>{formatYearsInBusiness(formData.yearsInBusiness)}</p>
                            </div>
                        )}


                        {!formData.companyName && !formData.companyType && !formData.industryType && (
                            <div className="h-34 col-span-3 bg-white rounded-lg w-full p-8 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-sm text-center">
                                    Fill in the form to see your company details preview here
                                </p>
                                {!canEditCompany && (
                                    <p className="text-yellow-500 text-xs mt-2 text-center">
                                        Company information is read-only for completed orders
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Company;