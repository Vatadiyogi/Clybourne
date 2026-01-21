"use client";
import React, { useState, useEffect } from "react";
import GeneralButton from "../component/GeneralButton";
import Link from "next/link";
export default function PaymentFailed() {
  return (
    <div className="h-screen flex flex-col  pt-[25px] pb-[15px]  px-4 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36  bg-white  ">
      <div className='mt-3 md:mt-0 text-black '>
        <div>
          <p className="text-red-600 text-[22px] font-bold pb-3 ">Payment Failed!!</p>
          <hr />
        </div>
        <fieldset className="  lg:w-[70%] m-auto border pt-3 pb-2 md:pb-5 mt-3 md:mt-5 lg:mt-10 px-2 md:px-5 rounded-md">
          <legend className="m-auto">
            <GeneralButton
              content={"Payment Failed"}
              className="bg-red-600 text-[13px]  cursor-default sm:text-[16px] text-white"
            />
          </legend>
          <div className="flex-1 py-3 ps-3 sm:ps-10 border-l-[8px] border-red-600 rounded-md   shadow-md">
            <p className="text-center text-[16px] font-semibold mb-2 lg:mb-4 ">Your payment could not be completed.</p>
            <p className="text-center text-[16px]   mb-2 lg:mb-4">(Please try again or use a different payment method.)
            </p>
          </div>
        </fieldset>
        <div className='flex flex-col sm:flex-row justify-center py-5 gap-3'>
          <Link href={"/"}>
            <button className="bg-gray-600  text-sm sm:text-md  hover:bg-gray-500 text-white   px-8   lg:px-[52px] py-1 sm:py-2 lg:py-3  rounded-md">
                Go Back To Home
            </button>
          </Link>
          <Link href={"/pricing"}>
            <button className="bg-gray-600  text-sm sm:text-md  hover:bg-gray-500 text-white   px-8  lg:px-[52px] py-1 sm:py-2 lg:py-3  rounded-md">
             Create New Payment
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

