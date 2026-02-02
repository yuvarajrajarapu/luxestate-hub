/**
 * PropertyForm Refactoring Guide
 * Step-by-step instructions to optimize PropertyForm.tsx using field visibility system
 */

# PropertyForm Optimization - Implementation Guide

## Current State
- **File:** `src/components/admin/PropertyForm.tsx` (1,269 lines)
- **Issues:** Scattered conditionals, redundant fields, unclear requirements
- **Opportunity:** Use field visibility system to simplify and optimize

## Step-by-Step Refactoring Plan

### Phase 1: Add Imports (5 minutes)

Add these imports to PropertyForm.tsx:

```typescript
// Add to existing imports at top of file
import {
  ConditionalField,
  ConditionalSection,
  RequiredFieldsInfo,
} from '@/components/property/ConditionalFieldRenderer';

import {
  shouldShowField,
  isFieldRequired,
  getRequiredFields,
  validateRequiredFields,
} from '@/lib/field-visibility';
```

### Phase 2: Refactor Form Structure (30 minutes)

#### 2.1 Add Required Fields Info (Top of Property Details Section)

**Before:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* All fields mixed together */}
</div>
```

**After:**
```tsx
<motion.div>
  <h2 className="text-lg font-semibold text-slate-900 mb-6">
    Property Details
  </h2>
  
  {/* Show which fields are required for this category */}
  <RequiredFieldsInfo
    category={formData.category}
    visibleFieldNames={[
      'area', 'areaUnit', 'bedrooms', 'bathrooms', 'floor', 
      'totalFloors', 'facing', 'propertyAge', 'landType', 
      'occupancy', 'foodIncluded'
    ]}
  />

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Fields below */}
  </div>
</motion.div>
```

#### 2.2 Replace Land Section Conditionals

**Before:**
```tsx
{formData.category === 'land-for-sale' && (
  <>
    <div>
      <Label htmlFor="plotSize">Plot Size</Label>
      {/* Input field */}
    </div>
    <div>
      <Label htmlFor="landType">Land Type</Label>
      {/* Select */}
    </div>
    {/* More land fields */}
  </>
)}
```

**After:**
```tsx
<ConditionalSection
  category={formData.category}
  fieldNames={['landType', 'areaAcres', 'landFacing', 'roadAccess', 'legalClearances']}
  title="Land-Specific Details"
>
  <ConditionalField category={formData.category} fieldName="landType">
    <div>
      <Label htmlFor="landType">
        Land Type
        {isFieldRequired(formData.category, 'landType') && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select
        value={formData.landType || ''}
        onValueChange={(value) => handleSelectChange('landType', value)}
      >
        <SelectTrigger className="mt-1.5">
          <SelectValue placeholder="Select land type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="plot">Plot</SelectItem>
          <SelectItem value="agricultural">Agricultural</SelectItem>
          <SelectItem value="farm-houses">Farm Houses</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </ConditionalField>

  {/* Repeat for other land fields */}
</ConditionalSection>
```

#### 2.3 Replace BHK Fields Section

**Before:**
```tsx
{shouldShowBHK(formData.category) && (
  <>
    <div>
      <Label htmlFor="bedrooms">Bedrooms</Label>
      {/* BHK selector */}
    </div>
    <div>
      <Label htmlFor="bathrooms">Bathrooms</Label>
      {/* BHK selector */}
    </div>
    {/* More fields */}
  </>
)}
```

**After:**
```tsx
<ConditionalSection
  category={formData.category}
  fieldNames={['bedrooms', 'bathrooms', 'balconies', 'floor', 'totalFloors', 'facing']}
  title="Room Details"
>
  <ConditionalField category={formData.category} fieldName="bedrooms">
    <div>
      <Label htmlFor="bedrooms">
        Bedrooms
        {isFieldRequired(formData.category, 'bedrooms') && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select
        value={formData.bedrooms}
        onValueChange={(value) => handleSelectChange('bedrooms', value)}
      >
        <SelectTrigger className="mt-1.5">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5, 6, '7+'].map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num} BHK
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </ConditionalField>

  {/* Other fields follow same pattern */}
</ConditionalSection>
```

#### 2.4 Replace PG Section

**Before:**
```tsx
{(formData.category === 'pg-hostel-boys' || 
  formData.category === 'pg-hostel-girls' || 
  formData.category === 'pg-boys' || 
  formData.category === 'pg-girls') && (
  <>
    <div>
      <Label>Occupancy Type</Label>
      {/* Select */}
    </div>
    <div>
      <Checkbox>Food Included</Checkbox>
    </div>
  </>
)}
```

**After:**
```tsx
<ConditionalSection
  category={formData.category}
  fieldNames={['occupancy', 'foodIncluded', 'areaAcres']}
  title="PG/Hostel Details"
>
  <ConditionalField category={formData.category} fieldName="occupancy">
    <div>
      <Label htmlFor="occupancy">
        Room Type
        {isFieldRequired(formData.category, 'occupancy') && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select
        value={formData.occupancy}
        onValueChange={(value) => handleSelectChange('occupancy', value)}
      >
        <SelectTrigger className="mt-1.5">
          <SelectValue placeholder="Select room type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="single">Single</SelectItem>
          <SelectItem value="double">Double</SelectItem>
          <SelectItem value="triple">Triple</SelectItem>
          <SelectItem value="any">Any</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </ConditionalField>

  <ConditionalField category={formData.category} fieldName="foodIncluded">
    <div className="flex items-center gap-2 pt-2">
      <Checkbox
        id="foodIncluded"
        checked={formData.foodIncluded}
        onCheckedChange={(checked) =>
          handleCheckboxChange('foodIncluded', checked as boolean)
        }
      />
      <Label htmlFor="foodIncluded" className="cursor-pointer">
        Food Included
        {isFieldRequired(formData.category, 'foodIncluded') && <span className="text-red-500 ml-1">*</span>}
      </Label>
    </div>
  </ConditionalField>
</ConditionalSection>
```

### Phase 3: Update Validation (15 minutes)

#### 3.1 Add to handleSubmit function

**Before:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Manual validation
  if (!formData.title) {
    toast.error('Please enter property title');
    return;
  }
  // More manual checks...
};
```

**After:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Use centralized validation
  const { valid, missing } = validateRequiredFields(formData.category, formData);
  
  if (!valid) {
    toast.error(`Missing required fields: ${missing.join(', ')}`);
    return;
  }

  // Continue with submission...
  setLoading(true);
  try {
    // ... existing submission logic
  } catch (error) {
    toast.error('Error saving property');
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### Phase 4: Update Form Data Saving (10 minutes)

The current saveProperty logic should work as-is, but add this check:

```typescript
// In the form data preparation, before Firebase save
const propertyDataRaw: any = {
  // ... existing fields

  // Category mapping (already done but confirm)
  categorySlug: categoryMapping.categorySlug,
  mainCategory: categoryMapping.mainCategory,
  listingType: categoryMapping.listingType,
};

// Only save fields that are non-empty for this category
Object.keys(formData).forEach((key) => {
  const value = (formData as any)[key];
  
  // Skip empty values and fields not visible for this category
  if (value && value !== '' && shouldShowField(formData.category, key)) {
    propertyDataRaw[key] = value;
  }
});
```

### Phase 5: Testing Checklist (1 hour)

Test each property type and verify:

#### Land for Sale
- [ ] Shows: Land Type, Area (acres), Facing, Road Access, Construction Status
- [ ] Hides: Bedrooms, Bathrooms, Floor fields
- [ ] Required fields marked with *
- [ ] Form won't submit without Land Type, Area, Facing, Road Access

#### Flat for Sale
- [ ] Shows: Area, Bedrooms, Bathrooms, Floor, Total Floors, Facing, Property Age
- [ ] Hides: Land Type, Road Access, Occupancy
- [ ] Required fields marked correctly
- [ ] Optional fields can be left blank

#### House for Sale
- [ ] Shows: Area, Bedrooms, Bathrooms, Facing, Property Age
- [ ] Floor and Total Floors optional (not required)
- [ ] Test with and without floor info

#### Flat for Rent
- [ ] Shows: Area, Bedrooms, Bathrooms, Floor, Facing, Furnishing
- [ ] Furnishing Status is REQUIRED (different from sale)
- [ ] Property Age HIDDEN
- [ ] Form validates correctly

#### House for Rent
- [ ] Shows: Area, Bedrooms, Bathrooms, Facing, Furnishing
- [ ] Floor optional
- [ ] Furnishing required

#### Commercial (Office & Space)
- [ ] Shows: Area only (minimal)
- [ ] Bedrooms, Bathrooms hidden
- [ ] Floor/Total Floors optional
- [ ] Clean, simple form

#### PG Types (All 4)
- [ ] Shows: Occupancy (required), Food Included (required)
- [ ] Bedrooms HIDDEN (not used for PG)
- [ ] Occupancy is NOT BHK - it's Single/Double/Triple
- [ ] Form clean and focused

### Phase 6: Deployment (30 minutes)

1. **Backup current PropertyForm.tsx**
   ```bash
   cp src/components/admin/PropertyForm.tsx src/components/admin/PropertyForm.backup.tsx
   ```

2. **Make all changes and test locally**
   ```bash
   npm run dev
   ```

3. **Test in browser**
   - Add a new property in each category
   - Verify fields show/hide correctly
   - Test form validation
   - Test submission

4. **Commit changes**
   ```bash
   git add .
   git commit -m "Refactor PropertyForm to use field visibility system

   - Replaced scattered conditionals with ConditionalField components
   - Added ConditionalSection for field grouping
   - Updated validation to use validateRequiredFields
   - Marked required fields dynamically per category
   - Optimized form for all 11 property types
   - Reduced form complexity significantly
   - Improved user experience"
   ```

5. **Deploy to production**
   ```bash
   git push
   # Vercel auto-deploys
   ```

6. **Monitor**
   - Check for errors in browser console
   - Monitor admin panel for form submission issues
   - Collect user feedback

---

## Summary of Changes

### Before Optimization
- 1,269 lines of code
- Scattered conditionals throughout
- Unclear which fields are required
- Redundant field definitions
- Hard to maintain and extend

### After Optimization
- ~600 lines (50% reduction)
- Clean, component-based structure
- Clear required/optional indicators
- Centralized configuration
- Easy to add new types

### Benefits
✓ Better UX - Users see only relevant fields
✓ Cleaner code - No scattered conditionals
✓ Easier maintenance - All rules in one file
✓ Better validation - Centralized checks
✓ Scalable - Add new types without changing form

---

## Timeline
- Phase 1 (Imports): 5 minutes
- Phase 2 (Structure): 30 minutes
- Phase 3 (Validation): 15 minutes
- Phase 4 (Saving): 10 minutes
- Phase 5 (Testing): 1 hour
- Phase 6 (Deploy): 30 minutes
- **Total: 2-3 hours**

---

## Troubleshooting

**Issue:** Fields still showing when they should be hidden
- **Solution:** Check `FIELD_VISIBILITY` config in `src/lib/field-visibility.ts`

**Issue:** Required field not enforced
- **Solution:** Verify field is marked as 'required' in config and validation is running

**Issue:** Form too narrow for all fields
- **Solution:** Existing responsive classes (md:col-span) should handle, adjust grid if needed

**Issue:** Old form behavior still there
- **Solution:** Make sure to remove/comment out old conditional logic

---

## Files to Modify

1. **src/components/admin/PropertyForm.tsx** - Main refactoring
2. **No other files need changes** - Field visibility system already in place

## Files Already Available

- `src/lib/field-visibility.ts` - Configuration
- `src/components/property/ConditionalFieldRenderer.tsx` - Components
- `src/lib/property-display.ts` - Display utilities
- `PROPERTY_FORM_FIELD_SUMMARY.md` - Reference guide (this document)
