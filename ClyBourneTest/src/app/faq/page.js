import React from 'react'
import FaqBanner from '../component/contact-us/FaqBanner'
import FaqSecond from '../component/contact-us/FaqSecond'
import ContactForm from '../component/home-page/ContactForm'
import Animatedline from '../component/Global-file/Animetedline'


const page = () => {
  return (
    <div>
       <FaqBanner/>
       <FaqSecond/>
      <div className='bg-white'>
        <Animatedline />
      </div>
      <div id="contact-form">
        <ContactForm />
      </div>
    </div>
  )
}

export default page