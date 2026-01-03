import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  employeeId: DataTypes.STRING,
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  role: {
    type: DataTypes.ENUM("ADMIN", "EMPLOYEE"),
    defaultValue: "EMPLOYEE"
  },
  phone: DataTypes.STRING,
  address: DataTypes.TEXT,
  salary: DataTypes.FLOAT,
  profileImage: DataTypes.STRING,
  documents: DataTypes.TEXT, // JSON string of document URLs
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
});

export default User;
