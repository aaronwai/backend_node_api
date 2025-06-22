import express from "express";
import dotenv from "dotenv";

import bootcamps from "./routes/bootcamps.js";
// load env variables
dotenv.config({ path: "./config/config.env" });
const app = express();

// mount routers
app.use("/api/v1/bootcamps", bootcamps);
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
