import assert from "node:assert/strict";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import test from "node:test";
import express from "express";
import { Router } from "express";
import { AppError } from "../errors/AppError.js";
import { globalErrorHandler } from "./errorHandler.js";
import {
  validateAddCartItemBody,
  validateCartProductParam,
} from "./cartValidation.js";
import {
  validateRegisterBody,
  validateResetPasswordBody,
} from "./authValidation.js";
import { validateCategoryIdParam } from "./categoryValidation.js";
import { validateOrderStatusUpdate } from "./orderValidation.js";

interface ErrorJson {
  success: false;
  error: {
    statusCode: number;
    code: string;
    message: string;
  };
}

async function listenValidationApp(): Promise<{
  baseUrl: string;
  close(): Promise<void>;
}> {
  const app = express();
  const router = Router();

  app.use(express.json());
  router.post("/cart/items", validateAddCartItemBody, (_req, res) => {
    res.status(204).end();
  });
  router.post("/auth/register", validateRegisterBody, (_req, res) => {
    res.status(204).end();
  });
  router.post(
    "/auth/reset-password",
    validateResetPasswordBody,
    (_req, res) => {
      res.status(204).end();
    },
  );
  router.patch(
    "/cart/items/:productId",
    validateCartProductParam,
    (_req, res) => {
      res.status(204).end();
    },
  );
  router.get(
    "/categories/:categoryId",
    validateCategoryIdParam,
    (_req, res) => {
      res.status(204).end();
    },
  );
  router.patch(
    "/admin/orders/:orderId/status",
    validateOrderStatusUpdate,
    (_req, res) => {
      res.status(204).end();
    },
  );
  app.use(router);
  app.use((_req, _res, next) => {
    next(AppError.notFound("Test route not found"));
  });
  app.use(globalErrorHandler);

  const server = app.listen(0);
  await once(server, "listening");
  const address = server.address() as AddressInfo;

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    async close(): Promise<void> {
      server.close();
      await once(server, "close");
    },
  };
}

async function readErrorJson(response: Response): Promise<ErrorJson> {
  return (await response.json()) as ErrorJson;
}

test("validation middleware returns normalized 400 for malformed ids and body types", async () => {
  const app = await listenValidationApp();

  try {
    const badCartBody = await fetch(`${app.baseUrl}/cart/items`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        productId: "507f1f77bcf86cd799439011",
        quantity: "abc",
      }),
    });
    const badCartParam = await fetch(`${app.baseUrl}/cart/items/not-an-id`, {
      method: "PATCH",
    });
    const badCategoryParam = await fetch(
      `${app.baseUrl}/categories/not-an-id`,
    );
    const badOrderParam = await fetch(
      `${app.baseUrl}/admin/orders/not-an-id/status`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ status: "delivered" }),
      },
    );

    assert.equal(badCartBody.status, 400);
    assert.equal((await readErrorJson(badCartBody)).error.message, "quantity must be a positive integer");
    assert.equal(badCartParam.status, 400);
    assert.equal((await readErrorJson(badCartParam)).error.message, "productId must be a valid ObjectId");
    assert.equal(badCategoryParam.status, 400);
    assert.equal((await readErrorJson(badCategoryParam)).error.message, "categoryId is invalid");
    assert.equal(badOrderParam.status, 400);
    assert.equal((await readErrorJson(badOrderParam)).error.message, "orderId is invalid");
  } finally {
    await app.close();
  }
});

test("auth validation rejects passwords that bcrypt would truncate", async () => {
  const app = await listenValidationApp();
  const longPassword = "a".repeat(73);

  try {
    const badRegisterPassword = await fetch(`${app.baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: "person@example.com",
        name: "Long Password",
        password: longPassword,
      }),
    });
    const badResetPassword = await fetch(
      `${app.baseUrl}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          token: "test-token",
          newPassword: longPassword,
        }),
      },
    );

    assert.equal(badRegisterPassword.status, 400);
    assert.match(
      (await readErrorJson(badRegisterPassword)).error.message,
      /72 UTF-8 bytes/,
    );
    assert.equal(badResetPassword.status, 400);
    assert.match(
      (await readErrorJson(badResetPassword)).error.message,
      /72 UTF-8 bytes/,
    );
  } finally {
    await app.close();
  }
});
