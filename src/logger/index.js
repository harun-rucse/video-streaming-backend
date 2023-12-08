import developmentLogger from "./development.js";
import productionLogger from "./production.js";

const logger = process.env.NODE_ENV === "development" ? developmentLogger : productionLogger;

export default logger;
