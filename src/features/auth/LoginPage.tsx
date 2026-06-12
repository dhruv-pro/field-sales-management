import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { login } from "./authSlice";
import type { RootState } from "../../app/store";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authState = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedEmail = email.trim();

        if (!trimmedEmail || !password.trim()) {
            toast.error("Please enter both email and password.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        try {
            const resultAction = await dispatch(
                login({
                    email: trimmedEmail,
                    password,
                }) as any
            );

            if (login.fulfilled.match(resultAction)) {
                toast.success("Login successful");
                navigate("/dashboard");
            } else {
                const errorMessage =
                    resultAction.payload ||
                    resultAction.error?.message ||
                    authState.error ||
                    "Invalid email or password";

                toast.error(String(errorMessage));
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80')",
                }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-slate-900/70" />

            <div className="relative z-10 w-full max-w-md rounded-lg bg-white/95 backdrop-blur-md p-8 shadow-md">
                <h1 className="mb-6 text-2xl font-semibold text-slate-900">
                    Sign in
                </h1>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-4"
                >
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-700">
                            Email
                        </span>

                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-slate-700">
                            Password
                        </span>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 pr-10 outline-none focus:border-slate-500"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-900"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M17.94 17.94A10.95 10.95 0 0 1 12 19c-7 0-11-7-11-7a18.37 18.37 0 0 1 5.06-5.94" />
                                        <path d="M1 1l22 22" />
                                        <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" />
                                        <path d="M10.41 6.11A9.65 9.65 0 0 1 12 5c7 0 11 7 11 7a18.54 18.54 0 0 1-2.14 3.31" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </label>

                    <button
                        type="submit"
                        disabled={authState.loading}
                        className="w-full rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {authState.loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-slate-900 hover:underline"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;