// src/features/reports/reportTypes.ts

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Attendance {
  _id: string;
  employee: Employee;
  attendanceDate: string;
  checkInTime: string;
  checkOutTime?: string;
  workingHours: number;
}

export interface Visit {
  _id: string;
  employee: Employee;
  customer: {
    customerName: string;
  };
  purpose?: string;
  createdAt: string;
}

export interface Order {
  _id: string;
  employee: Employee;
  customer: {
    customerName: string;
  };
  totalAmount: number;
  createdAt: string;
}

export interface EmployeePerformance {
  _id: Employee;
  totalOrders: number;
  totalRevenue: number;
}
