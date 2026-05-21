import { Router } from "express";
import { getCollectionFilters } from "../controllers/collectionsController.js";

const router = Router();

router.get("/", getCollectionFilters);

export default router;
