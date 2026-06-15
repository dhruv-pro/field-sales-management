import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "./dashboardSlice";
import type { AppDispatch, RootState } from "../../app/store";
import {
    FiUsers,
    FiUserCheck,
    FiShoppingBag,
    FiDollarSign
} from "react-icons/fi";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    CartesianGrid
} from "recharts";
import { FaSpinner } from "react-icons/fa";



const DashboardPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [attendancePage, setAttendancePage] = useState(1);
    const attendanceLimit = 5;

    const { data, loading } = useSelector(
        (state: RootState) => state.dashboard
    );

    useEffect(() => {
        dispatch(fetchDashboard({ attendancePage, attendanceLimit }));
    }, [attendanceLimit, attendancePage, dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <FaSpinner className="animate-spin text-xl" />
            </div>
        );
    }
    const revenueData = [
        { month: "Jan", revenue: 12000 },
        { month: "Feb", revenue: 18000 },
        { month: "Mar", revenue: 15000 },
        { month: "Apr", revenue: 24000 },
        { month: "May", revenue: 28000 },
        { month: "Jun", revenue: data?.summary?.totalRevenue || 0 }
    ];

    const attendanceData = [
        {
            name: "Present",
            value: data?.attendance?.presentToday || 0
        },
        {
            name: "Absent",
            value: data?.attendance?.absentToday || 0
        }
    ];

    const cards = [
        {
            title: "Revenue",
            value: `₹${data?.summary?.totalRevenue?.toLocaleString() || 0}`,
            icon: <FiDollarSign size={28} />,
            iconClass: "bg-emerald-100 text-emerald-600"
        },
        {
            title: "Orders",
            value: data?.summary?.totalOrders || 0,
            icon: <FiShoppingBag size={28} />,
            iconClass: "bg-blue-100 text-blue-600"
        },
        {
            title: "Customers",
            value: data?.summary?.totalCustomers || 0,
            icon: <FiUsers size={28} />,
            iconClass: "bg-violet-100 text-violet-600"
        },
        {
            title: "Employees",
            value: data?.summary?.totalEmployees || 0,
            icon: <FiUserCheck size={28} />,
            iconClass: "bg-orange-100 text-orange-600"
        }
    ];

    const attendanceRate =
        data?.summary?.totalEmployees
            ? Math.round(
                (data.attendance.presentToday /
                    data.summary.totalEmployees) *
                100
            )
            : 0;

    const attendanceRecords = data?.attendance?.records || [];
    const absentEmployees = data?.attendance?.absentEmployees || [];
    const attendancePagination = data?.attendance?.pagination || {
        page: attendancePage,
        limit: attendanceLimit,
        total: 0,
        totalPages: 1,
    };
    const canGoPrevAttendance = attendancePagination.page > 1;
    const canGoNextAttendance =
        attendancePagination.page < attendancePagination.totalPages;

    const formatDashboardTime = (value?: string) =>
        value ? new Date(value).toLocaleTimeString() : "-";

    const maxSales = Math.max(
        ...(data?.topSales?.map(
            (sale: any) => sale.totalSales
        ) || [1])
    );

    const statusClasses: Record<string, string> = {
        pending: "bg-amber-100 text-amber-700",
        completed: "bg-emerald-100 text-emerald-700",
        cancelled: "bg-red-100 text-red-700"
    };

    return (
        <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Dashboard
                </h1>
                <p className="text-gray-500">
                    Field Sales Management Overview
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="
            group
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-xl
            hover:border-blue-200
            "
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    {card.title}
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                    {card.value}
                                </h2>

                                <p className="mt-2 text-sm text-emerald-600">
                                    ↑ Active
                                </p>
                            </div>

                            <div
                                className={`
                    rounded-xl
                    p-4
                    transition-all
                    duration-300
                    group-hover:scale-110
                    ${card.iconClass}
                `}
                            >
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Attendance + Top Sales */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 ">
                {/* Attendance */}
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:-translate-y-1 sm:p-6
            hover:shadow-xl">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                        Attendance Overview
                    </h3>

                    <ResponsiveContainer
                        width="100%"
                        height={250}
                    >
                        <PieChart>
                            <Pie
                                data={attendanceData}
                                innerRadius={60}
                                outerRadius={90}
                                dataKey="value"
                            >
                                <Cell fill="#22c55e" />
                                <Cell fill="#ef4444" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-6 text-center">
                        <h2 className="text-3xl font-bold text-blue-600">
                            {attendanceRate}%
                        </h2>

                        <p className="text-sm text-gray-500">
                            Attendance Rate
                        </p>
                    </div>

                    <div className="mt-4 flex justify-around">
                        <div className="text-center">
                            <h4 className="text-xl font-bold text-green-600">
                                {data?.attendance?.presentToday}
                            </h4>

                            <p className="text-sm text-gray-500">
                                Present
                            </p>
                        </div>

                        <div className="text-center">
                            <h4 className="text-xl font-bold text-red-600">
                                {data?.attendance?.absentToday}
                            </h4>

                            <p className="text-sm text-gray-500">
                                Absent
                            </p>
                        </div>
                    </div>
                </div>

                {/* Top Sales */}
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:-translate-y-1 sm:p-6 xl:col-span-2
            hover:shadow-xl">
                    <h3 className="mb-6 text-lg font-semibold text-gray-900">
                        Top Sales Performers
                    </h3>

                    <div className="space-y-5">
                        {data?.topSales?.map((sale: any) => (
                            <div key={sale._id._id}>
                                <div className="mb-2 flex justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {sale._id.firstName}{" "}
                                            {sale._id.lastName}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {sale.totalOrders} Orders
                                        </p>
                                    </div>

                                    <span className="font-bold text-emerald-600">
                                        ₹{sale.totalSales.toLocaleString()}
                                    </span>
                                </div>

                                <div className="h-2 rounded-full bg-gray-200">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700"
                                        style={{
                                            width: `${(sale.totalSales / maxSales) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Today Attendance */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Today Attendance
                        </h3>
                        <p className="text-sm text-gray-500">
                            Admin check for present, break, checkout, and absent employees
                        </p>
                    </div>

                    <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                        {data?.attendance?.presentToday || 0}/{data?.summary?.totalEmployees || 0} Present
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                                    Employee
                                </th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                                    Status
                                </th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                                    Check In
                                </th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                                    Check Out
                                </th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                                    Work Hours
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {attendanceRecords.map((record: any) => (
                                <tr
                                    key={record._id}
                                    className="border-b border-gray-100 transition-colors duration-200 hover:bg-blue-50"
                                >
                                    <td className="p-3">
                                        <p className="font-medium text-gray-900">
                                            {record.user
                                                ? `${record.user.firstName ?? ""} ${record.user.lastName ?? ""}`.trim()
                                                : "Unknown"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {record.user?.email || "-"}
                                        </p>
                                    </td>

                                    <td className="p-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${record.status === "WORKING"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : record.status === "ON_BREAK"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : record.status === "COMPLETED"
                                                        ? "bg-slate-100 text-slate-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {record.status}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        {formatDashboardTime(record.clockInTime)}
                                    </td>

                                    <td className="p-3">
                                        {formatDashboardTime(record.clockOutTime)}
                                    </td>

                                    <td className="p-3 font-medium">
                                        {record.workingHours || 0}
                                    </td>
                                </tr>
                            ))}

                            {absentEmployees.map((employee: any) => (
                                <tr
                                    key={employee._id}
                                    className="border-b border-gray-100 bg-red-50/40"
                                >
                                    <td className="p-3">
                                        <p className="font-medium text-gray-900">
                                            {`${employee.firstName ?? ""} ${employee.lastName ?? ""}`.trim()}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {employee.email}
                                        </p>
                                    </td>

                                    <td className="p-3">
                                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                            ABSENT
                                        </span>
                                    </td>

                                    <td className="p-3">-</td>
                                    <td className="p-3">-</td>
                                    <td className="p-3">0</td>
                                </tr>
                            ))}

                            {!attendanceRecords.length && !absentEmployees.length && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-6 text-center text-sm text-gray-500"
                                    >
                                        No employees found for attendance today.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500">
                        Page {attendancePagination.page} of{" "}
                        {attendancePagination.totalPages} ·{" "}
                        {attendancePagination.total} employees
                    </p>

                    <div className="grid grid-cols-2 gap-2 sm:flex">
                        <button
                            type="button"
                            disabled={!canGoPrevAttendance}
                            onClick={() =>
                                setAttendancePage((page) => Math.max(page - 1, 1))
                            }
                            className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            disabled={!canGoNextAttendance}
                            onClick={() =>
                                setAttendancePage((page) => page + 1)
                            }
                            className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Revenue Analytics
                    </h3>

                    <span className="text-sm text-gray-500">
                        Last 6 Months
                    </span>
                </div>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >
                    <AreaChart data={revenueData}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            opacity={0.2}
                        />

                        <XAxis dataKey="month" tick={{ fill: "#9ca3af" }} />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#171717",
                                border: "1px solid #404040",
                                borderRadius: "8px",
                                color: "#f5f5f5",
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#2563eb"
                            strokeWidth={3}
                            fill="#dbeafe"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Orders */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                <h3 className="mb-6 text-lg font-semibold text-gray-900">
                    Recent Orders
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[780px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                                    Order No
                                </th>

                                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                                    Customer
                                </th>

                                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                                    Employee
                                </th>

                                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                                    Amount
                                </th>

                                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {data?.recentOrders?.map((order: any) => (
                                <tr
                                    key={order._id}
                                    className="
border-b
border-gray-100
transition-colors
duration-200
hover:bg-blue-50
"
                                >
                                    <td className="p-3">
                                        {order.orderNumber}
                                    </td>

                                    <td className="p-3">
                                        {typeof order.customer === "string"
                                            ? order.customer
                                            : order.customer?.customerName ?? "Unknown"}
                                    </td>

                                    <td className="p-3">
                                        {order.employee
                                            ? `${order.employee.firstName ?? ""} ${order.employee.lastName ?? ""}`.trim()
                                            : "Unknown"}
                                    </td>

                                    <td className="p-3 font-semibold">
                                        ₹{order.totalAmount.toLocaleString()}
                                    </td>

                                    <td className="p-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[order.orderStatus] ||
                                                "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
