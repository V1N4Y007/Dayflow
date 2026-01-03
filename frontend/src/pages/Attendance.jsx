import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Clock, CheckCircle, XCircle, MapPin } from "lucide-react";
import clsx from "clsx";

const Attendance = () => {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null); // 'checking-in', 'checked-in', 'checked-out'

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const endpoint = user.role === "ADMIN" ? "/attendance" : "/attendance/me";
            const res = await api.get(endpoint);
            setData(res.data);
        } catch (error) {
            console.error("Failed to fetch attendance");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            await api.post("/attendance/checkin");
            fetchAttendance();
            // Show success toast
        } catch (error) {
            alert(error.response?.data?.message || "Check-in failed");
        }
    };

    const handleCheckOut = async () => {
        try {
            await api.put("/attendance/checkout");
            fetchAttendance();
            // Show success toast
        } catch (error) {
            alert(error.response?.data?.message || "Check-out failed");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Attendance</h1>
                    <p className="text-slate-400">Track daily check-ins and check-outs</p>
                </div>

                {user.role !== 'ADMIN' && (
                    <div className="flex gap-4">
                        <button
                            onClick={handleCheckIn}
                            className="glass-button flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Check In
                        </button>
                        <button
                            onClick={handleCheckOut}
                            className="glass-button flex items-center gap-2 bg-rose-600 hover:bg-rose-500 shadow-rose-500/20"
                        >
                            <XCircle className="w-4 h-4" />
                            Check Out
                        </button>
                    </div>
                )}
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-sm uppercase tracking-wider">
                            <th className="p-4 font-medium">Date</th>
                            {user.role === "ADMIN" && <th className="p-4 font-medium">Employee</th>}
                            <th className="p-4 font-medium">Check In</th>
                            <th className="p-4 font-medium">Check Out</th>
                            <th className="p-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan="5" className="p-4 text-center text-slate-500">No records found</td></tr>
                        ) : (
                            data.map((record) => (
                                <tr key={record.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">{record.date}</td>
                                    {user.role === "ADMIN" && (
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">
                                                    {record.User?.name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{record.User?.name}</p>
                                                    <p className="text-xs text-slate-500">{record.User?.employeeId}</p>
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                    <td className="p-4 text-emerald-400">
                                        {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                    </td>
                                    <td className="p-4 text-rose-400">
                                        {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                    </td>
                                    <td className="p-4">
                                        <span className={clsx(
                                            "px-2 py-1 rounded-full text-xs font-semibold border",
                                            record.status === 'PRESENT' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                record.status === 'ABSENT' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                                                    "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        )}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Attendance;
