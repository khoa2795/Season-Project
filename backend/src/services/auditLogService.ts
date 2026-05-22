import { Types } from "mongoose";
import { AuditEvent } from "../models/AuditEvent.js";

export interface AdminAuditEventInput {
  actorUserId: string | undefined;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
}

export async function recordAdminAuditEvent(
  input: AdminAuditEventInput,
): Promise<void> {
  if (input.actorUserId === undefined) {
    console.error(`Admin audit event ${input.action} is missing actorUserId`);
    return;
  }

  try {
    await AuditEvent.create({
      actorUserId: new Types.ObjectId(input.actorUserId),
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      ...(input.metadata === undefined ? {} : { metadata: input.metadata }),
    });
  } catch (error) {
    console.error("Failed to write admin audit event:", error);
  }
}
