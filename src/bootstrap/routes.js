import globalErrorHandler from "../controllers/error.controller.js";
import AppError from "../utils/app-error.js";
import authRouter from "../routes/auth.route.js";
import userRouter from "../routes/user.route.js";

const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);

  app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.method} ${req.originalUrl} on this server.`, 404));
  });

  app.use(globalErrorHandler);
};

export default routes;
