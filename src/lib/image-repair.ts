import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc,
  writeBatch,
  query,
  where
} from 'firebase/firestore';
import { db } from './firebase';

// Cloudinary image URLs for each property category
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'flat-for-sale': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/flat-rent.jpg',
  'house-for-sale': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/property-1.jpg',
  'land-for-sale': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/plot-sale.jpg',
  'flat-for-rent': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/flat-rent.jpg',
  'house-for-rent': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/house-rent.jpg',
  'office-for-rent-lease': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/agriculture-land.jpg',
  'commercial-space-for-rent-lease': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/farmhouse-sale.jpg',
  'pg-hostel-boys': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/agriculture-land.jpg',
  'pg-hostel-girls': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/farmhouse-rent.jpg',
  'pg-boys': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/property-5.jpg',
  'pg-girls': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/property-6.jpg',
};

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/plot-sale.jpg';

/**
 * Validates if an image URL is valid
 */
function isValidImageUrl(url: any): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('https://') && url.includes('cloudinary.com');
}

/**
 * Fixes a single property's images
 */
async function fixPropertyImages(
  propertyId: string,
  data: any
): Promise<boolean> {
  try {
    // Check if already has valid images
    if (
      data.images &&
      Array.isArray(data.images) &&
      data.images.length > 0 &&
      isValidImageUrl(data.images[0]?.url)
    ) {
      return false; // No fix needed
    }

    // Determine the correct image URL based on category
    const category = data.categorySlug || data.category || 'unknown';
    const imageUrl = CATEGORY_IMAGE_MAP[category] || DEFAULT_IMAGE;

    // Create proper MediaItem structure
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
        isValidImageUrl(data.images[0]?.url)
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
    const docSnap = await (await import('firebase/firestore')).getDoc(
      doc(db, 'properties', propertyId)
    );

    if (docSnap.exists()) {
      await fixPropertyImages(propertyId, docSnap.data());
    }
  } catch (error) {
    console.error(`Error ensuring valid image for ${propertyId}:`, error);
  }
}

export default fixAllPropertyImages;
