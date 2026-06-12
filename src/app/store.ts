import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import usersReducer from "../features/users/usersSlice";
import customersReducer from "../features/customers/customersSlice";
import visitsReducer from "../features/visits/visitsSlice";
import ordersReducer from "../features/orders/ordersSlice";
import productsReducer from "../features/products/productsSlice";
import attendanceReducer from "../features/attendance/attendanceSlice";
import reportReducer from "../features/reports/reportSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    users: usersReducer,
    customers: customersReducer,
    visits: visitsReducer,
    orders: ordersReducer,
    products: productsReducer,
    attendance: attendanceReducer,
    reports: reportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
