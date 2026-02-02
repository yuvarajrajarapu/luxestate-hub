/**
 * Image Loading Debug Guide
 * 
 * If property images are not loading, follow these steps:
 */

// 1. Check Firebase Document Structure
// Ensure properties in Firestore have the correct structure:
// {
//   id: string,
//   title: string,
//   images: [
//     {
//       id: string,
//       url: string (Cloudinary URL),
//       publicId: string,
//       type: 'image',
//       order: number
//     }
//   ],
//   ...otherFields
// }

// 2. Verify Cloudinary Configuration
// Check that CLOUD_NAME and UPLOAD_PRESET are correct in src/lib/cloudinary.ts
const CLOUD_NAME = 'dswoyink7';
const UPLOAD_PRESET = 'yuvainfraedge';

// 3. Check URLs Format
// Images should be stored as Cloudinary URLs:
// https://res.cloudinary.com/dswoyink7/image/upload/v123456/filename.jpg

// 4. Test Image Loading
// Open browser DevTools > Network tab and check:
// - Are image requests being made?
// - What's the response status (200, 404, 403)?
// - Check CORS headers if requests are failing

// 5. Check PropertyCard Props
// Verify property object has images array:
// console.log(property.images)

// 6. Use PropertyImage Component
// PropertyCard now uses <PropertyImage> which handles:
// - Empty images arrays
// - Missing URLs
// - Failed image loads
// - Cloudinary URL optimization

// 7. Migration Script
// If images need to be migrated or fixed, use:
// npm run ts-node migrate-properties.ts

// 8. Common Issues
// Issue: Images array is empty
// Solution: Check if migration script was run

// Issue: 404 on image load
// Solution: Verify Cloudinary URLs are correct format

// Issue: CORS errors
// Solution: Ensure Cloudinary account allows cross-origin requests

// Issue: Images load slow
// Solution: PropertyImage component auto-optimizes Cloudinary URLs with:
// - Quality: auto:best (adaptive quality)
// - Format: auto (uses WebP if supported)
// - Width: 800px (responsive sizing)
// - Fill: c_fill (maintains aspect ratio)

export const imageDebugTips = {
  verifyStructure: () => {
    // In Firebase Console:
    // 1. Go to Firestore Database
    // 2. Check 'properties' collection
    // 3. Open a document and verify images field exists
    console.log('Check Firebase structure');
  },

  checkCloudinary: () => {
    // In Cloudinary Dashboard:
    // 1. Verify cloud name: dswoyink7
    // 2. Verify upload preset: yuvainfraedge
    // 3. Check CORS settings in account
    console.log('Check Cloudinary settings');
  },

  testImageUrl: (url: string) => {
    // Test if a Cloudinary URL is valid
    const img = new Image();
    img.onload = () => console.log('Image loads successfully:', url);
    img.onerror = () => console.error('Image failed to load:', url);
    img.src = url;
  },

  migrateImages: () => {
    // Run this to migrate/fix images in Firestore
    // npm run ts-node migrate-properties.ts
    console.log('Run migration script');
  },
};
