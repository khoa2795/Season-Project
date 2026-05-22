import assert from "node:assert/strict";
import test from "node:test";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import app from "../app.js";
import adminRouter from "./admin.js";
import categoriesRouter from "./categories.js";
import ordersRouter from "./orders.js";

interface RouteLayer {
  handle: { name: string };
  name: string;
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
}

function routerLayers(router: unknown): RouteLayer[] {
  return (router as { stack: RouteLayer[] }).stack;
}

function routeEntries(router: unknown): string[] {
  return routerLayers(router)
    .filter((layer) => layer.route !== undefined)
    .flatMap((layer) => {
      const route = layer.route;

      if (route === undefined) {
        return [];
      }

      return Object.entries(route.methods)
        .filter(([, enabled]) => enabled === true)
        .map(([method]) => `${method.toUpperCase()} ${route.path}`);
    });
}

test("admin router installs auth and admin guards before admin routes", () => {
  const layers = routerLayers(adminRouter);
  const firstAdminRouteIndex = layers.findIndex(
    (layer) => layer.route !== undefined,
  );

  assert.equal(firstAdminRouteIndex, 2);
  assert.equal(layers[0]?.handle.name, "requireAuth");
  assert.equal(layers[1]?.handle.name, "requireAdmin");
});

test("admin and compatibility routers expose the documented route map", () => {
  assert.deepEqual(routeEntries(adminRouter), [
    "POST /categories",
    "PATCH /categories/:categoryId",
    "DELETE /categories/:categoryId",
    "PATCH /orders/:orderId/status",
    "GET /users",
    "GET /users/:userId",
    "PUT /users/:userId/toggle-status",
    "GET /orders",
    "GET /orders/:orderId",
    "PUT /orders/:orderId/status",
    "DELETE /reviews/:reviewId",
    "GET /inventory",
    "GET /inventory/:sku",
    "PUT /inventory/:sku",
    "GET /stats/top-products",
    "GET /stats/overview",
  ]);
  assert.deepEqual(routeEntries(categoriesRouter), [
    "GET /",
    "GET /slug/:slug",
    "GET /:categoryId",
    "POST /",
    "PUT /:categoryId",
    "DELETE /:categoryId",
  ]);
  assert.deepEqual(routeEntries(ordersRouter), [
    "POST /",
    "GET /",
    "PUT /:orderId/cancel",
    "GET /:orderId",
    "POST /checkout",
  ]);
});

test("admin mutation endpoints reject missing auth and v1 aliases are closed", async () => {
  const server = app.listen(0);

  try {
    await once(server, "listening");
    const address = server.address() as AddressInfo;
    const adminResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/admin/orders/507f1f77bcf86cd799439011/status`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ status: "delivered" }),
      },
    );
    const v1AdminResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/v1/admin/orders/507f1f77bcf86cd799439011/status`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ status: "delivered" }),
      },
    );

    assert.equal(adminResponse.status, 401);
    assert.equal(v1AdminResponse.status, 404);
  } finally {
    server.close();
    await once(server, "close");
  }
});
