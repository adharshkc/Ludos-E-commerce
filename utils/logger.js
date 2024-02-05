const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

let logger;
if (process.env.NODE_ENV === 'production') {
  logger = createLogger({
    level: "info",
    format: combine(timestamp({ format: "HH:mm:ss" }), myFormat),
    transports: [new transports.Console()],
  });
} else {
  logger = createLogger({
    level: "debug",
    format: combine(
      timestamp({ format: "HH:mm:ss" }),
      myFormat,
      format.json(),

    ),
    transports: [new transports.Console()],
  });
}

module.exports = {logger};
