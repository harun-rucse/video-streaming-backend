import Joi from "joi";
import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: String,
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpired: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Pre save hook that hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Pre save hook that add passwordChangeAt when password is changed
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000;

  next();
});

// Return true if password is correct, otherwise return false
userSchema.methods.correctPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Return true if password is changed after JWT issued
userSchema.methods.passwordChangeAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const passwordChangeTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
    return passwordChangeTimestamp > JWTTimestamp;
  }
  return false;
};

const validateUser = (user) => {
  const schema = Joi.object({
    userName: Joi.string().required().label("UserName"),
    email: Joi.string().email().required().label("Email"),
    fullName: Joi.string().required().label("FullName"),
    password: Joi.string().min(4).max(20).required().label("Password"),
    avatar: Joi.string().required().label("Avatar"),
    coverImage: Joi.string().label("CoverImage"),
  });

  return schema.validate(user);
};

const validateUserUpdate = (user) => {
  const schema = Joi.object({
    userName: Joi.string().label("UserName"),
    email: Joi.string().email().label("Email"),
    fullName: Joi.string().label("FullName"),
    avatar: Joi.string().label("Avatar"),
    coverImage: Joi.string().label("CoverImage"),
  });

  return schema.validate(user);
};

const validateUserPassword = (user) => {
  const schema = Joi.object({
    password: Joi.string().min(4).max(20).required().label("Password"),
  });

  return schema.validate(user);
};

const validateUpdatePassword = (user) => {
  const schema = Joi.object({
    passwordCurrent: Joi.string().required().label("Current Password"),
    password: Joi.string().min(4).max(20).required().label("Password"),
    passwordConfirm: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
  });

  return schema.validate(user);
};

const User = model("User", userSchema);

export { User, validateUser, validateUserUpdate, validateUserPassword, validateUpdatePassword };
