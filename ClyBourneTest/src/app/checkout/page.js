"use client";
import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import GeneralButton from "../component/GeneralButton";
import { useRouter } from "next/navigation";
import Axios from "../../utils/api";
import { formatDate, formatNumber } from "../../utils/utility";
import Swal from "sweetalert2";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutUI = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState({});
  const [planId, setPlanId] = useState(null);
  const [token, setToken] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // ✅ Fetch the selected plan details from backend
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`/api/plan/${planId}`);
      if (response.data.status) {
        setPlanData(response.data.data.plan);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Fetch Plan",
          text: "Please refresh and try again.",
        });
      }
    } catch (error) {
      console.error("Error fetching plan:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while fetching the plan.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ On component mount, get stored data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPlanId = localStorage.getItem("selectedPlan");
      const storedToken = localStorage.getItem("authToken");
      setPlanId(storedPlanId);
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (planId && token) fetchPlans();
  }, [planId, token]);

  // ✅ Handle going back
  const handleBack = () => {
    localStorage.removeItem("selectedPlan");
    router.push("/pricing");
  };

  // ✅ Show payment options popup
  const handleProceedToPayment = () => {
    if (!planId) {
      Swal.fire({
        icon: "warning",
        title: "No Plan Selected",
        text: "Please select a plan before proceeding.",
      });
      return;
    }

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in to continue.",
      });
      return;
    }

    setShowPaymentOptions(true);
  };

  // ✅ Close payment options popup
  const closePaymentOptions = () => {
    setShowPaymentOptions(false);
  };

  // ✅ Handle Stripe Payment
  const handleStripePayment = async () => {
    try {
      closePaymentOptions();

      Swal.fire({
        title: "Redirecting to Stripe...",
        text: "Please wait while we process your request.",
        didOpen: () => Swal.showLoading(),
      });

      // ✅ Create checkout session
      const requestBody = { planId, planType: "new", paymentGateway: "stripe" };
      const response = await Axios.post(
        `/api/stripe/create-checkout-session`,
        requestBody,
        { headers: { Authorization: token } }
      );

      Swal.close();

      // ✅ Extract the Stripe checkout URL
      const checkoutUrl = response?.data?.data?.url;
      if (!checkoutUrl) {
        console.log("Full response:", response.data);
        throw new Error("No checkout URL returned from backend");
      }

      // ✅ Redirect directly
      window.location.href = checkoutUrl;

    } catch (error) {
      console.error("❌ Stripe Payment Error:", error);
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
    
    Swal.fire({
      title: "Processing...",
      text: "Preparing Razorpay payment",
      didOpen: () => Swal.showLoading(),
    });

    // Create Razorpay order (same pattern as Stripe)
    const requestBody = { 
      planId, 
      planType: "new" 
    };
    
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
      description: `Payment for ${planData.name}`,
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
              planId: planId
            },
            { headers: { Authorization: token } }
          );

          Swal.close();
          
          if (verifyResponse.data.status) {
            Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              text: "Your plan has been activated successfully.",
            }).then(() => {
              localStorage.removeItem("selectedPlan");
              router.push("/dashboard/plan&billing");
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
        contact: orderData.user?.contact || "9999999999"
      },
      notes: {
        planId: planId
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

  // ✅ Initialize Razorpay payment
  const initializeRazorpay = (orderData) => {
    Swal.close();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: "Your Company Name",
      description: `Payment for ${planData.name}`,
      order_id: orderData.id,
      handler: async function (response) {
        // ✅ Verify payment on your backend
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
              planId: planId
            },
            { headers: { Authorization: token } }
          );

          Swal.close();

          if (verifyResponse.data.status) {
            Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              text: "Your plan has been activated successfully.",
            }).then(() => {
              // Redirect to dashboard or success page
              router.push("/dashboard/plan&billing");
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
        name: "Customer Name", // You might want to fetch this from user profile
        email: "customer@example.com", // You might want to fetch this from user profile
        contact: "9999999999"
      },
      notes: {
        planId: planId
      },
      theme: {
        color: "#16a085" // Match your theme color
      }
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  // ✅ Payment Options Popup Component
  const PaymentOptionsPopup = () => {
    return (
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
              Choose your preferred payment method to continue
            </p>

            <div className="space-y-4">
              {/* Stripe Option */}
              <button
                onClick={handleStripePayment}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-themeblue hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">S</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">Stripe</h4>
                    <p className="text-sm text-gray-600">Credit/Debit Cards, Apple Pay</p>
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
                    <span className="text-purple-600 font-bold">R</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">Razorpay</h4>
                    <p className="text-sm text-gray-600">UPI, Net Banking, Wallets</p>
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
    );
  };

  return (
    <section className="position-relative bg-white h-100 pt-[25px] pb-[15px]  px-4 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 order-1 order-lg-2 md-mb-50px">
            {loading ? (
              <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <CircularProgress size={50} style={{ color: "#16a085" }} />
              </div>
            ) : planData ? (
              <div className='mt-3 h-100 md:mt-0 text-black '>
                <div>
                  <p className="text-themeblue text-[22px] font-bold pb-3 ">Checkout</p>
                  <hr />
                </div>
                <fieldset className="  lg:w-[60%] m-auto border pt-3 pb-2 md:pb-5 mt-3 md:mt-5 lg:mt-10 px-2 md:px-5 rounded-md">
                  <legend className="m-auto">
                    <GeneralButton
                      content={"Plan Details"}
                      className="bg-themeblue  cursor-default text-[13px] sm:text-[16px] text-white"
                    />
                  </legend>
                  <div className="flex-1 py-3 ps-3 sm:ps-10 border-l-[8px] border-themeblue rounded-md   shadow-md">
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[40%]">Plan Name </p>
                      :<p className="ms-2">{planData.name || 'N/A'}</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[40%]">Plan Type</p>
                      :<p className="ms-2">{planData.planType || 'N/A'}</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[40%]">Reports	</p>
                      :<p className="ms-2">{planData.reports || 'N/A'}</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[40%]">Access Days</p>
                      :<p className="ms-2">{planData.accessDays || 'N/A'}</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[40%]">Price (USD)	</p>
                      :<p className="ms-2">{formatNumber(planData.price) || 'N/A'}</p>
                    </div>
                    <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
                      <p className="font-medium w-[40%]">Expiry Date	</p>
                      :<p className="ms-2">{formatDate(planData.expiresAt) || 'N/A'}</p>
                    </div>
                  </div>
                </fieldset>
                <div className='flex flex-col xs:flex-row justify-center py-5 gap-3'>
                  <button onClick={handleBack} className="bg-gray-400 sm:w-[214px] text-sm sm:text-md hover:bg-gray-500 text-white   px-8  lg:px-[52px] py-1 sm:py-2 lg:py-3  rounded-md">
                    Back
                  </button>
                  <button onClick={handleProceedToPayment} className="bg-themegreen  text-sm sm:text-md  hover:bg-teal-600 text-white   px-8  lg:px-[52px] py-1 sm:py-2 lg:py-3  rounded-md">
                    Proceed to Payment
                  </button>
                </div>
              </div>
            ) : (
              <>No Data</>
            )}
          </div>
        </div>
      </div>

      {/* Payment Options Popup */}
      {showPaymentOptions && <PaymentOptionsPopup />}
    </section>
  );
};

export default CheckoutUI;










// "use client";
// import React, { useState, useEffect } from "react";
// import CircularProgress from "@mui/material/CircularProgress";
// import GeneralButton from "../component/GeneralButton";
// import { useRouter } from "next/navigation";
// import Axios from "../../utils/api";
// import { formatDate, formatNumber } from "../../utils/utility";
// import Swal from "sweetalert2";
// import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// const CheckoutUI = () => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [planData, setPlanData] = useState({});
//   const [planId, setPlanId] = useState(null);
//   const [token, setToken] = useState(null);

//   // ✅ Fetch the selected plan details from backend
//   const fetchPlans = async () => {
//     try {
//       setLoading(true);
//       const response = await Axios.get(`/api/plan/${planId}`);
//       if (response.data.status) {
//         setPlanData(response.data.data.plan);
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Failed to Fetch Plan",
//           text: "Please refresh and try again.",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching plan:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Something went wrong while fetching the plan.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ On component mount, get stored data
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedPlanId = localStorage.getItem("selectedPlan");
//       const storedToken = localStorage.getItem("authToken");
//       setPlanId(storedPlanId);
//       setToken(storedToken);
//     }
//   }, []);

//   useEffect(() => {
//     if (planId && token) fetchPlans();
//   }, [planId, token]);

//   // ✅ Handle going back
//   const handleBack = () => {
//     localStorage.removeItem("selectedPlan");
//     router.push("/pricing");
//   };

//   // ✅ Handle payment (Stripe Checkout)
//   const handleBuyPlan = async () => {
//     try {
//       if (!planId) {
//         Swal.fire({
//           icon: "warning",
//           title: "No Plan Selected",
//           text: "Please select a plan before proceeding.",
//         });
//         return;
//       }

//       if (!token) {
//         Swal.fire({
//           icon: "warning",
//           title: "Login Required",
//           text: "Please log in to continue.",
//         });
//         return;
//       }

//       Swal.fire({
//         title: "Redirecting to Stripe...",
//         text: "Please wait while we process your request.",
//         didOpen: () => Swal.showLoading(),
//       });

//       // ✅ Create checkout session
//       const requestBody = { planId, planType: "new" };
//       const response = await Axios.post(
//         `/api/stripe/create-checkout-session`,
//         requestBody,
//         { headers: { Authorization: token } }
//       );

//       Swal.close();

//       // ✅ Extract the Stripe checkout URL
//       const checkoutUrl = response?.data?.data?.url;
//       if (!checkoutUrl) throw new Error("No checkout URL returned from backend");
//       if (!checkoutUrl) {
//         // Debug: log the response
//         console.log("Full response:", response.data);
//         throw new Error("No checkout URL returned from backend");
//       }

//       // ✅ Redirect directly
//       window.location.href = checkoutUrl;

//     } catch (error) {
//       console.error("❌ Payment Error:", error);
//       Swal.close();
//       Swal.fire({
//         icon: "error",
//         title: "Payment Failed",
//         text: error?.response?.data?.message || "Something went wrong. Please try again.",
//       });
//     }
//   };

//   return (

//     <section className="position-relative bg-white h-100 pt-[25px] pb-[15px]  px-4 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36">
//       <div className="container-fluid">
//         <div className="row">
//           <div
//             className="col-lg-12 order-1 order-lg-2 md-mb-50px"
//           // data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 1200, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'
//           >
//             {loading ? (
//               <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                 <CircularProgress size={50} style={{ color: "#16a085" }} />
//               </div>

//             ) : planData ? (

//               <div className='mt-3 h-100 md:mt-0 text-black '>
//                 <div>
//                   <p className="text-themeblue text-[22px] font-bold pb-3 ">Checkout</p>
//                   <hr />
//                 </div>
//                 <fieldset className="  lg:w-[60%] m-auto border pt-3 pb-2 md:pb-5 mt-3 md:mt-5 lg:mt-10 px-2 md:px-5 rounded-md">
//                   <legend className="m-auto">
//                     <GeneralButton
//                       content={"Plan Details"}
//                       className="bg-themeblue  cursor-default text-[13px] sm:text-[16px] text-white"
//                     />
//                   </legend>
//                   <div className="flex-1 py-3 ps-3 sm:ps-10 border-l-[8px] border-themeblue rounded-md   shadow-md">
//                     <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
//                       <p className="font-medium w-[40%]">Plan Name </p>
//                       :<p className="ms-2">{planData.name || 'N/A'}</p>
//                     </div>
//                     <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
//                       <p className="font-medium w-[40%]">Plan Type</p>
//                       :<p className="ms-2">{planData.planType || 'N/A'}</p>
//                     </div>
//                     <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
//                       <p className="font-medium w-[40%]">Reports	</p>
//                       :<p className="ms-2">{planData.reports || 'N/A'}</p>
//                     </div>
//                     <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
//                       <p className="font-medium w-[40%]">Access Days</p>
//                       :<p className="ms-2">{planData.accessDays || 'N/A'}</p>
//                     </div>
//                     <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
//                       <p className="font-medium w-[40%]">Price (USD)	</p>
//                       :<p className="ms-2">{formatNumber(planData.price) || 'N/A'}</p>
//                     </div>
//                     <div className='flex text-[10px] sm:text-[12px] md:mb-2 lg:gap-3 xl:gap-5'>
//                       <p className="font-medium w-[40%]">Expiry Date	</p>
//                       :<p className="ms-2">{formatDate(planData.expiresAt) || 'N/A'}</p>
//                     </div>
//                   </div>
//                 </fieldset>
//                 <div className='flex flex-col xs:flex-row justify-center py-5 gap-3'>
//                   <button onClick={handleBack} className="bg-gray-400 sm:w-[214px] text-sm sm:text-md hover:bg-gray-500 text-white   px-8  lg:px-[52px] py-1 sm:py-2 lg:py-3  rounded-md">
//                     Back
//                   </button>
//                   <button onClick={handleBuyPlan} className="bg-themegreen  text-sm sm:text-md  hover:bg-teal-600 text-white   px-8  lg:px-[52px] py-1 sm:py-2 lg:py-3  rounded-md">
//                     Proceed to Payment
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>No Data</>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CheckoutUI;
