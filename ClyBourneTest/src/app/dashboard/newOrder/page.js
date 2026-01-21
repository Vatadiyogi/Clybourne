// app/dashboard/newOrder/page.js
"use client"
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Company from '../../component/forms/Company';
import FinancialInfo from '../../component/forms/FinancialInfo';
import ForecastInfo from '../../component/forms/ForecastInfo';
import BalanceSheet from '../../component/forms/BalanceSheet';
import Axios from "../../../utils/api";
import Swal from 'sweetalert2';
export default function NewOrderWizard() {
  const searchParams = useSearchParams();
  const step = searchParams.get('step') || 'company';
  const orderId = searchParams.get('orderId');

  const [currentStep, setCurrentStep] = useState(step);
  const [initialData, setInitialData] = useState(null);

  // Simple step rendering - no complex data fetching needed
  const renderStep = () => {
    switch (currentStep) {
      case 'company':
        return (
          <Company
            orderId={orderId}
            initialData={initialData}
            onSave={() => {
              const currentOrderId = orderId || localStorage.getItem('currentOrderId');
              window.location.href = `/dashboard/newOrder?step=financial&orderId=${currentOrderId}`;
            }}
            editAllowed={true}
          />
        );
      case 'financial':
        return (
          <FinancialInfo
            orderId={orderId || localStorage.getItem('currentOrderId')}
            initialData={initialData}
            onSave={() => {
              const currentOrderId = orderId || localStorage.getItem('currentOrderId');
              window.location.href = `/dashboard/newOrder?step=forecast&orderId=${currentOrderId}`;
            }}
            onBack={() => {
              const currentOrderId = orderId || localStorage.getItem('currentOrderId');
              window.location.href = `/dashboard/newOrder?step=company&orderId=${currentOrderId}`;
            }}
            editAllowed={true}
          />
        );
      case 'forecast':
        return (
          <ForecastInfo
            orderId={orderId || localStorage.getItem('currentOrderId')}
            initialData={initialData}
            onSave={() => {
              const currentOrderId = orderId || localStorage.getItem('currentOrderId');
              window.location.href = `/dashboard/newOrder?step=balance&orderId=${currentOrderId}`;
            }}
            onBack={() => {
              const currentOrderId = orderId || localStorage.getItem('currentOrderId');
              window.location.href = `/dashboard/newOrder?step=financial&orderId=${currentOrderId}`;
            }}
            editAllowed={true}
          />
        );
      case 'balance':
        return (
          <BalanceSheet
            orderId={orderId || localStorage.getItem('currentOrderId')}
            initialData={initialData}
            onSave={() => {
              const currentOrderId = orderId || localStorage.getItem('currentOrderId');
              window.location.href = `/dashboard/newOrder/preview?orderId=${currentOrderId}`;
            }}
            onBack={() => {
              const currentOrderId = orderId || localStorage.getItem('currentOrderId');
              window.location.href = `/dashboard/newOrder?step=forecast&orderId=${currentOrderId}`;
            }}
            editAllowed={true}
          />
        );
      default:
        return <Company orderId={orderId} initialData={initialData} />;
    }
  };

  // Rest of the component remains the same...
  return (
    <div>
      {/* Progress Bar */}
      <div className="">
        {/* <div className="flex justify-between items-center max-w-4xl mx-auto">
          {['company', 'financial', 'forecast', 'balance'].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === stepName ? 'bg-themegreen text-white' :
                  index < ['company', 'financial', 'forecast', 'balance'].indexOf(currentStep) ?
                    'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm ${currentStep === stepName ? 'text-themegreen font-semibold' : 'text-gray-600'
                }`}>
                {stepName.charAt(0).toUpperCase() + stepName.slice(1)}
              </span>
              {index < 3 && <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>}
            </div>
          ))}
        </div> */}
      </div>

      {/* Current Step */}
      {renderStep()}
    </div>
  );
}// "use client"
// const Select = dynamic(() => import("react-select"), { ssr: false });
// import React, { useState, useEffect } from 'react'
// import { verifyUserToken } from "../../../utils/verifyUserToken";
// import Axios from "../../../utils/api";
// import Slider from '@mui/material/Slider';
// import Image from 'next/image';
// import Swal from 'sweetalert2';
// import SalesChart from "../../component/charts/SalesChart";
// import CogsChart from "../../component/charts/CogsChart";
// import EbitdaChart from "../../component/charts/EbitdaChart";
// import NetProfitChart from "../../component/charts/NetProfitChart";
// import NetMarginChart from "../../component/charts/NetMarginChart";
// import GeneralButton from "../../component/GeneralButton";
// import CircularProgress from "@mui/material/CircularProgress";
// import { HiXMark } from "react-icons/hi2";
// import { useRouter } from "next/navigation";
// import { useMemo } from "react";
// import GeoMap from "../../component/charts/GeoMap";
// import { components } from "react-select";
// import countryList from "react-select-country-list";
// import currencyCodes from "currency-codes";
// import dynamic from "next/dynamic";
// import { IoMdArrowDropdown } from "react-icons/io";
// import CustomDropdown from "../../component/CustomDropdown";
// const PhoneInput = dynamic(() => import("react-phone-input-2"), { ssr: false });

// import "react-phone-input-2/lib/style.css";
// const DropdownIndicator = (props) => {
//   return (
//     <components.DropdownIndicator {...props}>
//       <IoMdArrowDropdown size={18} color="#1aa79c" />
//     </components.DropdownIndicator>
//   );
// };
// export default function DashboardPage() {

//   const [isStep1, setIsStep1] = useState(true);
//   const options = useMemo(() => countryList().getData(), []);
//   const [contactNumber, setContactNumber] = useState("");
//   //  const [countries, setCountries] = useState([]);
//   const [businessYears, setbusinessYears] = useState([]);
//   const [historicalTrends, sethistoricalTrends] = useState([]);
//   const [availableSubIndustries, setAvailableSubIndustries] = useState([]);
//   const [currency, setCurrency] = useState([]);
//   const [countryCode, setCountryCode] = useState("in");
//   const [formData, setFormData] = useState({
//     companyName: "",
//     companyType: "",
//     industryType: "",
//     similarCompany: "",
//     yearsInBusiness: "",
//     country: "",
//     yearEndDay: "",
//     yearEndMonth: "",
//     yearEndYear: "",
//     earningTrend: "",
//     businessDescription: "",
//     email: "",
//     currency: "",
//   });
//   // --- Financial Form State ---
//   const [financialData, setFinancialData] = useState({
//     valueUnit: "Million",
//     sales: "",
//     costOfSales: "",
//     ebitda: "",
//     depreciation: "",
//     interestExpense: "",
//     netProfit: "",
//     cashBalance: "",
//     debtLoan: "",
//     equity: "",
//     receivables: "",
//     inventorie: "",
//     payables: "",
//     netFixedAssets: "",
//   });
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };
//   const handleFinancialChange = (e) => {
//     const { name, value } = e.target;
//     setFinancialData((prev) => ({ ...prev, [name]: value }));
//   }
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const finalData = { ...formData, ...financialData, contactNumber };
//     alert(JSON.stringify(finalData, null, 2));
//   };
//   const router = useRouter();
//   const goToOrders = () => {
//     router.push("/dashboard/order"); // equivalent to navigate("/dashboard")
//   };
//   const [recievedDays, setRecievedDays] = useState(40);
//   const [inventeryDays, setInventeryDays] = useState(40);
//   const [payableDays, setPayableDays] = useState(40);
//   const [submitOrder, setSubmitOrder] = useState(false);
//   const [ConfirmSubmitOrder, setConfirmSubmitOrder] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [orderStatus, setOrderStatus] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const selectStyles = {
//     control: (base) => ({
//       ...base,
//       borderRadius: "6px",
//       borderColor: "#d1d5db",
//       boxShadow: "none",
//       "&:hover": { borderColor: "#1aa79c" },
//       minHeight: "38px",
//     }),
//     dropdownIndicator: (base) => ({
//       ...base,
//       padding: "4px",
//     }),
//   };
//   // const router = useRouter();
//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('authToken');
//       try {
//         setIsLoading(true);
//         const response = await Axios.get('/api/front/formdata', {
//           headers: {
//             Authorization: `${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (response.status) {
//           if (response.data.data.planData.ActiveplanAvailable === false && response.data.data.planData.noPlan === false && !orderId) {
//             Swal.fire({
//               icon: 'error',
//               title: 'Error',
//               text: 'You do not have any active plan. Please purchase a plan first.',
//             }).then(() => {
//               router.push('/pricing'); // Redirect to home or another page
//             });
//           } else if (response.data.data.planData.ActiveplanAvailable === false && response.data.data.planData.noPlan === true && !orderId) {
//             Swal.fire({
//               icon: 'error',
//               title: 'Error',
//               text: 'You do not have any active plan. Please purchase a plan first.',
//             }).then(() => {
//               router.push('/orders'); // Redirect to home or another page
//             });
//           }
//           else if (response.data.data.planData.ActiveplanAvailable === true || orderId) {
//             // setCountries(response.data.data.countries);
//             // sethistoricalTrends(response.data.data.historicaltrends);
//             // setbusinessYears(response.data.data.businessdata);
//             // setCurrency(response.data.data.currency);
//             setAvailableSubIndustries(response.data.data.subIndustries);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, [])
//   const [currencyOptions, setCurrencyOptions] = useState([]);

//   useEffect(() => {
//     if (currencyCodes?.data) {
//       const formatted = currencyCodes.data.map((c) => ({
//         label: `${c.currency} (${c.code})`,
//         value: c.code,
//       }));
//       setCurrencyOptions(formatted);  // ✔️ Safe (runs only when API updates)
//     }
//   }, [currencyCodes]);

//   useEffect(() => {
//     async function checkAuth() {
//       const valid = await verifyUserToken();
//       if (!valid) {
//         router.push("/auth/login");
//       } else {
//         setLoading(false);
//       }
//     }
//     checkAuth();
//   }, [router]);

//   if (loading) return <p className="flex h-full justify-center items-center "><CircularProgress size={40} style={{ color: "#16a085" }} /></p>;
//   const validateForm = () => {
//     const requiredFields = [
//       "companyName",
//       "companyType",
//       "industryType",
//       "similarCompany",
//       "yearsInBusiness",
//       "country",
//       "yearEndDay",
//       "yearEndMonth",
//       "yearEndYear",
//       "earningTrend",
//       "businessDescription",
//       "email",
//       "currency",
//     ];

//     for (let field of requiredFields) {
//       if (!formData[field] || formData[field] === "") {
//         return { valid: false, field };
//       }
//     }

//     if (!contactNumber) {
//       return { valid: false, field: "contactNumber" };
//     }

//     return { valid: true };
//   };



//   return (
//     <>
//       {/* step1 */}
//       {isStep1 &&
//         <div className='lg:ps-8 bg-gray-50 p-3 lg:pe-14 xl:pe-24 lg:pt-3'>
//           <div className='flex flex-col  justify-between   gap-2 md:gap-0'>
//             <div className='' >
//               <span className='text-[22px]  cxs:text-[28px] text-gray-700 font-bold font-sans '> New Order:</span>
//               <span className='text-[18px] cxs:text-[26px]  text-gray-700  fw-medium font-sans '> Business Detail</span>
//               <p className='text-gray-700 text-sm text-medium'>We would appreciate it if you could share your company information.</p>
//             </div>
//             <div className="w-full flex justify-end  text-[10px] cxs:text-sm" >
//               <p className='text-themegreen  '> (Fields marked with * can be negative)</p>
//             </div>
//           </div>
//           <div className="flex lg:flex-row flex-col gap-4 lg:gap-8  cxs:py-4 lg:py-6  py-2 xl:py-8 ">
//             {/* left */}
//             <div className="w-full flex justify-end  text-flex flex-col lg:w-[33%] h-fit p-2 xs:p-4 bg-white rounded-md [10px] cxs:text-sm">
//               <div className="flex gap-3 flex-col h-[76vh] overflow-y-scroll custom-scrollbar ">
//                 <form
//                   onSubmit={handleSubmit}
//                   className="bg-white shadow-lg rounded-lg ps-0 pe-3 xl:ps-4 xl:pe-6 text-xs  w-full lg:max-w-lg space-y-5"
//                 >
//                   {/* Company Name */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2 ">
//                       Company Name
//                     </label>
//                     <input
//                       type="text"
//                       name="companyName"
//                       value={formData.companyName}
//                       onChange={handleChange}
//                       placeholder="e.g. Fin Advisor Private"
//                       className="w-full h-[38px] border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none "
//                     />
//                   </div>

//                   {/* Company Type */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       Company Type
//                     </label>
//                     <Select
//                       components={{ DropdownIndicator, IndicatorSeparator: () => null, }}
//                       styles={selectStyles}
//                       options={[
//                         { value: "Private", label: "Private" },
//                         { value: "Public", label: "Public" },
//                       ]}
//                       value={
//                         formData.companyType
//                           ? { value: formData.companyType, label: formData.companyType }
//                           : null
//                       }
//                       onChange={(selected) =>
//                         setFormData((prev) => ({ ...prev, companyType: selected.value }))
//                       }
//                       placeholder="Select Type"
//                     />
//                   </div>

//                   {/* Industry Type */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       Industry Type
//                     </label>
//                     <div className=" " >
//                       <CustomDropdown
//                         data={availableSubIndustries}
//                         value={formData.industryType}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             industryType: e.target.value,
//                           }))
//                         }
//                         name="industryType"
//                         disabled={orderStatus === "Completed"}
//                         suffixIcon={<IoMdArrowDropdown size={18} color="#1aa79c" />}
//                       />
//                     </div>


//                   </div>

//                   {/* Similar Company */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       Similar Company
//                     </label>
//                     <input
//                       type="text"
//                       name="similarCompany"
//                       value={formData.similarCompany}
//                       placeholder='Write your similar company name'
//                       onChange={handleChange}
//                       className="w-full h-[38px] border border-gray-300 rounded-md p-2  focus:border-themegreen focus:outline-none "
//                     />
//                   </div>

//                   {/* Years in Business */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       Years in Business
//                     </label>
//                     <input
//                       type="number"
//                       name="yearsInBusiness"
//                       placeholder='Write here'
//                       value={formData.yearsInBusiness}
//                       onChange={handleChange}
//                       min="0"
//                       className="w-full h-[38px] border border-gray-300 rounded-md p-2  focus:border-themegreen focus:outline-none "
//                     />
//                   </div>

//                   {/* Country */}

//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       Country
//                     </label>
//                     <Select
//                       components={{ DropdownIndicator }}
//                       styles={selectStyles}
//                       options={options}
//                       value={
//                         formData.country
//                           ? {
//                             value: formData.country.toUpperCase(),   // "IN"
//                             label: formData.countryFullName          // "India"
//                           }
//                           : null
//                       }

//                       onChange={(selected) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           country: selected.value.toLowerCase(),   // ISO code (in, us, br)
//                           countryFullName: selected.label          // Full Country Name (India, United States)

//                         }))
//                       }

//                       placeholder="Select Country"
//                       className="text-xs focus:border-themegreen focus:outline-none"
//                     />

//                   </div>

//                   {/* When did your financial year end? */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       When did your financial year end?
//                     </label>
//                     <div className="flex gap-2">
//                       {/* Day Select */}
//                       <Select
//                         components={{ DropdownIndicator, IndicatorSeparator: () => null }}
//                         styles={selectStyles}
//                         options={Array.from({ length: 31 }, (_, i) => ({
//                           value: i + 1,
//                           label: String(i + 1),
//                         }))}
//                         value={
//                           formData.yearEndDay
//                             ? { value: formData.yearEndDay, label: String(formData.yearEndDay) }
//                             : null
//                         }
//                         onChange={(selected) =>
//                           setFormData((prev) => ({ ...prev, yearEndDay: selected.value }))
//                         }
//                         placeholder="Day"
//                         className="w-1/3"
//                       />

//                       {/* Month Select */}
//                       <Select
//                         components={{ DropdownIndicator, IndicatorSeparator: () => null }}
//                         styles={selectStyles}
//                         options={[
//                           "January", "February", "March", "April", "May", "June",
//                           "July", "August", "September", "October", "November", "December",
//                         ].map((m) => ({ value: m, label: m }))}
//                         value={
//                           formData.yearEndMonth
//                             ? { value: formData.yearEndMonth, label: formData.yearEndMonth }
//                             : null
//                         }
//                         onChange={(selected) =>
//                           setFormData((prev) => ({ ...prev, yearEndMonth: selected.value }))
//                         }
//                         placeholder="Month"
//                         className="w-1/3"
//                       />

//                       {/* Year Select */}
//                       <Select
//                         components={{ DropdownIndicator, IndicatorSeparator: () => null }}
//                         styles={selectStyles}
//                         options={Array.from({ length: 30 }, (_, i) => {
//                           const year = new Date().getFullYear() - i;
//                           return { value: year, label: String(year) };
//                         })}
//                         value={
//                           formData.yearEndYear
//                             ? { value: formData.yearEndYear, label: String(formData.yearEndYear) }
//                             : null
//                         }
//                         onChange={(selected) =>
//                           setFormData((prev) => ({ ...prev, yearEndYear: selected.value }))
//                         }
//                         placeholder="Year"
//                         className="w-1/3"
//                       />
//                     </div>
//                   </div>

//                   {/* Earning Trend */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       Historical Earning Trend
//                     </label>
//                     <Select
//                       components={{ DropdownIndicator, IndicatorSeparator: () => null, }}
//                       styles={selectStyles}
//                       options={[
//                         { value: "increasing_non_sustainable", label: "Increasing Revenues 10–20% Y-o-Y, non-sustainable" },
//                         { value: "declining_no_turnaround", label: "Declining Revenues 10–20% Y-o-Y, no turnaround yet" },
//                         { value: "steady_sustainable", label: "Steady Revenue, sustainable" },
//                         { value: "increasing_sustainable", label: "Increasing Revenues 10–20% Y-o-Y, sustainable" },
//                         { value: "declining_turnaround", label: "Declining Revenues 10–20% Y-o-Y, turnaround started" },
//                       ]}
//                       value={
//                         formData.earningTrend
//                           ? { value: formData.earningTrend, label: formData.earningTrend }
//                           : null
//                       }
//                       onChange={(selected) =>
//                         setFormData((prev) => ({ ...prev, earningTrend: selected.value }))
//                       }
//                       placeholder="Select Trend"
//                     />
//                   </div>

//                   {/* Business Description */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       Business Description
//                     </label>
//                     <textarea
//                       name="businessDescription"
//                       value={formData.businessDescription}
//                       onChange={handleChange}
//                       rows={5}
//                       placeholder='Write here'
//                       className="w-full border border-gray-300 rounded-md p-2  focus:border-themegreen focus:outline-none "
//                     />
//                   </div>

//                   {/* Contact Number */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       Contact Number
//                     </label>
//                     {typeof window !== "undefined" && (

//                       <PhoneInput
//                         enableSearch={true}
//                         country={countryCode}
//                         value={contactNumber}
//                         onChange={(phone, country) => {
//                           setContactNumber(phone);
//                           if (country?.countryCode !== countryCode) setCountryCode(country.countryCode);
//                         }}
//                         inputStyle={{
//                           width: "100%",
//                           borderRadius: "6px",
//                           border: "1px solid #d1d5db",
//                           padding: "8px 8px 8px 48px"
//                         }}
//                       />
//                     )}
//                   </div>



//                   {/* Email */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder='write your email here...'
//                       className="w-full border border-gray-300 rounded-md p-2  focus:border-themegreen focus:outline-none"
//                     />
//                   </div>

//                   {/* Currency */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       Which currency do you use?
//                     </label>
//                     <Select
//                       components={{ DropdownIndicator, IndicatorSeparator: () => null, }}
//                       styles={selectStyles}
//                       options={currencyOptions}
//                       value={
//                         formData.currency
//                           ? { value: formData.currency, label: formData.currency }
//                           : null
//                       }
//                       onChange={(selected) =>
//                         setFormData((prev) => ({ ...prev, currency: selected.value }))
//                       }
//                       placeholder="Select Currency"
//                     />
//                   </div>

//                   {/* Submit Button */}
//                   {/* <button
//                     type="submit"
//                     className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
//                   >
//                     Submit
//                   </button> */}
//                 </form>
//               </div>
//               <div className='flex py-6 xl:py-10 px-2 sm:px-0 mt-2 md:mt-0 flex-col sm:flex-row justify-center gap-3'>
//                 <button className="bg-gray-400 text-center  sm:w-[131px] hover:bg-gray-500 text-white   py-2 text-sm  rounded-md">
//                   Cancel
//                 </button>
//                 <button onClick={(e) => {
//                   e.preventDefault();
//                   const check = validateForm();

//                   if (!check.valid) {
//                     Swal.fire({
//                       icon: "error",
//                       title: "Missing Required Field",
//                       text: `Please fill the "${check.field}" field before continuing.`,
//                     });
//                     return;
//                   }
//                   setIsStep1(true)
//                   // router.push("/dashboard/order");
//                 }} className="bg-themegreen   hover:bg-teal-600 text-white  px-8  lg:px-[22px]  py-2 text-sm  rounded-md">
//                   Continue
//                 </button>
//               </div>
//             </div>
//             {/* right */}
//             <div className='flex-1'>
//               <div className='w-full'>
//                 <div className="flex gap-3 flex-col cxs:grid  cxs:grid-cols-3  cxs:gap-4  w-full">
//                   {/* First row */}
//                   {formData.companyName && (
//                     <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                       <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                       <p className='text-gray-400 text-xs mb-1  text-medium'>Company Name</p>
//                       <p className='text-gray-700 text-xs mb-1 text-medium'>  {formData.companyName}</p>
//                     </div>
//                   )}
//                   {formData.companyType && (
//                     <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                       <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                       <p className='text-gray-400 text-xs mb-1  text-medium'>Company Type</p>
//                       <p className='text-gray-700 text-xs mb-1 text-medium'>{formData.companyType}  </p>
//                     </div>
//                   )}
//                   {formData.industryType && (
//                     <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                       <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                       <p className='text-gray-400 text-xs mb-1  text-medium'> Industry Type</p>
//                       <p className='text-gray-700 text-xs mb-1 text-medium'> {formData.industryType}</p>
//                     </div>
//                   )}
//                   {/* Second row */}
//                   {/* Left Side (Info + Icon) */}
//                   {formData.country && (
//                     <div className="h-34 col-span-2 bg-white  rounded-lg w-full relative p-3 flex  gap-1 xs:gap-0 justify-between items-center">



//                       <div className="">
//                         <span className="inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen"></span>
//                         <p className="text-gray-400 text-xs font-medium mb-1">Country</p>
//                         <p className="text-gray-700 text-xs mb-1 text-medium">{formData.countryFullName}</p>
//                       </div>

//                       <div className="relative w-[80%] h-32">
//                         <GeoMap selectedCountry={formData.country} />
//                       </div>


//                     </div>
//                   )}
//                   {/* <div className="h-34 bg-purple-500 rounded-lg w-full "></div> */}
//                   {formData.yearsInBusiness && (
//                     <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                       <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                       <p className='text-gray-400 text-xs mb-1  text-medium'>Yerars in Busines</p>
//                       <p className='text-gray-700 text-xs mb-1 text-medium'>{formData.yearsInBusiness}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       }
//       {/* step2 */}
//       {isStep1 &&
//         <div className='lg:ps-8 bg-gray-50 p-3 lg:pe-14 xl:pe-24 lg:pt-3'>
//           <div className='flex flex-col  justify-between   gap-2 md:gap-0'>
//             <div className='' >
//               <span className='text-[22px]  cxs:text-[28px] text-gray-700 font-bold font-sans '> New Order:</span>
//               <span className='text-[18px] cxs:text-[26px]  text-gray-700  fw-medium font-sans  '> Current Financial Information</span>
//               <p className='text-gray-700 text-sm text-medium'>  Ensure that all values are positive numbers with up to two decimal places, and also include the historical
//                 numbers for the year 2024.</p>

//             </div>
//             <div className="w-full flex justify-end  text-[10px] cxs:text-sm" >
//               <p className='text-themegreen  '> (Fields marked with * can be negative)</p>
//             </div>
//           </div>
//           <div className="flex lg:flex-row flex-col gap-4 lg:gap-8  cxs:py-4 lg:py-6  py-2 xl:py-8 ">
//             {/* lrft */}
//             <div className="w-full flex justify-end  text-flex flex-col lg:w-[33%] h-fit p-2 xs:p-4 bg-white rounded-md [10px] cxs:text-sm">
//               <div className="flex gap-3 flex-col h-[76vh] overflow-y-scroll custom-scrollbar ">
//                 <form
//                   onSubmit={handleSubmit}
//                   className="bg-white shadow-lg rounded-lg ps-0 pe-3 xl:ps-4 xl:pe-6 text-xs  w-full lg:max-w-lg space-y-5"
//                 >

//                   {/* Value Unit */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       All values are in
//                     </label>
//                     <Select
//                       components={{ DropdownIndicator, IndicatorSeparator: () => null, }}
//                       styles={selectStyles}
//                       options={[
//                         { value: "Trillion", label: "Trillion" },
//                         { value: "Million", label: "Million" },
//                         { value: "Billion", label: "Billion" },
//                         { value: "Thousand", label: "Thousand" },

//                       ]}
//                       value={
//                         financialData.valueUnit
//                           ? { value: financialData.valueUnit, label: financialData.valueUnit }
//                           : null
//                       }
//                       onChange={(selected) =>
//                         setFinancialData((prev) => ({ ...prev, valueUnit: selected.value }))
//                       }
//                       placeholder="Select unit"
//                     />
//                   </div>
//                   {/* Sales */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">Sales</label>
//                     <input
//                       type="text"
//                       name="sales"
//                       value={financialData.sales}
//                       onChange={handleFinancialChange}
//                       placeholder="Enter Sales"
//                       className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none"
//                     />
//                   </div>

//                   {/* Cost of Sales */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       Cost of Sales
//                     </label>
//                     <Select
//                       components={{ DropdownIndicator, IndicatorSeparator: () => null, }}
//                       styles={selectStyles}
//                       options={[
//                         { value: "Million", label: "Million" },
//                         { value: "Billion", label: "Billion" },
//                         { value: "Thousand", label: "Thousand" },
//                       ]}
//                       value={
//                         financialData.costOfSales
//                           ? { value: financialData.costOfSales, label: financialData.costOfSales }
//                           : null
//                       }
//                       onChange={(selected) =>
//                         setFinancialData((prev) => ({ ...prev, costOfSales: selected.value }))
//                       }
//                       placeholder="Select Cost of sales "
//                     />
//                   </div>

//                   {/* EBITDA */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       EBITDA*
//                     </label>
//                     <Select
//                       components={{ DropdownIndicator, IndicatorSeparator: () => null, }}
//                       styles={selectStyles}
//                       options={[
//                         { value: "Million", label: "Million" },
//                         { value: "Billion", label: "Billion" },
//                         { value: "Thousand", label: "Thousand" },
//                       ]}
//                       value={
//                         financialData.ebitda
//                           ? { value: financialData.ebitda, label: financialData.ebitda }
//                           : null
//                       }
//                       onChange={(selected) =>
//                         setFinancialData((prev) => ({ ...prev, ebitda: selected.value }))
//                       }
//                       placeholder="Select ebitda "
//                     />
//                   </div>

//                   {/* Depreciation */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       Depreciation
//                     </label>
//                     <Select
//                       components={{ DropdownIndicator, IndicatorSeparator: () => null, }}
//                       styles={selectStyles}
//                       options={[
//                         { value: "Million", label: "Million" },
//                         { value: "Billion", label: "Billion" },
//                         { value: "Thousand", label: "Thousand" },
//                       ]}
//                       value={
//                         financialData.depreciation
//                           ? { value: financialData.depreciation, label: financialData.depreciation }
//                           : null
//                       }
//                       onChange={(selected) =>
//                         setFinancialData((prev) => ({ ...prev, depreciation: selected.value }))
//                       }
//                       placeholder="Select depreciation "
//                     />
//                   </div>


//                   {/* Interest Expense */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">
//                       Interest Expense
//                     </label>
//                     <Select
//                       components={{ DropdownIndicator, IndicatorSeparator: () => null, }}
//                       styles={selectStyles}
//                       options={[
//                         { value: "Million", label: "Million" },
//                         { value: "Billion", label: "Billion" },
//                         { value: "Thousand", label: "Thousand" },
//                       ]}
//                       value={
//                         financialData.interestExpense
//                           ? { value: financialData.interestExpense, label: financialData.interestExpense }
//                           : null
//                       }
//                       onChange={(selected) =>
//                         setFinancialData((prev) => ({ ...prev, interestExpense: selected.value }))
//                       }
//                       placeholder="Select interest expense "
//                     />
//                   </div>


//                   {/* Net Profit */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">Net Profit*</label>
//                     <input
//                       type="text"
//                       name="netProfit"
//                       value={financialData.netProfit}
//                       onChange={handleFinancialChange}
//                       placeholder="Enter Net Profit"
//                       className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none"
//                     />
//                   </div>

//                   {/* Cash Balance */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">Cash Balance</label>
//                     <input
//                       type="text"
//                       name="cashBalance"
//                       value={financialData.cashBalance}
//                       onChange={handleFinancialChange}
//                       placeholder="Enter Cash Balance"
//                       className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none"
//                     />
//                   </div>

//                   {/* Debt Loan */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">Debt Loan</label>
//                     <input
//                       type="text"
//                       name="debtLoan"
//                       value={financialData.debtLoan}
//                       onChange={handleFinancialChange}
//                       placeholder="Enter Debt Loan"
//                       className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none"
//                     />
//                   </div>
//                   {/* Equity*/}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">Equity</label>
//                     <input
//                       type="text"
//                       name="equity"
//                       value={financialData.equity}
//                       onChange={handleFinancialChange}
//                       placeholder="Enter your equity"
//                       className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none"
//                     />
//                   </div>
//                   {/* Receivables*/}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">Receivables</label>
//                     <input
//                       type="text"
//                       name="receivables"
//                       value={financialData.receivables}
//                       onChange={handleFinancialChange}
//                       placeholder="Enter your receivables"
//                       className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none"
//                     />
//                   </div>
//                   {/*  Inventories*/}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">Inventories</label>
//                     <input
//                       type="text"
//                       name="inventories"
//                       value={financialData.inventories}
//                       onChange={handleFinancialChange}
//                       placeholder="Enter your inventories"
//                       className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none"
//                     />
//                   </div>
//                   {/* Payables*/}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">Payables</label>
//                     <input
//                       type="text"
//                       name="payables"
//                       value={financialData.payables}
//                       onChange={handleFinancialChange}
//                       placeholder="Enter your payables"
//                       className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none"
//                     />
//                   </div>
//                   {/* Net Fixed Asset*/}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-2">Net Fixed Asset</label>
//                     <input
//                       type="text"
//                       name="netFixedAssets"
//                       value={financialData.netFixedAssets}
//                       onChange={handleFinancialChange}
//                       placeholder="Enter your net fixed asset"
//                       className="w-full border border-gray-300 rounded-md p-2 focus:border-themegreen focus:outline-none"
//                     />
//                   </div>
//                 </form>
//               </div>
//               <div className='x-0 flex py-6 xl:py-10 px-2 sm:p mt-2 md:mt-0 flex-col sm:flex-row justify-center gap-3'>
//                 <button className="bg-gray-400 text-center  sm:w-[131px] hover:bg-gray-500 text-white   py-2 text-sm  rounded-md">
//                   Back
//                 </button>
//                 <button className="bg-themegreen   hover:bg-teal-600 text-white  px-8  lg:px-[22px]  py-2 text-sm  rounded-md">
//                   Continue
//                 </button>
//               </div>
//             </div>
//             {/* right */}
//             <div className='flex-1'>
//               <div className='w-full'>
//                 <div className="flex gap-3 flex-col cxs:grid  cxs:grid-cols-3  cxs:gap-4  w-full">
//                   {/* First row */}
//                   {formData.companyName && (
//                     <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                       <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                       <p className='text-gray-400 text-xs mb-1  text-medium'>Company Name</p>
//                       <p className='text-gray-700 text-xs mb-1 text-medium'>  {formData.companyName}</p>
//                     </div>
//                   )}
//                   {formData.companyType && (
//                     <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                       <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                       <p className='text-gray-400 text-xs mb-1  text-medium'>Company Type</p>
//                       <p className='text-gray-700 text-xs mb-1 text-medium'>{formData.companyType}  </p>
//                     </div>
//                   )}
//                   {formData.industryType && (
//                     <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                       <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                       <p className='text-gray-400 text-xs mb-1  text-medium'> Industry Type</p>
//                       <p className='text-gray-700 text-xs mb-1 text-medium'> {formData.industryType}</p>
//                     </div>
//                   )}
//                   {/* Second row */}
//                   {/* Left Side (Info + Icon) */}
//                   {formData.country && (
//                     <div className="h-34 col-span-2 bg-white  rounded-lg w-full relative p-3 flex  gap-1 xs:gap-0 justify-between items-center">



//                       <div className="">
//                         <span className="inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen"></span>
//                         <p className="text-gray-400 text-xs font-medium mb-1">Country</p>
//                         <p className="text-gray-700 text-xs mb-1 text-medium">{formData.countryFullName}</p>
//                       </div>

//                       <div className="relative w-[80%] h-32">
//                         <GeoMap selectedCountry={formData.country} />
//                       </div>


//                     </div>
//                   )}
//                   {/* <div className="h-34 bg-purple-500 rounded-lg w-full "></div> */}
//                   {formData.yearsInBusiness && (
//                     <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                       <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                       <p className='text-gray-400 text-xs mb-1  text-medium'>Yerars in Busines</p>
//                       <p className='text-gray-700 text-xs mb-1 text-medium'>{formData.yearsInBusiness}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       }
//       {/* stepo-3 */}
//       <div className='lg:ps-8 bg-gray-50 p-3 lg:pe-14 xl:pe-24 lg:pt-3'>
//         <div className='flex flex-col  justify-between   gap-2 md:gap-0'>
//           <div className='' >
//             <span className='text-[22px]  cxs:text-[28px] text-gray-700 font-bold font-sans '> New Order:</span>
//             <span className='text-[18px] cxs:text-[26px]  text-gray-700  fw-medium font-sans '> Financial Projections</span>
//             <p className='text-gray-700 text-sm text-medium'> Income Statement Assumptions</p>

//           </div>
//           <div className="w-full flex justify-end  text-[10px] cxs:text-sm" >
//             <p className='text-themegreen  '> (Fields marked with * can be negative)</p>
//           </div>
//         </div>
//         <div className="flex lg:flex-row flex-col gap-4 lg:gap-8  cxs:py-4 lg:py-6  py-2 xl:py-8 ">
//           {/* left */}
//           <div className="flex flex-col w-full lg:w-[33%] h-fit  p-2 cxs:p-4 bg-white rounded-md ">
//             <div className="flex gap-4 flex-col h-[76vh] lg:pe-2 xl:pe-0 overflow-y-scroll custom-scrollbar ">
//               <div className="">
//                 <p className=" text-xs text-gray-700 mb-2"> Forecasted Sales Growth Rate (Y-o-Y) </p>
//                 <div className="flex flex-wrap gap-1 xs:gap-2">

//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>  <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="">
//                 <p className=" mb-2 text-xs text-gray-700">Forecasted COGS (as % of Revenue)</p>
//                 <div className="flex flex-wrap gap-1 xs:gap-2">

//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>  <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="">
//                 <p className=" text-xs text-gray-700 mb-2">  Forecasted EBITDA Margis</p>
//                 <div className="flex flex-wrap gap-1 xs:gap-2">

//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>  <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="">
//                 <p className=" mb-2 text-xs text-gray-700"> Interest Rate</p>
//                 <div className="flex flex-wrap gap-1 xs:gap-2">

//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>  <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="">
//                 <p className=" text-xs text-gray-700 mb-2">Depreciation Rate</p>
//                 <div className="flex flex-wrap gap-1 xs:gap-2">

//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>  <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="">
//                 <p className=" mb-2 text-xs text-gray-700"> Forecasted Net Profit Margin</p>
//                 <div className="flex flex-wrap gap-1 xs:gap-2">

//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>  <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className='flex py-6 xl:py-10 px-2 sm:px-0 mt-2 md:mt-0 flex-col sm:flex-row justify-center gap-3'>
//               <button className="bg-gray-400 text-center  sm:w-[131px] hover:bg-gray-500 text-white   py-2 text-sm  rounded-md">
//                 Back
//               </button>
//               <button className="bg-themegreen   hover:bg-teal-600 text-white  px-8  lg:px-[22px]  py-2 text-sm  rounded-md">
//                 Continue
//               </button>
//             </div>
//           </div>
//           {/* right */}
//           <div className='flex-1'>
//             <div className='w-full'>
//               <div className="flex gap-3 flex-col cxs:grid  cxs:grid-cols-3  cxs:gap-4  w-full">
//                 {/* First row */}
//                 {formData.companyName && (
//                   <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                     <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                     <p className='text-gray-400 text-xs mb-1  text-medium'>Company Name</p>
//                     <p className='text-gray-700 text-xs mb-1 text-medium'>  {formData.companyName}</p>
//                   </div>
//                 )}
//                 {formData.companyType && (
//                   <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                     <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                     <p className='text-gray-400 text-xs mb-1  text-medium'>Company Type</p>
//                     <p className='text-gray-700 text-xs mb-1 text-medium'>{formData.companyType}  </p>
//                   </div>
//                 )}
//                 {formData.industryType && (
//                   <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                     <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                     <p className='text-gray-400 text-xs mb-1  text-medium'> Industry Type</p>
//                     <p className='text-gray-700 text-xs mb-1 text-medium'> {formData.industryType}</p>
//                   </div>
//                 )}
//                 {/* Second row */}
//                 {/* Left Side (Info + Icon) */}
//                 {formData.country && (
//                   <div className="h-34 col-span-2 bg-white  rounded-lg w-full relative p-3 flex  gap-1 xs:gap-0 justify-between items-center">



//                     <div className="">
//                       <span className="inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen"></span>
//                       <p className="text-gray-400 text-xs font-medium mb-1">Country</p>
//                       <p className="text-gray-700 text-xs mb-1 text-medium">{formData.countryFullName}</p>
//                     </div>

//                     <div className="relative w-[80%] h-32">
//                       <GeoMap selectedCountry={formData.country} />
//                     </div>


//                   </div>
//                 )}
//                 {/* <div className="h-34 bg-purple-500 rounded-lg w-full "></div> */}
//                 {formData.yearsInBusiness && (
//                   <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                     <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                     <p className='text-gray-400 text-xs mb-1  text-medium'>Yerars in Busines</p>
//                     <p className='text-gray-700 text-xs mb-1 text-medium'>{formData.yearsInBusiness}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* step4 */}
//       <div className='lg:ps-8 bg-gray-50 p-3 lg:pe-14 xl:pe-24 lg:pt-3'>
//         <div className='flex flex-col  justify-between   gap-2 md:gap-0'>
//           <div className='' >
//             <span className='text-[22px]  cxs:text-[28px] text-gray-700 font-bold font-sans '> New Order:</span>
//             <span className='text-[18px] cxs:text-[26px]  text-gray-700  fw-medium font-sans '> Financial Projections</span>
//             <p className='text-gray-700 text-sm text-medium'>Balance Sheet Assumption</p>

//           </div>
//           <div className="w-full flex justify-end  text-[10px] cxs:text-sm" >
//             <p className='text-themegreen  '> (Fields marked with * can be negative)</p>
//           </div>
//         </div>
//         <div className="flex lg:flex-row flex-col gap-4 lg:gap-8  cxs:py-4 lg:py-6  py-2 xl:py-8 ">
//           {/* left */}
//           <div className="flex flex-col w-full lg:w-[33%] h-fit  p-2 cxs:p-4 bg-white rounded-md ">
//             <div className="flex gap-3 flex-col h-[76vh] overflow-y-scroll custom-scrollbar ">
//               <div className="">
//                 <p className=" text-xs text-gray-700 mb-2"> Forecasted Net Addition in CAPEX/Fixed Assets</p>
//                 <div className="flex flex-wrap gap-1 xs:gap-2">

//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>  <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="">
//                 <p className=" mb-2 text-xs text-gray-700">Forecasted Debt/Loan</p>
//                 <div className="flex flex-wrap gap-1 xs:gap-2">

//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                   <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>  <div className="flex flex-col items-center justify-start">
//                     <p className="text-center text-xs text-gray-300">2025</p>
//                     <span className="px-[6px] lg:px-1 xs:px-4 xs:py-2 cxs:px-6 cxs:py-3 py-1 xl:px-3 text-xs  rounded-md xl:py-2 border-2 border-gray-300">33.5</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="w-full flex pe-4 justify-end text-xs" >
//                 <p className='text-gray-300  '>Values In AFN (Millions)</p>
//               </div>
//               <div className='flex flex-col   gap-10 pt-6 px-3  flex- w-100'>
//                 <div className=''>
//                   <p className='text-themeblue text-sm font-bold mb-2  '>Recievable Days</p>
//                   <div className='flex  items-center gap-3 w-[]'>
//                     <Slider className='!p-0'
//                       value={recievedDays}
//                       onChange={(e, newValue) => setRecievedDays(newValue)}
//                       valueLabelDisplay="auto"
//                       min={0}
//                       max={100}
//                       step={1}
//                       sx={{
//                         color: "#1e40af", // Active part (taken range)
//                         height: 10,

//                         "& .MuiSlider-thumb": {
//                           height: 18,
//                           width: 18,
//                           backgroundColor: "#1e40af",
//                           // color:"#",
//                           border: "3px solid #5BC8FF", // thumb border
//                           "&:hover": {
//                             boxShadow: "0 0 0 8px rgba(30,64,175,0.16)",
//                           },
//                         },

//                         "& .MuiSlider-rail": {
//                           color: "#5BC8FF", // Unfilled (remaining) range
//                           opacity: 1,
//                         },

//                         "& .MuiSlider-track": {
//                           border: "none", // remove edge border
//                         },

//                         "& .MuiSlider-valueLabel": {
//                           backgroundColor: "#1e40af",
//                           fontSize: "0.75rem",
//                           borderRadius: "6px",
//                         },
//                       }}
//                     />
//                     <span className='flex items-center gap-2 text-xs'><p>{recievedDays}</p>  <p >Days</p></span>
//                   </div>
//                 </div>
//                 <div className=''>
//                   <p className='text-themeblue  text-sm font-bold mb-2 '>Inventory Days</p>
//                   <div className='flex items-center gap-3 w-[]'>
//                     <Slider className='!p-0'
//                       value={inventeryDays}
//                       onChange={(e, newValue) => setInventeryDays(newValue)}
//                       valueLabelDisplay="auto"
//                       min={0}
//                       max={100}
//                       step={1}
//                       sx={{
//                         color: "#1e40af", // Active part (taken range)
//                         height: 10,

//                         "& .MuiSlider-thumb": {
//                           height: 18,
//                           width: 18,
//                           backgroundColor: "#1e40af",
//                           // color:"#",
//                           border: "3px solid #5BC8FF", // thumb border
//                           "&:hover": {
//                             boxShadow: "0 0 0 8px rgba(30,64,175,0.16)",
//                           },
//                         },

//                         "& .MuiSlider-rail": {
//                           color: "#5BC8FF", // Unfilled (remaining) range
//                           opacity: 1,
//                         },

//                         "& .MuiSlider-track": {
//                           border: "none", // remove edge border
//                         },

//                         "& .MuiSlider-valueLabel": {
//                           backgroundColor: "#1e40af",
//                           fontSize: "0.75rem",
//                           borderRadius: "6px",
//                         },
//                       }}
//                     />


//                     <span className='flex items-center gap-2 text-xs'><p>{inventeryDays}</p>  <p>Days</p></span>
//                   </div>
//                 </div>
//                 <div className=''>
//                   <p className='text-themeblue  text-sm font-bold mb-2 '>Payable Days</p>
//                   <div className='flex items-center gap-3 w-[]'>
//                     <Slider
//                       className='!p-0'
//                       value={payableDays}
//                       onChange={(e, newValue) => setPayableDays(newValue)}
//                       valueLabelDisplay="auto"
//                       min={0}
//                       max={100}
//                       step={1}
//                       sx={{
//                         color: "#1e40af", // Active part (taken range)
//                         height: 10,

//                         "& .MuiSlider-thumb": {
//                           height: 18,
//                           width: 18,
//                           backgroundColor: "#1e40af",
//                           // color:"#",
//                           border: "3px solid #5BC8FF", // thumb border
//                           "&:hover": {
//                             boxShadow: "0 0 0 8px rgba(30,64,175,0.16)",
//                           },
//                         },

//                         "& .MuiSlider-rail": {
//                           color: "#5BC8FF", // Unfilled (remaining) range
//                           opacity: 1,
//                         },

//                         "& .MuiSlider-track": {
//                           border: "none", // remove edge border
//                         },

//                         "& .MuiSlider-valueLabel": {
//                           backgroundColor: "#1e40af",
//                           fontSize: "0.75rem",
//                           borderRadius: "6px",
//                         },
//                       }}
//                     />
//                     <span className='flex items-center gap-2 text-xs'><p>{payableDays}</p>  <p>Days</p></span>
//                   </div>
//                 </div>
//               </div>
//               <div className="w-full flex justify-end text-xs px-3 pt-3" >
//                 <p className='text-gray-300  '> Slide to pick a value from 0 to 36</p>
//               </div>
//             <div className='flex py-6 xl:py-10 px-2 sm:px-0 mt-2 md:mt-0 flex-col sm:flex-row justify-center gap-3'>
//               <button className="bg-gray-400 text-center  sm:w-[131px] hover:bg-gray-500 text-white   py-2 text-sm  rounded-md">
//                 Back
//               </button>
//               <button className="bg-themegreen   hover:bg-teal-600 text-white  px-8  lg:px-[22px]  py-2 text-sm  rounded-md">
//                 Preview Data
//               </button>
//             </div>
//           </div>
//           {/* right */}
//           <div className='flex-1'>
//             <div className='w-full'>
//               <div className="flex gap-3 flex-col cxs:grid  cxs:grid-cols-3  cxs:gap-4  w-full">
//                 {/* First row */}
//                 {formData.companyName && (
//                   <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                     <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                     <p className='text-gray-400 text-xs mb-1  text-medium'>Company Name</p>
//                     <p className='text-gray-700 text-xs mb-1 text-medium'>  {formData.companyName}</p>
//                   </div>
//                 )}
//                 {formData.companyType && (
//                   <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                     <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                     <p className='text-gray-400 text-xs mb-1  text-medium'>Company Type</p>
//                     <p className='text-gray-700 text-xs mb-1 text-medium'>{formData.companyType}  </p>
//                   </div>
//                 )}
//                 {formData.industryType && (
//                   <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                     <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                     <p className='text-gray-400 text-xs mb-1  text-medium'> Industry Type</p>
//                     <p className='text-gray-700 text-xs mb-1 text-medium'> {formData.industryType}</p>
//                   </div>
//                 )}
//                 {/* Second row */}
//                 {/* Left Side (Info + Icon) */}
//                 {formData.country && (
//                   <div className="h-34 col-span-2 bg-white  rounded-lg w-full relative p-3 flex  gap-1 xs:gap-0 justify-between items-center">



//                     <div className="">
//                       <span className="inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen"></span>
//                       <p className="text-gray-400 text-xs font-medium mb-1">Country</p>
//                       <p className="text-gray-700 text-xs mb-1 text-medium">{formData.countryFullName}</p>
//                     </div>

//                     <div className="relative w-[80%] h-32">
//                       <GeoMap selectedCountry={formData.country} />
//                     </div>


//                   </div>
//                 )}
//                 {/* <div className="h-34 bg-purple-500 rounded-lg w-full "></div> */}
//                 {formData.yearsInBusiness && (
//                   <div className="h-34 bg-white rounded-lg xl:min-w-[200px] p-4 ">
//                     <span className='inline-block w-[45px] h-[45px] mb-1 rounded-md bg-themegreen '></span>
//                     <p className='text-gray-400 text-xs mb-1  text-medium'>Yerars in Busines</p>
//                     <p className='text-gray-700 text-xs mb-1 text-medium'>{formData.yearsInBusiness}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Preview of complete DAta */}
//         <div>
//           <div >
//             <h2 className='text-[26px] fw-medium font-sans '>Overview of the Provided Data </h2>
//             <p className='text-gray-700 text-sm text-medium'> Review the input details and submit the data to the generated reports for accuracy and improved decision-making</p>
//           </div>
//           <div className='flex gap-1 md:gap-4 flex-wrap sm:flex-nowrap justify-between md:max-w-[60%] md:ps-5 my-4'>
//             <div className='bg-white w-[100%] md:w-[30%] px-3 py-2 rounded' >
//               <h4 className="text-[10px] text-gray-600">Name</h4>
//               <p className='text-gray-900 text-sm  text-medium'>SandeepSingh</p>
//             </div>
//             <div className='bg-white w-[100%] md:w-[30%] px-3 py-2 rounded' >
//               <h4 className="text-[10px] text-gray-600">PlanType
//               </h4>
//               <p className='text-gray-900 text-sm  text-medium'>A</p>
//             </div>
//             <div className='bg-white w-[100%] md:w-[30%] px-3 py-2 rounded' >
//               <h4 className="text-[10px] text-gray-600">ReportSequence</h4>
//               <p className='text-gray-900 text-sm  text-medium'>7</p>
//             </div>
//           </div>
//           <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:space-x-8 md:px-2 lg:px-0 xl:px-2 py-6">
//             {/* Left Section: Company Information */}
//             <fieldset className=' w-100 lg:w-1/2 px-3 pb-3 pt-3 xl:px-6 xl:pb-6 xl:pt-4 border border-gray-200 rounded'>
//               <legend className='m-auto'>
//                 <GeneralButton content={"Business Details"} className="bg-themeblue text-[13px] sm:text-[16px]  text-white" />
//               </legend>
//               <div className="border-l-[8px] ps-5 pe-2 xl:ps-10 py-5  border-themeblue rounded-md space-y-3" style={{
//                 boxShadow:
//                   "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px", height: "-webkit-fill-available"
//               }}
//               >

//                 <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
//                   <p className="font-medium w-[45%]">Company Name</p>
//                   :<p className="ms-2">  Johra</p>
//                 </div>
//                 <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
//                   <p className="font-medium w-[45%]">Company Type</p>
//                   :<p className="ms-2">  Private</p>
//                 </div>
//                 <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
//                   <p className="font-medium w-[45%]">Industry Type</p>
//                   :<p className="ms-2">  Textiles</p>
//                 </div>
//                 <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
//                   <p className="font-medium w-[45%]">Years in Business</p>
//                   :<p className="ms-2">  2-5 Years</p>
//                 </div>
//                 <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
//                   <p className="font-medium w-[45%]">Country</p>
//                   :<p className="ms-2">  Saudi Arabia</p>
//                 </div>
//                 <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
//                   <p className="font-medium w-[45%]">Financial Year End</p>
//                   :<p className="ms-2">  December 31</p>
//                 </div>
//                 <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
//                   <p className="font-medium w-[45%]">Historical Earning Trend</p>
//                   :<p className="ms-2">  Increasing 10-20% Y-o-Y</p>
//                 </div>
//                 <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
//                   <p className="font-medium w-[45%]">Short Description</p>
//                   :<p className="ms-2">  Test</p>
//                 </div>
//                 <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
//                   <p className="font-medium w-[45%]">Contact Number</p>
//                   :<p className="ms-2">  +91-7777777777</p>
//                 </div>
//                 <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
//                   <p className="font-medium w-[45%]">Email Address</p>
//                   :<p className="ms-2">  sandeep@scorich.com</p>
//                 </div>
//                 <div className='flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5'>
//                   <p className="font-medium w-[45%]">Company's Currency</p>
//                   :<p className="ms-2">  SAR</p>
//                 </div>
//               </div>

//             </fieldset>

//             {/* Right Section: Company Address */}
//             <fieldset className=" w-100 lg:w-1/2 px-3 pb-3 pt-3 xl:px-6 xl:pb-6 xl:pt-4 border border-gray-200 rounded">
//               <legend className="m-auto">
//                 <GeneralButton content={"Present Financial Status"} className="bg-themeblue text-[13px] sm:text-[16px]  text-white" />
//               </legend>

//               <div className="border-l-[8px] ps-5 pe-2  xl:ps-10 py-5 border-themeblue rounded-md space-y-3"
//                 style={{
//                   boxShadow:
//                     "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
//                 }}
//               >
//                 <p className='text-themeblue md:text-center  text-[14px] md:text-[16px]'>Historical Numbers for the Year 2023</p>
//                 <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
//                   <p className="font-medium w-[45%]">Sales</p>
//                   :<p className="ms-2">5,881,965.00</p>
//                 </div>
//                 <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
//                   <p className="font-medium w-[45%]">Cost of Sales</p>
//                   :<p className="ms-2">3,515,780.00</p>
//                 </div>
//                 <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
//                   <p className="font-medium w-[45%]">EBITDA</p>
//                   :<p className="ms-2">(2,613,608.00)</p>
//                 </div>
//                 <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
//                   <p className="font-medium w-[45%]">Depreciation</p>
//                   :<p className="ms-2">55,400.00</p>
//                 </div>
//                 <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
//                   <p className="font-medium w-[45%]">Interest Expense</p>
//                   :<p className="ms-2">0.00</p>
//                 </div>
//                 <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
//                   <p className="font-medium w-[45%]">Cash Balance</p>
//                   :<p className="ms-2">2,137,112.00</p>
//                 </div>
//                 <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
//                   <p className="font-medium w-[45%]">Net Profit</p>
//                   :<p className="ms-2">(2,669,008.00)</p>
//                 </div>
//                 <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
//                   <p className="font-medium w-[45%]">Debt / Loan</p>
//                   :<p className="ms-2">0.00</p>
//                 </div>
//                 <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
//                   <p className="font-medium w-[45%]">Equity</p>
//                   :<p className="ms-2">2,723,367.00</p>
//                 </div>
//                 <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
//                   <p className="font-medium w-[45%]">Receivables</p>
//                   :<p className="ms-2">723,392.00</p>
//                 </div>
//                 <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
//                   <p className="font-medium w-[45%]">Inventories</p>
//                   :<p className="ms-2">0.00</p>
//                 </div>
//                 <div className="flex text-[10px] sm:text-[12px] lg:gap-3 xl:gap-5">
//                   <p className="font-medium w-[45%]">Payables</p>
//                   :<p className="ms-2">0.00</p>
//                 </div>
//                 <p className='text-gray-400 text-[10px]  text-medium'>All Financial number specified in (Millions) </p>

//               </div>
//             </fieldset>

//           </div>
//           <div className='overflow-x-auto'>
//             <fieldset className="w-100 px-3 md:px-6 pb-6 pt-4 border border-gray-200 rounded">
//               <legend className="md:m-auto">
//                 <GeneralButton content={"Financial Projections"} className="bg-themeblue text-white" />
//               </legend>
//               <div className=''>
//                 <div
//                   className="  p-3   rounded-md space-y-3"
//                   style={{
//                     boxShadow:
//                       "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
//                   }}
//                 >
//                   <div className="">
//                     <table className=" min-w-full table-auto text-[12px]">
//                       <thead>
//                         <tr className=" border-b ">
//                           <th className="px-4 font-light py-3 text-left">Income Statement Assumptions</th>
//                           <th className="px-4 font-light py-3 text-center">2024</th>
//                           <th className="px-4 font-light py-3 text-center">2025</th>
//                           <th className="px-4 font-light py-3 text-center">2026</th>
//                           <th className="px-4 font-light py-3 text-center">2027</th>
//                           <th className="px-4 font-light py-3 text-center">2028</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         <tr className=" bg-gray-50">
//                           <td className="px-4 py-3">Forecasted Sales Growth Rate (Y-o-Y) (%)</td>
//                           <td className="px-4 py-3 text-center">152.00</td>
//                           <td className="px-4 py-3 text-center">209.00</td>
//                           <td className="px-4 py-3 text-center">54.00</td>
//                           <td className="px-4 py-3 text-center">110.00</td>
//                           <td className="px-4 py-3 text-center">219.00</td>
//                         </tr>
//                         <tr className=" -gray-50">
//                           <td className="px-4 py-3">Forecasted COGS (as % of revenue) (%)</td>
//                           <td className="px-4 py-3 text-center">152.00</td>
//                           <td className="px-4 py-3 text-center">209.00</td>
//                           <td className="px-4 py-3 text-center">54.00</td>
//                           <td className="px-4 py-3 text-center">110.00</td>
//                           <td className="px-4 py-3 text-center">219.00</td>
//                         </tr>
//                         <tr className=" bg-gray-50">
//                           <td className="px-4 py-3">Forecasted EBITDA Margin (%)</td>
//                           <td className="px-4 py-3 text-center">152.00</td>
//                           <td className="px-4 py-3 text-center">209.00</td>
//                           <td className="px-4 py-3 text-center">54.00</td>
//                           <td className="px-4 py-3 text-center">110.00</td>
//                           <td className="px-4 py-3 text-center">219.00</td>
//                         </tr>
//                         <tr className=" -gray-50">
//                           <td className="px-4 py-3">Interest Rate (%)</td>
//                           <td className="px-4 py-3 text-center">152.00</td>
//                           <td className="px-4 py-3 text-center">209.00</td>
//                           <td className="px-4 py-3 text-center">54.00</td>
//                           <td className="px-4 py-3 text-center">110.00</td>
//                           <td className="px-4 py-3 text-center">219.00</td>
//                         </tr>
//                         <tr className=" bg-gray-50">
//                           <td className="px-4 py-3">Depreciation Rate (%)</td>
//                           <td className="px-4 py-3 text-center">152.00</td>
//                           <td className="px-4 py-3 text-center">209.00</td>
//                           <td className="px-4 py-3 text-center">54.00</td>
//                           <td className="px-4 py-3 text-center">110.00</td>
//                           <td className="px-4 py-3 text-center">219.00</td>
//                         </tr>
//                         <tr className=" -50">
//                           <td className="px-4 py-3">Forecasted Net Profit Margin (%)</td>
//                           <td className="px-4 py-3 text-center">152.00</td>
//                           <td className="px-4 py-3 text-center">209.00</td>
//                           <td className="px-4 py-3 text-center">54.00</td>
//                           <td className="px-4 py-3 text-center">110.00</td>
//                           <td className="px-4 py-3 text-center">219.00</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </fieldset>

//           </div>
//           <div className="py-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//             <SalesChart />

//             <CogsChart />


//             <EbitdaChart />
//             <NetProfitChart />
//             <NetMarginChart />
//             <GeoMap />
//           </div>
//           <div className='overflow-x-auto'>
//             <fieldset className="w-100 px-3 md:px-6 pb-6 pt-4 border border-gray-200 rounded">
//               <legend className="md:m-auto">
//                 <GeneralButton content={"Financial Projections"} className="bg-themeblue text-white" />
//               </legend>

//               <div
//                 className="p-3 rounded-md space-y-3"
//                 style={{
//                   boxShadow:
//                     "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
//                 }}
//               >
//                 <div className="overflow-x-auto">
//                   <p className='text-[8px] text-end py-1 '>Values in SAR(Absolute)</p>
//                   <table className="min-w-full table-auto text-[12px]">
//                     <thead>
//                       <tr className="border-b">
//                         <th className="px-4 font-light py-3 text-left">Balance Sheet Assumptions</th>
//                         <th className="px-4 font-light py-3 text-center">2024</th>
//                         <th className="px-4 font-light py-3 text-center">2025</th>
//                         <th className="px-4 font-light py-3 text-center">2026</th>
//                         <th className="px-4 font-light py-3 text-center">2027</th>
//                         <th className="px-4 font-light py-3 text-center">2028</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr className="bg-gray-50">
//                         <td className="px-4 py-3">Forecasted Net Addition in CAPEX/Fixed Assets</td>
//                         <td className="px-4 py-3 text-center">152.00</td>
//                         <td className="px-4 py-3 text-center">209.00</td>
//                         <td className="px-4 py-3 text-center">54.00</td>
//                         <td className="px-4 py-3 text-center">110.00</td>
//                         <td className="px-4 py-3 text-center">219.00</td>
//                       </tr>
//                       <tr className="-gray-50">
//                         <td className="px-4 py-3">Forecasted Debt/Loan</td>
//                         <td className="px-4 py-3 text-center">152.00</td>
//                         <td className="px-4 py-3 text-center">209.00</td>
//                         <td className="px-4 py-3 text-center">54.00</td>
//                         <td className="px-4 py-3 text-center">110.00</td>
//                         <td className="px-4 py-3 text-center">219.00</td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//                 <div className='flex flex-col sm:flex-row px-5 gap-10 border-t-2 border-gray-200 pb-5 pt-10 flex- w-100'>
//                   <div className='w-[50%] xs:w-[100%] sm:w-[30%]'>
//                     <p className='text-themeblue text-xs sm:text-[16px] mb-2'>Recievable Days</p>
//                     <div className='flex  items-center gap-3 w-[]'>
//                       <Slider className='!p-0'
//                         value={recievedDays}
//                         onChange={(e, newValue) => setRecievedDays(newValue)}
//                         valueLabelDisplay="auto"
//                         min={0}
//                         max={100}
//                         step={1}
//                         sx={{
//                           color: "#1e40af", // Active part (taken range)
//                           height: 10,

//                           "& .MuiSlider-thumb": {
//                             height: 18,
//                             width: 18,
//                             backgroundColor: "#1e40af",
//                             // color:"#",
//                             border: "3px solid #5BC8FF", // thumb border
//                             "&:hover": {
//                               boxShadow: "0 0 0 8px rgba(30,64,175,0.16)",
//                             },
//                           },

//                           "& .MuiSlider-rail": {
//                             color: "#5BC8FF", // Unfilled (remaining) range
//                             opacity: 1,
//                           },

//                           "& .MuiSlider-track": {
//                             border: "none", // remove edge border
//                           },

//                           "& .MuiSlider-valueLabel": {
//                             backgroundColor: "#1e40af",
//                             fontSize: "0.75rem",
//                             borderRadius: "6px",
//                           },
//                         }}
//                       />
//                       <span className='flex items-center gap-2 text-xs'><p>{recievedDays}</p>  <p >Days</p></span>
//                     </div>
//                   </div>
//                   <div className='w-[50%] xs:w-[100%] sm:w-[30%]'>
//                     <p className='text-themeblue mb-2 text-xs sm:text-[16px]'>Inventory Days</p>
//                     <div className='flex items-center gap-3 w-[]'>
//                       <Slider className='!p-0'
//                         value={inventeryDays}
//                         onChange={(e, newValue) => setInventeryDays(newValue)}
//                         valueLabelDisplay="auto"
//                         min={0}
//                         max={100}
//                         step={1}
//                         sx={{
//                           color: "#1e40af", // Active part (taken range)
//                           height: 10,

//                           "& .MuiSlider-thumb": {
//                             height: 18,
//                             width: 18,
//                             backgroundColor: "#1e40af",
//                             // color:"#",
//                             border: "3px solid #5BC8FF", // thumb border
//                             "&:hover": {
//                               boxShadow: "0 0 0 8px rgba(30,64,175,0.16)",
//                             },
//                           },

//                           "& .MuiSlider-rail": {
//                             color: "#5BC8FF", // Unfilled (remaining) range
//                             opacity: 1,
//                           },

//                           "& .MuiSlider-track": {
//                             border: "none", // remove edge border
//                           },

//                           "& .MuiSlider-valueLabel": {
//                             backgroundColor: "#1e40af",
//                             fontSize: "0.75rem",
//                             borderRadius: "6px",
//                           },
//                         }}
//                       />


//                       <span className='flex items-center gap-2 text-xs'><p>{inventeryDays}</p>  <p>Days</p></span>
//                     </div>
//                   </div>
//                   <div className='w-[50%] xs:w-[100%] sm:w-[30%]'>
//                     <p className='text-themeblue mb-2 text-xs sm:text-[16px]'>Payable Days</p>
//                     <div className='flex items-center gap-3 w-[]'>
//                       <Slider
//                         className='!p-0'
//                         value={payableDays}
//                         onChange={(e, newValue) => setPayableDays(newValue)}
//                         valueLabelDisplay="auto"
//                         min={0}
//                         max={100}
//                         step={1}
//                         sx={{
//                           color: "#1e40af", // Active part (taken range)
//                           height: 10,

//                           "& .MuiSlider-thumb": {
//                             height: 18,
//                             width: 18,
//                             backgroundColor: "#1e40af",
//                             // color:"#",
//                             border: "3px solid #5BC8FF", // thumb border
//                             "&:hover": {
//                               boxShadow: "0 0 0 8px rgba(30,64,175,0.16)",
//                             },
//                           },

//                           "& .MuiSlider-rail": {
//                             color: "#5BC8FF", // Unfilled (remaining) range
//                             opacity: 1,
//                           },

//                           "& .MuiSlider-track": {
//                             border: "none", // remove edge border
//                           },

//                           "& .MuiSlider-valueLabel": {
//                             backgroundColor: "#1e40af",
//                             fontSize: "0.75rem",
//                             borderRadius: "6px",
//                           },
//                         }}
//                       />
//                       <span className='flex items-center gap-2 text-xs'><p>{payableDays}</p>  <p>Days</p></span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </fieldset>

//           </div>

//         </div>
//         <div className='flex px-2 md:py-8 lg:py-16 sm:px-0 mt-2 md:mt-0 flex-col sm:flex-row justify-center gap-3'>
//           <button className="bg-gray-400 text-center  sm:w-[201px] hover:bg-gray-500 text-white   py-1 sm:py-2 lg:py-3 rounded-md">
//             Back
//           </button>
//           <button onClick={() => setSubmitOrder(true)} className="bg-themegreen   hover:bg-teal-600 text-white  px-8  lg:w-[201px]  py-1 sm:py-2  lg:py-3 rounded-md">
//             Submit
//           </button>
//         </div>
//         {submitOrder && (
//           <div
//             className="fixed inset-0 flex justify-center items-center  bg-black bg-opacity-50 z-50"
//             onClick={() => setSubmitOrder(false)} // close on backdrop click
//           >
//             {/* MODAL BOX */}
//             <div
//               className="bg-white px-4  py-4 xl:py-6 rounded-md shadow-lg w-[90%] max-w-md"
//               onClick={(e) => e.stopPropagation()} // stop click inside modal
//             >
//               <span
//                 onClick={() => setSubmitOrder(false)}
//                 className="flex justify-end "
//               >
//                 <HiXMark className="text-[25px] text-gray-500 fw- " />
//               </span>
//               <div className="p-3 lg:p-3 xl:p-10">
//                 <h2 className="2xl:4xl xl:text-3xl mb-6 text-themegreen text-center font-sans lg:text-2xl text-xl ">
//                   Final Confirmation
//                 </h2>

//                 <p className="text-gray-500 text-sm m-auto text-center max-w-[280px] mb-10">
//                   Double-check every detail—once you submit,
//                   changes are off the table. Ready to lock in
//                   your order?
//                 </p>
//                 <div className='flex px-2 pt-8 sm:px-0 mt-2 md:mt-0 flex-col sm:flex-row justify-center gap-3'>
//                   <button onClick={() => setSubmitOrder(false)} className="bg-gray-400 text-center  sm:w-[201px] hover:bg-gray-500 text-white   py-1 sm:py-2 lg:py-3 rounded-md">
//                     Back
//                   </button>
//                   <button onClick={() => { setSubmitOrder(false), setConfirmSubmitOrder(true) }} className="bg-themegreen   hover:bg-teal-600 text-white  px-8  lg:w-[201px]  py-1 sm:py-2  lg:py-3 rounded-md">
//                     Submit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//         {ConfirmSubmitOrder && (
//           <div
//             className="fixed inset-0 flex justify-center items-center  bg-black bg-opacity-50 z-50"
//             onClick={() => setConfirmSubmitOrder(false)} // close on backdrop click
//           >
//             {/* MODAL BOX */}
//             <div
//               className="bg-white px-4  py-4 xl:py-6 rounded-md shadow-lg w-[90%] max-w-md"
//               onClick={(e) => e.stopPropagation()} // stop click inside modal
//             >
//               <span
//                 onClick={() => setConfirmSubmitOrder(false)}
//                 className="flex justify-end "
//               >
//                 <HiXMark className="text-[25px] text-gray-500 fw- " />
//               </span>
//               <div className="p-3 lg:p-3 xl:p-10">
//                 <h2 className="2xl:4xl xl:text-3xl mb-6 text-themegreen text-center font-sans lg:text-2xl text-xl ">
//                   Order Confirmation
//                 </h2>

//                 <p className="text-gray-500 text-sm m-auto text-center max-w-[280px] mb-10">
//                   Thank you for placing your order. Your
//                   valuation report will be delivered by
//                   21-Mar-2025 17:21 GMT
//                 </p>
//                 <div className="w-full text-center">
//                   <button onClick={() => goToOrders()} className="bg-themegreen   hover:bg-teal-600 text-white  px-8     py-1 sm:py-2  lg:py-3 rounded-md">
//                     Go To Order Page
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   )
// }