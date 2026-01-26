# Category Filtering System Documentation

## Overview
This document explains the category-based filtering system that ensures properties appear **ONLY** in their correct categories.

## Data Model

### Property Fields
Each property in Firebase contains these category-related fields:

```typescript
{
  category: "Land for Sale",           // Human-readable category label
  categorySlug: "land-for-sale",       // URL-safe category identifier
  mainCategory: "land",                // Parent menu category
  listingType: "sale"                  // Sale, rent, or lease
}
```

### Main Categories
- **buy**: Residential properties for sale (flats, houses)
- **rent**: Residential properties for rent (flats, houses)
- **land**: Land-based properties (plots, agricultural, farmhouses)
- **commercial**: Commercial properties (offices, shops)
- **pg**: PG/Hostel accommodations

## Category Mapping

### Complete Category List

| Category | Main Category | Category Slug | Listing Type |
|----------|--------------|---------------|--------------|
| Land for Sale | land | land-for-sale | sale |
| Flat for Sale | buy | flat-for-sale | sale |
| House for Sale | buy | house-for-sale | sale |
| House for Rent | rent | house-for-rent | rent |
| Flat for Rent | rent | flat-for-rent | rent |
| Office for Rent & Lease | commercial | office-for-rent-lease | lease |
| Commercial Space for Rent & Lease | commercial | commercial-space-for-rent-lease | lease |
| PG Hostel for Boys | pg | pg-hostel-boys | rent |
| PG Hostel for Girls | pg | pg-hostel-girls | rent |
| PG for Boys | pg | pg-boys | rent |
| PG for Girls | pg | pg-girls | rent |

## Implementation

### 1. Admin Panel - Automatic Category Mapping

When an admin selects a category, the system automatically:
1. Looks up the category in `PROPERTY_CATEGORIES`
2. Extracts `mainCategory`, `categorySlug`, and `listingType`
3. Saves all fields to Firebase

**Code:** `src/components/admin/PropertyForm.tsx`
```typescript
const categoryMapping = getCategoryMapping(formData.category);

const propertyDataRaw = {
  category: formData.category,
  categorySlug: categoryMapping.categorySlug,
  mainCategory: categoryMapping.mainCategory,
  listingType: categoryMapping.listingType,
  // ... other fields
};
```

### 2. Frontend - Category-Specific Queries

Each category page queries Firebase with appropriate filters:

#### Example: Land → Plot for Sale
**Code:** `src/pages/land/LandPlot.tsx`
```typescript
const { properties } = useProperties({ 
  mainCategory: 'land',
  categorySlug: 'land-for-sale'
});
```

#### Example: Buy → Flat for Sale
```typescript
const { properties } = useProperties({ 
  mainCategory: 'buy',
  categorySlug: 'flat-for-sale'
});
```

### 3. Firebase Query Structure

**Code:** `src/hooks/useProperties.ts`

The hook builds Firebase queries with proper filtering:
```typescript
// Most specific filter first
if (categorySlug) {
  constraints.unshift(where('categorySlug', '==', categorySlug));
}

// Parent category filter
if (mainCategory) {
  constraints.unshift(where('mainCategory', '==', mainCategory));
}

// Listing type filter
if (listingType) {
  constraints.unshift(where('listingType', '==', listingType));
}
```

## Navigation Flow

```
User clicks menu → Route loads → Page queries Firebase → Only matching properties render
```

### Example Flow: "Plot for Sale"

1. User clicks "Plot for Sale" in Land menu
2. Route: `/land/plot`
3. Page component: `LandPlot.tsx`
4. Query: `{ mainCategory: 'land', categorySlug: 'land-for-sale' }`
5. Result: **ONLY** land plots for sale appear

## Validation Rules

### Properties Will NOT Appear Where They Shouldn't

✅ **Land for Sale** properties:
- ✓ Appear in: Land menu pages
- ✗ Do NOT appear in: Buy, Rent, Commercial, PG pages

✅ **PG Hostel** properties:
- ✓ Appear in: PG menu pages
- ✗ Do NOT appear in: Buy, Land, Commercial pages

✅ **Rent** properties:
- ✓ Appear in: Rent menu pages
- ✗ Do NOT appear in: Sale pages

## Firebase Indexing

For optimal performance, create these composite indexes in Firebase:

1. `mainCategory` + `createdAt` (DESC)
2. `categorySlug` + `createdAt` (DESC)
3. `mainCategory` + `categorySlug` + `createdAt` (DESC)
4. `listingType` + `createdAt` (DESC)

## Utility Functions

### getCategoryMapping()
**Location:** `src/types/property.ts`

Converts a category value to its full mapping:
```typescript
const mapping = getCategoryMapping('land-for-sale');
// Returns: { 
//   mainCategory: 'land', 
//   categorySlug: 'land-for-sale', 
//   listingType: 'sale' 
// }
```

## Adding New Categories

To add a new category:

1. **Update `PropertyCategory` type** in `src/types/property.ts`
   ```typescript
   export type PropertyCategory = 
     | 'land-for-sale'
     | 'your-new-category'
     // ...
   ```

2. **Add to `PROPERTY_CATEGORIES` array**
   ```typescript
   { 
     value: 'your-new-category', 
     label: 'Your New Category', 
     listingType: 'sale',
     mainCategory: 'buy',
     categorySlug: 'your-new-category'
   }
   ```

3. **Create page component** (if needed)
   ```typescript
   const { properties } = useProperties({ 
     mainCategory: 'buy',
     categorySlug: 'your-new-category'
   });
   ```

4. **Update navigation menu** to link to new category page

## Testing Checklist

After adding/modifying properties, verify:

- [ ] Property appears in its correct category page
- [ ] Property does NOT appear in other categories
- [ ] Filtering by mainCategory works
- [ ] Filtering by categorySlug works
- [ ] Properties page respects URL parameters
- [ ] Search and filters work correctly
- [ ] No duplicate properties across categories

## Common Issues & Solutions

### Issue: Property appears everywhere
**Cause:** Missing category filtering in page query  
**Solution:** Add `mainCategory` and/or `categorySlug` to `useProperties()` call

### Issue: Property doesn't appear anywhere
**Cause:** Category fields not saved properly  
**Solution:** Verify PropertyForm is using `getCategoryMapping()` and saving all fields

### Issue: Wrong properties in category
**Cause:** Incorrect mainCategory or categorySlug mapping  
**Solution:** Check `PROPERTY_CATEGORIES` array for correct mapping

## Summary

This system ensures:
1. ✅ **Zero cross-listing** - Properties only appear in their designated category
2. ✅ **Scalable** - Easy to add new categories
3. ✅ **Performant** - Uses Firebase queries, not client-side filtering
4. ✅ **Type-safe** - Full TypeScript support
5. ✅ **Maintainable** - Centralized category mapping

---

**Last Updated:** January 26, 2026  
**Version:** 1.0
