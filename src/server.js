import path from "path";
import dotenv from "dotenv";
import logger from "./logger/index.js";
dotenv.config({ path: path.resolve(`.env.${process.env.NODE_ENV}`) });

process.on("uncaughtException", () => {
  logger.on("error", () => {
    process.exit(1);
  });
});

import app from "./app.js";
import connectDB from "./bootstrap/database.js";

connectDB().then((connectionInstance) => {
  logger.info(`DB host [${connectionInstance.connection.host}] connection successful!`);
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`API is listening in [${process.env.NODE_ENV}] on port ${PORT}`);
});

process.on("unhandledRejection", () => {
  logger.on("error", () => {
    server.close(() => {
      process.exit(1);
    });
  });
});
