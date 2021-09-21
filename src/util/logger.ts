import winston from "winston";
import expressWinston from "express-winston";

const transports = [
    new winston.transports.Console({
      level: "debug"
    }),
    new winston.transports.File({
      filename: "debug.log",
      level: "debug" })
  ];

const options: winston.LoggerOptions = {
    transports
};

export const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
}

export const requestLogger = expressWinston.logger({
    transports,
    format: winston.format.combine(
      winston.format.json()
    ),
    expressFormat: true,
    colorize: false,
    level: "info"
  });
  
export const expressErrorLogger = expressWinston.errorLogger({
transports,
format: winston.format.combine(
    winston.format.json()
),
msg: "{{err.message}} {{res.statusCode}} {{req.method}} with error: {{err}} and request: {{req}} and response: {{res}}"
});

export default logger;
