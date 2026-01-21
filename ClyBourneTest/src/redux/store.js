// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import planReducer from "./planSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    plan: planReducer,
  },
});
