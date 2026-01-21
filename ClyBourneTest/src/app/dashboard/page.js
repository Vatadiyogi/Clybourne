"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { verifyUserToken } from "../../utils/verifyUserToken";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const valid = await verifyUserToken();
      if (!valid) {
        router.push("/auth/login");
      } else {
        setLoading(false);
          router.push("/dashboard/plan&billing");
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-full justify-center items-center">
        <CircularProgress size={40} style={{ color: "#16a085" }} />
      </div>
    );
  }

}
