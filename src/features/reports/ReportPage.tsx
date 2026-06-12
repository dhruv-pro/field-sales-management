import React, { useEffect, useState } from "react";
import api from "../../api/axios";

type TabType = "visits" | "sales" | "performance";

const tabs: TabType[] = ["visits", "sales", "performance"];

const ReportPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>("visits");

    const [visits, setVisits] = useState<any[]>([]);
    const [sales, setSales] = useState<any[]>([]);
    const [performance, setPerformance] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const fetchReports = async (tab: TabType) => {
        setLoading(true);
        setError("");

        try {
            if (tab === "visits") {
                const res = await api.get("api/reports/visits");
                setVisits(res.data?.data || []);
            }

            if (tab === "sales") {
                const res = await api.get("api/reports/sales");
                setSales(res.data?.data || []);
            }

            if (tab === "performance") {
                const res = await api.get("api/reports/employee-performance");
                setPerformance(res.data?.data || []);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports(activeTab);
    }, [activeTab]);

    // ---------------------------
    // CSV EXPORT LOGIC
    // ---------------------------
    const exportToCSV = (data: any[], filename: string) => {
        if (!data || data.length === 0) return;

        const flatten = (obj: any) => {
            const result: any = {};

            Object.keys(obj).forEach((key) => {
                const value = obj[key];

                if (typeof value === "object" && value !== null) {
                    result[key] = JSON.stringify(value);
                } else {
                    result[key] = value;
                }
            });

            return result;
        };

        const flattened = data.map(flatten);

        const headers = Object.keys(flattened[0]).join(",");
        const rows = flattened.map((row) =>
            Object.values(row)
                .map((val) => `"${val}"`)
                .join(",")
        );

        const csvContent = [headers, ...rows].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExport = () => {
        if (activeTab === "visits") {
            exportToCSV(visits, "visits_report");
        }

        if (activeTab === "sales") {
            exportToCSV(sales, "sales_report");
        }

        if (activeTab === "performance") {
            exportToCSV(performance, "performance_report");
        }
    };

    // ---------------------------
    // TABLES
    // ---------------------------

    const renderVisits = () => (
        <table className="w-full border text-sm">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border">Employee</th>
                    <th className="p-2 border">Customer</th>
                    <th className="p-2 border">Location</th>
                    <th className="p-2 border">Check In</th>
                    <th className="p-2 border">Status</th>
                </tr>
            </thead>
            <tbody>
                {visits?.map((item: any) => (
                    <tr key={item._id}>
                        <td className="p-2 border">
                            {item.employee?.firstName} {item.employee?.lastName}
                        </td>
                        <td className="p-2 border">{item.customer?.customerName}</td>
                        <td className="p-2 border">{item.location?.address}</td>
                        <td className="p-2 border">
                            {new Date(item.checkInTime).toLocaleString()}
                        </td>
                        <td className="p-2 border capitalize">{item.visitStatus}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderSales = () => (
        <table className="w-full border text-sm">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border">Order No</th>
                    <th className="p-2 border">Employee</th>
                    <th className="p-2 border">Customer</th>
                    <th className="p-2 border">Total</th>
                    <th className="p-2 border">Status</th>
                </tr>
            </thead>
            <tbody>
                {sales?.map((item: any) => (
                    <tr key={item._id}>
                        <td className="p-2 border">{item.orderNumber}</td>
                        <td className="p-2 border">
                            {item.employee?.firstName} {item.employee?.lastName}
                        </td>
                        <td className="p-2 border">{item.customer?.customerName}</td>
                        <td className="p-2 border">₹{item.totalAmount}</td>
                        <td className="p-2 border capitalize">{item.orderStatus}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderPerformance = () => (
        <table className="w-full border text-sm">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border">Employee</th>
                    <th className="p-2 border">Total Orders</th>
                    <th className="p-2 border">Total Revenue</th>
                </tr>
            </thead>
            <tbody>
                {performance?.map((item: any, index: number) => (
                    <tr key={index}>
                        <td className="p-2 border">
                            {item._id?.firstName} {item._id?.lastName}
                        </td>
                        <td className="p-2 border">{item.totalOrders}</td>
                        <td className="p-2 border">₹{item.totalRevenue}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="p-4">

            {/* Tabs + Export */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">

                <div className="flex gap-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded capitalize ${activeTab === tab
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                >
                    Export CSV
                </button>
            </div>

            {/* States */}
            {loading && <p className="text-blue-600">Loading report...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Content */}
            <div className="bg-white shadow rounded p-3">
                {activeTab === "visits" && renderVisits()}
                {activeTab === "sales" && renderSales()}
                {activeTab === "performance" && renderPerformance()}
            </div>
        </div>
    );
};

export default ReportPage;