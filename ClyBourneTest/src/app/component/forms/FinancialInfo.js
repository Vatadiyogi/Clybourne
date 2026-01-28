"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Axios from '../../../utils/api';
import { getCountryName } from "../../../utils/countryUtils";
import Swal from 'sweetalert2';
import { components } from "react-select";
import { IoMdArrowDropdown } from "react-icons/io";
import GeoMapTwo from "../charts/GeoMapTwo";
import SalesChart from "../charts/SalesChart"
import CogsChart from "../charts/CogsChart"
import EbitdaChart from "../charts/EbitdaChart"
import NetProfitChart from "../charts/NetProfitChart"
import NetMarginChart from "../charts/NetMarginChart"

// Dynamically import components
const Select = dynamic(() => import("react-select"), { ssr: false });

// Calculation Functions
export function CalculateGraphData(salesNumber, percentage) {
    let number = 0;
    number = salesNumber * (1 + percentage / 100);
    return Math.round((number + Number.EPSILON) * 100) / 100; // Return with 2 decimal places
}

export function calculateNetProfitMargin(salesNumber, netProfit) {
    let number = 0;
    number = (parseFloat(netProfit) / parseFloat(salesNumber)) * 100;
    const result = isNaN(number) ? 0 : number;
    return Math.round((result + Number.EPSILON) * 100) / 100; // Return with 2 decimal places
}

export function roundOffNumber(numbers, finData) {
    if (!Array.isArray(numbers) || numbers.length === 0) {
        return {
            roundedNumbers: numbers.map(() => 0),
            valueType: finData?.valueType?.[0] || 'Millions'
        };
    }

    // Get current unit
    const currentUnit = finData?.valueType?.[0] || 'Millions';
    
    // Find the maximum absolute value
    const validNumbers = numbers.filter(num => !isNaN(num));
    if (validNumbers.length === 0) {
        return {
            roundedNumbers: numbers.map(() => 0),
            valueType: currentUnit
        };
    }
    
    const maxAbsValue = Math.max(...validNumbers.map(num => Math.abs(num)));
    
    // Define unit hierarchy
    const unitHierarchy = {
        'Thousands': { next: 'Millions', divisor: 1000 },
        'Millions': { next: 'Billions', divisor: 1000000 },
        'Billions': { next: 'Trillions', divisor: 1000000000 },
        'Trillions': { next: 'Trillions', divisor: 1 }
    };
    
    let targetUnit = currentUnit;
    let divisor = 1;
    
    // Check if we need to scale up
    if (maxAbsValue > 0) {
        const digitCount = Math.floor(Math.log10(maxAbsValue)) + 1;
        const unitInfo = unitHierarchy[currentUnit];
        
        if (unitInfo) {
            // Check threshold: 4 digits means we need to scale (e.g., 1000 in millions = 1 billion)
            if (digitCount >= 4) {
                targetUnit = unitInfo.next;
                divisor = unitInfo.divisor;
            }
        }
    }
    
    // Apply division and round
    const roundedNumbers = numbers.map(num => {
        const validNum = isNaN(num) ? 0 : num;
        const result = divisor === 1 ? validNum : validNum / divisor;
        return parseFloat(result.toFixed(2));
    });
    
    return {
        roundedNumbers,
        valueType: targetUnit
    };
}

const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <IoMdArrowDropdown size={18} color="#1aa79c" />
        </components.DropdownIndicator>
    );
};
const getScaledUnit = (values, currentUnit) => {
    // Find the largest absolute value
    const maxAbsValue = Math.max(...values.map(v => Math.abs(v)));
    
    // Handle zero or very small values
    if (maxAbsValue === 0) return currentUnit;
    
    const digitCount = Math.floor(Math.log10(maxAbsValue)) + 1;
    
    // Define scaling rules based on digit count
    const scalingRules = {
        'Thousands': { threshold: 4, next: 'Millions' },
        'Millions': { threshold: 4, next: 'Billions' },
        'Billions': { threshold: 4, next: 'Trillions' },
        'Trillions': { threshold: 4, next: 'Trillions' }
    };
    
    const rule = scalingRules[currentUnit] || scalingRules['Millions'];
    
    // If number of digits exceeds threshold, move to next unit
    if (digitCount >= rule.threshold) {
        return rule.next;
    }
    
    return currentUnit;
};
const FinancialInfo = ({ orderId, initialData, onSave, onBack, editAllowed }) => {
    const router = useRouter();

    // Define default financial data structure
    const getDefaultFinancialData = () => ({
        valueType: "Historical",
        dataYear: new Date().getFullYear() - 1,
        unitOfNumber: "Millions",
        sales: "",
        costOfSales: "",
        ebitda: "",
        depreciation: "",
        interestExpense: "",
        netProfit: "",
        cashBalance: "",
        debtLoan: "",
        equity: "",
        receivables: "",
        inventories: "",
        payables: "",
        netFixedAssets: ""
    });

    const initializeFormData = () => {
        if (typeof window === 'undefined') return getDefaultFinancialData();

        const savedData = localStorage.getItem('financialFormData');
        return savedData ? JSON.parse(savedData) : getDefaultFinancialData();
    };

    const [formData, setFormData] = useState(initializeFormData());
    const [companyData, setCompanyData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [chartUnit, setChartUnit] = useState(formData.unitOfNumber || 'Millions');

    const selectStyles = {
        control: (base) => ({
            ...base,
            borderRadius: "6px",
            borderColor: "#d1d5db",
            boxShadow: "none",
            "&:hover": { borderColor: "#1aa79c" },
            minHeight: "38px",
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: "4px",
        }),
    };
 const generateChartData = useMemo(() => {
    const finYearEnd = companyData.yearEndYear ? parseInt(companyData.yearEndYear) : new Date().getFullYear();
    const forecastYears = Array.from({ length: 6 }, (_, index) => finYearEnd + index);
    
    // Create base data
    const baseData = forecastYears.map((year, index) => ({
        year: `${year}`,
        salesMain: index === 0 ? (parseFloat(formData.sales) || 0) : 0,
        cogsMain: index === 0 ? (parseFloat(formData.costOfSales) || 0) : 0,
        ebitda: index === 0 ? (parseFloat(formData.ebitda) || 0) : 0,
        netProfit: index === 0 ? (parseFloat(formData.netProfit) || 0) : 0,
        netMargin: index === 0 ? (calculateNetProfitMargin(
            parseFloat(formData.sales) || 0,
            parseFloat(formData.netProfit) || 0
        )) : 0
    }));
    
    // Collect all values to determine scaling
    const allValues = [];
    baseData.forEach(item => {
        allValues.push(item.salesMain, item.cogsMain, item.ebitda, item.netProfit);
    });
    
    // Apply scaling based on current unit
    const currentUnit = formData.unitOfNumber || 'Millions';
    
    // First, determine if we need to scale
    const maxValue = Math.max(...allValues.map(v => Math.abs(v)));
    const digitCount = maxValue > 0 ? Math.floor(Math.log10(maxValue)) + 1 : 0;
    
    // Define thresholds for each unit
    const unitThresholds = {
        'Thousands': 4, // 1000 = 4 digits
        'Millions': 7,  // 1,000,000 = 7 digits  
        'Billions': 10, // 1,000,000,000 = 10 digits
        'Trillions': 13 // 1,000,000,000,000 = 13 digits
    };
    
    let targetUnit = currentUnit;
    let divisor = 1;
    
    // Check if we exceed the threshold for current unit
    const threshold = unitThresholds[currentUnit] || 7;
    if (digitCount >= threshold) {
        // Move to next unit
        const unitMap = {
            'Thousands': { next: 'Millions', div: 1000 },
            'Millions': { next: 'Billions', div: 1000000 },
            'Billions': { next: 'Trillions', div: 1000000000 },
            'Trillions': { next: 'Trillions', div: 1 }
        };
        const nextInfo = unitMap[currentUnit];
        if (nextInfo) {
            targetUnit = nextInfo.next;
            divisor = nextInfo.div;
        }
    }
    
    // Apply scaling
    const scaledData = baseData.map(item => ({
        ...item,
        salesMain: divisor === 1 ? item.salesMain : parseFloat((item.salesMain / divisor).toFixed(2)),
        cogsMain: divisor === 1 ? item.cogsMain : parseFloat((item.cogsMain / divisor).toFixed(2)),
        ebitda: divisor === 1 ? item.ebitda : parseFloat((item.ebitda / divisor).toFixed(2)),
        netProfit: divisor === 1 ? item.netProfit : parseFloat((item.netProfit / divisor).toFixed(2)),
        netMargin: parseFloat(item.netMargin.toFixed(2))
    }));
    
    return {
        chartData: scaledData,
        chartUnit: targetUnit
    };
}, [formData, companyData]);
    // Update chart data when form data changes
    // Update chart data when dependencies change
    useEffect(() => {
        const { chartData: generatedData, chartUnit: generatedUnit } = generateChartData;
        setChartData(generatedData);
        setChartUnit(generatedUnit);
    }, [generateChartData]);
    // Get the current order ID
    const getCurrentOrderId = () => {
        if (orderId && orderId !== "null" && orderId !== "undefined") {
            return orderId;
        }

        const storedOrderId = localStorage.getItem("currentOrderId");
        if (storedOrderId && storedOrderId !== "null" && storedOrderId !== "undefined") {
            return storedOrderId;
        }

        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const urlOrderId = urlParams.get('orderId');
            if (urlOrderId && urlOrderId !== "null" && urlOrderId !== "undefined") {
                return urlOrderId;
            }
        }

        return null;
    };

    // Load company data from localStorage
    useEffect(() => {
        const savedCompanyData = localStorage.getItem('companyFormData');
        const savedContactNumber = localStorage.getItem('companyContactNumber');

        if (savedCompanyData) {
            try {
                const parsedCompanyData = JSON.parse(savedCompanyData);
                setCompanyData(parsedCompanyData);
            } catch (error) {
                console.error('Error parsing saved company data:', error);
            }
        }
    }, []);

    // Load saved financial data
    useEffect(() => {
        const savedData = localStorage.getItem('financialFormData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        } else if (initialData?.calculations?.finance) {
            setFormData(initialData.calculations.finance);
        }
    }, [initialData]);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('financialFormData', JSON.stringify(formData));
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Fields that can be negative (marked with *)
        const canBeNegativeFields = ["ebitda", "netProfit"];

        // For fields that cannot be negative, prevent negative values
        if (!canBeNegativeFields.includes(name) && value.startsWith('-')) {
            // Remove the minus sign
            const positiveValue = value.replace('-', '');
            setFormData((prev) => ({ ...prev, [name]: positiveValue }));

            // Show warning
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Input',
                text: `${name} cannot be negative`,
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSelectChange = (name, selected) => {
        const newValue = selected.value;
        setFormData((prev) => ({ ...prev, [name]: newValue }));

        // If the unit of number is changed, update chartUnit to the new selected unit
        if (name === 'unitOfNumber') {
            setChartUnit(newValue);
            // Save to localStorage immediately
            if (typeof window !== 'undefined') {
                localStorage.setItem('calculatedChartUnit', newValue);
                localStorage.setItem('baseChartUnit', newValue);
            }
        }
    };

    useEffect(() => {
        if (chartUnit && typeof window !== 'undefined') {
            localStorage.setItem('calculatedChartUnit', chartUnit);
        }
    }, [chartUnit])
    const validateForm = () => {
        const requiredFields = [
            "unitOfNumber",
            "sales",
            "costOfSales",
            "ebitda",
            "depreciation",
            "interestExpense",
            "netProfit",
            "cashBalance",
            "debtLoan",
            "equity",
            "receivables",
            "inventories",
            "payables",
            "netFixedAssets",
        ];

        for (let field of requiredFields) {
            if (!formData[field] || formData[field] === "") {
                return { valid: false, field, errorType: "empty" };
            }

            // Check for negative values in fields that should be positive
            if (field !== "ebitda" && field !== "netProfit") { // These can be negative (marked with *)
                const value = parseFloat(formData[field]);
                if (value < 0) {
                    return {
                        valid: false,
                        field,
                        errorType: "negative",
                        message: `${field} cannot be negative`
                    };
                }
            }
        }

        return { valid: true };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!editAllowed) {
            Swal.fire({
                icon: "info",
                title: "Read Only",
                text: "This order cannot be modified in its current state.",
            });
            return;
        }

        const currentOrderId = getCurrentOrderId();
        if (!currentOrderId) {
            Swal.fire({
                icon: "error",
                title: "Order ID Missing",
                text: "Cannot save financial data without a valid order. Please start over.",
            }).then(() => {
                clearAllFormData();
                router.push('/dashboard/newOrder');
            });
            return;
        }

        const check = validateForm();
        if (!check.valid) {
            let errorMessage = "";
            if (check.errorType === "empty") {
                errorMessage = `Please fill: ${check.field}`;
            } else if (check.errorType === "negative") {
                errorMessage = check.message || `${check.field} cannot be negative`;
            } else {
                errorMessage = `Please fill: ${check.field}`;
            }

            Swal.fire({
                icon: "error",
                title: "Invalid Input",
                text: errorMessage,
            });
            return;
        }
        try {
            setIsLoading(true);
            const token = localStorage.getItem("authToken");

            if (!token) {
                Swal.fire({
                    icon: "error",
                    title: "Authentication Required",
                    text: "Please login again.",
                });
                router.push('/login');
                return;
            }

            const payload = {
                valueType: formData.valueType,
                dataYear: formData.dataYear,
                unitOfNumber: formData.unitOfNumber,
                sales: parseFloat(formData.sales) || 0,
                costOfSales: parseFloat(formData.costOfSales) || 0,
                ebitda: parseFloat(formData.ebitda) || 0,
                depreciation: parseFloat(formData.depreciation) || 0,
                interestExpense: parseFloat(formData.interestExpense) || 0,
                netProfit: parseFloat(formData.netProfit) || 0,
                cashBalance: parseFloat(formData.cashBalance) || 0,
                debtLoan: parseFloat(formData.debtLoan) || 0,
                equity: parseFloat(formData.equity) || 0,
                receivables: parseFloat(formData.receivables) || 0,
                inventories: parseFloat(formData.inventories) || 0,
                payables: parseFloat(formData.payables) || 0,
                netFixedAssets: parseFloat(formData.netFixedAssets) || 0
            };

            const response = await Axios.put("/api/order/update", {
                orderId: currentOrderId,
                financedata: payload,
            }, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                },
            });

            if (response.data.status) {
                localStorage.setItem('financialFormData', JSON.stringify(formData));

                Swal.fire({
                    icon: "success",
                    title: "Saved",
                    text: "Financial information saved successfully.",
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    if (onSave) {
                        onSave();
                    } else {
                        router.push(`/dashboard/newOrder/forecast-info?orderId=${currentOrderId}`);
                    }
                });
            } else {
                throw new Error(response.data.message || "Failed to save financial data");
            }
        } catch (err) {
            console.error('Save error:', err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || err.message || "Unable to save financial data.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            const currentOrderId = getCurrentOrderId();
            if (currentOrderId) {
                router.push(`/dashboard/newOrder/company?orderId=${currentOrderId}`);
            } else {
                router.push('/dashboard/newOrder/company');
            }
        }
    };

    const clearFormData = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('financialFormData');
        }
        setFormData(getDefaultFinancialData());
    };

    const clearAllFormData = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('companyFormData');
            localStorage.removeItem('companyContactNumber');
            localStorage.removeItem('financialFormData');
            localStorage.removeItem('currentOrderId');
        }
    };

    // Calculate current net profit margin for display
    const currentNetProfitMargin = useMemo(() => {
        const sales = parseFloat(formData.sales) || 0;
        const netProfit = parseFloat(formData.netProfit) || 0;
        return sales > 0 ? calculateNetProfitMargin(sales, netProfit) : 0;
    }, [formData.sales, formData.netProfit]);

    // Check which charts should be displayed based on filled data
    const shouldShowSalesChart = formData.sales;
    const shouldShowCogsChart = formData.costOfSales;
    const shouldShowEbitdaChart = formData.ebitda;
    const shouldShowNetProfitChart = formData.netProfit;
    const shouldShowNetMarginChart = formData.netProfit && formData.sales;

    return (
        <div className='lg:ps-8 bg-gray-50 p-3 lg:pe-14 xl:pe-24 lg:pt-3'>
            <div className='flex flex-col justify-between gap-2 md:gap-0'>
                <div>
                    <span className='text-[22px] cxs:text-[28px] text-gray-700 font-bold font-sans'>New Order:</span>
                    <span className='text-[18px] cxs:text-[26px] text-gray-700 fw-medium font-sans'> Current Financial Information</span>
                    <p className='text-gray-700 text-sm text-medium'>
                        Ensure that all values are positive, limited to a maximum of two decimal places, and that the added values correspond to the previous financial year.
                    </p>
                </div>
                <div className="w-full flex justify-end text-[10px] cxs:text-sm">
                    <p className='text-themegreen'>(Fields marked with * can be negative)</p>
                </div>
            </div>

            <div className="flex lg:flex-row flex-col gap-4 lg:gap-8 cxs:py-4 lg:py-6 py-2 xl:py-8">
                {/* Form Section */}
                <div className="w-full lg:w-[33%] h-fit p-2 xs:p-4 bg-white rounded-md">
                    <div className="flex gap-3 flex-col max-h-[76vh] overflow-y-auto pe-4 custom-scrollbar">
                        <form className="space-y-5 text-sm">
                            {/* Value Unit */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    All values are in
                                </label>
                                <Select
                                    components={{ DropdownIndicator, IndicatorSeparator: () => null }}
                                    styles={selectStyles}
                                    options={[
                                        { value: "Thousands", label: "Thousands" },
                                        { value: "Millions", label: "Millions" },
                                        { value: "Billions", label: "Billions" },
                                        { value: "Trillions", label: "Trillions" },
                                    ]}
                                    value={formData.unitOfNumber ? { value: formData.unitOfNumber, label: formData.unitOfNumber } : null}
                                    onChange={(selected) => handleSelectChange('unitOfNumber', selected)}
                                    isDisabled={!editAllowed}
                                    placeholder="Select unit"
                                />
                            </div>

                            {/* Sales */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">Sales </label>
                                <input
                                    type="number"
                                    name="sales"
                                    value={formData.sales}
                                    onChange={handleChange}
                                    disabled={!editAllowed}
                                    placeholder="Enter Sales"
                                    step="0.01"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100"
                                />
                            </div>

                            {/* Cost of Sales */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Cost of Sales
                                </label>
                                <input
                                    type="number"
                                    name="costOfSales"
                                    value={formData.costOfSales}
                                    onChange={handleChange}
                                    disabled={!editAllowed}
                                    placeholder="Enter Cost of Sales"
                                    step="0.01"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100"
                                />
                            </div>

                            {/* EBITDA */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    EBITDA *
                                </label>
                                <input
                                    type="number"
                                    name="ebitda"
                                    value={formData.ebitda}
                                    onChange={handleChange}
                                    disabled={!editAllowed}
                                    placeholder="Enter EBITDA"
                                    step="0.01"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100"
                                />
                            </div>

                            {/* Depreciation */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Depreciation
                                </label>
                                <input
                                    type="number"
                                    name="depreciation"
                                    value={formData.depreciation}
                                    onChange={handleChange}
                                    disabled={!editAllowed}
                                    placeholder="Enter Depreciation"
                                    step="0.01"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100"
                                />
                            </div>

                            {/* Interest Expense */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Interest Expense
                                </label>
                                <input
                                    type="number"
                                    name="interestExpense"
                                    value={formData.interestExpense}
                                    onChange={handleChange}
                                    disabled={!editAllowed}
                                    placeholder="Enter Interest Expense"
                                    step="0.01"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100"
                                />
                            </div>

                            {/* Net Profit */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">Net Profit *</label>
                                <input
                                    type="number"
                                    name="netProfit"
                                    value={formData.netProfit}
                                    onChange={handleChange}
                                    disabled={!editAllowed}
                                    placeholder="Enter Net Profit"
                                    step="0.01"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100"
                                />
                            </div>

                            {/* Current Net Profit Margin Display */}
                            {/* {shouldShowNetMarginChart && (
                                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                    <label className="block text-xs font-medium text-green-700 mb-1">
                                        Current Net Profit Margin
                                    </label>
                                    <div className="text-lg font-semibold text-green-800">
                                        {currentNetProfitMargin.toFixed(2)}%
                                    </div>
                                    <p className="text-xs text-green-600 mt-1">
                                        Calculated automatically from Sales and Net Profit
                                    </p>
                                </div>
                            )} */}

                            {/* Rest of the form fields */}
                            {/* Cash Balance */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">Cash Balance </label>
                                <input
                                    type="number"
                                    name="cashBalance"
                                    value={formData.cashBalance}
                                    onChange={handleChange}
                                    disabled={!editAllowed}
                                    placeholder="Enter Cash Balance"
                                    step="0.01"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100"
                                />
                            </div>

                            {/* Debt Loan */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">Debt Loan </label>
                                <input
                                    type="number"
                                    name="debtLoan"
                                    value={formData.debtLoan}
                                    onChange={handleChange}
                                    disabled={!editAllowed}
                                    placeholder="Enter Debt Loan"
                                    step="0.01"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100"
                                />
                            </div>

                            {/* Equity */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">Equity </label>
                                <input
                                    type="number"
                                    name="equity"
                                    value={formData.equity}
                                    onChange={handleChange}
                                    disabled={!editAllowed}
                                    placeholder="Enter Equity"
                                    step="0.01"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100"
                                />
                            </div>

                            {/* Receivables */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">Receivables </label>
                                <input
                                    type="number"
                                    name="receivables"
                                    value={formData.receivables}
                                    onChange={handleChange}
                                    disabled={!editAllowed}
                                    placeholder="Enter Receivables"
                                    step="0.01"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100"
                                />
                            </div>

                            {/* Inventories */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">Inventories </label>
                                <input
                                    type="number"
                                    name="inventories"
                                    value={formData.inventories}
                                    onChange={handleChange}
                                    disabled={!editAllowed}
                                    placeholder="Enter Inventories"
                                    step="0.01"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100"
                                />
                            </div>

                            {/* Payables */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">Payables </label>
                                <input
                                    type="number"
                                    name="payables"
                                    value={formData.payables}
                                    onChange={handleChange}
                                    disabled={!editAllowed}
                                    placeholder="Enter Payables"
                                    step="0.01"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100"
                                />
                            </div>

                            {/* Net Fixed Assets */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">Net Fixed Assets </label>
                                <input
                                    type="number"
                                    name="netFixedAssets"
                                    value={formData.netFixedAssets}
                                    onChange={handleChange}
                                    disabled={!editAllowed}
                                    placeholder="Enter Net Fixed Assets"
                                    step="0.01"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none disabled:bg-gray-100"
                                />
                            </div>
                        </form>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex py-6 xl:py-10 px-2 sm:px-0 mt-2 md:mt-0 flex-col sm:flex-row justify-center gap-3'>
                        <button
                            onClick={handleBack}
                            className="bg-gray-400 text-center sm:w-[131px] hover:bg-gray-500 text-white py-2 text-sm rounded-md transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!editAllowed || isLoading}
                            className="bg-themegreen hover:bg-teal-600 text-white px-8 lg:px-[22px] py-2 text-sm rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Saving..." : " Continue"}
                        </button>
                    </div>
                </div>

                {/* Preview Section - Show Company Data */}
                <div className='flex-1'>
                    <div className='w-full'>
                        <div className="flex gap-3 flex-col cxs:grid cxs:grid-cols-3 cxs:gap-4 w-full">
                            {/* Company Name Preview */}
                            {companyData.companyName && (
                                <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4">
                                    <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen'></span>
                                    <p className='text-gray-400 text-xs mb-1 text-medium'>Company Name</p>
                                    <p className='text-gray-700 text-xs mb-1 text-medium'>{companyData.companyName}</p>
                                </div>
                            )}

                            {/* Company Type Preview */}
                            {companyData.companyType && (
                                <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4">
                                    <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen'></span>
                                    <p className='text-gray-400 text-xs mb-1 text-medium'>Company Type</p>
                                    <p className='text-gray-700 text-xs mb-1 text-medium'>{companyData.companyType}</p>
                                </div>
                            )}

                            {/* Industry Type Preview */}
                            {companyData.industryType && (
                                <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4">
                                    <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen'></span>
                                    <p className='text-gray-400 text-xs mb-1 text-medium'>Industry Type</p>
                                    <p className='text-gray-700 text-xs mb-1 text-medium'>{companyData.industryType}</p>
                                </div>
                            )}

                            {/* Country Preview with Map */}
                            {companyData.country && (
                                <div className="h-34 col-span-2 bg-white rounded-lg w-full relative p-3 flex gap-1 xs:gap-0 justify-between items-center">
                                    <div>
                                        <span className="inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen"></span>
                                        <p className="text-gray-400 text-xs font-medium mb-1">Country</p>
                                        <p className="text-gray-700 text-xs mb-1 text-medium">{getCountryName(companyData.country)}</p>
                                    </div>
                                    <div className="relative w-[80%] h-32">
                                        <GeoMapTwo height={128} selectedCountry={companyData.country} />
                                    </div>
                                </div>
                            )}

                            {/* Years in Business Preview */}
                            {companyData.yearsInBusiness && (
                                <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4">
                                    <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen'></span>
                                    <p className='text-gray-400 text-xs mb-1 text-medium'>Years in Business</p>
                                    <p className='text-gray-700 text-xs mb-1 text-medium'>{companyData.yearsInBusiness}</p>
                                </div>
                            )}
                        </div>


                        {/* Financial Charts - Only show when data is available */}
                        {(shouldShowSalesChart || shouldShowCogsChart || shouldShowEbitdaChart || shouldShowNetProfitChart || shouldShowNetMarginChart) && (
                            <div className=" py-2 sm:py-3 lg:py-6">
                                <div className="bg-white rounded-lg md:p-6 mb-6">
                                    {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">Financial Charts Preview</h3>
                                    <p className="text-gray-500 text-sm mb-4">
                                        Currently showing data for financial year {chartData[0]?.year}. Future year projections are based on standard growth rates.
                                    </p> */}

                                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                                        {shouldShowSalesChart && <SalesChart yearly={chartData} unit={chartUnit} />}
                                        {shouldShowCogsChart && <CogsChart yearly={chartData} unit={chartUnit} />}
                                        {shouldShowEbitdaChart && <EbitdaChart yearly={chartData} unit={chartUnit} />}
                                        {shouldShowNetProfitChart && <NetProfitChart yearly={chartData} unit={chartUnit} />}
                                        {shouldShowNetMarginChart && <NetMarginChart yearly={chartData} />}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialInfo;