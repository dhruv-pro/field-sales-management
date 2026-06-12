export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Attendance {
  _id: string;
  user: string;
  attendanceDate: string;
  clockInTime?: string;
  clockOutTime?: string;
  workingHours: number;
  status: string;
  totalBreakMinutes?: number;
  breaks?: any[];
}
export interface TodayAttendance {
  attendance: Attendance;
  loginSeconds: number;
  totalBreakSeconds: number;
  currentBreakSeconds: number;
  isBreakRunning: boolean;
  status: string;
}

export interface AttendanceState {
  loading: boolean;
  today: TodayAttendance | null;
  error: string | null;
}
export interface AttendanceLocation {
  latitude: number;
  longitude: number;
  address: string;
}
