import GeneralButton from "../GeneralButton";
import { SectionWrapper } from "../generalComponent/SectionWrapper";
import GreenStripImg from "../../../static/images/green-strip-logo.png";
import Image from "next/image";
import GreenButton from "../GeneralButton";
const cardData = [
    {
        title: 'How We Calculate\nYour Business Value',
        subtitle: 'A Blend of Expertise and Automation',
        description:
            "We use a hybrid model combining two globally recognized valuation methods, carefully weighted based on your industry, stage, and financial profile to deliver meaningful results for your business.",
        methods: [<>Discounted Cash<br /> Flow (DCF)</>, <>Comparable<br />Analysis</>],
    },
    {
        title: "Tailored Weighting\nBased on Your Business",
        subtitle: "Not All Businesses Are the Same—So Neither Are Our Models",
        description:
            "Our platform automatically adjusts the weight assigned to each valuation method, depending on whether you're a startup, growth-stage company, or mature enterprise. This ensures a personalized and more accurate outcome.",
        methods: [],
    },
];

export default function ValuationMethodology() {
    return (
        <div className="relative w-full">
            {/* Blue Section */}
            <SectionWrapper customClass="bg-themeblue !pb-48 ">
                <div className="text-center max-w-4xl mx-auto lg:pt-10 md:pt-5 pb-10">
                    <h2 className="text-themegreen text-3xl md:text-4xl lg:text-6xl mb-4">
                        Our Valuation Methodology<br /><span className="text-[#F9F9F9]">Smart. Transparent. Tailored for You.</span>
                    </h2>
                    {/* <h1 className="text-3xl lg:text-6xl mb-4 text-white">
                        Smart. Transparent. Tailored for You.
                    </h1> */}
                    <p className="text-xs md:text-sm lg:text-xl mb-4 text-white">
                        At Clybourne, we believe business valuation shouldn't be a black box. That’s why we use a combination of proven valuation methods, real-time data, and AI-powered insights—so you can understand and trust every number.
                    </p>
                    <a href="#contact-form" scroll="false">
                        <GreenButton content={"Schedule A Call"} className={"bg-themegreen text-white"} />
                    </a>
                </div>
            </SectionWrapper>

            {/* Cards Overlapping Both Sections */}
            <div className="absolute -mt-40 left-0 w-full z-10 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36">
                <div className="absolute right-0 top-[-40px] -translate-y-1/2 hidden lg:block" >
                    <Image src={GreenStripImg} width={"200"} height={250} alt="logo-strip"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {cardData.map((card, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-[11.95px_-1.05px_35px_0px_rgba(0,0,0,0.15)] py-8 px-4 md:py-10 md:px-8 lg:py-12 lg:px-10 xl:py-20 xl:px-[60px] rounded-lg"
                        >
                            <h3 className="text-themeblue font-teko text-2xl md:text-3xl lg:text-4xl xl:text-5xl pb-4">
                                {card.title}
                            </h3>
                            {card.subtitle && (
                                <p className="text-xs md:text-sm xl:text-lg text-themeblack pb-1 font-semibold">{card.subtitle}</p>
                            )}
                            <p className="text-xs md:text-sm xl:text-lg text-themeblack mb-4">{card.description}</p>
                            {card.methods.length > 0 && (
                                <>
                                    <p className="text-xs md:text-sm xl:text-lg text-themeblue pb-3">Valuation Methods We Use:</p>
                                    <ul className="list-disc text-xs md:text-sm xl:text-lg text-themeblack flex gap-2 w-[100%]">
                                        {card.methods.map((method, i) => (
                                            <p
                                                key={i}
                                                className="
                                                    flex-none      
                                                    w-[50%]           
                                                    p-3 
                                                    bg-lightgrey 
                                                    shadow  
                                                    rounded-sm      
                                                "
                                            >
                                                {method}
                                            </p>
                                        ))}
                                    </ul>

                                </>
                            )}
                        </div>
                    ))}
                </div>

            </div>
            {/* Gray Background Section */}
            <section className="xl:pt-64 lg:pt-56 sm:pt-52 md:pt-40 pt-64 pb-80 px-5 md:px-20 z-0 relative border-0 shadow-none">
                {/* Additional content can go here */}
            </section>

        </div>
    );
}
