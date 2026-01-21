"use client"
import Image from "next/image";
import blogimage from "../../../static/images/images.png"
import { useEffect, useState } from "react";
// import { client } from "../../../sanity/client";
import Link from "next/link";
import { getAllPosts } from "../../lib/post";

const latestBlogs = [
    {
        id: 1,
        title: "Duis aute irure dolor in",
        subtitle: "reprehenderit velit esse",
        image: "/thumbnail1.png", // use any placeholder
    },
    {
        id: 2,
        title: "Duis aute irure dolor in",
        subtitle: "reprehenderit velit esse",
        image: "/thumbnail2.png",
    },
    {
        id: 3,
        title: "Duis aute irure dolor in",
        subtitle: "reprehenderit velit esse",
        image: "/thumbnail3.png",
    },
];


export default function Sidebar() {
        const blogs= getAllPosts();

    const [visibleCards, setVisibleCards] = useState(blogs.slice(0, 3));
    return (
        <aside className="w-full mt-4">
            <div>
                <div className="flex items-center py-4">
                    <span className="text-gray-300 uppercase text-sm font-semibold flex-shrink-0">
                        Latest Blogs
                    </span>
                    <div className="flex-grow border-t border-gray-300 ml-4"></div>
                </div>
                <div className="space-y-6">
                    {visibleCards.map((blog, index) => (
                        <Link href={`/blog-details/${blog?.slug}`} key={index} className="no-underline mt-4">
                            <div key={index} className="flex items-center gap-4 mt-4 ">
                                <div className="w-[40%] bg-gray-600 rounded">
                                    <Image
                                        src={`/${(blog?.bannerImage)}`}
                                        alt={"banner image"}
                                        width={500}
                                        height={400}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="w-[60%]">
                                    <p className="text-xs font-medium">{blog.heading}</p>
                                    {/* <p className="text-gray-400 text-[10px]">{blog.subtitle}</p> */}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex items-center py-4">
                    <span className="text-gray-300 uppercase text-sm font-semibold flex-shrink-0">
                        Banner Spot
                    </span>
                    <div className="flex-grow border-t border-gray-300 ml-4"></div>
                </div>
                <div className="w-full aspect-video bg-gray-500 rounded overflow-hidden relative">
                    <Image
                        src="/rectangle.png" // Replace this with your actual image path
                        alt="Banner Spot"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </div>
        </aside>
    );
}
