import axios from "axios";

export async function verifyUserToken() {
  const token = localStorage.getItem("authToken");
  console.log("🟦 Step 1: Retrieved token from localStorage:", token);

  if (!token) {
    console.warn("⚠️ No token found in localStorage.");
    return false;
  }

  try {
    console.log("🟨 Step 2: Sending token to backend for verification...");

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/front/customer/verify-token`,
      { headers: { Authorization: token } }
    );

    console.log("🟩 Step 3: Response received from backend:", res.data);

    if (res.data.message === "Valid Token.") {
      console.log("✅ Step 4: Token verified successfully!");
      return true;
    } else {
      console.warn("❌ Step 4: Token verification failed. Message:", res.data.message);
      return false;
    }
  } catch (error) {
    console.log("🔥 Error while verifying token:", error.response?.data || error.message);
    return false;
  }
}

//   export const handleLogout = (router) => {
//   // Clear all stored tokens or user data
//   localStorage.removeItem("authTokenOFlOGIN");
//   localStorage.removeItem("authToken");
//   localStorage.removeItem("userData"); // if you store user info

//   // Optionally, clear cookies or sessionStorage if used
//   sessionStorage.clear();

//   // Redirect to login page
//   router.push("/auth/login");
// };