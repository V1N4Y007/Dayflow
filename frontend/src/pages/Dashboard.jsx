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
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (user.role === 'ADMIN') {
                    const [usersRes, leavesRes] = await Promise.all([
                        api.get("/users"),
                        api.get("/leave")
                    ]);
                    setStats({
                        totalEmployees: usersRes.data.length,
                        pendingLeaves: leavesRes.data.filter(l => l.status === 'PENDING').length,
                        payrollProcessed: "85%", // Placeholder as backend calculation is complex
                        tasks: leavesRes.data.filter(l => l.status === 'PENDING').length
                    });
                } else {
                    const [attendanceRes, leavesRes, payrollRes] = await Promise.all([
                        api.get("/attendance/me"),
                        api.get("/leave/me"),
                        api.get("/payroll/me")
                    ]);

                    const today = new Date().toISOString().split('T')[0];
                    const todayRecord = attendanceRes.data.find(a => a.date === today);

                    let status = "Not Marked";
                    if (todayRecord) {
                        status = todayRecord.checkOut ? "Checked Out" : "Checked In";
                    }

                    setStats({
                        attendanceToday: status,
                        pendingLeaves: leavesRes.data.filter(l => l.status === 'PENDING').length,
                        netSalary: payrollRes.data.length > 0 ? `$${payrollRes.data[0].netSalary.toLocaleString()}` : "$0",
                        tasks: 0
                    });
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };

        if (user) fetchStats();
    }, [user]);

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
                    title="Pending Leaves"
                    value={stats.pendingLeaves}
                    icon={Calendar}
                    colorClass="bg-pink-500"
                />
                <StatCard
                    title={user.role === 'ADMIN' ? "Payroll Processed" : "Net Salary"}
                    value={user.role === 'ADMIN' ? stats.payrollProcessed || "0%" : stats.netSalary}
                    icon={DollarSign}
                    colorClass="bg-green-500"
                />
                <StatCard
                    title="Tasks"
                    value={stats.tasks || 0}
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
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold">
                                    JD
                                </div>
                                <div>
                                    <p className="font-medium">John Doe checked in</p>
                                    <p className="text-xs text-slate-400">2 hours ago</p>
                                </div>
                            </div>
                        ))}
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
