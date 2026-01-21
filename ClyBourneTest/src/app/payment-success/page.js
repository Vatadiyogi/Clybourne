"use client";
import React, { useState, useEffect } from "react";
import GeneralButton from "../component/GeneralButton";
import Link from "next/link";
export default function PaymentSuccess() {
  return (
    <div className="h-screen flex flex-col  pt-[25px] pb-[15px]  px-4 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36  bg-white  ">
      <div className='mt-3 md:mt-0 text-black '>
        <div>
          <p className="text-themeblue text-[22px] font-bold pb-3 ">Payment Successfull</p>
          <hr />
        </div>
        <fieldset className="  lg:w-[70%] m-auto border pt-3 pb-2 md:pb-5 mt-3 md:mt-5 lg:mt-10 px-2 md:px-5 rounded-md">
          <legend className="m-auto">
            <GeneralButton
              content={"Payment Successfull"}
              className="bg-themeblue text-[13px] cursor-default sm:text-[16px] text-white"
            />
          </legend>
          <div className="flex-1 py-3 ps-3 sm:ps-10 border-l-[8px] border-themeblue rounded-md   shadow-md">
            <p className="text-center text-[16px] font-semibold mb-2 lg:mb-4 ">Thank You! Payment Successful</p>
            <p className="text-center text-[16px]   mb-2 lg:mb-4">(If Plan is not showing in My-Plan section. Please wait for 1-2 hours for updation.)
            </p>
          </div>
        </fieldset>
        <div className='flex flex-col sm:flex-row justify-center py-5 gap-3'>
          <Link href={"/dashboard/plan&billing"}>
            <button className="bg-themegreen  text-sm sm:text-md  hover:bg-teal-600 text-white   px-8   lg:px-[52px] py-1 sm:py-2 lg:py-3  rounded-md">
              Go To My Plans
            </button>
          </Link>
          <Link href={"/dashboard"}>
            <button className="bg-themegreen  text-sm sm:text-md  hover:bg-teal-600 text-white   px-8  lg:px-[52px] py-1 sm:py-2 lg:py-3  rounded-md">
             Create New Report Order
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

