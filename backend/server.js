import dotenv from "dotenv";

dotenv.config();

import app from "./src/app.js";
import sequelize from "./src/config/db.js";


sequelize.sync().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});
