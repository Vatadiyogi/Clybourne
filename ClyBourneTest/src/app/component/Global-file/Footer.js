'use client';
import React, { useState } from 'react';
import { SectionWrapper } from '../generalComponent/SectionWrapper';
import { FaXTwitter } from 'react-icons/fa6';
import { FaLinkedinIn } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

export default function Footer() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleClick = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(email)) {
            setSubmitting(true);
            setError("");
            console.log("Valid email:", email);
            const payload = {
                email: email,
                type: "subscribe"
            }
            try {
                const response = await axios.post('http://localhost:5000/email', payload);

                if (response?.status === 200) {
                    toast.success('Subscribed Successfully!');
                }
                else {
                    toast.error(<>Could not Subscribed!<br /> Try again</>);
                }
            } catch (error) {
                toast.error(<>Could not Subscribed!<br /> Try again</>);
            }
            setEmail("");
            setSubmitting(false);
        } else {
            setError("Please enter a valid email address");
        }
    };
    return (
        <>
            {/* Contact Info Top Bar */}
            <div className="bg-teal-600 text-white py-4 text-center text-sm  md:text-sm lg:text-lg ">
                Email: <a href="mailto:help@clybourne.com" className="underline">helpassist@clybourneinsights.com</a> 
                {/* &nbsp; | &nbsp;
                Phone Support: <a href="tel:+12223450000" className="underline">+1 222-345-0000</a> */}
            </div>

            {/* Main Footer */}
            <SectionWrapper customClass='bg-themeblue text-white'>
                {/* <footer className="  py-10 px-8 sm:px-8 md:px-16"> */}
                <div className="flex  gap-8 md:flex-row justify-between  flex-col">
                    {/* Branding Section */}
                    <div className='lg:w-[40%] w-[100%] pr-4 lg:pr-16 xl:pr-24 2xl:pr-36'>
                        <h2 className="text-sm md:text-lg lg:text-[39px] text-white mb-6 font-interFont">Clybourne</h2>
                        <p className="text-base text-gray-300 mb-4">
                            Clybourne is a smart, AI-powered platform that simplifies business valuation for startups and growing companies. It delivers accurate, real-time reports using proven methodologies and global data—so you can make confident financial decisions with ease.
                        </p>
                    </div>

                    {/* About Links */}

                    {/* Navigation Links */}
                    <div className='lg:w-[20%] w-[100%]'>
                        <h3 className="lg:text-lg text-sm text-white mb-4 ">Navigation</h3>
                        <ul className="space-y-2  lg:text-[16px] text-gray-300 ">
                            <li><a href="/how-it-works" className="hover:text-white">How It Works</a></li>
                            <li><a href="/methodology" className="hover:text-white">Methodology</a></li>
                            <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
                            <li><a href="/about-us" className="hover:text-white">About Us</a></li>
                            <li><a href="/blogs" className="hover:text-white">Blogs</a></li>
                            <li><a href="/privacy-policy" className="hover:text-white">Privacy Policy</a></li>
                            <li><a href="/faq" className="hover:text-white">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Subscribe Section */}
                    <div className='lg:w-[30%] w-[100%]'>
                        <h3 className="lg:text-lg text-sm text-white mb-4 ">Subscribe</h3>
                        <p className="text-base text-gray-300 mb-4">
                            Sign up for our mailing list to get latest updates and offers
                        </p>
                        <div className="flex rounded  bg-white">
                            <input
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Enter your work email"
                                className="w-full px-4 py-2 text-sm text-black focus:outline-none"
                            />
                            <button disabled={submitting} onClick={handleClick} className="bg-teal-500 px-4 py-2 text-white flex items-center justify-center">
                                {submitting &&<ClipLoader
                                    color="#ffffff"
                                    size={20}
                                    speedMultiplier={0.5}
                                />}
                                {!submitting && <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 12H8m0 0l4-4m-4 4l4 4"
                                    />
                                </svg>}
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>


                </div>
                {/* </footer> */}

                {/* Social Icons */}
                <div className="flex flex-col pt-10  ">
                    <h3 className="lg:text-base text-xs text-white mb-4 md:text-left ">
                        Follow Us
                    </h3>
                    <div className="flex flex-col md:flex-row justify-start md:justify-between  md:items-start">
                        <div className="flex gap-4 ">
                            <a href="#" className="text-gray-300 hover:text-white">
                                <FaXTwitter size={26} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white">
                                <FaLinkedinIn size={26} />
                            </a>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </>
    );
}
