import { SectionWrapper } from "../generalComponent/SectionWrapper";

export default function TrustedBy() {
  return (
    <SectionWrapper customClass="bg-white">
      <div className="">
        <div className="">
          <h2 className="text-4xl lg:text-7xl text-themeblue">
            Trusted by Industry Leaders
          </h2>
          <h2 className="text-3xl lg:text-5xl text-themegreen mb-6">
            Proven Results Across Businesses
          </h2>
          <p className="text-lg  text-themedark">
              At Clybourne, we bridge technology and expertise to deliver transparent, data-driven business valuations. Whether you're scaling, seeking investment, or planning for a future sale, our platform equips you with actionable insights to drive confident decisions.
            </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
