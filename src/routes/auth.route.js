import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { uploadRegisterImages } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", uploadRegisterImages, authController.register);

export default router;
