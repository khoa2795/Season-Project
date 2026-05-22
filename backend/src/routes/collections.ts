import { Router } from "express";
import {
  getCollectionFilters,
  getCollectionProducts,
} from "../controllers/collectionsController.js";
import { validateCollectionProductsQuery } from "../middleware/validation.js";

const router = Router();

router.get("/:slug/products", validateCollectionProductsQuery, getCollectionProducts);
router.get("/", getCollectionFilters);

export default router;
