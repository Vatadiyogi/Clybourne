"use client";
import React, { useState, useMemo } from "react";
import { components } from "react-select";
import logo from "../../../static/images/signup.svg";
const Select = dynamic(() => import("react-select"), { ssr: false });
import countryList from "react-select-country-list";
import { SectionWrapper } from "../../component/generalComponent/SectionWrapper";
import Link from "next/link";
import Image from "next/image";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { IoMdArrowDropdown } from "react-icons/io";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <IoMdArrowDropdown size={18} color="#1aa79c" />
    </components.DropdownIndicator>
  );
};

const SignUp = () => {
  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "4px",
      borderColor: "#e5e7eb",
      boxShadow: "none",
      "&:hover": { borderColor: "#1aa79c" },
      minHeight: "38px",
      padding: "7px 6px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "4px",
    }),
  };

  const options = useMemo(() => countryList().getData(), []);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [sendMail, setSendMail] = useState(false);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .trim()
      .required("First name is required")
      .matches(/^[A-Za-z\s]+$/, "First name should only contain alphabets")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters"),

    last_name: Yup.string()
      .trim()
      .required("Last name is required")
      .matches(/^[A-Za-z\s]+$/, "Last name should only contain alphabets")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters"),

    company: Yup.string()
      .trim()
      .required("Company name is required")
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must be less than 100 characters"),

    jobTitle: Yup.string()
      .trim()
      .required("Job title is required")
      .min(2, "Job title must be at least 2 characters")
      .max(100, "Job title must be less than 100 characters"),

    country: Yup.string()
      .required("Country is required"),

    email: Yup.string()
      .trim()
      .required("Email is required")
      .email("Please enter a valid email address")
      .max(100, "Email must be less than 100 characters"),

    password: Yup.string()
      .trim()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),

    new_password: Yup.string()
      .trim()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const initialValues = {
    email: "",
    password: "",
    new_password: "",
    first_name: "",
    last_name: "",
    company: "",
    jobTitle: "",
    country: "",
  };

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Separate loading states
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // 🔸 Handle Resend Verification Link
  const handleResend = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning("⚠️ Please enter your email address.");
      return;
    }

    setIsResending(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/front/customer/resend_verification_link`,
        { email }
      );

      if (res.data?.status) {
        setSendMail(true);
        toast.success("Verification link sent! Please check your email.");
      } else {
        toast.error(`❌ ${res.data?.message || "Failed to resend link."}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "⚠️ Server error. Please try again later."
      );
    } finally {
      setIsResending(false);
    }
  };

  // 🔸 Handle SignUp
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsRegistering(true);
    toast.info("⏳ Registering your account...");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/front/customer/signup`,
        values
      );

      console.log("Signup API Response:", res.data);

      if (res.data.status) {
        setIsRegistered(true);
        setSendMail(true);
        toast.dismiss();
        toast.success(" Registration successful! Verification email sent.");
        resetForm();
      } else if (
        res.data.message ===
        "Registration Successful. Verification link sending failed, please try again later"
      ) {
        setIsRegistered(true);
        setSendMail(false);
        toast.dismiss();
        toast.warning("⚠️ Registered successfully, but email failed to send.");
      } else {
        toast.dismiss();
        toast.error(res.data.message || "❌ Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.dismiss();
      toast.error("⚠️ Server error. Please try again later.");
    } finally {
      setIsRegistering(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="">
      <SectionWrapper customClass="bg-themegreen text-white">
        <div
          className="flex flex-col md:flex-row lg:gap-[10px]"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* LEFT SIDE */}
          <div className="max-w-[480px]">
            <Image
              src={logo}
              alt="logo"
              className="h-10 w-auto md:h-6 mb-3 lg:h-8 xl:h-10"
              priority
            />
            <h2 className="text-3xl md:text-5xl lg:text-6xl text-white">
              Access Your Valuation Tools and Insights Anytime, Anywhere
            </h2>
            <p className="text-base text-white mb-4 mt-3">
              Promotes ease of use and accessibility for users.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white md:max-w-[400px] text-black lg:py-12 md:py-4 px-3 py-4 md:px-3 lg:px-6 rounded-lg w-full">
            <h2 className="2xl:4xl xl:text-3xl mb-10 text-themegreen text-center font-sans lg:text-2xl text-xl font-medium">
              Sign Up
            </h2>

            {isRegistered ? (
              sendMail ? (
                //  CASE 1: Registered + Mail sent successfully
                <div className="px-4">
                  <p className="text-gray-500 text-sm text-center mb-3">
                    Thank you for providing your details.
                  </p>
                  <p className="text-gray-500 text-sm text-center mb-3">
                    To finalize your registration, please click the verification link sent
                    to your email address <b>{
                      // Get email from form values if available
                      initialValues.email || "your email"
                    }</b>.
                  </p>
                  <p className="text-gray-500 text-sm text-center mb-10">
                    Once verified, you'll gain access to your personalized dashboard.
                  </p>
                </div>
              ) : (
                // ⚠️ CASE 2: Registered but mail sending failed
                <div className="px-4 text-center">
                  <p className="text-red-500 text-sm mb-3">
                    Registered successfully but email sending failed. Please resend the
                    verification email below.
                  </p>
                  <Formik
                    initialValues={{ resendEmail: "" }}
                    validationSchema={Yup.object({
                      resendEmail: Yup.string()
                        .trim()
                        .required("Email is required")
                        .email("Please enter a valid email address"),
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                      setIsResending(true);
                      try {
                        const res = await axios.post(
                          `${process.env.NEXT_PUBLIC_API_URL}/api/front/customer/resend_verification_link`,
                          { email: values.resendEmail }
                        );

                        if (res.data?.status) {
                          setSendMail(true);
                          toast.success("Verification link sent! Please check your email.");
                        } else {
                          toast.error(`❌ ${res.data?.message || "Failed to resend link."}`);
                        }
                      } catch (error) {
                        toast.error(
                          error.response?.data?.message || "⚠️ Server error. Please try again later."
                        );
                      } finally {
                        setIsResending(false);
                        setSubmitting(false);
                      }
                    }}
                  >
                    {({ values, isSubmitting: formikSubmitting }) => (
                      <Form style={styles.form}>
                        <div>
                          <Field
                            type="email"
                            name="resendEmail"
                            placeholder="Enter your email"
                            style={styles.input}
                            disabled={isResending}
                          />
                          <ErrorMessage
                            name="resendEmail"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                        <button
                          type="submit"
                          style={{
                            ...styles.button,
                            backgroundColor: (isResending || formikSubmitting) ? "#9ca3af" : "#1aa79c",
                            cursor: (isResending || formikSubmitting) ? "not-allowed" : "pointer",
                          }}
                          disabled={isResending || formikSubmitting}
                        >
                          {isResending ? "Sending..." : "Resend Verification"}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              )
            ) : (
              // 📝 CASE 3: New Registration with Formik
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, setFieldValue, isSubmitting, isValid, dirty }) => (
                  <Form className="grid gap-4">
                    {/* First Name */}
                    <div>
                      <fieldset className="border px-4 border-gray-200 rounded">
                        <legend className="text-xs text-gray-600">First Name</legend>
                        <Field
                          type="text"
                          name="first_name"
                          placeholder="Your first name"
                          className="form-input rounded-lg px-0 py-2 border-none outline-none w-full text-xs"
                          disabled={isRegistering}
                        />
                      </fieldset>
                      <ErrorMessage
                        name="first_name"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <fieldset className="border px-4 border-gray-200 rounded">
                        <legend className="text-xs text-gray-600">Last Name</legend>
                        <Field
                          type="text"
                          name="last_name"
                          placeholder="Your last name"
                          className="form-input rounded-lg px-0 py-2 border-none outline-none w-full text-xs"
                          disabled={isRegistering}
                        />
                      </fieldset>
                      <ErrorMessage
                        name="last_name"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <fieldset className="border px-4 border-gray-200 rounded">
                        <legend className="text-xs text-gray-600">Company</legend>
                        <Field
                          type="text"
                          name="company"
                          placeholder="Your company"
                          className="form-input rounded-lg px-0 py-2 border-none outline-none w-full text-xs"
                          disabled={isRegistering}
                        />
                      </fieldset>
                      <ErrorMessage
                        name="company"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Job Title */}
                    <div>
                      <fieldset className="border px-4 border-gray-200 rounded">
                        <legend className="text-xs text-gray-600">Job Title</legend>
                        <Field
                          type="text"
                          name="jobTitle"
                          placeholder="Your job title"
                          className="form-input rounded-lg px-0 py-2 border-none outline-none w-full text-xs"
                          disabled={isRegistering}
                        />
                      </fieldset>
                      <ErrorMessage
                        name="jobTitle"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <Select
                        components={{ DropdownIndicator }}
                        styles={selectStyles}
                        options={options}
                        value={options.find((c) => c.label === values.country) || null}
                        onChange={(selected) =>
                          setFieldValue("country", selected?.label || "")
                        }
                        onBlur={() => setFieldValue("country", values.country)}
                        placeholder="Select Country"
                        className="text-xs focus:border-themegreen focus:outline-none"
                      />
                      {errors.country && touched.country && (
                        <div className="text-red-500 text-xs mt-1">{errors.country}</div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <fieldset className="border px-4 border-gray-200 rounded">
                        <legend className="text-xs text-gray-600">Email Address</legend>
                        <Field
                          type="email"
                          name="email"
                          placeholder="E-mail Address"
                          className="form-input rounded-lg px-0 py-2 border-none outline-none w-full text-xs"
                          disabled={isRegistering}
                        />
                      </fieldset>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <fieldset className="border px-4 border-gray-200 rounded">
                        <legend className="text-xs text-gray-600">Password</legend>
                        <div className="flex items-center bg-[#ffffff]">
                          <Field
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            className="form-input rounded-lg py-2 border-none outline-none w-full text-xs"
                            disabled={isRegistering}
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

                    {/* Confirm Password */}
                    <div>
                      <fieldset className="border px-4 border-gray-200 rounded">
                        <legend className="text-xs text-gray-600">Confirm Password</legend>
                        <div className="flex items-center bg-[#ffffff]">
                          <Field
                            type={showConfirmPassword ? "text" : "password"}
                            name="new_password"
                            placeholder="Confirm Password"
                            className="form-input rounded-lg py-2 border-none outline-none w-full text-xs"
                            disabled={isRegistering}
                          />
                          <div
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="cursor-pointer"
                          >
                            {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                          </div>
                        </div>
                      </fieldset>
                      <ErrorMessage
                        name="new_password"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div className="text-gray-700 text-xs text-center">
                      A verification link will be sent to your email address.
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !isValid || !dirty}
                      className={`px-6 py-2 rounded-md font-medium text-white ${(isSubmitting || !isValid || !dirty)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-themegreen hover:bg-[#1aa79bf0]"
                        }`}
                    >
                      {isSubmitting ? "Registering..." : "Register"}
                    </button>
                  </Form>
                )}
              </Formik>
            )}

            <p className="text-xs text-gray-600 text-center py-4">
              Already Have an Account?{" "}
              <Link href="/auth/login" className="text-themegreen text-xs">
                Login
              </Link>
            </p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

const styles = {
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    color: "#000",
    padding: "10px 12px",
    fontSize: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    width: "100%",
  },
  button: {
    padding: "10px 12px",
    fontSize: "15px",
    backgroundColor: "#1aa79c",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    width: "100%",
  },
};

export default SignUp;