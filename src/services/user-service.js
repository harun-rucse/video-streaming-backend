import { User } from "../models/user.model.js";

const getOneUser = (filter) => {
  return User.findOne(filter);
};

const createNewUser = (payload) => {
  const user = new User(payload);

  return user.save();
};

export { getOneUser, createNewUser };
