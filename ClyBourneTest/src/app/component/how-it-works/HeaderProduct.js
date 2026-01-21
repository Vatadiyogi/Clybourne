import Image from "next/image";
import { SectionWrapper } from "../generalComponent/SectionWrapper";
import DashboardImage from "../../../static/images/dashboadImage/image1.png"
import VerticalStickWithBox from "../VerticalStickWithBox"
import GreenButton from "../GeneralButton";
import GeneralButton from "../GeneralButton";
import GreenStripImg from "../../../static/images/green-strip-logo.png";

const cardData = [
    {
        topHeading: "Your Input, Our Intelligence",
        title: <><span className="text-themegreen">Streamline</span><br />Data Collection</>,
        description:
            "Answer simple questions to capture key business details like industry, country of operation, experience, and earnings history. Our intuitive process ensures a hassle-free start.",
    },
    {
        topHeading: "Financial Forecast",
        title: <><span className="text-themegreen">Capture</span><br />Business Performance</>,
        description:
            "Input your latest financial data and projected earnings for the next five years. Our platform evaluates your financial strength and future potential in minutes.",
    },
    {
        topHeading: "Valuation Models",
        title: <><span className="text-themegreen">AI-Powered </span><br />Valuation Inputs</>,
        description:
            "Our system integrates trusted financial sources to deliver accurate valuation parameters, such as multiples and discount rates.",
    },
];
export default function HeaderProduct() {

    return (
        <div className="relative w-full">
            {/* Blue Section */}
            {/* Your One-Stop Business Valuation Solution */}
            <SectionWrapper customClass="bg-themeblue !pb-48 ">
                <div className="text-center max-w-4xl mx-auto lg:pt-10 md:pt-5 pb-0 sm:pb-4 md:pb-8">
                    <h1 className="text-themegreen text-3xl md:text-4xl lg:text-6xl mb-4">
                        How It Works <br /><span className="text-[#F9F9F9]">Your One-Stop Business Valuation Solution</span>
                    </h1>
                    {/* <h1 className="text-3xl lg:text-6xl mb-4 text-white">
                        Your One-Stop Business Valuation Solution
                    </h1> */}
                    <p className="text-xs md:text-sm lg:text-xl mb-4 text-white">
                        Weʼve simplified the valuation process to make it seamless and easy to understand. <br/>

                        Hereʼs how Clybourne makes it work for you.

                    </p>
                    <div className="flex gap-5 justify-center">
                        <a href="#contact-form" scroll="false">
                            <GreenButton content={"Schedule A Call"} className={"bg-themegreen text-white"} />
                        </a>
                        <a href="/pricing"><GeneralButton content={"Buy Now"} className={"bg-white text-themeblue"} /></a>
                    </div>
                </div>
            </SectionWrapper>

            {/* Cards Overlapping Both Sections */}
            <div className="relative z-10 -mt-36 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36">
                <div className="absolute right-0 top-0 -translate-y-1/2 z-[100] hidden lg:block" >
                    <Image src={GreenStripImg} width={"200"} height={250} alt="logo-strip" />
                </div>
                <div className=" max-w-7xl mx-auto relative z-[10]">
                    {cardData.map((card, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-[11.95px_-1.05px_35px_0px_rgba(0,0,0,0.15)] py-8 px-4 md:py-10 md:px-8 lg:py-12 lg:px-10 xl:py-20 xl:px-[60px] rounded-md flex flex-col lg:flex-row gap-8 mb-10 sm:mb-12 md:mb-16 lg:mb-24 xl:mb-28 2xl:mb-32"
                        >
                            <div className="w-[100%] lg:w-[40%] flex gap-14">
                                <VerticalStickWithBox count={index} />
                                <div>
                                    <p className="text-2xl text-themeblue pb-8 font-bold italic">{card.topHeading}</p>
                                    <h3 className="text-themeblue font-teko text-3xl md:text-4xl lg:text-5xl xl:text-6xl pr-6 pb-2">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs md:text-sm xl:text-lg text-themeblack">{card.description}</p>

                                </div>
                            </div>
                            <div className="w-[100%] lg:w-[60%] flex items-center justify-center">
                                <Image
                                    src={DashboardImage}
                                    alt="logo"
                                    priority
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute left-0 bottom-[-50px] translate-y-1/2 hidden lg:block">
                    <Image src={GreenStripImg} width={200} height={250} alt="Green strip bottom" />
                </div>

            </div>
            {/* Gray Background Section */}
            <section className="pt-2 md:pt-3 lg:pt-4 px-5 md:px-20 relative">
                {/* <div className="pb-16 flex justify-center">
                    <button className="bg-themegreen text-white px-6 py-2 rounded lg:text-lg text-xs hover:bg-teal-500 transition">
                        View More
                    </button>
                </div> */}
            </section>

        </div>
    );
}
     