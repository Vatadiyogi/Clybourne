import React from 'react';
import { SectionWrapper } from '../generalComponent/SectionWrapper';
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

export const ValuationApproach = () => {
  const cards = [
    {
      heading: <>Custom Valuation <br />Models</>,
      title: 'Beyond standard\nDCF (Discounted Cash Flow),\nwe use industry-specific methodologies\nfor accuracy.',
      bg: 'bg-white',
      textColor: 'text-[#1C2E70]',
      iconBg: 'bg-[#1C2E70]',
      button: true,
    },
    {
      heading: <>Trusted Data <br />Sources</>,
      title: 'Leverage verified financial databases and market benchmarks for reliable insights.',
      bg: 'bg-white',
      textColor: 'text-[#1C2E70]',
      iconBg: 'bg-[#1C2E70]',
      button: true,
    },
    {
      heading: <>Competitive <br />Benchmarking </>,
      title: ' See how your business stacks up against competitors in your sector.',
      bg: 'bg-white',
      textColor: 'text-[#1C2E70]',
      iconBg: 'bg-[#1C2E70]',
      button: true,
    },
    {
      heading: <>Investor-Ready <br />Reports</>,
      title: 'Detailed PDF reports tailored for fundraising, acquisitions, or exit strategies.',
      bg: 'bg-white',
      textColor: 'text-[#1C2E70]',
      iconBg: 'bg-[#1C2E70]',
      button: true,
    },
  ];

  return (
    <SectionWrapper customClass={"bg-themeblue text-white"}>
      <div className="w-full mx-auto text-center">
        <p className="lg:text-lg md:text-sm text-xs mb-4"><span className="border-b border-white">Our Valuation Approach</span></p>
        <h2 className="text-2xl md:text-4xl lg:text-5xl mb-1">Valuing More Than Numbers:<br /><span className='text-themegreen text-3xl md:text-4xl lg:text-6xl'>Data-Driven & Humanized Methodology</span></h2>
        <p className="text-sm md:text-lg  mx-auto mb-10">
          We make valuations accessible, accurate, and actionable for businesses globally.
        </p>
        {/* Cards Grid */}
        <div className="grid w-full grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 relative">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`group relative rounded-xl p-8 ${card.bg} ${card.textColor} flex flex-col gap-1 md:h-60 h-56 w-full shadow-md transform transition duration-300 hover:translate-y-[-4px] hover:bg-[#1FA9A4]`}
            >
              <div className="w-9 h-9 bg-themeblue text-themegreen flex items-center justify-center rounded">
                  <ArrowUpRightIcon />
                </div>

              <div className="transition-opacity duration-300 group-hover:opacity-0 pt-4 pb-4">
                <p className="text-xl lg:text-xl xl:text-2xl text-left">{card.heading}</p>
              </div>

              <div className="absolute left-8 right-6 top-14 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto text-white text-left mt-4">
                <p className="mt-3 text-[13px] 2xl:text-sm">{card.title}</p>
              </div>
              {card.button && (
                <div className="mt-4 bottom-0 text-center absolute bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                  <a href='/methodology'><button className="text-white border shadow-gray-200 text-[13px] 2xl:text-sm border-gray-100 rounded-xl px-3 py-2 hover:bg-white hover:text-themegreens transition duration-300 hover:text-themegreen">
                    Know More
                  </button>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </SectionWrapper>
  );
};

