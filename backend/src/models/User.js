import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  employeeId: DataTypes.STRING,
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  role: DataTypes.ENUM("ADMIN", "EMPLOYEE"),
  phone: DataTypes.STRING,
  address: DataTypes.TEXT,
  salary: DataTypes.FLOAT,
  profileImage: DataTypes.STRING,
  isVerified: DataTypes.BOOLEAN,
});

export default User;
