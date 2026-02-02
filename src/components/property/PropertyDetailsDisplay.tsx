/**
 * Property Display Component
 * 
 * Dynamically displays property details based on:
 * 1. Property category
 * 2. Whether user has provided data for each field
 * 
 * Shows only relevant information, avoiding empty sections
 */

import React from 'react';
import type { Property } from '@/types/property';
import {
  getDisplayableFields,
  getFieldsBySection,
  formatFieldValue,
  getDisplayableAmenities,
  getAmenityLabel,
  hasSectionContent,
} from '@/lib/property-display';
import { Badge } from '@/components/ui/badge';

interface PropertyDetailsDisplayProps {
  property: Property;
}

/**
 * Dimensions Section - Shows BHK, area, floors (residential/commercial)
 */
const DimensionsSection: React.FC<{ property: Property }> = ({ property }) => {
  if (!hasSectionContent(property, 'dimensions')) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">Property Dimensions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {property.bedrooms && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Bedrooms</p>
            <p className="text-lg font-semibold text-gray-900">{property.bedrooms}</p>
          </div>
        )}
        {property.bathrooms && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Bathrooms</p>
            <p className="text-lg font-semibold text-gray-900">{property.bathrooms}</p>
          </div>
        )}
        {property.balconies && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Balconies</p>
            <p className="text-lg font-semibold text-gray-900">{property.balconies}</p>
          </div>
        )}
        {property.area && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Area</p>
            <p className="text-lg font-semibold text-gray-900">
              {property.area} {property.areaUnit}
            </p>
          </div>
        )}
        {property.floor && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Floor</p>
            <p className="text-lg font-semibold text-gray-900">{property.floor}</p>
          </div>
        )}
        {property.totalFloors && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Floors</p>
            <p className="text-lg font-semibold text-gray-900">{property.totalFloors}</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Features Section - Furnishing, facing, construction status
 */
const FeaturesSection: React.FC<{ property: Property }> = ({ property }) => {
  if (!hasSectionContent(property, 'features')) return null;

  const features: Array<{
    label: string;
    value: any;
    field: string;
  }> = [];

  if (property.facing) features.push({ label: 'Facing', value: property.facing, field: 'facing' });
  if (property.furnishingStatus)
    features.push({ label: 'Furnishing', value: property.furnishingStatus, field: 'furnishingStatus' });
  if (property.constructionStatus)
    features.push({ label: 'Construction', value: property.constructionStatus, field: 'constructionStatus' });
  if (property.propertyAge)
    features.push({ label: 'Property Age', value: property.propertyAge, field: 'propertyAge' });
  if (property.possessionStatus)
    features.push({ label: 'Possession', value: property.possessionStatus, field: 'possessionStatus' });

  if (features.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">Features</h3>
      <div className="space-y-2">
        {features.map((feature) => (
          <div key={feature.field} className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">{feature.label}</span>
            <span className="font-medium text-gray-900">
              {formatFieldValue(feature.field, feature.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Land Section - For land properties (plot, agricultural, farm-house)
 */
const LandSection: React.FC<{ property: Property }> = ({ property }) => {
  const hasLandInfo =
    property.landType ||
    property.areaAcres ||
    property.landFacing ||
    property.roadAccess ||
    property.legalClearances;

  if (!hasLandInfo) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">Land Details</h3>
      <div className="space-y-3">
        {property.landType && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Land Type</span>
            <span className="font-medium text-gray-900 capitalize">{property.landType}</span>
          </div>
        )}
        {property.areaAcres && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Area</span>
            <span className="font-medium text-gray-900">{property.areaAcres} acres</span>
          </div>
        )}
        {property.landFacing && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Facing</span>
            <span className="font-medium text-gray-900 capitalize">{property.landFacing}</span>
          </div>
        )}
        {property.roadAccess && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Road Access</span>
            <span className="font-medium text-gray-900 capitalize">
              {property.roadAccess === 'road-access' ? 'Available' : 'Not Available'}
            </span>
          </div>
        )}
        {property.legalClearances && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Legal Clearances</span>
            <Badge variant="outline">{property.legalClearances}</Badge>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * PG Section - Occupancy and food details
 */
const PGSection: React.FC<{ property: Property }> = ({ property }) => {
  const isPG = property.category?.includes('pg');
  if (!isPG || (!property.occupancy && property.foodIncluded === undefined)) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">PG Details</h3>
      <div className="space-y-2">
        {property.occupancy && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Room Type</span>
            <span className="font-medium text-gray-900 capitalize">{property.occupancy}</span>
          </div>
        )}
        {property.foodIncluded !== undefined && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Food Included</span>
            <Badge variant={property.foodIncluded ? 'default' : 'secondary'}>
              {property.foodIncluded ? 'Yes' : 'No'}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Amenities Section - Shows user-selected amenities only
 */
const AmenitiesSection: React.FC<{ property: Property }> = ({ property }) => {
  const displayAmenities = getDisplayableAmenities(property);

  if (displayAmenities.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">Amenities & Features</h3>
      <div className="flex flex-wrap gap-2">
        {displayAmenities.map((amenity) => (
          <Badge key={amenity} variant="secondary">
            {getAmenityLabel(amenity)}
          </Badge>
        ))}
      </div>
    </div>
  );
};

/**
 * Main Property Details Display Component
 * 
 * Combines all sections and shows only relevant content
 */
export const PropertyDetailsDisplay: React.FC<PropertyDetailsDisplayProps> = ({
  property,
}) => {
  return (
    <div className="property-details">
      {/* Property Title & Basic Info */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
        <p className="text-gray-600">
          {property.location}, {property.city}
        </p>
      </div>

      {/* Description */}
      {property.description && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 leading-relaxed">{property.description}</p>
        </div>
      )}

      {/* Price */}
      {property.price && (
        <div className="mb-6 text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Price</p>
          <p className="text-3xl font-bold text-blue-900">
            ₹{(property.price / 10000000).toFixed(2)}Cr
          </p>
          {property.pricePerSqft && (
            <p className="text-sm text-blue-600 mt-1">₹{property.pricePerSqft}/sqft</p>
          )}
        </div>
      )}

      {/* Sections - Only rendered if they have content */}
      <DimensionsSection property={property} />
      <FeaturesSection property={property} />
      <LandSection property={property} />
      <PGSection property={property} />
      <AmenitiesSection property={property} />

      {/* Location & Contact */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">Location</h3>
        <p className="text-gray-700">{property.location}</p>
        <p className="text-gray-600 text-sm mt-1">
          {property.city}, {property.state} {property.pincode}
        </p>
      </div>
    </div>
  );
};

export default PropertyDetailsDisplay;
