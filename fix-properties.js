/**
 * Quick Fix Script - Update Single Property
 * 
 * Run this in your browser console to update existing properties
 * with the new category fields.
 */

// Copy and paste this entire code block into your browser console on your website

(async function updateProperties() {
  // Import Firebase functions (they should already be available in your app)
  const { collection, getDocs, doc, updateDoc } = window.firebase || {};
  
  if (!collection) {
    console.error('Firebase not loaded. Make sure you run this on your website page.');
    return;
  }
  
  const db = window.db; // Your Firebase db instance
  
  if (!db) {
    console.error('Database not found. Make sure you are on the correct page.');
    return;
  }
  
  // Category mapping
  const categoryMapping = {
    'flat-for-sale': { mainCategory: 'buy', categorySlug: 'flat-for-sale', listingType: 'sale' },
    'house-for-sale': { mainCategory: 'buy', categorySlug: 'house-for-sale', listingType: 'sale' },
    'land-for-sale': { mainCategory: 'land', categorySlug: 'land-for-sale', listingType: 'sale' },
    'flat-for-rent': { mainCategory: 'rent', categorySlug: 'flat-for-rent', listingType: 'rent' },
    'house-for-rent': { mainCategory: 'rent', categorySlug: 'house-for-rent', listingType: 'rent' },
    'office-for-rent-lease': { mainCategory: 'commercial', categorySlug: 'office-for-rent-lease', listingType: 'lease' },
    'commercial-space-for-rent-lease': { mainCategory: 'commercial', categorySlug: 'commercial-space-for-rent-lease', listingType: 'lease' },
    'pg-hostel-boys': { mainCategory: 'pg', categorySlug: 'pg-hostel-boys', listingType: 'rent' },
    'pg-hostel-girls': { mainCategory: 'pg', categorySlug: 'pg-hostel-girls', listingType: 'rent' },
    'pg-boys': { mainCategory: 'pg', categorySlug: 'pg-boys', listingType: 'rent' },
    'pg-girls': { mainCategory: 'pg', categorySlug: 'pg-girls', listingType: 'rent' },
  };
  
  console.log('Starting property update...');
  
  try {
    const snapshot = await getDocs(collection(db, 'properties'));
    let updated = 0;
    
    for (const propertyDoc of snapshot.docs) {
      const data = propertyDoc.data();
      
      // Check if already has the new fields
      if (data.mainCategory && data.categorySlug) {
        console.log(`✓ ${propertyDoc.id} - Already updated`);
        continue;
      }
      
      const category = data.category;
      const mapping = categoryMapping[category];
      
      if (!mapping) {
        console.warn(`⚠ ${propertyDoc.id} - Unknown category: ${category}`);
        continue;
      }
      
      // Update the property
      await updateDoc(doc(db, 'properties', propertyDoc.id), {
        mainCategory: mapping.mainCategory,
        categorySlug: mapping.categorySlug,
        listingType: mapping.listingType,
      });
      
      console.log(`✅ Updated ${propertyDoc.id}: ${category} → ${mapping.categorySlug}`);
      updated++;
    }
    
    console.log(`\n🎉 Success! Updated ${updated} properties.`);
    console.log('Please refresh the page to see your properties.');
    
  } catch (error) {
    console.error('❌ Error updating properties:', error);
  }
})();
