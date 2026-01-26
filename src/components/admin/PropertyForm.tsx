import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { collection, addDoc, doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import {
  Property,
  PropertyCategory,
  LandType,
  ListingType,
  FurnishingStatus,
  PossessionStatus,
  PostedBy,
  MediaItem,
  PROPERTY_CATEGORIES,
  getCategoryAmenities,
  shouldShowFurnishing,
  shouldShowBHK,
  shouldShowOccupancy,
} from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import MediaUploader from './MediaUploader';

interface PropertyFormProps {
  propertyId?: string;
  mode: 'create' | 'edit';
}

const PropertyForm: React.FC<PropertyFormProps> = ({ propertyId, mode }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(mode === 'edit');

  // Default dealer info
  const DEFAULT_DEALER_NAME = 'Rajarapu Uma Mahesh';
  const DEFAULT_DEALER_PHONE = '9059611547';

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as PropertyCategory,
    landType: undefined as LandType | undefined,
    listingType: 'sale' as ListingType,
    price: '',
    priceUnit: 'total' as Property['priceUnit'],
    pricePerSqft: '',
    location: '',
    city: '',
    state: '',
    pincode: '',
    area: '',
    areaUnit: 'sqft' as Property['areaUnit'],
    bedrooms: '',
    bathrooms: '',
    balconies: '',
    floor: '',
    totalFloors: '',
    propertyAge: '',
    facing: '',
    occupancy: undefined as Property['occupancy'],
    foodIncluded: false,
    furnishingStatus: undefined as FurnishingStatus | undefined,
    possessionStatus: 'ready-to-move' as PossessionStatus,
    postedBy: 'dealer' as PostedBy,
    dealerName: DEFAULT_DEALER_NAME,
    dealerPhone: DEFAULT_DEALER_PHONE,
    contactName: DEFAULT_DEALER_NAME,
    contactPhone: DEFAULT_DEALER_PHONE,
    contactWhatsapp: DEFAULT_DEALER_PHONE,
    isVerified: false,
    isFeatured: false,
    isSoldOut: false,
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);

  // Available amenities based on category
  const availableAmenities = formData.category
    ? getCategoryAmenities(formData.category)
    : [];

  // Load property for edit mode
  useEffect(() => {
    if (mode === 'edit' && propertyId) {
      loadProperty();
    }
  }, [mode, propertyId]);

  const loadProperty = async () => {
    try {
      const docRef = doc(db, 'properties', propertyId!);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Property;
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          landType: data.landType || undefined,
          listingType: data.listingType,
          price: data.price.toString(),
          priceUnit: data.priceUnit,
          pricePerSqft: data.pricePerSqft?.toString() || '',
          location: data.location,
          city: data.city,
          state: data.state,
          pincode: data.pincode || '',
          area: data.area.toString(),
          areaUnit: data.areaUnit,
          bedrooms: data.bedrooms?.toString() || '',
          bathrooms: data.bathrooms?.toString() || '',
          balconies: data.balconies?.toString() || '',
          floor: data.floor?.toString() || '',
          totalFloors: data.totalFloors?.toString() || '',
          propertyAge: data.propertyAge || '',
          facing: data.facing || '',
          occupancy: data.occupancy || undefined,
          foodIncluded: data.foodIncluded || false,
          furnishingStatus: data.furnishingStatus || undefined,
          possessionStatus: data.possessionStatus || 'ready-to-move',
          postedBy: data.postedBy || 'dealer',
          dealerName: (data as any).dealerName || DEFAULT_DEALER_NAME,
          dealerPhone: (data as any).dealerPhone || DEFAULT_DEALER_PHONE,
          contactName: data.contactName || DEFAULT_DEALER_NAME,
          contactPhone: data.contactPhone || DEFAULT_DEALER_PHONE,
          contactWhatsapp: data.contactWhatsapp || DEFAULT_DEALER_PHONE,
          isVerified: data.isVerified,
          isFeatured: data.isFeatured,
          isSoldOut: data.isSoldOut,
        });
        setSelectedAmenities(data.amenities);
        setImages(data.images || []);
        setVideos(data.videos || []);
      } else {
        toast.error('Property not found');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Failed to load property');
    } finally {
      setLoadingProperty(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update listing type based on category
    if (name === 'category') {
      const category = PROPERTY_CATEGORIES.find((c) => c.value === value);
      if (category) {
        setFormData((prev) => ({
          ...prev,
          category: value as PropertyCategory,
          listingType: category.listingType,
        }));
        // Reset amenities when category changes
        setSelectedAmenities([]);
      }
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      // Build property data, filtering out undefined values
      const propertyDataRaw: Record<string, any> = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        listingType: formData.listingType,
        price: parseFloat(formData.price),
        priceUnit: formData.priceUnit,
        location: formData.location,
        city: formData.city,
        state: formData.state,
        area: parseFloat(formData.area),
        areaUnit: formData.areaUnit,
        foodIncluded: formData.foodIncluded,
        possessionStatus: formData.possessionStatus,
        postedBy: formData.postedBy,
        dealerName: formData.dealerName,
        dealerPhone: formData.dealerPhone,
        amenities: selectedAmenities,
        images,
        videos,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        isVerified: formData.isVerified,
        isFeatured: formData.isFeatured,
        isSoldOut: formData.isSoldOut,
        updatedAt: Timestamp.now(),
        userId: user?.uid || null,
      };

      // Add optional fields only if they have values
      if (formData.pricePerSqft) propertyDataRaw.pricePerSqft = parseFloat(formData.pricePerSqft);
      if (formData.pincode) propertyDataRaw.pincode = formData.pincode;
      if (formData.bedrooms) propertyDataRaw.bedrooms = parseInt(formData.bedrooms);
      if (formData.bathrooms) propertyDataRaw.bathrooms = parseInt(formData.bathrooms);
      if (formData.balconies) propertyDataRaw.balconies = parseInt(formData.balconies);
      if (formData.floor) propertyDataRaw.floor = parseInt(formData.floor);
      if (formData.totalFloors) propertyDataRaw.totalFloors = parseInt(formData.totalFloors);
      if (formData.propertyAge) propertyDataRaw.propertyAge = formData.propertyAge;
      if (formData.facing) propertyDataRaw.facing = formData.facing;
      if (formData.occupancy) propertyDataRaw.occupancy = formData.occupancy;
      if (formData.furnishingStatus) propertyDataRaw.furnishingStatus = formData.furnishingStatus;
      if (formData.contactWhatsapp) propertyDataRaw.contactWhatsapp = formData.contactWhatsapp;
      if (formData.landType) propertyDataRaw.landType = formData.landType;

      if (mode === 'create') {
        propertyDataRaw.createdAt = Timestamp.now();
        await addDoc(collection(db, 'properties'), propertyDataRaw);
        toast.success('Property created successfully!');
      } else {
        await updateDoc(doc(db, 'properties', propertyId!), propertyDataRaw);
        toast.success('Property updated successfully!');
      }

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProperty) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="mt-4 text-slate-500">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/dashboard')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-semibold text-slate-900">
                {mode === 'create' ? 'Add New Property' : 'Edit Property'}
              </h1>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {mode === 'create' ? 'Create Property' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Luxury 3 BHK Apartment in Banjara Hills"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="category">Property Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.category === 'land-for-sale' && (
                <div>
                  <Label htmlFor="landType">Land Type *</Label>
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
              )}

              <div>
                <Label htmlFor="postedBy">Posted By *</Label>
                <Select
                  value={formData.postedBy}
                  onValueChange={(value) => handleSelectChange('postedBy', value)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="dealer">Dealer</SelectItem>
                    <SelectItem value="builder">Builder</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the property in detail..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>
            </div>
          </motion.div>

          {/* Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Pricing</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 5000000"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="priceUnit">Price Unit *</Label>
                <Select
                  value={formData.priceUnit}
                  onValueChange={(value) => handleSelectChange('priceUnit', value)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Total</SelectItem>
                    <SelectItem value="per-month">Per Month</SelectItem>
                    <SelectItem value="per-year">Per Year</SelectItem>
                    <SelectItem value="per-sqft">Per Sq.ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pricePerSqft">Price per Sq.ft (₹)</Label>
                <Input
                  id="pricePerSqft"
                  name="pricePerSqft"
                  type="number"
                  value={formData.pricePerSqft}
                  onChange={handleInputChange}
                  placeholder="Optional"
                  className="mt-1.5"
                />
              </div>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Location</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="location">Address / Locality *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Banjara Hills, Road No. 12"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Hyderabad"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="e.g., Telangana"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="e.g., 500034"
                  className="mt-1.5"
                />
              </div>
            </div>
          </motion.div>

          {/* Property Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Property Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="area">Area *</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="e.g., 1500"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="areaUnit">Area Unit *</Label>
                <Select
                  value={formData.areaUnit}
                  onValueChange={(value) => handleSelectChange('areaUnit', value)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqft">Sq.ft</SelectItem>
                    <SelectItem value="sqyd">Sq.yd</SelectItem>
                    <SelectItem value="acres">Acres</SelectItem>
                    <SelectItem value="cents">Cents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* BHK Fields - Show only for residential */}
              {shouldShowBHK(formData.category) && (
                <>
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select
                      value={formData.bedrooms}
                      onValueChange={(value) =>
                        handleSelectChange('bedrooms', value)
                      }
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

                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select
                      value={formData.bathrooms}
                      onValueChange={(value) =>
                        handleSelectChange('bathrooms', value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, '6+'].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="balconies">Balconies</Label>
                    <Select
                      value={formData.balconies}
                      onValueChange={(value) =>
                        handleSelectChange('balconies', value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, '4+'].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Occupancy - Show only for PG */}
              {shouldShowOccupancy(formData.category) && (
                <>
                  <div>
                    <Label htmlFor="occupancy">Occupancy Type</Label>
                    <Select
                      value={formData.occupancy}
                      onValueChange={(value) =>
                        handleSelectChange('occupancy', value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                        <SelectItem value="triple">Triple</SelectItem>
                        <SelectItem value="any">Any</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2 pt-7">
                    <Checkbox
                      id="foodIncluded"
                      checked={formData.foodIncluded}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange('foodIncluded', checked as boolean)
                      }
                    />
                    <Label htmlFor="foodIncluded" className="cursor-pointer">
                      Food Included
                    </Label>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  name="floor"
                  type="number"
                  value={formData.floor}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="totalFloors">Total Floors</Label>
                <Input
                  id="totalFloors"
                  name="totalFloors"
                  type="number"
                  value={formData.totalFloors}
                  onChange={handleInputChange}
                  placeholder="e.g., 10"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="propertyAge">Property Age</Label>
                <Select
                  value={formData.propertyAge}
                  onValueChange={(value) =>
                    handleSelectChange('propertyAge', value)
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Construction</SelectItem>
                    <SelectItem value="0-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">More than 10 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="facing">Facing</Label>
                <Select
                  value={formData.facing}
                  onValueChange={(value) => handleSelectChange('facing', value)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                    <SelectItem value="north">North</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="north-east">North-East</SelectItem>
                    <SelectItem value="north-west">North-West</SelectItem>
                    <SelectItem value="south-east">South-East</SelectItem>
                    <SelectItem value="south-west">South-West</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Furnishing - Show only for applicable categories */}
              {shouldShowFurnishing(formData.category) && (
                <div>
                  <Label htmlFor="furnishingStatus">Furnishing Status</Label>
                  <Select
                    value={formData.furnishingStatus}
                    onValueChange={(value) =>
                      handleSelectChange('furnishingStatus', value)
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fully-furnished">
                        Fully Furnished
                      </SelectItem>
                      <SelectItem value="semi-furnished">
                        Semi Furnished
                      </SelectItem>
                      <SelectItem value="unfurnished">Unfurnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="possessionStatus">Possession Status</Label>
                <Select
                  value={formData.possessionStatus}
                  onValueChange={(value) =>
                    handleSelectChange('possessionStatus', value)
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ready-to-move">Ready to Move</SelectItem>
                    <SelectItem value="under-construction">
                      Under Construction
                    </SelectItem>
                    <SelectItem value="new-launch">New Launch</SelectItem>
                    <SelectItem value="resale">Resale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Amenities - Dynamic based on category */}
          {formData.category && availableAmenities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                Amenities
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <Label
                      htmlFor={`amenity-${amenity}`}
                      className="cursor-pointer text-sm"
                    >
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Photos & Videos
            </h2>

            <MediaUploader
              images={images}
              videos={videos}
              onImagesChange={setImages}
              onVideosChange={setVideos}
            />
          </motion.div>

          {/* Dealer Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Dealer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="dealerName">Dealer Name *</Label>
                <Input
                  id="dealerName"
                  name="dealerName"
                  value={formData.dealerName}
                  onChange={handleInputChange}
                  placeholder="e.g., Rajarapu Uma Mahesh"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="dealerPhone">Dealer Phone *</Label>
                <Input
                  id="dealerPhone"
                  name="dealerPhone"
                  value={formData.dealerPhone}
                  onChange={handleInputChange}
                  placeholder="e.g., 9059611547"
                  required
                  className="mt-1.5"
                />
              </div>
            </div>

            <h3 className="text-md font-medium text-slate-700 mb-4 pt-4 border-t border-slate-200">
              Property Contact (displayed on listing)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder="e.g., Rajarapu Uma Mahesh"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Phone Number *</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="e.g., 9059611547"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="contactWhatsapp">WhatsApp Number</Label>
                <Input
                  id="contactWhatsapp"
                  name="contactWhatsapp"
                  value={formData.contactWhatsapp}
                  onChange={handleInputChange}
                  placeholder="Same as phone if empty"
                  className="mt-1.5"
                />
              </div>
            </div>
          </motion.div>

          {/* Status Flags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Property Status
            </h2>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isVerified"
                  checked={formData.isVerified}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('isVerified', checked as boolean)
                  }
                />
                <Label htmlFor="isVerified" className="cursor-pointer">
                  Verified Property
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('isFeatured', checked as boolean)
                  }
                />
                <Label htmlFor="isFeatured" className="cursor-pointer">
                  Featured Property
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="isSoldOut"
                  checked={formData.isSoldOut}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('isSoldOut', checked as boolean)
                  }
                />
                <Label htmlFor="isSoldOut" className="cursor-pointer">
                  Sold Out / Rented
                </Label>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {mode === 'create' ? 'Create Property' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PropertyForm;
