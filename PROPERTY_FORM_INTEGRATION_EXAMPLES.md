/**
 * INTEGRATION EXAMPLES
 * 
 * This file shows practical examples of how to use the property form optimization
 * system in PropertyForm and PropertyDetail components.
 */

// ============================================================================
// EXAMPLE 1: USING IN PROPERTYFORM (Admin Component)
// ============================================================================

import {
  ConditionalField,
  ConditionalSection,
  RequiredFieldsInfo,
} from '@/components/property/ConditionalFieldRenderer';
import {
  shouldShowField,
  isFieldRequired,
  getRequiredFields,
} from '@/lib/field-visibility';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * BEFORE: Scattered conditionals
 * 
 * {formData.category === 'land-for-sale' && (
 *   <div>
 *     <label>Land Type</label>
 *     <select>...</select>
 *   </div>
 * )}
 * 
 * {(formData.category === 'flat-for-sale' ||
 *   formData.category === 'house-for-sale') && (
 *   <div>
 *     <label>Bedrooms</label>
 *     <input required />
 *   </div>
 * )}
 */

/**
 * AFTER: Clean, maintainable with ConditionalField
 */
export function PropertyFormExample({ formData, setFormData }) {
  return (
    <form>
      {/* Show info about required fields for this category */}
      <RequiredFieldsInfo
        category={formData.category}
        visibleFieldNames={[
          'bedrooms',
          'bathrooms',
          'area',
          'floor',
          'landType',
          'occupancy',
          // ... all possible fields
        ]}
      />

      {/* ===== RESIDENTIAL PROPERTIES (BHK) ===== */}
      <ConditionalSection
        category={formData.category}
        fieldNames={['bedrooms', 'bathrooms', 'balconies']}
        title="Room Details"
      >
        <ConditionalField category={formData.category} fieldName="bedrooms">
          <label className={isFieldRequired(formData.category, 'bedrooms') ? 'font-bold' : ''}>
            Bedrooms
            {isFieldRequired(formData.category, 'bedrooms') && (
              <span className="text-red-500">*</span>
            )}
          </label>
          <Input
            type="number"
            value={formData.bedrooms}
            onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
            placeholder="Enter number of bedrooms"
            required={isFieldRequired(formData.category, 'bedrooms')}
          />
          <small className="text-gray-500">
            {isFieldRequired(formData.category, 'bedrooms')
              ? 'Required for this property type'
              : 'Optional'}
          </small>
        </ConditionalField>

        <ConditionalField category={formData.category} fieldName="bathrooms">
          <label>Bathrooms {isFieldRequired(formData.category, 'bathrooms') && '*'}</label>
          <Input
            type="number"
            value={formData.bathrooms}
            onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
            placeholder="Enter number of bathrooms"
            required={isFieldRequired(formData.category, 'bathrooms')}
          />
        </ConditionalField>

        <ConditionalField category={formData.category} fieldName="balconies">
          <label>Balconies {isFieldRequired(formData.category, 'balconies') && '*'}</label>
          <Input
            type="number"
            value={formData.balconies}
            onChange={(e) => setFormData({ ...formData, balconies: e.target.value })}
            placeholder="Number of balconies"
            required={isFieldRequired(formData.category, 'balconies')}
          />
        </ConditionalField>
      </ConditionalSection>

      {/* ===== LAND PROPERTIES ===== */}
      <ConditionalSection
        category={formData.category}
        fieldNames={['landType', 'areaAcres', 'landFacing', 'roadAccess']}
        title="Land Details"
      >
        <ConditionalField category={formData.category} fieldName="landType">
          <label>Land Type {isFieldRequired(formData.category, 'landType') && '*'}</label>
          <Select
            value={formData.landType}
            onValueChange={(value) => setFormData({ ...formData, landType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select land type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plot">Plot</SelectItem>
              <SelectItem value="agricultural">Agricultural Land</SelectItem>
              <SelectItem value="farm-houses">Farm Houses</SelectItem>
            </SelectContent>
          </Select>
        </ConditionalField>

        <ConditionalField category={formData.category} fieldName="areaAcres">
          <label>Area (Acres) {isFieldRequired(formData.category, 'areaAcres') && '*'}</label>
          <Input
            type="number"
            step="0.01"
            value={formData.areaAcres}
            onChange={(e) => setFormData({ ...formData, areaAcres: e.target.value })}
            placeholder="Enter area in acres"
            required={isFieldRequired(formData.category, 'areaAcres')}
          />
        </ConditionalField>

        <ConditionalField category={formData.category} fieldName="landFacing">
          <label>Facing {isFieldRequired(formData.category, 'landFacing') && '*'}</label>
          <Select
            value={formData.landFacing}
            onValueChange={(value) => setFormData({ ...formData, landFacing: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select facing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north">North</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="east">East</SelectItem>
              <SelectItem value="west">West</SelectItem>
              <SelectItem value="northeast">Northeast</SelectItem>
              <SelectItem value="northwest">Northwest</SelectItem>
              <SelectItem value="southeast">Southeast</SelectItem>
              <SelectItem value="southwest">Southwest</SelectItem>
            </SelectContent>
          </Select>
        </ConditionalField>

        <ConditionalField category={formData.category} fieldName="roadAccess">
          <label>Road Access {isFieldRequired(formData.category, 'roadAccess') && '*'}</label>
          <Select
            value={formData.roadAccess}
            onValueChange={(value) => setFormData({ ...formData, roadAccess: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select road access" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="road-access">Road Access Available</SelectItem>
              <SelectItem value="no-road-access">No Road Access</SelectItem>
              <SelectItem value="partial-road-access">Partial Road Access</SelectItem>
            </SelectContent>
          </Select>
        </ConditionalField>
      </ConditionalSection>

      {/* ===== PG PROPERTIES ===== */}
      <ConditionalSection
        category={formData.category}
        fieldNames={['occupancy', 'foodIncluded']}
        title="PG Details"
      >
        <ConditionalField category={formData.category} fieldName="occupancy">
          <label>Room Type {isFieldRequired(formData.category, 'occupancy') && '*'}</label>
          <Select
            value={formData.occupancy}
            onValueChange={(value) => setFormData({ ...formData, occupancy: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select occupancy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Room</SelectItem>
              <SelectItem value="double">Double Occupancy</SelectItem>
              <SelectItem value="triple">Triple Occupancy</SelectItem>
              <SelectItem value="shared">Shared Room</SelectItem>
            </SelectContent>
          </Select>
        </ConditionalField>

        <ConditionalField category={formData.category} fieldName="foodIncluded">
          <label>Food Included {isFieldRequired(formData.category, 'foodIncluded') && '*'}</label>
          <Select
            value={formData.foodIncluded ? 'yes' : 'no'}
            onValueChange={(value) =>
              setFormData({ ...formData, foodIncluded: value === 'yes' })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Is food included?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes, Food Included</SelectItem>
              <SelectItem value="no">No, Food Not Included</SelectItem>
            </SelectContent>
          </Select>
        </ConditionalField>
      </ConditionalSection>

      <button type="submit">Save Property</button>
    </form>
  );
}

// ============================================================================
// EXAMPLE 2: USING IN PROPERTYDETAIL
// ============================================================================

import { PropertyDetailsDisplay } from '@/components/property/PropertyDetailsDisplay';
import { getDisplayableFields } from '@/lib/property-display';

/**
 * Simple usage: Just drop in the component
 */
export function PropertyDetailPageSimple({ property }) {
  return (
    <div className="container mx-auto py-6">
      <PropertyDetailsDisplay property={property} />
    </div>
  );
}

/**
 * Advanced usage: Customize with additional sections
 */
export function PropertyDetailPageAdvanced({ property }) {
  const displayableFields = getDisplayableFields(property);

  return (
    <div className="container mx-auto py-6">
      {/* Custom header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{property.title}</h1>
        <p className="text-lg text-gray-600 mt-2">
          {property.city} • Posted {new Date(property.createdAt).toLocaleDateString()}
        </p>
      </header>

      {/* Use the optimized display component */}
      <PropertyDetailsDisplay property={property} />

      {/* Additional sections */}
      <section className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Contact Seller</h2>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">{property.dealerName}</span>
            {property.isVerified && (
              <span className="ml-2 text-green-600">✓ Verified</span>
            )}
          </p>
          <p>Phone: {property.contactPhone}</p>
          {property.contactWhatsapp && (
            <p>WhatsApp: {property.contactWhatsapp}</p>
          )}
        </div>
      </section>

      {/* Show fields that are available but not displayed (for advanced users) */}
      {displayableFields.length === 0 && (
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-800">
            This property has minimal information. Contact the seller for more details.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: FORM VALIDATION
// ============================================================================

import { validateRequiredFields } from '@/lib/field-visibility';
import { toast } from 'sonner';

export function handlePropertyFormSubmit(formData) {
  // Validate required fields
  const { valid, missing } = validateRequiredFields(formData.category, formData);

  if (!valid) {
    toast.error(`Missing required fields: ${missing.join(', ')}`);
    return false;
  }

  // Validation passed, proceed with submission
  return true;
}

// ============================================================================
// EXAMPLE 4: DYNAMIC FIELD RENDERING
// ============================================================================

import { getVisibleFields, getRequiredFields } from '@/lib/field-visibility';

/**
 * Generic form builder that works for any property type
 */
export function DynamicPropertyForm({ category, onSubmit }) {
  const [formData, setFormData] = useState({});
  const visibleFields = getVisibleFields(category);
  const requiredFields = getRequiredFields(category);

  const fieldDefinitions = {
    title: {
      type: 'text',
      label: 'Property Title',
      placeholder: 'Enter property title',
    },
    description: {
      type: 'textarea',
      label: 'Description',
      placeholder: 'Describe your property',
    },
    price: {
      type: 'number',
      label: 'Price',
      placeholder: 'Enter price in rupees',
    },
    bedrooms: {
      type: 'number',
      label: 'Bedrooms',
      placeholder: 'Number of bedrooms',
    },
    // ... all other field definitions
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const { valid, missing } = validateRequiredFields(category, formData);
        if (!valid) {
          toast.error(`Missing: ${missing.join(', ')}`);
          return;
        }
        onSubmit(formData);
      }}
    >
      {visibleFields.map((fieldName) => {
        const fieldDef = fieldDefinitions[fieldName];
        if (!fieldDef) return null;

        const isRequired = requiredFields.includes(fieldName);

        return (
          <ConditionalField
            key={fieldName}
            category={category}
            fieldName={fieldName}
          >
            <label className={isRequired ? 'font-bold' : ''}>
              {fieldDef.label}
              {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type={fieldDef.type}
              placeholder={fieldDef.placeholder}
              value={formData[fieldName] || ''}
              onChange={(e) =>
                setFormData({ ...formData, [fieldName]: e.target.value })
              }
              required={isRequired}
            />
          </ConditionalField>
        );
      })}
      <button type="submit">Submit</button>
    </form>
  );
}

// ============================================================================
// USAGE SUMMARY
// ============================================================================

/**
 * Key Integration Points:
 * 
 * 1. PROPERTYFORM:
 *    - Wrap category-specific fields with <ConditionalField>
 *    - Use isFieldRequired() to set required attribute
 *    - Validate with validateRequiredFields()
 *    - Use <ConditionalSection> to group related fields
 *    - Show RequiredFieldsInfo at top of form
 * 
 * 2. PROPERTYDETAIL:
 *    - Replace display logic with <PropertyDetailsDisplay>
 *    - Component automatically shows only filled fields
 *    - Works for all 11 property types
 *    - Formats values correctly per field type
 * 
 * 3. CUSTOM NEEDS:
 *    - Use getDisplayableFields() for custom layouts
 *    - Use shouldShowField() for any condition
 *    - Use formatFieldValue() for consistent formatting
 *    - Use getVisibleFields() for generic builders
 */
