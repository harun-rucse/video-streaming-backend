import globalErrorHandler from "../controllers/error.controller.js";
import AppError from "../utils/app-error.js";

const routes = (app) => {
  app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.method} ${req.originalUrl} on this server.`, 404));
  });

  app.use(globalErrorHandler);
};

export default routes;
