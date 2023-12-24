import express from "express";
import * as userController from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.use(auth);
router.get("/profile", userController.getProfile);
router.patch("/profile", userController.updateProfile);
router.patch("/avatar", uploadImage.single("avatar"), userController.updateAvatar);
router.patch("/cover-image", uploadImage.single("coverImage"), userController.updateCoverImage);

export default router;
