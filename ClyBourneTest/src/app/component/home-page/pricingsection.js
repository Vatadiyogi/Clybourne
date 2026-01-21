import React from 'react';
import Animetedline from '../Global-file/Animetedline';
import { SectionWrapper } from '../generalComponent/SectionWrapper';

export const PricingSection = () => {

  return (
    <>
      <SectionWrapper customClass="bg-white">
        <div className="w-full mx-auto flex flex-col md:flex-row justify-between gap-16">

          {/* Left Content */}
          <div className="flex-1">
            <h4 className="text-themedark mb-4 lg:text-lg md:text-sm text-xs  font-normal">
              <span className='border-b-2  border-themeblue pb-[2px]'>Pricing</span>
            </h4>
            <h2 className="text-3xl sm:text-4xl md:text-6xl text-themeblue mb-1">
              Affordable<br  className='hidden sm:block'/>
              Business Valuation<br className='hidden sm:block'/>
              Plans for Every Stage
            </h2>
            <p className="text-themeblack lg:text-lg text-sm mb-8">
              Startups to enterprises: Scale with flexible pricing.
            </p>
            <p className="text-sm text-themeblack">
              Do you need a special offer? <br />
            </p>
            <a href="#contact-form" scroll="false" className="text-[lightblue] text-sm underline hover:text-themegreen">
              Write to us
            </a>
          </div>

          {/* Right Cards */}
          <div className="flex-1 w-full flex flex-col sm:flex-row justify-center items-stretch gap-2 px-2">
            <div
              className="bg-[#19a79b] text-gray-800 rounded-lg shadow-md px-10 py-14 flex-1 flex flex-col justify-between text-center scale-110 relative z-10"
            >
              <div className='flex flex-col items-center'>
                <h3 className="text-2xl mb-4 text-white">
                  Clybourne’s<br />Online Valuation Tool
                </h3>
                {/* <hr className="border-white mb-4 w-[70%] text-center" /> */}
                <div className='bg-white w-[70%] h-[1px] mb-4' />
                <p className='text-sm text-white'>From</p>
                <p className=" text-2xl mb-8 text-white">$109</p>
              </div>
              <a href='/pricing'>
                <button className="bg-white text-xs text-[#212121] px-6 width-[90%] py-2 rounded-full transition">
                  Get Started
                </button>
              </a>
              
            </div>

            <div
              className="bg-lightgrey text-black rounded-lg shadow-md transform transition duration-300 px-10 py-16 flex-1 flex flex-col justify-between text-center relative z-0"
            >
              <div className='flex flex-col items-center'>
                <h3 className="text-2xl mb-4">
                  Traditional Valuation Cost
                </h3>
                <div className='bg-black w-[70%] h-[1px] mb-4' />
                <p className="text-2xl mb-6 ">$10,000+</p>
                <p className=" text-2xl mb-8 text-black">(Save 99%)</p>
              </div>
            </div>
          </div>

        </div>

      </SectionWrapper>
    </>
  );
};
