import { SectionWrapper } from "../generalComponent/SectionWrapper";
import Image from "next/image";
import blogimage1 from "../../../static/images/blog1.png"

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

export default function Blog() {
    return (
        <div className="relative w-full">
            {/* Blue Section */}
            <SectionWrapper customClass="bg-themeblue">
                <div className="text-center max-w-4xl mx-auto lg:pt-10 md:pt-5 pb-10">
                    <h2 className="text-themegreen text-3xl md:text-4xl lg:text-6xl mb-4">
                        Blog<br /><span className="text-[#F9F9F9]">Valuation Know-How Market Trends &'<br/>Growth Insights</span>
                    </h2>
                    {/* <h1 className="text-3xl lg:text-6xl mb-4 text-white">
                        Smart. Transparent. Tailored for You.
                    </h1> */}
                    <p className="text-xs md:text-sm lg:text-xl mb-4 text-white">
                        Author - Unknown
                    </p>
                   
                </div>
            </SectionWrapper>

            {/* Cards Overlapping Both Sections */}
            <div className="absolute -mt-40 left-0 w-full z-10">
            <SectionWrapper customClass="py-0">
                    <div className="relative md:w-full lg:h-[450px] md:h-[300px] h-[200px]">
                        <Image
                            src={blogimage1} // replace with your actual image path
                            alt="Section Banner"
                            layout="fill"
                            objectFit="cover"
                            priority // optional: speeds up loading for above-the-fold images
                        />
                    </div>
            </SectionWrapper>
            </div>

            {/* Gray Background Section */}
            <section className="bg-[#1e1e1e] xl:pt-0 lg:pt-56 sm:pt-52 md:pt-40 pt-20 xl:pb-80 lg:pb-40 md:pb-16 pb-0.5 px-5 md:px-20 z-0 relative border-0 shadow-none">
                {/* Additional content can go here */}
            </section>

        </div>
    );
}
