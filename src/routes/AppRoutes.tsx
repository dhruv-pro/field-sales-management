import { Routes, Route, Navigate } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import DashboardPage from '../features/dashboard/Dashboard';
import UsersPage from '../features/users/UsersPage';
import CustomersPage from '../features/customers/CustomersPage';
import OrdersPage from '../features/orders/OrdersPage';
import ProductsPage from '../features/products/ProductsPage';
import VisitsPage from '../features/visits/VisitsPage';
import MainLayout from '../components/layout/MainLayout';
import AttendancePage from '../features/attendance/AttendancePage';
import ReportPage from '../features/reports/ReportPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />

            <Route
                path='/dashboard'
                element={
                    <PrivateRoute roles={["admin", "manager"]}>
                        <MainLayout>
                            <DashboardPage />
                        </MainLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path='/users'
                element={
                    <PrivateRoute roles={["admin"]}>
                        <MainLayout>
                            <UsersPage />
                        </MainLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path='/attendence'
                element={
                    <PrivateRoute roles={["employee", "manager"]}>
                        <MainLayout>
                            <AttendancePage />
                        </MainLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path='/customers'
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <CustomersPage />
                        </MainLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path='/orders'
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <OrdersPage />
                        </MainLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path='/products'
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <ProductsPage />
                        </MainLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path='/visits'
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <VisitsPage />
                        </MainLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path='/reports'
                element={
                    <PrivateRoute>
                        <MainLayout>
                            <ReportPage />
                        </MainLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path='*'
                element={<Navigate to='/dashboard' replace />}
            />
        </Routes>
    );
};

export default AppRoutes;