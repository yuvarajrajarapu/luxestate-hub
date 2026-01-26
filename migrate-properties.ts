/**
 * MIGRATION SCRIPT: Add Category Fields to Existing Properties
 * 
 * This script updates all existing properties in Firebase to include:
 * - mainCategory
 * - categorySlug
 * - listingType (if missing)
 * 
 * Run this ONCE after deploying the category filtering system.
 * 
 * INSTRUCTIONS:
 * 1. Open Firebase Console
 * 2. Go to Firestore Database
 * 3. Open the Cloud Functions or use Firebase Admin SDK
 * 4. Run this migration
 * 
 * OR run it from your local environment with admin credentials
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getCategoryMapping, PROPERTY_CATEGORIES } from './src/types/property';

// Your Firebase config (use environment variables in production)
const firebaseConfig = {
  // Add your config here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateProperties() {
  console.log('Starting property migration...');
  
  try {
    const propertiesRef = collection(db, 'properties');
    const snapshot = await getDocs(propertiesRef);
    
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const propertyDoc of snapshot.docs) {
      const propertyId = propertyDoc.id;
      const propertyData = propertyDoc.data();
      
      // Check if already migrated
      if (propertyData.mainCategory && propertyData.categorySlug) {
        console.log(`Skipping ${propertyId} - already migrated`);
        skipped++;
        continue;
      }
      
      try {
        // Get category mapping
        const category = propertyData.category;
        
        if (!category) {
          console.error(`Property ${propertyId} has no category field`);
          errors++;
          continue;
        }
        
        const mapping = getCategoryMapping(category);
        
        // Update the property
        await updateDoc(doc(db, 'properties', propertyId), {
          categorySlug: mapping.categorySlug,
          mainCategory: mapping.mainCategory,
          listingType: mapping.listingType,
        });
        
        console.log(`✅ Updated ${propertyId}: ${category} → ${mapping.mainCategory}/${mapping.categorySlug}`);
        updated++;
        
      } catch (error) {
        console.error(`Error updating property ${propertyId}:`, error);
        errors++;
      }
    }
    
    console.log('\n=== Migration Complete ===');
    console.log(`Total properties: ${snapshot.docs.length}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped (already migrated): ${skipped}`);
    console.log(`Errors: ${errors}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration
migrateProperties();
