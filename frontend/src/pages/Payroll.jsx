import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { DollarSign, Download, Plus } from "lucide-react";
import jsPDF from "jspdf";

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

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this payroll record?")) return;
        try {
            await api.delete(`/payroll/${id}`);
            fetchPayroll();
        } catch (error) {
            alert("Failed to delete payroll");
        }
    };

    const generatePDF = (payroll) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text("Dayflow HRMS", 105, 20, { align: "center" });

        doc.setFontSize(16);
        doc.text("Payslip", 105, 30, { align: "center" });

        // Line separator
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // Details
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);

        const startY = 50;
        const lineHeight = 10;

        doc.text(`Payslip ID: #${payroll.id}`, 20, startY);
        doc.text(`Month: ${payroll.month}`, 20, startY + lineHeight);

        if (payroll.User) {
            doc.text(`Employee: ${payroll.User.name}`, 20, startY + lineHeight * 2);
            doc.text(`Employee ID: ${payroll.User.employeeId || "N/A"}`, 20, startY + lineHeight * 3);
        }

        // Financials Table-like structure
        const tableStartY = startY + lineHeight * 5;

        doc.setFillColor(240, 240, 240);
        doc.rect(20, tableStartY - 5, 170, 10, 'F');
        doc.setFont(undefined, 'bold');
        doc.text("Description", 25, tableStartY + 2);
        doc.text("Amount", 160, tableStartY + 2, { align: "right" });

        doc.setFont(undefined, 'normal');

        // Basic Salary
        doc.text("Basic Salary", 25, tableStartY + 15);
        doc.text(`$${payroll.basicSalary.toLocaleString()}`, 160, tableStartY + 15, { align: "right" });

        // Deductions
        doc.setTextColor(200, 50, 50);
        doc.text("Deductions", 25, tableStartY + 25);
        doc.text(`-$${payroll.deductions.toLocaleString()}`, 160, tableStartY + 25, { align: "right" });

        // Net Salary
        doc.setLineWidth(0.5);
        doc.line(20, tableStartY + 35, 190, tableStartY + 35);

        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 100, 0);
        doc.setFontSize(14);
        doc.text("Net Salary", 25, tableStartY + 45);
        doc.text(`$${payroll.netSalary.toLocaleString()}`, 160, tableStartY + 45, { align: "right" });

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 280, { align: "center" });

        doc.save(`Payslip_${payroll.month}_${payroll.User?.name || 'Employee'}.pdf`);
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

                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => generatePDF(payroll)}
                                className="flex-1 py-2 border border-white/10 rounded-lg text-sm hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Slip
                            </button>
                            {user.role === 'ADMIN' && (
                                <button
                                    onClick={() => handleDelete(payroll.id)}
                                    className="px-3 py-2 border border-rose-500/30 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
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
