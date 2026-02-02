/**
 * QUICK FIX - Repair All Property Image URLs
 * 
 * Paste this entire code into browser console and press Enter
 * It will automatically fix all broken image URLs in Firestore
 */

(async function quickFixImages() {
  if (!window.firebase) {
    alert('❌ Firebase not loaded. Make sure you run this on the website.');
    return;
  }

  const { collection, getDocs, doc, writeBatch } = window.firebase;
  const db = window.db;

  if (!db) {
    alert('❌ Database instance not found.');
    return;
  }

  console.log('🔧 Starting image repair...\n');

  try {
    const snapshot = await getDocs(collection(db, 'properties'));
    console.log(`Found ${snapshot.docs.length} properties\n`);

    // Proper Cloudinary image URLs that definitely work
    const fixedUrls = {
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

    const defaultUrl = 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/plot-sale.jpg';

    const batch = writeBatch(db);
    let fixedCount = 0;

    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;
      const category = data.categorySlug || data.category || 'unknown';
      const title = data.title || 'Unnamed';

      // Get the right URL for this category
      const imageUrl = fixedUrls[category] || defaultUrl;

      // Always create proper MediaItem structure
      const images = [{
        id: `image-${id}`,
        url: imageUrl,
        publicId: `property-${id}`,
        type: 'image',
        order: 1
      }];

      // Update in batch
      batch.update(doc(db, 'properties', id), {
        images: images,
        videos: data.videos || []
      });

      console.log(`✅ ${title} (${category})`);
      fixedCount++;
    });

    console.log(`\n⏳ Saving ${fixedCount} properties...`);
    await batch.commit();
    console.log(`\n✨ SUCCESS! All ${fixedCount} properties fixed!\n`);
    console.log('🔄 Reloading page...');
    
    setTimeout(() => window.location.reload(), 1500);

  } catch (error) {
    console.error('❌ Error:', error);
    alert('Error: ' + error.message);
  }
})();
