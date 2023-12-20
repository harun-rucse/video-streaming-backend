import _ from "lodash";
import { validateUser } from "../models/user.model.js";
import * as authService from "../services/auth.service.js";
import * as tokenService from "../services/token-service.js";
import * as userService from "../services/user-service.js";
import catchAsync from "../utils/catch-async.js";
import AppError from "../utils/app-error.js";
import ApiResponse from "../utils/api-response.js";

const _generateAndSendTokens = async (statusCode, message, user, res) => {
  const { accessToken, refreshToken } = tokenService.generateTokens({ id: user._id });
  await tokenService.removeRefreshToken(user._id);
  await tokenService.storeRefreshToken(refreshToken, user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  res.cookie("access_token", accessToken, options);
  res.cookie("refresh_token", refreshToken, options);

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

  const options = {
    httpOnly: true,
    secure: true,
  };

  res.clearCookie("access_token", options);
  res.clearCookie("refresh_token", options);

  res.status(200).json(new ApiResponse(200, {}, "Logout successful"));
});

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const profile = catchAsync(async (req, res, next) => {
  const user = await userService.getOneUser({ _id: req.user._id });

  const data = _.pick(user, ["userName", "email", "fullName", "avatar", "coverImage", "watchHistory"]);

  res.status(200).json(new ApiResponse(200, data));
});

export { register, login, logout, profile };
