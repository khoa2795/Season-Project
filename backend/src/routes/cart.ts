import { Router } from "express";
import {
  addCartItem,
  addCartSkuItem,
  clearCart,
  getCart,
  removeCartItem,
  removeCartSkuItem,
  updateCartItem,
  updateCartSkuItem,
} from "../controllers/cartController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  validateAddCartItemBody,
  validateAddCartSkuBody,
  validateCartProductParam,
  validateCartSkuParam,
  validateUpdateCartItemBody,
  validateUpdateCartSkuBody,
} from "../middleware/cartValidation.js";

const cartRouter = Router();

cartRouter.use(requireAuth);
cartRouter.get("/", getCart);
cartRouter.post("/", validateAddCartSkuBody, addCartSkuItem);
cartRouter.put(
  "/:sku",
  validateCartSkuParam,
  validateUpdateCartSkuBody,
  updateCartSkuItem,
);
cartRouter.delete("/:sku", validateCartSkuParam, removeCartSkuItem);
cartRouter.delete("/", clearCart);
cartRouter.post("/items", validateAddCartItemBody, addCartItem);
cartRouter.patch(
  "/items/:productId",
  validateCartProductParam,
  validateUpdateCartItemBody,
  updateCartItem,
);
cartRouter.delete(
  "/items/:productId",
  validateCartProductParam,
  removeCartItem,
);

export default cartRouter;
