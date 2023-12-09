import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Upload file to the cloudinary cloud
const uploadOnCloud = async (buffer, folder) => {
  // Configure cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
  });

  return new Promise((resolve, reject) => {
    const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(cloudinaryUploadStream);
  });
};

export { uploadOnCloud };
