import mongoose, { Document, Schema } from "mongoose";

export interface IRateLimitBucket extends Document {
  scope: string;
  clientKey: string;
  count: number;
  resetAt: Date;
}

const RateLimitBucketSchema = new Schema<IRateLimitBucket>(
  {
    scope: {
      type: String,
      required: true,
      trim: true,
    },
    clientKey: {
      type: String,
      required: true,
      trim: true,
    },
    count: {
      type: Number,
      required: true,
      min: 0,
    },
    resetAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

RateLimitBucketSchema.index({ scope: 1, clientKey: 1 }, { unique: true });
RateLimitBucketSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimitBucket = mongoose.model<IRateLimitBucket>(
  "RateLimitBucket",
  RateLimitBucketSchema,
);
