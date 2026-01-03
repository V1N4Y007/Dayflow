import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Payroll = sequelize.define("Payroll", {
  month: DataTypes.STRING,
  basicSalary: DataTypes.FLOAT,
  deductions: DataTypes.FLOAT,
  netSalary: DataTypes.FLOAT,
});

export default Payroll;
