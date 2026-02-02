/**
 * PROPERTY FORM OPTIMIZATION SUMMARY
 * 
 * This document provides a precise breakdown of all fields for each property type
 * after optimization using the field visibility system.
 */

# Property Form - Field Types by Category

## Summary Table

| Property Type | Total Fields | Required | Optional | Hidden |
|---|---|---|---|---|
| **Land for Sale** | 16 | 5 | 2 | 9 |
| **Flat for Sale** | 16 | 7 | 3 | 6 |
| **House for Sale** | 16 | 6 | 4 | 6 |
| **Flat for Rent** | 16 | 7 | 2 | 7 |
| **House for Rent** | 16 | 6 | 2 | 8 |
| **Office for Rent/Lease** | 16 | 3 | 2 | 11 |
| **Commercial Space** | 16 | 1 | 2 | 13 |
| **PG Hostel Boys** | 16 | 2 | 3 | 11 |
| **PG Hostel Girls** | 16 | 2 | 3 | 11 |
| **PG for Boys** | 16 | 2 | 3 | 11 |
| **PG for Girls** | 16 | 2 | 3 | 11 |

---

## Detailed Field Breakdown by Category

### UNIVERSAL FIELDS (Always Shown)
These fields appear in ALL property forms:
- **Title** ✓ Required
- **Description** ✓ Required
- **Category** ✓ Required
- **Price** ✓ Required
- **Price Unit** ✓ Required
- **Location (Address)** ✓ Required
- **City** ✓ Required
- **State** ✓ Required
- **Posted By** ✓ Required
- **Pincode** ◐ Optional
- **Contact Fields** ✓ Required
- **Media (Images/Videos)** ✓ Required
- **Amenities** ◐ Dynamic
- **Status Flags** ◐ Optional

---

## CATEGORY 1: LAND FOR SALE

**Best For:** Plots, Agricultural Land, Farm Houses

### Required Fields (5)
1. **Land Type** - Select: Plot, Agricultural, Farm Houses
2. **Area** - Input (numeric)
3. **Area Unit** - Select: Sqft, Sqyd, Acres, Cents
4. **Facing** - Select: North, South, East, West, NE, NW, SE, SW
5. **Road Access** - Select: Available, Not Available, Partial

### Optional Fields (2)
1. **Legal Clearances** - Select: Approved, Verified, Under Process
2. **Property Age** - Select: New, 0-1Y, 1-5Y, 5-10Y, 10+Y

### Hidden Fields (9)
- Bedrooms
- Bathrooms
- Balconies
- Floor
- Total Floors
- Furnishing Status
- Occupancy
- Food Included
- Property Age (years)

### Form Sections
1. Basic Information
2. Pricing
3. Location
4. **Land Details**
   - Land Type
   - Area (acres/sqft)
   - Facing
   - Road Access
   - Legal Clearances
5. Contact Information
6. Media
7. Status

---

## CATEGORY 2: FLAT FOR SALE

**Best For:** Residential Apartment Selling

### Required Fields (7)
1. **Area** - Input (numeric) in sq.ft
2. **Area Unit** - Select (sqft default)
3. **Bedrooms** - Select: 1-7+ BHK
4. **Bathrooms** - Select: 1-6+
5. **Floor** - Input (numeric)
6. **Total Floors** - Input (numeric)
7. **Facing** - Select: North, South, East, West, etc.
8. **Property Age** - Select: New, 0-1Y, 1-5Y, 5-10Y, 10+Y

### Optional Fields (3)
1. **Price per Sq.ft** - Input (numeric)
2. **Balconies** - Select: 0-4+
3. **Furnishing Status** - Select: Fully, Semi, Unfurnished

### Hidden Fields (6)
- Land Type
- Land Facing
- Road Access
- Occupancy
- Food Included
- Area (acres)

### Form Sections
1. Basic Information
2. Pricing (with Price/Sqft option)
3. Location
4. **Room Details**
   - Area
   - Bedrooms
   - Bathrooms
   - Balconies
   - Floor
   - Total Floors
   - Facing
   - Property Age
   - Furnishing
5. Contact Information
6. Media
7. Status

---

## CATEGORY 3: HOUSE FOR SALE

**Best For:** Residential House/Villa Selling

### Required Fields (6)
1. **Area** - Input (numeric) in sq.ft
2. **Area Unit** - Select (sqft default)
3. **Bedrooms** - Select: 1-7+ BHK
4. **Bathrooms** - Select: 1-6+
5. **Facing** - Select: North, South, East, West, etc.
6. **Property Age** - Select: New, 0-1Y, 1-5Y, 5-10Y, 10+Y

### Optional Fields (4)
1. **Price per Sq.ft** - Input (numeric)
2. **Floor** - Input (numeric) [Optional for houses]
3. **Total Floors** - Input (numeric) [Optional for houses]
4. **Balconies** - Select: 0-4+
5. **Furnishing Status** - Select: Fully, Semi, Unfurnished

### Hidden Fields (6)
- Land Type
- Road Access
- Occupancy
- Food Included
- Area (acres)
- Construction Status

### Form Sections
Similar to Flat for Sale, but Floor/Total Floors marked optional

---

## CATEGORY 4: FLAT FOR RENT

**Best For:** Residential Apartment Renting

### Required Fields (7)
1. **Area** - Input (numeric) in sq.ft
2. **Area Unit** - Select (sqft default)
3. **Bedrooms** - Select: 1-7+ BHK
4. **Bathrooms** - Select: 1-6+
5. **Floor** - Input (numeric)
6. **Total Floors** - Input (numeric)
7. **Facing** - Select: North, South, East, West, etc.
8. **Furnishing Status** - Select: Fully, Semi, Unfurnished ✓ **Required for rentals**

### Optional Fields (2)
1. **Price per Sq.ft** - Input (numeric)
2. **Balconies** - Select: 0-4+

### Hidden Fields (7)
- Property Age [Not relevant for rentals]
- Construction Status
- Land Type
- Road Access
- Occupancy
- Food Included
- Area (acres)

### Form Sections
1. Basic Information
2. Pricing
3. Location
4. **Room Details**
   - Area
   - Bedrooms
   - Bathrooms
   - Balconies
   - Floor
   - Total Floors
   - Facing
   - **Furnishing Status** (Required)
5. Contact Information
6. Media
7. Status

---

## CATEGORY 5: HOUSE FOR RENT

**Best For:** Residential House/Villa Renting

### Required Fields (6)
1. **Area** - Input (numeric) in sq.ft
2. **Area Unit** - Select (sqft default)
3. **Bedrooms** - Select: 1-7+ BHK
4. **Bathrooms** - Select: 1-6+
5. **Facing** - Select: North, South, East, West, etc.
6. **Furnishing Status** - Select: Fully, Semi, Unfurnished ✓ **Required**

### Optional Fields (2)
1. **Price per Sq.ft** - Input (numeric)
2. **Balconies** - Select: 0-4+
3. **Floor** - Input (numeric) [Optional]
4. **Total Floors** - Input (numeric) [Optional]

### Hidden Fields (8)
- Property Age
- Construction Status
- Land Type
- Road Access
- Occupancy
- Food Included
- Area (acres)
- Possession Status

### Form Sections
Similar to House for Sale with Furnishing required

---

## CATEGORY 6: OFFICE FOR RENT & LEASE

**Best For:** Commercial Office Space

### Required Fields (3)
1. **Area** - Input (numeric) in sq.ft
2. **Area Unit** - Select (sqft default)
3. **Floor** - Input (numeric)
4. **Total Floors** - Input (numeric)

### Optional Fields (2)
1. **Price per Sq.ft** - Input (numeric)
2. **Facing** - Select: North, South, East, West, etc.

### Hidden Fields (11)
- Bedrooms
- Bathrooms
- Balconies
- Property Age
- Furnishing Status
- Occupancy
- Food Included
- Land Type
- Road Access
- Legal Clearances
- Construction Status

### Form Sections
1. Basic Information
2. Pricing (with Price/Sqft option)
3. Location
4. **Commercial Details**
   - Area
   - Floor
   - Total Floors
   - Facing (optional)
5. Contact Information
6. Media
7. Status

---

## CATEGORY 7: COMMERCIAL SPACE FOR RENT & LEASE

**Best For:** Shops, Warehouses, Showrooms

### Required Fields (1)
1. **Area** - Input (numeric) in sq.ft

### Optional Fields (2)
1. **Area Unit** - Select (sqft default)
2. **Price per Sq.ft** - Input (numeric)
3. **Floor** - Input (numeric) [Optional - ground floor common]
4. **Total Floors** - Input (numeric) [Optional]
5. **Facing** - Select: North, South, East, West, etc.

### Hidden Fields (13)
- Bedrooms
- Bathrooms
- Balconies
- Property Age
- Furnishing Status
- Occupancy
- Food Included
- Land Type
- Road Access
- Construction Status
- Legal Clearances

### Form Sections
1. Basic Information
2. Pricing
3. Location
4. **Commercial Details**
   - Area (minimal fields)
   - Optional: Floor, Facing
5. Contact Information
6. Media
7. Status

---

## CATEGORY 8-11: PG ACCOMMODATIONS
### (PG Hostel Boys, PG Hostel Girls, PG for Boys, PG for Girls)

**Best For:** Student Housing, Shared Accommodations

### Required Fields (2)
1. **Occupancy Type** - Select: Single, Double, Triple, Shared
2. **Food Included** - Checkbox: Yes/No

### Optional Fields (3)
1. **Area** - Input (numeric) in sq.ft
2. **Area Unit** - Select (sqft default)
3. **Furnishing Status** - Select: Fully, Semi, Unfurnished
4. **Floor** - Input (numeric)
5. **Total Floors** - Input (numeric)

### Hidden Fields (11)
- Bedrooms [Not used for PG - use occupancy instead]
- Bathrooms
- Balconies
- Property Age
- Construction Status
- Facing
- Land Type
- Road Access
- Legal Clearances
- Land Facing
- Area (acres)

### Form Sections
1. Basic Information
2. Pricing
3. Location
4. **PG Details**
   - Occupancy Type (required)
   - Food Included (required)
   - Area (optional)
   - Furnishing Status (optional)
   - Floor/Total Floors (optional)
5. Contact Information
6. Media
7. Status

**Key Difference:** Uses "Occupancy Type" instead of "Bedrooms" to indicate Single/Double/Triple occupancy

---

## Field Definition Reference

### All Possible Fields (Universal Pool)

| Field | Type | Values/Range | Used In |
|-------|------|---|---|
| Title | Text | Free text | All |
| Description | Long Text | Free text | All |
| Category | Select | 11 types | All |
| Price | Number | Any amount | All |
| Price Unit | Select | Total, Per-Month, Per-Year, Per-Sqft | All |
| Price/Sqft | Number | Currency | Most |
| Location | Text | Address | All |
| City | Text | City name | All |
| State | Text | State name | All |
| Pincode | Text | 6 digits | All |
| Area | Number | 100-100000+ | All except PG |
| Area Unit | Select | Sqft, Sqyd, Acres, Cents | All |
| Area (Acres) | Number | Decimal | Land, PG |
| Bedrooms | Select | 1-7+ BHK | Residential |
| Bathrooms | Select | 1-6+ | Residential |
| Balconies | Select | 0-4+ | Residential (optional) |
| Floor | Number | 1-100+ | Multi-story |
| Total Floors | Number | 1-100+ | Multi-story |
| Facing | Select | N,S,E,W,NE,NW,SE,SW | Residential, Commercial |
| Land Facing | Select | N,S,E,W,NE,NW,SE,SW | Land only |
| Land Type | Select | Plot, Agricultural, Farm | Land only |
| Road Access | Select | Available, Not, Partial | Land only |
| Legal Clear. | Select | Approved, Verified, etc | Land (optional) |
| Property Age | Select | New, 0-1Y, 1-5Y, etc | Residential Sale |
| Property Age (Y) | Number | Integer | Land, PG |
| Furnishing | Select | Fully, Semi, Unfurnished | Residential, Commercial |
| Construction | Select | Ready, Under, New Launch | Residential Sale |
| Occupancy | Select | Single, Double, Triple | PG only |
| Food Included | Checkbox | Yes/No | PG only |
| Amenities | Multi-select | Dynamic per category | Category-based |
| Posted By | Select | Owner, Dealer, Builder | All |
| Contact Name | Text | Name | All |
| Contact Phone | Text | 10 digits | All |
| Contact WhatsApp | Text | 10 digits | All |
| Images | Media | Multiple files | All |
| Videos | Media | Multiple files | All |
| Verified | Checkbox | Yes/No | All |
| Featured | Checkbox | Yes/No | All |
| Sold Out | Checkbox | Yes/No | All |

---

## Implementation Benefits

### For Users
✓ **Cleaner forms** - Only see relevant fields for their property type
✓ **Faster entry** - Fewer irrelevant fields to navigate
✓ **Clear guidance** - Required fields marked with asterisks
✓ **No confusion** - No "Why is this field here?" questions

### For Data Quality
✓ **Better completion** - Fewer incomplete submissions
✓ **Accurate info** - Correct field types per category
✓ **Consistent format** - All properties follow same pattern
✓ **Validation works** - Only relevant validations applied

### For Developers
✓ **Maintainable** - Centralized field configuration
✓ **Scalable** - Easy to add new property types
✓ **Type-safe** - Full TypeScript support
✓ **Testable** - All rules in one place

---

## Usage in Code

### Import Field Visibility
```typescript
import {
  shouldShowField,
  isFieldRequired,
  getRequiredFields,
} from '@/lib/field-visibility';

// Check visibility
if (shouldShowField('flat-for-sale', 'bedrooms')) {
  // Show bedrooms field
}

// Check if required
if (isFieldRequired('flat-for-sale', 'bedrooms')) {
  // Mark as required
}

// Get all required fields
const required = getRequiredFields('flat-for-sale');
// Returns: ['area', 'areaUnit', 'bedrooms', 'bathrooms', 'floor', 'totalFloors', 'facing', 'propertyAge']
```

### Use Conditional Components
```tsx
<ConditionalField category={formData.category} fieldName="bedrooms">
  <Input type="number" placeholder="Bedrooms" />
</ConditionalField>
```

---

## Migration Checklist

- [ ] Import field visibility functions
- [ ] Wrap fields with ConditionalField components
- [ ] Update validation logic
- [ ] Test all 11 property types
- [ ] Verify required fields marked
- [ ] Verify hidden fields absent
- [ ] Check form submission works
- [ ] Verify display pages updated

