"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
export default function VerifyUser() {
  const router = useRouter();
  const { token } = useParams(); // get token from URL
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token) {
        setStatus("⚠️ Invalid or missing verification token.");
        setTimeout(() => router.push("/auth/login"), 2000);
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/front/customer/verify_account_token/${token}`
        );

    if (res.data?.status === 200) {
  // ✅ Verified successfully
  localStorage.setItem("authToken", res.data.data.userdata.token);
  setStatus("✅ Account verified successfully! Redirecting...");
  setTimeout(() => router.push("/dashboard"), 1500);
} 
else if (res.data?.status === 1) {
  // ✅ Already verified
  localStorage.setItem("authToken", res.data.data.userdata.token);
  setStatus("✅ User already verified! Redirecting...");
   router.push("/dashboard");
} 
else {
  setStatus(`❌ Verification failed: ${res.data?.message || "Unknown error"}`);
  setTimeout(() => router.push("/auth/login"), 2000);
}

      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "⚠️ Server error, please try again later.";
        setStatus(errorMessage);
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    };

    verifyAccount();
  }, [token, router]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
         {status==="Verifying..."?<CircularProgress size={40} style={{ color: "#16a085" }} />:" "}
        <p className="text-themegreen text-[20px] ">{status}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
  },
  card: {
   
    textAlign: "center",
    maxWidth: "450px",
  },
  
};
