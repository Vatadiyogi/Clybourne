import React from 'react';
import Animetedline from '../Global-file/Animetedline';

// Inline custom SVG icon to replace Lucide
const ArrowUpRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-7 h-7  sm:w-5 sm:h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
  </svg>
);

const features = [
  {
    title: 'Human + AI Expertise',
    description: 'No generic algorithms— personalized insights.',
  },
  {
    title: 'Fastest Turnaround',
    description: '24-hour reports vs. days elsewhere.',
  },
  {
    title: 'Unmatched Affordability',
    description: 'Premium Report at just a fraction of the cost',
  },
  {
    title: <>Global &<br />Secure</>,
    description: 'GDPR-compliant data protection.',
  },
];

export const WhyClybourneSection = () => {
  return (
    <section className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36 py-20 bg-lightgrey">
      <div className="w-full mx-auto grid md:grid-cols-2 gap-4 xl:gap-12 items-center">
        {/* Left Content */}
        <div>
          <h4 className="text-themeblue mb-4 lg:text-lg md:text-sm text-xs  font-normal">
              <span className='border-b-2  border-themeblue pb-[2px]'>Why Clybourne</span>
            </h4>
          <h2 className="text-3xl sm:text-4xl md:text-6xl text-themeblue mb-1">
            The Trusted Valuation <br/> Platform for 100+ Countries
          </h2>
          <p className="text-themeblack md:text-lg text-sm">
            Why businesses choose us over competitors .
          </p>
        </div>

        {/* Right Content: Staggered Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ">
          {/* Left Column Cards */}
          <div className="flex flex-col gap-6 mt-10">
            {[features[1], features[3]].map((feature, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl px-8 py-6 lg:h-[280px] xl:h-56  flex flex-col gap-2 hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-6px]"
              >
                <div className="w-9 h-9 bg-themeblue text-themegreen flex items-center justify-center rounded">
                  <ArrowUpRightIcon />
                </div>
                <h4 className="text-themeblue md:text-xl lg:text-2xl text-sm ">{feature.title}</h4>
                <p className="text-themeblack text-xs md:text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Right Column Cards (lower position for staggered look) */}
          <div className="flex flex-col gap-6">
            {[features[0], features[2]].map((feature, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl px-6 py-6 lg:h-[280px] xl:h-56  flex flex-col gap-2 hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-6px]"
              >
                <div className="w-8 h-8 md:w-8 md:h-8 lg:w-9 lg:h-9 bg-themeblue text-themegreen flex items-center justify-center rounded">
                  <ArrowUpRightIcon />
                </div>
                <h4 className="text-themeblue md:text-xl lg:text-2xl text-sm ">{feature.title}</h4>
                <p className="text-themeblack text-xs md:text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

