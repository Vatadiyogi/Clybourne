"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Slider } from '@mui/material';
import { HiXMark } from "react-icons/hi2";
import GeoMap from "../../../component/charts/GeoMap";
import { getCountryCode } from '../../../../utils/countryUtils';
import SalesChart from "../../../component/charts/SalesChart";
import CogsChart from "../../../component/charts/CogsChart";
import EbitdaChart from "../../../component/charts/EbitdaChart";
import NetProfitChart from "../../../component/charts/NetProfitChart";
import NetMarginChart from "../../../component/charts/NetMarginChart";
import Axios from "../../../../utils/api";
// Import calculation functions
import { CalculateGraphData, calculateNetProfitMargin, roundOffNumber } from '../../../component/forms/FinancialInfo';

const OrderDetails = () => {
    const router = useRouter();
    const params = useParams();
    const orderId = params.orderId;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        console.log("orderId:", orderId);

        const fetchData = async () => {
            try {
                const response = await Axios.get(`/api/order/preview/${orderId}`);
                setData(response.data);
                console.log("API Response:", response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchData();
            // console.log("fetchedDatat in our project,",data)
        } else {
            setLoading(false);
        }
    }, [orderId]);

    // Generate chart data using API data
    const generateChartData = () => {
        if (!data?.calculations?.finance || !data?.calculations?.forecast_inc_stmt) return [];

        const financialData = data.calculations.finance;
        const forecastData = data.calculations.forecast_inc_stmt;

        // Get financial year
        const finYearEnd = data?.order?.business?.FinYrEnd ? parseInt(data.order.business.FinYrEnd) : new Date().getFullYear();

        // Helper function to format numbers to 2 decimal places
        const formatToTwoDecimals = (num) => {
            return Math.round((num + Number.EPSILON) * 100) / 100;
        };

        // Get units
        const unitOfNumber = financialData.unitOfNumber || 'Millions';
        const valueType = financialData.valueType || unitOfNumber; // Use valueType if exists, otherwise unitOfNumber

        console.log("Unit of Number:", unitOfNumber);
        console.log("Value Type:", valueType);

        // Function to scale numbers based on unit difference
        const scaleByUnitDifference = (numbers, fromUnit, toUnit) => {
            if (fromUnit === toUnit) return numbers;

            // Unit hierarchy
            const unitHierarchy = ['Thousands', 'Millions', 'Billions', 'Trillions'];
            const fromIndex = unitHierarchy.indexOf(fromUnit);
            const toIndex = unitHierarchy.indexOf(toUnit);

            if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
                return numbers;
            }

            // Calculate scaling factor: each step is ÷1000
            const steps = toIndex - fromIndex;
            const scalingFactor = Math.pow(1000, steps);

            return numbers.map(num => {
                if (num === null || num === undefined) return 0;
                return formatToTwoDecimals(num / scalingFactor);
            });
        };

        // Start with current year data
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

        // Calculate forecast years
        let currentSales = baseData[0].salesMain;
        let currentCogs = baseData[0].cogsMain;
        let currentEbitda = baseData[0].ebitda;
        let currentNetProfit = baseData[0].netProfit;

        // Generate forecast years
        const forecastYears = Array.from({ length: 5 }, (_, index) => finYearEnd + index + 1);

        forecastYears.forEach((year, index) => {
            const forecast = forecastData[index] || {};

            // Calculate sales
            if (forecast.salesGrowthRate) {
                const growthRate = parseFloat(forecast.salesGrowthRate) || 0;
                currentSales = formatToTwoDecimals(CalculateGraphData(currentSales, growthRate));
            }

            // Calculate COGS
            let cogsMain = 0;
            if (forecast.cogs) {
                const cogsPercent = parseFloat(forecast.cogs) || 0;
                cogsMain = formatToTwoDecimals(currentSales * (cogsPercent / 100));
                currentCogs = cogsMain;
            }

            // Calculate EBITDA
            let ebitda = 0;
            if (forecast.ebitdaMargin) {
                const margin = parseFloat(forecast.ebitdaMargin) || 0;
                ebitda = formatToTwoDecimals(currentSales * (margin / 100));
                currentEbitda = ebitda;
            }

            // Calculate Net Profit
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
                salesExtra: formatToTwoDecimals(currentSales * 0.95),
                cogsMain: currentCogs,
                cogsExtra: formatToTwoDecimals(currentCogs * 0.95),
                ebitda: currentEbitda,
                netProfit: currentNetProfit,
                netMargin: netMargin
            });
        });

        // Extract data for scaling
        const salesData = baseData.map(item => item.salesMain);
        const cogsData = baseData.map(item => item.cogsMain);
        const ebitdaData = baseData.map(item => item.ebitda);
        const netProfitData = baseData.map(item => item.netProfit);

        // Apply scaling based on unit difference
        const scaledSales = scaleByUnitDifference(salesData, unitOfNumber, valueType);
        const scaledCogs = scaleByUnitDifference(cogsData, unitOfNumber, valueType);
        const scaledEbitda = scaleByUnitDifference(ebitdaData, unitOfNumber, valueType);
        const scaledNetProfit = scaleByUnitDifference(netProfitData, unitOfNumber, valueType);

        // Update baseData with scaled values
        const finalData = baseData.map((item, index) => ({
            ...item,
            salesMain: scaledSales[index],
            salesExtra: formatToTwoDecimals(scaledSales[index] * 0.95),
            cogsMain: scaledCogs[index],
            cogsExtra: formatToTwoDecimals(scaledCogs[index] * 0.95),
            ebitda: scaledEbitda[index],
            netProfit: scaledNetProfit[index],
            netMargin: formatToTwoDecimals(item.netMargin),
            valueType: valueType // Add valueType to each data point
        }));

        console.log("Generated Chart Data:", finalData);
        return finalData;
    };
    // Update chart data when data changes
    useEffect(() => {
        if (data) {
            console.log("Country data:", businessData.business.country);
            console.log("Full business data:", businessData.business);
            const chartData = generateChartData();
            setChartData(chartData);
        }
    }, [data]);

    // Format currency
    const formatCurrency = (value) => {
        if (!value && value !== 0) return '0.00';
        return parseFloat(value).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Format percentage
    const formatPercentage = (value) => {
        if (!value && value !== 0) return '0.00';
        return parseFloat(value).toFixed(2);
    };

    // Get forecast years
    const getForecastYears = () => {
        const finYearEnd = data?.order?.business?.FinYrEnd ? parseInt(data.order.business.FinYrEnd) : new Date().getFullYear();
        return Array.from({ length: 5 }, (_, index) => finYearEnd + index + 1);
    };

    const handleBack = () => {
        router.push('/dashboard/order');
    };

    const forecastYears = getForecastYears();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-themegreen"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No order data found</p>
            </div>
        );
    }

    // Extract data for easier access
    const businessData = data?.order?.business || {};
    const financialData = data?.calculations?.finance || {};
    const forecastData = data?.calculations?.forecast_inc_stmt || [];
    const balanceSheetData = data?.calculations?.forecast_bal_sheet || [];
    const ripDaysData = data?.calculations?.forecast_rip_days || {};
    const customerData = data?.customer || {};

    return (
        <div className='lg:ps-8 bg-gray-50 p-3 lg:pe-14 xl:pe-24 lg:pt-3'>
            <div>
                <div>
                    <h2 className='text-[26px] fw-medium font-sans'>Order Details</h2>
                    <p className='text-gray-700 text-sm text-medium'>Review the complete order information and financial data</p>
                </div>

                {/* User Info Section */}
                <div className='flex gap-1 md:gap-4 flex-wrap sm:flex-nowrap justify-between md:max-w-[60%] md:ps-5 my-4'>
                    <div className='bg-white w-[100%] md:w-[30%] px-3 py-2 rounded'>
                        <h4 className="text-[10px] text-gray-600">Name</h4>
                        <p className='text-gray-900 text-sm text-medium'>{customerData.customerName || 'N/A'}</p>
                    </div>
                    <div className='bg-white w-[100%] md:w-[30%] px-3 py-2 rounded'>
                        <h4 className="text-[10px] text-gray-600">Plan Type</h4>
                        <p className='text-gray-900 text-sm text-medium'>{customerData.planType || 'N/A'}</p>
                    </div>
                    <div className='bg-white w-[100%] md:w-[30%] px-3 py-2 rounded'>
                        <h4 className="text-[10px] text-gray-600">Order ID</h4>
                        <p className='text-gray-900 text-sm text-medium'>{data.order?.systemOrderId || orderId || 'N/A'}</p>
                    </div>
                </div>

                {/* Business Details and Financial Status */}
                <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:space-x-8 md:px-2 lg:px-0 xl:px-2 py-6">
                    {/* Left Section: Company Information */}
                    <fieldset className='w-100 lg:w-1/2 px-3 pb-3 pt-3 xl:px-6 xl:pb-6 xl:pt-4 border border-gray-200 rounded'>
                        <legend className='m-auto'>
                            <button className="bg-themeblue cursor-default text-[13px] sm:text-[16px] text-white px-4 py-1 rounded">
                                Business Details
                            </button>
                        </legend>
                        <div className="border-l-[8px] ps-5 pe-2 xl:ps-10 py-5 border-themeblue rounded-md space-y-3" style={{
                            boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                            height: "-webkit-fill-available"
                        }}>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium w-[35%]">Company Name</p>
                                :<p className="ms-2 w-[45%]">{businessData.business.companyName || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium w-[35%]">Company Type</p>
                                :<p className="ms-2 w-[45%]">{businessData.business.companyType || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium w-[35%]">Industry Type</p>
                                :<p className="ms-2 w-[45%]">{businessData.business.industryType || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium w-[35%]">Years in Business</p>
                                :<p className="ms-2 w-[45%]">{businessData.business.companyAge || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium w-[35%]">Country</p>
                                :<p className="ms-2 w-[45%]">{businessData.business.country || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium w-[35%]">Financial Year End</p>
                                :<p className="ms-2 w-[45%]">{businessData.business.FinYrEndMonth && businessData.business.FinYrEndDate ?
                                    `${businessData.business.FinYrEndMonth} ${businessData.business.FinYrEndDate}` : 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium w-[35%]">Historical Earning Trend</p>
                                :<p className="ms-2 w-[45%]">{businessData.business.earningTrend || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium w-[35%]">Short Description</p>
                                :<p className="ms-2 w-[45%]">{businessData.business.description || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium w-[35%]">Contact Number</p>
                                :<p className="ms-2 w-[45%]">
                                    {businessData.business.contact && typeof businessData.business.contact === 'object'
                                        ? businessData.business.contact.fullNumber || businessData.business.contact.phoneNumber || 'N/A'
                                        : businessData.business.contact || 'N/A'
                                    }
                                </p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium w-[35%]">Email Address</p>
                                :<p className="ms-2 w-[45%]">{businessData.business.email || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium w-[35%]">Company's Currency</p>
                                :<p className="ms-2 w-[45%]">{businessData.business.currency || 'N/A'}</p>
                            </div>
                        </div>
                    </fieldset>

                    {/* Right Section: Present Financial Status */}
                    <fieldset className="w-100 lg:w-1/2 px-3 pb-3 pt-3 xl:px-6 xl:pb-6 xl:pt-4 border border-gray-200 rounded">
                        <legend className="m-auto">
                            <button className="bg-themeblue cursor-default text-[13px] sm:text-[16px] text-white px-4 py-1 rounded">
                                Present Financial Status
                            </button>
                        </legend>
                        <div className="border-l-[8px] ps-5 pe-2 xl:ps-10 py-5 border-themeblue rounded-md space-y-3"
                            style={{
                                boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
                            }}
                        >
                            <p className='text-themeblue md:text-center text-[14px] md:text-[16px]'>
                                Historical Numbers for the Year {financialData.dataYear || new Date().getFullYear() - 1}
                            </p>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium w-[35%]">Sales</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.sales)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium w-[35%]">Cost of Sales</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.costOfSales)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium w-[35%]">EBITDA</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.ebitda)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium w-[35%]">Depreciation</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.depreciation)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium w-[35%]">Interest Expense</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.interestExpense)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium w-[35%]">Cash Balance</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.cashBalance)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium w-[35%]">Net Profit</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.netProfit)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium w-[35%]">Debt / Loan</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.debtLoan)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium w-[35%]">Equity</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.equity)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium w-[35%]">Receivables</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.receivables)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium w-[35%]">Inventories</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.inventories)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium w-[35%]">Payables</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.payables)}</p>
                            </div>
                            <p className='text-gray-400 text-[10px] text-medium'>
                                All Financial numbers specified in {financialData.unitOfNumber || 'Millions'}
                            </p>
                        </div>
                    </fieldset>
                </div>

                {/* Income Statement Assumptions */}
                <div className='overflow-x-auto'>
                    <fieldset className="w-100 px-3 md:px-6 pb-6 pt-4 border border-gray-200 rounded">
                        <legend className="md:m-auto">
                            <button className="bg-themeblue cursor-default text-white px-4 py-1 rounded">
                                Financial Projection
                            </button>
                        </legend>
                        <div className=''>
                            <div className="p-3 rounded-md space-y-3" style={{
                                boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
                            }}>
                                <div className="">
                                    <table className="min-w-full table-auto text-[12px]">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="px-4 font-light py-3 text-left">Income Statement Assumptions</th>
                                                {forecastYears.map((year, index) => (
                                                    <th key={index} className="px-4 font-light py-3 text-center">{year}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-gray-50">
                                                <td className="px-4 py-3">Forecasted Sales Growth Rate (Y-o-Y) (%)</td>
                                                {forecastData.map((data, index) => (
                                                    <td key={index} className="px-4 py-3 text-center">
                                                        {formatPercentage(data.salesGrowthRate)}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="-gray-50">
                                                <td className="px-4 py-3">Forecasted COGS (as % of revenue) (%)</td>
                                                {forecastData.map((data, index) => (
                                                    <td key={index} className="px-4 py-3 text-center">
                                                        {formatPercentage(data.cogs)}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="bg-gray-50">
                                                <td className="px-4 py-3">Forecasted EBITDA Margin (%)</td>
                                                {forecastData.map((data, index) => (
                                                    <td key={index} className="px-4 py-3 text-center">
                                                        {formatPercentage(data.ebitdaMargin)}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="-gray-50">
                                                <td className="px-4 py-3">Interest Rate (%)</td>
                                                {forecastData.map((data, index) => (
                                                    <td key={index} className="px-4 py-3 text-center">
                                                        {formatPercentage(data.interestRate)}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="bg-gray-50">
                                                <td className="px-4 py-3">Depreciation Rate (%)</td>
                                                {forecastData.map((data, index) => (
                                                    <td key={index} className="px-4 py-3 text-center">
                                                        {formatPercentage(data.depreciationRate)}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="-50">
                                                <td className="px-4 py-3">Forecasted Net Profit Margin (%)</td>
                                                {forecastData.map((data, index) => (
                                                    <td key={index} className="px-4 py-3 text-center">
                                                        {formatPercentage(data.netProfitMargin)}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>

                {/* Financial Charts */}
                <div className="py-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <SalesChart yearly={chartData} unit={financialData.valueType || "Millions"} />
                    <CogsChart yearly={chartData} unit={financialData.valueType || "Millions"} />
                    <EbitdaChart yearly={chartData} unit={financialData.valueType || "Millions"} />
                    <NetProfitChart yearly={chartData} unit={financialData.valueType || "Millions"} />
                    <NetMarginChart yearly={chartData} />
                    <GeoMap selectedCountry={getCountryCode(businessData.business.country)} height={190} classes={"w-[100%] h-[100%]"} />
                </div>

                {/* Balance Sheet Assumptions */}
                <div className='overflow-x-auto'>
                    <fieldset className="w-100 px-3 md:px-6 pb-6 pt-4 border border-gray-200 rounded">
                        <legend className="md:m-auto">
                            <button className="bg-themeblue cursor-default text-white px-4 py-1 rounded">
                                Balance Sheet Assumptions
                            </button>
                        </legend>
                        <div className="p-3 rounded-md space-y-3" style={{
                            boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
                        }}>
                            <div className="overflow-x-auto">
                                <p className='text-[8px] text-end py-1'>
                                    Values in {businessData.currency || 'SAR'} ({financialData.unitOfNumber || 'Absolute'})
                                </p>
                                <table className="min-w-full table-auto text-[12px]">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 font-light py-3 text-left">Balance Sheet Assumptions</th>
                                            {forecastYears.map((year, index) => (
                                                <th key={index} className="px-4 font-light py-3 text-center">{year}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-gray-50">
                                            <td className="px-4 py-3">Forecasted Net Addition in CAPEX/Fixed Assets</td>
                                            {balanceSheetData.map((data, index) => (
                                                <td key={index} className="px-4 py-3 text-center">
                                                    {formatCurrency(data.fixedAssets)}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="-gray-50">
                                            <td className="px-4 py-3">Forecasted Debt/Loan</td>
                                            {balanceSheetData.map((data, index) => (
                                                <td key={index} className="px-4 py-3 text-center">
                                                    {formatCurrency(data.debtLoan)}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Working Capital Days */}
                            <div className='flex flex-col sm:flex-row px-5 gap-10 border-t-2 border-gray-200 pb-5 pt-10 flex- w-100'>
                                <div className='w-[50%] xs:w-[100%] sm:w-[30%]'>
                                    <p className='text-themeblue text-xs sm:text-[16px] mb-2'>Receivable Days</p>
                                    <div className='flex items-center gap-3'>
                                        <Slider
                                            className='!p-0'
                                            value={ripDaysData.receivableDays || 30}
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
                                            disabled
                                        />
                                        <span className='flex items-center gap-2 text-xs'>
                                            <p>{ripDaysData.receivableDays || 30}</p>
                                            <p>Days</p>
                                        </span>
                                    </div>
                                </div>
                                <div className='w-[50%] xs:w-[100%] sm:w-[30%]'>
                                    <p className='text-themeblue mb-2 text-xs sm:text-[16px]'>Inventory Days</p>
                                    <div className='flex items-center gap-3'>
                                        <Slider
                                            className='!p-0'
                                            value={ripDaysData.inventoryDays || 45}
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
                                            disabled
                                        />
                                        <span className='flex items-center gap-2 text-xs'>
                                            <p>{ripDaysData.inventoryDays || 45}</p>
                                            <p>Days</p>
                                        </span>
                                    </div>
                                </div>
                                <div className='w-[50%] xs:w-[100%] sm:w-[30%]'>
                                    <p className='text-themeblue mb-2 text-xs sm:text-[16px]'>Payable Days</p>
                                    <div className='flex items-center gap-3'>
                                        <Slider
                                            className='!p-0'
                                            value={ripDaysData.payableDays || 30}
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
                                            disabled
                                        />
                                        <span className='flex items-center gap-2 text-xs'>
                                            <p>{ripDaysData.payableDays || 30}</p>
                                            <p>Days</p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>

            {/* Back Button Only */}
            <div className='flex px-2 md:py-8 lg:py-16 sm:px-0 mt-2 md:mt-0 flex-col sm:flex-row justify-center'>
                <button
                    onClick={handleBack}
                    className="bg-gray-400 text-center sm:w-[201px] hover:bg-gray-500 text-white py-1 sm:py-2 lg:py-3 rounded-md"
                >
                    Back to Orders
                </button>
            </div>
        </div>
    );
};

export default OrderDetails;