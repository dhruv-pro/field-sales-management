import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../../theme/ThemeContext";
import type { RootState } from "../../app/store";
import { getNavItemsForRole } from "../../utils/permissions";

const Sidebar = () => {
    const { mode } = useTheme();
    const isDark = mode === "dark";
    const userRole = useSelector((state: RootState) => state.auth.user?.role);
    const visibleNavItems = getNavItemsForRole(userRole);

    return (
        <div className="flex h-full flex-col">
            <div className="mb-8">
                <div
                    className={`mb-4 text-xs font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ${isDark ? "text-neutral-500" : "text-neutral-400"
                        }`}
                >
                    MENU
                </div>
                <nav className="space-y-1">
                    {visibleNavItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-300 ${isActive
                                    ? "bg-slate-900 text-white"
                                    : isDark
                                        ? "text-neutral-300 hover:bg-black"
                                        : "text-black hover:bg-slate-100"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div
                className={`mt-auto rounded-2xl p-5 text-sm transition-colors duration-300 ${isDark
                    ? "bg-neutral-800 text-neutral-300"
                    : "bg-neutral-100 text-neutral-600"
                    }`}
            >
                <p
                    className={`font-semibold ${isDark ? "text-neutral-50" : "text-neutral-900"
                        }`}
                >
                    Need support?
                </p>
                <p className="mt-2 leading-6">
                    Use the sidebar items to navigate your workflow and keep an eye on sales activity.
                </p>
            </div>
        </div>
    );
};

export default Sidebar;

