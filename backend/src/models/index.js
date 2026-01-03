import sequelize from "../config/db.js";
import User from "./User.js";
import Attendance from "./Attendance.js";
import Leave from "./Leave.js";
import Payroll from "./Payroll.js";

User.hasMany(Attendance, { foreignKey: "userId" });
User.hasMany(Leave, { foreignKey: "userId" });
User.hasMany(Payroll, { foreignKey: "userId" });

Attendance.belongsTo(User);
Leave.belongsTo(User);
Payroll.belongsTo(User);

export { sequelize, User, Attendance, Leave, Payroll };
