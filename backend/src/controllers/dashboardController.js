import { User, Leave, Attendance, Payroll } from "../models/index.js";
import { Op } from "sequelize";

export const getStats = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        let stats = {};

        if (req.user.role === 'ADMIN') {
            const totalEmployees = await User.count({ where: { role: 'EMPLOYEE' } });
            const pendingLeaves = await Leave.count({ where: { status: 'PENDING' } });

            // Calculate total payroll for current month
            const currentMonth = today.slice(0, 7);
            const payrolls = await Payroll.findAll({ where: { month: currentMonth } });
            const totalPayroll = payrolls.reduce((acc, curr) => acc + curr.netSalary, 0);

            // Count present employees today
            const presentToday = await Attendance.count({
                where: {
                    date: today,
                    status: { [Op.ne]: 'ABSENT' }
                }
            });

            stats = {
                totalEmployees,
                pendingLeaves,
                totalPayroll,
                presentToday
            };
        } else {
            // Employee Stats
            const myAttendance = await Attendance.findOne({
                where: {
                    userId: req.user.id,
                    date: today
                }
            });

            const pendingLeaves = await Leave.count({
                where: {
                    userId: req.user.id,
                    status: 'PENDING'
                }
            });

            const lastPayroll = await Payroll.findOne({
                where: { userId: req.user.id },
                order: [['month', 'DESC']]
            });

            // Count tasks (mock for now, or could be pending leaves?)
            const tasks = 0;

            stats = {
                attendanceToday: myAttendance ? myAttendance.status : "Not Marked",
                pendingLeaves,
                netSalary: lastPayroll ? lastPayroll.netSalary : 0,
                tasks
            };
        }

        // Recent Activity (Last 5 attendance records)
        const recentActivity = await Attendance.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                attributes: ['name']
            }]
        });

        stats.recentActivity = recentActivity;

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
