import Image from "next/image";
import { SectionWrapper } from "../generalComponent/SectionWrapper";
import blueStripImg from "../../../static/images/blue-strip-logo.png"; // Adjust the path as necessary

export default function Visionaries() {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Chief Executive Officer",
      initials: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Chief Technology Officer",
      initials: "MR"
    },
    {
      name: "Emily Thompson",
      role: "Chief Financial Officer",
      initials: "ET"
    },
    {
      name: "David Kim",
      role: "Chief Operating Officer",
      initials: "DK"
    }
  ];

  return (
    <SectionWrapper customClass="bg-lightgrey relative" >
      <div className="">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-6xl text-themeblue">
            Meet Our Visionaries
          </h2>
          <h2 className="text-3xl lg:text-5xl mb-6 text-themegreen">
            Leaders Who Inspire Confidence
          </h2>
          <p className="text-lg  text-themedark mb-6">
            Behind Clybourne is a team of experts with decades of experience in business valuation and <br />technology. Together, they ensure you get insights that matter.            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-[10]">
          {teamMembers.map((member, index) => (
            <div key={index} className="group ">
              <div className="bg-white   rounded-2xl">
                {/* Professional headshot placeholder */}
                <div className="w-24 h-56 mx-auto flex items-center justify-center">
                  {/* <span className="text-white text-2xl">{member.initials}</span> */}
                </div>
              </div>
              <div className="pt-5">
                <h3 className="text-xl mb-1 text-themeblue font-extrabold">{member.name}</h3>
                <p className="text-sm text-black mb-3">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute left-0 bottom-0 top-[50%] hidden lg:block">
        <Image src={blueStripImg} height={250} width={110} alt="" />
      </div>
    </SectionWrapper>
  );
}
