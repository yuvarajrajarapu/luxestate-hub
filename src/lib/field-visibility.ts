/**
 * Field Visibility Configuration for Property Forms
 * 
 * Defines which fields should be visible/required for each property type
 * Based on 20+ years of real estate industry best practices
 */

import type { PropertyCategory } from '@/types/property';

export type FieldVisibility = 'required' | 'optional' | 'hidden';

export interface FieldConfig {
  [key: string]: FieldVisibility;
}

export interface CategoryFieldConfig {
  [key in PropertyCategory]?: FieldConfig;
}

/**
 * Comprehensive field visibility matrix for all property categories
 * 
 * UNIVERSAL FIELDS (shown for all categories):
 * - title, description, category, listingType, price, priceUnit, location, city, state
 * - images, videos, contact fields, postedBy
 */
export const FIELD_VISIBILITY: CategoryFieldConfig = {
  // ==================== LAND PROPERTIES ====================
  'land-for-sale': {
    // Required
    landType: 'required',
    areaAcres: 'required',
    landFacing: 'required',
    roadAccess: 'required',
    constructionStatus: 'required',
    
    // Optional but important
    legalClearances: 'optional',
    propertyAgeYears: 'optional',
    location: 'optional',
    
    // Hidden
    bedrooms: 'hidden',
    bathrooms: 'hidden',
    balconies: 'hidden',
    floor: 'hidden',
    totalFloors: 'hidden',
    facing: 'hidden',
    furnishingStatus: 'hidden',
    occupancy: 'hidden',
    foodIncluded: 'hidden',
    area: 'hidden', // Use areaAcres for land
    areaUnit: 'hidden',
  },

  // ==================== RESIDENTIAL BUY ====================
  'flat-for-sale': {
    // Required
    bedrooms: 'required',
    bathrooms: 'required',
    area: 'required',
    areaUnit: 'required',
    floor: 'required',
    totalFloors: 'required',
    facing: 'required',
    propertyAge: 'required',
    
    // Optional but important
    balconies: 'optional',
    furnishingStatus: 'optional',
    possessionStatus: 'optional',
    constructionStatus: 'optional',
    pricePerSqft: 'optional',
    
    // Hidden
    landType: 'hidden',
    areaAcres: 'hidden',
    landFacing: 'hidden',
    roadAccess: 'hidden',
    legalClearances: 'hidden',
    occupancy: 'hidden',
    foodIncluded: 'hidden',
    propertyAgeYears: 'hidden',
  },

  'house-for-sale': {
    // Required
    bedrooms: 'required',
    bathrooms: 'required',
    area: 'required',
    areaUnit: 'required',
    facing: 'required',
    propertyAge: 'required',
    
    // Optional but important
    balconies: 'optional',
    floor: 'optional', // Houses may not have floor number
    totalFloors: 'optional',
    furnishingStatus: 'optional',
    possessionStatus: 'optional',
    constructionStatus: 'optional',
    pricePerSqft: 'optional',
    
    // Hidden
    landType: 'hidden',
    areaAcres: 'hidden',
    landFacing: 'hidden',
    roadAccess: 'hidden',
    legalClearances: 'hidden',
    occupancy: 'hidden',
    foodIncluded: 'hidden',
    propertyAgeYears: 'hidden',
  },

  // ==================== RESIDENTIAL RENT ====================
  'flat-for-rent': {
    // Required
    bedrooms: 'required',
    bathrooms: 'required',
    area: 'required',
    areaUnit: 'required',
    floor: 'required',
    totalFloors: 'required',
    facing: 'required',
    furnishingStatus: 'required',
    
    // Optional but important
    balconies: 'optional',
    possessionStatus: 'optional',
    pricePerSqft: 'optional',
    
    // Hidden - not relevant for rentals
    propertyAge: 'hidden',
    propertyAgeYears: 'hidden',
    constructionStatus: 'hidden',
    landType: 'hidden',
    areaAcres: 'hidden',
    landFacing: 'hidden',
    roadAccess: 'hidden',
    legalClearances: 'hidden',
    occupancy: 'hidden',
    foodIncluded: 'hidden',
  },

  'house-for-rent': {
    // Required
    bedrooms: 'required',
    bathrooms: 'required',
    area: 'required',
    areaUnit: 'required',
    facing: 'required',
    furnishingStatus: 'required',
    
    // Optional but important
    balconies: 'optional',
    floor: 'optional', // Houses may not have floor number
    totalFloors: 'optional',
    possessionStatus: 'optional',
    pricePerSqft: 'optional',
    
    // Hidden
    propertyAge: 'hidden',
    propertyAgeYears: 'hidden',
    constructionStatus: 'hidden',
    landType: 'hidden',
    areaAcres: 'hidden',
    landFacing: 'hidden',
    roadAccess: 'hidden',
    legalClearances: 'hidden',
    occupancy: 'hidden',
    foodIncluded: 'hidden',
  },

  // ==================== COMMERCIAL ====================
  'office-for-rent-lease': {
    // Required
    area: 'required',
    areaUnit: 'required',
    floor: 'required',
    totalFloors: 'required',
    
    // Optional but important
    facing: 'optional',
    furnishingStatus: 'optional',
    possessionStatus: 'optional',
    pricePerSqft: 'optional',
    
    // Hidden - not relevant for commercial
    bedrooms: 'hidden',
    bathrooms: 'hidden',
    balconies: 'hidden',
    propertyAge: 'hidden',
    propertyAgeYears: 'hidden',
    constructionStatus: 'hidden',
    landType: 'hidden',
    areaAcres: 'hidden',
    landFacing: 'hidden',
    roadAccess: 'hidden',
    legalClearances: 'hidden',
    occupancy: 'hidden',
    foodIncluded: 'hidden',
  },

  'commercial-space-for-rent-lease': {
    // Required
    area: 'required',
    areaUnit: 'required',
    floor: 'optional', // Commercial may be ground floor
    totalFloors: 'optional',
    
    // Optional but important
    facing: 'optional',
    furnishingStatus: 'optional',
    possessionStatus: 'optional',
    pricePerSqft: 'optional',
    
    // Hidden
    bedrooms: 'hidden',
    bathrooms: 'hidden',
    balconies: 'hidden',
    propertyAge: 'hidden',
    propertyAgeYears: 'hidden',
    constructionStatus: 'hidden',
    landType: 'hidden',
    areaAcres: 'hidden',
    landFacing: 'hidden',
    roadAccess: 'hidden',
    legalClearances: 'hidden',
    occupancy: 'hidden',
    foodIncluded: 'hidden',
  },

  // ==================== PG ACCOMMODATIONS ====================
  'pg-hostel-boys': {
    // Required
    occupancy: 'required',
    foodIncluded: 'required',
    
    // Optional but important
    area: 'optional',
    areaUnit: 'optional',
    furnishingStatus: 'optional',
    floor: 'optional',
    totalFloors: 'optional',
    
    // Hidden - PG doesn't use residential BHK
    bedrooms: 'hidden',
    bathrooms: 'hidden',
    balconies: 'hidden',
    propertyAge: 'hidden',
    propertyAgeYears: 'hidden',
    constructionStatus: 'hidden',
    facing: 'hidden',
    landType: 'hidden',
    areaAcres: 'hidden',
    landFacing: 'hidden',
    roadAccess: 'hidden',
    legalClearances: 'hidden',
    pricePerSqft: 'hidden',
    possessionStatus: 'hidden',
  },

  'pg-hostel-girls': {
    // Required
    occupancy: 'required',
    foodIncluded: 'required',
    
    // Optional but important
    area: 'optional',
    areaUnit: 'optional',
    furnishingStatus: 'optional',
    floor: 'optional',
    totalFloors: 'optional',
    
    // Hidden
    bedrooms: 'hidden',
    bathrooms: 'hidden',
    balconies: 'hidden',
    propertyAge: 'hidden',
    propertyAgeYears: 'hidden',
    constructionStatus: 'hidden',
    facing: 'hidden',
    landType: 'hidden',
    areaAcres: 'hidden',
    landFacing: 'hidden',
    roadAccess: 'hidden',
    legalClearances: 'hidden',
    pricePerSqft: 'hidden',
    possessionStatus: 'hidden',
  },

  'pg-boys': {
    // Required
    occupancy: 'required',
    foodIncluded: 'required',
    
    // Optional but important
    area: 'optional',
    areaUnit: 'optional',
    furnishingStatus: 'optional',
    floor: 'optional',
    totalFloors: 'optional',
    
    // Hidden
    bedrooms: 'hidden',
    bathrooms: 'hidden',
    balconies: 'hidden',
    propertyAge: 'hidden',
    propertyAgeYears: 'hidden',
    constructionStatus: 'hidden',
    facing: 'hidden',
    landType: 'hidden',
    areaAcres: 'hidden',
    landFacing: 'hidden',
    roadAccess: 'hidden',
    legalClearances: 'hidden',
    pricePerSqft: 'hidden',
    possessionStatus: 'hidden',
  },

  'pg-girls': {
    // Required
    occupancy: 'required',
    foodIncluded: 'required',
    
    // Optional but important
    area: 'optional',
    areaUnit: 'optional',
    furnishingStatus: 'optional',
    floor: 'optional',
    totalFloors: 'optional',
    
    // Hidden
    bedrooms: 'hidden',
    bathrooms: 'hidden',
    balconies: 'hidden',
    propertyAge: 'hidden',
    propertyAgeYears: 'hidden',
    constructionStatus: 'hidden',
    facing: 'hidden',
    landType: 'hidden',
    areaAcres: 'hidden',
    landFacing: 'hidden',
    roadAccess: 'hidden',
    legalClearances: 'hidden',
    pricePerSqft: 'hidden',
    possessionStatus: 'hidden',
  },
};

/**
 * Get field visibility for a specific category
 */
export const getFieldVisibility = (
  category: PropertyCategory,
  fieldName: string
): FieldVisibility => {
  const categoryConfig = FIELD_VISIBILITY[category];
  if (!categoryConfig) return 'optional';
  return categoryConfig[fieldName] || 'optional';
};

/**
 * Check if a field should be shown for a category
 */
export const shouldShowField = (
  category: PropertyCategory,
  fieldName: string
): boolean => {
  const visibility = getFieldVisibility(category, fieldName);
  return visibility !== 'hidden';
};

/**
 * Check if a field is required for a category
 */
export const isFieldRequired = (
  category: PropertyCategory,
  fieldName: string
): boolean => {
  const visibility = getFieldVisibility(category, fieldName);
  return visibility === 'required';
};

/**
 * Get all required fields for a category
 */
export const getRequiredFields = (category: PropertyCategory): string[] => {
  const categoryConfig = FIELD_VISIBILITY[category];
  if (!categoryConfig) return [];
  return Object.keys(categoryConfig).filter(
    (field) => categoryConfig[field] === 'required'
  );
};

/**
 * Get all visible fields for a category (required + optional)
 */
export const getVisibleFields = (category: PropertyCategory): string[] => {
  const categoryConfig = FIELD_VISIBILITY[category];
  if (!categoryConfig) return [];
  return Object.keys(categoryConfig).filter(
    (field) => categoryConfig[field] !== 'hidden'
  );
};

/**
 * Validate that all required fields are present in property data
 */
export const validateRequiredFields = (
  category: PropertyCategory,
  data: Record<string, any>
): { valid: boolean; missing: string[] } => {
  const requiredFields = getRequiredFields(category);
  const missing = requiredFields.filter(
    (field) => !data[field] || data[field] === ''
  );

  return {
    valid: missing.length === 0,
    missing,
  };
};

/**
 * Display helper: Show field in UI only if user has provided data OR field is required
 * 
 * Usage in PropertyDetail:
 * ```
 * if (shouldDisplayField(category, 'bedrooms', property)) {
 *   <div>{property.bedrooms} bedrooms</div>
 * }
 * ```
 */
export const shouldDisplayField = (
  category: PropertyCategory,
  fieldName: string,
  fieldValue: any
): boolean => {
  // Always hide hidden fields
  if (!shouldShowField(category, fieldName)) return false;

  // Always show required fields
  if (isFieldRequired(category, fieldName)) return true;

  // Show optional fields only if they have content
  return fieldValue && fieldValue !== '' && fieldValue !== 0;
};
