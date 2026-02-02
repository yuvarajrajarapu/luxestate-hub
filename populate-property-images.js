/**
 * Populate Property Images Script
 * 
 * This script adds Cloudinary image URLs to existing properties
 * Run this in the browser console or as a Node.js script
 */

(async function populateImages() {
  const { 
    collection, 
    getDocs, 
    doc, 
    updateDoc,
    initializeApp,
    getFirestore 
  } = window.firebase;
  
  if (!collection) {
    console.error('Firebase not loaded. Run this in browser console on the website.');
    return;
  }
  
  const db = window.db;
  
  if (!db) {
    console.error('Database not found.');
    return;
  }

  // Cloudinary Image URLs - Map property type to image URL
  const cloudinaryImages = {
    'flat-for-sale': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/flat-sale_kwmzvx.jpg',
    'house-for-sale': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/house-sale_abcdef.jpg',
    'land-for-sale': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/land-sale_ghijkl.jpg',
    'flat-for-rent': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/flat-rent_mnopqr.jpg',
    'house-for-rent': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/house-rent_stuvwx.jpg',
    'pg-boys': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/pg-boys_yzabcd.jpg',
    'pg-girls': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/pg-girls_efghij.jpg',
    'office-for-rent-lease': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/office_klmnop.jpg',
    'commercial-space-for-rent-lease': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/commercial_qrstuv.jpg',
  };

  // Fallback image
  const fallbackImage = 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/property-placeholder_default.jpg';

  console.log('Starting property image population...');
  
  try {
    const snapshot = await getDocs(collection(db, 'properties'));
    let updated = 0;
    let skipped = 0;
    
    for (const propertyDoc of snapshot.docs) {
      const data = propertyDoc.data();
      const propertyId = propertyDoc.id;
      
      // Check if property already has images
      if (data.images && data.images.length > 0) {
        console.log(`✓ ${propertyId} - Already has images`);
        skipped++;
        continue;
      }
      
      // Get image URL based on category
      const category = data.category || data.categorySlug;
      const imageUrl = cloudinaryImages[category] || fallbackImage;
      
      // Create media item
      const images = [{
        id: `image-1-${propertyId}`,
        url: imageUrl,
        publicId: `property-${propertyId}`,
        type: 'image',
        order: 1
      }];
      
      // Update property with images
      await updateDoc(doc(db, 'properties', propertyId), {
        images: images,
        videos: []
      });
      
      console.log(`✅ ${propertyId} - Added image for ${category}`);
      updated++;
    }
    
    console.log(`\n🎉 Complete! Updated ${updated} properties with images.`);
    console.log(`Skipped: ${skipped} (already have images)`);
    console.log('Please refresh the page to see your property images.');
    
  } catch (error) {
    console.error('❌ Error populating images:', error);
  }
})();
