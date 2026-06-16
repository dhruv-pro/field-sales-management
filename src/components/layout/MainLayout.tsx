import { useState, type ReactNode } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useTheme } from "../../theme/ThemeContext";

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const { mode } = useTheme();
    const isDark = mode === "dark";
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={`min-h-screen ${isDark ? "bg-neutral-950" : "bg-neutral-100"}`}>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-55 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex min-h-screen">

                {/* Desktop Sidebar */}
                <aside
                    className={`hidden lg:flex w-72 shrink-0 border-r p-6 flex-col sticky top-0 h-screen ${isDark
                        ? "border-neutral-800 bg-neutral-900"
                        : "border-neutral-200 bg-white"
                        }`}
                >
                    <Sidebar />
                </aside>

                {/* Mobile Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-[60] w-72 overflow-y-auto transform transition-transform duration-300 lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } ${isDark
                            ? "bg-neutral-900 border-r border-neutral-800"
                            : "bg-white border-r border-neutral-200"
                        }`}
                >
                    <div className="h-full p-6 pt-20">
                        <Sidebar onNavigate={() => setSidebarOpen(false)} />
                    </div>
                </aside>

                <div className="flex min-h-screen flex-1 flex-col">
                    <Navbar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    <main className="flex-1 p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
