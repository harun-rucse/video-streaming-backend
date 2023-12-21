import _ from "lodash";
import { validateUser, validateUserUpdate } from "../models/user.model.js";
import * as authService from "../services/auth.service.js";
import * as tokenService from "../services/token-service.js";
import * as userService from "../services/user-service.js";
import catchAsync from "../utils/catch-async.js";
import AppError from "../utils/app-error.js";
import ApiResponse from "../utils/api-response.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

const _generateAndSendTokens = async (statusCode, message, user, res) => {
  const { accessToken, refreshToken } = tokenService.generateTokens({ id: user._id });
  await tokenService.removeRefreshToken(user._id);
  await tokenService.storeRefreshToken(refreshToken, user._id);

  res.cookie("access_token", accessToken, cookieOptions);
  res.cookie("refresh_token", refreshToken, cookieOptions);

  const payload = _.pick(user, ["userName", "email", "fullName", "avatar", "coverImage"]);
  const data = { accessToken, refreshToken, ...payload };

  res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = catchAsync(async (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  if (!req.files?.avatar) return next(new AppError("Avatar is required", 400));

  const payload = _.pick(req.body, ["userName", "email", "fullName", "password", "avatar", "coverImage"]);
  const user = await authService.register(payload, req.files);

  _generateAndSendTokens(201, "Register successful", user, res);
});

/**
 * @desc    Login existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = catchAsync(async (req, res, next) => {
  const { userName, password } = req.body;
  if (!userName || !password) return next(new AppError("UserName and Password is required", 400));

  const user = await authService.login(userName, password);

  _generateAndSendTokens(200, "Login successful", user, res);
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = catchAsync(async (req, res, next) => {
  await tokenService.removeRefreshToken(req.user._id);

  res.clearCookie("access_token", cookieOptions);
  res.clearCookie("refresh_token", cookieOptions);

  res.status(200).json(new ApiResponse(200, {}, "Logout successful"));
});

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
 * @desc    Generate new access-token from refresh-token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
const refreshAccessToken = catchAsync(async (req, res, next) => {
  // Get refreshToken from cookie or req body
  const refreshToken = req.cookies.refresh_token || req.body.refresh_token;
  if (!refreshToken) return next(new AppError("Refresh token is required", 400));

  // Verify refreshToken
  const decoded = await tokenService.verifyRefreshToken(refreshToken);

  // Check it exits in db for this user
  const user = await userService.getOneUser({ _id: decoded.id });
  if (!user) return next(new AppError("The user belonging to this token does no longer exist", 401));

  const token = await tokenService.findRefreshToken(refreshToken, user._id);
  if (!token) return next(new AppError("Invalid refresh token", 401));

  // Generate new tokens and send
  _generateAndSendTokens(200, "Access token refreshed", user, res);
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
  const user = await authService.updateProfile(req.user._id, payload);

  res.status(200).json(new ApiResponse(200, user, "Profile update successful"));
});

/**
 * @desc    Update user password
 * @route   PATCH /api/auth/update-password
 * @access  Private
 */
const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password } = req.body;

  if (!currentPassword || !password) {
    return next(new AppError("Password is required.", 400));
  }

  const payload = _.pick(req.body, ["currentPassword", "password"]);
  const user = await authService.updatePassword(req.user._id, payload);

  _generateAndSendTokens(200, "Password update successful", user, res);
});

export { register, login, logout, getProfile, refreshAccessToken, updateProfile, updatePassword };
