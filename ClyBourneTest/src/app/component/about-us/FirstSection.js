import { SectionWrapper } from "../generalComponent/SectionWrapper";
import GreenButton from "../GeneralButton";
import Image from "next/image";
import GreenStripImg from "../../../static/images/green-strip-logo.png";
import GeneralButton from "../GeneralButton";


export default function FirstSection() {
  return (
    <SectionWrapper customClass=" bg-white relative">
      {/* Background Elements */}
      <div className="">
        <div className="grid gap-12 items-center">
          <div className="animate-slide-up">
            <h1 className="text-4xl lg:text-7xl text-themeblue">
              Unlocking Business Value with Precision and Purpose
            </h1>
            <h2 className="text-3xl lg:text-5xl mb-6 text-themegreen">
              Empowering Decisions with Smart Valuation Tools
            </h2>
            <p className="text-lg  text-themedark mb-6">
              At Clybourne, we bridge technology and expertise to deliver transparent, data-driven business valuations. Whether you're scaling, seeking investment, or planning for a future sale, our platform equips you with actionable insights to drive confident decisions.
            </p>
            <div className="flex  flex-col sm:flex-row gap-4">
              <a href="#contact-form" scroll="false">
                <GeneralButton content={"Let’s Talk!"} className="bg-themegreen text-white" />
              </a>
              <a href="/how-it-works">
                <GreenButton content={"Get Started"} className={"bg-themeblue text-white"} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 top-[50%] translate-y-[50%] hidden lg:block">
        <Image src={GreenStripImg} width={"200"} height={250} alt="logo-strip" />
      </div>
    </SectionWrapper>
  );
}
