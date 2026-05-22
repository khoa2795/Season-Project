import {
  IS_PRODUCTION,
  PASSWORD_RESET_DELIVERY_BEARER_TOKEN,
  PASSWORD_RESET_DELIVERY_WEBHOOK_URL,
  PASSWORD_RESET_URL,
} from "../config/constants.js";

export interface PasswordResetDeliveryInput {
  email: string;
  token: string;
  expiresInMinutes: number;
}

function buildResetUrl(token: string): string | null {
  if (PASSWORD_RESET_URL === undefined || PASSWORD_RESET_URL.trim() === "") {
    return null;
  }

  const resetUrl = new URL(PASSWORD_RESET_URL);
  resetUrl.searchParams.set("token", token);
  return resetUrl.toString();
}

async function postPasswordResetWebhook(
  input: PasswordResetDeliveryInput,
  resetUrl: string | null,
): Promise<void> {
  if (
    PASSWORD_RESET_DELIVERY_WEBHOOK_URL === undefined ||
    PASSWORD_RESET_DELIVERY_WEBHOOK_URL.trim() === ""
  ) {
    throw new Error("Password reset delivery webhook is not configured");
  }

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };

  if (
    PASSWORD_RESET_DELIVERY_BEARER_TOKEN !== undefined &&
    PASSWORD_RESET_DELIVERY_BEARER_TOKEN.trim() !== ""
  ) {
    headers.authorization = `Bearer ${PASSWORD_RESET_DELIVERY_BEARER_TOKEN}`;
  }

  const response = await fetch(PASSWORD_RESET_DELIVERY_WEBHOOK_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: input.email,
      token: input.token,
      resetUrl,
      expiresInMinutes: input.expiresInMinutes,
    }),
    signal: AbortSignal.timeout(5_000),
  });

  if (response.ok === false) {
    throw new Error(`Password reset delivery webhook failed with ${response.status}`);
  }
}

export async function deliverPasswordReset(
  input: PasswordResetDeliveryInput,
): Promise<void> {
  const resetUrl = buildResetUrl(input.token);

  if (
    PASSWORD_RESET_DELIVERY_WEBHOOK_URL !== undefined &&
    PASSWORD_RESET_DELIVERY_WEBHOOK_URL.trim() !== ""
  ) {
    await postPasswordResetWebhook(input, resetUrl);
    return;
  }

  if (IS_PRODUCTION === true) {
    throw new Error("Password reset delivery is not configured");
  }

  const resetTarget = resetUrl ?? `token=${input.token}`;
  console.info(`[password-reset] ${input.email}: ${resetTarget}`);
}
