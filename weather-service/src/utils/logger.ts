import { format } from "date-fns";
import winston from "winston";
import { config } from "../config";
import { LogType } from "../types";

const custom = {
  levels: {
    crit: LogType.Fatal,
    error: LogType.Error,
    warn: LogType.Warn,
    info: LogType.Info,
    debug: LogType.Debug,
    verbose: LogType.Verbose,
  },
  colors: {
    crit: "red",
    error: "red",
    warn: "orange",
    info: "yellow",
    verbose: "blue",
    debug: "gray",
  },
};

winston.addColors(custom.colors);

console.log("Starting logger ....");
export const logger = winston.createLogger({
  levels: custom.levels,

  transports: [
    new winston.transports.Console({
      level: "verbose",
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.printf((msg) =>
          config.log.colorizeConsoleLogs
            ? winston.format.colorize().colorize(msg.level, `${msg.message}`)
            : `${msg.level}  ${msg.message}`,
        ),
      ),
    }),
    new winston.transports.File({
      filename: config.log.errorFile,
      maxsize: config.log.maxSize,
      level: "error",
      format: winston.format.printf(
        (info) =>
          `${format(Date.now(), "dd-HH:mm:ss.SS")}  ${info.level}\t${
            info.message
          }`,
      ),
    }),
    new winston.transports.File({
      filename: config.log.infoFile,
      maxsize: config.log.maxSize,
      level: "debug",
      format: winston.format.printf(
        (info) =>
          `${format(Date.now(), "dd-HH:mm:ss.SS")}  ${info.level}\t${
            info.message
          }`,
      ),
    }),
    new winston.transports.Http({
      host: "localhost",
      port: config.log.httpPort,
    }),
  ],
});
