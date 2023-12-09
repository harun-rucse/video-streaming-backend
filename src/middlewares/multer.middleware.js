import multer from "multer";
import AppError from "../utils/app-error.js";

const multerStorage = multer.memoryStorage();

const multerImageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload an image.", 400), false);
  }
};

const multerVideoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an video! Please upload an video.", 400), false);
  }
};

const uploadImage = multer({
  storage: multerStorage,
  fileFilter: multerImageFilter,
});

const uploadVideo = multer({
  storage: multerStorage,
  fileFilter: multerVideoFilter,
});

const uploadRegisterImages = uploadImage.fields([
  {
    name: "avatar",
    maxCount: 1,
  },
  {
    name: "coverImage",
    maxCount: 1,
  },
]);

export { uploadImage, uploadVideo, uploadRegisterImages };
