import type { ReactNode } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useTheme } from "../../theme/ThemeContext";

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const { mode } = useTheme();
    const isDark = mode === "dark";

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-neutral-950" : "bg-neutral-100"
            }`}>
            <div className="flex min-h-screen">
                <aside className={`hidden w-72 shrink-0 border-r p-6 lg:flex flex-col sticky top-0 h-screen transition-colors duration-300 ${isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
                    }`}>
                    <Sidebar />
                </aside>

                <div className="flex min-h-screen flex-1 flex-col">
                    <Navbar />

                    <main className={`flex-1 p-6 transition-colors duration-300 ${isDark ? "bg-neutral-950" : "bg-neutral-100"
                        }`}>{children}</main>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
