import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../utils/api";

// ---- Async Thunk ----
export const fetchPlanData = createAsyncThunk(
  "plan/fetchPlanData",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await Axios.get("/api/plan/customer_plans", {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.data.status) {
        return rejectWithValue(response.data.message);
      }

      return response.data.data; // current_plan, old_plans
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ---- Slice ----
const planSlice = createSlice({
  name: "plan",
  initialState: {
    loading: false,
    currentPlan: null,
    historyPlans: [],
    planFeatures: [],
    error: null,
  },

  reducers: {
    clearPlanState: (state) => {
      state.currentPlan = null;
      state.historyPlans = [];
      state.planFeatures = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchPlanData.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload.current_plan;
        state.historyPlans = action.payload.old_plans;

        // Convert HTML description → array
        if (
          action.payload.current_plan?.planId?.userplandescription
        ) {
          const html = action.payload.current_plan.planId.userplandescription;

          state.planFeatures = html
            .replace(/<\/?ul[^>]*>/g, "")
            .split(/<\/li>\s*<li[^>]*>/g)
            .map((item) => item.replace(/<\/?li[^>]*>/g, "").trim())
            .filter(Boolean);
        }
      })

      .addCase(fetchPlanData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearPlanState } = planSlice.actions;
export default planSlice.reducer;
