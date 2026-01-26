import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  getDoc,
  where,
  QueryConstraint,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Property, ListingType, MainCategory } from '@/types/property';

interface UsePropertiesOptions {
  listingType?: ListingType | 'all';
  mainCategory?: MainCategory;
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
}

interface UsePropertiesReturn {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

// Convert Firestore document to Property type
const convertFirestoreDoc = (doc: any): Property => {
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    createdAt: data.createdAt instanceof Timestamp 
      ? data.createdAt.toDate() 
      : new Date(data.createdAt),
    updatedAt: data.updatedAt instanceof Timestamp 
      ? data.updatedAt.toDate() 
      : new Date(data.updatedAt),
  };
};

// Hook to fetch all properties with real-time updates
export const useProperties = (options: UsePropertiesOptions = {}): UsePropertiesReturn => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
    
    // Filter by mainCategory if specified
    if (options.mainCategory) {
      constraints.unshift(where('mainCategory', '==', options.mainCategory));
    }
    
    // Filter by categorySlug if specified (most specific filter)
    if (options.categorySlug) {
      constraints.unshift(where('categorySlug', '==', options.categorySlug));
    }
    
    // Filter by listing type if specified
    if (options.listingType && options.listingType !== 'all') {
      constraints.unshift(where('listingType', '==', options.listingType));
    }
    
    // Filter by featured if specified
    if (options.featured) {
      constraints.unshift(where('isFeatured', '==', true));
    }

    const q = query(collection(db, 'properties'), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const propertiesData = snapshot.docs.map(convertFirestoreDoc);
        
        // Apply limit if specified (done client-side for real-time updates)
        const limitedData = options.limit 
          ? propertiesData.slice(0, options.limit) 
          : propertiesData;
        
        setProperties(limitedData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [options.listingType, options.mainCategory, options.categorySlug, options.featured, options.limit]);

  return { properties, loading, error };
};

// Hook to fetch a single property by ID
export const useProperty = (id: string | undefined) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('Property ID is required');
      return;
    }

    const fetchProperty = async () => {
      try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProperty(convertFirestoreDoc(docSnap));
          setError(null);
        } else {
          setError('Property not found');
          setProperty(null);
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, loading, error };
};

export default useProperties;
