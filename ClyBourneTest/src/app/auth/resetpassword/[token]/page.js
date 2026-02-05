"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { SectionWrapper } from "../../../component/generalComponent/SectionWrapper";
import Image from "next/image";
import logo from "../../../../static/images/loginicon.svg";
import { toast } from "react-toastify";
import Axios from "../../../../utils/api";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";

const ResetPassword = () => {
    const { token } = useParams();
    const router = useRouter();
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const verifyLink = async () => {
            try {
                const res = await Axios.get(`/api/front/customer/verify_resetforgotpass_token/${token}`);
                if (res.data.status) {
                    setVerified(true);
                } else {
                    toast.error(res.data.message);
                }
            } catch (error) {
                toast.error("Invalid or expired reset link.");
            } finally {
                setLoading(false);
            }
        };
        verifyLink();
    }, [token]);

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        setLoading(true);
        try {
            const res = await Axios.post("/api/front/customer/reset_password", {
                token,
                newPassword,
            });
            if (res.data.status) {
                toast.success(" Password reset successfully!");
                router.push("/auth/login");
            } else {
                toast.error(res.data.message || "Failed to reset password!");
            }
        } catch (err) {
            toast.error("⚠️ Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SectionWrapper customClass="bg-themegreen text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
                {/* LEFT */}
                <div className="max-w-[480px]">
                    <Image src={logo} alt="logo" className="h-10 w-auto md:h-6 mb-3 lg:h-8 xl:h-10"
                        priority />
                    <p className="text-4xl text-white">Create Your New Password</p>
                    <p className="text-base mt-3 text-white">
                        Securely reset your account password in just a few steps.
                    </p>
                </div>

                {/* RIGHT */}
                <div className="bg-white md:max-w-[400px] text-black py-6 px-4 rounded-lg w-full">
                    <p className="text-2xl text-themegreen text-center mb-6 font-medium">
                        Reset Password
                    </p>

                    {loading ? (
                        <p className="text-center text-gray-600">Verifying link...</p>
                    ) : verified ? (
                        <form onSubmit={handleReset} className="grid gap-4">
                            <fieldset className="border px-4 border-gray-200 rounded">
                                <legend className="text-xs text-gray-600">New Password</legend>
                                <div className="flex items-center">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
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

                            <fieldset className="border px-4 border-gray-200 rounded">
                                <legend className="text-xs text-gray-600">Confirm Password</legend>
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-input rounded-lg py-2 border-none outline-none w-full text-xs"
                                />
                            </fieldset>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-themegreen text-white rounded py-2 ${loading ? "opacity-60 cursor-not-allowed" : ""
                                    }`}
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    ) : (
                        <p className="text-center text-red-500">
                            ❌ Invalid or expired reset link.
                        </p>
                    )}
                </div>
            </div>
        </SectionWrapper>
    );
};

export default ResetPassword;
