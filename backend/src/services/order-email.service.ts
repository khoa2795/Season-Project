import nodemailer, { type Transporter } from "nodemailer";
import { render } from "@react-email/render";
import {
  GMAIL_USER,
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
} from "../config/constants.js";
import type { IOrder } from "../models/order.model.js";
import { OrderConfirmationEmail } from "./order-confirmation-email.js";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (
    GMAIL_USER === undefined ||
    GMAIL_USER === "" ||
    GMAIL_CLIENT_ID === undefined ||
    GMAIL_CLIENT_ID === "" ||
    GMAIL_CLIENT_SECRET === undefined ||
    GMAIL_CLIENT_SECRET === "" ||
    GMAIL_REFRESH_TOKEN === undefined ||
    GMAIL_REFRESH_TOKEN === ""
  ) {
    return null;
  }

  transporter ??= nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: GMAIL_USER,
      clientId: GMAIL_CLIENT_ID,
      clientSecret: GMAIL_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
    },
  });

  return transporter;
}

export async function sendOrderConfirmationEmail(
  order: IOrder,
  mailTransporter: Transporter | null = getTransporter(),
): Promise<void> {
  if (mailTransporter === null) {
    console.warn(
      "Skipping order confirmation email because Gmail OAuth2 config is not configured.",
    );
    return;
  }

  if (order.customerEmail === undefined || order.customerEmail.trim() === "") {
    console.warn(`Skipping order confirmation email for order ${order._id}`);
    return;
  }

  try {
    const html = await render(OrderConfirmationEmail({ order }));

    await mailTransporter.sendMail({
      from: `Season <${GMAIL_USER}>`,
      to: order.customerEmail.trim(),
      subject: `Order confirmation ${order._id.toString()}`,
      html,
    });
  } catch (error) {
    const message =
      error instanceof Error && error.message.trim() !== ""
        ? error.message
        : "unknown mail transport error";

    throw new Error(
      `Failed to send order confirmation email for order ${order._id.toString()}: ${message}`,
    );
  }
}
