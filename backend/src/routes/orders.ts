import { Router } from "express";
import {
  cancelOrder,
  checkout,
  getOrder,
  listOrders,
} from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  validateCheckoutBody,
  validateCreateOrderBody,
  validateOrderIdParam,
  validateOrderListQuery,
} from "../middleware/orderValidation.js";

const router = Router();

router.post("/", requireAuth, validateCreateOrderBody, checkout);
router.get("/", requireAuth, validateOrderListQuery, listOrders);
router.put("/:orderId/cancel", requireAuth, validateOrderIdParam, cancelOrder);
router.get("/:orderId", requireAuth, validateOrderIdParam, getOrder);
router.post("/checkout", requireAuth, validateCheckoutBody, checkout);

export default router;
