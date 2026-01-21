"use client";
import React, { useState } from "react";
import logo from "../../static/images/logo.png";
import { SectionWrapper } from "../component/generalComponent/SectionWrapper";
import Link from "next/link";
import Image from "next/image";

const Payment = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [country, setCountry] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="">
      <SectionWrapper customClass="bg-themegreen text-white">
        <div
          className="flex flex-col md:flex-row lg:gap-[10px] "
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* LEFT */}
          <div className="max-w-[480px]">
            <Image
              src={logo}
              alt="logo"
              className="h-10 w-auto md:h-6 mb-3 lg:h-8 xl:h-10"
              priority
            />
            <h2 className="text-3xl md:text-5xl lg:text-6xl  text-white">
              Access Your Valuation Tools and Insights Anytime, Anywhere
            </h2>
            <p className="text-base text-white mb-4 mt-3">
              Promotes ease of use and accessibility for users.
            </p>
          </div>

          {/* RIGHT */}
          <div className="bg-white md:max-w-[400px] text-black lg:py-12 md:py-4 px-3 py-4 md:px-3 lg:px-6 rounded-lg  w-full">
            <p className="fw-medium text-themegreen mb-5">Back</p>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className=" flex justify-center gap-4 w-100">
                <fieldset className="w-[-webkit-fill-available] w-50 border px-4 border-gray-200  rounded">
                  <legend className="text-xs text-gray-700">First Name</legend>
                  <input
                    type="text"
                    placeholder="Your First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-input rounded-lg px-0 py-2 border-none bg-transparent] outline-none w-full text-xs"
                  />
                </fieldset>
                <fieldset className="w-[-webkit-fill-available] w-50 border px-4 border-gray-200  rounded">
                  <legend className="text-xs text-gray-700">Last Name</legend>
                  <input
                    type="text"
                    placeholder="Your Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-input rounded-lg px-0 py-2 border-none bg-transparent] outline-none w-full text-xs"
                  />
                </fieldset>
              </div>
              <fieldset className="border px-4 border-gray-200  rounded">
                <legend className="text-xs text-gray-600">Email Address</legend>
                <input
                  type="email"
                  placeholder="E-mail Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input rounded-lg px-0 py-2 border-none bg-transparent] outline-none w-full text-xs"
                />
              </fieldset>
              <fieldset className="w-[-webkit-fill-available] w-50 border px-4 border-gray-200  rounded">
                <legend className="text-xs text-gray-600">Job Title</legend>
                <input
                  type="text"
                  placeholder="Your Job title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="form-input rounded-lg px-0 py-2 border-none bg-transparent] outline-none w-full text-xs"
                />
              </fieldset>
              <fieldset className="w-[-webkit-fill-available] w-50 border px-4 border-gray-200 rounded">
                <legend className="text-xs text-gray-600">Country</legend>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="form-input rounded-lg px-0 py-2 border-none bg-transparent outline-none w-full text-xs"
                >
                  
                  <option value="">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="China">China</option>
                  <option value="Brazil">Brazil</option>
                </select>
              </fieldset>

              <button
                type="submit"
                onClick={() => {
                  setIsRegistered(true);
                }}
                className="bg-themegreen px-8 py-2 mt-2 md:mt-6 text-white rounded"
              >
                Continue for Payment
              </button>
            </form>

            <p className="text-xs text-gray-600 text-center  py-4">
              Already Have an Account?{" "}
              <Link href="/auth/login" className="text-themegreen text-xs">
                Login
              </Link>{" "}
            </p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Payment;
