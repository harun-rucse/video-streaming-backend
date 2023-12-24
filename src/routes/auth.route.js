import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { uploadRegisterImages } from "../middlewares/multer.middleware.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", uploadRegisterImages, authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshAccessToken);

router.use(auth);
router.post("/logout", authController.logout);
router.patch("/update-password", authController.updatePassword);

export default router;
