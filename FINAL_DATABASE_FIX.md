/**
 * NUCLEAR FIX - Complete Database Repair
 * 
 * This script will:
 * 1. Find ALL properties with wrong/broken image URLs
 * 2. Replace them with CORRECT Cloudinary URLs
 * 3. Update Firestore immediately
 * 4. Reload page to show results
 * 
 * PASTE THIS IN BROWSER CONSOLE AND PRESS ENTER
 */

(async function nukeAndFix() {
  if (!window.firebase) {
    alert('❌ Firebase not loaded');
    return;
  }

  const { collection, getDocs, doc, writeBatch } = window.firebase;
  const db = window.db;

  if (!db) {
    alert('❌ DB not found');
    return;
  }

  console.log('🔥 NUCLEAR IMAGE FIX - Starting...\n');

  try {
    const batch = writeBatch(db);
    const snapshot = await getDocs(collection(db, 'properties'));
    
    console.log(`Found ${snapshot.docs.length} properties\n`);

    // Base URL with CORRECT version
    const BASE = 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265';

    // Image mapping by category
    const imageMap = {
      'flat-for-sale': `${BASE}/flat-rent.jpg`,
      'house-for-sale': `${BASE}/property-1.jpg`,
      'land-for-sale': `${BASE}/plot-sale.jpg`,
      'flat-for-rent': `${BASE}/flat-rent.jpg`,
      'house-for-rent': `${BASE}/house-rent.jpg`,
      'office-for-rent-lease': `${BASE}/agriculture-land.jpg`,
      'commercial-space-for-rent-lease': `${BASE}/farmhouse-sale.jpg`,
      'pg-hostel-boys': `${BASE}/agriculture-land.jpg`,
      'pg-hostel-girls': `${BASE}/farmhouse-rent.jpg`,
      'pg-boys': `${BASE}/property-5.jpg`,
      'pg-girls': `${BASE}/property-6.jpg`,
    };

    const fallback = `${BASE}/plot-sale.jpg`;

    let fixed = 0;

    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;
      const title = data.title || 'Unknown';
      const category = data.categorySlug || data.category || 'unknown';

      // Determine if needs fix
      let needsFix = true;
      
      if (data.images && data.images[0]?.url) {
        const url = data.images[0].url;
        // Only skip if it's a valid URL with correct version
        if (url.startsWith(`${BASE}/`) && !url.includes('v1768303065')) {
          needsFix = false;
        }
      }

      if (!needsFix) {
        return;
      }

      // Get correct image URL
      const imageUrl = imageMap[category] || fallback;

      // Update with correct data
      batch.update(doc(db, 'properties', id), {
        images: [{
          id: `image-${id}`,
          url: imageUrl,
          publicId: `property-${id}`,
          type: 'image',
          order: 1
        }],
        videos: data.videos || []
      });

      console.log(`✅ ${title.substring(0, 30)}`);
      fixed++;
    });

    if (fixed === 0) {
      console.log('✓ All images already correct!');
      return;
    }

    console.log(`\n⏳ Saving ${fixed} properties to Firestore...`);
    await batch.commit();
    console.log(`✨ SUCCESS! Fixed ${fixed}/${snapshot.docs.length} properties\n`);
    console.log('🔄 Reloading page...');
    
    setTimeout(() => {
      window.location.reload();
    }, 2000);

  } catch (error) {
    console.error('ERROR:', error);
    alert('Error: ' + error.message);
  }
})();
