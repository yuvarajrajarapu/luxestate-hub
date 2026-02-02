/**
 * Conditional Form Field Renderer
 * 
 * Renders form fields based on visibility rules for each category
 * Eliminates scattered conditionals and improves maintainability
 */

import React from 'react';
import { PropertyCategory } from '@/types/property';
import {
  shouldShowField,
  isFieldRequired,
  getFieldVisibility,
} from '@/lib/field-visibility';

export interface ConditionalFieldProps {
  category: PropertyCategory;
  fieldName: string;
  children: React.ReactNode;
  showLabel?: boolean;
  label?: string;
}

/**
 * Conditional field wrapper that handles visibility logic
 * 
 * Usage:
 * ```tsx
 * <ConditionalField category={formData.category} fieldName="bedrooms">
 *   <FormField
 *     name="bedrooms"
 *     label="Bedrooms"
 *     required={isFieldRequired(formData.category, 'bedrooms')}
 *   />
 * </ConditionalField>
 * ```
 */
export const ConditionalField: React.FC<ConditionalFieldProps> = ({
  category,
  fieldName,
  children,
  showLabel = true,
  label,
}) => {
  // Don't render if field is hidden for this category
  if (!shouldShowField(category, fieldName)) {
    return null;
  }

  const visibility = getFieldVisibility(category, fieldName);
  const isRequired = visibility === 'required';

  return (
    <div className="conditional-form-field" data-field={fieldName} data-visibility={visibility}>
      {showLabel && label && (
        <div className="field-label-wrapper">
          <span className="field-label">{label}</span>
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}
      {children}
    </div>
  );
};

/**
 * Form section wrapper for organizing related fields
 * Shows/hides entire sections based on visibility of their fields
 */
export interface ConditionalSectionProps {
  category: PropertyCategory;
  fieldNames: string[];
  title: string;
  children: React.ReactNode;
  collapse?: boolean;
}

export const ConditionalSection: React.FC<ConditionalSectionProps> = ({
  category,
  fieldNames,
  title,
  children,
  collapse = false,
}) => {
  // Check if any field in this section is visible
  const hasVisibleFields = fieldNames.some((fieldName) =>
    shouldShowField(category, fieldName)
  );

  // Don't render section if no fields are visible
  if (!hasVisibleFields) {
    return null;
  }

  return (
    <div className={`form-section ${collapse ? 'collapsed' : ''}`}>
      <h3 className="section-title">{title}</h3>
      <div className="section-content">{children}</div>
    </div>
  );
};

/**
 * Helper function to get required field asterisks for labels
 */
export const getFieldLabelSuffix = (
  category: PropertyCategory,
  fieldName: string
): string => {
  return isFieldRequired(category, fieldName) ? ' *' : '';
};

/**
 * Render all required field indicators in a form
 * Useful for instructions at the top of forms
 */
export interface RequiredFieldsInfoProps {
  category: PropertyCategory;
  visibleFieldNames: string[];
}

export const RequiredFieldsInfo: React.FC<RequiredFieldsInfoProps> = ({
  category,
  visibleFieldNames,
}) => {
  const requiredFields = visibleFieldNames.filter((field) =>
    isFieldRequired(category, field)
  );

  if (requiredFields.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
      <p className="text-sm text-blue-900">
        <span className="font-semibold">Required fields:</span> Fields marked with
        <span className="text-red-500 ml-1">*</span> are required for{' '}
        <span className="font-semibold">this property type</span>.
      </p>
    </div>
  );
};

/**
 * Batch conditional rendering helper
 * 
 * Usage for cleaner code when rendering multiple conditional fields:
 * ```tsx
 * const residentialFields = ['bedrooms', 'bathrooms', 'balconies'];
 * const renderField = createConditionalFieldRenderer(category);
 * 
 * {renderField('bedrooms', <BedroomsInput />)}
 * {renderField('bathrooms', <BathroomsInput />)}
 * ```
 */
export const createConditionalFieldRenderer = (category: PropertyCategory) => {
  return (fieldName: string, content: React.ReactNode) => (
    <ConditionalField key={fieldName} category={category} fieldName={fieldName}>
      {content}
    </ConditionalField>
  );
};
