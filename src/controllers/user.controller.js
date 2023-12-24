import _ from "lodash";
import { validateUserUpdate } from "../models/user.model.js";
import * as userService from "../services/user-service.js";
import catchAsync from "../utils/catch-async.js";
import AppError from "../utils/app-error.js";
import ApiResponse from "../utils/api-response.js";
import { uploadOnCloud, deleteFromCloud } from "../utils/cloudinary.js";

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = catchAsync(async (req, res, next) => {
  const user = await userService.getOneUser({ _id: req.user._id });

  const data = _.pick(user, ["userName", "email", "fullName", "avatar", "coverImage", "watchHistory"]);

  res.status(200).json(new ApiResponse(200, data));
});

/**
 * @desc    Update user profile
 * @route   PATCH /api/users/profile
 * @access  Private
 */
const updateProfile = catchAsync(async (req, res, next) => {
  const { error } = validateUserUpdate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const payload = _.pick(req.body, ["userName", "email", "fullName"]);
  if (Object.keys(payload).length === 0) return next(new AppError("At least one information is required", 400));

  const user = await userService.updateOneUser({ _id: req.user._id }, payload);

  res.status(200).json(new ApiResponse(200, user, "Profile update successful"));
});

/**
 * @desc    Change user avatar
 * @route   PATCH /api/users/avatar
 * @access  Private
 */
const updateAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError("Avatar is required", 400));

  // Upload avatar to cloud
  const result = await uploadOnCloud(req.file.buffer, "users");
  if (!result) return next(new AppError("Avatar upload failed! Please try again.", 400));

  // Delete previous avatar from cloud
  await deleteFromCloud(req.user.avatar);

  const user = await userService.updateOneUser({ _id: req.user._id }, { avatar: result.url });

  res.status(200).json(new ApiResponse(200, user, "Avatar update successful"));
});

/**
 * @desc    Change user cover image
 * @route   PATCH /api/users/cover-image
 * @access  Private
 */
const updateCoverImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError("Cover image is required", 400));

  // Upload avatar to cloud
  const result = await uploadOnCloud(req.file.buffer, "users");
  if (!result) return next(new AppError("Cover image upload failed! Please try again.", 400));

  // Delete previous avatar from cloud
  if (req.user.coverImage) await deleteFromCloud(req.user.coverImage);

  const user = await userService.updateOneUser({ _id: req.user._id }, { coverImage: result.url });

  res.status(200).json(new ApiResponse(200, user, "Cover image update successful"));
});

export { getProfile, updateProfile, updateAvatar, updateCoverImage };
