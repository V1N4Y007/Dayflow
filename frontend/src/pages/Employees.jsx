import { useState, useEffect } from "react";
import api from "../utils/api";
import { Search, Mail, Phone, Briefcase, Edit2, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Employees = () => {
    const { user: currentUser } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get("/users");
            setEmployees(res.data);
        } catch (error) {
            console.error("Failed to fetch employees");
        }
    };

    const handleEditClick = (emp) => {
        setEditingUser(emp);
        setFormData({
            name: emp.name,
            email: emp.email,
            role: emp.role,
            phone: emp.phone || "",
            address: emp.address || "",
            salary: emp.salary || "",
            employeeId: emp.employeeId,
            documents: emp.documents || ""
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${editingUser.id}`, formData);
            setEditingUser(null);
            fetchEmployees();
        } catch (error) {
            alert("Failed to update employee");
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name?.toLowerCase().includes(search.toLowerCase()) ||
        emp.email?.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeId?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Employees</h1>
                    <p className="text-slate-400">Manage your workforce</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        className="glass-input pl-10 w-64"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((emp) => (
                    <div key={emp.id} className="glass-card p-6 flex flex-col items-center text-center group hover:bg-white/10 transition-colors relative">
                        {currentUser.role === 'ADMIN' && (
                            <button
                                onClick={() => handleEditClick(emp)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        )}

                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-[2px] mb-4 group-hover:scale-105 transition-transform">
                            <img
                                src={emp.profileImage || `https://ui-avatars.com/api/?name=${emp.name}&background=random`}
                                alt={emp.name}
                                className="w-full h-full rounded-full border-4 border-slate-900 object-cover"
                            />
                        </div>

                        <h3 className="text-xl font-bold mb-1">{emp.name}</h3>
                        <p className="text-indigo-400 text-sm mb-4 font-medium">{emp.role}</p>

                        <div className="w-full space-y-3">
                            <div className="flex items-center gap-3 text-sm text-slate-300 p-2 rounded-lg bg-white/5">
                                <BadgeId className="w-4 h-4 text-slate-500" />
                                <span>{emp.employeeId}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300 p-2 rounded-lg bg-white/5">
                                <Mail className="w-4 h-4 text-slate-500" />
                                <span className="truncate">{emp.email}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card w-full max-w-lg p-6 slide-down-animation">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Edit Employee</h3>
                            <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Name</label>
                                    <input
                                        className="glass-input w-full"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Employee ID</label>
                                    <input
                                        className="glass-input w-full"
                                        value={formData.employeeId}
                                        onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Email</label>
                                <input
                                    className="glass-input w-full"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Role</label>
                                    <select
                                        className="glass-input w-full [&>option]:text-black"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="EMPLOYEE">Employee</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Salary</label>
                                    <input
                                        type="number"
                                        className="glass-input w-full"
                                        value={formData.salary}
                                        onChange={e => setFormData({ ...formData, salary: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Phone</label>
                                <input
                                    className="glass-input w-full"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Address</label>
                                <textarea
                                    className="glass-input w-full h-24 resize-none"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Documents (URLs)</label>
                                <textarea
                                    className="glass-input w-full h-24 resize-none"
                                    placeholder="Enter document URLs separated by commas"
                                    value={formData.documents || ""}
                                    onChange={e => setFormData({ ...formData, documents: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setEditingUser(null)} className="glass-button-secondary">Cancel</button>
                                <button type="submit" className="glass-button bg-indigo-600 hover:bg-indigo-500">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Start icon hack
function BadgeId({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.74Z" /></svg>
    )
}

export default Employees;
