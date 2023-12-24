import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { extractPublicId } from "cloudinary-build-url";

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

// Delete file from Cloudinary based on the public ID in the URL
const deleteFromCloud = async (cloudinaryUrl) => {
  // Extract public ID from the Cloudinary URL
  const publicId = extractPublicId(cloudinaryUrl);

  // Call Cloudinary API to delete the file
  try {
    const deletionResult = await cloudinary.uploader.destroy(publicId);
    return deletionResult;
  } catch (error) {
    throw error;
  }
};

export { uploadOnCloud, deleteFromCloud };
