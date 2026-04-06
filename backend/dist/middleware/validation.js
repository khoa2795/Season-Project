/**
 * Validates and normalizes query parameters
 */
export const validateGlassesQuery = (req, res, next) => {
    const query = req.query;
    // Parse and normalize parameters
    let category = query.category?.toLowerCase().trim() || null;
    let frameType = query.frameType?.trim() || null;
    let offset = parseInt(query.offset) || 0;
    let limit = parseInt(query.limit) || 12;
    // Validate category
    if (category && !['sunglasses', 'eyeglasses'].includes(category)) {
        res.status(400).json({
            success: false,
            error: "Invalid category. Use 'sunglasses' or 'eyeglasses'",
        });
        return;
    }
    // Validate frameType
    if (frameType && !['acetate', 'metal'].includes(frameType.toLowerCase())) {
        res.status(400).json({
            success: false,
            error: "Invalid frameType. Use 'Acetate' or 'Metal'",
        });
        return;
    }
    // Normalize frameType to proper case
    if (frameType) {
        frameType = frameType.charAt(0).toUpperCase() + frameType.slice(1).toLowerCase();
    }
    // Validate offset
    if (offset < 0) {
        res.status(400).json({
            success: false,
            error: 'Offset must be a non-negative number',
        });
        return;
    }
    // Validate and cap limit
    if (limit < 1) {
        res.status(400).json({
            success: false,
            error: 'Limit must be at least 1',
        });
        return;
    }
    if (limit > 100) {
        limit = 100;
    }
    // Normalize category to proper case if specified
    if (category) {
        category = category === 'sunglasses' ? 'Sunglasses' : 'Eyeglasses';
    }
    // Attach validated query to request
    req.validatedQuery = {
        category,
        frameType,
        offset,
        limit,
    };
    next();
};
//# sourceMappingURL=validation.js.map