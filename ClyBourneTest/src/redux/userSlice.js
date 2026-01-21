"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../utils/api"
export const fetchUser = createAsyncThunk("user/FetchUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user;
      const authToken = token || localStorage.getItem("authToken");
      if (!authToken) {
        // If no token found, stop and return error
        return rejectWithValue("No token found. Please log in.");
      }
      const res = await Axios.get("/api/front/customer/profile", {
        headers: { Authorization: authToken },
      });
        return res.data?.data?.user;
    } catch (error) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
    }
  }
)

const initialState = {
  token: typeof window !== "undefined" ? localStorage.getItem("authToken") : null,
  isLoggedIn: typeof window !== "undefined" ? !!localStorage.getItem("authToken") : false,
  userData: null,      
  loading: false,      
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("authToken", action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.loading = true;   
      localStorage.removeItem("authToken",);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;       
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;       // API request success
        state.userData = action.payload;  // Save fetched user details
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;       // API request failed
        state.error = action.payload; // Save error message
      });
  }
});


export const { setToken, clearToken } = userSlice.actions;
export default userSlice.reducer;
