"use client"
import { SectionWrapper } from "../generalComponent/SectionWrapper";
import GreenButton from "../GeneralButton";
// import Image from "next/image";
import GreenStripImg from "../../../static/images/green-strip-logo.png";
import GeneralButton from "../GeneralButton";
import { useEffect, useState } from "react";
import { client } from "../../../sanity/client";
import Link from "next/link";
import {getAllPosts} from "../../lib/post"
import Image from "next/image";



export default function BlueCard() {
    const [showAll, setShowAll] = useState(false);
    // Fetch list of blogs
    const [blogs, setBlogs] = useState([])
    const [visibleCards, setVisibleCards] = useState(blogs.slice(0, 9));

    useEffect(() => {
        setVisibleCards(blogs.slice(0, 9))
    }, [blogs])

    const handleViewMore = () => {
        setVisibleCards(blogs)
    }

    const posts = getAllPosts();
    console.log(posts, "posts");

    useEffect(() => {
        const fetchBlogs = async () => {
            const query = `*[_type == "blogList"] | order(publishedAt desc){
        heading,
        bannerImage{ 
            asset->{
                url,
                metadata
            }
        },
        initialParagraph,
        publishDate,
        slug
      }`

            try {
                const data = await client.fetch(query)
                console.log('Fetched blogs:', data)
                setBlogs(data)
            } catch (error) {
                console.error('Failed to fetch blogs:', error)
            }
        }

        fetchBlogs()
    }, [])

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

    return (
        <div className="w-full relative bg-lightgrey">
            {/* Top Section */}
            <SectionWrapper customClass="bg-themeblue !pb-48 ">
                <div className="text-center max-w-4xl mx-auto pt-10 pb-15">
                    <h2 className="text-themegreen text-3xl md:text-4xl lg:text-6xl mb-4">
                        Insights Hub<br />
                        <span className="text-[#F9F9F9]">Valuation Know-How, Market Trends & Growth Insights</span>
                    </h2>
                    <p className="text-xs md:text-sm lg:text-xl mb-4 text-white">
                        Welcome to our knowledge center—designed for entrepreneurs, founders, and finance professionals. Discover practical guides, expert tips, and industry updates to help you grow and scale smarter.
                    </p>
                </div>
            </SectionWrapper>

            {/* Cards Grid */}
            <div className="relative z-10 -mt-36 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36">
                <div className="absolute right-0 top-0 -translate-y-1/2 hidden lg:block">
                    <Image src={GreenStripImg} width={200} height={250} alt="Green strip top" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 relative z-[10]">
                    {posts?.map((card, index) => (
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

                <div className="absolute left-0 bottom-[-100px] translate-y-1/2 hidden lg:block">
                    <Image src={GreenStripImg} width={200} height={250} alt="Green strip bottom" />
                </div>
            </div>

            {/* Button Section */}
            <section className="bg-lightgrey pt-16 md:pt-20 lg:pt-24 px-5 md:px-20 relative">
                {visibleCards.length !== blogs.length && <div className="pb-16 flex justify-center">
                    <GreenButton
                        content="View More"
                        className="bg-themegreen text-white"
                        onClick={handleViewMore}
                    />
                </div>
                }
            </section>
        </div>
    );
}


