import React from 'react'
import ValuationMethodology from '../component/Methodology/valuation'
import GetStartedSection from "../component/Methodology/getStartedSection"
import Animatedline from "../component/Global-file/Animetedline";
import ContactForm from '../component/home-page/ContactForm';

const page = () => {
  return (
    <div>
      <ValuationMethodology/>
      <GetStartedSection/>
      <div id="contact-form">
        <ContactForm />
      </div>
    </div>
  )
}

export default page