import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { AttendanceLocation } from "./attendanceTypes";

export const attendanceService = {
  checkIn: async (location: AttendanceLocation) => {
    const response = await api.post(API_ENDPOINTS.ATTENDANCE_CHECK_IN, {
      location,
    });

    return response.data;
  },

  checkOut: async (location: AttendanceLocation) => {
    const response = await api.post(API_ENDPOINTS.ATTENDANCE_CHECK_OUT, {
      location,
    });

    return response.data;
  },

  getMyAttendance: async () => {
    const response = await api.get(API_ENDPOINTS.MY_ATTENDANCE);

    return response.data;
  },
  getTodayAttendance: async () => {
    const response = await api.get(API_ENDPOINTS.TODAY_ATTENDANCE);

    return response.data;
  },
  startBreak: async () => {
    const res = await api.post(API_ENDPOINTS.START_BREAK);
    return res.data;
  },

  endBreak: async () => {
    const res = await api.post(API_ENDPOINTS.END_BREAK);
    return res.data;
  },
};
