import React, { useState } from 'react';
import axios from 'axios';
import { apiURL } from '../../../config/Config';
import { formatFrontNumber } from "../../../common/numberUtils";
import SupportLink from './Modal/SupportLink';
import { NumericFormat } from 'react-number-format';

const FinancialInfo = ({ onSave, initialData, backButton, onFieldChange, orderId, editAllowed }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear;
    const role = localStorage.getItem('role');

    const [formData, setFormData] = useState({
        financedata: {
            dataYear: initialData?.order?.business?.business?.FinYrEnd || previousYear,
            sales: formatFrontNumber(initialData?.calculations?.finance?.sales) || '',
            costOfSales: formatFrontNumber(initialData?.calculations?.finance?.costOfSales) || '',
            ebitda: formatFrontNumber(initialData?.calculations?.finance?.ebitda) || '',
            depreciation: formatFrontNumber(initialData?.calculations?.finance?.depreciation) || '',
            interestExpense: formatFrontNumber(initialData?.calculations?.finance?.interestExpense) || '',
            netProfit: formatFrontNumber(initialData?.calculations?.finance?.netProfit) || '',
            cashBalance: formatFrontNumber(initialData?.calculations?.finance?.cashBalance) || '',
            debtLoan: formatFrontNumber(initialData?.calculations?.finance?.debtLoan) || '',
            equity: formatFrontNumber(initialData?.calculations?.finance?.equity) || '',
            receivables: formatFrontNumber(initialData?.calculations?.finance?.receivables) || '',
            inventories: formatFrontNumber(initialData?.calculations?.finance?.inventories) || '',
            payables: formatFrontNumber(initialData?.calculations?.finance?.payables) || '',
            netFixedAssets: formatFrontNumber(initialData?.calculations?.finance?.netFixedAssets) || '',
            valueType: initialData?.calculations?.finance?.valueType || 'Millions',
        },
        FinYrEnd: initialData?.order?.business?.business?.FinYrEnd || previousYear,
        orderId: orderId
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'valueType') {
            setFormData(prevFormData => ({
                ...prevFormData,
                financedata: {
                    ...prevFormData.financedata,
                    valueType: value
                }
            }));
            handleGraphData(name, value);
        } else {
            const isNumeric = (val) => /^-?\d*\.?\d*$/.test(val); // Regex to allow numeric input, including negative values.

            // Split the name to get the category and field
            const [category, field] = name.split('.');

            // Allow negative values only for 'ebitda' and 'netProfit', and restrict others to positive values.
            if (['ebitda', 'netProfit'].includes(field)) {
                if (!isNumeric(value)) {
                    return; // Prevent updating the state if the value is not numeric.
                }
            } else {
                if (!isNumeric(value) || value < 0) {
                    return; // Prevent negative values or non-numeric input.
                }
            }
            setFormData(prevFormData => ({
                ...prevFormData,
                [category]: {
                    ...prevFormData[category],
                    [field]: value
                }
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const [category, field] = name.split('.');
        
        let newValue = value.trim();
        if (newValue === '') {
            handleGraphData(field, newValue);
            setFormData(prevFormData => ({
                ...prevFormData,
                [category]: {
                    ...prevFormData[category],
                    [field]: newValue, // Keep the field blank if no input
                },
            }));
            return;
        }
    
        const numValue = parseFloat(newValue.replace(/,/g, ''));
        if (!isNaN(numValue)) {
            newValue = numValue.toFixed(2);
        }
    
        handleGraphData(field, newValue);
    
        setFormData(prevFormData => ({
            ...prevFormData,
            [category]: {
                ...prevFormData[category],
                [field]: newValue,
            },
        }));
    };
    

    const [finData, setFinData] = useState({
        sales: [initialData?.calculations?.finance?.sales || 0.00],
        ebitda: [initialData?.calculations?.finance?.ebitda || 0.00],
        costOfSales: [initialData?.calculations?.finance?.costOfSales || 0.00],
        netProfit: [initialData?.calculations?.finance?.netProfit || 0.00],
        year: [initialData?.order?.business?.business?.FinYrEnd, initialData?.order?.business?.business?.FinYrEnd + 1, initialData?.order?.business?.business?.FinYrEnd + 2, initialData?.order?.business?.business?.FinYrEnd + 3, initialData?.order?.business?.business?.FinYrEnd + 4, initialData?.order?.business?.business?.FinYrEnd + 5],
        valueType: initialData?.calculations?.finance?.valueType || 'Millions',
    });

    const handleGraphData = (fieldName, value) => {
        setFinData(prevData => ({
            ...prevData,
            [fieldName]: [value] // Update with new value in an array
        }));
        onFieldChange({ ...finData, [fieldName]: [value] }); // Call onFieldChange with the updated data
    };

    const handleSubmit = async (e, buttonName) => {
        e.preventDefault();

        // Convert blank fields to 0.00 before validation
        const updatedFinancedata = Object.keys(formData.financedata).reduce((acc, field) => {
            acc[field] = formData.financedata[field] === '' ? '0.00' : formData.financedata[field];
            return acc;
        }, {});

        // Update formData with the updated financedata
        const updatedFormData = {
            ...formData,
            financedata: updatedFinancedata
        };

        let isValid = true;
        const newErrors = {};

        // Validate valueType
        if (!updatedFormData.financedata.valueType) {
            newErrors.financedata.valueType = 'This field is required.';
            isValid = false;
        }

        const validateNumber = (value, allowNegative) => {
            if (value === '' || isNaN(value)) return 'Invalid number.';
            const num = parseFloat(value);
            if (!allowNegative && num < 0) return '-ve values are not allowed.';
            if (allowNegative && num < 0) return null;
            if (num < 0) return '-ve values are not allowed.';
            return null;
        };

        const fields = {
            sales: false,
            costOfSales: false,
            ebitda: true,
            depreciation: false,
            interestExpense: false,
            netProfit: true,
            cashBalance: false,
            debtLoan: false,
            equity: false,
            receivables: false,
            inventories: false,
            payables: false,
            netFixedAssets: false,
        };

        // Validate each field
        Object.keys(fields).forEach(field => {
            const error = validateNumber(updatedFormData.financedata[field], fields[field]);
            if (error) {
                newErrors[`financedata.${field}`] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);

        if (isValid) {
            setIsLoading(true); // Start loading

            try {
                const token = localStorage.getItem('token');
                const response = await axios.put(
                    apiURL + '/order/update',
                    updatedFormData,  // Use updatedFormData here
                    {
                        headers: {
                            Authorization: `${token}`
                        }
                    }
                );
                if (response.status === 200) {
                    if (buttonName === 'back') {
                        backButton(); // Call backButton function
                    } else if (buttonName === 'save') {
                        onSave(); // Call onSave function
                    }
                }
            } catch (error) {
                console.error('Error saving form:', error);
            } finally {
                setIsLoading(false); // Stop loading
            }
        }
    };


    const handleButton = async (buttonName) => {
        if (buttonName === 'back') {
            backButton(); // Call backButton function
        } else if (buttonName === 'next') {
            onSave(); // Call onSave function
        }
    };

    return (
        <div className="card m-0 border-radius-0px border-0 box-shadow h-100" style={{ backgroundColor: "#f2f3f6" }}>
            <div className="card-header fw-500 p-15px lh-normal bg-white">
                <p className="text-blue fw-600 mb-0 fs-16 lh-1 mt-5px mb-5px">New Order: <span className="text-dark-blue">Current Financial Information</span>
                    {initialData && initialData.order.status !== 'Completed' ?
                        editAllowed && (role && role !== 'admin') && <SupportLink data={initialData} />
                        : <></>
                    }
                </p>
                <div className="divider-style-03 divider-style-03-02 border-color-light-gray mb-10px mt-10px w-100"></div>
                <span className="fw-500 fs-14 lh-1 d-inline-block">Please specify all values in positive number only and up to 2 decimal places</span><br /><span className="fw-400 fs-12 fst-italic lh-1 d-inline-block">(Fields marked with <span className="text-red">*</span> can be negative)</span>
            </div>
            <div className="card-body p-0" style={{
                maxHeight: '580px',
                overflowY: 'auto', // Enables vertical scrolling
                overflowX: 'hidden', // Hides horizontal scrolling if not needed
                padding: '20px', // Adds some padding for better content spacing
                scrollbarWidth: 'thin', // For Firefox, makes the scrollbar thinner
            }}
                data-scroll-options='{ "theme": "dark" }'>
                <form action="" className="row contact-form-style-04 myform-01 justify-content-center">
                    <div className="col-sm-12 mt-20px ps-15 pe-15 text-center md-ps-0 md-pe-0">
                        <p className="mb-0 fw-600 fs-14 lh-1">Provide historical numbers for year <span className="bg-blue text-white ps-10px pe-10px p-1 fw-600">{formData.FinYrEnd}</span></p>
                    </div>
                    <div className="col-sm-8 mt-20px ps-0">
                        <div className="row align-items-center justify-content-center">
                            <div className="w-130px text-end pe-0">
                                <label className="text-black mb-0 fw-600 fs-13 d-block lh-1">All values are in</label>
                            </div>
                            <div className="col-7">
                                <div className="input-group">
                                    <span className="input-group-text p-0 pt-5 pb-5 w-35px h-40px justify-content-center border-radius-0px">
                                        <i className="fa fa-coins align-middle fs-20 lh-1"></i>
                                    </span>
                                    <input type="hidden" name="FinYrEnd" value={formData.FinYrEnd} />
                                    <div className="select">
                                        <select className="form-control" name="valueType" value={formData.financedata.valueType} onChange={handleChange} aria-label="select-industry" disabled={initialData && initialData.order.status === 'Completed'}>
                                            <option value="Absolute">Absolute</option>
                                            <option value="Thousands">Thousands</option>
                                            <option value="Millions">Millions</option>
                                            <option value="Billions">Billions</option>
                                            <option value="Trillions">Trillions</option>
                                        </select>
                                        {errors.valueType && <div className="text-danger">{errors.valueType}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {['sales', 'costOfSales', 'ebitda', 'depreciation', 'interestExpense', 'netProfit', 'cashBalance', 'debtLoan', 'equity', 'receivables', 'inventories', 'payables', 'netFixedAssets'].map((field, index) => (
                        <div className="col-sm-8 mt-20px ps-0" key={index}>
                            <div className="row align-items-center justify-content-center">
                                <div className="w-130px text-end pe-0 sm-ps-25px">
                                    <label className="text-black mb-0 fw-600 fs-13 d-block lh-1">
                                        {field === 'ebitda'
                                            ? 'EBITDA'
                                            : field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        {['ebitda', 'netProfit'].includes(field) && <sup className="text-red fs-14">*</sup>}
                                    </label>
                                </div>
                                <div className="col-7">
                                    <div className="input-group">
                                        <span className="input-group-text p-0 pt-5 pb-5 w-35px h-40px justify-content-center border-radius-0px">
                                            <i className={`fa ${{
                                                sales: 'fa-chart-column',
                                                costOfSales: 'bi-bar-chart-line-fill',
                                                ebitda: 'bi-bar-chart-steps',
                                                depreciation: 'fa-chart-line',
                                                interestExpense: 'fa-dollar-sign',
                                                netProfit: 'fa-chart-bar',
                                                cashBalance: 'bi-cash-coin',
                                                debtLoan: 'bi-credit-card',
                                                equity: 'fa-scale-balanced',
                                                receivables: 'fa-hand-holding-dollar',
                                                inventories: 'bi-boxes',
                                                payables: 'fa-file-invoice-dollar',
                                                netFixedAssets: 'bi-wallet-fill',
                                            }[field]} align-middle fs-20 lh-1`}></i>
                                        </span>
                                        <NumericFormat
                                                    className="mb-0 form-control bg-white financial-info-input"
                                                    type="text"
                                                    name={`financedata.${field}`}
                                                    value={formData.financedata[field]}
                                                    onValueChange={(values) => {
                                                        const { value: rawValue } = values; // Get unformatted raw value
                                                        handleChange({
                                                        target: { name: `financedata.${field}`, value: rawValue }, // simulate event structure
                                                        });
                                                    }}
                                                    onBlur={(e) => {
                                                        const sanitizedValue = e.target.value.replace(/,/g, '').trim(); // Remove commas for raw parsing
                                                        if (sanitizedValue === '') {
                                                        handleBlur({
                                                            target: { name: `financedata.${field}`, value: '' }, // Set default value if empty
                                                        });
                                                        } else {
                                                        const formattedValue = sanitizedValue.includes('.')
                                                            ? parseFloat(sanitizedValue).toFixed(2) // Ensure two decimal places
                                                            : `${sanitizedValue}.00`;
                                                        handleBlur({
                                                            target: { name: `financedata.${field}`, value: formattedValue },
                                                        });
                                                        }
                                                    }}
                                                    thousandSeparator={true}
                                                    decimalScale={2} // Format with 2 decimal places
                                                    fixedDecimalScale={true} // Ensure two decimal places are always shown
                                                    placeholder="0.00"
                                                    />
                                    </div>
                                    {errors[field] && <div className="text-danger">{errors[field]}</div>}
                                </div>
                            </div>
                        </div>
                    ))}

                    {!editAllowed ? (
                        <div className="col-sm-12 mt-20px mb-15px text-center">
                            <button
                                onClick={(e) => handleButton('back')}
                                className="border-radius-0px btn btn-round-edge bg-blue submit h-40px p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn"
                                type="button"
                            >
                                <span>
                                    <span><i className="feather icon-feather-arrow-left-circle m-0"></i></span>
                                    <span className="btn-double-text"> Back</span>
                                </span>
                            </button>
                            &nbsp;
                            <button
                                onClick={(e) => handleButton('next')}
                                className="border-radius-0px btn btn-round-edge bg-blue submit h-40px p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn"
                                type="button"
                            >
                                <span>
                                    <span><i className="feather icon-feather-arrow-right-circle m-0"></i></span>
                                    <span className="btn-double-text"> Next</span>
                                </span>
                            </button>
                        </div>
                    ) : (
                        isLoading ? (
                            <div className="col-sm-12 mt-20px mb-15px text-center">
                                <span>
                                    <span><i className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i></span>
                                    <span className="btn-double-text ms-3px" data-text="Submitting...">Submitting...</span>
                                </span>
                            </div>
                        ) : (
                            <div className="col-sm-12 mt-20px mb-15px text-center">
                                <button
                                    onClick={(e) => handleSubmit(e, 'back')}
                                    className="border-radius-0px btn btn-round-edge bg-blue submit h-40px p-0 ps-15px pe-15px  fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn"
                                    type="button"
                                    name="back"
                                >
                                    <span>
                                        <span><i className="feather icon-feather-arrow-left-circle m-0"></i></span>
                                        <span className="btn-double-text"> Back</span>
                                    </span>
                                </button>
                                &nbsp;
                                <button
                                    onClick={(e) => handleSubmit(e, 'save')}
                                    className="border-radius-0px btn btn-round-edge bg-blue submit h-40px p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn"
                                    type="button"
                                    name="save"
                                >
                                    <span>
                                        <span><i className="feather icon-feather-save m-0"></i></span>
                                        <span className="btn-double-text"> Save:Go To Financial Projections</span>
                                    </span>
                                </button>
                            </div>
                        ))}
                </form>
            </div>
        </div>
    );
}

export default FinancialInfo;
