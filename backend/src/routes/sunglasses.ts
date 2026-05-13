import { Router } from "express";
import { getSunglasses } from "../controllers/sunglassesController.js";
import { validateSunglassesQuery } from "../middleware/validation.js";

const router = Router();

router.get("/", validateSunglassesQuery, getSunglasses);

export default router;
