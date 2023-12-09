import { Schema, model } from "mongoose";

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Token = model("Token", tokenSchema);
