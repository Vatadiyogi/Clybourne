import React from 'react'
import BuyNow from '../component/buy-now/BuyNow'
import GetStartedSection from '../component/Methodology/getStartedSection'
import Animatedline from '../component/Global-file/Animetedline'
import ContactForm from '../component/home-page/ContactForm'
const page = () => {
  return (
    <div>
      <BuyNow />
      {/* <Animatedline/>  */}
      <GetStartedSection />
      <div id="contact-form">
        <ContactForm />
      </div>
    </div>
  )
}

export default page