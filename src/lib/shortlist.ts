import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  getDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Property } from '@/types/property';

export interface ShortlistItem {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: Timestamp;
}

const SHORTLIST_COLLECTION = 'shortlists';
const PROPERTIES_COLLECTION = 'properties';

/**
 * Add property to user's shortlist
 * @param userId - Firebase Auth UID
 * @param propertyId - Property document ID
 */
export const addToShortlist = async (userId: string, propertyId: string): Promise<void> => {
  if (!userId || !propertyId) {
    throw new Error('User ID and Property ID are required');
  }

  const shortlistRef = doc(db, SHORTLIST_COLLECTION, `${userId}_${propertyId}`);
  
  await setDoc(shortlistRef, {
    userId,
    propertyId,
    createdAt: serverTimestamp(),
  });
};

/**
 * Remove property from user's shortlist
 * @param userId - Firebase Auth UID
 * @param propertyId - Property document ID
 */
export const removeFromShortlist = async (userId: string, propertyId: string): Promise<void> => {
  if (!userId || !propertyId) {
    throw new Error('User ID and Property ID are required');
  }

  const shortlistRef = doc(db, SHORTLIST_COLLECTION, `${userId}_${propertyId}`);
  await deleteDoc(shortlistRef);
};

/**
 * Check if property is in user's shortlist
 * @param userId - Firebase Auth UID
 * @param propertyId - Property document ID
 */
export const isPropertyShortlisted = async (userId: string, propertyId: string): Promise<boolean> => {
  if (!userId || !propertyId) return false;

  const shortlistRef = doc(db, SHORTLIST_COLLECTION, `${userId}_${propertyId}`);
  const shortlistDoc = await getDocs(query(collection(db, SHORTLIST_COLLECTION), where('userId', '==', userId), where('propertyId', '==', propertyId)));
  
  return !shortlistDoc.empty;
};

/**
 * Get all shortlisted property IDs for a user
 * CRITICAL: Only returns data for the specified user (data isolation)
 * @param userId - Firebase Auth UID
 */
export const getUserShortlistedPropertyIds = async (userId: string): Promise<string[]> => {
  if (!userId) {
    return [];
  }

  const shortlistQuery = query(
    collection(db, SHORTLIST_COLLECTION),
    where('userId', '==', userId)
  );

  const querySnapshot = await getDocs(shortlistQuery);
  
  return querySnapshot.docs.map(doc => doc.data().propertyId);
};

/**
 * Toggle shortlist status for a property
 * @param userId - Firebase Auth UID
 * @param propertyId - Property document ID
 * @returns boolean - true if added, false if removed
 */
export const toggleShortlist = async (userId: string, propertyId: string): Promise<boolean> => {
  if (!userId || !propertyId) {
    throw new Error('User ID and Property ID are required');
  }

  const shortlistRef = doc(db, SHORTLIST_COLLECTION, `${userId}_${propertyId}`);
  const shortlistDoc = await getDocs(query(collection(db, SHORTLIST_COLLECTION), where('userId', '==', userId), where('propertyId', '==', propertyId)));
  
  if (!shortlistDoc.empty) {
    // Remove from shortlist
    await deleteDoc(shortlistRef);
    return false;
  } else {
    // Add to shortlist
    await setDoc(shortlistRef, {
      userId,
      propertyId,
      createdAt: serverTimestamp(),
    });
    return true;
  }
};

/**
 * Get all shortlisted properties with full details for a user
 * CRITICAL: Only returns properties for the specified user (data isolation)
 * @param userId - Firebase Auth UID
 */
export const getUserShortlistedProperties = async (userId: string): Promise<Property[]> => {
  if (!userId) {
    return [];
  }

  try {
    // Get property IDs
    const propertyIds = await getUserShortlistedPropertyIds(userId);
    
    if (propertyIds.length === 0) {
      return [];
    }

    // Fetch property details
    const propertyPromises = propertyIds.map(async (propertyId) => {
      const propertyDoc = await getDoc(doc(db, PROPERTIES_COLLECTION, propertyId));
      if (propertyDoc.exists()) {
        return {
          id: propertyDoc.id,
          ...propertyDoc.data(),
        } as Property;
      }
      return null;
    });

    const properties = await Promise.all(propertyPromises);
    
    // Filter out null values (properties that don't exist)
    return properties.filter((property): property is Property => property !== null);
  } catch (error) {
    console.error('Error fetching shortlisted properties:', error);
    return [];
  }
};
