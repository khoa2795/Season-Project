import { getGlassesByFilters } from '../services/glassesService.js';
/**
 * GET /api/glasses
 * Query glasses by category and specs with pagination
 */
export async function getGlasses(req, res) {
    try {
        // Get validated query from middleware
        const validatedQuery = req.validatedQuery;
        if (!validatedQuery) {
            res.status(400).json({
                success: false,
                error: 'Invalid query parameters',
            });
            return;
        }
        // Fetch glasses using service layer
        const responseData = await getGlassesByFilters(validatedQuery);
        // Return successful response
        res.status(200).json({
            success: true,
            data: responseData,
        });
    }
    catch (error) {
        console.error('Error in getGlasses controller:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error',
        });
    }
}
//# sourceMappingURL=glassesController.js.map