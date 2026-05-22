import cors from "cors";
import express, { type Request, type Response } from "express";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import cartRouter from "./routes/cart.js";
import categoriesRouter from "./routes/categories.js";
import collectionsRouter from "./routes/collections.js";
import eyeglassesRouter from "./routes/eyeglasses.js";
import inventoryRouter from "./routes/inventory.js";
import ordersRouter from "./routes/orders.js";
import reviewsRouter from "./routes/reviews.js";
import sunglassesRouter from "./routes/sunglasses.js";
import usersRouter from "./routes/users.js";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.js";
import {
  ALLOWED_ORIGINS,
  IS_PRODUCTION,
} from "./config/constants.js";
import { setSecurityHeaders } from "./middleware/securityHeaders.js";

const app = express();

function isCorsOriginAllowed(origin: string | undefined): boolean {
  if (origin === undefined) {
    return true;
  }

  if (ALLOWED_ORIGINS.includes(origin) === true) {
    return true;
  }

  return IS_PRODUCTION === false && ALLOWED_ORIGINS.length === 0;
}

app.disable("x-powered-by");
app.use(setSecurityHeaders);

app.use(
  cors({
    origin(origin, callback) {
      callback(null, isCorsOriginAllowed(origin));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("TypeScript Express Backend is running!");
});

app.get("/api", (req: Request, res: Response) => {
  res.send("TypeScript Express Backend is running!");
});

app.use("/api/collections", collectionsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/admin", adminRouter);
app.use("/api/eyeglasses", eyeglassesRouter);
app.use("/api/sunglasses", sunglassesRouter);
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
