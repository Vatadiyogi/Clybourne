"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { fetchPlanData } from "../../../../redux/planSlice";
import { fetchUser } from "../../../../redux/userSlice";
// import { useSelector, useDispatch } from "react-redux";
import Axios from '../../../../utils/api';
import Swal from 'sweetalert2';
import { Slider } from '@mui/material';
import { HiXMark } from "react-icons/hi2";
import GeoMap from "../../../component/charts/GeoMap";
import SalesChart from "../../../component/charts/SalesChart";
import CogsChart from "../../../component/charts/CogsChart";
import EbitdaChart from "../../../component/charts/EbitdaChart";
import NetProfitChart from "../../../component/charts/NetProfitChart";
import NetMarginChart from "../../../component/charts/NetMarginChart";

// Import calculation functions
import { CalculateGraphData, calculateNetProfitMargin, roundOffNumber } from '../../../component/forms/FinancialInfo';

const PreviewData = () => {
    const dispatch = useDispatch();

    const currentPlan = useSelector((state) => state.plan.currentPlan);

    const userData = useSelector((state) => state.user.userData); // Assuming user slice is named 'user'

    useEffect(() => {
        dispatch(fetchPlanData(), fetchUser());
        //   dispatch(fetchUser());
    }, [dispatch]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [companyData, setCompanyData] = useState({});
    const [financialData, setFinancialData] = useState({});
    const [forecastData, setForecastData] = useState({});
    const [balanceSheetData, setBalanceSheetData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [submitOrder, setSubmitOrder] = useState(false);
    const [ConfirmSubmitOrder, setConfirmSubmitOrder] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [submissionStatus, setSubmissionStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    // Load all data from localStorage
    const [showSuccessModal, setShowSuccessModal] = useState(false);


    useEffect(() => {
        const savedCompanyData = localStorage.getItem('companyFormData');
        const savedFinancialData = localStorage.getItem('financialFormData');
        const savedForecastData = localStorage.getItem('forecastFormData');
        const savedBalanceSheetData = localStorage.getItem('balanceSheetFormData');

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

        if (savedBalanceSheetData) {
            try {
                const parsedData = JSON.parse(savedBalanceSheetData);
                console.log('🔍 BALANCE SHEET DATA STRUCTURE:', parsedData);
                setBalanceSheetData(parsedData);
            } catch (error) {
                console.error('Error parsing balance sheet data:', error);
            }
        }
    }, []);
    // Generate chart data for preview
    const generateChartData = () => {
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

        // Calculate forecast years with cumulative growth
        let currentSales = baseData[0].salesMain;
        let currentCogs = baseData[0].cogsMain;
        let currentEbitda = baseData[0].ebitda;
        let currentNetProfit = baseData[0].netProfit;

        // Generate forecast years
        const forecastYears = Array.from({ length: 5 }, (_, index) => finYearEnd + index + 1);

        forecastYears.forEach((year, index) => {
            const forecast = forecastData.forecastData?.[index] || {};

            // Calculate sales using CalculateGraphData function
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
                salesExtra: formatToTwoDecimals(currentSales * 0.95),
                cogsMain: currentCogs,
                cogsExtra: formatToTwoDecimals(currentCogs * 0.95),
                ebitda: currentEbitda,
                netProfit: currentNetProfit,
                netMargin: netMargin
            });
        });

        // Apply rounding based on the unit of number
        const salesData = baseData.map(item => item.salesMain);
        const cogsData = baseData.map(item => item.cogsMain);
        const ebitdaData = baseData.map(item => item.ebitda);
        const netProfitData = baseData.map(item => item.netProfit);

        const roundedSales = roundOffNumber(salesData, { valueType: [financialData.unitOfNumber || 'Millions'] });
        const roundedCogs = roundOffNumber(cogsData, { valueType: [financialData.unitOfNumber || 'Millions'] });
        const roundedEbitda = roundOffNumber(ebitdaData, { valueType: [financialData.unitOfNumber || 'Millions'] });
        const roundedNetProfit = roundOffNumber(netProfitData, { valueType: [financialData.unitOfNumber || 'Millions'] });

        // Update baseData with rounded values
        const finalData = baseData.map((item, index) => ({
            ...item,
            salesMain: formatToTwoDecimals(roundedSales.roundedNumbers[index]),
            salesExtra: formatToTwoDecimals(roundedSales.roundedNumbers[index] * 0.95),
            cogsMain: formatToTwoDecimals(roundedCogs.roundedNumbers[index]),
            cogsExtra: formatToTwoDecimals(roundedCogs.roundedNumbers[index] * 0.95),
            ebitda: formatToTwoDecimals(roundedEbitda.roundedNumbers[index]),
            netProfit: formatToTwoDecimals(roundedNetProfit.roundedNumbers[index]),
            netMargin: formatToTwoDecimals(item.netMargin)
        }));

        return finalData;
    };

    // Update chart data when dependencies change
    useEffect(() => {
        const data = generateChartData();
        setChartData(data);
    }, [financialData, companyData, forecastData]);

    // Format currency
    const formatCurrency = (value) => {
        if (!value) return '0.00';
        return parseFloat(value).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Format percentage
    const formatPercentage = (value) => {
        if (!value) return '0.00';
        return parseFloat(value).toFixed(2);
    };

    // Get forecast years
    const getForecastYears = () => {
        const finYearEnd = companyData.yearEndYear ? parseInt(companyData.yearEndYear) : new Date().getFullYear();
        return Array.from({ length: 5 }, (_, index) => finYearEnd + index + 1);
    };
    // Add this function before handleFinalSubmit
    const validateFormData = () => {
        const requiredFields = [
            // Company data validations
            { field: companyData.companyName, name: 'Company Name' },
            { field: companyData.companyType, name: 'Company Type' },
            { field: companyData.industryType, name: 'Industry Type' },
            { field: companyData.yearsInBusiness, name: 'Years in Business' },
            { field: companyData.country, name: 'Country' },
            { field: companyData.yearEndDay, name: 'Financial Year End Day' },
            { field: companyData.yearEndMonth, name: 'Financial Year End Month' },
            { field: companyData.yearEndYear, name: 'Financial Year End Year' },
            { field: companyData.earningTrend, name: 'Earning Trend' },
            { field: companyData.businessDescription, name: 'Business Description' },
            { field: companyData.contact, name: 'Contact Number' },
            { field: companyData.email, name: 'Email Address' },
            { field: companyData.currency, name: 'Currency' },

            // Financial data validations
            { field: financialData.valueType, name: 'Value Type' },
            { field: financialData.dataYear, name: 'Data Year' },
            { field: financialData.unitOfNumber, name: 'Unit of Number' },
            { field: financialData.sales, name: 'Sales' },
            { field: financialData.costOfSales, name: 'Cost of Sales' },
            { field: financialData.ebitda, name: 'EBITDA' },
            { field: financialData.depreciation, name: 'Depreciation' },
            { field: financialData.interestExpense, name: 'Interest Expense' },
            { field: financialData.netProfit, name: 'Net Profit' },
            { field: financialData.cashBalance, name: 'Cash Balance' },
            { field: financialData.debtLoan, name: 'Debt/Loan' },
            { field: financialData.equity, name: 'Equity' },
            { field: financialData.receivables, name: 'Receivables' },
            { field: financialData.inventories, name: 'Inventories' },
            { field: financialData.payables, name: 'Payables' },
            { field: financialData.netFixedAssets, name: 'Net Fixed Assets' }
        ];

        const missingFields = requiredFields.filter(item =>
            !item.field || item.field === '' || item.field === null || item.field === undefined
        );

        return missingFields;
    };
    const handleFinalSubmit = async () => {
        try {
            setSubmissionStatus('loading');
            const token = localStorage.getItem("authToken");

            if (!token) {
                Swal.fire({
                    icon: "error",
                    title: "Authentication Required",
                    text: "Please login again.",
                });
                router.push('/auth/login');
                return;
            }

            // Get all data from localStorage
            const companyData = JSON.parse(localStorage.getItem('companyFormData') || '{}');
            const financialData = JSON.parse(localStorage.getItem('financialFormData') || '{}');
            const forecastData = JSON.parse(localStorage.getItem('forecastFormData') || '{"forecastData":[]}');
            const balanceSheetData = JSON.parse(localStorage.getItem('balanceSheetFormData') || '{"forecastData":[]}');
            const contact = localStorage.getItem('companyContactNumber');

            // Parse phone number for backend structure
            const parsePhoneNumber = (phone) => {
                if (!phone) return {};
                // Extract country code and number (simplified parsing)
                const countryCode = phone.startsWith('91') ? '91' : phone.substring(0, 2);
                const dialCode = phone.startsWith('+') ? phone.substring(1, 3) : phone.substring(0, 2);
                return {
                    countryCode: countryCode,
                    dialCode: dialCode,
                    phoneNumber: phone.replace(/^\+?\d{1,3}/, ''), // Remove country code
                    fullNumber: phone
                };
            };

            // Prepare complete payload
            const payload = {
                orderId: orderId,

                // Business data - FIXED to match backend schema
                businessdata: {
                    companyName: companyData.companyName,
                    companyType: companyData.companyType,
                    industryType: companyData.industryType,
                    subIndustryType: companyData.subIndustryType || companyData.industryType,
                    similarCompany: companyData.similarCompany || "",
                    companyAge: companyData.yearsInBusiness,
                    developmentStage: companyData.developmentStage || "Established",
                    country: companyData.countryFullName || companyData.country,
                    currency: companyData.currency,
                    lastFinYrEnd: companyData.yearEndYear || new Date().getFullYear(),
                    earningTrend: companyData.earningTrend,
                    scalable: companyData.scalable || "Yes",
                    description: companyData.businessDescription,
                     contact: companyData.contact || contact,
                    email: companyData.email,
                    FinYrEndDate: companyData.yearEndDay,
                    FinYrEndMonth: companyData.yearEndMonth,
                    FinYrEnd: companyData.yearEndYear
                },

                // Contact data
                contactdata: {
                    name: `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim(),
                    email: companyData.email,
                    phone: companyData.contact || contact
                },

                // Financial data
                financedata: {
                    valueType: financialData.valueType,
                    dataYear: financialData.dataYear,
                    unitOfNumber: financialData.unitOfNumber,
                    sales: parseFloat(financialData.sales) || 0,
                    costOfSales: parseFloat(financialData.costOfSales) || 0,
                    ebitda: parseFloat(financialData.ebitda) || 0,
                    depreciation: parseFloat(financialData.depreciation) || 0,
                    interestExpense: parseFloat(financialData.interestExpense) || 0,
                    netProfit: parseFloat(financialData.netProfit) || 0,
                    cashBalance: parseFloat(financialData.cashBalance) || 0,
                    debtLoan: parseFloat(financialData.debtLoan) || 0,
                    equity: parseFloat(financialData.equity) || 0,
                    receivables: parseFloat(financialData.receivables) || 0,
                    inventories: parseFloat(financialData.inventories) || 0,
                    payables: parseFloat(financialData.payables) || 0,
                    netFixedAssets: parseFloat(financialData.netFixedAssets) || 0
                },

                // Forecast data
                forecast_inc_stmt_data: forecastData.forecastData?.map(item => ({
                    sales: parseFloat(item.salesGrowth) || 0,
                    cogs: parseFloat(item.cogsPercent) || 0,
                    ebitdaMargin: parseFloat(item.ebitdaMargin) || 0,
                    interestRate: parseFloat(item.interestRate) || 0,
                    depreciationRate: parseFloat(item.depreciationRate) || 0,
                    netProfitMargin: parseFloat(item.netProfitMargin) || 0
                })) || [],

                // Balance sheet data
                forcast_bal_sheet_data: balanceSheetData.forecastData?.map(item => ({
                    fixedAssets: parseFloat(item.capex) || 0,
                    debtLoan: parseFloat(item.debt) || 0
                })) || [],

                // Working capital data
                forcast_rip_days_data: {
                    receivableDays: parseInt(balanceSheetData.receivableDays) || 0,
                    inventoryDays: parseInt(balanceSheetData.inventoryDays) || 0,
                    payableDays: parseInt(balanceSheetData.payableDays) || 0
                }
            };

            console.log('🚀 UPDATING ORDER DATA...');

            // STEP 1: Update the order with all form data
            const updateResponse = await Axios.put("/api/order/update", payload, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                },
            });

            console.log('✅ ORDER UPDATE RESPONSE:', updateResponse.data);

            if (updateResponse.data.status) {
                console.log('🚀 SUBMITTING ORDER FOR PROCESSING...');

                // STEP 2: Submit the order to set submittedOn date and change status
                const submitResponse = await Axios.put("/api/order/submit-order", {
                    orderId: orderId,
                    role: 'user' // or 'admin' if needed
                }, {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json'
                    },
                });

                console.log('✅ ORDER SUBMIT RESPONSE:', submitResponse.data);

                if (submitResponse.data.status) {
                    setSubmissionStatus('success');
                    setConfirmSubmitOrder(true);
                    setSuccessMessage(submitResponse.data.message || "Your order has been successfully submitted.");
                    // Clear localStorage after successful submission
                    localStorage.removeItem('companyFormData');
                    localStorage.removeItem('financialFormData');
                    localStorage.removeItem('forecastFormData');
                    localStorage.removeItem('balanceSheetFormData');
                    localStorage.removeItem('currentOrderId');

                    // Swal.fire({
                    //     icon: "success",
                    //     title: "Order Submitted!",
                    //     text: submitResponse.data.message || "Your order has been successfully submitted.",
                    // });

                } else {
                    throw new Error(submitResponse.data.message || "Failed to submit order");
                }
            } else {
                throw new Error(updateResponse.data.message || "Failed to update order data");
            }
        } catch (err) {
            console.error('❌ SUBMIT ERROR:', err);
            console.error('Error details:', err.response?.data);
            setSubmissionStatus('error');
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: err.response?.data?.message || err.message || "Unable to submit order.",
            });
        } finally {
            setIsLoading(false);
            setSubmitOrder(false);
        }
    }
    const handleBack = () => {
        if (orderId) {
            router.push(`/dashboard/newOrder?step=balance&orderId=${orderId}`);
        } else {
            router.push('/dashboard/newOrder/balance');
        }
    };

    const goToOrders = () => {
        router.push('/dashboard/order');
    };
    // Handle successful submission
    useEffect(() => {
        if (submissionStatus === 'success') {
            setShowSuccessModal(true);
        }
    }, [submissionStatus]);
    const forecastYears = getForecastYears();
    console.log("companyDatattata:", companyData)
    console.log("🟢 Current userDataprevierw:", userData);
    return (
        <div className='lg:ps-8 bg-gray-50 p-3 lg:pe-14 xl:pe-24 lg:pt-3'>
            <div>
                <div>
                    <h2 className='text-[26px] fw-medium font-sans'>Overview of the Provided Data</h2>
                    <p className='text-gray-700 text-sm text-medium'>Review the input details and submit the data to the generated reports for accuracy and improved decision-making</p>
                </div>

                {/* User Info Section */}
                <div className='flex gap-1 md:gap-4 flex-wrap sm:flex-nowrap justify-between md:max-w-[60%] md:ps-5 my-4'>
                    <div className='bg-white w-[100%] md:w-[30%] px-3 py-2 rounded'>
                        <h4 className="text-[10px] text-gray-600">Name</h4>
                        <p className='text-gray-900 text-sm text-medium'>{userData?.first_name || 'N/A'}</p>
                    </div>
                    <div className='bg-white w-[100%] md:w-[30%] px-3 py-2 rounded'>
                        <h4 className="text-[10px] text-gray-600">Plan Type</h4>
                        <p className='text-gray-900 text-sm text-medium'>{currentPlan?.planType || 'Standard'}</p>
                    </div>
                    <div className='bg-white w-[100%] md:w-[40%] px-3 py-2 rounded'>
                        <h4 className="text-[10px] text-gray-600">Report Sequence</h4>
                        <p className='text-gray-900 text-sm text-medium'>{orderId || 'N/A'}</p>
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
                                <p className="font-medium !w-[35%]">Company Name</p>
                                :<p className="ms-2 w-[45%]">{companyData.companyName || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium !w-[35%]">Company Type</p>
                                :<p className="ms-2 w-[45%]">{companyData.companyType || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium !w-[35%]">Industry Type</p>
                                :<p className="ms-2 w-[45%]">{companyData.industryType || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium !w-[35%]">Years in Business</p>
                                :<p className="ms-2 w-[45%]">{companyData.yearsInBusiness || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium !w-[35%]">Country</p>
                                :<p className="ms-2 w-[45%]">{companyData.countryFullName || companyData.country || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium !w-[35%]">Financial Year End</p>
                                :<p className="ms-2 w-[45%]">
                                    {companyData.yearEndDay && companyData.yearEndMonth && companyData.yearEndYear
                                        ? `${companyData.yearEndDay} ${companyData.yearEndMonth} ${companyData.yearEndYear}`
                                        : 'N/A'
                                    }
                                </p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium !w-[35%]">Historical Earning Trend</p>
                                :<p className="ms-2 w-[45%]">{companyData.earningTrend || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium !w-[35%]">Short Description</p>
                                :<p className="ms-2 w-[45%]">{companyData.businessDescription || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium !w-[35%]">Contact Number</p>
                                :<p className="ms-2 w-[45%]">{companyData.contact || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium !w-[35%]">Email Address</p>
                                :<p className="ms-2 w-[45%]">{companyData.email || 'N/A'}</p>
                            </div>
                            <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
                                <p className="font-medium !w-[35%]">Company's Currency</p>
                                :<p className="ms-2 w-[45%]">{companyData.currency || 'N/A'}</p>
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
                                <p className="font-medium !w-[35%]">Sales</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.sales)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium !w-[35%]">Cost of Sales</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.costOfSales)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium !w-[35%]">EBITDA</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.ebitda)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium !w-[35%]">Depreciation</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.depreciation)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium !w-[35%]">Interest Expense</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.interestExpense)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium !w-[35%]">Cash Balance</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.cashBalance)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium !w-[35%]">Net Profit</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.netProfit)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium !w-[35%]">Debt / Loan</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.debtLoan)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium !w-[35%]">Equity</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.equity)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium !w-[35%]">Receivables</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.receivables)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium !w-[35%]">Inventories</p>
                                :<p className="ms-2 w-[45%]">{formatCurrency(financialData.inventories)}</p>
                            </div>
                            <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
                                <p className="font-medium !w-[35%]">Payables</p>
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
                                Income Statement Assumptions
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
                                                {forecastData.forecastData?.map((data, index) => (
                                                    <td key={index} className="px-4 py-3 text-center">
                                                        {formatPercentage(data.salesGrowth)}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="-gray-50">
                                                <td className="px-4 py-3">Forecasted COGS (as % of revenue) (%)</td>
                                                {forecastData.forecastData?.map((data, index) => (
                                                    <td key={index} className="px-4 py-3 text-center">
                                                        {formatPercentage(data.cogsPercent)}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="bg-gray-50">
                                                <td className="px-4 py-3">Forecasted EBITDA Margin (%)</td>
                                                {forecastData.forecastData?.map((data, index) => (
                                                    <td key={index} className="px-4 py-3 text-center">
                                                        {formatPercentage(data.ebitdaMargin)}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="-gray-50">
                                                <td className="px-4 py-3">Interest Rate (%)</td>
                                                {forecastData.forecastData?.map((data, index) => (
                                                    <td key={index} className="px-4 py-3 text-center">
                                                        {formatPercentage(data.interestRate)}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="bg-gray-50">
                                                <td className="px-4 py-3">Depreciation Rate (%)</td>
                                                {forecastData.forecastData?.map((data, index) => (
                                                    <td key={index} className="px-4 py-3 text-center">
                                                        {formatPercentage(data.depreciationRate)}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="-50">
                                                <td className="px-4 py-3">Forecasted Net Profit Margin (%)</td>
                                                {forecastData.forecastData?.map((data, index) => (
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
                    <SalesChart yearly={chartData} unit={financialData.unitOfNumber || "Millions"} />
                    <CogsChart yearly={chartData} unit={financialData.unitOfNumber || "Millions"} />
                    <EbitdaChart yearly={chartData} unit={financialData.unitOfNumber || "Millions"} />
                    <NetProfitChart yearly={chartData} unit={financialData.unitOfNumber || "Millions"} />
                    <NetMarginChart yearly={chartData} />
                    <GeoMap selectedCountry={companyData.country} height={190} classes={"w-[100%] h-[100%]"} />
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
                                    Values in {companyData.currency || 'SAR'} ({financialData.unitOfNumber || 'Absolute'})
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
                                            {balanceSheetData.forecastData?.map((data, index) => (
                                                <td key={index} className="px-4 py-3 text-center">
                                                    {formatCurrency(data.capex)}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="-gray-50">
                                            <td className="px-4 py-3">Forecasted Debt/Loan</td>
                                            {balanceSheetData.forecastData?.map((data, index) => (
                                                <td key={index} className="px-4 py-3 text-center">
                                                    {formatCurrency(data.debt)}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Working Capital Days */}
                            {/* Working Capital Days */}
                            <div className='flex flex-col sm:flex-row px-5 gap-10 border-t-2 border-gray-200 pb-5 pt-10 flex- w-100'>
                                <div className='w-[50%] xs:w-[100%] sm:w-[30%]'>
                                    <p className='text-themeblue text-xs sm:text-[16px] mb-2'>Receivable Days</p>
                                    <div className='flex items-center gap-3'>
                                        <Slider
                                            className='!p-0'
                                            value={balanceSheetData.receivableDays || 0}
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
                                            <p>{balanceSheetData.receivableDays || 0}</p>
                                            <p>Days</p>
                                        </span>
                                    </div>
                                </div>
                                <div className='w-[50%] xs:w-[100%] sm:w-[30%]'>
                                    <p className='text-themeblue mb-2 text-xs sm:text-[16px]'>Inventory Days</p>
                                    <div className='flex items-center gap-3'>
                                        <Slider
                                            className='!p-0'
                                            value={balanceSheetData.inventoryDays || 0}
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
                                            <p>{balanceSheetData.inventoryDays || 0}</p>
                                            <p>Days</p>
                                        </span>
                                    </div>
                                </div>
                                <div className='w-[50%] xs:w-[100%] sm:w-[30%]'>
                                    <p className='text-themeblue mb-2 text-xs sm:text-[16px]'>Payable Days</p>
                                    <div className='flex items-center gap-3'>
                                        <Slider
                                            className='!p-0'
                                            value={balanceSheetData.payableDays || 0}
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
                                            <p>{balanceSheetData.payableDays || 0}</p>
                                            <p>Days</p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>

            {/* Action Buttons */}
            <div className='flex px-2 md:py-8 lg:py-16 sm:px-0 mt-2 md:mt-0 flex-col sm:flex-row justify-center gap-3'>
                <button
                    onClick={handleBack}
                    className="bg-gray-400 text-center sm:w-[201px] hover:bg-gray-500 text-white py-1 sm:py-2 lg:py-3 rounded-md"
                >
                    Back
                </button>
                <button
                    onClick={() => setSubmitOrder(true)}
                    className="bg-themegreen hover:bg-teal-600 text-white px-8 lg:w-[201px] py-1 sm:py-2 lg:py-3 rounded-md"
                >
                    Submit
                </button>
            </div>

            {/* Confirmation Modals */}
            {submitOrder && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
                    onClick={() => setSubmitOrder(false)}>
                    <div className="bg-white px-4 py-4 xl:py-6 rounded-md shadow-lg w-[90%] max-w-md"
                        onClick={(e) => e.stopPropagation()}>
                        <span onClick={() => setSubmitOrder(false)} className="flex justify-end">
                            <HiXMark className="text-[25px] text-gray-500" />
                        </span>
                        <div className="p-3 lg:p-3 xl:p-10">
                            <h2 className="2xl:4xl xl:text-3xl mb-6 text-themegreen text-center font-sans lg:text-2xl text-xl">
                                Final Confirmation
                            </h2>
                            <p className="text-gray-500 text-sm m-auto text-center max-w-[280px] mb-10">
                                Double-check every detail—once you submit,
                                changes are off the table. Ready to lock in
                                your order?
                            </p>
                            <div className='flex px-2 pt-8 sm:px-0 mt-2 md:mt-0 flex-col sm:flex-row justify-center gap-3'>
                                <button
                                    onClick={() => setSubmitOrder(false)}
                                    className="bg-gray-400 text-center sm:w-[201px] hover:bg-gray-500 text-white py-1 sm:py-2 lg:py-3 rounded-md"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => {
                                        const missingFields = validateFormData();
                                        if (missingFields.length > 0) {
                                            Swal.fire({
                                                icon: "error",
                                                title: "Missing Required Fields",
                                                html: `
                    <div class="text-left">
                        <p class="mb-2">Please fill in the following required fields:</p>
                        <ul class="list-disc pl-4 text-sm">
                            ${missingFields.map(field => `<li>${field.name}</li>`).join('')}
                        </ul>
                    </div>
                `,
                                            });
                                            return;
                                        }
                                        handleFinalSubmit();
                                        setSubmitOrder(true);
                                    }}
                                    className="bg-themegreen hover:bg-teal-600 text-white px-8 lg:w-[201px] py-1 sm:py-2 lg:py-3 rounded-md"
                                >
                                    {isLoading ? "Submitting..." : " Submit"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showSuccessModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
                    onClick={() => setShowSuccessModal(false)}>
                    <div className="bg-white px-4 py-4 xl:py-6 rounded-md shadow-lg w-[90%] max-w-md"
                        onClick={(e) => e.stopPropagation()}>
                        <span onClick={() => setShowSuccessModal(false)} className="flex justify-end">
                            <HiXMark className="text-[25px] text-gray-500" />
                        </span>
                        <div className="p-3 lg:p-3 xl:p-10">
                            <h2 className="2xl:4xl xl:text-3xl mb-6 text-themegreen text-center font-sans lg:text-2xl text-xl">
                                Order Confirmation
                            </h2>
                            <p className="text-gray-500 text-sm m-auto text-center max-w-[280px] mb-10">
                                {/* {successMessage || "Thank you for placing your order. Your valuation report will be delivered soon."} */}
                                Thank you for placing your order. Your
                                valuation report will be delivered by
                                {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZone: 'GMT'
                                })} GMT
                            </p>
                            <div className="w-full text-center">
                                <button
                                    onClick={goToOrders}
                                    className="bg-themegreen hover:bg-teal-600 text-white px-8 py-1 sm:py-2 lg:py-3 rounded-md"
                                >
                                    Go To Order Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PreviewData;