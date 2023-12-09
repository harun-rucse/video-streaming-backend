import { promisify } from "util";
import jwt from "jsonwebtoken";
import { Token } from "../models/token.model.js";

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = (token, user_id) => {
  const newtoken = new Token({ token, user: user_id });
  return newtoken.save();
};

const verifyAccessToken = (token) => {
  return promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = (token) => {
  return promisify(jwt.verify)(token, process.env.REFRESH_TOKEN_SECRET);
};

export { generateTokens, storeRefreshToken, verifyAccessToken, verifyRefreshToken };
