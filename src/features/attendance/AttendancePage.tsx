import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { getCurrentLocation } from "./location";
import {
    checkIn,
    checkOut,
    endBreak,
    fetchTodayAttendance,
    startBreak,
} from "./attendanceSlice";
import toast from "react-hot-toast";






const AttendancePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { today, loading } = useSelector(
        (state: RootState) => state.attendance
    );
    const [loginSeconds, setLoginSeconds] = useState(0);
    const [breakSeconds, setBreakSeconds] = useState(0);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        dispatch(fetchTodayAttendance());
    }, [dispatch]);

    useEffect(() => {
        if (!today) {
            setLoginSeconds(0);
            setBreakSeconds(0);
            setInitialized(true);
            return;
        }

        setLoginSeconds(today.loginSeconds || 0);
        setBreakSeconds(today.currentBreakSeconds || 0);

        setInitialized(true);
    }, [today?.attendance?._id]);

    useEffect(() => {
        if (!initialized) return;

        const interval = setInterval(() => {
            setLoginSeconds((prev) => {
                if (!today?.attendance?.clockInTime || today?.attendance?.clockOutTime) {
                    return prev;
                }
                return prev + 1;
            });

            setBreakSeconds((prev) => {
                if (!today?.isBreakRunning) return prev;
                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [initialized, today?.isBreakRunning, today?.attendance?.clockInTime, today?.attendance?.clockOutTime]);

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(fetchTodayAttendance());
        }, 15000);

        return () => clearInterval(interval);
    }, [dispatch]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${String(hrs).padStart(2, "0")}:${String(
            mins
        ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };
    const handleCheckIn = async () => {
        try {
            const location = await getCurrentLocation();

            const response = await dispatch(checkIn(location)).unwrap();

            toast.success(response?.message || "Checked in successfully");
            dispatch(fetchTodayAttendance());
        } catch (error: any) {
            console.log(error);

            toast.error(
                typeof error === "string"
                    ? error
                    : error?.message || "Something went wrong"
            );
        }
    };

    const handleCheckOut = async () => {
        console.log("Checkout clicked");

        try {
            const location = await getCurrentLocation();
            console.log("Location:", location);

            const response = await dispatch(checkOut(location)).unwrap();

            console.log("Response:", response);

            toast.success(response?.message || "Checked out successfully");
            dispatch(fetchTodayAttendance());
        } catch (error: any) {
            console.error(error);
            toast.error(
                typeof error === "string"
                    ? error
                    : error?.message || "Something went wrong"
            );
        }
    };

    const handleStartBreak = async () => {
        try {
            const response = await dispatch(startBreak()).unwrap();

            toast.success(response?.message || "Break started");

            dispatch(fetchTodayAttendance());
        } catch (error: any) {
            toast.error(
                typeof error === "string"
                    ? error
                    : error?.message || "Something went wrong"
            );
        }
    };

    const handleEndBreak = async () => {
        try {
            const response = await dispatch(endBreak()).unwrap();

            toast.success(response?.message || "Break ended");

            dispatch(fetchTodayAttendance());
        } catch (error: any) {
            toast.error(
                typeof error === "string"
                    ? error
                    : error?.message || "Something went wrong"
            );
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Attendance Dashboard
                    </h2>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-5">

                    {/* Status Row */}
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Status</span>

                        <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${today?.attendance?.status === "WORKING"
                                    ? "bg-green-100 text-green-700"
                                    : today?.attendance?.status === "ON_BREAK"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : today?.attendance?.status === "COMPLETED"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            {today?.attendance?.status || "NOT_STARTED"}
                        </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Check In</p>
                            <p className="font-semibold text-gray-800">
                                {today?.attendance?.clockInTime
                                    ? new Date(today.attendance.clockInTime).toLocaleTimeString()
                                    : "-"}
                            </p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Working Hours</p>
                            <p className="font-semibold text-gray-800">
                                {today?.attendance?.workingHours || 0} hrs
                            </p>
                        </div>

                        <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-blue-500">Live Timer</p>
                            <p className="text-lg font-bold text-blue-700">
                                {formatTime(loginSeconds)}
                            </p>
                        </div>

                        <div className="p-3 bg-orange-50 rounded-lg">
                            <p className="text-orange-500">Break Timer</p>
                            <p className="text-lg font-bold text-orange-600">
                                {formatTime(breakSeconds)}
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                        <button
                            onClick={handleCheckIn}
                            disabled={loading || !!today?.attendance?.clockInTime}
                            className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium
                     hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Check In
                        </button>

                        <button
                            onClick={handleCheckOut}
                            disabled={
                                loading ||
                                !today?.attendance?.clockInTime ||
                                !!today?.attendance?.clockOutTime
                            }
                            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium
                     hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Check Out
                        </button>

                        <button
                            onClick={handleStartBreak}
                            disabled={
                                loading ||
                                !today?.attendance?.clockInTime ||
                                !!today?.attendance?.clockOutTime ||
                                today?.isBreakRunning
                            }
                            className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-medium
                     hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Start Break
                        </button>

                        <button
                            onClick={handleEndBreak}
                            disabled={loading || !today?.isBreakRunning}
                            className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium
                     hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            End Break
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AttendancePage;
