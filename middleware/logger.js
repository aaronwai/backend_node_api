import chalk from "chalk";

// @desc Middleware logger request to console
export const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const methodColor = {
    GET: chalk.green,
    POST: chalk.yellow,
    PUT: chalk.blue,
    DELETE: chalk.red,
    PATCH: chalk.magenta,
    default: chalk.cyan,
  };

  // Get color based on request method or use default
  // Get the appropriate chalk function or use cyan as default
  const colorFn = methodColor[req.method] || chalk.cyan;

  // Format and log request information
  console.log(
    `[${timestamp}] ${colorFn(req.method)} ${req.protocol}://${req.get(
      "host"
    )}${req.originalUrl}`
  );
  next();
};
