"use client";
import React, { useState, useEffect } from 'react';
import GeneralButton from "./GeneralButton";
import { formatNumber, formatDateOnly, formatDate } from "../../utils/utility"
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import Link from 'next/link';
const AdvisorUpgrade = ({ currentPlan, data }) => {
    const router = useRouter();

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [isContinued, setIsContinued] = useState(false)
    const [plans, setPlans] = useState([
        { reports: 50, days: 90, expiry: "00.00.00", price: "$549.09", selected: false },
        { reports: 80, days: 90, expiry: "00.00.00", price: "$823.12", selected: false },
        { reports: 100, days: 90, expiry: "00.00.00", price: "$146.73", selected: false },
    ]);

    useEffect(() => {
        const defaultIndex = data.length % 2 === 0 ? data.length / 2 - 1 : Math.floor(data.length / 2);
        setSelectedPlan(data[defaultIndex]);
    }, [data]);
    
    const handleContinue = () => {
    if (!selectedPlan) {
        return Swal.fire({
            icon: "error",
            title: "Error",
            text: "Please select a plan to upgrade.",
        });
    }

    // Save to localStorage
    localStorage.setItem("upgradeData", JSON.stringify({
        selectedPlan,
        currentPlan,
        data,
    }));

    router.push("/dashboard/upgrade-summary");
};

    const handleSelection = (item) => {
        setLoading(true); // Show loader
        setTimeout(() => {
            setSelectedPlan(item);
            setLoading(false); // Hide loader after 1 second
        }, 500);
    };
    // Handle checkbox click
    // const handleSelect = (index) => {
    //     setPlans((prev) =>
    //         prev.map((plan, i) => ({
    //             ...plan,
    //             selected: i === index ? !plan.selected : plan.selected,
    //         }))
    //     );
    // };

    return (
        <>
           
                    <div>
                        <div className='flex flex-col xl:flex-row gap-5 w-full  pt-7 pb-3 md:pb-5 p-0'>
                            {/* left */}
                            <div className=" flex ">
                                <div className="relative w-full max-w-[100%] border rounded-md p-2 pt-5 md:pt-5">
                                    {/* Header button similar to legend */}
                                    <div className="absolute -top-3 left-1/2 transform xs:min-w-[280px] min-w-[230px] -translate-x-1/2 ">
                                        <GeneralButton
                                            content={"Choose a plan to upgrade"}
                                            className="bg-themeblue text-[13px] w-full sm:text-[16px] text-white"
                                        />
                                    </div>
                                    {/* Scrollable table */}
                                    <div className="overflow-x-auto mt-2 sm:mt-6 border-b-[8px] border-gray-200 rounded-md shadow-md">
                                        <table className=" table-auto rounded-md text-center text-[12px] sm:text-[14px] w-full">
                                            <thead>
                                                <tr className="text-themeblue">
                                                    <th className="py-1 rounded-tl-md bg-gray-200 px-6 text-sm">
                                                        <input type="checkbox" className="custom-checkbox" readOnly />
                                                    </th>
                                                    <th className="py-1 bg-gray-200 px-6 text-sm">Number of Reports</th>
                                                    <th className="py-1 bg-gray-200 px-6 text-sm">Access Days</th>
                                                    <th className="py-1 rounded-tr-md bg-gray-200 px-6 text-sm">Plan Price (USD)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((item, index) => (
                                                    <tr
                                                        key={index}
                                                        className={`bg-gray-50 ${selectedPlan && selectedPlan.id === item.id ? "border-l-[4px] bg-white border-themegreen" : ""}`}
                                                    >
                                                        <td className="py-2 px-2">
                                                            <input
                                                                type="checkbox"
                                                                value={item.id}
                                                                checked={!!selectedPlan && selectedPlan.id === item.id}
                                                                onChange={() => handleSelection(item)}
                                                                className="custom-checkbox"
                                                            />

                                                        </td>
                                                        <td className="py-2 px-2">{item.originalReports}</td>
                                                        <td className="py-2 px-2">{item.originalAccessDays}</td>
                                                        <td className="py-2 px-2">{formatNumber(item.price)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* right */}
                            <div className=" flex ">
                                <div className="relative w-full max-w-[100%] border rounded-md p-2 pt-5 md:pt-5">
                                    {/* Header button similar to legend */}
                                    <div style={{ width: "max-content" }} className=" absolute -top-3 left-1/2 transform min-w-[270px] flex justify-center  -translate-x-1/2">
                                        <GeneralButton
                                            content={"Your current plan will change to"}
                                            className="bg-themeblue  text-[13px] w-[230px] xs:w-fit px-[5px] sm:text-[16px] text-white"
                                        />
                                    </div>
                                    {/* Scrollable table */}
                                    <div className="overflow-x-auto mt-2 sm:mt-6 border-b-[8px] border-gray-200 rounded-md shadow-md scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                        <table className=" table-auto rounded-md text-center text-[12px] sm:text-[14px] w-full">
                                            <thead className="border-b bg-gray-50">
                                                <tr className="text-themeblue">
                                                    <th className="py-1 rounded-tl-md bg-gray-200 px-3 text-sm">Total Reports</th>
                                                    <th className="py-1 bg-gray-200 px-3 text-sm">New Access Days</th>
                                                    <th className="py-1 bg-gray-200 px-3 text-sm">New Expiry Date</th>
                                                    <th className="py-1 rounded-tr-md bg-gray-200 px-3 text-sm">Upgrade Price (USD)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((item, index) => (
                                                    <tr
                                                        key={index}
                                                        className={`hover:bg-gray-50 ${selectedPlan && selectedPlan.id === item.id ? "border-l-[4px] border-themegreen bg-gray-50" : ""
                                                            }`}
                                                    >
                                                        <td className="py-[10px] px-2">{item.reports}</td>
                                                        <td className="py-[10px] px-2">{item.access_days}</td>
                                                        <td className="py-[10px] px-2">{formatDateOnly(item.expiresAt)}</td>
                                                        <td className="py-[10px] px-2">{formatNumber(item.upgrade_price)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <button onClick={handleContinue} className="bg-themegreen m-auto flex w-full xs:w-fit text-center  hover:bg-teal-600 text-white  px-8 text-sm sm:text-md justify-center  lg:px-[52px] py-1 sm:py-2 lg:py-3 rounded-md">
                            Continue
                        </button>
                    </div>
                
              
              
            

        </>
    );
}

export default AdvisorUpgrade;
