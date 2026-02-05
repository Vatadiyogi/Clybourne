"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Axios from "../../../utils/api";
import logo from "../../../static/images/loginicon.svg";
import { SectionWrapper } from "../../component/generalComponent/SectionWrapper";
import Link from "next/link";
import { toast } from "react-toastify";
import Image from "next/image";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setToken } from "../../../redux/userSlice";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loginWithPassword, setLoginWithPassword] = useState(true);

  // 🔹 Loading states
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Validation Schema for Password Login
  const passwordLoginSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Email is required")
      .email("Please enter a valid email address")
      .max(100, "Email must be less than 100 characters"),
    password: Yup.string()
      .trim()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters"),
  });

  // Validation Schema for OTP Login
  const otpLoginSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Email is required")
      .email("Please enter a valid email address")
      .max(100, "Email must be less than 100 characters"),
    otp: Yup.string()
      .trim()
      .required("OTP is required")
      .matches(/^[0-9]{5}$/, "OTP must be exactly 5 digits")
      .max(5, "OTP must be exactly 5 digits"),
  });

  const initialValues = {
    email: "",
    password: "",
    otp: "",
  };

  // 🔸 Send OTP
  const sendOtp = async (email) => {
    if (!email) {
      toast.warn("⚠️ Please enter your email address first!");
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await Axios.post("/api/front/customer/send_otp", { email });
      if (res.data.status === true) {
        toast.success(" OTP has been sent to your email!");
      } else if (res.data.status === "alert") {
        toast.info(res.data.message);
      } else {
        toast.error(res.data.message || "❌ Failed to send OTP!");
      }
    } catch (err) {
      console.error("AXIOS ERROR:", err);
      toast.error(err.response?.data?.message || "❌ Something went wrong!");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 🔸 Login with Password
  const handlePasswordLogin = async (values, { setSubmitting }) => {
    setIsLoggingIn(true);
    try {
      const res = await Axios.post("/api/front/customer/login", {
        email: values.email,
        password: values.password,
      });
      if (res.data.status === true) {
        const token = res.data.data.token;
        console.log("🔹 Token Received:", token);
        if (token) {
          dispatch(setToken(token)); // ✅ Store token in Redux + localStorage automatically
          toast.success("Login is successful!");
          router.push("/dashboard/plan&billing");
        } else {
          toast.error("No token received from server!");
        }
      } else if (res.data.status === "alert") {
        toast.info(res.data.message);
      } else {
        toast.error(res.data.message || "❌ Login failed!");
      }
    } catch (err) {
      console.error("AXIOS ERROR:", err);
      toast.error(err.response?.data?.message || "❌ Login failed!");
    } finally {
      setIsLoggingIn(false);
      setSubmitting(false);
    }
  };

  // 🔸 Login with OTP
  const handleOtpLogin = async (values, { setSubmitting }) => {
    setIsLoggingIn(true);
    try {
      const res = await Axios.post("/api/front/customer/login_with_otp", {
        email: values.email,
        otp: values.otp,
      });
      console.log("🔹 Full Response:", res);
      console.log("🔹 Response Data:", res.data);

      if (res.data.status === true) {
        const token = res.data.data.userdata?.token || res.data.data?.token;
        console.log("🔹 Token Received:", token);

        if (token) {
          dispatch(setToken(token));
          toast.success("Login with OTP is successful!");
          router.push("/dashboard/plan&billing");
        } else {
          toast.error("No token received from server!");
        }
      } else if (res.data.status === "alert") {
        toast.info(res.data.message);
      } else {
        toast.error(res.data.message || "❌ Invalid OTP!");
      }
    } catch (err) {
      console.error("AXIOS ERROR:", err);
      toast.error(err.response?.data?.message || "❌ Login failed!");
    } finally {
      setIsLoggingIn(false);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <SectionWrapper customClass="bg-themeblue text-white">
        <div className="flex flex-col md:flex-row lg:gap-[10px] justify-between items-center">
          {/* LEFT */}
          <div className="max-w-[450px]">
            <Image
              src={logo}
              alt="logo"
              className="h-10 w-auto md:h-6 mb-3 lg:h-8 xl:h-10"
              priority
            />
            <h2 className="text-3xl md:text-5xl lg:text-6xl text-themegreen">
              Experien Financial Confidence, Backed by Insight and Honesty
            </h2>
            <p className="text-base text-gray-300 mb-4">
              Conveys commitment, expertise, and trustworthy service.
            </p>
          </div>

          {/* RIGHT */}
          <div className="bg-white md:max-w-[400px] text-black lg:py-12 md:py-4 px-3 py-4 md:px-3 lg:px-6 rounded-lg w-full">
            <h2 className="2xl:4xl xl:text-3xl mb-10 text-themegreen text-center font-sans lg:text-2xl text-xl font-medium">
              Login/Sign In
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={
                loginWithPassword ? passwordLoginSchema : otpLoginSchema
              }
              onSubmit={loginWithPassword ? handlePasswordLogin : handleOtpLogin}
            >
              {({ values, isSubmitting, isValid, dirty, setFieldValue }) => (
                <Form className="grid gap-4">
                  {/* Email Field */}
                  <div>
                    <fieldset className="border px-4 border-gray-200 rounded">
                      <legend className="text-xs text-gray-600">
                        Email Address
                      </legend>
                      <Field
                        name="email"
                        type="email"
                        placeholder="E-mail Address"
                        className="form-input rounded-lg py-2 border-none outline-none w-full text-xs"
                      />
                    </fieldset>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Password or OTP Field */}
                  {loginWithPassword ? (
                    <div>
                      <fieldset className="border px-4 border-gray-200 rounded">
                        <legend className="text-xs text-gray-600">
                          Password
                        </legend>
                        <div className="flex items-center bg-[#ffffff]">
                          <Field
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="form-input rounded-lg py-2 border-none outline-none w-full text-xs"
                          />
                          <div
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="cursor-pointer"
                          >
                            {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                          </div>
                        </div>
                      </fieldset>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  ) : (
                    <div>
                      <fieldset className="border px-4 border-gray-200 rounded">
                        <legend className="text-xs text-gray-600">OTP</legend>
                        <div className="flex items-center bg-[#f5f5f5]">
                          <Field
                            name="otp"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={5}
                            placeholder="Enter OTP"
                            className="form-input rounded-lg py-2 border-none outline-none w-full text-xs"
                          />
                        </div>
                      </fieldset>
                      <ErrorMessage
                        name="otp"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  )}

                  {/* Forgot Password / Send OTP */}
                  {loginWithPassword ? (
                    <Link href="/auth/forgotpassword">
                      <div className="text-themegreen text-xs flex justify-end">
                        Forgot My Password?
                      </div>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => sendOtp(values.email)}
                      disabled={isSendingOtp || !values.email}
                      className={`text-themegreen text-xs flex justify-end ${
                        (isSendingOtp || !values.email) &&
                        "opacity-60 cursor-not-allowed"
                      }`}
                    >
                      {isSendingOtp ? "Sending..." : "Send OTP"}
                    </button>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid || !dirty}
                    className={`bg-themegreen px-8 py-2 text-white rounded ${
                      (isSubmitting || !isValid || !dirty) &&
                      "opacity-60 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? "Signing In..." : "Sign In"}
                  </button>

                  {/* Toggle Login Method */}
                  <button
                    onClick={() => {
                      setLoginWithPassword((prev) => !prev);
                      setFieldValue("password", "");
                      setFieldValue("otp", "");
                    }}
                    type="button"
                    className="border-2 text-gray-600 px-8 py-2 rounded"
                  >
                    {loginWithPassword
                      ? "Login with OTP"
                      : "Login with Password"}
                  </button>
                </Form>
              )}
            </Formik>

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

export default Login;