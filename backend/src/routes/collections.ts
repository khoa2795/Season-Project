import { Router } from "express";
import { getCollectionFilters } from "../controllers/collectionsController.js";
import { validateCollectionFiltersQuery } from "../middleware/validation.js";

const router = Router();

router.get("/", validateCollectionFiltersQuery, getCollectionFilters);

export default router;
