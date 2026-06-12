import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AttendanceLocation, AttendanceState } from "./attendanceTypes";
import { attendanceService } from "./attendanceService";

const initialState: AttendanceState = {
  loading: false,
  today: null,
  error: null,
};

// GET TODAY
export const fetchTodayAttendance = createAsyncThunk(
  "attendance/today",
  async (_, { rejectWithValue }) => {
    try {
      const res = await attendanceService.getTodayAttendance();
      return res.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }

      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch attendance",
      );
    }
  },
);

// CHECK IN
export const checkIn = createAsyncThunk(
  "attendance/checkIn",
  async (location: AttendanceLocation, { rejectWithValue }) => {
    try {
      const res = await attendanceService.checkIn(location);

      if (!res.success) {
        return rejectWithValue(res.message);
      }

      return res.data; // <-- important
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || "Check-in failed",
      );
    }
  },
);
// CHECK OUT
export const checkOut = createAsyncThunk(
  "attendance/checkOut",
  async (location: AttendanceLocation, { rejectWithValue }) => {
    try {
      const res = await attendanceService.checkOut(location);

      if (!res.success) {
        return rejectWithValue(res.message);
      }

      return res.data; // <-- important
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || "Check-out failed",
      );
    }
  },
);
export const startBreak = createAsyncThunk(
  "attendance/startBreak",
  async (_, { rejectWithValue }) => {
    try {
      const res = await attendanceService.startBreak();

      if (!res.success) {
        return rejectWithValue(res.message);
      }

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Start break failed",
      );
    }
  },
);

export const endBreak = createAsyncThunk(
  "attendance/endBreak",
  async (_, { rejectWithValue }) => {
    try {
      const res = await attendanceService.endBreak();

      if (!res.success) {
        return rejectWithValue(res.message);
      }

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "End break failed",
      );
    }
  },
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchTodayAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodayAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.today = action.payload;
      })
      .addCase(fetchTodayAttendance.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch attendance";
      })
      .addCase(startBreak.fulfilled, (state, action) => {
        if (state.today) {
          state.today.attendance = action.payload;
          state.today.isBreakRunning = true;
          state.today.currentBreakSeconds = 0;
        }
      })
      .addCase(endBreak.fulfilled, (state, action) => {
        if (state.today) {
          state.today.attendance = action.payload;
          state.today.isBreakRunning = false;
          state.today.currentBreakSeconds = 0;
        }
      })
      // CHECK IN
      .addCase(checkIn.fulfilled, (state, action) => {
        state.today = {
          attendance: action.payload,
          loginSeconds: 0,
          totalBreakSeconds: 0,
          currentBreakSeconds: 0,
          isBreakRunning: false,
          status: action.payload.status,
        };
      })

      // CHECK OUT
      .addCase(checkOut.fulfilled, (state, action) => {
        if (state.today) {
          state.today.attendance = action.payload;
          state.today.isBreakRunning = false;
        }
      });
  },
});

export default attendanceSlice.reducer;
