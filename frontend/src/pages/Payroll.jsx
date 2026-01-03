import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { DollarSign, Download, Plus } from "lucide-react";

const Payroll = () => {
    const { user } = useAuth();
    const [payrolls, setPayrolls] = useState([]);
    const [showCreate, setShowCreate] = useState(false);

    // Admin only state for creation
    const [formData, setFormData] = useState({
        userId: "",
        month: new Date().toISOString().slice(0, 7), // YYYY-MM
        basicSalary: "",
        deductions: "0"
    });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchPayroll();
        if (user.role === 'ADMIN') {
            fetchUsers();
        }
    }, []);

    const fetchPayroll = async () => {
        try {
            const endpoint = user.role === "ADMIN" ? "/payroll" : "/payroll/me";
            const res = await api.get(endpoint);
            setPayrolls(res.data);
        } catch (error) {
            console.error("Failed to fetch payroll");
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data);
        } catch (e) { }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/payroll/create", formData);
            setShowCreate(false);
            fetchPayroll();
        } catch (error) {
            alert("Failed to create payroll");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Payroll</h1>
                    <p className="text-slate-400">Salary history and slips</p>
                </div>
                {user.role === 'ADMIN' && (
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="glass-button flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Process Payroll
                    </button>
                )}
            </div>

            {showCreate && (
                <div className="glass-card p-6 mb-8 slide-down-animation">
                    <h3 className="text-lg font-semibold mb-4">Process New Salary</h3>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Employee</label>
                            <select
                                className="glass-input w-full [&>option]:text-black"
                                value={formData.userId}
                                onChange={e => setFormData({ ...formData, userId: e.target.value })}
                                required
                            >
                                <option value="">Select Employee</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.employeeId})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Month</label>
                            <input
                                type="month"
                                className="glass-input w-full"
                                value={formData.month}
                                onChange={e => setFormData({ ...formData, month: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Basic Salary ($)</label>
                            <input
                                type="number"
                                className="glass-input w-full"
                                value={formData.basicSalary}
                                onChange={e => setFormData({ ...formData, basicSalary: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Deductions ($)</label>
                            <input
                                type="number"
                                className="glass-input w-full"
                                value={formData.deductions}
                                onChange={e => setFormData({ ...formData, deductions: e.target.value })}
                                required
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                            <button type="button" onClick={() => setShowCreate(false)} className="glass-button-secondary">Cancel</button>
                            <button type="submit" className="glass-button bg-green-600 hover:bg-green-500">Generate Slip</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {payrolls.map((payroll) => (
                    <div key={payroll.id} className="glass-card p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -mr-4 -mt-4" />

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">{payroll.month}</p>
                                <h3 className="text-2xl font-bold text-white mt-1">${payroll.netSalary.toLocaleString()}</h3>
                            </div>
                            <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-slate-300 border-t border-white/5 pt-4 mt-2">
                            {user.role === 'ADMIN' && payroll.User && (
                                <div className="flex justify-between">
                                    <span>Employee</span>
                                    <span className="text-white font-medium">{payroll.User.name}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Basic Salary</span>
                                <span>${payroll.basicSalary.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-rose-300">
                                <span>Deductions</span>
                                <span>-${payroll.deductions.toLocaleString()}</span>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-2 border border-white/10 rounded-lg text-sm hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Download Slip
                        </button>
                    </div>
                ))}
                {payrolls.length === 0 && (
                    <div className="col-span-full text-center py-10 text-slate-500">No payroll records found</div>
                )}
            </div>
        </div>
    );
};

export default Payroll;
