import express from "express";
import {
  getProduct,
  getProducts,
} from "../controllers/productsController.js";
import { validateProductQuery } from "../middleware/validation.js";

const router = express.Router();

router.get("/", validateProductQuery, getProducts);
router.get("/:id", getProduct);

export default router;
