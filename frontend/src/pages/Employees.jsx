import { useState, useEffect } from "react";
import api from "../utils/api";
import { Search, Mail, Phone, Briefcase, IdCard } from "lucide-react";

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");

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
                    <div key={emp.id} className="glass-card p-6 flex flex-col items-center text-center group hover:bg-white/10 transition-colors">
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
                                <IdCard className="w-4 h-4 text-slate-500" />
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
        </div>
    );
};

// Start icon hack


export default Employees;
