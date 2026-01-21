"use client";
import React, { useState, useEffect } from "react";
import logo from "../../../static/images/logo.png";
import { SectionWrapper } from "../../component/generalComponent/SectionWrapper";
import Axios from "../../../utils/api";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { HiXMark } from "react-icons/hi2";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [country, setCountry] = useState("");
  const [dob, setDob] = useState("");
  const [isOpen, setIsOpen] = useState(false); // modal state
  const [isResetLoginFormOpen, setResetLoginFormOpen] = useState(false);
  const [securityCode, setSecurityCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updateProfileIsActive, setUpdateProfileIsActive] = useState(false);
  const [updatedProfileSuccess, setUpdatedProfileSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("authToken"); // or from context/state

      if (!token) {
        toast.error("Please log in first!");
        return;
      }

      const response = await Axios.get("/api/front/customer/profile", {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.status) {
        const { user, countries } = response.data.data;
        // ✅ Set fetched data into your states
        setEmail(user.email || "");
        setMobileNumber(user.phone || "");
        setFirstName(user.first_name || "");
        setLastName(user.last_name || "");
        setCompany(user.company || "");
        setJobTitle(user.jobTitle || "");
        setCountry(user.country || "");
        setDob(user.dob || "");
        setCountry(user.country || "");
        // toast.success("Profile data fetched successfully!");
        console.log("User:", user);
        // console.log("Countries:", countries);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch profile");
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);
  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in first!");
        return;
      }

      const body = {
        first_name: firstName,
        last_name: lastName,
        email,
        jobTitle,
        country,
        phone: mobileNumber,
        company,
      };

      const response = await Axios.put("/api/front/customer/update_profile", body, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.status) {
        // toast.success("Profile updated successfully!");
        setUpdatedProfileSuccess(true);
        setUpdateProfileIsActive(false); // turn off edit mode
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile!");
    }
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in again!");
        return;
      }

      // Optional: change button text
      // toast.info("Sending OTP... Please wait");
      setLoading(true);
      const response = await Axios.post(
        "/api/front/customer/change_password_otp",
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.status === true) {
        toast.success("OTP sent successfully!");
        // Wait a moment for toast visibility, then redirect or open modal
        setTimeout(() => {
          setIsOpen(false);
          setResetLoginFormOpen(true); // ✅ Open OTP verification form
          // or redirect using router.push("/verify-otp");
          // router.push("/verify-otp");
        }, 1000);
      } else if (response.data.status === "alert") {
        toast.info(response.data.message);
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error!");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    try {
      const token = localStorage.getItem("authToken"); // same token used for profile
      if (!token) {
        toast.error("Please log in first!");
        return;
      }

      // ✅ Simple validation before sending
      if (!securityCode || !password || !confirmPassword) {
        toast.error("Please fill all fields!");
        return;
      }

      setLoading(true);
      console.log("Sending token:", localStorage.getItem("authToken"));

      const response = await Axios.put(
        "/api/front/customer/change_password",
        {
          otp: securityCode, // your OTP input field
          oldPassword: password,
          newPassword: confirmPassword,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.status) {
        toast.success(response.data.message || "Password updated successfully!");
        // optionally clear fields
        setSecurityCode("");
        setPassword("");
        setConfirmPassword("");
        setResetLoginFormOpen(false); // close modal if you’re using one
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-2 md:p-4 lg:p-8">

      <div
        className="flex gap-[10px] "
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="  text-black  shadow-lg p-2  md:p-4 lg:p-6 rounded-lg"
          style={{ width: "100%" }}
        >
          <h2 className="2xl:4xl xl:text-3xl mb-3 md:mb-6 lg:mb-10 text-themegreen text-center font-sans lg:text-2xl text-xl font-medium">
            {updateProfileIsActive ? "Update My Profile" : " My Profile"}
          </h2>
          <form onSubmit={handleSubmit} className=" flex flex-col gap-6">
            <div className="flex justify-center sm:flex-row flex-col gap-4 w-100">
              <fieldset className="w-[-webkit-fill-available] w-50 border px-4 border-gray-200 bg-white  rounded">
                <legend className="text-xs text-gray-400">
                  Email Address
                </legend>
                <input
                  type="email"
                  readOnly={!updateProfileIsActive}
                  placeholder="Your E-mail Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input rounded-lg px-0 py-2 border-none bg-transparent] outline-none w-full text-xs"
                />
              </fieldset>
              <fieldset className="w-[-webkit-fill-available] w-50 border px-4 border-gray-200 bg-white  rounded">
                <legend className="text-xs text-gray-400">
                  Mobile Number
                </legend>
                <input
                  readOnly={!updateProfileIsActive}
                  type="number"
                  placeholder="Your Mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="form-input rounded-lg px-0 py-2 border-none bg-transparent] outline-none w-full text-xs"
                />
              </fieldset>
            </div>
            <div className="flex justify-center sm:flex-row flex-col gap-4 w-100">
              <fieldset className="w-[-webkit-fill-available] w-50 border px-4 border-gray-200 bg-white  rounded">
                <legend className="text-xs text-gray-400">First Name</legend>
                <input
                  readOnly={!updateProfileIsActive}
                  type="text"
                  placeholder="Your First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="form-input rounded-lg px-0 py-2 border-none bg-transparent] outline-none w-full text-xs"
                />
              </fieldset>
              <fieldset className="w-[-webkit-fill-available] w-50 border px-4 border-gray-200 bg-white  rounded">
                <legend className="text-xs text-gray-400">Last Name</legend>
                <input
                  readOnly={!updateProfileIsActive}
                  type="text"
                  placeholder="Your Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="form-input rounded-lg px-0 py-2 border-none bg-transparent] outline-none w-full text-xs"
                />
              </fieldset>
            </div>
            <div className="flex justify-center sm:flex-row flex-col gap-4 w-100">
              <fieldset className="w-[-webkit-fill-available] w-50 border px-4 border-gray-200 bg-white  rounded">
                <legend className="text-xs text-gray-400">Company</legend>
                <input
                  readOnly={!updateProfileIsActive}
                  type="text"
                  placeholder="Your Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="form-input rounded-lg px-0 py-2 border-none bg-transparent] outline-none w-full text-xs"
                />
              </fieldset>
              <fieldset className="w-[-webkit-fill-available] w-50 border px-4 border-gray-200 bg-white  rounded">
                <legend className="text-xs text-gray-400">Job Title</legend>
                <input
                  readOnly={!updateProfileIsActive}
                  type="text"
                  placeholder="Your Job title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="form-input rounded-lg px-0 py-2 border-none bg-transparent] outline-none w-full text-xs"
                />
              </fieldset>
            </div>
            <div className="flex justify-center sm:flex-row flex-col gap-4 w-100">
              <fieldset className="w-[-webkit-fill-available] w-50 border px-4 border-gray-200 bg-white  rounded">
                <legend className="text-xs text-gray-400">Country</legend>
                <input
                  readOnly={!updateProfileIsActive}
                  type="text"
                  placeholder="Your country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="form-input rounded-lg px-0 py-2 border-none bg-transparent] outline-none w-full text-xs"
                />
              </fieldset>
              <fieldset className="w-[-webkit-fill-available] w-50 border px-4 border-gray-200 bg-white  rounded">
                <legend className="text-xs text-gray-400">DOB</legend>
                <input
                  readOnly={!updateProfileIsActive}
                  type="number"
                  placeholder="Your DOB "
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="form-input rounded-lg px-0 py-2 border-none bg-transparent] outline-none w-full text-xs"
                />
              </fieldset>
            </div>
            <div
              className={`${updateProfileIsActive
                ? "flex justify-end md:flex-row flex-col gap-4 w-full"
                : "flex justify-center md:flex-row flex-col gap-4 w-full"
                }`}
            >
              {updateProfileIsActive ? (
                <>
                  <button
                    onClick={handleUpdateProfile}
                    // onClick={() => setUpdatedProfileSuccess(true)}
                    type="submit"
                    className="bg-themegreen w-[100%] md:w-[35%]  px-8 py-2 text-white rounded"

                  >
                    Update Profile
                  </button>
                  <button
                    onClick={() => setIsOpen(true)}
                    type="button"
                    className="bg-transparent flex w-100 w-[100%] md:w-[35%] justify-end items-center border-0  text-themegreen "

                  >
                    Reset Login Password
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setUpdateProfileIsActive(true)}
                    type="button"
                    className="bg-gray-400 w-[100%] md:w-[35%]  px-3 lg:px-8 py-2 text-white rounded"

                  >
                    Update Profile
                  </button>
                  <button
                    onClick={() => setIsOpen(true)}
                    type="button"
                    className="bg-gray-400  w-[100%] md:w-[35%]  px-3 lg:px-8 py-2 text-white rounded"

                  >
                    Reset Login Password
                  </button>
                </>
              )}
            </div>
          </form>
          {/* MODAL BACKDROP */}
          {isOpen && (
            <div
              className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
              onClick={() => setIsOpen(false)} // close on backdrop click
            >
              {/* MODAL BOX */}
              <div
                className="bg-white px-4 py-4 xl:py-6 rounded shadow-lg w-[90%] max-w-md"
                onClick={(e) => e.stopPropagation()} // stop click inside modal
              >
                <span
                  onClick={() => setIsOpen(false)}
                  className="flex justify-end "
                >
                  <HiXMark className="text-[25px] text-gray-500 fw- " />
                </span>
                <div className="p-3 lg:p-3 xl:p-10">
                  <h2 className="2xl:4xl xl:text-3xl mb-6 text-themegreen text-center font-sans lg:text-2xl text-xl ">
                    Reset Login Password
                  </h2>
                  <p className="text-gray-500 text-sm text-center mb-16">
                    You will receive a security code at your registered email
                    address. Please check your inbox and follow the
                    instructions to reset your password
                  </p>
                  <button
                    onClick={() => { handleSendOtp() }}
                    disabled={loading}
                    type="submit"
                    className="bg-themegreen m-auto flex px-[60px] py-2 text-white rounded"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {isResetLoginFormOpen && (
            <div
              className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
              onClick={() => setResetLoginFormOpen(false)} // close on backdrop click
            >
              {/* MODAL BOX */}
              <div
                className="bg-white px-4 py-4 lg:py-6 rounded shadow-lg w-[90%] max-w-md"
                onClick={(e) => e.stopPropagation()} // stop click inside modal
              >
                <span
                  onClick={() => setResetLoginFormOpen(false)}
                  className="flex justify-end "
                >
                  <HiXMark className="text-[25px] text-gray-500 fw- " />
                </span>
                <form className="px-3 xl:px-10 flex flex-col gap-5">
                  <h2 className="2xl:4xl xl:text-3xl text-themegreen text-center font-sans lg:text-2xl text-xl ">
                    Reset Login Password
                  </h2>
                  <p className="text-gray-500 text-sm text-center mb-1">
                    Kindly input the security code that was sent to your
                    email.
                  </p>

                  <fieldset className="border px-4 border-gray-200 bg-white  rounded">
                    <legend className="text-xs text-gray-600">
                      Security Code
                    </legend>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="Enter security code"
                      value={securityCode}
                      onChange={(e) => setSecurityCode(e.target.value)}
                      className="form-input rounded-lg  py-2 border-none outline-none w-full text-xs"
                    />
                  </fieldset>
                  <fieldset className="border px-4 border-gray-200 bg-white  rounded">
                    <legend className="text-xs text-gray-600">
                      Enter Old Password{" "}
                    </legend>
                    {/* <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200"> */}
                    <div className="flex items-center bg-[#ffffff] ">
                      {" "}
                      <input
                        type={showPassword ? "text" : "password"}
                        // type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input rounded-lg  py-2 border-none outline-none w-full text-xs"
                      />
                      <div
                        onClick={() => setShowPassword((preve) => !preve)}
                        className="cursor-pointer"
                      >
                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                      </div>
                    </div>
                  </fieldset>
                  <fieldset className="border px-4 border-gray-200 bg-white  rounded">
                    <legend className="text-xs text-gray-600">
                      Enter New Password{" "}
                    </legend>
                    {/* <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200"> */}
                    <div className="flex items-center bg-[#ffffff] ">
                      {" "}
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        // type="password"
                        placeholder="Confirtm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-input rounded-lg  py-2 border-none outline-none w-full text-xs"
                      />
                      <div
                        onClick={() =>
                          setShowConfirmPassword((preve) => !preve)
                        }
                        className="cursor-pointer "
                      >
                        {showConfirmPassword ? (
                          <FaRegEye />
                        ) : (
                          <FaRegEyeSlash />
                        )}
                      </div>
                    </div>
                  </fieldset>

                  <button
                    type="button"
                    onClick={changePassword}
                    className="bg-themegreen m-auto flex px-[15px] mt-2 py-2 text-white rounded"
                  >
                    Reset Password
                  </button>
                </form>
              </div>
            </div>
          )}
          {updatedProfileSuccess && (
            <div
              className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
              onClick={() => setUpdatedProfileSuccess(false)} // close on backdrop click
            >
              {/* MODAL BOX */}
              <div
                className="bg-white px-4  py-4 xl:py-6 rounded shadow-lg w-[90%] max-w-md"
                onClick={(e) => e.stopPropagation()} // stop click inside modal
              >
                <span
                  onClick={() => setUpdatedProfileSuccess(false)}
                  className="flex justify-end "
                >
                  <HiXMark className="text-[25px] text-gray-500 fw- " />
                </span>
                <div className="p-3 lg:p-3 xl:p-10">
                  <h2 className="2xl:4xl xl:text-3xl mb-6 text-themegreen text-center font-sans lg:text-2xl text-xl ">
                    Profile Updated Successfully!
                  </h2>
                  <p className="text-gray-500 text-sm text-center mb-2">
                    Your changes have been saved
                  </p>
                  <p className="text-gray-500 text-sm m-auto text-center max-w-[280px] mb-10">
                    Thank you for keeping your information up to date
                  </p>
                  <button
                    onClick={() => setUpdatedProfileSuccess(false)}
                    type="submit"
                    className="bg-themegreen m-auto flex px-[40px] py-2 text-white rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Profile;
