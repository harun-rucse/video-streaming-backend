import _ from "lodash";
import { validateUserUpdate } from "../models/user.model.js";
import * as userService from "../services/user-service.js";
import catchAsync from "../utils/catch-async.js";
import AppError from "../utils/app-error.js";
import ApiResponse from "../utils/api-response.js";

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = catchAsync(async (req, res, next) => {
  const user = await userService.getOneUser({ _id: req.user._id });

  const data = _.pick(user, ["userName", "email", "fullName", "avatar", "coverImage", "watchHistory"]);

  res.status(200).json(new ApiResponse(200, data));
});

/**
 * @desc    Update user profile
 * @route   PATCH /api/auth/profile
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

export { getProfile, updateProfile };
