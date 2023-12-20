import * as userService from "../services/user-service.js";
import * as tokenService from "../services/token-service.js";
import AppError from "../utils/app-error.js";
import catchAsync from "../utils/catch-async.js";

const auth = catchAsync(async (req, _, next) => {
  // 1) Getting token from cookies or request header
  const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return next(new AppError("You are not logged in!", 401));

  // 2) Verify access token
  const decoded = await tokenService.verifyAccessToken(token);

  // 3) Check if user still exists
  const currentUser = await userService.getOneUser({ _id: decoded.id });
  if (!currentUser) {
    return next(new AppError("The user belonging to this token does no longer exist.", 401));
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.passwordChangeAfter(decoded.iat)) {
    return next(new AppError("User recently changed password! Please log in again.", 401));
  }

  // Access protected route
  req.user = currentUser;

  next();
});

export { auth };
