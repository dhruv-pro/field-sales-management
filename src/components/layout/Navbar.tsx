import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";
import { logout } from "../../features/auth/authSlice";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { mode, toggleTheme } = useTheme();
    const isDark = mode === "dark";
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const authUser = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        setProfileMenuOpen(false);
        navigate("/login");
    };

    return (
        <header className={`border-b transition-colors duration-300 px-6 py-4 shadow-sm ${isDark
            ? "border-neutral-800 bg-neutral-900"
            : "border-neutral-200 bg-white"
            }`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className={`text-sm font-medium uppercase tracking-[0.3em] ${isDark ? "text-neutral-500" : "text-neutral-400"
                        }`}>
                        Sales Force
                    </p>
                    <h1 className={`text-xl font-semibold ${isDark ? "text-neutral-50" : "text-neutral-900"
                        }`}>Main dashboard</h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`hidden rounded-full px-3 py-2 text-sm font-medium transition-colors duration-300 sm:block ${isDark
                        ? "bg-neutral-800 text-neutral-300"
                        : "bg-neutral-100 text-neutral-600"
                        }`}>
                        {authUser
                            ? `${authUser.firstName} ${authUser.lastName} (${authUser.role})`
                            : "User"}
                    </div>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ${isDark
                            ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                            }`}
                        aria-label="Toggle theme"
                        title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
                    >
                        {mode === "light" ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        )}
                    </button>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ${isDark
                                ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                }`}
                            aria-label="Profile menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </button>

                        {profileMenuOpen && (
                            <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ring-1 ${isDark
                                ? "bg-neutral-800 ring-neutral-700"
                                : "bg-white ring-neutral-200"
                                }`}>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className={`w-full px-4 py-3 text-sm font-medium text-left transition-colors duration-300 ${isDark
                                        ? "text-red-400 hover:bg-neutral-700"
                                        : "text-red-600 hover:bg-neutral-50"
                                        }`}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
