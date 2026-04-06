/**
 * Manual testing guide for GET /api/glasses endpoint
 * Run: npm run dev
 * Then use curl or Postman to test these endpoints
 */

// ============================================
// 1. BASIC QUERIES
// ============================================

// Get all glasses (paginated)
GET http://localhost:3001/api/glasses

// Expected Response:
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "...",
        "name": "...",
        "slug": "...",
        "type": "Sunglasses" | "Eyeglasses",
        "brand": "...",
        "price": 2500000,
        "originalPrice": 2500000,
        "images": ["https://res.cloudinary.com/..."],
        "availability": "in_stock",
        "rating": { "avg": 0, "count": 0 }
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

// ============================================
// 2. CATEGORY FILTERING
// ============================================

// Get only sunglasses
GET http://localhost:3001/api/glasses?category=sunglasses

// Get only eyeglasses
GET http://localhost:3001/api/glasses?category=eyeglasses

// Case-insensitive (both work)
GET http://localhost:3001/api/glasses?category=SUNGLASSES
GET http://localhost:3001/api/glasses?category=Eyeglasses

// ============================================
// 3. FRAME TYPE FILTERING (EYEGLASSES ONLY)
// ============================================

// Eyeglasses with Acetate frames
GET http://localhost:3001/api/glasses?category=eyeglasses&frameType=Acetate

// Eyeglasses with Metal frames
GET http://localhost:3001/api/glasses?category=eyeglasses&frameType=Metal

// Case-insensitive
GET http://localhost:3001/api/glasses?category=eyeglasses&frameType=metal
GET http://localhost:3001/api/glasses?category=eyeglasses&frameType=ACETATE

// Frame type without category (still works)
GET http://localhost:3001/api/glasses?frameType=Metal

// ============================================
// 4. PAGINATION
// ============================================

// Get first 12 items (default)
GET http://localhost:3001/api/glasses?offset=0&limit=12

// Get next 12 items
GET http://localhost:3001/api/glasses?offset=12&limit=12

// Get 5 items starting from position 24
GET http://localhost:3001/api/glasses?offset=24&limit=5

// Custom limit (capped at 100)
GET http://localhost:3001/api/glasses?limit=50

// Exceeding max limit (auto-capped to 100)
GET http://localhost:3001/api/glasses?limit=200
// Response will have limit: 100

// ============================================
// 5. COMBINED FILTERS
// ============================================

// Sunglasses with pagination
GET http://localhost:3001/api/glasses?category=sunglasses&offset=0&limit=12

// Eyeglasses with metal frames, paginated
GET http://localhost:3001/api/glasses?category=eyeglasses&frameType=Metal&offset=12&limit=24

// ============================================
// 6. ERROR CASES (SHOULD RETURN 400)
// ============================================

// Invalid category
GET http://localhost:3001/api/glasses?category=invalid
// Error: "Invalid category. Use 'sunglasses' or 'eyeglasses'"

// Invalid frameType
GET http://localhost:3001/api/glasses?frameType=invalid
// Error: "Invalid frameType. Use 'Acetate' or 'Metal'"

// Negative offset
GET http://localhost:3001/api/glasses?offset=-5
// Error: "Offset must be a non-negative number"

// Invalid limit (too small)
GET http://localhost:3001/api/glasses?limit=0
// Error: "Limit must be at least 1"

// Non-numeric offset
GET http://localhost:3001/api/glasses?offset=abc
// offset will be treated as 0 (default)

// ============================================
// 7. CURL COMMAND EXAMPLES
// ============================================

# Basic query
curl "http://localhost:3001/api/glasses"

# With category
curl "http://localhost:3001/api/glasses?category=sunglasses"

# With all parameters
curl "http://localhost:3001/api/glasses?category=eyeglasses&frameType=Metal&offset=0&limit=12"

# Pretty print JSON response
curl "http://localhost:3001/api/glasses" | jq

# ============================================
// 8. POSTMAN TESTING
// ============================================

/*
In Postman:
1. Create a new GET request
2. URL: http://localhost:3001/api/glasses
3. Add query parameters in "Params" tab:
   - Key: category, Value: sunglasses
   - Key: frameType, Value: Metal
   - Key: offset, Value: 0
   - Key: limit, Value: 12
4. Click "Send"
5. View response in Response tab
*/

// ============================================
// 9. EXPECTED RESPONSE STRUCTURE
// ============================================

/*
Success (200):
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
        "images": ["https://res.cloudinary.com/..."],
        "availability": "in_stock",
        "rating": {"avg": 0, "count": 0}
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

Error (400/500):
{
  "success": false,
  "error": "Error message here"
}
*/

// ============================================
// 10. VERIFICATION CHECKLIST
// ============================================

/*
[ ] TypeScript compilation succeeds (npm run build)
[ ] No runtime errors on startup (npm run dev)
[ ] GET /api/glasses returns products with pagination
[ ] GET /api/glasses?category=sunglasses filters correctly
[ ] GET /api/glasses?category=eyeglasses filters correctly
[ ] GET /api/glasses?frameType=Metal returns eyeglasses with metal frames
[ ] GET /api/glasses?frameType=Acetate returns eyeglasses with acetate frames
[ ] GET /api/glasses?offset=12&limit=12 returns correct pagination
[ ] Invalid category returns 400 error
[ ] Invalid frameType returns 400 error
[ ] Limit > 100 is capped to 100
[ ] hasMore is true when more items exist
[ ] hasMore is false when no more items exist
[ ] Response includes only necessary fields (no full product data)
[ ] Images array contains Cloudinary URLs
[ ] Prices are in Vietnamese Dong (millions range)
[ ] All products have rating.avg and rating.count
[ ] Availability field is one of: in_stock, out_of_stock, pre_order
*/
