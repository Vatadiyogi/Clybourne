import React, { useState } from 'react';
import { formatDate, formatNumber } from "../../utils/utility";
import GeneralButton from "./GeneralButton";
import Swal from 'sweetalert2';
import Axios from "../../utils/api";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const BopCheckout = ({ currentPlan, data }) => {
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);

    const handlePaymentClick = () => {
        setShowPaymentOptions(true);
    };

    const closePaymentOptions = () => {
        setShowPaymentOptions(false);
    };

    // ✅ Handle Stripe Payment
    const handleStripePayment = async () => {
        try {
            closePaymentOptions();
            
            const token = localStorage.getItem("authToken");
            if (!token) {
                Swal.fire({
                    icon: "error",
                    title: "Not Logged In",
                    text: "Please login again to continue payment.",
                });
                return;
            }

            if (!data?.id) {
                Swal.fire({
                    icon: "error",
                    title: "No Plan Selected",
                    text: "Please select a plan to upgrade.",
                });
                return;
            }

            const requestBody = {
                planId: data.id,
                planType: "upgrade",
            };

            console.log("Stripe Request Body:", requestBody);

            Swal.fire({
                title: "Redirecting to Stripe...",
                text: "Please wait while we process your request.",
                didOpen: () => Swal.showLoading(),
            });

            const response = await Axios.post(
                "api/stripe/create-checkout-session",
                requestBody,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            Swal.close();

            const checkoutUrl = response?.data?.data?.url;
            if (!checkoutUrl) {
                throw new Error("No checkout URL returned from backend");
            }

            // Redirect to Stripe Checkout
            window.location.href = checkoutUrl;

        } catch (error) {
            console.error("Stripe Payment Error:", error);
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text: error?.response?.data?.message || "Something went wrong. Please try again.",
            });
        }
    };

    // ✅ Handle Razorpay Payment
    const handleRazorpayPayment = async () => {
        try {
            closePaymentOptions();
            
            const token = localStorage.getItem("authToken");
            if (!token) {
                Swal.fire({
                    icon: "error",
                    title: "Not Logged In",
                    text: "Please login again to continue payment.",
                });
                return;
            }

            if (!data?.id) {
                Swal.fire({
                    icon: "error",
                    title: "No Plan Selected",
                    text: "Please select a plan to upgrade.",
                });
                return;
            }

            const requestBody = {
                planId: data.id,
                planType: "upgrade",
            };

            console.log("Razorpay Request Body:", requestBody);

            Swal.fire({
                title: "Processing...",
                text: "Preparing Razorpay payment",
                didOpen: () => Swal.showLoading(),
            });

            // Create Razorpay order
            const response = await Axios.post(
                `/api/razorpay/create-order`,
                requestBody,
                { headers: { Authorization: token } }
            );

            const orderData = response?.data?.data;
            
            if (!orderData) {
                throw new Error("No order data returned from backend");
            }

            Swal.close();

            // Initialize Razorpay Checkout
            const options = {
                key: orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency || 'INR',
                name: "Your Company Name",
                description: `Payment for ${data.name || 'Business Owner Plus'} Upgrade`,
                order_id: orderData.orderId,
                handler: async function (response) {
                    // Verify payment
                    try {
                        Swal.fire({
                            title: "Verifying Payment...",
                            text: "Please wait while we verify your payment",
                            didOpen: () => Swal.showLoading(),
                        });

                        const verifyResponse = await Axios.post(
                            `/api/razorpay/verify-payment`,
                            {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                planId: data.id
                            },
                            { headers: { Authorization: token } }
                        );

                        Swal.close();
                        
                        if (verifyResponse.data.status) {
                            Swal.fire({
                                icon: "success",
                                title: "Payment Successful!",
                                text: "Your plan has been upgraded successfully.",
                            }).then(() => {
                                window.location.href = "/dashboard/plan&billing";
                            });
                        } else {
                            throw new Error(verifyResponse.data.message || "Payment verification failed");
                        }
                    } catch (error) {
                        Swal.close();
                        Swal.fire({
                            icon: "error",
                            title: "Payment Verification Failed",
                            text: error.message || "Something went wrong. Please contact support.",
                        });
                    }
                },
                prefill: {
                    name: orderData.user?.name || "Customer",
                    email: orderData.user?.email || "customer@example.com",
                    contact: orderData.user?.contact || "Na"
                },
                notes: {
                    planId: data.id,
                    planType: "upgrade"
                },
                theme: {
                    color: "#16a085"
                },
                modal: {
                    ondismiss: function() {
                        Swal.fire({
                            icon: "info",
                            title: "Payment Cancelled",
                            text: "You cancelled the payment process.",
                        });
                    }
                }
            };

            // Load Razorpay script
            if (!window.Razorpay) {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;
                script.onload = () => {
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                };
                script.onerror = () => {
                    Swal.close();
                    Swal.fire({
                        icon: "error",
                        title: "Payment Failed",
                        text: "Could not load payment gateway. Please try again.",
                    });
                };
                document.body.appendChild(script);
            } else {
                const rzp = new window.Razorpay(options);
                rzp.open();
            }

        } catch (error) {
            console.error("❌ Razorpay Error:", error);
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text: error?.response?.data?.message || "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <div>
            <div>
                <div className='pb-5'>
                    <h2 className='text-[26px] fw-medium font-sans'>Summary of this upgrade</h2>
                    <p className='text-gray-700 text-sm text-medium'>
                        Your Current Plan ID# {currentPlan?.planSeqId} will be upgraded from Business Owner Plan to <b>Business Owner Plus</b>
                    </p>
                </div>
                <fieldset className="lg:w-[60%] m-auto border pt-3 pb-2 md:pb-5 px-2 md:px-5 rounded-md">
                    <legend className="m-auto">
                        <GeneralButton
                            content={"Upgrade Plan Details"}
                            className="bg-themeblue cursor-default text-[13px] sm:text-[16px] text-white"
                        />
                    </legend>
                    <div className="flex-1 py-3 ps-3 sm:ps-10 border-l-[8px] border-themeblue rounded-md shadow-md">
                        <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                            <p className="font-medium min-w-[220px]">Additional Access Days from today</p>
                            :<p className="ms-2 w-full">{data.access_days || 'N/A'}</p>
                        </div>
                        <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                            <p className="font-medium min-w-[220px]">New Plan Expiry Date</p>
                            :<p className="ms-2 w-full">{formatDate(data.expiresAt) || 'N/A'}</p>
                        </div>
                        <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                            <p className="font-medium min-w-[220px]">Special Support</p>
                            :<p className="ms-2 w-full">Full Support to complete the input financial data entry</p>
                        </div>
                        <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                            <p className="font-medium min-w-[220px]">Total Amount to pay for upgrade</p>
                            :<p className="ms-2 w-full">USD {formatNumber(data.upgrade_price) || 'N/A'}</p>
                        </div>
                    </div>
                </fieldset>
                <div className='flex flex-col sm:flex-row justify-center py-5 gap-3'>
                    <button onClick={handlePaymentClick} className="bg-themegreen text-sm sm:text-md hover:bg-teal-600 text-white px-8 lg:px-[52px] py-1 sm:py-2 lg:py-3 rounded-md">
                        Continue To Payment
                    </button>
                </div>
            </div>

            {/* Payment Options Popup */}
            {showPaymentOptions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b px-6 py-4">
                            <h3 className="text-xl font-bold text-gray-800">Select Payment Method</h3>
                            <button
                                onClick={closePaymentOptions}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <p className="text-gray-600 mb-6">
                                Choose your preferred payment method to upgrade your plan
                            </p>

                            <div className="space-y-4">
                                {/* Stripe Option */}
                                <button
                                    onClick={handleStripePayment}
                                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.85-4.071c-1.792-.805-3.796-1.533-6.661-1.533-3.391 0-5.889 1.805-5.889 4.693 0 4.286 5.889 5.095 5.889 7.506 0 .982-.915 1.545-2.172 1.545-1.8 0-3.916-.859-5.525-1.756l-.859 4.138c1.667.859 4.079 1.756 6.661 1.756 3.242 0 6.128-1.658 6.128-4.852 0-4.638-5.889-5.389-5.889-7.506 0-.818.683-1.305 1.752-1.305.974 0 2.532.469 3.727.992l.801-3.866z"/>
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-semibold text-gray-800">Stripe</h4>
                                            <p className="text-sm text-gray-600">Credit/Debit Cards, Apple Pay, Google Pay</p>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {/* Razorpay Option */}
                                <button
                                    onClick={handleRazorpayPayment}
                                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L11.65 24h4.391l6.395-24zM14.26 10.098L3.389 17.166l-1.21 4.3 6.625-4.297L1.567 0h4.391l8.302 10.098z"/>
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-semibold text-gray-800">Razorpay</h4>
                                            <p className="text-sm text-gray-600">UPI, Credit/Debit Cards, Net Banking, Wallets</p>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Note */}
                            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-600">
                                    <strong>Note:</strong> Razorpay is recommended for users in India. 
                                    Stripe supports international payments.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t px-6 py-4">
                            <button
                                onClick={closePaymentOptions}
                                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BopCheckout;