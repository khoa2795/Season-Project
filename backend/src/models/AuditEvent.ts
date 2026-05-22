import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAuditEvent extends Document {
  actorUserId: Types.ObjectId;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
}

const AuditEventSchema = new Schema<IAuditEvent>(
  {
    actorUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    targetType: {
      type: String,
      required: true,
      trim: true,
    },
    targetId: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

AuditEventSchema.index({ createdAt: -1, action: 1 });
AuditEventSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

export const AuditEvent = mongoose.model<IAuditEvent>(
  "AuditEvent",
  AuditEventSchema,
);
