'use client';

import Link from 'next/link';

const stats = [
    { value: '$790M', label: 'Funding Secured' },
    { value: '1100+', label: 'Clients Served' },
    { value: '70+ ', label: "Client Presence" },
];

export default function OurStorySection() {
    return (
        <section className="bg-lightgrey px-8 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36  py-12 xl:py-40 lg:py-20 relative">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
                {/* Left Content */}
                <div className="lg:w-1/2 w-full pr-6">
                    <h4 className="text-themeblue mb-4 lg:text-lg md:text-sm text-xs font-normal">
                        <span className="border-b-2 border-themeblue pb-[2px]">About Us</span>
                    </h4>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl text-themegreen">
                        Our Story:<br /><span className='text-themeblue'>Redefining Business Valuation</span>
                    </h2>
                    <p className="text-themeblack mt-1 max-w-md md:text-lg text-sm">
                        At Clybourne, we’re on a mission to make accurate valuations simple, insightful, and accessible to businesses worldwide.
                    </p>
                </div>

                {/* Right Stat Cards */}
                <div className="lg:w-1/2 w-full flex flex-col sm:flex-row justify-between items-center lg:items-stretch gap-6 relative z-10">
                    {stats.map((item, index) => (
                        <div
                            key={index}
                            className={`rounded-lg px-6 py-9 w-[50%] sm:w-1/3 lg:w-[32%] text-center transition-transform duration-300 bg-white text-themeblack hover:bg-themeblue hover:text-white`}
                        >
                            <div className="2xl:4xl xl:text-3xl lg:text-2xl text-xl font-extrabold">
                                {item.value}
                            </div>
                            <div className="text-[15px] mt-2">{item.label}</div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Green Background Box on Right */}
            <div className="hidden lg:block absolute right-0 top-0 xl:mt-32 lg:mt-24 w-[29%] h-[60%] bg-themegreen z-0"></div>
        </section>
    );
}
