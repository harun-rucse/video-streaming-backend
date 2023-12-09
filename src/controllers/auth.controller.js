import _ from "lodash";
import { validateUser } from "../models/user.model.js";
import * as authService from "../services/auth.service.js";
import * as tokenService from "../services/token-service.js";
import catchAsync from "../utils/catch-async.js";
import AppError from "../utils/app-error.js";

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

  const { accessToken, refreshToken } = tokenService.generateTokens({ id: user._id });
  await tokenService.storeRefreshToken(refreshToken, user._id);

  res.cookie("access_token", accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
  });

  res.cookie("refresh_token", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
  });

  const data = _.pick(user, ["userName", "email", "fullName", "avatar", "coverImage"]);

  res.status(201).json(data);
});

export { register };
