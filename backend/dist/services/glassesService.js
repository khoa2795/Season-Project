/**
 * Service layer for glasses queries
 */
import { Product } from '../models/Product.js';
/**
 * Build MongoDB filter based on query parameters
 */
function buildFilter(query) {
    const filter = {
        isActive: true,
    };
    // Filter by category (type field)
    if (query.category) {
        filter.type = query.category;
    }
    // Filter by frame type (only for eyeglasses)
    if (query.frameType) {
        filter['specifications.frameType.material'] = query.frameType;
    }
    return filter;
}
/**
 * Transform database product to lightweight response format
 */
function transformProduct(product) {
    // Get first variant for price and images
    const defaultVariant = product.variants?.[0];
    if (!defaultVariant) {
        throw new Error(`Product ${product._id} has no variants`);
    }
    return {
        id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        type: product.type,
        brand: product.brand,
        price: defaultVariant.price,
        originalPrice: defaultVariant.originalPrice,
        images: defaultVariant.images,
        availability: product.availability,
        rating: product.rating,
    };
}
/**
 * Query glasses with filters and pagination
 */
export async function getGlassesByFilters(query) {
    try {
        // Build MongoDB filter
        const filter = buildFilter(query);
        // Execute count query for total
        const total = await Product.countDocuments(filter);
        // Execute query with projection and pagination
        const products = await Product.find(filter)
            .select('name slug type brand specifications availability rating variants')
            .skip(query.offset)
            .limit(query.limit)
            .lean();
        // Transform products to response format
        const transformedProducts = products.map(transformProduct);
        return {
            products: transformedProducts,
            pagination: {
                offset: query.offset,
                limit: query.limit,
                total,
                hasMore: query.offset + query.limit < total,
            },
        };
    }
    catch (error) {
        console.error('Error fetching glasses:', error);
        throw new Error('Failed to fetch glasses');
    }
}
//# sourceMappingURL=glassesService.js.map