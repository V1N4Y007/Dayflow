import sequelize from "./src/config/db.js";
import { User, Attendance, Leave, Payroll } from "./src/models/index.js";
import bcrypt from "bcryptjs";

const seedDatabase = async () => {
    try {
        // Disable foreign key checks to allow dropping tables
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

        // Force sync to clear existing data
        await sequelize.sync({ force: true });

        // Re-enable foreign key checks
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

        console.log("Database synced (cleared).");

        const passwordHash = await bcrypt.hash("password123", 10);

        // --- Create Users ---
        const admin = await User.create({
            employeeId: "ADMIN-001",
            name: "Admin User",
            email: "admin@dayflow.com",
            password: passwordHash,
            role: "ADMIN",
            phone: "1234567890",
            address: "Admin HQ",
            salary: 100000,
            isVerified: true,
            profileImage: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
        });

        const employees = [];
        for (let i = 1; i <= 4; i++) {
            const emp = await User.create({
                employeeId: `EMP-00${i}`,
                name: `Employee ${i}`,
                email: `emp${i}@dayflow.com`,
                password: passwordHash,
                role: "EMPLOYEE",
                phone: `987654320${i}`,
                address: `Employee Address ${i}`,
                salary: 50000 + (i * 1000),
                isVerified: true,
                profileImage: `https://ui-avatars.com/api/?name=Employee+${i}&background=random`
            });
            employees.push(emp);
        }
        console.log("Users created.");

        // --- Create Attendance (Last 30 Days) ---
        const today = new Date();
        for (const emp of employees) {
            for (let d = 30; d >= 0; d--) {
                const date = new Date(today);
                date.setDate(date.getDate() - d);

                // Skip weekends (0 = Sunday, 6 = Saturday)
                if (date.getDay() === 0 || date.getDay() === 6) continue;

                const dateStr = date.toISOString().split('T')[0];

                // 90% chance of being present
                if (Math.random() > 0.1) {
                    // Random check-in between 8:00 and 10:00
                    const checkInHour = 8 + Math.floor(Math.random() * 2);
                    const checkInMin = Math.floor(Math.random() * 60);
                    const checkIn = new Date(date);
                    checkIn.setHours(checkInHour, checkInMin, 0);

                    // Random check-out between 17:00 and 19:00
                    const checkOutHour = 17 + Math.floor(Math.random() * 2);
                    const checkOutMin = Math.floor(Math.random() * 60);
                    const checkOut = new Date(date);
                    checkOut.setHours(checkOutHour, checkOutMin, 0);

                    await Attendance.create({
                        userId: emp.id,
                        date: dateStr,
                        checkIn: checkIn,
                        checkOut: checkOut,
                        status: "PRESENT"
                    });
                } else {
                    await Attendance.create({
                        userId: emp.id,
                        date: dateStr,
                        status: "ABSENT"
                    });
                }
            }
        }
        console.log("Attendance records created.");

        // --- Create Leaves ---
        const leaveTypes = ["PAID", "SICK", "UNPAID"];
        const leaveStatuses = ["PENDING", "APPROVED", "REJECTED"];

        for (const emp of employees) {
            // Create 2 leaves per employee
            for (let i = 0; i < 2; i++) {
                const startDate = new Date();
                startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 20)); // Future leaves

                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 3) + 1);

                await Leave.create({
                    userId: emp.id,
                    type: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0],
                    remarks: "Personal reason or sick leave",
                    status: leaveStatuses[Math.floor(Math.random() * leaveStatuses.length)]
                });
            }
        }
        console.log("Leaves created.");

        // --- Create Payroll (Last Month) ---
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const monthStr = lastMonth.toISOString().slice(0, 7); // YYYY-MM

        for (const emp of employees) {
            await Payroll.create({
                userId: emp.id,
                month: monthStr,
                basicSalary: emp.salary,
                deductions: 200, // Flat deduction for demo
                netSalary: emp.salary - 200
            });
        }
        console.log("Payroll records created.");

        console.log("Seed completed successfully!");
        process.exit(0);

    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
};

seedDatabase();
