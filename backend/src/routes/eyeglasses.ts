import { Router } from "express";
import { getEyeglasses } from "../controllers/eyeglassesController.js";
import { validateEyeglassesQuery } from "../middleware/validation.js";

const router = Router();

router.get("/", validateEyeglassesQuery, getEyeglasses);

export default router;
