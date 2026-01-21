import React from 'react'
import GetStartedSection from "../component/Methodology/getStartedSection"
import Animatedline from "../component/Global-file/Animetedline";
import HeaderProduct from "../component/how-it-works/HeaderProduct"
import WhyChooseCal from "../component/how-it-works/WhyChooseCal"
import VerifiedMarket from "../component/how-it-works/VerifiedMarket"
import ContactForm from '../component/home-page/ContactForm';

const page = () => {
  return (
    <div>
      <HeaderProduct />
      <div className="bg-lightgrey">
              <Animatedline />
            </div>
      <WhyChooseCal/>
      <VerifiedMarket/>
      <div id="contact-form">
          <ContactForm />
        </div>
    </div>
  )
}

export default page