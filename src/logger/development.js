import { createLogger, format, transports } from "winston";

const customFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const developmentLogger = createLogger({
  level: "info",
  format: format.json(),
  defaultMeta: { service: "video-streaming-api" },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "HH:mm:ss" }),
        customFormat
      ),
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});

export default developmentLogger;
