import { SectionWrapper } from "../generalComponent/SectionWrapper";

export default function PromiseClybourn() {
    return (
        <SectionWrapper customClass="bg-white" >
            <div className="">
                <div className="grid lg:grid-cols-2 lg:gap-16 items-center gap-4">
                    <div>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl text-themeblue">
                            The Clybourne Promise
                        </h2>
                        <h2 className="text-3xl lg:text-5xl mb-6 text-themegreen">
                            Reliability, Innovation, and
                            Customer-Centricity
                        </h2>
                    </div>
                    <div>
                        {[
                            {
                                heading: "Accuracy You Can Trust",
                                paragraph: "Precision-driven results tailored to your business.",
                            },
                            {
                                heading: "Technology Meets Care",
                                paragraph: "Innovation simplified to suit your goals.",
                            },
                            {
                                heading: "Client-First Approach",
                                paragraph: "Your success is our priority.",
                            },
                        ].map((item, index) => (
                            <div key={index} className="p-2  border-b border-themegreen last:border-b-0" >
                                <h3 className="text-themeblue text-lg md:text-xl lg:text-2xl font-bold">{item.heading}</h3>
                                <p className="text-xl text-themedark">{item.paragraph}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
