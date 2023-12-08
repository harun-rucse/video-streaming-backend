import express from "express";
import globalMiddleware from "./bootstrap/global-middleware.js";
import routes from "./bootstrap/routes.js";

const app = express();

globalMiddleware(app);
routes(app);

export default app;
