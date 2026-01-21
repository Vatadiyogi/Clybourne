'use client';
import { useState } from "react";
import { SectionWrapper } from "../generalComponent/SectionWrapper";
import Image from "next/image";
import GreenStripImg from "../../../static/images/green-strip-logo.png";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { toast } from "react-toastify";


const faqs = [
    {
        question: "What does Clybourne do?",
        answer: "Clybourne provides fast, accurate, and professional business valuation services using methodologies such as DCF and market comparables, designed for startups, SMEs, and growing businesses."
    },
    {
        question: "How does the valuation process work?",
        answer: "After signup, you’ll enter financials and projections on an intuitive dashboard. Our platform analyzes the data using automated models and delivers a valuation report within 2 working days."
    },
    {
        question: "Can I revise my inputs?",
        answer: "Yes, you get one opportunity to revise your inputs within 48 hours of receiving the report."
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. All your data is encrypted, securely stored, and never shared without your explicit consent."
    },
    {
        question: "Do I need financial expertise to use Clybourne?",
        answer: "No. The platform is beginner-friendly, and support is available throughout the process."
    },
    {
        question: "How much does it cost?",
        answer: "Please refer to our Pricing page for detailed plans and features."
    },
    {
        question: "Can I use this for investment or acquisition purposes?",
        answer: "Yes. Our reports are designed to support fundraising, M&A, and strategic decisions."
    },
    // {
    //     question: "Is Clybourne available in my country?",
    //     answer: "Clybourne operates in 80+ countries. For specific country availability, please refer to our supported countries page."
    // },
];

export default function FaqSection() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggle = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    const initialValues = {
        fullname: '',
        email: '',
        question: ''
    };

    const validationSchema = Yup.object({
        fullname: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required'),
        question: Yup.string().required('Quesion is required')
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const payload = {
                fullName: values?.fullname,
                email: values?.email,
                question: values?.question,
                type: 'askQuesion',
            };
            const response = await axios.post('http://localhost:5000/email', payload);

            if (response?.status === 200) {
                toast.success('Form Submitted Successfully!');
                resetForm();
                setSubmitting(false);
            }
            else {
                toast.error(<>Form Submission Failed!<br /> Try again</>);
            }
        } catch (error) {
            toast.error(<>Form Submission Failed!<br /> Try again</>);
            console.error('Submission error:', error);
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <SectionWrapper customClass="bg-white relative">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 text-black">
                {/* FAQs Section */}
                <div>
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border rounded-md mb-6 ${index === activeIndex ? "border-teal-500 text-black" : "border-gray-200"
                                }`}
                        >
                            <button
                                onClick={() => toggle(index)}
                                className="w-full text-left px-4 py-3 flex justify-between items-center"
                            >
                                <span
                                    className={`${index === activeIndex ? "text-teal-600 font-medium" : ""
                                        }`}
                                >
                                    {faq.question}
                                </span>
                                <div>
                                    {index === activeIndex ? <span className="text-themegreen">︿</span> : <span>﹀</span>}
                                </div>
                                {/* <span className={`${index===activeIndex}? 'text-themegreen': 'text-black'`} >{index === activeIndex ? "︿" : "﹀"}</span> */}
                            </button>
                            {index === activeIndex && (
                                <div className="px-4 pb-4 text-[#777777] text-sm">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Section */}
                <div className="">
                    <div className="md:p-6 p-3 bg-[#f8f8f8] rounded-md">
                        <h3 className="text-2xl font-medium mb-4 px-4">Ask your question</h3>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            validateOnMount={true}
                            onSubmit={handleSubmit}
                        >
                            {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched, handleSubmit }) => (
                                <form className="max-w-5xl mx-auto px-4 grid gap-4" onSubmit={handleSubmit}>
                                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#373743]"> */}
                                        <div>
                                            <Field
                                                name="fullname"
                                                type="text"
                                                placeholder="Name*"
                                                className="w-full p-3 border border-none rounded outline-none"
                                            />
                                            <ErrorMessage name="fullname" component="div" className="text-red-500 text-xs mt-1" />
                                        </div>
                                        <div>
                                            <Field
                                                name="email"
                                                type="email"
                                                placeholder="E-mail*"
                                                className="w-full p-3 border-none rounded outline-none"
                                            />
                                            <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                                        </div>
                                    {/* </div> */}

                                    <div>
                                        <Field
                                            as="textarea"
                                            rows="6"
                                            placeholder="Write Something*"
                                            name="question"
                                            className="w-full p-3 border-none rounded outline-none"
                                        />
                                        <ErrorMessage name="question" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>

                                    <div className="text-center pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`bg-themegreen px-8 py-2 text-white transition rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
            <div className="absolute left-0 bottom-[-100px] translate-y-1/2 hidden lg:block">
                <Image src={GreenStripImg} width={200} height={250} alt="Green strip bottom" />
            </div>
        </SectionWrapper>
    );
}
