import { useEffect, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { register } from "./authSlice";
import type { RootState } from "../../app/store";

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authState = useSelector((state: RootState) => state.auth);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<"admin" | "manager" | "employee">("employee");
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        if (authState.error) {
            toast.error(authState.error);
        }
    }, [authState.error]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLocalError("");

        if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
            const message = "Please fill in all fields.";
            setLocalError(message);
            toast.error(message);
            return;
        }

        if (password !== confirmPassword) {
            const message = "Passwords do not match.";
            setLocalError(message);
            toast.error(message);
            return;
        }

        if (password.length < 8) {
            const message = "Password must be at least 8 characters.";
            setLocalError(message);
            toast.error(message);
            return;
        }

        try {
            const resultAction = await dispatch(
                register({ firstName, lastName, email, password, role }) as any,
            );

            if (register.fulfilled.match(resultAction)) {
                navigate("/login");
            }
        } catch {
            // error handled in slice
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-xl rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-6 text-2xl font-semibold text-slate-900">Create account</h1>

                {(localError || authState.error) && (
                    <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {localError || authState.error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-700">First name</span>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            placeholder="First name"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-700">Last name</span>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            placeholder="Last name"
                        />
                    </label>

                    <label className="block sm:col-span-2">
                        <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            placeholder="you@example.com"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            placeholder="Create a password"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-700">Confirm password</span>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            placeholder="Confirm password"
                        />
                    </label>

                    <label className="block sm:col-span-2">
                        <span className="mb-1 block text-sm font-medium text-slate-700">Role</span>
                        <select
                            value={role}
                            onChange={(event) => setRole(event.target.value as "admin" | "manager" | "employee")}
                            className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                        >
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </label>

                    <div className="sm:col-span-2">
                        <button
                            type="submit"
                            disabled={authState.loading}
                            className="w-full rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {authState.loading ? "Registering..." : "Create account"}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600 sm:col-span-2">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-slate-900 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
