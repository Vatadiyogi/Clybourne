"use client";
import React, { useState } from "react";
import logo from "../../../static/images/logo.png";
import { SectionWrapper } from "../../component/generalComponent/SectionWrapper";
import Link from "next/link";
import Image from "next/image";
import { CiMail } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import Axios from "../../../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warning("⚠️ Please enter your registered email.");
      return;
    }

    setLoading(true);
    try {
      const res = await Axios.post("/api/front/customer/forgot_password", { email });

      if (res.data.status) {
        toast.success(" Password reset link sent to your email!");
        setLinkSent(true);
        setEmail("");
      } else {
        toast.error(res.data.message || "❌ Failed to send reset link. Try again later.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "⚠️ Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <SectionWrapper customClass="bg-themeblue text-white">
        <div
          className="flex flex-col md:flex-row lg:gap-[10px]"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* LEFT SIDE */}
          <div className="max-w-[450px]">
            <Image
              src={logo}
              alt="logo"
              className="h-10 w-auto md:h-6 mb-3 lg:h-8 xl:h-10"
              priority
            />
            <h2 className="text-3xl md:text-5xl lg:text-6xl text-themegreen">
              Experience Financial Confidence, Backed by Insight and Honesty
            </h2>
            <p className="text-base text-gray-300 mb-4">
              Conveys commitment, expertise, and trustworthy service.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white md:max-w-[400px] text-black lg:py-12 md:py-4 px-3 py-4 md:px-3 lg:px-6 rounded-lg w-full">
            <h2 className="2xl:4xl xl:text-3xl mb-4 text-themegreen text-center font-sans lg:text-2xl text-xl font-medium">
              Forgot Password?
            </h2>
            <p className="text-center text-xs text-gray-700 mb-3 md:mb-6 lg:mb-10">
              Please select an option to send a password reset link
            </p>

            <div className="flex gap-3 p-2 rounded-[10px] mb-3 border-2 border-themegreen justify-center items-center">
              <span className="bg-themegreen p-3 rounded-full">
                <CiMail className="text-[25px] fw-bold text-white" />
              </span>
              <div>
                <h3 className="text-sm text-gray-700">Reset via Email</h3>
                <p className="text-xs text-gray-700">
                  A reset link will be sent to your email ID
                </p>
              </div>
              <span className="bg-themegreen p-1 rounded-full">
                <FaCheck className="text-[15px] fw-bold text-white" />
              </span>
            </div>

            {linkSent ? (
              <div className="text-center text-sm text-gray-600 py-6">
                 Reset link sent successfully! <br />
                Please check your email inbox or spam folder.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4">
                <fieldset className="border px-4 border-gray-200 rounded">
                  <legend className="text-xs cursor-default text-gray-600">Email Address</legend>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input rounded-lg py-2 border-none outline-none w-full text-xs"
                  />
                </fieldset>

                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-themegreen px-8 py-2 text-white rounded transition-all duration-200 ${
                    loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
                  }`}
                >
                  {loading ? "Sending..." : "Send Request"}
                </button>

                <button
                  type="button"
                  className="border-2 text-gray-600 px-8 py-2 rounded"
                >
                  <Link href="/auth/login">Cancel</Link>
                </button>
              </form>
            )}

            <p className="text-xs text-gray-600 text-center py-4">
              New Here?{" "}
              <Link href="/auth/signup" className="text-themegreen text-xs">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ForgotPassword;
