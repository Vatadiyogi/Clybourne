'use client';
import React from 'react';
import { SectionWrapper } from '../generalComponent/SectionWrapper';
import Image from 'next/image';

const KnowledgeHub = () => {
    const resources = [
        {
            title: <>Clybourne<br /> Overview</>,
            date: '16th August, 2025',
            linkText: 'Download Brochure',
            link: "/pdfs/Brochure_CB.pdf",
            download: "clybourne_overview.pdf",
            image: "/blog/Brochure.jpg"
        },
        {
            title: <>Simplifying Startup<br /> Fundraising</>,
            date: '18th August, 2025',
            linkText: 'Download Case Study',
            link: "/pdfs/CaseStudy_CB.pdf",
            download: "case_study.pdf",
            image: "/blog/CaseStudy.jpg"

        },
        {
            title: <>Business<br /> Valuation Report</>,
            date: '21th August, 2025',
            linkText: 'Download Report',
            link: "/pdfs/Final Report_Design.pdf",
            download: "business_valuation_report.pdf",
            image: "/blog/Report.jpg"

        },
    ];

    return (
        <SectionWrapper customClass={"bg-lightgrey"} >
            {/* Heading */}
            <div className="mb-12 text-center">
                <h4 className="text-themeblue lg:text-lg md:text-sm text-xs  font-normal pb-4">
                    <span className='border-b-2  border-themeblue pb-[2px]'>Resources</span>
                </h4>
                <h2 className="text-3xl sm:text-4xl md:text-6xl text-center text-themegreen">Free Valuation Toolkit:<br />
                    <span className=" text-themeblue">Templates & Financial Models</span>
                </h2>
                <p className="mt-1 max-w-xl mx-auto md:text-lg text-sm text-themeblack">
                    Download our Business Valuation Checklist and Financial Projection Template.
                </p>
            </div>

            {/* Cards */}
            <div className="flex w-full flex-col md:flex-row justify-center md:px-22  items-center gap-6">
                {resources.map((resource, index) => (
                    <div
  key={index}
  className="bg-cover bg-center rounded-xl w-full shadow-lg transition-transform hover:-translate-y-1 flex h-50 md:h-72"
  style={{ backgroundImage: `url(${resource.image})` }}
>
                        <div className="bg-white text-thebg-themeblue rounded-md p-4 ml-4 mb-3 mt-4 mr-12 w-full md:self-end">
                            <h3 className="text-lg text-black">{resource.title}</h3>
                            <p className="text-[10px] text-themegreen mt-1">{resource.date}</p>
                            <a
                                href={resource?.link}
                                download={resource?.download}
                                className="block mt-3 text-themeblue text-sm"
                            >
                                {resource.linkText}
                            </a>
                        </div>
                    </div>

                ))}
            </div>
        </SectionWrapper>);
};

export default KnowledgeHub;
