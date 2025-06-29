import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bootcamps from "./routes/bootcamps.js";
import { coloredMorgan } from "./middleware/morganConfig.js";
import errorHandler from "./middleware/error.js";
// load env variables
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();

const app = express();

// body parser
app.use(express.json());
// add middleware

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(coloredMorgan());
}

// mount routers
app.use("/api/v1/bootcamps", bootcamps);

// error handler
app.use(errorHandler);
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections in case mongoose fails
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
