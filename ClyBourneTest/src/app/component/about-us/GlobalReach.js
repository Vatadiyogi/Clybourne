import { Globe } from "lucide-react";
import { SectionWrapper } from "../generalComponent/SectionWrapper";

export default function GlobalReach() {
    return (
        <SectionWrapper customClass="bg-lightgrey">
            <div className="">
                <div className="flex justify-center items-center flex-col md:flex-row md:gap-14 gap-4">
                    <div className="md:w-[60%] w-[100%]">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl text-themeblue text-themeblue">
                            Global Reach, Local Expertise
                        </h2>
                        <h2 className="text-3xl lg:text-5xl mb-6 text-themegreen">
                            Your Trusted Partner Worldwide
                        </h2>
                    </div>
                    <p className="text-themedark  text-xl mb-8 md:w-[40%] w-[100%]">
                        A Trusted Partner in Every Corner of the World
                        Founded in the United States, we now support businesses in India, the UK, and Singapore. Our mission is to simplify valuations for businesses of every size, wherever they operate.
                    </p>
                </div>
            </div>
        </SectionWrapper>
    );
}
