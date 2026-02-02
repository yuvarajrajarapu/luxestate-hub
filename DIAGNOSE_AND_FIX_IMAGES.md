/**
 * DIAGNOSTIC & FIX SCRIPT - Property Image URLs
 * 
 * Run this in browser console to:
 * 1. See what image URLs are currently in the database
 * 2. Fix them with proper Cloudinary URLs
 * 
 * INSTRUCTIONS:
 * 1. Open https://your-site.vercel.app
 * 2. Open DevTools (F12) → Console
 * 3. Copy and paste this entire script
 * 4. Press Enter
 */

(async function diagnosisAndFix() {
  if (!window.firebase) {
    console.error('❌ Firebase not loaded');
    return;
  }

  const { collection, getDocs, doc, updateDoc, writeBatch } = window.firebase;
  const db = window.db;

  if (!db) {
    console.error('❌ Database not found');
    return;
  }

  console.log('🔍 DIAGNOSING PROPERTY IMAGE URLS...\n');

  try {
    const snapshot = await getDocs(collection(db, 'properties'));
    console.log(`Found ${snapshot.docs.length} properties\n`);
    console.log('=== CURRENT IMAGE DATA ===\n');

    const batch = writeBatch(db);
    let needsFix = 0;

    // Map for proper Cloudinary URLs
    const properCloudinaryUrls = {
      'flat-for-sale': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/flat-sale_kwmzvx.jpg',
      'house-for-sale': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/property-1_xyz123.jpg',
      'land-for-sale': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/property-2_abc456.jpg',
      'flat-for-rent': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/flat-rent_def789.jpg',
      'house-for-rent': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/property-4_ghi012.jpg',
      'office-for-rent-lease': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/office_jkl345.jpg',
      'commercial-space-for-rent-lease': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/commercial_mno678.jpg',
      'pg-hostel-boys': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/agriculture-land_pqr901.jpg',
      'pg-hostel-girls': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/farmhouse-rent_stu234.jpg',
      'pg-boys': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/property-5_vwx567.jpg',
      'pg-girls': 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/property-6_yza890.jpg',
    };

    const fallbackUrl = 'https://res.cloudinary.com/dswoyink7/image/upload/v1763830265/plot-sale_bcd123.jpg';

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      const title = data.title || 'Unknown';
      const category = data.categorySlug || data.category || 'unknown';

      console.log(`\n📄 Property: ${title}`);
      console.log(`   ID: ${id}`);
      console.log(`   Category: ${category}`);
      console.log(`   Current Images:`, data.images);

      // Check if images exist and are valid
      if (!data.images || data.images.length === 0) {
        console.log(`   ⚠️  NO IMAGES FOUND - WILL FIX`);
        needsFix++;
      } else if (data.images[0].url) {
        const url = data.images[0].url;
        if (url.includes('cloudinary.com') && url.startsWith('https')) {
          console.log(`   ✅ Valid Cloudinary URL`);
        } else if (url.length < 50) {
          console.log(`   ❌ INVALID/INCOMPLETE URL - WILL FIX`);
          needsFix++;
        } else {
          console.log(`   ⚠️  Suspicious URL - WILL CHECK`);
        }
      } else {
        console.log(`   ⚠️  Missing URL field - WILL FIX`);
        needsFix++;
      }
    });

    console.log(`\n\n=== FIX SUMMARY ===`);
    console.log(`Properties needing fix: ${needsFix} / ${snapshot.docs.length}`);

    if (needsFix === 0) {
      console.log('✅ All properties already have valid images!');
      return;
    }

    console.log(`\n⏳ Applying fixes...\n`);

    let fixed = 0;
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      const category = data.categorySlug || data.category || 'unknown';
      const title = data.title || 'Unknown';

      // Check if needs fixing
      const hasValidImages = data.images && 
                             data.images.length > 0 && 
                             data.images[0].url && 
                             data.images[0].url.includes('cloudinary.com') &&
                             data.images[0].url.startsWith('https');

      if (hasValidImages) {
        return;
      }

      // Get proper URL
      const imageUrl = properCloudinaryUrls[category] || fallbackUrl;

      // Create proper structure
      const images = [{
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: imageUrl,
        publicId: `property-${id}`,
        type: 'image',
        order: 1
      }];

      batch.update(doc(db, 'properties', id), {
        images: images,
        videos: data.videos || []
      });

      console.log(`✅ Fixed: ${title}`);
      fixed++;
    });

    if (fixed > 0) {
      console.log(`\n⏳ Saving ${fixed} properties to database...`);
      await batch.commit();
      console.log(`\n✨ SUCCESS! Fixed ${fixed} properties`);
      console.log('🔄 Reloading page in 2 seconds...\n');

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      console.log('All properties already valid!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
