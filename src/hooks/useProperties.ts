import { useState, useEffect } from 'react';
import type { QueryConstraint } from 'firebase/firestore';
import type { Property, ListingType, MainCategory } from '@/types/property';

interface UsePropertiesOptions {
  listingType?: ListingType | 'all';
  mainCategory?: MainCategory;
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
  deferUntilLoad?: boolean;
}

interface UsePropertiesReturn {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

// Convert Firestore document to Property type
const convertFirestoreDoc = (
  doc: any,
  Timestamp: typeof import('firebase/firestore').Timestamp
): Property => {
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    propertyCode: typeof data.propertyCode === 'string' ? data.propertyCode.toUpperCase() : doc.id,
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
    let active = true;
    let unsubscribe: (() => void) | undefined;
    let subscriptionTimer: number | undefined;

    const subscribeToProperties = async () => {
      try {
        const [firestore, firebase] = await Promise.all([
          import('firebase/firestore'),
          import('@/lib/firebase'),
        ]);
        if (!active) return;

        const constraints: QueryConstraint[] = [firestore.orderBy('createdAt', 'desc')];

        if (options.mainCategory) {
          constraints.unshift(firestore.where('mainCategory', '==', options.mainCategory));
        }

        if (options.categorySlug) {
          constraints.unshift(firestore.where('categorySlug', '==', options.categorySlug));
        }

        if (options.listingType && options.listingType !== 'all') {
          constraints.unshift(firestore.where('listingType', '==', options.listingType));
        }

        if (options.featured) {
          constraints.unshift(firestore.where('isFeatured', '==', true));
        }

        if (options.limit) {
          constraints.push(firestore.limit(options.limit));
        }

        const q = firestore.query(
          firestore.collection(firebase.db, 'properties'),
          ...constraints
        );

        unsubscribe = firestore.onSnapshot(
          q,
          (snapshot) => {
            if (!active) return;
            const propertiesData = snapshot.docs.map((doc) =>
              convertFirestoreDoc(doc, firestore.Timestamp)
            );
            setProperties(propertiesData);
            setLoading(false);
            setError(null);
          },
          (err) => {
            if (!active) return;
            console.error('Error fetching properties:', err);
            setError('Failed to load properties');
            setLoading(false);
          }
        );
      } catch (err) {
        if (!active) return;
        console.error('Error initializing properties query:', err);
        setError('Failed to load properties');
        setLoading(false);
      }
    };

    const scheduleSubscription = () => {
      if (options.deferUntilLoad) {
        subscriptionTimer = window.setTimeout(() => {
          void subscribeToProperties();
        }, 1500);
      } else {
        void subscribeToProperties();
      }
    };

    if (options.deferUntilLoad && document.readyState !== 'complete') {
      window.addEventListener('load', scheduleSubscription, { once: true });
    } else {
      scheduleSubscription();
    }

    return () => {
      active = false;
      unsubscribe?.();
      window.removeEventListener('load', scheduleSubscription);
      if (subscriptionTimer !== undefined) window.clearTimeout(subscriptionTimer);
    };
  }, [
    options.listingType,
    options.mainCategory,
    options.categorySlug,
    options.featured,
    options.limit,
    options.deferUntilLoad,
  ]);

  return { properties, loading, error };
};

// Hook to fetch a single property by ID
export const useProperty = (codeOrId: string | undefined) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!codeOrId) {
      setLoading(false);
      setError('Property code is required');
      return () => {
        active = false;
      };
    }

    const fetchProperty = async () => {
      try {
        const [firestore, firebase] = await Promise.all([
          import('firebase/firestore'),
          import('@/lib/firebase'),
        ]);
        if (!active) return;

        const code = codeOrId.trim();
        const propertiesRef = firestore.collection(firebase.db, 'properties');

        // Prefer propertyCode lookup to keep URLs stable; fall back to document ID.
        const codeQuery = firestore.query(
          propertiesRef,
          firestore.where('propertyCode', '==', code.toUpperCase()),
          firestore.limit(1)
        );
        const codeSnapshot = await firestore.getDocs(codeQuery);

        if (!codeSnapshot.empty) {
          setProperty(convertFirestoreDoc(codeSnapshot.docs[0], firestore.Timestamp));
          setError(null);
          return;
        }

        const docRef = firestore.doc(firebase.db, 'properties', code);
        const docSnap = await firestore.getDoc(docRef);

        if (docSnap.exists()) {
          setProperty(convertFirestoreDoc(docSnap, firestore.Timestamp));
          setError(null);
        } else {
          setError('Property not found');
          setProperty(null);
        }
      } catch (err) {
        if (!active) return;
        console.error('Error fetching property:', err);
        setError('Failed to load property');
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchProperty();

    return () => {
      active = false;
    };
  }, [codeOrId]);

  return { property, loading, error };
};

export default useProperties;
