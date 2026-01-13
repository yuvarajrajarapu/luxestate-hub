import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { PROPERTY_CATEGORIES } from '@/types/property';

interface PropertyFiltersProps {
  filters: {
    priceRange: [number, number];
    bhkTypes: string[];
    propertyTypes: string[];
    possessionStatus: string[];
    postedBy: string[];
    amenities: string[];
    furnishing: string[];
  };
  onFilterChange: (filters: PropertyFiltersProps['filters']) => void;
  onClearAll: () => void;
}

const PropertyFilters = ({ filters, onFilterChange, onClearAll }: PropertyFiltersProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'price',
    'bhk',
    'type',
    'possession',
    'posted',
    'amenities',
    'furnishing',
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleCheckboxChange = (
    category: keyof typeof filters,
    value: string,
    checked: boolean
  ) => {
    const currentValues = filters[category] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);
    onFilterChange({ ...filters, [category]: newValues });
  };

  const handlePriceChange = (values: number[]) => {
    onFilterChange({ ...filters, priceRange: [values[0], values[1]] });
  };

  const formatPriceLabel = (value: number) => {
    if (value >= 10000000) return `${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(0)} L`;
    return `${value.toLocaleString('en-IN')}`;
  };

  const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];
  const propertyTypeOptions = ['Apartment', 'Villa', 'Independent House', 'Builder Floor', 'Plot/Land'];
  const possessionOptions = ['Ready to Move', 'Under Construction', 'New Launch', 'Resale'];
  const postedByOptions = ['Owner', 'Dealer/Agent', 'Builder'];
  const amenityOptions = ['Covered Parking', 'Lift', 'Power Backup', 'Gym', 'Swimming Pool', 'Park/Garden', 'Security/Fire Alarm'];
  const furnishingOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];

  const FilterSection = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections.includes(id);
    return (
      <div className="border-b border-border last:border-b-0">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between py-4 text-left"
        >
          <span className="font-semibold text-foreground">{title}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="pb-4">{children}</div>
        </motion.div>
      </div>
    );
  };

  const CheckboxGroup = ({
    options,
    selected,
    category,
  }: {
    options: string[];
    selected: string[];
    category: keyof typeof filters;
  }) => (
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option} className="filter-checkbox">
          <Checkbox
            checked={selected.includes(option)}
            onCheckedChange={(checked) =>
              handleCheckboxChange(category, option, checked as boolean)
            }
          />
          <span className="text-sm text-foreground">{option}</span>
        </label>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card rounded-xl border border-border p-5 sticky top-24"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold font-display">Filter Properties</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground"
        >
          Clear All
        </Button>
      </div>

      {/* Price Range */}
      <FilterSection id="price" title="Price Range">
        <div className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            min={0}
            max={200000000}
            step={100000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPriceLabel(filters.priceRange[0])}</span>
            <span>{formatPriceLabel(filters.priceRange[1])}</span>
          </div>
        </div>
      </FilterSection>

      {/* BHK Type */}
      <FilterSection id="bhk" title="BHK Type">
        <CheckboxGroup
          options={bhkOptions}
          selected={filters.bhkTypes}
          category="bhkTypes"
        />
      </FilterSection>

      {/* Property Type */}
      <FilterSection id="type" title="Property Type">
        <CheckboxGroup
          options={propertyTypeOptions}
          selected={filters.propertyTypes}
          category="propertyTypes"
        />
      </FilterSection>

      {/* Possession Status */}
      <FilterSection id="possession" title="Possession Status">
        <CheckboxGroup
          options={possessionOptions}
          selected={filters.possessionStatus}
          category="possessionStatus"
        />
      </FilterSection>

      {/* Posted By */}
      <FilterSection id="posted" title="Posted By">
        <CheckboxGroup
          options={postedByOptions}
          selected={filters.postedBy}
          category="postedBy"
        />
      </FilterSection>

      {/* Amenities */}
      <FilterSection id="amenities" title="Amenities">
        <CheckboxGroup
          options={amenityOptions}
          selected={filters.amenities}
          category="amenities"
        />
      </FilterSection>

      {/* Furnishing */}
      <FilterSection id="furnishing" title="Furnishing">
        <CheckboxGroup
          options={furnishingOptions}
          selected={filters.furnishing}
          category="furnishing"
        />
      </FilterSection>
    </motion.div>
  );
};

export default PropertyFilters;
