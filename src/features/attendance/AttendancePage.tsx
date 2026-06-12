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
            <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg">
                <h2 className="text-xl font-bold mb-4">Attendance</h2>

                <div className="border p-4 rounded mb-4">
                    <p>
                        <b>Status:</b>{" "}
                        <span
                            style={{
                                color:
                                    today?.attendance?.status === "WORKING"
                                        ? "green"
                                        : today?.attendance?.status === "ON_BREAK"
                                            ? "orange"
                                            : today?.attendance?.status === "COMPLETED"
                                                ? "red"
                                                : "gray",
                                fontWeight: "bold",
                            }}
                        >
                            {today?.attendance?.status || "NOT_STARTED"}
                        </span>
                    </p>
                    <p>
                        <b>Check In:</b>{" "}
                        {today?.attendance?.clockInTime
                            ? new Date(
                                today.attendance.clockInTime
                            ).toLocaleTimeString()
                            : "-"}
                    </p>
                    <p>
                        <b>Live Timer:</b> {formatTime(loginSeconds)}
                    </p>
                    <p>
                        <b>Break Timer:</b> {formatTime(breakSeconds)}
                    </p>
                    <p>
                        <b>Working Hours:</b> {today?.attendance?.workingHours || 0}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleCheckIn}
                        disabled={loading || !!today?.attendance?.clockInTime}
                        className="px-4 py-2 bg-green-600 text-white rounded"
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
                        className="px-4 py-2 bg-red-600 text-white rounded"
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
                        className="px-4 py-2 bg-yellow-500 text-white rounded"
                    >
                        Start Break
                    </button>

                    <button
                        onClick={handleEndBreak}
                        disabled={loading || !today?.isBreakRunning}
                        className="px-4 py-2 bg-orange-500 text-white rounded"
                    >
                        End Break
                    </button>
                </div>
            </div>

        </>
    );
};

export default AttendancePage;
