# Property Form Optimization Guide

## Overview

This guide documents the property form optimization system that makes form fields **context-aware** based on property type, and ensures property pages display **only user-provided information**.

## The Problem (Solved)

### Before Optimization:
- ❌ Forms showed ALL fields regardless of property type
- ❌ Property pages displayed empty sections and irrelevant fields
- ❌ Scattered conditional logic made maintenance difficult
- ❌ Required fields weren't clearly distinguished by category
- ❌ PG forms incorrectly showed residential fields (BHK instead of occupancy)

### After Optimization:
- ✅ Forms show ONLY relevant fields for each property type
- ✅ Property pages show ONLY fields with user-provided data
- ✅ Centralized field configuration ensures consistency
- ✅ Required fields are clearly marked per category
- ✅ Correct fields shown for each property type

## Architecture

### 1. Field Visibility Configuration (`src/lib/field-visibility.ts`)

Centralized configuration defining which fields are **required**, **optional**, or **hidden** for each property type.

```typescript
// Example: Land for Sale requires these fields
'land-for-sale': {
  landType: 'required',
  areaAcres: 'required',
  landFacing: 'required',
  roadAccess: 'required',
  constructionStatus: 'required',
  // ... optional and hidden fields
}

// Example: Flat for Sale
'flat-for-sale': {
  bedrooms: 'required',
  bathrooms: 'required',
  area: 'required',
  floor: 'required',
  totalFloors: 'required',
  // ... others
}
```

**Key Functions:**
- `shouldShowField()` - Check if field is visible (not hidden)
- `isFieldRequired()` - Check if field is required
- `getRequiredFields()` - Get all required fields for a category
- `shouldDisplayField()` - Show in UI only if has content OR is required
- `validateRequiredFields()` - Validate form submission

### 2. Conditional Rendering Components (`src/components/property/ConditionalFieldRenderer.tsx`)

React components for clean, maintainable conditional rendering.

```tsx
// Simple usage
<ConditionalField 
  category={formData.category} 
  fieldName="bedrooms"
>
  <FormInput label="Bedrooms" />
</ConditionalField>

// Entire section wrapper
<ConditionalSection
  category={formData.category}
  fieldNames={['bedrooms', 'bathrooms', 'balconies']}
  title="Room Details"
>
  {/* Fields inside */}
</ConditionalSection>
```

**Components:**
- `<ConditionalField>` - Wraps individual form fields
- `<ConditionalSection>` - Groups related fields
- `<RequiredFieldsInfo>` - Instructions about required fields

### 3. Property Display Utilities (`src/lib/property-display.ts`)

Determines what to display on property detail pages.

```typescript
// Get only fields with user data
const displayFields = getDisplayableFields(property);

// Group by section
const sections = getFieldsBySection(property);

// Check if section has content
const hasAmenities = hasSectionContent(property, 'amenities');
```

### 4. Property Display Component (`src/components/property/PropertyDetailsDisplay.tsx`)

Renders property details dynamically based on available data.

- Only shows dimensions section if property has bedroom/area data
- Only shows amenities if user selected them
- Only shows land details for land properties
- Automatically formats and labels all values

## Property Types & Required Fields

### Residential Buy (For Sale)

#### Flat for Sale
**Required:** Bedrooms, Bathrooms, Area, Floor, Total Floors, Facing, Property Age
**Optional:** Balconies, Furnishing, Construction Status, Possession Status

#### House for Sale
**Required:** Bedrooms, Bathrooms, Area, Facing, Property Age
**Optional:** Balconies, Floor, Total Floors, Furnishing, Construction Status

### Residential Rent

#### Flat for Rent
**Required:** Bedrooms, Bathrooms, Area, Floor, Total Floors, Facing, Furnishing Status
**Optional:** Balconies, Possession Status

#### House for Rent
**Required:** Bedrooms, Bathrooms, Area, Facing, Furnishing Status
**Optional:** Balconies, Floor, Total Floors, Possession Status

### Commercial

#### Office for Rent & Lease
**Required:** Area, Floor, Total Floors
**Optional:** Facing, Furnishing, Possession Status

#### Commercial Space for Rent & Lease
**Required:** Area
**Optional:** Floor, Total Floors, Facing, Furnishing

### Land Properties

#### Land for Sale
**Required:** Land Type, Area (acres), Facing, Road Access, Construction Status
**Optional:** Legal Clearances, Property Age

### PG Accommodations

#### PG Hostel for Boys/Girls, PG for Boys/Girls
**Required:** Occupancy, Food Included
**Optional:** Area, Furnishing, Floor, Total Floors

## Implementation Guide

### Using in PropertyForm

```tsx
import { shouldShowField, isFieldRequired } from '@/lib/field-visibility';
import { ConditionalField, ConditionalSection } from '@/components/property/ConditionalFieldRenderer';

// In your form render
<ConditionalSection
  category={formData.category}
  fieldNames={['bedrooms', 'bathrooms', 'balconies']}
  title="Room Details"
>
  <ConditionalField category={formData.category} fieldName="bedrooms">
    <Input
      value={formData.bedrooms}
      placeholder="Number of bedrooms"
      required={isFieldRequired(formData.category, 'bedrooms')}
    />
  </ConditionalField>

  <ConditionalField category={formData.category} fieldName="bathrooms">
    <Input
      value={formData.bathrooms}
      placeholder="Number of bathrooms"
      required={isFieldRequired(formData.category, 'bathrooms')}
    />
  </ConditionalField>
</ConditionalSection>
```

### Using in PropertyDetail

```tsx
import { PropertyDetailsDisplay } from '@/components/property/PropertyDetailsDisplay';

// In your detail page
<PropertyDetailsDisplay property={propertyData} />
```

This automatically:
- Shows only fields with data
- Groups related fields
- Formats values appropriately
- Handles category-specific sections

## Field Visibility Matrix

| Field | Land | Flat Sale | House Sale | Flat Rent | House Rent | Office | Commercial | PG |
|-------|------|-----------|-----------|-----------|-----------|--------|------------|-----|
| Bedrooms | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Bathrooms | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Balconies | ✗ | ◐ | ◐ | ◐ | ◐ | ✗ | ✗ | ✗ |
| Area (sqft) | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ◐ |
| Area (acres) | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Floor | ✗ | ✓ | ◐ | ✓ | ◐ | ✓ | ◐ | ◐ |
| Total Floors | ✗ | ✓ | ◐ | ✓ | ◐ | ✓ | ◐ | ◐ |
| Facing | ✗ | ✓ | ✓ | ✓ | ✓ | ◐ | ◐ | ✗ |
| Property Age | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Furnishing | ✗ | ◐ | ◐ | ✓ | ✓ | ◐ | ◐ | ◐ |
| Occupancy | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Food Included | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Land Type | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Land Facing | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Road Access | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Legal Clearances | ◐ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

Legend: ✓ = Required | ◐ = Optional | ✗ = Hidden

## Advanced Usage

### Custom Validation

```typescript
import { validateRequiredFields } from '@/lib/field-visibility';

const { valid, missing } = validateRequiredFields(formData.category, formData);
if (!valid) {
  toast.error(`Missing required fields: ${missing.join(', ')}`);
}
```

### Dynamic Form Building

```typescript
import { getVisibleFields, getRequiredFields } from '@/lib/field-visibility';

const visibleFields = getVisibleFields(category);
const requiredFields = getRequiredFields(category);

// Render fields dynamically
visibleFields.forEach(fieldName => {
  const isRequired = requiredFields.includes(fieldName);
  // Render field with appropriate validation
});
```

## Benefits

1. **Better UX** - Users see only relevant fields for their property type
2. **Cleaner Forms** - No confusion about why certain fields appear
3. **Accurate Listings** - Property pages show only user-provided information
4. **Maintainability** - All field logic in one configuration file
5. **Type Safety** - Full TypeScript support with validation
6. **Scalability** - Easy to add new property types or fields

## Migration Path

If updating existing PropertyForm or PropertyDetail:

1. Import `ConditionalField` and `ConditionalSection`
2. Wrap form inputs with `<ConditionalField>`
3. Use `isFieldRequired()` for validation attributes
4. Replace PropertyDetail with `PropertyDetailsDisplay`
5. Test all 11 property types

## Testing Checklist

Test each property type:
- [ ] Land for Sale - Shows land fields only
- [ ] Flat for Sale - Shows BHK and floors
- [ ] House for Sale - Shows BHK, optional floors
- [ ] Flat for Rent - Shows BHK, furnishing required
- [ ] House for Rent - Shows BHK, furnishing required
- [ ] Office for Rent - Shows area and floors only
- [ ] Commercial Space - Shows area only
- [ ] PG Hostel Boys - Shows occupancy and food
- [ ] PG Hostel Girls - Shows occupancy and food
- [ ] PG Boys - Shows occupancy and food
- [ ] PG Girls - Shows occupancy and food

For each property type verify:
- ✓ Only required fields are marked with asterisk
- ✓ Hidden fields don't appear in form
- ✓ Optional fields can be left blank
- ✓ Property detail page shows only provided data
- ✓ No empty sections in detail display

## Files Modified/Created

- `src/lib/field-visibility.ts` - Configuration and utilities
- `src/components/property/ConditionalFieldRenderer.tsx` - Form components
- `src/lib/property-display.ts` - Display logic
- `src/components/property/PropertyDetailsDisplay.tsx` - Detail component
- `src/components/admin/PropertyForm.tsx` - (To be updated)
- `src/pages/PropertyDetail.tsx` - (To be updated)
