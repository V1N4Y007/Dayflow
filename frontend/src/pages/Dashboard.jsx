import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../utils/api";
import { Clock, Calendar, DollarSign, Users, AlertCircle, CheckCircle } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="glass-card p-6 flex items-start justify-between relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-24 h-24 ${colorClass} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
        <div>
            <p className="text-slate-400 font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-20 text-white`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        attendanceToday: "Not Marked",
        pendingLeaves: 0,
        totalEmployees: 0,
        totalPayroll: 0,
        presentToday: 0,
        netSalary: 0,
        tasks: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get("/dashboard/stats");
            setStats(res.data);
        } catch (error) {
            console.error("Failed to fetch stats");
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Hello, {user?.name} 👋</h1>
                <p className="text-slate-400">Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title={user.role === 'ADMIN' ? "Total Employees" : "My Attendance"}
                    value={user.role === 'ADMIN' ? stats.totalEmployees : stats.attendanceToday}
                    icon={user.role === 'ADMIN' ? Users : Clock}
                    colorClass="bg-blue-500"
                />
                <StatCard
                    title={user.role === 'ADMIN' ? "Present Today" : "Pending Leaves"}
                    value={user.role === 'ADMIN' ? stats.presentToday : stats.pendingLeaves}
                    icon={user.role === 'ADMIN' ? Clock : Calendar}
                    colorClass="bg-pink-500"
                />
                <StatCard
                    title={user.role === 'ADMIN' ? "Payroll (Month)" : "Last Salary"}
                    value={user.role === 'ADMIN' ? `$${stats.totalPayroll?.toLocaleString() || 0}` : `$${stats.netSalary?.toLocaleString() || 0}`}
                    icon={DollarSign}
                    colorClass="bg-green-500"
                />
                <StatCard
                    title={user.role === 'ADMIN' ? "Pending Leaves" : "Tasks"}
                    value={user.role === 'ADMIN' ? stats.pendingLeaves : stats.tasks}
                    icon={AlertCircle}
                    colorClass="bg-amber-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-indigo-400" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {stats.recentActivity?.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold">
                                    {activity.User?.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <p className="font-medium">{activity.User?.name} checked in</p>
                                    <p className="text-xs text-slate-400">
                                        {new Date(activity.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {(!stats.recentActivity || stats.recentActivity.length === 0) && (
                            <p className="text-slate-500 text-center py-4">No recent activity</p>
                        )}
                    </div>
                </div>

                <div className="glass-card p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/40">
                    <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="glass-button-secondary py-4 text-left px-5 hover:bg-white/10 group">
                            <Clock className="w-6 h-6 mb-2 text-indigo-300 group-hover:scale-110 transition-transform" />
                            <span className="block font-medium">Mark Attendance</span>
                        </button>
                        <button className="glass-button-secondary py-4 text-left px-5 hover:bg-white/10 group">
                            <Calendar className="w-6 h-6 mb-2 text-pink-300 group-hover:scale-110 transition-transform" />
                            <span className="block font-medium">Apply Leave</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
