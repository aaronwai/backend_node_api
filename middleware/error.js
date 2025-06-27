import chalk from "chalk";
const errorHandler = (err, req, res, next) => {
  // log to console for dev
  console.log(chalk.red(err.stack));

  res.status(500).json({
    success: false,
    error: err.message,
  });
};

export default errorHandler;
