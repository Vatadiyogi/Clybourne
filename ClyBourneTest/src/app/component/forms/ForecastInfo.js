"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Axios from '../../../utils/api';
import Swal from 'sweetalert2';
import { getCountryName } from "../../../utils/countryUtils";
import GeoMapTwo from "../charts/GeoMapTwo";
import SalesChart from "../charts/SalesChart";
import CogsChart from "../charts/CogsChart";
import EbitdaChart from "../charts/EbitdaChart";
import NetProfitChart from "../charts/NetProfitChart";
import NetMarginChart from "../charts/NetMarginChart";

// Import your calculation functions
import { CalculateGraphData, calculateNetProfitMargin, roundOffNumber } from './FinancialInfo';

const ForecastInfo = ({ orderId, initialData, onSave, onBack, editAllowed }) => {
    const router = useRouter();

    // Define default forecast data structure
    const getDefaultForecastData = () => ({
        forecastYears: 5,
        forecastData: [
            { year: 1, salesGrowth: "", cogsPercent: "", ebitdaMargin: "", depreciationRate: "", interestRate: "", netProfitMargin: "" },
            { year: 2, salesGrowth: "", cogsPercent: "", ebitdaMargin: "", depreciationRate: "", interestRate: "", netProfitMargin: "" },
            { year: 3, salesGrowth: "", cogsPercent: "", ebitdaMargin: "", depreciationRate: "", interestRate: "", netProfitMargin: "" },
            { year: 4, salesGrowth: "", cogsPercent: "", ebitdaMargin: "", depreciationRate: "", interestRate: "", netProfitMargin: "" },
            { year: 5, salesGrowth: "", cogsPercent: "", ebitdaMargin: "", depreciationRate: "", interestRate: "", netProfitMargin: "" }
        ]
    });

    const initializeFormData = () => {
        if (typeof window === 'undefined') return getDefaultForecastData();

        const savedData = localStorage.getItem('forecastFormData');
        return savedData ? JSON.parse(savedData) : getDefaultForecastData();
    };

    const [formData, setFormData] = useState(initializeFormData());
    const [companyData, setCompanyData] = useState({});
    const [financialData, setFinancialData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [chartUnit, setChartUnit] = useState(() => {
        if (typeof window === 'undefined') return 'Millions';

        // Try to get the calculated unit from localStorage first
        const savedCalculatedUnit = localStorage.getItem('calculatedChartUnit');
        if (savedCalculatedUnit) {
            return savedCalculatedUnit;
        }

        // Fallback to financial data unit or Millions
        return financialData.unitOfNumber || 'Millions';
    });
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

    // Load company and financial data from localStorage
    useEffect(() => {
        const savedCompanyData = localStorage.getItem('companyFormData');
        const savedFinancialData = localStorage.getItem('financialFormData');

        if (savedCompanyData) {
            try {
                setCompanyData(JSON.parse(savedCompanyData));
            } catch (error) {
                console.error('Error parsing company data:', error);
            }
        }

        if (savedFinancialData) {
            try {
                setFinancialData(JSON.parse(savedFinancialData));
            } catch (error) {
                console.error('Error parsing financial data:', error);
            }
        }
    }, []);

    // Load saved forecast data
    useEffect(() => {
        const savedData = localStorage.getItem('forecastFormData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        } else if (initialData?.calculations?.forecast_inc_stmt) {
            // If initial data is provided from API
            const forecastData = initialData.calculations.forecast_inc_stmt.map((item, index) => ({
                year: index + 1,
                salesGrowthRate: item.sales || "",
                cogsPercent: item.cogs || "",
                ebitdaMargin: item.ebitdaMargin || "",
                depreciationRate: item.depreciationRate || "",
                interestRate: item.interestRate || "",
                netProfitMargin: item.netProfitMargin || ""
            }));

            setFormData(prev => ({
                ...prev,
                forecastData
            }));
        }
    }, [initialData]);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('forecastFormData', JSON.stringify(formData));
    }, [formData]);

    // Generate dynamic years based on company financial year
    const forecastYears = useMemo(() => {
        const finYearEnd = companyData.yearEndYear ? parseInt(companyData.yearEndYear) : new Date().getFullYear();
        return Array.from({ length: 5 }, (_, index) => finYearEnd + index + 1);
    }, [companyData]);

    // Enhanced chart data generation that only shows data for years with user input
    const generateChartData = useMemo(() => {
        const finYearEnd = companyData.yearEndYear ? parseInt(companyData.yearEndYear) : new Date().getFullYear();

        // Helper function to format numbers to 2 decimal places
        const formatToTwoDecimals = (num) => {
            return Math.round((num + Number.EPSILON) * 100) / 100;
        };

        // Start with current year data from financial form (always show this)
        const baseData = [
            {
                year: `${finYearEnd}`,
                salesMain: financialData.sales ? formatToTwoDecimals(parseFloat(financialData.sales) || 0) : 0,
                salesExtra: 0,
                cogsMain: financialData.costOfSales ? formatToTwoDecimals(parseFloat(financialData.costOfSales) || 0) : 0,
                cogsExtra: 0,
                ebitda: financialData.ebitda ? formatToTwoDecimals(parseFloat(financialData.ebitda) || 0) : 0,
                netProfit: financialData.netProfit ? formatToTwoDecimals(parseFloat(financialData.netProfit) || 0) : 0,
                netMargin: financialData.sales && financialData.netProfit ?
                    formatToTwoDecimals(calculateNetProfitMargin(parseFloat(financialData.sales), parseFloat(financialData.netProfit))) : 0
            }
        ];

        // Check if user has entered any forecast data
        const hasForecastData = formData.forecastData.some(yearData =>
            Object.values(yearData).some(value => value && value !== "")
        );

        // If no forecast data entered, return only current year data
        if (!hasForecastData) {
            return baseData;
        }

        // Calculate forecast years - only for years where user has entered data
        let currentSales = baseData[0].salesMain;
        let currentCogs = baseData[0].cogsMain;
        let currentEbitda = baseData[0].ebitda;
        let currentNetProfit = baseData[0].netProfit;

        forecastYears.forEach((year, index) => {
            const forecast = formData.forecastData[index] || {};

            // Check if user has entered any data for this specific year
            const hasYearData = Object.values(forecast).some(value => value && value !== "");

            // If no data entered for this year, skip it entirely
            if (!hasYearData) {
                baseData.push({
                    year: `${year}`,
                    salesMain: 0,
                    salesExtra: 0,
                    cogsMain: 0,
                    cogsExtra: 0,
                    ebitda: 0,
                    netProfit: 0,
                    netMargin: 0
                });
                return;
            }

            // Initialize values for this year
            let yearSales = 0;
            let yearCogs = 0;
            let yearEbitda = 0;
            let yearNetProfit = 0;
            let yearNetMargin = 0;

            // Calculate sales growth for this specific year only if provided
            if (forecast.salesGrowth !== "" && !isNaN(parseFloat(forecast.salesGrowth))) {
                const growthRate = parseFloat(forecast.salesGrowth);
                yearSales = formatToTwoDecimals(CalculateGraphData(currentSales, growthRate));
                currentSales = yearSales; // Update for next iteration
            } else {
                yearSales = currentSales; // Carry forward if no sales growth entered
            }

            // Calculate COGS for this specific year only if provided
            if (forecast.cogsPercent !== "" && !isNaN(parseFloat(forecast.cogsPercent))) {
                const cogsPercent = parseFloat(forecast.cogsPercent);
                yearCogs = formatToTwoDecimals(yearSales * (cogsPercent / 100));
                currentCogs = yearCogs;
            } else {
                // If no COGS percentage provided, calculate based on current ratio
                const cogsRatio = currentCogs / currentSales || 0;
                yearCogs = formatToTwoDecimals(yearSales * cogsRatio);
            }

            // Calculate EBITDA for this specific year only if provided
            if (forecast.ebitdaMargin !== "" && !isNaN(parseFloat(forecast.ebitdaMargin))) {
                const margin = parseFloat(forecast.ebitdaMargin);
                yearEbitda = formatToTwoDecimals(yearSales * (margin / 100));
                currentEbitda = yearEbitda;
            } else {
                // If no EBITDA margin provided, calculate based on current ratio
                const ebitdaRatio = currentEbitda / currentSales || 0;
                yearEbitda = formatToTwoDecimals(yearSales * ebitdaRatio);
            }

            // Calculate Net Profit for this specific year only if provided
            if (forecast.netProfitMargin !== "" && !isNaN(parseFloat(forecast.netProfitMargin))) {
                const margin = parseFloat(forecast.netProfitMargin);
                yearNetProfit = formatToTwoDecimals(yearSales * (margin / 100));
                yearNetMargin = formatToTwoDecimals(margin);
                currentNetProfit = yearNetProfit;
            } else {
                // If no net profit margin provided, calculate based on current ratio
                const netProfitRatio = currentNetProfit / currentSales || 0;
                yearNetProfit = formatToTwoDecimals(yearSales * netProfitRatio);
                yearNetMargin = financialData.sales ?
                    formatToTwoDecimals(calculateNetProfitMargin(yearSales, yearNetProfit)) : 0;
            }

            // Add the calculated data for this specific year
            baseData.push({
                year: `${year}`,
                salesMain: yearSales,
                salesExtra: formatToTwoDecimals(yearSales * 0.95), // 5% variation for visual effect
                cogsMain: yearCogs,
                cogsExtra: formatToTwoDecimals(yearCogs * 0.95),
                ebitda: yearEbitda,
                netProfit: yearNetProfit,
                netMargin: yearNetMargin
            });
        });

        // Apply rounding based on the unit of number from financial data
        const salesData = baseData.map(item => item.salesMain);
        const cogsData = baseData.map(item => item.cogsMain);
        const ebitdaData = baseData.map(item => item.ebitda);
        const netProfitData = baseData.map(item => item.netProfit);

        const roundedSales = roundOffNumber(salesData, { valueType: [financialData.unitOfNumber || 'Millions'] });
        const roundedCogs = roundOffNumber(cogsData, { valueType: [financialData.unitOfNumber || 'Millions'] });
        const roundedEbitda = roundOffNumber(ebitdaData, { valueType: [financialData.unitOfNumber || 'Millions'] });
        const roundedNetProfit = roundOffNumber(netProfitData, { valueType: [financialData.unitOfNumber || 'Millions'] });

        // Update baseData with rounded values and ensure 2 decimal places
        const finalData = baseData.map((item, index) => ({
            ...item,
            salesMain: formatToTwoDecimals(roundedSales.roundedNumbers[index]),
            salesExtra: formatToTwoDecimals(roundedSales.roundedNumbers[index] * 0.95),
            cogsMain: formatToTwoDecimals(roundedCogs.roundedNumbers[index]),
            cogsExtra: formatToTwoDecimals(roundedCogs.roundedNumbers[index] * 0.95),
            ebitda: formatToTwoDecimals(roundedEbitda.roundedNumbers[index]),
            netProfit: formatToTwoDecimals(roundedNetProfit.roundedNumbers[index]),
            // netMargin remains as percentage, format to 2 decimal places
            netMargin: formatToTwoDecimals(item.netMargin)
        }));

        return finalData;
    }, [formData, financialData, companyData, forecastYears]);

    // Update chart data when dependencies change
    useEffect(() => {
        setChartData(generateChartData);
    }, [generateChartData]);

    // Function to get field display name
    const getFieldDisplayName = (field) => {
        const fieldNames = {
            "salesGrowth": "Sales Growth Rate",
            "cogsPercent": "COGS Percentage",
            "ebitdaMargin": "EBITDA Margin",
            "depreciationRate": "Depreciation Rate",
            "interestRate": "Interest Rate",
            "netProfitMargin": "Net Profit Margin"
        };
        return fieldNames[field] || field;
    };

    // Handle forecast input changes with validation
    const handleForecastChange = (yearIndex, field, value) => {
        // Validate numeric input
        const isNumeric = (val) => /^-?\d*\.?\d*$/.test(val);

        if (!isNumeric(value) && value !== "") {
            return;
        }

        // Check for negative values in fields that cannot be negative
        const cannotBeNegativeFields = ["cogsPercent", "interestRate", "depreciationRate"];

        if (cannotBeNegativeFields.includes(field)) {
            const numValue = parseFloat(value);
            if (value !== "" && numValue < 0) {
                // Show SweetAlert2 warning
                Swal.fire({
                    icon: 'warning',
                    title: 'Invalid Input',
                    text: `${getFieldDisplayName(field)} cannot be negative`,
                    timer: 2000,
                    showConfirmButton: false,
                    position: 'top-end',
                    toast: true
                });
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            forecastData: prev.forecastData.map((item, index) =>
                index === yearIndex ? { ...item, [field]: value } : item
            )
        }));
    };

    // Validate form before submission
    const validateForm = () => {
        // Check if at least some forecast data is entered
        const hasData = formData.forecastData.some(yearData =>
            Object.values(yearData).some(value => value && value !== "")
        );

        if (!hasData) {
            return {
                valid: false,
                field: "at least one forecast field",
                errorType: "empty"
            };
        }

        // Validate all entered values
        for (let [yearIndex, yearData] of formData.forecastData.entries()) {
            for (let [field, value] of Object.entries(yearData)) {
                if (value && value !== "") {
                    const numValue = parseFloat(value);

                    if (isNaN(numValue)) {
                        return {
                            valid: false,
                            field: `${getFieldDisplayName(field)} for Year ${yearIndex + 1}`,
                            errorType: "invalid",
                            message: `Please enter a valid number for ${getFieldDisplayName(field)} in Year ${yearIndex + 1}`
                        };
                    }

                    // Check for negative values in fields that cannot be negative
                    const cannotBeNegativeFields = ["cogsPercent", "interestRate", "depreciationRate"];
                    if (cannotBeNegativeFields.includes(field) && numValue < 0) {
                        return {
                            valid: false,
                            field: `${getFieldDisplayName(field)} for Year ${yearIndex + 1}`,
                            errorType: "negative",
                            message: `${getFieldDisplayName(field)} cannot be negative for Year ${yearIndex + 1}`
                        };
                    }

                    // Validate percentage ranges
                    if (['salesGrowth', 'cogsPercent', 'ebitdaMargin', 'netProfitMargin', 'interestRate', 'depreciationRate'].includes(field)) {
                        if (field === 'cogsPercent') {
                            // COGS percentage should be between 0 and 100 (or up to 1000 for extreme cases)
                            if (numValue < 0 || numValue > 1000) {
                                return {
                                    valid: false,
                                    field: `${getFieldDisplayName(field)} for Year ${yearIndex + 1}`,
                                    errorType: "range",
                                    message: `${getFieldDisplayName(field)} must be between 0% and 1000% for Year ${yearIndex + 1}`
                                };
                            }
                        } else if (field === 'interestRate' || field === 'depreciationRate') {
                            // Interest and depreciation rates should be non-negative
                            if (numValue < 0 || numValue > 1000) {
                                return {
                                    valid: false,
                                    field: `${getFieldDisplayName(field)} for Year ${yearIndex + 1}`,
                                    errorType: "range",
                                    message: `${getFieldDisplayName(field)} must be between 0% and 1000% for Year ${yearIndex + 1}`
                                };
                            }
                        } else {
                            // Other percentages can be negative or positive within reasonable bounds
                            if (numValue < -100 || numValue > 1000) {
                                return {
                                    valid: false,
                                    field: `${getFieldDisplayName(field)} for Year ${yearIndex + 1}`,
                                    errorType: "range",
                                    message: `${getFieldDisplayName(field)} must be between -100% and 1000% for Year ${yearIndex + 1}`
                                };
                            }
                        }
                    }
                }
            }
        }

        return { valid: true };
    };

    // Handle form submission
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
                text: "Cannot save forecast data without a valid order. Please start over.",
            }).then(() => {
                clearAllFormData();
                router.push('/dashboard/newOrder');
            });
            return;
        }

        // Validate form
        const check = validateForm();
        if (!check.valid) {
            let errorMessage = check.message || `Please enter a valid ${check.field}`;

            Swal.fire({
                icon: "error",
                title: "Validation Error",
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

            // Prepare payload according to your backend expectations
            const forecast_inc_stmt_data = formData.forecastData.map(item => ({
                sales: parseFloat(item.salesGrowth) || 0,
                cogs: parseFloat(item.cogsPercent) || 0,
                ebitdaMargin: parseFloat(item.ebitdaMargin) || 0,
                depreciationRate: parseFloat(item.depreciationRate) || 0,
                interestRate: parseFloat(item.interestRate) || 0,
                netProfitMargin: parseFloat(item.netProfitMargin) || 0
            }));
            console.log("forecast_inc_stmt_dataforecast_inc_stmt_data:", forecast_inc_stmt_data)
            const response = await Axios.put("/api/order/update", {
                orderId: currentOrderId,
                forecast_inc_stmt_data,
            }, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                },
            });

            if (response.data.status) {
                localStorage.setItem('forecastFormData', JSON.stringify(formData));

                Swal.fire({
                    icon: "success",
                    title: "Saved",
                    text: "Financial projections saved successfully.",
                }).then(() => {
                    if (onSave) {
                        onSave();
                    } else {
                        router.push(`/dashboard/newOrder/balance?orderId=${currentOrderId}`);
                    }
                });
            } else {
                throw new Error(response.data.message || "Failed to save forecast data");
            }
        } catch (err) {
            console.error('Save error:', err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || err.message || "Unable to save forecast data.",
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
                router.push(`/dashboard/newOrder/financial-info?orderId=${currentOrderId}`);
            } else {
                router.push('/dashboard/newOrder/financial-info');
            }
        }
    };

    const clearFormData = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('forecastFormData');
        }
        setFormData(getDefaultForecastData());
    };

    const clearAllFormData = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('companyFormData');
            localStorage.removeItem('companyContactNumber');
            localStorage.removeItem('financialFormData');
            localStorage.removeItem('forecastFormData');
            localStorage.removeItem('currentOrderId');
        }
    };

    // Check which charts should be displayed
    const shouldShowSalesChart = chartData.some(item => item.salesMain > 0);
    const shouldShowCogsChart = chartData.some(item => item.cogsMain > 0);
    const shouldShowEbitdaChart = chartData.some(item => item.ebitda > 0);
    const shouldShowNetProfitChart = chartData.some(item => item.netProfit > 0);
    const shouldShowNetMarginChart = chartData.some(item => item.netMargin > 0);

    return (
        <div className='lg:ps-8 bg-gray-50 p-3 lg:pe-14 xl:pe-24 lg:pt-3'>
            <div className='flex flex-col justify-between gap-2 md:gap-0'>
                <div>
                    <span className='text-[22px] cxs:text-[28px] text-gray-700 font-bold font-sans'>New Order:</span>
                    <span className='text-[18px] cxs:text-[26px] text-gray-700 fw-medium font-sans'> Financial Projections</span>
                    <p className='text-gray-700 text-sm text-medium'>Income Statement Assumptions</p>
                </div>
                <div className="w-full flex justify-end text-[10px] cxs:text-sm">
                    <p className='text-themegreen'>(COGS, Interest Rate, and Depreciation Rate cannot be negative)</p>
                </div>
            </div>

            <div className="flex lg:flex-row flex-col gap-4 lg:gap-8 cxs:py-4 lg:py-6 py-2 xl:py-8">
                {/* Form Section */}
                <div className="flex flex-col w-full lg:w-[35%] h-fit p-2 cxs:p-4 bg-white rounded-md">
                    <div className="flex gap-4 flex-col h-[76vh] text-sm lg:pe-2 xl:pe-0 pe-4 overflow-y-auto custom-scrollbar">

                        {/* Forecasted Sales Growth Rate */}
                        <div className="">
                            <p className="text-xs text-gray-700 mb-2">Forecasted Sales Growth Rate (Y-o-Y) %</p>
                            <div className="flex flex-wrap gap-1 xs:gap-2">
                                {forecastYears.map((year, index) => (
                                    <div key={index} className="flex flex-col items-center justify-start">
                                        <p className="text-center text-xs text-gray-300">{year}</p>
                                        <input
                                            type="number"
                                            value={formData.forecastData[index]?.salesGrowth || ""}
                                            onChange={(e) => handleForecastChange(index, 'salesGrowth', e.target.value)}
                                            disabled={!editAllowed}
                                            placeholder="0.0"
                                            step="0.1"
                                            className="px-[6px] py-[4px] lg:px-0 xs:px-4 xs:py-2 cxs:px-6 cxs:py-2 lg:py-1 xl:px-[0px] text-xs rounded-md xl:py-2 border-2 border-gray-300 focus:border-themegreen focus:outline-none disabled:bg-gray-100 xl:w-14 w-12 text-center"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Forecasted COGS */}
                        <div className="">
                            <p className="mb-2 text-xs text-gray-700">Forecasted COGS (as % of Revenue)</p>
                            <div className="flex flex-wrap gap-1 xs:gap-2">
                                {forecastYears.map((year, index) => (
                                    <div key={index} className="flex flex-col items-center justify-start">
                                        <p className="text-center text-xs text-gray-300">{year}</p>
                                        <input
                                            type="number"
                                            value={formData.forecastData[index]?.cogsPercent || ""}
                                            onChange={(e) => handleForecastChange(index, 'cogsPercent', e.target.value)}
                                            disabled={!editAllowed}
                                            placeholder="0.0"
                                            step="0.1"
                                            min="0"
                                            className="px-[6px] py-[4px]  lg:px-0 xs:px-4 xs:py-2 cxs:px-6 cxs:py-2 lg:py-1 xl:px-[0px] text-xs rounded-md xl:py-2 border-2 border-gray-300 focus:border-themegreen focus:outline-none disabled:bg-gray-100 xl:w-14 w-12 text-center"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Forecasted EBITDA Margin */}
                        <div className="">
                            <p className="text-xs text-gray-700 mb-2">Forecasted EBITDA Margin %</p>
                            <div className="flex flex-wrap gap-1 xs:gap-2">
                                {forecastYears.map((year, index) => (
                                    <div key={index} className="flex flex-col items-center justify-start">
                                        <p className="text-center text-xs text-gray-300">{year}</p>
                                        <input
                                            type="number"
                                            value={formData.forecastData[index]?.ebitdaMargin || ""}
                                            onChange={(e) => handleForecastChange(index, 'ebitdaMargin', e.target.value)}
                                            disabled={!editAllowed}
                                            placeholder="0.0"
                                            step="0.1"
                                            className="px-[6px] py-[4px] lg:px-0 xs:px-4 xs:py-2 cxs:px-6 cxs:py-2 lg:py-1 xl:px-[0px] text-xs rounded-md xl:py-2 border-2 border-gray-300 focus:border-themegreen focus:outline-none disabled:bg-gray-100 xl:w-14 w-12 text-center"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interest Rate */}
                        <div className="">
                            <p className="mb-2 text-xs text-gray-700">Interest Rate %</p>
                            <div className="flex flex-wrap gap-1 xs:gap-2">
                                {forecastYears.map((year, index) => (
                                    <div key={index} className="flex flex-col items-center justify-start">
                                        <p className="text-center text-xs text-gray-300">{year}</p>
                                        <input
                                            type="number"
                                            value={formData.forecastData[index]?.interestRate || ""}
                                            onChange={(e) => handleForecastChange(index, 'interestRate', e.target.value)}
                                            disabled={!editAllowed}
                                            placeholder="0.0"
                                            step="0.1"
                                            min="0"
                                            className="px-[6px] py-[4px] lg:px-0 xs:px-4 xs:py-2 cxs:px-6 cxs:py-2 lg:py-1 xl:px-[0px] text-xs rounded-md xl:py-2 border-2 border-gray-300 focus:border-themegreen focus:outline-none disabled:bg-gray-100 xl:w-14 w-12 text-center"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Depreciation Rate */}
                        <div className="">
                            <p className="text-xs text-gray-700 mb-2">Depreciation Rate %</p>
                            <div className="flex flex-wrap gap-1 xs:gap-2">
                                {forecastYears.map((year, index) => (
                                    <div key={index} className="flex flex-col items-center justify-start">
                                        <p className="text-center text-xs text-gray-300">{year}</p>
                                        <input
                                            type="number"
                                            value={formData.forecastData[index]?.depreciationRate || ""}
                                            onChange={(e) => handleForecastChange(index, 'depreciationRate', e.target.value)}
                                            disabled={!editAllowed}
                                            placeholder="0.0"
                                            step="0.1"
                                            min="0"
                                            className="px-[6px] py-[4px] lg:px-0 xs:px-4 xs:py-2 cxs:px-6 cxs:py-2 lg:py-1 xl:px-[0px] text-xs rounded-md xl:py-2 border-2 border-gray-300 focus:border-themegreen focus:outline-none disabled:bg-gray-100 xl:w-14 w-12 text-center"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Forecasted Net Profit Margin */}
                        <div className="">
                            <p className="mb-2 text-xs text-gray-700">Forecasted Net Profit Margin %</p>
                            <div className="flex flex-wrap gap-1 xs:gap-2">
                                {forecastYears.map((year, index) => (
                                    <div key={index} className="flex flex-col items-center justify-start">
                                        <p className="text-center text-xs text-gray-300">{year}</p>
                                        <input
                                            type="number"
                                            value={formData.forecastData[index]?.netProfitMargin || ""}
                                            onChange={(e) => handleForecastChange(index, 'netProfitMargin', e.target.value)}
                                            disabled={!editAllowed}
                                            placeholder="0.0"
                                            step="0.1"
                                            className="px-[6px] py-[4px] lg:px-0 xs:px-4 xs:py-2 cxs:px-6 cxs:py-2 lg:py-1 xl:px-[0px] text-xs rounded-md xl:py-2 border-2 border-gray-300 focus:border-themegreen focus:outline-none disabled:bg-gray-100 xl:w-14 w-12 text-center"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
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
                            {isLoading ? "Saving..." : "Continue"}
                        </button>
                    </div>
                </div>

                {/* Preview Section */}
                <div className='flex-1'>
                    <div className='w-full'>
                        {/* Company Data Preview */}
                        <div className="flex gap-3 flex-col cxs:grid cxs:grid-cols-3 cxs:gap-4 w-full">
                            {companyData.companyName && (
                                <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4">
                                    <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen'></span>
                                    <p className='text-gray-400 text-xs mb-1 text-medium'>Company Name</p>
                                    <p className='text-gray-700 text-xs mb-1 text-medium'>{companyData.companyName}</p>
                                </div>
                            )}

                            {companyData.companyType && (
                                <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4">
                                    <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen'></span>
                                    <p className='text-gray-400 text-xs mb-1 text-medium'>Company Type</p>
                                    <p className='text-gray-700 text-xs mb-1 text-medium'>{companyData.companyType}</p>
                                </div>
                            )}

                            {companyData.industryType && (
                                <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4">
                                    <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen'></span>
                                    <p className='text-gray-400 text-xs mb-1 text-medium'>Industry Type</p>
                                    <p className='text-gray-700 text-xs mb-1 text-medium'>{companyData.industryType}</p>
                                </div>
                            )}

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

                            {companyData.yearsInBusiness && (
                                <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4">
                                    <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen'></span>
                                    <p className='text-gray-400 text-xs mb-1 text-medium'>Years in Business</p>
                                    <p className='text-gray-700 text-xs mb-1 text-medium'>{companyData.yearsInBusiness}</p>
                                </div>
                            )}
                        </div>

                        {/* Financial Charts */}
                        {(shouldShowSalesChart || shouldShowCogsChart || shouldShowEbitdaChart || shouldShowNetProfitChart || shouldShowNetMarginChart) && (
                            <div className="py-2 md:py-6">
                                <div className="bg-white rounded-lg ">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Financial Projections</h3>

                                    {chartData.length <= 1 ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 text-sm mb-4">
                                                No forecast data entered yet. Enter values in the form to see projections.
                                            </p>
                                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 opacity-40">
                                                {/* Placeholder charts */}
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-64 flex items-center justify-center">
                                                    <p className="text-gray-400">Sales Chart</p>
                                                </div>
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-64 flex items-center justify-center">
                                                    <p className="text-gray-400">COGS Chart</p>
                                                </div>
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-64 flex items-center justify-center">
                                                    <p className="text-gray-400">EBITDA Chart</p>
                                                </div>
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-64 flex items-center justify-center">
                                                    <p className="text-gray-400">Net Profit Chart</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-gray-500 text-sm mb-4">
                                                Showing projections based on your forecast inputs. All values in {companyData.currency || 'NA'}.
                                            </p>
                                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                                                {shouldShowSalesChart && <SalesChart yearly={chartData} unit={chartUnit} />}
                                                {shouldShowCogsChart && <CogsChart yearly={chartData} unit={chartUnit} />}
                                                {shouldShowEbitdaChart && <EbitdaChart yearly={chartData} unit={chartUnit} />}
                                                {shouldShowNetProfitChart && <NetProfitChart yearly={chartData} unit={chartUnit} />}
                                                {shouldShowNetMarginChart && <NetMarginChart yearly={chartData} />}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ForecastInfo;