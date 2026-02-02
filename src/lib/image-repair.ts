import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265';

// Cloudinary image URLs for each property category
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'flat-for-sale': `${CLOUDINARY_BASE_URL}/flat-rent.jpg`,
  'house-for-sale': `${CLOUDINARY_BASE_URL}/property-1.jpg`,
  'land-for-sale': `${CLOUDINARY_BASE_URL}/plot-sale.jpg`,
  'flat-for-rent': `${CLOUDINARY_BASE_URL}/flat-rent.jpg`,
  'house-for-rent': `${CLOUDINARY_BASE_URL}/house-rent.jpg`,
  'office-for-rent-lease': `${CLOUDINARY_BASE_URL}/agriculture-land.jpg`,
  'commercial-space-for-rent-lease': `${CLOUDINARY_BASE_URL}/farmhouse-sale.jpg`,
  'pg-hostel-boys': `${CLOUDINARY_BASE_URL}/agriculture-land.jpg`,
  'pg-hostel-girls': `${CLOUDINARY_BASE_URL}/farmhouse-rent.jpg`,
  'pg-boys': `${CLOUDINARY_BASE_URL}/property-5.jpg`,
  'pg-girls': `${CLOUDINARY_BASE_URL}/property-6.jpg`,
};

const DEFAULT_IMAGE = `${CLOUDINARY_BASE_URL}/plot-sale.jpg`;

/**
 * Convert a Cloudinary public ID to a full URL
 */
function publicIdToUrl(publicId: string | any): string {
  if (!publicId || typeof publicId !== 'string') {
    return DEFAULT_IMAGE;
  }

  // If already a full URL with correct version, return as-is
  if (publicId.startsWith('https://') && publicId.includes('/v1763830265/')) {
    return publicId;
  }

  // If it's a full URL with WRONG version, fix it
  if (publicId.startsWith('https://')) {
    return publicId.replace(/\/v\d+\//, '/v1763830265/').replace(/\.png$/, '.jpg');
  }

  // Remove .png, .jpg, etc if present in public ID
  const cleaned = publicId.replace(/\.(png|jpg|jpeg|gif|webp)$/i, '');

  // Build full Cloudinary URL with correct version
  return `${CLOUDINARY_BASE_URL}/${cleaned}.jpg`;
}

/**
 * Validates if a URL is a valid Cloudinary URL with correct version
 */
function isValidCloudinaryUrl(url: any): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('https://') && 
         url.includes('cloudinary.com') && 
         url.includes('/v1763830265/');
}

/**
 * Fixes a single property's images
 */
async function fixPropertyImages(
  propertyId: string,
  data: any
): Promise<boolean> {
  try {
    let needsFix = false;
    let imageUrl: string = DEFAULT_IMAGE;

    // Case 1: Has images array
    if (
      data.images &&
      Array.isArray(data.images) &&
      data.images.length > 0
    ) {
      const firstImage = data.images[0];
      
      // If URL is valid Cloudinary with correct version, no fix needed
      if (isValidCloudinaryUrl(firstImage?.url) && firstImage?.url?.includes('/v1763830265/')) {
        return false;
      }

      // If URL has WRONG version or invalid format, FIX IT
      if (firstImage?.url) {
        // Check if it's a full URL that needs version fix
        if (firstImage.url.startsWith('https://') && firstImage.url.includes('cloudinary.com')) {
          // Has wrong version - replace it
          imageUrl = firstImage.url.replace(/\/v\d+\//, '/v1763830265/').replace(/\.png$/, '.jpg');
          needsFix = true;
        } else {
          // Not a proper URL - convert from public ID
          imageUrl = publicIdToUrl(firstImage.url);
          needsFix = true;
        }
      } else if (firstImage?.publicId) {
        imageUrl = publicIdToUrl(firstImage.publicId);
        needsFix = true;
      } else {
        // No URL or publicId, use category-based image
        const category = data.categorySlug || data.category || 'unknown';
        imageUrl = CATEGORY_IMAGE_MAP[category] || DEFAULT_IMAGE;
        needsFix = true;
      }
    } else {
      // Case 2: No images at all - use category-based image
      const category = data.categorySlug || data.category || 'unknown';
      imageUrl = CATEGORY_IMAGE_MAP[category] || DEFAULT_IMAGE;
      needsFix = true;
    }

    // If no fixes needed, skip
    if (!needsFix) {
      return false;
    }

    // Create proper MediaItem structure with fixed URL
    const images = [
      {
        id: `image-${propertyId}`,
        url: imageUrl,
        publicId: `property-${propertyId}`,
        type: 'image',
        order: 1,
      },
    ];

    // Update the property
    await updateDoc(doc(db, 'properties', propertyId), {
      images: images,
      videos: data.videos || [],
    });

    console.log(`✅ Fixed images for property: ${data.title || propertyId}`);
    return true;
  } catch (error) {
    console.error(`Error fixing property ${propertyId}:`, error);
    return false;
  }
}

/**
 * Global fix for all properties with missing/invalid images
 * Runs automatically on app initialization
 */
export async function fixAllPropertyImages(): Promise<void> {
  try {
    console.log('🔧 Starting global property image repair...');

    const snapshot = await getDocs(collection(db, 'properties'));
    console.log(`📊 Found ${snapshot.docs.length} properties`);

    let fixedCount = 0;
    let alreadyValidCount = 0;

    // Process each property
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const propertyId = docSnap.id;

      // Check if needs fixing
      if (
        data.images &&
        Array.isArray(data.images) &&
        data.images.length > 0 &&
        isValidCloudinaryUrl(data.images[0]?.url)
      ) {
        alreadyValidCount++;
        continue;
      }

      // Fix the property
      const fixed = await fixPropertyImages(propertyId, data);
      if (fixed) {
        fixedCount++;
      }
    }

    console.log(`\n📊 REPAIR SUMMARY:`);
    console.log(`   ✅ Fixed: ${fixedCount} properties`);
    console.log(`   ✓ Already valid: ${alreadyValidCount} properties`);
    console.log(`   📦 Total: ${snapshot.docs.length} properties`);

    if (fixedCount > 0) {
      console.log(`\n✨ Global property image repair completed!`);
    }
  } catch (error) {
    console.error('Error in global property image fix:', error);
  }
}

/**
 * Check and fix images for a single property (on-demand)
 */
export async function ensurePropertyHasValidImage(propertyId: string): Promise<void> {
  try {
    const { getDoc } = await import('firebase/firestore');
    const docSnap = await getDoc(doc(db, 'properties', propertyId));

    if (docSnap.exists()) {
      await fixPropertyImages(propertyId, docSnap.data());
    }
  } catch (error) {
    console.error(`Error ensuring valid image for ${propertyId}:`, error);
  }
}

/**
 * Convert public ID to full URL (for use in components)
 */
export function getCloudinaryUrl(publicIdOrUrl: string): string {
  return publicIdToUrl(publicIdOrUrl);
}

export default fixAllPropertyImages;
