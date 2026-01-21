"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../component/sidebar";
import { verifyUserToken } from "../../utils/verifyUserToken";
import CircularProgress from "@mui/material/CircularProgress";

export default function DashboardLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      // First check if token exists in localStorage
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        console.log("No token found, redirecting to login");
        router.push("/auth/login");
        return;
      }

      try {
        // Verify token with backend
        const valid = await verifyUserToken();
        
        if (!valid) {
          console.log("Token invalid, redirecting to login");
          // Clear invalid token
          localStorage.removeItem("authToken");
          router.push("/auth/login");
        } else {
          setIsAuthenticated(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("authToken");
        router.push("/auth/login");
      }
    }
    
    checkAuth();
  }, [router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-gray-50">
        <div className="text-center">
          <CircularProgress size={50} style={{ color: "#16a085" }} />
          <p className="mt-4 text-gray-600">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // Render dashboard layout only when authenticated
  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      {/* Sidebar */}
      <div className="bg-gray-50">
        <div className="sticky bg-gray-50 mt-3 top-[80px]">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}