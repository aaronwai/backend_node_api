import morgan from "morgan";
import chalk from "chalk";

export const coloredMorgan = () => {
  const methodColor = (method) => {
    switch (method) {
      case "GET":
        return chalk.green.bold(method);
      case "POST":
        return chalk.yellow.bold(method);
      case "PUT":
        return chalk.blue.bold(method);
      case "DELETE":
        return chalk.red.bold(method);
      case "PATCH":
        return chalk.magenta.bold(method);
      default:
        return chalk.cyan.bold(method);
    }
  };

  const statusColor = (status) => {
    if (!status) return chalk.gray("???");
    if (status >= 500) return chalk.red(status);
    if (status >= 400) return chalk.yellow(status);
    if (status >= 300) return chalk.cyan(status);
    return chalk.green(status);
  };

  return morgan((tokens, req, res) => {
    return [
      chalk.gray(`[${new Date().toISOString()}]`),
      methodColor(tokens.method(req, res)),
      chalk.white(tokens.url(req, res)),
      statusColor(tokens.status(req, res)),
      chalk.gray(`${tokens["response-time"](req, res)}ms`),
      chalk.gray(`- ${tokens.res(req, res, "content-length") || "0"}b`),
    ].join(" ");
  });
};
