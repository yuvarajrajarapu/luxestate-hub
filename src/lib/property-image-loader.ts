/**
 * Property Image Loader Utility
 * Helps diagnose and fix missing or broken image references in Firestore
 */

import { db } from './firebase';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import type { Property, MediaItem } from '@/types/property';

interface PropertyImageDiagnostic {
  propertyId: string;
  title: string;
  hasImages: boolean;
  imageCount: number;
  allUrlsValid: boolean;
  issues: string[];
}

/**
 * Diagnose property image issues
 */
export async function diagnosePropertyImages(): Promise<PropertyImageDiagnostic[]> {
  const diagnostics: PropertyImageDiagnostic[] = [];
  
  try {
    const propertiesRef = collection(db, 'properties');
    const snapshot = await getDocs(propertiesRef);

    for (const doc of snapshot.docs) {
      const property = doc.data() as any;
      const diagnostic: PropertyImageDiagnostic = {
        propertyId: doc.id,
        title: property.title || 'Unknown',
        hasImages: !!property.images && Array.isArray(property.images),
        imageCount: property.images?.length || 0,
        allUrlsValid: true,
        issues: [],
      };

      // Check for issues
      if (!property.images) {
        diagnostic.issues.push('Missing images array');
      } else if (!Array.isArray(property.images)) {
        diagnostic.issues.push('Images is not an array');
      } else if (property.images.length === 0) {
        diagnostic.issues.push('Images array is empty');
      } else {
        // Check individual image URLs
        property.images.forEach((img: MediaItem, idx: number) => {
          if (!img.url && !img.publicId) {
            diagnostic.issues.push(`Image ${idx}: Missing both URL and publicId`);
            diagnostic.allUrlsValid = false;
          }
          if (img.url && !img.url.includes('cloudinary') && !img.url.includes('youtube')) {
            diagnostic.issues.push(`Image ${idx}: URL doesn't appear to be from Cloudinary`);
            diagnostic.allUrlsValid = false;
          }
        });
      }

      diagnostics.push(diagnostic);
    }

    return diagnostics;
  } catch (error) {
    console.error('Error diagnosing properties:', error);
    throw error;
  }
}

/**
 * Validate image URLs and test if they load
 */
export async function validateImageUrl(url: string): Promise<{
  valid: boolean;
  statusCode?: number;
  error?: string;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    const timeoutId = setTimeout(() => {
      resolve({ valid: false, error: 'Timeout loading image' });
    }, 5000);

    img.onload = () => {
      clearTimeout(timeoutId);
      resolve({ valid: true });
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      resolve({ valid: false, error: 'Failed to load image' });
    };

    img.src = url;
  });
}

/**
 * Test all property images and return results
 */
export async function testAllPropertyImages(): Promise<
  { propertyId: string; imageUrl: string; valid: boolean; error?: string }[]
> {
  const results = [];

  try {
    const propertiesRef = collection(db, 'properties');
    const snapshot = await getDocs(propertiesRef);

    for (const doc of snapshot.docs) {
      const property = doc.data() as any;
      
      if (property.images && Array.isArray(property.images)) {
        for (const image of property.images) {
          if (image.url) {
            const validation = await validateImageUrl(image.url);
            results.push({
              propertyId: doc.id,
              imageUrl: image.url,
              valid: validation.valid,
              error: validation.error,
            });
          }
        }
      }
    }

    return results;
  } catch (error) {
    console.error('Error testing property images:', error);
    throw error;
  }
}

/**
 * Print diagnostic report to console
 */
export async function printDiagnosticReport() {
  console.log('🔍 Diagnosing property images...');
  
  const diagnostics = await diagnosePropertyImages();
  
  const totalProperties = diagnostics.length;
  const withImages = diagnostics.filter(d => d.hasImages).length;
  const withIssues = diagnostics.filter(d => d.issues.length > 0).length;

  console.log('\n📊 Summary:');
  console.log(`  Total properties: ${totalProperties}`);
  console.log(`  With images: ${withImages} (${((withImages/totalProperties)*100).toFixed(1)}%)`);
  console.log(`  With issues: ${withIssues}`);

  if (withIssues > 0) {
    console.log('\n⚠️  Properties with issues:');
    diagnostics.filter(d => d.issues.length > 0).forEach(d => {
      console.log(`\n  ${d.title} (${d.propertyId})`);
      console.log(`    Images: ${d.imageCount}`);
      d.issues.forEach(issue => {
        console.log(`    ❌ ${issue}`);
      });
    });
  }

  console.log('\n✅ All properties checked!');
  return diagnostics;
}

export default {
  diagnosePropertyImages,
  validateImageUrl,
  testAllPropertyImages,
  printDiagnosticReport,
};
