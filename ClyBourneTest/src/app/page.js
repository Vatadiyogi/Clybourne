// import Image from "next/image";
import ContactForm from "./component/home-page/ContactForm";
import Footer from "./component/Global-file/Footer";
import { Header } from "./component/Global-file/Header";
import { Hero } from "./component/home-page/hero";
import { HowItWorks } from "./component/home-page/howitworks";
import KnowledgeHubSection from "./component/home-page/Knowledge";
import KnowledgeHub from "./component/home-page/KnowledgeHub";
import OurStorySection from "./component/home-page/OurStory";
import { PricingSection } from "./component/home-page/pricingsection";
import TestimonialSlider from "./component/home-page/TestimonialSlider";
import { ValuationApproach } from "./component/home-page/valuing";
import { WhyClybourneSection } from "./component/home-page/WhyClybourneSection";
import Animatedline from "./component/Global-file/Animetedline";
import {seoContent} from "../static/constants/seo";
export const metadata = {
  title: seoContent.homePage.title,
  description: seoContent.homePage.description,
  keywords: seoContent.homePage.primaryKeyword.join(", "),
};

export default function Home() {
  console.log(seoContent)
  return (
    <>
      <div>
        <Hero />
        <HowItWorks />
        <ValuationApproach />
        <PricingSection />
        <div className="bg-lightgrey">
          <Animatedline />
        </div>
        <WhyClybourneSection />
        <div className="bg-lightgrey">
          <Animatedline />
        </div>
        <OurStorySection />
        <div className="bg-lightgrey">
          <Animatedline />
        </div>
        <KnowledgeHubSection />
        <div className="bg-lightgrey">
          <Animatedline />
        </div>
        <TestimonialSlider />
        <div className="bg-lightgrey">
          <Animatedline />
        </div>
        <KnowledgeHub />
        <div id="contact-form">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
