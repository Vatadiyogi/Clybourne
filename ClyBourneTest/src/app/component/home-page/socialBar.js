import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
export const SocialBar=()=>{
  return (
    <div className="flex flex-col items-center space-y-7 relative left-12 ">
      {/* Top Line */}
      <div className="w-0.5 h-25 bg-black " />

      {/* Icons */}
      <div className="text-gray-600 hover:text-pink-500 transition duration-300 cursor-pointer">
        <FaInstagram size={31}/>
      </div>
      <div className="text-gray-600 hover:text-black transition duration-300 cursor-pointer">
        <FaXTwitter size={31}/>
      </div>
      <div className="text-gray-600 hover:text-blue-600 transition duration-300 cursor-pointer">
       <FaLinkedin size={31} />
      </div>
      <div className="text-gray-600 hover:text-blue-700 transition duration-300 cursor-pointer">
        <FaFacebookF size={31}/>
      </div>

      {/* Bottom Line */}
      <div className="w-0.5 h-25 bg-black " />
    </div>
  )
}

