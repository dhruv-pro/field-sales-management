// src/features/reports/reportSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reportService } from "./reportService";
import type {
  Attendance,
  Visit,
  Order,
  EmployeePerformance,
} from "./reportTypes";

interface ReportState {
  attendance: Attendance[];
  visits: Visit[];
  sales: Order[];
  performance: EmployeePerformance[];
  loading: boolean;
}

export const fetchVisitReport = createAsyncThunk("reports/visits", async () => {
  const res = await reportService.getVisitReport();
  return res.data.data; // ✅ MUST be array
});

export const fetchSalesReport = createAsyncThunk("reports/sales", async () => {
  const res = await reportService.getSalesReport();
  return res.data.data; // ✅
});

export const fetchAttendanceReport = createAsyncThunk(
  "reports/attendance",
  async () => {
    const res = await reportService.getAttendanceReport();
    return res.data.data; // ✅
  },
);

export const fetchEmployeePerformance = createAsyncThunk(
  "reports/performance",
  async () => {
    const res = await reportService.getEmployeePerformance();
    return res.data.data; // ✅
  },
);

const initialState: ReportState = {
  attendance: [],
  visits: [],
  sales: [],
  performance: [],
  loading: false,
};

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // attendance
      .addCase(fetchAttendanceReport.fulfilled, (state, action) => {
        state.attendance = action.payload;
      })

      // visits

      .addCase(fetchVisitReport.fulfilled, (state, action) => {
        console.log("VISITS PAYLOAD:", action.payload);
        state.visits = action.payload;
      })

      // sales
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.sales = action.payload;
      })

      // performance
      .addCase(fetchEmployeePerformance.fulfilled, (state, action) => {
        state.performance = action.payload;
      });
  },
});

export default reportSlice.reducer;
