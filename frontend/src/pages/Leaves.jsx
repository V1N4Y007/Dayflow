import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { CalendarCheck, Plus, Check, X } from "lucide-react";
import clsx from "clsx";

const Leaves = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [showApply, setShowApply] = useState(false);
    const [formData, setFormData] = useState({
        type: "PAID",
        startDate: "",
        endDate: "",
        remarks: ""
    });

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const endpoint = user.role === "ADMIN" ? "/leave" : "/leave/me";
            const res = await api.get(endpoint);
            setLeaves(res.data);
        } catch (error) {
            console.error("Failed to fetch leaves");
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        try {
            await api.post("/leave/apply", formData);
            setShowApply(false);
            setFormData({ type: "PAID", startDate: "", endDate: "", remarks: "" });
            fetchLeaves();
        } catch (error) {
            alert("Failed to apply");
        }
    };

    const handleAction = async (id, status) => {
        try {
            await api.put(`/leave/${id}/approve`, { status, comment: "Processed by " + user.name });
            fetchLeaves();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Leave Management</h1>
                    <p className="text-slate-400">View and manage time-off requests</p>
                </div>
                {user.role === 'EMPLOYEE' && (
                    <button
                        onClick={() => setShowApply(!showApply)}
                        className="glass-button flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Apply for Leave
                    </button>
                )}
            </div>

            {showApply && (
                <div className="glass-card p-6 mb-8 slide-down-animation">
                    <h3 className="text-lg font-semibold mb-4">New Leave Request</h3>
                    <form onSubmit={handleApply} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Leave Type</label>
                            <select
                                className="glass-input w-full [&>option]:text-black"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="PAID">Paid Leave</option>
                                <option value="SICK">Sick Leave</option>
                                <option value="UNPAID">Unpaid Leave</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Remarks</label>
                            <input
                                type="text"
                                className="glass-input w-full"
                                value={formData.remarks}
                                onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Start Date</label>
                            <input
                                type="date"
                                className="glass-input w-full"
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">End Date</label>
                            <input
                                type="date"
                                className="glass-input w-full"
                                value={formData.endDate}
                                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                            <button type="button" onClick={() => setShowApply(false)} className="glass-button-secondary">Cancel</button>
                            <button type="submit" className="glass-button bg-pink-600 hover:bg-pink-500">Submit Request</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {leaves.map((leave) => (
                    <div key={leave.id} className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className={clsx(
                                "w-12 h-12 rounded-xl flex items-center justify-center border",
                                leave.type === 'SICK' ? "bg-red-500/20 border-red-500/30 text-red-400" :
                                    leave.type === 'PAID' ? "bg-blue-500/20 border-blue-500/30 text-blue-400" :
                                        "bg-amber-500/20 border-amber-500/30 text-amber-400"
                            )}>
                                <CalendarCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold flex items-center gap-2">
                                    {leave.type} Leave
                                    <span className={clsx(
                                        "text-xs px-2 py-0.5 rounded-full border",
                                        leave.status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            leave.status === 'REJECTED' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                                                "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    )}>
                                        {leave.status}
                                    </span>
                                </h4>
                                <p className="text-sm text-slate-400">
                                    {leave.startDate} - {leave.endDate} •
                                    <span className="text-slate-500 italic ml-1">"{leave.remarks}"</span>
                                </p>
                                {user.role === 'ADMIN' && leave.User && (
                                    <p className="text-xs text-indigo-300 mt-1">Requested by: {leave.User.name} ({leave.User.employeeId})</p>
                                )}
                            </div>
                        </div>

                        {user.role === 'ADMIN' && leave.status === 'PENDING' && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAction(leave.id, 'APPROVED')}
                                    className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20 transition-colors"
                                    title="Approve"
                                >
                                    <Check className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleAction(leave.id, 'REJECTED')}
                                    className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/20 transition-colors"
                                    title="Reject"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {leaves.length === 0 && (
                    <div className="text-center py-10 text-slate-500">No leave history</div>
                )}
            </div>
        </div>
    );
};

export default Leaves;
