import { SectionWrapper } from "../generalComponent/SectionWrapper";

export default function FaqBanner() {
    return (
        <SectionWrapper customClass="text-center bg-themeblue ">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-themegreen   mb-4">
                Frequently Asked Questions (FAQs) <br /><span className="text-[#F9F9F9]">Answers to What You’re Wondering About</span>
            </h2>
            {/* <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-[65px] text-white mb-8">
                Answers to What You’re Wondering About
            </h1> */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white">
                Still have questions? We’ve got you covered.
            </p>
        </SectionWrapper>
    );
}
  