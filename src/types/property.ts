export type PropertyCategory = 
  | 'land-for-sale'
  | 'flat-for-sale'
  | 'house-for-sale'
  | 'house-for-rent'
  | 'flat-for-rent'
  | 'office-for-rent-lease'
  | 'commercial-space-for-rent-lease'
  | 'pg-hostel-boys'
  | 'pg-hostel-girls'
  | 'pg-boys'
  | 'pg-girls';

export type LandType = 'plot' | 'agricultural' | 'farm-houses';

export type ListingType = 'sale' | 'rent' | 'lease';

export type FurnishingStatus = 'fully-furnished' | 'semi-furnished' | 'unfurnished';

export type PossessionStatus = 'ready-to-move' | 'under-construction' | 'new-launch' | 'resale';

export type PostedBy = 'owner' | 'dealer' | 'builder';

export interface MediaItem {
  id: string;
  url: string;
  publicId: string;
  type: 'image' | 'video';
  order: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  category: PropertyCategory;
  landType?: LandType;
  listingType: ListingType;
  price: number;
  priceUnit: 'total' | 'per-month' | 'per-year' | 'per-sqft';
  pricePerSqft?: number;
  
  // Location
  location: string;
  city: string;
  state: string;
  pincode?: string;
  
  // Property Details
  area: number;
  areaUnit: 'sqft' | 'sqyd' | 'acres' | 'cents';
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  floor?: number;
  totalFloors?: number;
  propertyAge?: string;
  facing?: string;
  
  // For PG/Hostel
  occupancy?: 'single' | 'double' | 'triple' | 'any';
  foodIncluded?: boolean;
  areaAcres?: number; // For PG/Hostels
  propertyAgeYears?: number; // For PG/Hostels - numeric age in years
  constructionStatus?: 'ready-to-move' | 'under-construction' | 'new-launch' | 'resale'; // For PG/Hostels
  
  // For Land
  plotSize?: number; // For Land - plot size
  landFacing?: string; // For Land - facing direction
  roadAccess?: string; // For Land - road access details
  legalClearances?: string; // For Land - legal clearance info
  
  // Status
  furnishingStatus?: FurnishingStatus;
  possessionStatus?: PossessionStatus;
  postedBy: PostedBy;
  
  // Dealer Info
  dealerName?: string;
  dealerPhone?: string;
  
  // Amenities
  amenities: string[];
  
  // Media
  images: MediaItem[];
  videos: MediaItem[];
  
  // Contact
  contactName: string;
  contactPhone: string;
  contactWhatsapp?: string;
  
  // Verification & Status
  isVerified: boolean;
  isFeatured: boolean;
  isSoldOut: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export const PROPERTY_CATEGORIES: { value: PropertyCategory; label: string; listingType: ListingType }[] = [
  { value: 'land-for-sale', label: 'Land for Sale', listingType: 'sale' },
  { value: 'flat-for-sale', label: 'Flat for Sale', listingType: 'sale' },
  { value: 'house-for-sale', label: 'House for Sale', listingType: 'sale' },
  { value: 'house-for-rent', label: 'House for Rent', listingType: 'rent' },
  { value: 'flat-for-rent', label: 'Flat for Rent', listingType: 'rent' },
  { value: 'office-for-rent-lease', label: 'Office for Rent & Lease', listingType: 'lease' },
  { value: 'commercial-space-for-rent-lease', label: 'Commercial Space for Rent & Lease', listingType: 'lease' },
  { value: 'pg-hostel-boys', label: 'PG Hostel for Boys', listingType: 'rent' },
  { value: 'pg-hostel-girls', label: 'PG Hostel for Girls', listingType: 'rent' },
  { value: 'pg-boys', label: 'PG for Boys', listingType: 'rent' },
  { value: 'pg-girls', label: 'PG for Girls', listingType: 'rent' },
];

export const getCategoryAmenities = (category: PropertyCategory): string[] => {
  switch (category) {
    case 'flat-for-sale':
    case 'flat-for-rent':
      return [
        'Lift',
        'Covered Parking',
        'Power Backup',
        'Gym',
        'Swimming Pool',
        'Park/Garden',
        'Security/Fire Alarm',
        'Clubhouse',
        'Children Play Area',
        'Intercom',
        'Rainwater Harvesting',
        'Waste Disposal',
      ];
    case 'house-for-sale':
    case 'house-for-rent':
      return [
        'Covered Parking',
        'Power Backup',
        'Park/Garden',
        'Security/Fire Alarm',
        'Servant Room',
        'Study Room',
        'Terrace',
        'Private Garden',
        'Water Storage',
        'Rainwater Harvesting',
      ];
    case 'pg-hostel-boys':
    case 'pg-hostel-girls':
    case 'pg-boys':
    case 'pg-girls':
      return [
        'Food Included',
        'Wi-Fi',
        'Laundry',
        'Power Backup',
        'TV',
        'AC',
        'Fridge',
        'Washing Machine',
        'Study Table',
        'Wardrobe',
        'Hot Water',
        'Security',
        'Parking',
      ];
    case 'office-for-rent-lease':
    case 'commercial-space-for-rent-lease':
      return [
        'Lift',
        'Covered Parking',
        'Power Backup',
        'Central AC',
        'Fire Safety',
        'Security',
        'Cafeteria',
        'Conference Room',
        'Reception',
        'Pantry',
        'Visitor Parking',
      ];
    case 'land-for-sale':
      return [
        'Road Access',
        'Legal Clearances',
      ];
    default:
      return [];
  }
};

export const shouldShowFurnishing = (category: PropertyCategory): boolean => {
  return [
    'flat-for-sale',
    'flat-for-rent',
    'house-for-sale',
    'house-for-rent',
    'office-for-rent-lease',
  ].includes(category);
};

export const shouldShowBHK = (category: PropertyCategory): boolean => {
  return [
    'flat-for-sale',
    'flat-for-rent',
    'house-for-sale',
    'house-for-rent',
  ].includes(category);
};

export const shouldShowOccupancy = (category: PropertyCategory): boolean => {
  return [
    'pg-hostel-boys',
    'pg-hostel-girls',
    'pg-boys',
    'pg-girls',
  ].includes(category);
};
