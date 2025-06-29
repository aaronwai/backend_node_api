import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";
import Bootcamp from "./models/Bootcamp.js";
// import Course from "./models/Course.js";
// import User from "./models/User.js";
// import Review from "./models/Review.js";

// load env variables
dotenv.config({ path: "./config/config.env" });
const __dirname = path.resolve();
// connect to database
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(path.join(__dirname, "_data", "bootcamps.json"), "utf-8")
);
// const courses = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
// );
// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
// );
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
// );

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    // await Course.create(courses);
    // await User.create(users);
    // await Review.create(reviews);
    console.log(chalk.green.inverse("Data imported..."));
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    // await Course.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    console.log(chalk.red.inverse("Data deleted..."));
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
