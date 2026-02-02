/**
 * Fix Property Images - Browser Console Script
 * 
 * This script fixes all properties in Firestore by adding proper Cloudinary image URLs
 * 
 * INSTRUCTIONS:
 * 1. Open https://umy-infra-gsreepy8v-yuvaraj-rajarapu-projects.vercel.app (or your deployed site)
 * 2. Open browser DevTools (F12)
 * 3. Go to Console tab
 * 4. Copy and paste this entire code
 * 5. Press Enter to run
 */

(async function fixPropertyImages() {
  // Check Firebase is available
  if (!window.firebase) {
    console.error('❌ Firebase not loaded. Make sure you are on the website page.');
    return;
  }
  
  const { collection, getDocs, doc, updateDoc, writeBatch } = window.firebase;
  const db = window.db;
  
  if (!db) {
    console.error('❌ Database instance not found.');
    return;
  }

  console.log('🔍 Starting property image fix...\n');

  // Sample Cloudinary URLs for different property types
  const imagesByCategory = {
    'flat-for-sale': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/ptobcskoaqacBahfddm.jpg',
    'house-for-sale': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/property-1.jpg',
    'land-for-sale': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/property-2.jpg',
    'flat-for-rent': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/property-3.jpg',
    'house-for-rent': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/property-4.jpg',
    'pg-boys': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/property-5.jpg',
    'pg-girls': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/property-6.jpg',
    'office-for-rent-lease': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/flat-rent.jpg',
    'commercial-space-for-rent-lease': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/farmhouse-sale.jpg',
    'pg-hostel-boys': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/agriculture-land.jpg',
    'pg-hostel-girls': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/farmhouse-rent.jpg',
  };

  const fallbackImage = 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/plot-sale.jpg';

  try {
    const snapshot = await getDocs(collection(db, 'properties'));
    console.log(`📊 Found ${snapshot.docs.length} total properties\n`);

    let updated = 0;
    let hasImages = 0;
    const batch = writeBatch(db);

    for (const propertyDoc of snapshot.docs) {
      const data = propertyDoc.data();
      const propertyId = propertyDoc.id;
      const title = data.title || 'Unnamed Property';
      const category = data.categorySlug || data.category || 'unknown';

      // Skip if already has valid images
      if (data.images && data.images.length > 0 && data.images[0].url) {
        console.log(`✅ ${propertyId}: ${title} - Already has images`);
        hasImages++;
        continue;
      }

      // Get appropriate image URL
      const imageUrl = imagesByCategory[category] || fallbackImage;

      // Create proper MediaItem structure
      const images = [{
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: imageUrl,
        publicId: `property-${propertyId}`,
        type: 'image',
        order: 1
      }];

      // Add to batch update
      batch.update(doc(db, 'properties', propertyId), {
        images: images,
        videos: data.videos || []
      });

      console.log(`📝 ${propertyId}: ${title} [${category}]`);
      updated++;
    }

    // Commit batch
    if (updated > 0) {
      console.log(`\n⏳ Saving ${updated} properties...`);
      await batch.commit();
      console.log(`\n✨ Success! Fixed ${updated} properties`);
      console.log(`📸 ${hasImages} properties already had images`);
      console.log(`🎯 Total properties: ${snapshot.docs.length}\n`);
      console.log('🔄 Refreshing page in 2 seconds...');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      console.log('\n✅ All properties already have images!');
    }

  } catch (error) {
    console.error('❌ Error fixing properties:', error);
    console.error('Details:', error.message);
  }
})();
