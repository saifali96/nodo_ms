const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const winston = require("winston");

const { PORT, MS_CUSTOMER_URL, MS_PRODUCTS_URL, MS_SHOPPING_URL } = require("./config");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "gateway", timestamp: new Date().toISOString() },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Log errors with `logger.error()`
// Log info/debug with `logger.info()`

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Proxy logger
const proxyLogger = (req, res, next) => {
	req.metaUser = { userID: "saif", "userType": "admin" };
	logger.info(`Req to MS_PRODUCTS: ${req}`);
	console.log(req);
	next();
}

const app = express();

app.use(cors());
app.use(express.json());

app.use("/customer", proxy(MS_CUSTOMER_URL));
app.use("/products", proxy(MS_PRODUCTS_URL));
app.use("/shopping", proxy(MS_SHOPPING_URL));

app.listen(PORT, () => {
	logger.info(`Gateway is listening on port ${PORT}.`);
});