# Sort & Filter Feature Documentation

## Overview
This document describes the sort and filter feature implemented for the Season web application's products page. The feature allows users to sort and filter products by various criteria.

## Features Implemented

### 1. Sort Options
Users can sort products by:
- **Newest** - Sorts by creation date (default)
- **Price: Low to High** - Ascending price order
- **Price: High to Low** - Descending price order
- **Name: A-Z** - Alphabetical order
- **Rating: High to Low** - By rating average and count

### 2. Filter Options

#### For Eyeglasses:
- **Material**: Acetate, Metal
- **Size**: Small, Medium, Big
- **Sale**: Toggle to show only sale items

#### For Sunglasses:
- **Collection**: The Office, The Assembled, The Athletes, The Cut, The Cut Edge, The Edge, The Flow
- **Sale**: Toggle to show only sale items

### 3. UI Components

#### SortSelector (`components/products/sort-selector.tsx`)
- Dropdown menu to select sorting option
- Displays current sort selection
- Styled with Tailwind CSS matching the existing design
- Uses lucide-react ChevronDown icon

#### FilterPanel (`components/products/filter-panel.tsx`)
- Panel showing available filters based on product type
- Checkboxes for toggling filters on/off
- Clear filters button
- Responsive design

### 4. Integration Points

#### Backend (Express/Node.js)
**Validation Middleware** (`backend/src/middleware/validation.ts`):
- Added `parseSort()` function to validate sort parameters
- Updated both `validateEyeglassesQuery` and `validateSunglassesQuery` middleware
- Validates sort values: `price_asc`, `price_desc`, `name_asc`, `newest`, `rating_desc`
- Defaults to `newest` if not specified

**Services** (`backend/src/services/`):
- **eyeglassesService.ts**: Added `buildSortOrder()` function to create MongoDB sort object
- **sunglassesService.ts**: Added `buildSortOrder()` function (same as eyeglasses)
- Both services now apply sort to database queries using `.sort(sortOrder)`

**API Types** (`backend/src/types/eyewear.ts`):
- Updated `ValidatedEyeglassesQuery` and `ValidatedSunglassesQuery` to include sort field
- Updated query parameter interfaces to accept `sort` parameter

#### Frontend (Next.js)
**API Functions**:
- Updated `fetchEyeglassesBatch()` to accept query parameters
- Updated `fetchSunglassesBatch()` to accept query parameters
- Updated `fetchProductsBatchByCategory()` to accept and pass query parameters

**Query Serializers**:
- Updated `eyeglasses-query.ts` to include sort in `EyeglassesQuery` type and serializer
- Updated `sunglasses-query.ts` to include sort in `SunglassesQuery` type and serializer
- Defaults sort to `newest` if not provided

**ProductsPageShell Component** (`components/products/products-page-shell.tsx`):
- Added sort and filter state management
- Added SortSelector and FilterPanel components
- Implemented filter application logic with "Apply Filters" button
- Updated "Load More" to respect current filters and sort
- Added collapsible filters panel with toggle button
- Re-fetches products when filters or sort changes

**Constants**:
- Created `lib/constants/collections.ts` with sunglasses collections data
- Collections: The Office, The Assembled, The Athletes, The Cut, The Cut Edge, The Edge, The Flow

## Database Query Examples

### Eyeglasses with Multiple Filters
```
GET /api/eyeglasses?frameType=Metal&frameSize=Small&sale=false&sort=price_asc&offset=0&limit=12
```

### Sunglasses with Collection Filter
```
GET /api/sunglasses?collectionSlug=the-athletes&sale=false&sort=newest&offset=0&limit=12
```

## Usage Instructions

### For Users
1. Click the "Show Filters" button to display the filter panel
2. Select desired filters (Material, Size, Collection, Sale)
3. Click "Apply Filters" to apply the selected filters
4. Use the sort dropdown in the top right to change sorting
5. Click "Load More" to load additional products with current filters/sort
6. Click "Clear" in the filter panel to reset all filters

### For Developers

#### Adding a New Sort Option
1. Add to the `SORT_OPTIONS` array in `sort-selector.tsx`
2. Update the sort type in backend types and frontend query types
3. Add case to `buildSortOrder()` in backend services

#### Adding a New Filter for Eyeglasses
1. Add to the `FilterPanel` component UI
2. Add state management in `ProductsPageShell`
3. Update `buildQuery()` function in `ProductsPageShell`
4. Update validation middleware in backend
5. Update filter building in backend services

#### Adding a New Filter for Sunglasses
1. Add to collections in `lib/constants/collections.ts` if needed
2. Add to the `FilterPanel` component UI
3. Add state management in `ProductsPageShell`
4. Update backend validation and services

## API Response Format
Both endpoints return paginated results:
```json
{
  "records": [
    {
      "id": "...",
      "name": "...",
      "slug": "...",
      "type": "eyeglasses|sunglasses",
      "brand": "...",
      "collectionId": "...",
      "salePercent": 0,
      "availability": "in_stock",
      "description": "...",
      "specifications": {...},
      "variants": [...],
      "rating": { "avg": 4.5, "count": 10 },
      "isActive": true
    }
  ],
  "total": 100
}
```

## Testing Checklist

- [ ] Sort selector appears and functions correctly
- [ ] Filter panel can be toggled
- [ ] Filters apply correctly and fetch new results
- [ ] Pagination respects filters and sort
- [ ] "Clear Filters" button resets all filters
- [ ] Sort persists when applying filters
- [ ] Filters persist when changing sort
- [ ] "Load More" button works with active filters
- [ ] All sort options produce correct results
- [ ] All filter combinations work as expected
- [ ] UI is responsive on mobile/tablet/desktop
- [ ] Error messages display appropriately
- [ ] No console errors

## Performance Considerations

1. **Database Indexes**: Consider adding indexes on:
   - `isActive`
   - `specifications.frameType.material` for eyeglasses
   - `specifications.frameType.size` for eyeglasses
   - `collectionId` for sunglasses
   - `salePercent` for both
   - `variants.price` for sorting

2. **Frontend Optimization**:
   - Products are fetched with pagination
   - Filters and sort changes trigger complete re-fetch
   - State is local to ProductsPageShell component

## Files Modified/Created

### Backend
- `src/types/eyewear.ts` - Added sort to query types
- `src/middleware/validation.ts` - Added sort validation
- `src/services/eyeglassesService.ts` - Added sort logic
- `src/services/sunglassesService.ts` - Added sort logic

### Frontend
- `components/products/sort-selector.tsx` - NEW
- `components/products/filter-panel.tsx` - NEW
- `components/products/products-page-shell.tsx` - Updated
- `lib/model/eyeglasses/eyeglasses-query.ts` - Updated
- `lib/model/sunglasses/sunglasses-query.ts` - Updated
- `lib/model/eyeglasses/eyeglasses-api.ts` - Updated
- `lib/model/sunglasses/sunglasses-api.ts` - Updated
- `lib/model/index.ts` - Updated
- `lib/constants/collections.ts` - NEW

## Future Enhancements

1. Add price range filter
2. Add color filter
3. Add gender/style filter
4. Add availability filter
5. Save filter preferences to localStorage
6. Add URL query parameters for shareable filter links
7. Add filtering indicators showing active filters
8. Add filter animations
9. Add collections API endpoint
10. Add real-time collection counts based on current filters
