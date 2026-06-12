import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (
    params: { attendancePage?: number; attendanceLimit?: number } | undefined,
  ) => {
    const response = await api.get("/api/dashboard", {
      params,
    });
    return response.data.data;
  },
);

interface DashboardState {
  data: any;
  loading: boolean;
  error: string;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: "",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load dashboard";
      });
  },
});

export default dashboardSlice.reducer;
