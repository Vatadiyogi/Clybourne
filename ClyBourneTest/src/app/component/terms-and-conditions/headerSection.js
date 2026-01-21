import Image from "next/image";
import { SectionWrapper } from "../generalComponent/SectionWrapper";
import GreenStripImg from "../../../static/images/green-strip-logo.png";

const terms = [
  {
    heading: "Acceptance",
    content: "By using Clybourne, you agree to these Terms."
  },
  {
    heading: "Use of Platform",
    content: "You agree to use the platform solely for business valuation. Reverse engineering or unauthorized use is prohibited."
  },
  {
    heading: "Account Responsibility",
    content: "You must provide accurate information and secure your credentials."
  },
  {
    heading: "Payment",
    content: "All payments are non‑refundable. Pricing may change with notice."
  },
  {
    heading: "Valuation Disclaimer",
    content: "Reports are based on your inputs and for informational purposes only—not investment advice."
  },
  {
    heading: "Intellectual Property",
    content: "All content and tools belong to Clybourne. Do not copy or distribute without permission."
  },
  {
    heading: "Limited License",
    content: "You are granted a non‑transferable license for personal/business valuation use only."
  },
  {
    heading: "Privacy",
    content: "We follow strict privacy standards. See our Privacy Policy for details."
  },
  {
    heading: "Limitation of Liability",
    content: "Clybourne is not liable for business outcomes based on report results."
  },
  {
    heading: "Jurisdiction",
    content: "These terms are governed by the laws of Singapore."
  }
];

export default function ConditonsHeaderSection() {

    return (
        <div className="relative w-full">
            {/* Blue Section */}
            {/* Your One-Stop Business Valuation Solution */}
            <SectionWrapper customClass="bg-themeblue pb-48">
                <div className="text-center max-w-4xl mx-auto lg:pt-10 md:pt-5 pb-0 sm:pb-2 md:pb-4">
                    <h1 className="text-themegreen text-3xl md:text-4xl lg:text-6xl">
                        Terms & Conditions
                    </h1>
                </div>
            </SectionWrapper>

            {/* Cards Overlapping Both Sections */}
            <div className="relative z-10 -mt-36 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36">
                <div className="absolute right-0 top-0 -translate-y-1/2 z-[100] hidden lg:block" >
                    <Image src={GreenStripImg} width={"200"} height={250} alt="logo-strip"/>
                </div>
                <div className=" max-w-7xl mx-auto relative z-[10]">
                    <div
                        className="bg-white shadow-[11.95px_-1.05px_35px_0px_rgba(0,0,0,0.15)] py-8 px-4 md:py-10 md:px-8 lg:py-12 lg:px-10 xl:py-20 xl:px-[60px] rounded-md gap-8 mb-10 sm:mb-12 md:mb-16 lg:mb-24 xl:mb-28 2xl:mb-32"
                    >
                        <p className="text-xs md:text-sm xl:text-lg text-themeblack font-bold pb-8">
                            <span className="text-themeblue">Effective Date:</span> 1st September 2024
                        </p>
                        {
                            terms?.map((section, index) => (
                                <div key={index} className="mb-8">
                                    <h3 className="text-themeblue text-md md:text-md lg:text-lg xl:text-xl pr-6 pb-2 font-bold">
                                        {`${index + 1}. ${section.heading}`}
                                    </h3>
                                    <p className=" pl-5 text-xs md:text-sm xl:text-lg text-themeblack">
                                        {section.content}
                                    </p>
                                </div>
                            ))
                        }
                        <p className="text-xs md:text-sm xl:text-lg text-themeblack font-bold pt-4">
                            <span className="text-themeblue">Contact:</span> privacy@clybourneinsignts.com
                        </p>
                    </div>
                </div>

            </div>
            {/* Gray Background Section */}
            <section className="pt-2 md:pt-3 lg:pt-4 px-5 md:px-20 relative">
            </section>

        </div>
    );
}
