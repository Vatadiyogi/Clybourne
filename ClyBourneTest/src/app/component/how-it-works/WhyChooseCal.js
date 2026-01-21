import { Lightbulb, BarChart3, Shield } from "lucide-react";
import { SectionWrapper } from "../generalComponent/SectionWrapper";

export default function WhyChooseCal() {
  const cardData = [
    {
      id: 1,
      title: 'Tailored Approach',
      description: 'The system auto-selects the ideal valuation multiples based on your industry and company profile.',
      iconColor: '#1FA9A4',
    },
    {
      id: 2,
      title: 'Flexible Weighting',
      description: 'Assigning weights to different valuation models helps deliver more accurate and balanced results.',
      iconColor: '#1FA9A4',
    },
    {
      id: 3,
      title: 'Scenario Planning',
      description: 'Access three-scenario valuations—Lower, Base, and Best—to gauge business potential.',
      iconColor: '#1FA9A4',
    },
  ];
  return (
    <SectionWrapper customClass="bg-themeblue">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-10 rounded-full transform translate-x-36 -translate-y-36"></div>

      <div className="">
        <div className="mb-16">
          <h2 className="text-3xl lg:text-7xl mb-4 text-themegreen">
            Advanced Valuation Methods <br />for Precision
          </h2>
          <p className="text-lg text-white">Your data is processed through industry-leading valuation techniques, ensuring reliability and transparency.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cardData.map(({ id, title, description, iconColor }) => (
            <div
              key={id}
              className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="flex items-center gap-4 text-2xl mb-4">
                <div className="bg-blue-900 lg:p-2 p-1 w-fit rounded-md">
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
                <p className="text-xl xl:text-2xl text-themeblue">{title}</p>
              </div>
              <p className="text-themedark text-sm">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
