# Property Form Optimization - Quick Reference

## What You Get

A **smart property form system** that:
1. ✅ Shows only relevant fields for each property type
2. ✅ Automatically hides irrelevant fields
3. ✅ Clearly marks required fields
4. ✅ Display pages show only user-provided information
5. ✅ Works for all 11 property types

## Quick Start Integration

### In PropertyForm Component:

```tsx
import { ConditionalField } from '@/components/property/ConditionalFieldRenderer';
import { isFieldRequired } from '@/lib/field-visibility';

// Wrap your form fields
<ConditionalField category={formData.category} fieldName="bedrooms">
  <Input
    value={formData.bedrooms}
    required={isFieldRequired(formData.category, 'bedrooms')}
  />
</ConditionalField>
```

### In PropertyDetail Page:

```tsx
import { PropertyDetailsDisplay } from '@/components/property/PropertyDetailsDisplay';

// Drop in and done!
<PropertyDetailsDisplay property={propertyData} />
```

## Field Requirements by Type

```
LAND FOR SALE               FLAT FOR SALE              HOUSE FOR SALE
✓ Land Type                 ✓ Bedrooms                 ✓ Bedrooms
✓ Area (acres)              ✓ Bathrooms                ✓ Bathrooms
✓ Facing                    ✓ Area (sqft)              ✓ Area (sqft)
✓ Road Access               ✓ Floor                    ✓ Facing
✓ Construction Status       ✓ Total Floors             ✓ Property Age
◐ Legal Clearances          ✓ Facing
◐ Property Age              ✓ Property Age
                            ◐ Furnishing
                            ◐ Balconies

FLAT FOR RENT               HOUSE FOR RENT             OFFICE FOR RENT
✓ Bedrooms                  ✓ Bedrooms                 ✓ Area (sqft)
✓ Bathrooms                 ✓ Bathrooms                ✓ Floor
✓ Area (sqft)               ✓ Area (sqft)              ✓ Total Floors
✓ Floor                     ✓ Furnishing               ◐ Facing
✓ Total Floors              ◐ Balconies                ◐ Furnishing
✓ Facing                    ◐ Possession Status        ◐ Possession
✓ Furnishing                                           
◐ Balconies

COMMERCIAL SPACE            PG HOSTEL BOYS/GIRLS       PG FOR BOYS/GIRLS
✓ Area (sqft)               ✓ Occupancy                ✓ Occupancy
◐ Floor                     ✓ Food Included            ✓ Food Included
◐ Total Floors              ◐ Area (sqft)              ◐ Area (sqft)
◐ Facing                    ◐ Furnishing               ◐ Furnishing
◐ Furnishing                ◐ Floor                    ◐ Floor
                            ◐ Total Floors             ◐ Total Floors

Legend: ✓ = Required  |  ◐ = Optional  |  ✗ = Hidden
```

## Key Functions

### Check Field Visibility

```typescript
import { shouldShowField, isFieldRequired } from '@/lib/field-visibility';

// Show field in form?
if (shouldShowField('flat-for-sale', 'bedrooms')) {
  // Show field
}

// Is field required?
if (isFieldRequired('flat-for-sale', 'bedrooms')) {
  // Mark as required
}

// Get all required fields
const required = getRequiredFields('flat-for-sale');
// Returns: ['bedrooms', 'bathrooms', 'area', 'floor', 'totalFloors', 'facing', 'propertyAge']
```

### Display Property

```typescript
import { getDisplayableFields, formatFieldValue } from '@/lib/property-display';

// Get fields to display
const fields = getDisplayableFields(property);
// Returns only fields with user-provided data

// Format value nicely
const formatted = formatFieldValue('bedrooms', 3); // "3"
const formatted = formatFieldValue('areaAcres', 2.5); // "2.5 acres"
const formatted = formatFieldValue('furnishingStatus', 'fully'); // "Fully Furnished"
```

### Validate Form

```typescript
import { validateRequiredFields } from '@/lib/field-visibility';

const { valid, missing } = validateRequiredFields('flat-for-sale', formData);
if (!valid) {
  console.log('Missing:', missing); // ['bedrooms', 'floor']
}
```

## Components

### ConditionalField
Wraps individual form inputs, controls visibility

```tsx
<ConditionalField 
  category={formData.category} 
  fieldName="bedrooms"
>
  <Input placeholder="Enter bedrooms" />
</ConditionalField>
```

### ConditionalSection
Groups related fields with header, hides if no visible fields

```tsx
<ConditionalSection
  category={formData.category}
  fieldNames={['bedrooms', 'bathrooms', 'balconies']}
  title="Room Details"
>
  {/* Fields here */}
</ConditionalSection>
```

### PropertyDetailsDisplay
Complete property detail page, shows only provided data

```tsx
<PropertyDetailsDisplay property={propertyData} />
```

## Common Patterns

### Pattern 1: Conditional Form Section
```tsx
<ConditionalSection
  category={formData.category}
  fieldNames={['landType', 'areaAcres', 'landFacing']}
  title="Land Details"
>
  <ConditionalField category={formData.category} fieldName="landType">
    <Select {...} />
  </ConditionalField>
  <ConditionalField category={formData.category} fieldName="areaAcres">
    <Input type="number" />
  </ConditionalField>
</ConditionalSection>
```

### Pattern 2: Required Field Marker
```tsx
<label>
  Bedrooms
  {isFieldRequired(formData.category, 'bedrooms') && (
    <span className="text-red-500 ml-1">*</span>
  )}
</label>
```

### Pattern 3: Form Validation
```tsx
const handleSubmit = () => {
  const { valid, missing } = validateRequiredFields(
    formData.category,
    formData
  );
  if (!valid) {
    toast.error(`Missing: ${missing.join(', ')}`);
    return;
  }
  // Submit form
};
```

### Pattern 4: Show Only If Has Data
```tsx
{property.amenities && property.amenities.length > 0 && (
  <div>
    <h3>Amenities</h3>
    {property.amenities.map(a => <Badge>{a}</Badge>)}
  </div>
)}
```

## Files to Import From

```typescript
// Configuration & Utilities
import {
  shouldShowField,
  isFieldRequired,
  getRequiredFields,
  getVisibleFields,
  validateRequiredFields,
  shouldDisplayField,
} from '@/lib/field-visibility';

// Form Components
import {
  ConditionalField,
  ConditionalSection,
  RequiredFieldsInfo,
} from '@/components/property/ConditionalFieldRenderer';

// Display Utilities
import {
  getDisplayableFields,
  getFieldsBySection,
  formatFieldValue,
  getDisplayableAmenities,
  hasSectionContent,
} from '@/lib/property-display';

// Display Component
import PropertyDetailsDisplay from '@/components/property/PropertyDetailsDisplay';
```

## Examples by Property Type

### Adding Land for Sale

```tsx
<ConditionalField category={formData.category} fieldName="landType">
  <label>Land Type {isFieldRequired(formData.category, 'landType') && '*'}</label>
  <Select value={formData.landType} onChange={...}>
    <option value="plot">Plot</option>
    <option value="agricultural">Agricultural Land</option>
    <option value="farm-houses">Farm Houses</option>
  </Select>
</ConditionalField>

<ConditionalField category={formData.category} fieldName="areaAcres">
  <label>Area in Acres {isFieldRequired(formData.category, 'areaAcres') && '*'}</label>
  <Input type="number" step="0.01" value={formData.areaAcres} />
</ConditionalField>
```

### Adding Flat for Rent

```tsx
<ConditionalField category={formData.category} fieldName="bedrooms">
  <label>Bedrooms {isFieldRequired(formData.category, 'bedrooms') && '*'}</label>
  <Input type="number" value={formData.bedrooms} />
</ConditionalField>

<ConditionalField category={formData.category} fieldName="furnishingStatus">
  <label>Furnishing {isFieldRequired(formData.category, 'furnishingStatus') && '*'}</label>
  <Select value={formData.furnishingStatus} onChange={...}>
    <option value="fully">Fully Furnished</option>
    <option value="semi">Semi Furnished</option>
    <option value="unfurnished">Unfurnished</option>
  </Select>
</ConditionalField>
```

### Adding PG

```tsx
<ConditionalField category={formData.category} fieldName="occupancy">
  <label>Room Type {isFieldRequired(formData.category, 'occupancy') && '*'}</label>
  <Select value={formData.occupancy} onChange={...}>
    <option value="single">Single</option>
    <option value="double">Double</option>
    <option value="triple">Triple</option>
  </Select>
</ConditionalField>

<ConditionalField category={formData.category} fieldName="foodIncluded">
  <label>Food Included {isFieldRequired(formData.category, 'foodIncluded') && '*'}</label>
  <Select value={formData.foodIncluded ? 'yes' : 'no'} onChange={...}>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </Select>
</ConditionalField>
```

## Testing Checklist

For each property type, verify:
- [ ] Only required/optional fields shown
- [ ] No hidden fields visible
- [ ] Required fields marked with *
- [ ] Form won't submit without required fields
- [ ] Detail page shows only provided data
- [ ] No empty sections in detail view

## Troubleshooting

**Field not showing?**
- Check: Is it hidden in `FIELD_VISIBILITY` config?
- Check: Is `shouldShowField()` returning false?

**Required field not enforced?**
- Check: Is it marked as 'required' in config?
- Check: Is validation running before submit?

**Empty sections showing?**
- Check: Use `hasSectionContent()` to hide empty sections
- Check: PropertyDetailsDisplay already handles this

**Wrong field format?**
- Check: Use `formatFieldValue()` for consistent formatting
- Check: PropertyDetailsDisplay already formats values

## Full Documentation

For detailed information, see:
- `PROPERTY_FORM_OPTIMIZATION.md` - Complete guide
- `PROPERTY_FORM_OPTIMIZATION_SUMMARY.md` - Overview & benefits
- `PROPERTY_FORM_INTEGRATION_EXAMPLES.ts` - Code examples
