import { User } from "../models/user.model.js";

const getOneUser = (filter) => {
  return User.findOne(filter);
};

const createNewUser = (payload) => {
  const user = new User(payload);

  return user.save();
};

const updateOneUser = (filter, payload) => {
  return User.findOneAndUpdate(filter, payload, { new: true });
};

export { getOneUser, createNewUser, updateOneUser };
