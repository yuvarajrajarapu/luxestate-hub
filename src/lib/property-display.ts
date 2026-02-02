/**
 * Property Display Utilities
 * 
 * Handles dynamic display of property fields based on category
 * Only shows fields that have user-provided data
 */

import type { Property, PropertyCategory } from '@/types/property';
import { shouldDisplayField } from '@/lib/field-visibility';

/**
 * Get all fields that should be displayed for this property
 * Filters out empty/hidden fields based on category and content
 */
export const getDisplayableFields = (
  property: Property
): {
  field: string;
  value: any;
  label: string;
  category?: string;
}[] => {
  const category = property.category as PropertyCategory;
  const displayFields = [];

  // Define field groups and their display labels
  const fieldGroups = {
    dimensions: {
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      balconies: 'Balconies',
      area: 'Area',
      areaUnit: null, // Used with area
      areaAcres: 'Area',
      floor: 'Floor',
      totalFloors: 'Total Floors',
    },
    features: {
      facing: 'Facing',
      furnishingStatus: 'Furnishing',
      constructionStatus: 'Construction Status',
      propertyAge: 'Property Age',
      propertyAgeYears: 'Property Age',
      occupancy: 'Occupancy',
      foodIncluded: 'Food Included',
    },
    land: {
      landType: 'Land Type',
      landFacing: 'Facing',
      roadAccess: 'Road Access',
      legalClearances: 'Legal Clearances',
    },
    status: {
      possessionStatus: 'Possession',
    },
  };

  // Check each field and add if should be displayed
  const fieldConfig = [
    ...Object.entries(fieldGroups.dimensions),
    ...Object.entries(fieldGroups.features),
    ...Object.entries(fieldGroups.land),
    ...Object.entries(fieldGroups.status),
  ];

  fieldConfig.forEach(([field, label]) => {
    if (!label) return; // Skip null labels (like areaUnit)

    const value = (property as any)[field];

    // Use shouldDisplayField from field-visibility config
    if (shouldDisplayField(category, field, value)) {
      displayFields.push({
        field,
        value,
        label,
        category: Object.keys(fieldGroups).find((group) =>
          Object.keys(fieldGroups[group as keyof typeof fieldGroups]).includes(field)
        ),
      });
    }
  });

  return displayFields;
};

/**
 * Format field value for display
 */
export const formatFieldValue = (
  field: string,
  value: any,
  areaUnit?: string
): string => {
  if (!value && value !== 0 && value !== false) return '';

  switch (field) {
    case 'bedrooms':
    case 'bathrooms':
    case 'balconies':
    case 'floor':
    case 'totalFloors':
      return value.toString();

    case 'area':
      return `${value} ${areaUnit || 'sqft'}`;

    case 'areaAcres':
      return `${value} acres`;

    case 'facing':
    case 'landFacing':
      return value.charAt(0).toUpperCase() + value.slice(1);

    case 'furnishingStatus':
      const furnishingMap: Record<string, string> = {
        fully: 'Fully Furnished',
        semi: 'Semi Furnished',
        unfurnished: 'Unfurnished',
      };
      return furnishingMap[value] || value;

    case 'constructionStatus':
      const constructionMap: Record<string, string> = {
        'under-construction': 'Under Construction',
        'new-launch': 'New Launch',
        'ready-to-move': 'Ready to Move',
      };
      return constructionMap[value] || value;

    case 'possessionStatus':
      const possessionMap: Record<string, string> = {
        'ready-to-move': 'Ready to Move',
        'under-construction': 'Under Construction',
        'after-6-months': 'After 6 Months',
        'after-1-year': 'After 1 Year',
      };
      return possessionMap[value] || value;

    case 'occupancy':
      const occupancyMap: Record<string, string> = {
        single: 'Single',
        double: 'Double',
        'triple': 'Triple',
        'shared': 'Shared',
      };
      return occupancyMap[value] || value;

    case 'foodIncluded':
      return value === true ? 'Yes' : 'No';

    case 'landType':
      const landTypeMap: Record<string, string> = {
        'plot': 'Plot',
        'agricultural': 'Agricultural Land',
        'farm-houses': 'Farm Houses',
      };
      return landTypeMap[value] || value;

    case 'roadAccess':
      const roadAccessMap: Record<string, string> = {
        'road-access': 'Road Access Available',
        'no-road-access': 'No Road Access',
        'partial-road-access': 'Partial Road Access',
      };
      return roadAccessMap[value] || value;

    case 'legalClearances':
      const clearancesMap: Record<string, string> = {
        'approved': 'Approved',
        'verified': 'Verified',
        'under-process': 'Under Process',
        'not-verified': 'Not Verified',
      };
      return clearancesMap[value] || value;

    case 'propertyAge':
      const ageMap: Record<string, string> = {
        'new': 'New',
        '0-1': '0-1 Years',
        '1-5': '1-5 Years',
        '5-10': '5-10 Years',
        '10+': '10+ Years',
      };
      return ageMap[value] || value;

    case 'propertyAgeYears':
      return `${value} years`;

    default:
      return String(value);
  }
};

/**
 * Get section-wise organized fields for display
 * Groups related fields for better UI presentation
 */
export const getFieldsBySection = (
  property: Property
): Record<string, Array<{ field: string; value: string; label: string }>> => {
  const displayFields = getDisplayableFields(property);
  const sections: Record<string, typeof displayFields> = {
    dimensions: [],
    features: [],
    land: [],
    legal: [],
  };

  displayFields.forEach((item) => {
    const section = item.category || 'features';
    if (!sections[section]) {
      sections[section] = [];
    }

    sections[section].push({
      field: item.field,
      label: item.label,
      value: formatFieldValue(item.field, item.value, property.areaUnit),
    });
  });

  // Remove empty sections
  Object.keys(sections).forEach((key) => {
    if (sections[key].length === 0) {
      delete sections[key];
    }
  });

  return sections;
};

/**
 * Check if a specific amenity should be displayed
 * Shows only if user has explicitly selected it
 */
export const shouldDisplayAmenity = (amenity: string, amenities: string[]): boolean => {
  return amenities && amenities.includes(amenity);
};

/**
 * Get amenity display label
 */
export const getAmenityLabel = (amenity: string): string => {
  const amenityLabels: Record<string, string> = {
    'gym': 'Gym',
    'pool': 'Swimming Pool',
    'garden': 'Garden',
    'parking': 'Parking',
    'security': '24/7 Security',
    'lift': 'Lift',
    'water-supply': 'Water Supply',
    'power-backup': 'Power Backup',
    'intercom': 'Intercom',
    'community-center': 'Community Center',
    'play-area': 'Play Area',
    'wifi': 'WiFi',
  };
  return amenityLabels[amenity] || amenity;
};

/**
 * Get all amenities for display based on category
 * Only shows amenities the user actually provided
 */
export const getDisplayableAmenities = (property: Property): string[] => {
  if (!property.amenities || property.amenities.length === 0) {
    return [];
  }
  return property.amenities;
};

/**
 * Helper to check if a property section has any displayable content
 */
export const hasSectionContent = (
  property: Property,
  section: 'dimensions' | 'features' | 'land' | 'amenities'
): boolean => {
  const fields = getDisplayableFields(property);

  switch (section) {
    case 'dimensions':
      return fields.some((f) =>
        ['bedrooms', 'bathrooms', 'balconies', 'area', 'floor', 'totalFloors'].includes(
          f.field
        )
      );
    case 'features':
      return fields.some((f) =>
        ['facing', 'furnishingStatus', 'constructionStatus', 'propertyAge'].includes(
          f.field
        )
      );
    case 'land':
      return fields.some((f) =>
        ['landType', 'landFacing', 'roadAccess', 'legalClearances'].includes(f.field)
      );
    case 'amenities':
      return getDisplayableAmenities(property).length > 0;
    default:
      return false;
  }
};
