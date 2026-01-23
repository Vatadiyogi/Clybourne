"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
// import Axios from '../../../utils/api';
import { getCountryName } from "../../../utils/countryUtils";
import Swal from 'sweetalert2';
import GeoMapTwo from "../charts/GeoMapTwo";
import SalesChart from "../charts/SalesChart";
import CogsChart from "../charts/CogsChart";
import EbitdaChart from "../charts/EbitdaChart";
import NetProfitChart from "../charts/NetProfitChart";
import NetMarginChart from "../charts/NetMarginChart";
import { Slider } from '@mui/material';
import Axios from "../../../utils/api"
// Import your calculation functions
import { CalculateGraphData, calculateNetProfitMargin, roundOffNumber } from './FinancialInfo';

const BalanceSheet = ({ orderId, initialData, onSave, onBack, editAllowed }) => {
    const router = useRouter();

    // Define default balance sheet data structure
    const getDefaultBalanceSheetData = () => ({
        forecastData: [
            { year: 1, capex: "", debt: "" },
            { year: 2, capex: "", debt: "" },
            { year: 3, capex: "", debt: "" },
            { year: 4, capex: "", debt: "" },
            { year: 5, capex: "", debt: "" }
        ],
        receivableDays: "",
        inventoryDays: " ",
        payableDays: " "
    });

    const initializeFormData = () => {
        if (typeof window === 'undefined') return getDefaultBalanceSheetData();

        const savedData = localStorage.getItem('balanceSheetFormData');
        return savedData ? JSON.parse(savedData) : getDefaultBalanceSheetData();
    };

    const [formData, setFormData] = useState(initializeFormData());
    const [companyData, setCompanyData] = useState({});
    const [financialData, setFinancialData] = useState({});
    const [forecastData, setForecastData] = useState({});
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

    // Load company, financial, and forecast data from localStorage
    useEffect(() => {
        const savedCompanyData = localStorage.getItem('companyFormData');
        const savedFinancialData = localStorage.getItem('financialFormData');
        const savedForecastData = localStorage.getItem('forecastFormData');

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

        if (savedForecastData) {
            try {
                setForecastData(JSON.parse(savedForecastData));
            } catch (error) {
                console.error('Error parsing forecast data:', error);
            }
        }
    }, []);

    // Load saved balance sheet data
    useEffect(() => {
        const savedData = localStorage.getItem('balanceSheetFormData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        } else if (initialData?.calculations?.balance_sheet) {
            // If initial data is provided from API
            const balanceSheetData = initialData.calculations.balance_sheet.map((item, index) => ({
                year: index + 1,
                capex: item.capex || "",
                debt: item.debt || ""
            }));

            setFormData(prev => ({
                ...prev,
                forecastData: balanceSheetData,
                receivableDays: initialData.calculations.receivableDays || 30,
                inventoryDays: initialData.calculations.inventoryDays || 45,
                payableDays: initialData.calculations.payableDays || 30
            }));
        }
    }, [initialData]);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('balanceSheetFormData', JSON.stringify(formData));
    }, [formData]);

    // Generate dynamic years based on company financial year
    const forecastYears = useMemo(() => {
        const finYearEnd = companyData.yearEndYear ? parseInt(companyData.yearEndYear) : new Date().getFullYear();
        return Array.from({ length: 5 }, (_, index) => finYearEnd + index + 1);
    }, [companyData]);

    // Enhanced chart data generation with proper calculations and 2 decimal formatting
    const generateChartData = useMemo(() => {
        const finYearEnd = companyData.yearEndYear ? parseInt(companyData.yearEndYear) : new Date().getFullYear();

        // Helper function to format numbers to 2 decimal places
        const formatToTwoDecimals = (num) => {
            return Math.round((num + Number.EPSILON) * 100) / 100;
        };

        // Start with current year data from financial form
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

        // Calculate forecast years with proper cumulative growth
        let currentSales = baseData[0].salesMain;
        let currentCogs = baseData[0].cogsMain;
        let currentEbitda = baseData[0].ebitda;
        let currentNetProfit = baseData[0].netProfit;

        forecastYears.forEach((year, index) => {
            const forecast = forecastData.forecastData?.[index] || {};

            // Calculate sales using CalculateGraphData function for consistent growth calculation
            if (forecast.salesGrowth) {
                const growthRate = parseFloat(forecast.salesGrowth) || 0;
                currentSales = formatToTwoDecimals(CalculateGraphData(currentSales, growthRate));
            }

            // Calculate COGS based on percentage of sales
            let cogsMain = 0;
            if (forecast.cogsPercent) {
                const cogsPercent = parseFloat(forecast.cogsPercent) || 0;
                cogsMain = formatToTwoDecimals(currentSales * (cogsPercent / 100));
                currentCogs = cogsMain;
            }

            // Calculate EBITDA based on margin
            let ebitda = 0;
            if (forecast.ebitdaMargin) {
                const margin = parseFloat(forecast.ebitdaMargin) || 0;
                ebitda = formatToTwoDecimals(currentSales * (margin / 100));
                currentEbitda = ebitda;
            }

            // Calculate Net Profit based on margin
            let netProfit = 0;
            let netMargin = 0;
            if (forecast.netProfitMargin) {
                const margin = parseFloat(forecast.netProfitMargin) || 0;
                netProfit = formatToTwoDecimals(currentSales * (margin / 100));
                netMargin = formatToTwoDecimals(margin);
                currentNetProfit = netProfit;
            }

            baseData.push({
                year: `${year}`,
                salesMain: currentSales,
                salesExtra: formatToTwoDecimals(currentSales * 0.95), // 5% variation for visual effect
                cogsMain: currentCogs,
                cogsExtra: formatToTwoDecimals(currentCogs * 0.95),
                ebitda: currentEbitda,
                netProfit: currentNetProfit,
                netMargin: netMargin
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
    }, [forecastData, financialData, companyData, forecastYears]);

    // Update chart data when dependencies change
    useEffect(() => {
        setChartData(generateChartData);
    }, [generateChartData]);

    const handleForecastChange = (yearIndex, field, value) => {
        // Validate numeric input
        const isNumeric = (val) => /^-?\d*\.?\d*$/.test(val);

        if (!isNumeric(value)) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            forecastData: prev.forecastData.map((item, index) =>
                index === yearIndex ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleSliderChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const validateForm = () => {
        // Validate that at least some balance sheet data is entered
        const hasData = formData.forecastData.some(yearData =>
            yearData.capex !== "" || yearData.debt !== ""
        );

        if (!hasData && formData.receivableDays === 30 && formData.inventoryDays === 45 && formData.payableDays === 30) {
            return { valid: false, field: "at least one balance sheet field or adjust working capital days" };
        }

        // Validate numeric values
        for (let yearData of formData.forecastData) {
            for (let [field, value] of Object.entries(yearData)) {
                if (value && value !== "") {
                    const numValue = parseFloat(value);
                    if (isNaN(numValue)) {
                        return { valid: false, field: `valid number in ${field}` };
                    }
                }
            }
        }

        return { valid: true };
    };
    const handlePreview = () => {
        const check = validateForm();

        if (!check.valid) {
            Swal.fire({
                icon: "error",
                title: "Missing Required Field",
                text: `Please fill ${check.field} before continuing.`,
            });
            return;
        }

        // Save current data and navigate to preview
        const currentOrderId = getCurrentOrderId();
        if (currentOrderId) {
            router.push(`/dashboard/newOrder/preview?orderId=${currentOrderId}`);
        } else {
            router.push('/dashboard/newOrder/preview');
        }
    };
    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            const currentOrderId = getCurrentOrderId();
            if (currentOrderId) {
                router.push(`/dashboard/newOrder/forecast-info?orderId=${currentOrderId}`);
            } else {
                router.push('/dashboard/newOrder/forecast-info');
            }
        }
    };

    const clearFormData = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('balanceSheetFormData');
        }
        setFormData(getDefaultBalanceSheetData());
    };

    const clearAllFormData = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('companyFormData');
            localStorage.removeItem('companyContactNumber');
            localStorage.removeItem('financialFormData');
            localStorage.removeItem('forecastFormData');
            localStorage.removeItem('balanceSheetFormData');
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
                    <p className='text-gray-700 text-sm text-medium'>Balance Sheet Assumptions</p>
                </div>
                <div className="w-full flex justify-end text-[10px] cxs:text-sm">
                    <p className='text-themegreen'>(Fields marked with * can be negative)</p>
                </div>
            </div>

            <div className="flex lg:flex-row flex-col gap-4 lg:gap-8 cxs:py-4 lg:py-6 py-2 xl:py-8">
                {/* Form Section */}
                <div className="flex flex-col w-full lg:w-[35%] h-fit p-2 cxs:p-4 bg-white rounded-md">
                    <div className="flex gap-4 pe-4 flex-col h-[76vh] overflow-y-auto custom-scrollbar">

                        {/* Forecasted Net Addition in CAPEX/Fixed Assets */}
                        <div className="">
                            <p className="text-xs text-gray-700 mb-2">Forecasted Net Addition in CAPEX/Fixed Assets*</p>
                            <div className="flex flex-wrap gap-1 xs:gap-2">
                                {forecastYears.map((year, index) => (
                                    <div key={index} className="flex flex-col items-center justify-start">
                                        <p className="text-center text-xs text-gray-300">{year}</p>
                                        <input
                                            type="number"
                                            value={formData.forecastData[index]?.capex || ""}
                                            onChange={(e) => handleForecastChange(index, 'capex', e.target.value)}
                                            disabled={!editAllowed}
                                            placeholder="0.0"
                                            step="0.01"
                                            className="px-[6px] py-[4px] lg:px-0 xs:px-4 xs:py-2 cxs:px-6 cxs:py-2 lg:py-1 xl:px-[0px] text-xs rounded-md xl:py-2 border-2 border-gray-300 focus:border-themegreen focus:outline-none disabled:bg-gray-100 xl:w-14 w-12 text-center"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Forecasted Debt/Loan */}
                        <div className="">
                            <p className="mb-2 text-xs text-gray-700">Forecasted Net Addition in Debt/Loan*</p>
                            <div className="flex flex-wrap gap-1 xs:gap-2">
                                {forecastYears.map((year, index) => (
                                    <div key={index} className="flex flex-col items-center justify-start">
                                        <p className="text-center text-xs text-gray-300">{year}</p>
                                        <input
                                            type="number"
                                            value={formData.forecastData[index]?.debt || ""}
                                            onChange={(e) => handleForecastChange(index, 'debt', e.target.value)}
                                            disabled={!editAllowed}
                                            placeholder="0.0"
                                            step="0.01"
                                            className="px-[6px] py-[4px] lg:px-0 xs:px-4 xs:py-2 cxs:px-6 cxs:py-2 lg:py-1 xl:px-[0px] text-xs rounded-md xl:py-2 border-2 border-gray-300 focus:border-themegreen focus:outline-none disabled:bg-gray-100 xl:w-14 w-12 text-center"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full flex pe-4 justify-end text-xs">
                            <p className='text-gray-300'>Values in {financialData.unitOfNumber || 'Millions'}</p>
                        </div>

                        {/* Working Capital Assumptions */}
                        <div className='flex flex-col gap-6 pt-4 px-3'>
                            {/* Receivable Days */}
                            <div className=''>
                                <p className='text-themeblue text-sm font-bold mb-2'>Receivable Days</p>
                                <div className='flex items-center gap-3'>
                                    <Slider
                                        className='!p-0'
                                        value={formData.receivableDays}
                                        onChange={(e, newValue) => handleSliderChange('receivableDays', newValue)}
                                        disabled={!editAllowed}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={365}
                                        step={1}
                                        sx={{
                                            color: "#1e40af",
                                            height: 10,
                                            "& .MuiSlider-thumb": {
                                                height: 18,
                                                width: 18,
                                                backgroundColor: "#1e40af",
                                                border: "3px solid #5BC8FF",
                                                "&:hover": {
                                                    boxShadow: "0 0 0 8px rgba(30,64,175,0.16)",
                                                },
                                            },
                                            "& .MuiSlider-rail": {
                                                color: "#5BC8FF",
                                                opacity: 1,
                                            },
                                            "& .MuiSlider-track": {
                                                border: "none",
                                            },
                                            "& .MuiSlider-valueLabel": {
                                                backgroundColor: "#1e40af",
                                                fontSize: "0.75rem",
                                                borderRadius: "6px",
                                            },
                                        }}
                                    />
                                    <span className='flex items-center gap-2 text-xs'>
                                        <p>{formData.receivableDays}</p>
                                        <p>Days</p>
                                    </span>
                                </div>
                            </div>

                            {/* Inventory Days */}
                            <div className=''>
                                <p className='text-themeblue text-sm font-bold mb-2'>Inventory Days</p>
                                <div className='flex items-center gap-3'>
                                    <Slider
                                        className='!p-0'
                                        value={formData.inventoryDays}
                                        onChange={(e, newValue) => handleSliderChange('inventoryDays', newValue)}
                                        disabled={!editAllowed}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={365}
                                        step={1}
                                        sx={{
                                            color: "#1e40af",
                                            height: 10,
                                            "& .MuiSlider-thumb": {
                                                height: 18,
                                                width: 18,
                                                backgroundColor: "#1e40af",
                                                border: "3px solid #5BC8FF",
                                                "&:hover": {
                                                    boxShadow: "0 0 0 8px rgba(30,64,175,0.16)",
                                                },
                                            },
                                            "& .MuiSlider-rail": {
                                                color: "#5BC8FF",
                                                opacity: 1,
                                            },
                                            "& .MuiSlider-track": {
                                                border: "none",
                                            },
                                            "& .MuiSlider-valueLabel": {
                                                backgroundColor: "#1e40af",
                                                fontSize: "0.75rem",
                                                borderRadius: "6px",
                                            },
                                        }}
                                    />
                                    <span className='flex items-center gap-2 text-xs'>
                                        <p>{formData.inventoryDays}</p>
                                        <p>Days</p>
                                    </span>
                                </div>
                            </div>

                            {/* Payable Days */}
                            <div className=''>
                                <p className='text-themeblue text-sm font-bold mb-2'>Payable Days</p>
                                <div className='flex items-center gap-3'>
                                    <Slider
                                        className='!p-0'
                                        value={formData.payableDays}
                                        onChange={(e, newValue) => handleSliderChange('payableDays', newValue)}
                                        disabled={!editAllowed}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={365}
                                        step={1}
                                        sx={{
                                            color: "#1e40af",
                                            height: 10,
                                            "& .MuiSlider-thumb": {
                                                height: 18,
                                                width: 18,
                                                backgroundColor: "#1e40af",
                                                border: "3px solid #5BC8FF",
                                                "&:hover": {
                                                    boxShadow: "0 0 0 8px rgba(30,64,175,0.16)",
                                                },
                                            },
                                            "& .MuiSlider-rail": {
                                                color: "#5BC8FF",
                                                opacity: 1,
                                            },
                                            "& .MuiSlider-track": {
                                                border: "none",
                                            },
                                            "& .MuiSlider-valueLabel": {
                                                backgroundColor: "#1e40af",
                                                fontSize: "0.75rem",
                                                borderRadius: "6px",
                                            },
                                        }}
                                    />
                                    <span className='flex items-center gap-2 text-xs'>
                                        <p>{formData.payableDays}</p>
                                        <p>Days</p>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex justify-end text-xs px-3 pt-3">
                            <p className='text-gray-300'>Slide to pick a value from 0 to 365</p>
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
                            onClick={handlePreview}
                            disabled={!editAllowed || isLoading}
                            className="bg-themegreen hover:bg-teal-600 text-white px-8 lg:px-[22px] py-2 text-sm rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Saving..." : "Preview Data"}
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

                        {/* Financial Charts Preview */}
                        {(shouldShowSalesChart || shouldShowCogsChart || shouldShowEbitdaChart || shouldShowNetProfitChart || shouldShowNetMarginChart) && (
                            <div className="py-6">
                                <div className="bg-white rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Financial Projections Preview</h3>
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
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BalanceSheet;