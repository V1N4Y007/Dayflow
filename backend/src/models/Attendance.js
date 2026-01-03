import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Attendance = sequelize.define("Attendance", {
  date: DataTypes.DATEONLY,
  checkIn: DataTypes.TIME,
  checkOut: DataTypes.TIME,
  status: DataTypes.ENUM("PRESENT", "ABSENT", "HALF_DAY", "LEAVE"),
});

export default Attendance;
