import Joi from "joi";
import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

videoSchema.plugin(mongooseAggregatePaginate);

const validateVideo = (video) => {
  const schema = Joi.object({
    title: Joi.string().required().label("Title"),
    description: Joi.string().required().label("Description"),
    isPublished: Joi.boolean().label("IsPublished"),
  });

  return schema.validate(video);
};

const validateVideoUpdate = (video) => {
  const schema = Joi.object({
    title: Joi.string().label("Title"),
    description: Joi.string().label("Description"),
    isPublished: Joi.boolean().label("IsPublished"),
  });

  return schema.validate(video);
};

const Video = model("Video", videoSchema);

export { Video, validateVideo, validateVideoUpdate };
