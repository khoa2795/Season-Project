import { Router } from "express";
import { checkSkuInventory } from "../controllers/inventoryController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateInventoryCheckQuery } from "../middleware/inventoryValidation.js";

const router = Router();

router.get("/check", requireAuth, validateInventoryCheckQuery, checkSkuInventory);

export default router;
