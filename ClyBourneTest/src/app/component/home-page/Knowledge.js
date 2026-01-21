'use client';

import React, { useEffect, useState } from 'react';
import { SectionWrapper } from '../generalComponent/SectionWrapper';
// import { client } from '../../../sanity/client';
import Image from 'next/image';
import Link from 'next/link';
import GeneralButton from '../GeneralButton';
import { getAllPosts } from '../../lib/post';

const blogPosts = [
    {
        title: 'How to Value a Startup',
        summary:
            'DCF vs. Multiples.',
        date: '23 September 2025',
    },
    {
        title: 'Preparing for Fundraising',
        summary:
            'Valuation Best Practices.',
        date: '23 September 2025',
    },
    {
        title: 'Case Study',
        summary:
            'How SaaS Company X Secured \$2M Using Clybourne’s Report.',
        date: '23 September 2025',
    },
];


function sliceToCompleteWord(text, limit = 150, ellipsis = '…', wordSeparator = /\s/) {
        const str = String(text);
        if (str.length <= limit) {
            return str;
        }

        // If char at limit is whitespace, it's safe to slice there
        if (wordSeparator.test(str[limit])) {
            return str.slice(0, limit) + (ellipsis || '');
        }

        // Otherwise, extend until the next separator or end of string
        let end = str.slice(limit).search(wordSeparator);
        if (end === -1) {
            // No more whitespace—return entire string
            return str;
        }
        return str.slice(0, limit + end) + (ellipsis || '');
    }


export default function KnowledgeHubSection() {
    const blogs = getAllPosts();
    const [visibleCards, setVisibleCards] = useState(blogs.slice(0, 3));
    
    
    return (
        <SectionWrapper customClass={"bg-lightgrey"}>
            <div className="w-full md:px-22 flex flex-col items-center">
                {/* <p className="text-xl text-[#233977] underline">
                    The Knowledge Hub
                </p> */}
                <h4 className="text-themeblue lg:text-lg md:text-sm text-xs  font-normal mb-4">
                    <span className='border-b-2  border-themeblue pb-[2px]'>The Knowledge Hub</span>
                </h4>
                <h2 className="text-3xl sm:text-4xl md:text-6xl text-themeblue mb-1 text-center">
                    Business Valuation Guides & <br className="hidden sm:block" /> Growth
                    Strategies
                </h2>
                <p className="text-lg text-themeblack text-center">
                    Explore trending topics.
                </p>

                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 relative z-[10] mt-10">
                    {visibleCards?.map((card, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md flex flex-col">
                            {/* <div className="h-48 bg-[#2C234D] w-full rounded-t-lg"></div> */}
                            <Image
                                src={`/${(card?.bannerImage)}`}
                                width={500}
                                height={400}
                                alt="blog-banner"
                            />
                            <div className="p-8 flex flex-col items-start justify-between h-[80%]">
                                <h3 className="text-themeblue text-base sm:text-lg lg:text-xl mb-1">{card?.heading}</h3>
                                <p className="text-themeblack text-sm lg:text-base mb-8">{`${sliceToCompleteWord(card?.initialParagraph)}`}</p>
                                <Link href={`/blog-details/${card?.slug}`} key={index} className="no-underline">
                                    <GeneralButton content="Read More" className="bg-themegreen text-white" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
}