import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard,
    CalendarCheck,
    Clock,
    DollarSign,
    Users,
    LogOut,
    Briefcase
} from "lucide-react";
import clsx from "clsx";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const links = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "Attendance", path: "/attendance", icon: Clock },
        { name: "Leaves", path: "/leaves", icon: CalendarCheck },
        { name: "Payroll", path: "/payroll", icon: DollarSign },
    ];

    if (user?.role === "ADMIN") {
        links.push({ name: "Employees", path: "/employees", icon: Users });
    }

    return (
        <div className="h-screen w-64 glass-panel flex flex-col fixed left-0 top-0 border-r border-white/10 z-20">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <Briefcase className="text-white w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
                    Dayflow
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className={clsx("w-5 h-5", isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-white")} />
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-800/50">
                    <img
                        src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
