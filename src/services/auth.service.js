import * as userService from "./user-service.js";
import AppError from "../utils/app-error.js";
import { uploadOnCloud } from "../utils/cloudinary.js";

const register = async (payload, files) => {
  // check if userName or email is already exists
  const isExists = await userService.getOneUser({ $or: [{ email: payload.email }, { userName: payload.userName }] });
  if (isExists) {
    throw new AppError("Username or Email is already exists.", 400);
  }

  // Upload avatar image
  if (files?.avatar[0]) {
    const result = await uploadOnCloud(files.avatar[0].buffer, "users");
    payload["avatar"] = result.url;
  }

  // Upload cover image
  if (files?.coverImage && Array.isArray(files.coverImage) && files.coverImage.length > 0) {
    const result = await uploadOnCloud(files.coverImage[0].buffer, "users");
    payload["coverImage"] = result.url;
  }

  const user = await userService.createNewUser(payload);

  return user;
};

const login = async (userName, password) => {
  const user = await userService.getOneUser({ $or: [{ userName }, { email: userName }] }).select("+password");
  const isMatch = await user?.correctPassword(password, user.password);

  if (!isMatch) {
    throw new AppError("Incorrect login credential.", 401);
  }

  return user;
};

const updatePassword = async (id, payload) => {
  const user = await userService.getOneUser({ _id: id }).select("+password");
  const isMatch = await user?.correctPassword(payload.currentPassword, user.password);

  if (!isMatch) {
    throw new AppError("Incorrect old password.", 401);
  }

  user.password = payload.password;
  await user.save({ validateBeforeSave: false });

  return user;
};

export { register, login, updatePassword };
