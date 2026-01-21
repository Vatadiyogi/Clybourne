import { Lightbulb, BarChart3, Shield } from "lucide-react";
import { SectionWrapper } from "../generalComponent/SectionWrapper";

export default function WhyChoose() {
  return (
    <SectionWrapper customClass="bg-themeblue">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-10 rounded-full transform translate-x-36 -translate-y-36"></div>

      <div className="">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-6xl text-white">
            Why Choose Clybourne?
          </h2>
          <h2 className="text-3xl lg:text-5xl mb-6 text-themegreen">
            Innovation Engineered, Accuracy Amplified
          </h2>
          <p className="text-lg  text-white">We redefine the valuation experience by combining:</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: AI Precision */}
          <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">

            <div className="flex  items-center gap-3 text-2xl mb-4">
              <div className=" bg-blue-900 p-2 w-fit rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#1FA9A4] transform rotate-[-180deg]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 7l-10 10M17 17H7V7"
                  />
                </svg>
              </div>
              <p className="text-2xl  text-themeblue">AI <br />Precision</p>
            </div>
            <p className="text-gray-600 text-themedark">
              Cutting-edge algorithms delivering real-time, accurate data.
            </p>
          </div>

          {/* Card 2: Expert Insights */}
          <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">

            <div className="flex  items-center gap-4 text-2xl  mb-4">
              <div className=" bg-blue-900 p-2 w-fit rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#1FA9A4] transform rotate-[-180deg]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 7l-10 10M17 17H7V7"
                  />
                </svg>
              </div>
              <p className="text-2xl  text-themeblue">Expert<br />Insights</p>
            </div>
            <p className="text-gray-600 text-themedark">
              Seasoned professionals guiding every valuation.
            </p>
          </div>

          {/* Card 3: Seamless Integration */}
          <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">

            <div className="flex  items-center gap-4 text-2xl  mb-4">
              <div className=" bg-blue-900 p-2 w-fit rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#1FA9A4] transform rotate-[-180deg]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 7l-10 10M17 17H7V7"
                  />
                </svg>
              </div>
              <p className="text-2xl  text-themeblue">Seamless<br />Experience</p>
            </div>
            <p className="text-gray-600 text-themedark">
              A user-friendly valuation platform for efficient outcomes.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
