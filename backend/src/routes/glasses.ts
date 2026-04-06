/**
 * Routes for glasses endpoints
 */
import { Router } from 'express';
import { getGlasses } from '../controllers/glassesController.js';
import { validateGlassesQuery } from '../middleware/validation.js';

const router = Router();

/**
 * GET /api/glasses
 * Query glasses by category and specs
 * Query params:
 *   - category: 'sunglasses' or 'eyeglasses' (optional)
 *   - frameType: 'Acetate' or 'Metal' (optional, eyeglasses only)
 *   - offset: number, default 0 (optional)
 *   - limit: number, default 12, max 100 (optional)
 */
router.get('/', validateGlassesQuery, getGlasses);

export default router;
