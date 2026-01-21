import React from 'react';
import { SectionWrapper } from '../generalComponent/SectionWrapper';
import GeneralButton from '../GeneralButton';

export const HowItWorks = () => {

  const cardContent = [
    {
      heading: (
        <>
          Affordable Pricing <br /> No Hidden Fees
        </>
      ),
      para:
        "Skip traditional valuations costing $10,000+. Get a professional valuation report starting at $109 — 99% cheaper than industry standards.",
    },
    {
      heading: <>24-Hour Valuation Report</>,
      para:
        "Submit details via our user-friendly valuation dashboard and receive insights within a day.",
    },
    {
      heading: <>Expert-Curated Insights</>,
      para:
        "By combining AI and human expertise, we deliver customized valuation reports for fundraising, M&A, or strategic decisions.",
    },
  ];
  return (
    <SectionWrapper customClass={"bg-lightgrey"}>
      {/* Heading */}
      <div className=" mx-auto">
        <p className="lg:text-lg md:text-sm text-xs  underline decoration-themeblue text-themeblack">How It Works</p>
        <h2 className="text-3xl sm:text-4xl md:text-6xl text-themeblue mt-2 mb-2">
          Fast & Transparent Online <br /> Business Valuation Tool
        </h2>
        <p className="text-themeblack text-lg mb-10">
          From data input to precise valuation results, Clybourne’s platform streamlines<br />
          the process for startups and established businesses alike.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6  mx-auto">
        {
          cardContent.map((item, index) => (
            <div
              className="bg-white rounded-xl shadow-2xl p-10 transform transition-all duration-300 hover:translate-y-[-4px]"
              key={index}
            >
              <div className="bg-themeblue p-2 w-fit rounded-md mb-5 xl:mb-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-6 md:w-6 text-themegreen transform rotate-[-180deg]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 7l-10 10M17 17H7V7"
                  />
                </svg>
              </div>
              <h3 className="lg:text-2xl text-sm md:text-lg text-themeblue mb-4">
                {item.heading}
              </h3>
              <p className="text-[#05131D] text-xs md:text-sm">{item.para}</p>
            </div>

          ))
        }
      </div>
      <div className='mt-10 flex justify-center'>
        <a href="/how-it-works"  className='mt-5'>
          <GeneralButton content={"Know More"} className="text-center bg-themegreen text-white" />
        </a>
      </div>
    </SectionWrapper>
  );
};

