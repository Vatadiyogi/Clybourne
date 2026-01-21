import React from 'react'
import ContactForm from "../component/home-page/ContactForm";
import BlueCard from '../component/blogs/BlueCard';
const page = () => {
  return (
    <div>
      <BlueCard/>
      <div id="contact-form">
        <ContactForm />
      </div>
    </div>
  )
}

export default page