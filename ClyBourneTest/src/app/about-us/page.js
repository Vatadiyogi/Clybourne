import FirstSection from "../component/about-us/FirstSection";
import GlobalReach from "../component/about-us/GlobalReach";
import HowWork from "../component/about-us/HowWorks";
import TrustedBy from "../component/about-us/TrustedBy";
import Visionaries from "../component/about-us/Visionaries";
import WhyChoose from "../component/about-us/WhyChoose";
import { Header } from "../component/Global-file/Header";
import PromiseClybourn from "../component/about-us/PromiseClybourn"
import Animatedline from "../component/Global-file/Animetedline";
import ContactForm from "../component/home-page/ContactForm";
export default function Page() {
  return (
    <div>
      <FirstSection />
      <WhyChoose />
      <GlobalReach />
      <PromiseClybourn />
      {/* <Visionaries /> */}
      <div className="bg-lightgrey">
        <Animatedline />
      </div>
      <HowWork />
      <TrustedBy />
      <div className="bg-white" >
        <Animatedline />
      </div>
      <div id="contact-form">
        <ContactForm />
      </div>
    </div>
  );
}
