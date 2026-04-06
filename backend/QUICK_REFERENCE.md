# GET /api/glasses - Quick Reference Card

## 📋 What Was Implemented

A production-ready **GET /api/glasses** API endpoint that:
- ✅ Queries glasses by **category** (sunglasses or eyeglasses)
- ✅ Filters by **specs** (frameType: Acetate or Metal)
- ✅ Returns **lightweight product data** (not full details)
- ✅ Supports **offset-based pagination** with configurable page size
- ✅ Has full **TypeScript type safety**
- ✅ Validates all query parameters before database access
- ✅ Returns optimized responses with minimal payload

---

## 🎯 Core Features

| Feature | Details |
|---------|---------|
| **Endpoint** | `GET /api/glasses` |
| **Query Params** | category, frameType, offset, limit (all optional) |
| **Response** | Paginated list with products + pagination metadata |
| **Fields** | id, name, slug, type, brand, price, images, availability, rating |
| **Pagination** | Offset-based with hasMore flag |
| **Error Handling** | 400 for validation errors, 500 for server errors |

---

## 🚀 Quick Start

### 1. Build
```bash
cd /home/khoa/ProjectSeason/my-app/backend
npm run build
```

### 2. Run
```bash
npm run dev
```

### 3. Test
```bash
# All glasses
curl "http://localhost:3001/api/glasses"

# Sunglasses only
curl "http://localhost:3001/api/glasses?category=sunglasses"

# Eyeglasses with metal frames
curl "http://localhost:3001/api/glasses?category=eyeglasses&frameType=Metal"

# Paginated (offset 12, limit 24)
curl "http://localhost:3001/api/glasses?offset=12&limit=24"
```

---

## 📝 Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `src/types/glasses.ts` | 57 | TypeScript interfaces |
| `src/middleware/validation.ts` | 86 | Query validation |
| `src/services/glassesService.ts` | 72 | Database queries |
| `src/controllers/glassesController.ts` | 35 | Request handling |
| `src/routes/glasses.ts` | 22 | Route definition |
| **Updated:** `src/app.ts` | — | Register router |

### Documentation Files
- `API_DOCUMENTATION.md` - Complete API guide (200+ lines)
- `TESTING_GUIDE.md` - Test cases and examples (200+ lines)
- `IMPLEMENTATION_SUMMARY.md` - Full implementation details (400+ lines)
- `IMPLEMENTATION_FLOW.txt` - Visual flow diagram

---

## 📊 Data Flow

```
Client Request
    ↓
app.ts (mounts router)
    ↓
routes/glasses.ts (GET handler)
    ↓
middleware/validation.ts (validate query)
    ↓
controllers/glassesController.ts (handle request)
    ↓
services/glassesService.ts (query database)
    ↓
MongoDB (returns data)
    ↓
Transform & paginate
    ↓
API Response (200 OK with data)
```

---

## 🔍 Example Usage

### JavaScript/React
```typescript
// Fetch all sunglasses, paginated
const response = await fetch('/api/glasses?category=sunglasses&offset=0&limit=12');
const data = await response.json();

if (data.success) {
  const { products, pagination } = data.data;
  console.log(`Showing ${products.length} of ${pagination.total}`);
}
```

### Load More Pattern
```typescript
const [offset, setOffset] = useState(0);
const [products, setProducts] = useState([]);

const loadMore = async () => {
  const res = await fetch(`/api/glasses?offset=${offset}&limit=12`);
  const data = await res.json();
  
  if (data.success) {
    setProducts([...products, ...data.data.products]);
    setOffset(offset + 12);
  }
};
```

### Filtering Pattern
```typescript
const fetchGlasses = async (category, frameType) => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (frameType) params.append('frameType', frameType);
  
  const res = await fetch(`/api/glasses?${params}`);
  return res.json();
};

// Usage
const sunglasses = await fetchGlasses('sunglasses');
const metalFrames = await fetchGlasses('eyeglasses', 'Metal');
```

---

## ✅ Request Examples

```
GET /api/glasses
GET /api/glasses?category=sunglasses
GET /api/glasses?category=eyeglasses&frameType=Metal
GET /api/glasses?category=eyeglasses&frameType=Acetate
GET /api/glasses?offset=0&limit=12
GET /api/glasses?offset=12&limit=12
GET /api/glasses?category=sunglasses&offset=0&limit=24
GET /api/glasses?category=eyeglasses&frameType=Metal&offset=12&limit=12
```

---

## 🎁 Response Example

**Request:** `GET /api/glasses?category=sunglasses&offset=0&limit=2`

**Response (200 OK):**
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
        "images": ["https://res.cloudinary.com/demo/image.jpg"],
        "availability": "in_stock",
        "rating": { "avg": 4.5, "count": 12 }
      },
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "THE CUT 01",
        "slug": "the-cut-01",
        "type": "Sunglasses",
        "brand": "SEESONvn",
        "price": 2200000,
        "originalPrice": 2200000,
        "images": ["https://res.cloudinary.com/demo/image2.jpg"],
        "availability": "in_stock",
        "rating": { "avg": 4.2, "count": 8 }
      }
    ],
    "pagination": {
      "offset": 0,
      "limit": 2,
      "total": 1247,
      "hasMore": true
    }
  }
}
```

---

## ❌ Error Example

**Request:** `GET /api/glasses?category=invalid`

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid category. Use 'sunglasses' or 'eyeglasses'"
}
```

---

## 🧪 Validation Rules

| Parameter | Valid | Invalid | Default | Max |
|-----------|-------|---------|---------|-----|
| category | sunglasses, eyeglasses | anything else | none | — |
| frameType | Acetate, Metal | anything else | none | — |
| offset | 0+ | negative | 0 | — |
| limit | 1-100 | <1 or >100 | 12 | 100 |

---

## 📋 Key Implementation Details

### Middleware (Validation)
- Case-insensitive input normalization
- Type conversion (string → number)
- Automatic limit capping (max 100)
- Meaningful error messages

### Service Layer
- MongoDB filter building
- Efficient field projection
- Lean queries for performance
- Response data transformation
- Pagination calculation

### Controller
- Error handling with try-catch
- Proper HTTP status codes
- Type-safe request/response

---

## 🔗 Files Location

```
/home/khoa/ProjectSeason/my-app/backend/
├── src/
│   ├── types/
│   │   └── glasses.ts              ← NEW
│   ├── middleware/
│   │   └── validation.ts           ← NEW
│   ├── controllers/
│   │   └── glassesController.ts    ← NEW
│   ├── services/
│   │   └── glassesService.ts       ← NEW
│   ├── routes/
│   │   └── glasses.ts              ← NEW
│   └── app.ts                      ← UPDATED
│
├── API_DOCUMENTATION.md            ← NEW
├── TESTING_GUIDE.md                ← NEW
├── IMPLEMENTATION_SUMMARY.md       ← NEW
└── IMPLEMENTATION_FLOW.txt         ← NEW
```

---

## 🎓 Architecture Pattern

**MVC with Service Layer:**
```
Route (HTTP Handler)
  ↓
Middleware (Validation)
  ↓
Controller (Request Processing)
  ↓
Service (Business Logic)
  ↓
Model (Database)
```

---

## 💡 Why This Implementation?

✅ **Type-Safe** - Full TypeScript with strict mode enabled  
✅ **Performant** - Field projection, lean queries, indexable fields  
✅ **Maintainable** - Service layer, clear separation of concerns  
✅ **Scalable** - Easy to add more filters or sorting  
✅ **User-Friendly** - Smart defaults, case-insensitive input  
✅ **Production-Ready** - Error handling, validation, documentation  

---

## 🚦 Next Steps

1. ✅ **Built & Compiled** - TypeScript builds successfully
2. 📦 **Ready to Deploy** - No dependencies needed, uses existing Mongoose
3. 🧪 **Ready to Test** - Start server and use curl/Postman
4. 📱 **Ready for Frontend** - Integrate with React/Next.js
5. 🔧 **Ready to Extend** - Easy to add more filters or endpoints

---

**Implementation Status: COMPLETE ✅**

See detailed documentation:
- `API_DOCUMENTATION.md` - Full API reference
- `TESTING_GUIDE.md` - Test cases and examples
- `IMPLEMENTATION_SUMMARY.md` - Architecture details
- `IMPLEMENTATION_FLOW.txt` - Visual flow diagram
