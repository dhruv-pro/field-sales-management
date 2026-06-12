// src/features/reports/reportService.ts

import api from "../../api/axios";

const getData = async (url: string) => {
  const { data } = await api.get(url);
  return data;
};

export const reportService = {
  getAttendanceReport: () => getData("/api/reports/attendance"),

  getVisitReport: () => getData("/api/reports/visits"),

  getSalesReport: () => getData("/api/reports/sales"),

  getEmployeePerformance: () => getData("/api/reports/employee-performance"),
};
