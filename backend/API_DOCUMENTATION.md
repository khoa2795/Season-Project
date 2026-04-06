# Glasses API - GET /api/glasses

## Overview

This API endpoint allows you to query glasses (sunglasses or eyeglasses) with support for filtering by category and frame type specifications, with offset-based pagination.

## Endpoint

```
GET /api/glasses
```

## Query Parameters

All parameters are optional with smart defaults.

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `category` | string | none | Filter by type: `sunglasses` or `eyeglasses` | `?category=eyeglasses` |
| `frameType` | string | none | Filter by frame material (eyeglasses only): `Acetate` or `Metal` | `?frameType=Metal` |
| `offset` | number | 0 | Pagination offset (number of items to skip) | `?offset=24` |
| `limit` | number | 12 | Items per page (max 100) | `?limit=24` |

## Request Examples

```bash
# Get all glasses (paginated)
GET /api/glasses

# Get all sunglasses
GET /api/glasses?category=sunglasses

# Get eyeglasses with metal frames
GET /api/glasses?category=eyeglasses&frameType=Metal

# Get eyeglasses with acetate frames
GET /api/glasses?category=eyeglasses&frameType=Acetate

# Pagination examples
GET /api/glasses?offset=0&limit=12   # First 12 items
GET /api/glasses?offset=12&limit=12  # Next 12 items
GET /api/glasses?offset=24&limit=24  # 24 items starting from position 24

# Combined filtering and pagination
GET /api/glasses?category=sunglasses&offset=0&limit=20
```

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "THE PAPER KNIFE 02",
        "slug": "the-paper-knife-02",
        "type": "Sunglasses",
        "brand": "SEESONvn",
        "price": 2500000,
        "originalPrice": 2500000,
        "images": [
          "https://res.cloudinary.com/..."
        ],
        "availability": "in_stock",
        "rating": {
          "avg": 4.5,
          "count": 12
        }
      }
    ],
    "pagination": {
      "offset": 0,
      "limit": 12,
      "total": 1247,
      "hasMore": true
    }
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Invalid category. Use 'sunglasses' or 'eyeglasses'"
}
```

### Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "error": "Failed to fetch glasses"
}
```

## Response Fields

### Product Object
- `id` (string): MongoDB document ID
- `name` (string): Product name
- `slug` (string): URL-friendly identifier
- `type` (string): "Sunglasses" or "Eyeglasses"
- `brand` (string): Brand name
- `price` (number): Current price in Vietnamese Dong
- `originalPrice` (number): Original price before any sales
- `images` (array): Array of image URLs (from first variant)
- `availability` (string): "in_stock", "out_of_stock", or "pre_order"
- `rating` (object):
  - `avg` (number): Average rating (0-5)
  - `count` (number): Number of ratings

### Pagination Object
- `offset` (number): Current offset
- `limit` (number): Current limit (items per page)
- `total` (number): Total items matching the filter
- `hasMore` (boolean): Whether more items exist after current page

## Validation Rules

### Category Parameter
- Must be `"sunglasses"` or `"eyeglasses"` (case-insensitive)
- Invalid categories return 400 error

### FrameType Parameter
- Only valid when used with eyeglasses (but won't error if used with sunglasses)
- Must be `"Acetate"` or `"Metal"` (case-insensitive)
- Invalid frameType returns 400 error

### Offset Parameter
- Must be a non-negative integer (>= 0)
- Negative values return 400 error

### Limit Parameter
- Must be between 1 and 100
- Values > 100 are automatically capped to 100
- Values < 1 return 400 error

## Implementation Details

### File Structure
```
src/
├── types/glasses.ts                 # TypeScript interfaces
├── middleware/validation.ts         # Query parameter validation
├── controllers/glassesController.ts # Request handler
├── services/glassesService.ts       # Database query logic
├── routes/glasses.ts                # Route definition
└── app.ts                           # Main app (updated with router)
```

### Key Features
- **Type-Safe**: Full TypeScript support with proper typing
- **Validation**: Query parameters validated before database queries
- **Lightweight Response**: Only essential fields returned (not full product details)
- **Pagination**: Offset-based pagination for efficient data loading
- **MongoDB Projection**: Only necessary fields selected from database
- **Error Handling**: Comprehensive error messages for invalid inputs

## Usage in Frontend

### React/Next.js Example
```typescript
// Fetch all sunglasses
const response = await fetch('/api/glasses?category=sunglasses&offset=0&limit=12');
const data = await response.json();

if (data.success) {
  const { products, pagination } = data.data;
  console.log(`Showing ${products.length} of ${pagination.total} products`);
  console.log(`Has more items: ${pagination.hasMore}`);
}
```

### Load More Pattern
```typescript
const [offset, setOffset] = useState(0);
const [products, setProducts] = useState([]);

const loadMore = async () => {
  const response = await fetch(`/api/glasses?offset=${offset}&limit=12`);
  const data = await response.json();
  
  if (data.success) {
    setProducts([...products, ...data.data.products]);
    setOffset(offset + data.data.pagination.limit);
  }
};
```

### Filtering Pattern
```typescript
const fetchGlasses = async (category, frameType) => {
  let url = '/api/glasses';
  const params = new URLSearchParams();
  
  if (category) params.append('category', category);
  if (frameType) params.append('frameType', frameType);
  
  const response = await fetch(`${url}?${params.toString()}`);
  const data = await response.json();
  return data;
};

// Usage
const sunglasses = await fetchGlasses('sunglasses');
const metalFrames = await fetchGlasses('eyeglasses', 'Metal');
```

## Differences from viewProductsDetail

This API (viewProducts) differs from a potential `viewProductsDetail` endpoint:

| Aspect | viewProducts (this API) | viewProductsDetail (future) |
|--------|------------------------|-----------------------------|
| Purpose | List/browse products | View single product details |
| Response | Lightweight, multiple items | Full product data |
| Fields | name, price, images, brand | Includes descriptions, all variants, specs |
| Pagination | Offset-based | N/A (single item) |
| Query | category, frameType, specs | Product slug or ID |
| Use Case | Product listing, filtering | Product detail page |

## Testing Commands

```bash
# Using curl
curl "http://localhost:3001/api/glasses"
curl "http://localhost:3001/api/glasses?category=sunglasses"
curl "http://localhost:3001/api/glasses?category=eyeglasses&frameType=Metal"
curl "http://localhost:3001/api/glasses?offset=0&limit=5"

# Using httpie
http GET localhost:3001/api/glasses
http GET localhost:3001/api/glasses category==sunglasses
http GET localhost:3001/api/glasses category==eyeglasses frameType==Metal
```

## Error Messages

| Scenario | Status | Error Message |
|----------|--------|---------------|
| Invalid category | 400 | "Invalid category. Use 'sunglasses' or 'eyeglasses'" |
| Invalid frameType | 400 | "Invalid frameType. Use 'Acetate' or 'Metal'" |
| Negative offset | 400 | "Offset must be a non-negative number" |
| Invalid limit | 400 | "Limit must be at least 1" |
| Database error | 500 | "Failed to fetch glasses" |

## Database Query Performance

- Uses MongoDB `.lean()` for faster plain object returns
- Field projection to select only needed columns
- Indexing recommendations:
  - `type` (category filtering)
  - `specifications.frameType.material` (frame type filtering)
  - `isActive` (active products filter)

## Notes

- All prices are in Vietnamese Dong (VND)
- Images are stored on Cloudinary
- Frame type (material and size) only applies to eyeglasses
- Case-insensitive parameter handling for better UX
- Default variant (first in array) used for price and image display
