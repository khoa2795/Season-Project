import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { updateOrderStatus } from "../controllers/orderController.js";
import {
  deleteAdminReview,
  getAdminOrder,
  getAdminOverview,
  getAdminTopProducts,
  getAdminUser,
  listAdminOrders,
  listAdminUsers,
  toggleAdminUserStatus,
} from "../controllers/adminController.js";
import {
  getAdminInventory,
  listAdminInventory,
  updateAdminInventory,
} from "../controllers/inventoryController.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";
import {
  validateCategoryIdParam,
  validateCreateCategoryBody,
  validateUpdateCategoryBody,
} from "../middleware/categoryValidation.js";
import {
  validateOrderIdParam,
  validateOrderListQuery,
  validateOrderStatusUpdate,
} from "../middleware/orderValidation.js";
import {
  validateInventoryListQuery,
  validateInventorySkuParam,
  validateInventoryStockBody,
} from "../middleware/inventoryValidation.js";
import { validateUserIdParam } from "../middleware/userValidation.js";
import { validateReviewIdParam } from "../middleware/reviewValidation.js";
import { validateTopProductsQuery } from "../middleware/adminValidation.js";

const router = Router();

router.use(requireAuth, requireAdmin);
router.post("/categories", validateCreateCategoryBody, createCategory);
router.patch(
  "/categories/:categoryId",
  validateCategoryIdParam,
  validateUpdateCategoryBody,
  updateCategory,
);
router.delete(
  "/categories/:categoryId",
  validateCategoryIdParam,
  deleteCategory,
);
router.patch(
  "/orders/:orderId/status",
  validateOrderStatusUpdate,
  updateOrderStatus,
);
router.get("/users", listAdminUsers);
router.get("/users/:userId", validateUserIdParam, getAdminUser);
router.put(
  "/users/:userId/toggle-status",
  validateUserIdParam,
  toggleAdminUserStatus,
);
router.get("/orders", validateOrderListQuery, listAdminOrders);
router.get("/orders/:orderId", validateOrderIdParam, getAdminOrder);
router.put(
  "/orders/:orderId/status",
  validateOrderStatusUpdate,
  updateOrderStatus,
);
router.delete(
  "/reviews/:reviewId",
  validateReviewIdParam,
  deleteAdminReview,
);
router.get("/inventory", validateInventoryListQuery, listAdminInventory);
router.get("/inventory/:sku", validateInventorySkuParam, getAdminInventory);
router.put(
  "/inventory/:sku",
  validateInventorySkuParam,
  validateInventoryStockBody,
  updateAdminInventory,
);
router.get("/stats/top-products", validateTopProductsQuery, getAdminTopProducts);
router.get("/stats/overview", getAdminOverview);

export default router;
