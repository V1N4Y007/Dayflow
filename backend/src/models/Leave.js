import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Leave = sequelize.define("Leave", {
  type: DataTypes.ENUM("PAID", "SICK", "UNPAID"),
  startDate: DataTypes.DATEONLY,
  endDate: DataTypes.DATEONLY,
  remarks: DataTypes.TEXT,
  status: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
  adminComment: DataTypes.TEXT,
});

export default Leave;
