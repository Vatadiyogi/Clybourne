"use client";

import React, { useState } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { SectionWrapper } from "../generalComponent/SectionWrapper";

const testimonials = [
    {
        name: "A Leading Fintech Startup",
        title: "Founder",
        image: "https://i.pravatar.cc/100?img=1",
        quote:
            "Clybourne provided a fast, insightful valuation that helped us close our funding round with confidence.",
    },
    {
        name: "A Growing Green-Tech Company",
        title: "CEO",
        image: "https://i.pravatar.cc/100?img=2",
        quote:
            "User-friendly and transparent. The valuation report impressed our investors and saved us weeks of work.",
    },
    {
        name: "An Emerging Consumer Brand",
        title: "Director",
        image: "https://i.pravatar.cc/100?img=3",
        quote:
            "Great support and accurate valuation modeling. Highly recommended for any early-stage founder.",
    },
    {
        name: "A Digital Commerce Venture",
        title: "MD",
        image: "https://i.pravatar.cc/100?img=4",
        quote:
            "Clybourne gave us clarity and negotiation power. It’s a must-have for growing startups.",
    },
    {
        name: "A Reputed VC Firm",
        title: "Investment Analyst",
        image: "https://i.pravatar.cc/100?img=4",
        quote:
            "A fantastic blend of automation and expert insight. The process was clear and the results valuable.",
    },
];

const TestimonialCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? testimonials.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    // Responsive visible testimonials
    const getVisibleTestimonials = () => {
        const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        const nextIndex = (currentIndex + 1) % testimonials.length;

        if (typeof window !== "undefined" && window.innerWidth < 768) {
            // Mobile: only center card
            return [
                { ...testimonials[currentIndex], position: "center" },
            ];
        }

        return [
            { ...testimonials[prevIndex], position: "left" },
            { ...testimonials[currentIndex], position: "center" },
            { ...testimonials[nextIndex], position: "right" },
        ];
    };

    return (
        <SectionWrapper customClass={"bg-lightgrey"}>
            <div className="">
                {/* Top Heading Section */}
                <div className="text-center mb-12">
                    <h4 className="text-themeblue lg:text-lg md:text-sm text-xs  font-normal pb-4">
                        <span className='border-b-2  border-themeblue pb-[2px]'>Testimonials</span>
                    </h4>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl text-themeblue">
                        Hear From 5,000+ Satisfied<br className="hidden sm:block" />Clients
                    </h2>
                    <p className="md:text-lg text-sm text-themeblack max-w-2xl mx-auto mt-1">
                        “Clybourne’s report helped us secure investor funding in days—not weeks.”
                    </p>
                </div>

                {/* Carousel Section */}
                <div className="flex items-center justify-between gap-4">
                    {/* Left Arrow */}
                    <button
                        onClick={handlePrev}
                        className="w-10 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:border-[#1C2E70] text-gray-600 hover:text-[#1C2E70] hover:scale-110 transition duration-300 shadow-sm"
                    >
                        &#8249;
                    </button>

                    {/* Cards */}
                    <div className="flex gap-4 md:gap-6 w-full justify-center items-center transition-all duration-500">
                        {getVisibleTestimonials().map((item, index) => {
                            const isCenter = item.position === "center";

                            const heightClass = isCenter ? "h-[300px]" : "h-[270px]";
                            const widthClass = isCenter ? "md:w-[32%]" : "md:w-[26%]";
                            const visibilityClass = isCenter
                                ? "z-20 scale-105"
                                : "opacity-50 scale-95 hidden md:block";
                            const shadowClass = isCenter ? "shadow-xl" : "shadow-md";

                            return (
                                <div
                                    key={index}
                                    className={`bg-white rounded-xl ${heightClass} ${widthClass} ${visibilityClass} ${shadowClass} px-6 py-8 text-center transition-all duration-500 transform overflow-hidden flex flex-col justify-between`}
                                >
                                    <FaQuoteLeft
                                        className={`mx-auto mb-4 text-2xl ${isCenter ? "text-themegreen" : "text-themeblack"
                                            }`}
                                    />
                                    <p className="text-sm text-themeblack italic mb-4 line-clamp-6">
                                        {item.quote}
                                    </p>
                                    <div>
                                        <p className="text-xs text-themeblack pt-4">{item.name}</p>
                                        <p className="text-xs text-themeblack italic">{item.title}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={handleNext}
                        className="w-10 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:border-themeblue text-themeblack hover:text-themeblue hover:scale-110 transition duration-300 shadow-sm"
                    >
                        &#8250;
                    </button>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default TestimonialCarousel;
