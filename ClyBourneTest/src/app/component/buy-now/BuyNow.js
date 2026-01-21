"use client"
import { SectionWrapper } from "../generalComponent/SectionWrapper";
import { FaCheck, FaChartLine, FaGem } from "react-icons/fa";
import { LuPackageOpen } from "react-icons/lu";
import GreenButton from "../GeneralButton";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import GreenStripImg from "../../../static/images/green-strip-logo.png";
import Axios from "../../../utils/api"
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";



export default function ValuationMethodology() {
    const router = useRouter();
    const [plans, setPlans] = useState([]);
    const [typeAPlans, setTypeAPlans] = useState([]);
    const [boPlans, setBoPlans] = useState([]);
    const [bopPlans, setBopPlans] = useState([]);
    const [bocontentArray, setBoContentArray] = useState([]);
    const [bopcontentArray, setBopContentArray] = useState([]);
    const [AcontentArray, setAContentArray] = useState([]);
    const [reports, setReports] = useState([]); // array of report options
    const [selectedReport, setSelectedReport] = useState(null); // single selected report object

    const [loading, setLoading] = useState(true);
    const [selectedAdvisorPlan, setSelectedAdvisorPlan] = useState("");
    const parseHtmlList = (htmlString) => {
        return htmlString
            .replace("<ul>", "")
            .replace("</ul>", "")
            .split("</li><li>")
            .map(item => item.replace("<li>", "").replace("</li>", ""));
    };
    // const [reports, setReports] = useState([]); // all dynamic reports
    // const [selectedReport, setSelectedReport] = useState(null); // one selected report object
    // const [loading, setLoading] = useState(true);
    // const [selectedAdvisorPlan, setSelectedAdvisorPlan] = useState("");

    const fetchPlans = async () => {
        try {
            const response = await Axios.get(`/api/plan/`);
            if (response.data.status) {
                const fetchedPlans = response.data.data;
                console.log("🔹 fetchedPlans:", fetchedPlans);

                const BOPlans = fetchedPlans.others?.filter(
                    (plan) => plan.planType?.toUpperCase() === "BO"
                ) || [];
                const BOPPlans = fetchedPlans.others?.filter(
                    (plan) => plan.planType?.toUpperCase() === "BOP"
                ) || [];

                console.log("🟩 BOPlans found:", BOPlans);
                console.log("🟦 BOPPlans found:", BOPPlans);

                // Parse descriptions
                if (BOPPlans.length > 0 && BOPPlans[0].description) {
                    const parsedArray = parseHtmlList(BOPPlans[0].description);
                    setBopContentArray(parsedArray);
                }

                if (BOPlans.length > 0 && BOPlans[0].description) {
                    const parsedArray = parseHtmlList(BOPlans[0].description);
                    setBoContentArray(parsedArray);
                }

                if (fetchedPlans.typeA.length > 0 && fetchedPlans.typeA[0].description) {
                    const parsedArray = parseHtmlList(fetchedPlans.typeA[0].description);
                    setAContentArray(parsedArray);
                }

                if (fetchedPlans.typeA.length > 0) {
                    setTypeAPlans(fetchedPlans.typeA);

                    // ✅ Dynamically create reports
                    const dynamicReports = fetchedPlans.typeA.map((plan, index) => {
                        const reportCounts = [30, 50, 80, 100];
                        const days = [50, 70, 90, 120];

                        return {
                            Reports: reportCounts[index] || 30,
                            AccessDays: `Days: ${days[index] || 30}`,
                            Price: `Price: $${plan.price.toLocaleString()}`,
                        };
                    });

                    console.log("✅ Dynamic Reports:", dynamicReports);
                    setReports(dynamicReports); // store array separately
                    setSelectedReport(null) // default first one
                    setSelectedAdvisorPlan(fetchedPlans.typeA[0]._id);
                }

                setBoPlans(BOPlans);
                setBopPlans(BOPPlans);
            }
        } catch (error) {
            console.error("❌ Error fetching plans:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, [])
    const handleBuyNow = (planId) => {
        console.log("planId:", planId)
        const isLoggedIn = localStorage.getItem('authToken');

        // Remove existing selectedPlan if it exists
        if (localStorage.getItem('selectedPlan')) {
            localStorage.removeItem('selectedPlan');
        }

        localStorage.setItem("selectedPlan", planId);

        if (!isLoggedIn) {
            // Redirect to login
            router.push("/auth/login");
        } else {
            // Proceed to checkout page with selected plan
            router.push("/checkout");
        }
    };

    return (
        <div className="relative w-full">
            {/* Top Section */}
            <SectionWrapper customClass="bg-themeblue !pb-48 ">
                <div className="text-center max-w-4xl mx-auto pt-10 pb-24">
                    <h2 className="text-themegreen text-3xl md:text-4xl lg:text-6xl mb-4">
                        Buy Now <br /><span className="text-[#F9F9F9]">Choose the Right Valuation Plan for You</span>
                    </h2>
                    <p className="text-xs md:text-sm lg:text-xl mb-4 text-white">
                        Select a pricing option that suits your needs, with customizable valuation parameters and access to expert insights.
                    </p>
                    <a href="#contact-form" scroll="false">
                        <GreenButton content={"Schedule A Call"} className={"bg-themegreen text-white"} />
                    </a>
                </div>
            </SectionWrapper>

            {/* Pricing Cards */}
            <div className="bg-transparent relative w-full z-10 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36 -mt-56">
                <div className="absolute right-0 top-0 -translate-y-1/2 z-[10] hidden lg:block" >
                    <Image src={GreenStripImg} width={"200"} height={250} alt="logo-strip" />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-[60vh]">
                        <CircularProgress size={50} style={{ color: "#16a085" }} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 xl:gap-10 z-0">
                        {boPlans?.length > 0 ? (
                            <div className="bg-white shadow-[11.95px_-1.05px_35px_0px_rgba(0,0,0,0.15)] px-6 py-6 xl:px-10 xl:py-10 md:px-7 rounded-xl text-center relative flex flex-col" >
                                {/* Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="rounded-full bg-white p-5 shadow-lg">
                                        <div className="lg:w-20 lg:h-20 md:w-16 md:h-16 w-12 h-12 flex items-center justify-center rounded-full border-8 border-gray-200">
                                            <LuPackageOpen className="text-themegreen lg:text-4xl text-3xl" />
                                        </div>
                                    </div>
                                </div>
                                {/* Title */}
                                <h3 className="text-themegreen text-xl md:text-2xl lg:text-[27px] mb-2">
                                    {boPlans.length > 0 && boPlans[0] ? boPlans[0]['name'] : ""} <br /> Plan
                                </h3>
                                {/* Horizontal line */}
                                <hr className="border-t-2 border-gray w-[100%] mx-auto mb-2" />

                                {/* Subtitle */}
                                <p className="text-themeblue text-xs md:text-sm mb-4">
                                    Limited Time Access
                                </p>
                                {/* Features */}
                                <ul className="text-xs lg:text-base text-black text-left mb-4 space-y-2 flex-1">
                                    {bocontentArray.map((item, index) => (
                                        <li key={index} className="flex items-start gap-4">
                                            <FaCheck className="text-themegreen mt-1 min-w-[16px] h-4 w-4" />
                                            <span >{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                {/* price */}
                                <div className="text-xl md:text-2xl lg:text-3xl text-themeblue mb-8 font-bold">
                                    ${boPlans.length > 0 && boPlans[0] ? boPlans[0]['price'] : ""}
                                    <span className="text-themeblue text-lg lg:text-3xl">/Report</span>
                                </div>
                                {/* button */}
                                <GreenButton onClick={() => handleBuyNow(boPlans[0]['_id'])} content={"BUY NOW"} className={"bg-themegreen !px-6 m-auto w-fit text-white rounded"} />
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No Business Owner plan available</p>
                        )
                        }
                        {bopPlans?.length > 0 ? (
                            <div className="bg-white shadow-[11.95px_-1.05px_35px_0px_rgba(0,0,0,0.15)] px-6 py-6 xl:px-10 xl:py-10 md:px-7 rounded-xl text-center relative flex flex-col" >
                                {/* Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="rounded-full bg-white p-5 shadow-lg">
                                        <div className="lg:w-20 lg:h-20 md:w-16 md:h-16 w-12 h-12 flex items-center justify-center rounded-full border-8 border-gray-200">
                                            <FaChartLine className="text-themegreen lg:text-4xl text-3xl" />
                                        </div>
                                    </div>
                                </div>
                                {/* Title */}
                                <h3 className="text-themegreen text-xl md:text-2xl lg:text-[27px] mb-2">
                                    {bopPlans.length > 0 && bopPlans[0] ? bopPlans[0]['name'] : ""} <br /> Plan
                                </h3>
                                {/* Horizontal line */}
                                <hr className="border-t-2 border-gray w-[100%] mx-auto mb-2" />

                                {/* Subtitle */}
                                <p className="text-themeblue text-xs md:text-sm mb-4">
                                    Extended Access
                                </p>
                                {/* Features */}
                                <ul className="text-xs lg:text-base text-black text-left mb-4 space-y-2 flex-1">
                                    {bopcontentArray.map((item, index) => (
                                        <li key={index} className="flex items-start gap-4">
                                            <FaCheck className="text-themegreen mt-1 min-w-[16px] h-4 w-4" />
                                            <span >{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                {/* price */}
                                <div className="text-xl md:text-2xl lg:text-3xl text-themeblue mb-8 font-bold">
                                    ${bopPlans.length > 0 && bopPlans[0] ? bopPlans[0]['price'] : ""}
                                    <span className="text-themeblue text-lg lg:text-3xl">/Report</span>
                                </div>
                                {/* button */}
                                <GreenButton content={"BUY NOW"} onClick={() => handleBuyNow(bopPlans[0]['_id'])} className={"bg-themegreen !px-6 m-auto w-fit text-white rounded"} />
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No Business Owner plus plan available</p>
                        )
                        }
                        {typeAPlans?.length > 0 ? (
                            <div className="bg-white shadow-[11.95px_-1.05px_35px_0px_rgba(0,0,0,0.15)] px-6 py-6 xl:px-10 xl:py-10 md:px-7 rounded-xl text-center relative flex flex-col" >
                                {/* Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="rounded-full bg-white p-5 shadow-lg">
                                        <div className="lg:w-20 lg:h-20 md:w-16 md:h-16 w-12 h-12 flex items-center justify-center rounded-full border-8 border-gray-200">
                                            <FaGem className="text-themegreen lg:text-4xl text-3xl" />
                                        </div>
                                    </div>
                                </div>
                                {/* Title */}
                                <h3 className="text-themegreen text-xl md:text-2xl lg:text-[27px] mb-2">
                                    {typeAPlans.length > 0 && typeAPlans[0] ? typeAPlans[0]['name'] : ""} <br /> Plan
                                </h3>
                                {/* Horizontal line */}
                                <hr className="border-t-2 border-gray w-[100%] mx-auto mb-2" />

                                {/* Subtitle */}
                                <p className="text-themeblue text-xs md:text-sm mb-4">
                                    Bulk Valuation for Professionals
                                </p>
                                {/* Features */}
                                <ul className="text-xs lg:text-base text-black text-left mb-4 space-y-2 flex-1">
                                    {AcontentArray.map((item, index) => (
                                        <li key={index} className="flex items-start gap-4">
                                            <FaCheck className="text-themegreen mt-1 min-w-[16px] h-4 w-4" />
                                            <span >{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                {/* select */}
                                <div className="space-y-2 mt-4 mb-8">
                                    {/* Reports Dropdown — has arrow */}
                                    <div className="relative w-full ">
                                        {/* Reports Dropdown */}
                                        <select
                                            className="w-full appearance-none mb-2   bg-white border border-[#D2D2D2] rounded px-4 py-2 pr-10 text-[#373743] text-xs lg:text-sm focus:outline-none"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const found = reports.find(r => r.Reports.toString() === value);
                                                setSelectedReport(found);
                                                const selectedIndex = reports.findIndex(r => r.Reports.toString() === value);
                                                if (selectedIndex !== -1 && typeAPlans[selectedIndex]) {
                                                    setSelectedAdvisorPlan(typeAPlans[selectedIndex]._id);
                                                }
                                            }}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Nos. of Reports</option>
                                            {reports.map((item, index) => (
                                                <option key={index} value={item.Reports}>
                                                    {item.Reports} Reports
                                                </option>
                                            ))}
                                        </select>

                                        {/* Access Days */}
                                        <input
                                            type="text"
                                            readOnly
                                            value={selectedReport?.AccessDays || ""}
                                            placeholder="Nos. of Access Days"
                                            className="w-full bg-white border mb-2 border-[#D2D2D2] rounded px-4 py-2 text-[#373743] text-xs lg:text-sm focus:outline-none"
                                        />

                                        {/* Price */}
                                        <input
                                            type="text"
                                            readOnly
                                            value={selectedReport?.Price || ""}
                                            placeholder="Price to Pay"
                                            className="w-full bg-white border border-[#D2D2D2] rounded px-4 py-2 text-[#373743] text-xs lg:text-sm focus:outline-none"
                                        />


                                        {/* 👇 Arrow icon ONLY for Reports dropdown */}
                                        <div className="w-4 h-4 text-gray-500 absolute right-3 top-[25px] -translate-y-1/2 pointer-events-none">
                                            <svg width="9" height="5" viewBox="0 0 9 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4.77585 4.46109L8.91565 0.321289H0.636353L4.77585 4.46109Z" fill="#1AA79C" />
                                            </svg>
                                        </div>
                                    </div>


                                </div>
                                {/* button */}
                                <div className="flex justify-center gap-2">
                                    <Link href="#contact-form">
                                    <GreenButton content={"TALK TO US "} className={"bg-themegreen !px-2 text-white rounded"} />
                                    </Link>
                                    <GreenButton content={"BUY NOW"}  onClick={() => {
                                        if (!selectedReport) {
                                            alert("Please select a plan before proceeding!");
                                            return;
                                        }
                                        handleBuyNow(selectedAdvisorPlan);
                                    }} className={"bg-themegreen !px-2 text-white rounded"} />
                                </div>

                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No Business Owner plus plan available</p>
                        )
                        }
                        {/* {planso.map((plan, idx) => (
                        <div
                            key={idx}
                            className="bg-white shadow-[11.95px_-1.05px_35px_0px_rgba(0,0,0,0.15)] px-6 py-6 xl:px-10 xl:py-10 md:px-7 rounded-xl text-center relative flex flex-col"
                        >
                            
                            <div className="flex justify-center mb-6">
                                <div className="rounded-full bg-white p-5 shadow-lg">
                                    <div className="lg:w-20 lg:h-20 md:w-16 md:h-16 w-12 h-12 flex items-center justify-center rounded-full border-8 border-gray-200">
                                        {plan.icon}
                                    </div>
                                </div>
                            </div>

                       
                            <h3 className="text-themegreen text-xl md:text-2xl lg:text-[27px] mb-2">
                                {plan.title}
                            </h3>

                          
                            <hr className="border-t-2 border-gray w-[100%] mx-auto mb-2" />

                            <p className="text-themeblue text-xs md:text-sm mb-4">
                                {plan.subtitle}
                            </p>

                            <ul className="text-xs lg:text-base text-black text-left mb-4 space-y-2 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <FaCheck className="text-themegreen mt-1 min-w-[16px] h-4 w-4" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                           
                            {plan.dropdowns && (
                                <div className="space-y-2 mt-4 mb-8">
                                  
                                    <div className="relative w-full">
                                        <select
                                            className="w-full appearance-none bg-white border border-[#D2D2D2] rounded px-4 py-2 pr-10 text-[#373743] text-xs lg:text-sm focus:outline-none"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const found = reports.find(r => r.Reports.toString() === value);
                                                setSelectedReport(found);
                                            }}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>
                                                Nos. of Reports
                                            </option>
                                            {reports.map((item, index) => (
                                                <option key={index} value={item.Reports}>
                                                    {item.Reports} Reports
                                                </option>
                                            ))}
                                        </select>

                                     
                                        <div className="w-4 h-4 text-gray-500 absolute right-3 top-2/3 -translate-y-1/2 pointer-events-none">
                                            <svg width="9" height="5" viewBox="0 0 9 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4.77585 4.46109L8.91565 0.321289H0.636353L4.77585 4.46109Z" fill="#1AA79C" />
                                            </svg>
                                        </div>
                                    </div>
 
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            readOnly
                                            value={selectedReport ? selectedReport.AccessDays : ""}
                                            placeholder="Nos. of Access Days"
                                            className="w-full bg-white border border-[#D2D2D2] rounded px-4 py-2 text-[#373743] text-xs lg:text-sm focus:outline-none"
                                        />
                                    </div>
 
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            readOnly
                                            value={selectedReport ? selectedReport.Price : ""}
                                            placeholder="Price to Pay"
                                            className="w-full bg-white border border-[#D2D2D2] rounded px-4 py-2 text-[#373743] text-xs lg:text-sm focus:outline-none"
                                        />
                                    </div>
                                </div>


                            )}

                           
                            <div className="mt-auto">
                                {plan.price && (
                                    <div className="text-xl md:text-2xl lg:text-3xl text-themeblue mb-8 font-bold">
                                        {plan.price}
                                        <span className="text-themeblue text-lg lg:text-3xl">/Report</span>
                                    </div>
                                )}
                                {idx !== 2 && (

                                    <GreenButton content={plan.cta} className={"bg-themegreen text-white rounded"} />

                                )}
                                {idx === 2 && (
                                    <div className="xl:flex xl:flex-row xl:items-end xl:gap-2 flex justify-center flex-col items-center gap-1">
                                        <a href="#contact-form" scroll="false">
                                            <button className={`bg-themegreen text-white rounded px-2 py-2  transition`}>{plan?.cta}</button>
                                        </a>

                                        <button className={`bg-themegreen text-white rounded px-2 py-2  transition`} >BUY NOW</button>

                                    </div>
                                )}
                            </div>
                        </div>
                    ))} */}
                    </div>
                )}
            </div>

            {/* Responsive Background Section */}
            <section className="bg-white md:pt-16 md:pb-12 pt-0 pb-24 px-5 md:px-20 z-0 relative">
                {/* Additional content can go here */}
            </section>
        </div>
    );
}

// const planso = [
//     {
//         icon: <LuPackageOpen className="text-themegreen lg:text-4xl text-3xl" />,
//         title: <>Business <br /> Owner Plan</>,
//         subtitle: "Limited Time Access",
//         features: [
//             "2 valuation methods included",
//             "Industry research for WACC calculation",
//             "Trusted data sources & access to downloadable PDF report",
//             "1 modification allowed within 48 hours after the report delivered",
//             "Advanced financial projection support"
//         ],
//         price: "$109",
//         cta: "BUY NOW"
//     },
//     {
//         icon: <FaChartLine className="text-themegreen lg:text-4xl text-3xl" />,
//         title: <>Business Owner<br /> Plus Plan</>,
//         subtitle: "Extended Access",
//         features: [
//             "All features included in Business Owner Plan",
//             "Additionally, get real time support from the experts to fill your financial results and projections"
//         ],
//         price: "$159",
//         cta: "BUY NOW"
//     },
//     {
//         icon: <FaGem className="text-themegreen lg:text-4xl text-3xl" />,
//         title: <>Advisor<br />Plan</>,
//         subtitle: "Bulk Valuation for Professionals",
//         features: [
//             "All features included in Business Owner Plan",
//             "Customizable report packages",
//             "Choose the number of reports ",
//             "Bulk discounts available",
//             "Ideal for financial advisors, investors, and consultants"
//         ],
//         dropdowns: ["Nos. of Reports", "Nos. of Access Days", "Price to Pay"],
//         cta: "TALK TO US"
//     }
// ];
// 667a716a16d6b4cd4300ccd9
// 667a716a16d6b4cd4300ccd9