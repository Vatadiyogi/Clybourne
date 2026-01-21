"use client"
import React, { useState, useEffect } from 'react'
import GeneralButton from "../../component/GeneralButton";
import { fetchPlanData } from "../../../redux/planSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { formatDate } from "../../../utils/utility";
import Axios from '../../../utils/api';
import BopCheckout from "../../component/BopCheckout"
import AdvisorUpgrade from "../../component/AdvisorUpgrade"
const UpgradePlans = () => {
  const [currentPlana, setCurrentPlana] = useState(null);
  const [upgradePlan, setUpgradePlan] = useState(null);
  const [bop, setBop] = useState(false);
  const dispatch = useDispatch();
  const {
    loading,
    currentPlan,
    historyPlans,
    planFeatures,
    error,
  } = useSelector((state) => state.plan);
  console.log("currentPlan:", currentPlan);
  useEffect(() => {
    dispatch(fetchPlanData());
  }, []);
  useEffect(() => {
    const fetchTableData = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await Axios.get('api/plan/customer_upgrade_plans', {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response;
        console.log("upgradecustomrer PLan:", data)
        if (data && data.status) {
          setCurrentPlana(data.data.data.current_plan || []);
          setUpgradePlan(data.data.data.upgrade_data || null);
        } else {
          console.error('Failed to fetch table data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };

    fetchTableData();
  }, []);





  return (
    <>
      <div className="lg:ps-8 bg-gray-50 p-3 lg:pe-14 xl:pe-24 lg:pt-3">
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <CircularProgress size={50} style={{ color: "#16a085" }} />
          </div>
        ) : (
          <div>
            <div className='flex  justify-between pb-3 md:pb-5  items-center gap-2 md:gap-0'>
              <div className='' >
                <h2 className='text-[26px] fw-medium font-sans '>Upgrade Plan </h2>
                <p className='text-gray-700 text-sm text-medium'>Don't let your unutilized reports expire—add reports to extend plan access days or upgrade to a higher value to reduce your cost per repor</p>
              </div>
            </div>
            {/* page1 */}
            {currentPlan ?
              <div>
                <fieldset className=' w-full   pb-3 pt-3 p-2 md:px-5 xl:pb-6 xl:pt-4 border border-gray-200 rounded'>
                  <legend className='m-auto'>
                    <GeneralButton content={"Current Plans Details"} className="bg-themeblue cursor-default text-[13px] sm:text-[16px]  text-white" />
                  </legend>
                  <div className="w-full flex flex-col sm:flex-row justify-between gap-3 sm:gap-5 pt-2 pb-4 ">

                    <div className="border-l-[8px] flex-1 ps-5 pe-2 py-5  border-themegreen rounded-md " style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
                      <div className='flex text-[10px] sm:text-[12px] lg:gap-3 mb-1 xl:gap-5'>
                        <p className="font-medium w-[45%]">Plan Id</p>
                        :<p className="ms-2">  {currentPlan.planSeqId}</p>
                      </div>
                      <div className='flex text-[10px] sm:text-[12px] lg:gap-3 mb-1 xl:gap-5'>
                        <p className="font-medium w-[45%]">Plan Type</p>
                        :<p className="ms-2">   {currentPlan.planType}</p>
                      </div>
                      <div className='flex text-[10px] sm:text-[12px] lg:gap-3 mb-1 xl:gap-5'>
                        <p className="font-medium w-[45%]">Order Type</p>
                        :<p className="ms-2">  {currentPlan.orderType} order</p>
                      </div>
                      <div className='flex text-[10px] sm:text-[12px] lg:gap-3 mb-1 xl:gap-5'>
                        <p className="font-medium w-[45%]">Amount Paid</p>
                        :<p className="ms-2"> USD ${currentPlan.amount}</p>
                      </div>
                    </div>
                    <div className="border-l-[8px] flex-1 ps-5 pe-2  py-5  border-themegreen rounded-md " style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
                      <div className='flex text-[10px] sm:text-[12px] lg:gap-3 mb-1 xl:gap-5'>
                        <p className="font-medium w-[45%]">Order Date</p>
                        :<p className="ms-2">{formatDate(currentPlan.createdAt)} </p>
                      </div>
                      <div className='flex text-[10px] sm:text-[12px] lg:gap-3 mb-1 xl:gap-5'>
                        <p className="font-medium w-[45%]">Activation Date</p>
                        :<p className="ms-2">{formatDate(currentPlan.createdAt)}</p>
                      </div>
                      <div className='flex text-[10px] sm:text-[12px] lg:gap-3 mb-1 xl:gap-5'>
                        <p className="font-medium w-[45%]"> Expire Date</p>
                        :<p className="ms-2">{formatDate(currentPlan.expiresAt)}</p>
                      </div>

                    </div>

                    <div className="border-l-[8px] flex-1 ps-5 pe-2 py-5  border-themegreen rounded-md " style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
                      <div className='flex text-[10px] sm:text-[12px] lg:gap-3 mb-1 xl:gap-5'>
                        <p className="font-medium w-[45%]"> Number of Reports   </p>
                        :<p className="ms-2">  {currentPlan.balanceQuota}</p>
                      </div>
                      <div className='flex text-[10px] sm:text-[12px] lg:gap-3 mb-1 xl:gap-5'>
                        <p className="font-medium w-[45%]">Access Day </p>
                        :<p className="ms-2">  {currentPlan.accessDays}</p>
                      </div>
                      <div className='flex text-[10px] sm:text-[12px] lg:gap-3 mb-1 xl:gap-5'>
                        <p className="font-medium w-[45%]">Utilized Plan Report</p>
                        :<p className="ms-2">   {currentPlan.balanceQuota - currentPlan.orders.length}</p>
                      </div>
                      <div className='flex text-[10px] sm:text-[12px] lg:gap-3 mb-1 xl:gap-5'>
                        <p className="font-medium w-[45%]">Plan Days Utilized</p>
                        :<p className="ms-2">  {currentPlan.utilizedDays}</p>
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* advisorplan */}
                {upgradePlan ? (
                  upgradePlan?.planType === "BOP" ? (
                    <div>
                      <BopCheckout currentPlan={currentPlana[0]} data={upgradePlan} />
                    </div>
                  ) : currentPlana[0].planType === 'A' ? (
                    <div>
                       <AdvisorUpgrade currentPlan={currentPlana[0]} data={upgradePlan} />
                    </div>
                  ) : (
                    // This handles if it's not BOP or 'A', or if you have another fallback
                    <div className="row mt-25px text-center">
                      <div className="col-sm-12">
                        <p>No Upgrade Option</p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="row mt-25px text-center">
                    <div className="col-sm-12">
                      <p>No Upgrade Option</p>
                    </div>
                  </div>
                )}
              </div>
              : <>No Active Plan</>
            }
            {/* page2 */}
            {/* <div className='flex flex-col lg:flex-row gap-5 py-3 md:py-5'>
              <div className='  border-l-[8px] lg:w-[300px] border-themegreen  pb-3 pt-3 px-5 xl:pb-6 xl:pt-4 rounded' style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>

                <div className="w-full flex flex-col    justify-between gap-5 pb-4 ">
                  <p className='text-[18px] text-themeblue '>Current Plan Details</p>
                  <div className=" border-b border-black flex-1  py-5  " >

                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Plan Id</p>
                      :<p className="ms-2">  8</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Plan Type</p>
                      :<p className="ms-2">  A</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Order Type</p>
                      :<p className="ms-2">   New Order</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Amount Paid</p>
                      :<p className="ms-2">   USD 2399.00</p>
                    </div>
                  </div>
                  <div className="border-b border-black flex-1  py-5  " >
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Order Date</p>
                      :<p className="ms-2">   22-Jan-2025</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Activation Dat</p>
                      :<p className="ms-2">   22-Jan-2025</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]"> Expire Date</p>
                      :<p className="ms-2">    13-Mar-2025</p>
                    </div>

                  </div>
                  <div className=" flex-1  py-5  " >
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]"> Number of Reports   </p>
                      :<p className="ms-2">  58</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Access Day </p>
                      :<p className="ms-2">  20</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Utilized Plan Report</p>
                      :<p className="ms-2">   0</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Plan Days Utilized</p>
                      :<p className="ms-2">  60</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" flex-1   justify-center">
                <div className='  pb-3 pt-3  xl:pb-6 xl:pt-4 rounded' style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
                  <p className='text-[18px] text-themeblue px-2 md:px-5'> Choose a plan to upgrade</p>
                  <div className="pt-6 md:pt-8 border-b-2 border-themegreen pb-10 overflow-x-auto  ">
                    <div className="px-0 md:px-8 min-w-[550px]">
                      <table className="w-full rounded-md text-center text-[12px]  sm:text-[14px]">
                        <thead className="">
                          <tr className="text-themeblue">

                            <th className="py-2 font-light border-b border-black text-center px-6 text-sm">Number of Reports</th>
                            <th className="py-2 font-light border-b border-black text-center px-6 text-sm">Access Days</th>
                            <th className="py-2 font-light border-b border-black text-center px-6 text-sm">Plan Price (USD)</th>
                            <th className="py-2 font-light border-b border-black text-center px-6 text-sm"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {plans.map((plan, i) => (
                            <tr
                              key={i}
                              className={` bg-gray-50  ${plan.selected ? "border-l-[4px] bg-white border-themegreen " : ""
                                }`}
                            >
                              <td className="py-2 text-center border-b border-gray-300 px-2">{plan.reports}</td>
                              <td className="py-2 text-center border-b border-gray-300 px-2">{plan.days}</td>
                              <td className="py-2 text-center border-b border-gray-300 px-2">{plan.price}</td>
                              <td className="py-2 text-center border-b border-gray-300  px-2"><button className={`text-white px-4 text-xs py-1 rounded-md ${plan.selected ? "bg-themegreen" : "bg-gray-300"}`}>Select</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex-1 pt-3 md:pb-3 lg:pb-10 ">
                    <div className="md:px-8 !overflow-x-auto">
                      <table className="w-full rounded-md  text-center text-[12px] sm:text-[14px]">
                        <thead className="border-b bg-gray-50">
                          <tr className="text-themeblue">
                            <th className="py-2 font-light border-b border-black text-center px-6 text-sm ">Total Reports</th>
                            <th className="py-2 font-light border-b border-black text-center px-6 text-sm">New Access Days</th>
                            <th className="py-2 font-light border-b border-black text-center px-6 text-sm">New Expiry Date</th>
                            <th className="py-2 font-light border-b border-black text-center px-6 text-sm ">Upgrade Price to Pay (USD)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {plans.map((plan, i) => (
                            <tr
                              key={i}
                              className={` hover:bg-gray-50 ${plan.selected ? "border-l-[4px] border-themegreen bg-gray-50" : ""
                                }`}
                            >

                              <td className="py-2 text-center border-b border-gray-300 px-2">{plan.reports}</td>
                              <td className="py-2 text-center border-b border-gray-300 px-2">{plan.days}</td>
                              <td className="py-2 text-center border-b border-gray-300 px-2">{plan.price}</td>
                              <td className="py-2 text-center border-b border-gray-300 px-2">{plan.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className='flex px-2 sm:px-0 mt-2 md:mt-0 flex-col sm:flex-row justify-center gap-3'>
                    <button className="bg-gray-400 text-center  sm:w-[131px] hover:bg-gray-500 text-white   py-1 sm:py-2 lg:py-3 rounded-md">
                      Cancel
                    </button>
                    <button className="bg-themegreen   hover:bg-teal-600 text-white  px-8  lg:px-[52px]  py-1 sm:py-2  lg:py-3 rounded-md">
                      Continue
                    </button>
                  </div>

                </div>
              </div>
            </div> */}
            {/* page3 */}

{/* 
            <div className='flex flex-col lg:flex-row gap-5 md:py-5'>
              <div className='  border-l-[8px] lg:w-[300px] border-themegreen  pb-3 pt-3 px-5 xl:pb-6 xl:pt-4 rounded' style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>

                <div className="w-full flex flex-col    justify-between gap-5 pb-4 ">
                  <p className='text-[18px] text-themeblue '>Current Plan Details</p>
                  <div className=" border-b border-black flex-1  py-5  " >

                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Plan Id</p>
                      :<p className="ms-2">  8</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Plan Type</p>
                      :<p className="ms-2">  A</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Order Type</p>
                      :<p className="ms-2">   New Order</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Amount Paid</p>
                      :<p className="ms-2">   USD 2399.00</p>
                    </div>
                  </div>
                  <div className="border-b border-black flex-1  py-5  " >
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Order Date</p>
                      :<p className="ms-2">   22-Jan-2025</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Activation Dat</p>
                      :<p className="ms-2">   22-Jan-2025</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]"> Expire Date</p>
                      :<p className="ms-2">    13-Mar-2025</p>
                    </div>

                  </div>
                  <div className=" flex-1  py-5  " >
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]"> Number of Reports   </p>
                      :<p className="ms-2">  58</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Access Day </p>
                      :<p className="ms-2">  20</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Utilized Plan Report</p>
                      :<p className="ms-2">   0</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[45%]">Plan Days Utilized</p>
                      :<p className="ms-2">  60</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" flex-1   justify-center">
                <div className='  pb-3 pt-3  xl:pb-6 xl:pt-4 rounded' style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
                  <p className='text-[18px] text-themeblue px-2 md:px-5'> Choose a plan to upgrade</p>
                  <div className="pt-6 md:pt-8 border-b-2 border-themegreen pb-10 overflow-x-auto  ">
                    <div className="px-0 md:px-8 min-w-[550px]">
                      <table className="w-full rounded-md text-center text-[12px]  sm:text-[14px]">
                        <thead className="">
                          <tr className="text-themeblue">

                            <th className="py-2 font-light border-b border-black text-center px-6 text-sm">Number of Reports</th>
                            <th className="py-2 font-light border-b border-black text-center px-6 text-sm">Access Days</th>
                            <th className="py-2 font-light border-b border-black text-center px-6 text-sm">Plan Price (USD)</th>
                            <th className="py-2 font-light border-b border-black text-center px-6 text-sm"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {plans.map((plan, i) => (
                            <tr
                              key={i}
                              className={` bg-gray-50  ${plan.selected ? "border-l-[4px] bg-white border-themegreen " : ""
                                }`}
                            >
                              <td className="py-2 text-center border-b border-gray-300 px-2">{plan.reports}</td>
                              <td className="py-2 text-center border-b border-gray-300 px-2">{plan.days}</td>
                              <td className="py-2 text-center border-b border-gray-300 px-2">{plan.price}</td>
                              <td className="py-2 text-center border-b border-gray-300  px-2"><button className={`text-white px-4 text-xs py-1 rounded-md ${plan.selected ? "bg-themegreen" : "bg-gray-300"}`}>Select</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className='flex px-2 sm:px-0 mt-2 md:mt-5 flex-col sm:flex-row justify-center gap-3'>
                    <button className="bg-gray-400 text-center sm:w-[131px]  hover:bg-gray-500 text-white   py-1 sm:py-2 lg:py-3 rounded-md">
                      Cancel
                    </button>
                    <button className="bg-themegreen   hover:bg-teal-600 text-white  px-8  lg:px-[52px]  py-1 sm:py-2  lg:py-3 rounded-md">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div> */}

            {/* page-4 */}
            {/* <div>
              <div className='pb-5' >
                <h2 className='text-[26px] fw-medium font-sans '>Payment Failed</h2>
                <p className='text-gray-700 text-sm text-medium'>Payment Failed. Please try again or use a different payment method</p>
              </div>
              <fieldset className="  lg:w-[60%] m-auto border pt-3 pb-2 md:pb-5 px-2 md:px-5 rounded-md">
                <legend className="m-auto">
                  <GeneralButton
                    content={"Upgrade Plan Details"}
                    className="bg-themeblue text-[13px] sm:text-[16px] text-white"
                  />
                </legend>
                <div className="flex-1 py-3 ps-3 sm:ps-10 border-l-[8px] border-themeblue rounded-md   shadow-md">
                  <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                    <p className="font-medium w-[40%]">Total Reports </p>
                    :<p className="ms-2">  8</p>
                  </div>
                  <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                    <p className="font-medium w-[40%]">Access Duration from Toda</p>
                    :<p className="ms-2">  75 day</p>
                  </div>
                  <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                    <p className="font-medium w-[40%]">Plan Expiry Dat</p>
                    :<p className="ms-2">   April 22, 2025</p>
                  </div>
                  <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                    <p className="font-medium w-[40%]">Total Upgrade Cost</p>
                    :<p className="ms-2">   USD 3,591.00</p>
                  </div>
                </div>
              </fieldset>
              <div className='flex flex-col sm:flex-row justify-center py-5 gap-3'>
                <button className="bg-gray-400 sm:w-[172px]  text-sm sm:text-md   hover:bg-gray-500 text-white  px-8  lg:px-[52px] py-1 sm:py-2 lg:py-3 rounded-md">
                  Back
                </button>
                <button className="bg-themegreen   text-sm sm:text-md hover:bg-teal-600 text-white  px-8  lg:px-[52px] py-1 sm:py-2 lg:py-3 rounded-md">
                  Retry Payment
                </button>
              </div>
            </div> */}
          </div>

        )}
      </div>
    </>
  )
}

export default UpgradePlans
