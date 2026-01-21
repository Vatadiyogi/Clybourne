"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlanData } from "../../../redux/planSlice";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import { CiCirclePlus } from "react-icons/ci";
import PlanBillingTable from "../../component/PlanBillingTable";
import { formatDate } from "../../../utils/utility";

const PlanAndBilling = () => {
  const dispatch = useDispatch();

  const {
    loading,
    currentPlan,
    historyPlans,
    planFeatures,
    error,
  } = useSelector((state) => state.plan);

  useEffect(() => {
    dispatch(fetchPlanData());
  }, [dispatch]);

  return (

    <div className='lg:ps-8 bg-gray-50 p-3 lg:pe-14 xl:pe-24 lg:pt-3'>
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <CircularProgress size={50} style={{ color: "#16a085" }} />
        </div>
      ) : (
        <div>
          <div className='flex flex-col md:flex-row  justify-between  items-center gap-2 md:gap-0'>
            <div className='' >
              <h2 className='text-[26px] fw-medium font-sans '> Plans & Billings</h2>
              <p className='text-gray-700 text-sm text-medium'> Flexible billing and pricing for every business stage. Optimize your valuation journey with transparent, cost-effective plans.</p>
            </div>

            <div className='flex w-full justify-end'>
              <Link href={"/pricing"}>
                <button className='bg-themegreen  text-white font-medium flex items-center  px-2 justify-center  gap-3   text-xs text-center w-[146px]  py-2 rounded-md'> Add New Plan
                  <span>
                    <CiCirclePlus className='text-[20px] fw-semibold' />
                  </span>
                </button>
              </Link>
            </div>

          </div>
          {currentPlan ?
            <div className='py-3 sm:py-5 flex flex-col md:flex-row gap-3 sm:gap-5'>

              <div className='p-4 md:max-w-[300px] h-fit text-white bg-themegreen rounded-md'>
                <p className='mb-1 sm:mb-2 text-xs font-medium'>Current Plan</p>
                <p className=' text-[25px] sm:text-[35px] mb-1 sm:mb-2 font-medium'>Plan Type - {currentPlan.planType}</p>
                <div className='flex  flex-col'>
                  <div className='flex text-[14px] text-white font-thin sm:text-[12px] gap-1 mb-1' >
                    <h4 className="text-[14px]  w-[45%] text-white ">Plan ID </h4>
                    :<p className='text-white  text-[14px]'>{currentPlan.planSeqId}</p>
                  </div>
                  <div className='flex text-[14px] text-white font-thin sm:text-[12px] gap-1 mb-1' >
                    <h4 className="text-[14px]  w-[45%] text-white "> Total Report
                    </h4>
                    :<p className='text-white  text-[14px]  '>{currentPlan.balanceQuota}</p>
                  </div>
                  <div className='flex text-[14px] text-white font-thin sm:text-[12px] gap-1 mb-1' >
                    <h4 className="text-[14px]  w-[45%] text-white ">Unused Reports</h4>
                    :<p className='text-white  text-[14px]  '>{currentPlan.balanceQuota - currentPlan.orders?.length}</p>
                  </div>
                  <div className='flex text-[14px] text-white font-thin sm:text-[12px] gap-1 mb-1' >
                    <h4 className="text-[14px]  w-[45%] text-white "> Plan Type</h4>
                    :<p className='text-white  text-[14px]  '>{currentPlan.planId && currentPlan.planId.name}</p>
                  </div>
                  <div className='flex text-[14px] text-white font-thin sm:text-[12px] gap-1 mb-1' >
                    <h4 className="text-[14px]  w-[45%] text-white "> Expiry Date </h4>
                    :<p className='text-white  text-[14px]  '>{formatDate(currentPlan.expiresAt)}</p>
                  </div>
                </div>
                {currentPlan.planType === "BO" || currentPlan.planType === "A" ?
                  <Link href={"/dashboard/upgradePlan"}>

                    <button className='text-themegreen mt-2 sm:mt-4 sm:mb-2  bg-white font-medium flex items-center   justify-center  gap-3   text-xs text-center w-[146px]  py-2 rounded-md'> Upgrade Plan
                      <span>
                        <CiCirclePlus className='text-[20px] fw-semibold' />
                      </span>
                    </button>
                  </Link>
                  : ''
                }
              </div>
              <div className="flex-1 bg-white rounded-md shadow-md overflow-hidden">
                <div className="bg-themeblue text-white sm:ps-10  sm:pe-6 sm:py-2 p-2 font-medium text-base">
                  Current Plan Details
                </div>
                <ul className="ps-3 sm:ps-8">
                  {/* {features.map((feature, index) => (
                      <li key={index} className=" border-b pt-2 pb-1 text-[13px] sm:text-sm text-gray-800">
                        {feature}
                      </li>
                    ))} */}
                  {planFeatures.map((item, index) => (
                    <li key={index} className=" border-b pt-2 pb-1 text-[13px] sm:text-sm text-gray-800">
                      {item}
                    </li>
                  ))
                  }
                </ul>
              </div>
            </div>
            : <>No Active Plan</>
          }
          <PlanBillingTable historyPlans={historyPlans}/>
        </div>
      )}


    </div>
  );
};

export default PlanAndBilling;
