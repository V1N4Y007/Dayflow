import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Leave = sequelize.define("Leave", {
  type: DataTypes.ENUM("PAID", "SICK", "UNPAID"),
  startDate: DataTypes.DATEONLY,
  endDate: DataTypes.DATEONLY,
  remarks: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
    defaultValue: "PENDING"
  },
  adminComment: DataTypes.TEXT,
});

export default Leave;
