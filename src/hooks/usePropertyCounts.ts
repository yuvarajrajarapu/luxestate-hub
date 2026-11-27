import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { PropertyCategory, LandType } from '@/types/property';

interface CategoryCount {
  category: PropertyCategory | 'land';
  landType?: LandType;
  count: number;
}

interface UsePropertyCountsReturn {
  counts: Record<string, number>;
  loading: boolean;
}

export const usePropertyCounts = (): UsePropertyCountsReturn => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let subscriptionTimer: number | undefined;

    const subscribeToCounts = () => {
      // Category counts are non-critical and query the full collection.
      subscriptionTimer = window.setTimeout(() => {
        const q = query(collection(db, 'properties'));

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const countMap: Record<string, number> = {};

            snapshot.docs.forEach((doc) => {
              const data = doc.data();
              const categorySlug = data.categorySlug as string;
              const landType = data.landType as LandType | undefined;
              const listingType = data.listingType as string | undefined;

              if (categorySlug) {
                countMap[categorySlug] = (countMap[categorySlug] || 0) + 1;
              }

              if (categorySlug === 'land-for-sale' && landType) {
                countMap[landType] = (countMap[landType] || 0) + 1;

                if (landType === 'farm-houses' && listingType) {
                  const farmKey = `farm-houses-${listingType}`;
                  countMap[farmKey] = (countMap[farmKey] || 0) + 1;
                }
              }
            });

            setCounts(countMap);
            setLoading(false);
          },
          (err) => {
            console.error('Error fetching property counts:', err);
            setLoading(false);
          }
        );
      }, 1500);
    };

    if (document.readyState === 'complete') {
      subscribeToCounts();
    } else {
      window.addEventListener('load', subscribeToCounts, { once: true });
    }

    return () => {
      window.removeEventListener('load', subscribeToCounts);
      if (subscriptionTimer !== undefined) window.clearTimeout(subscriptionTimer);
      unsubscribe?.();
    };
  }, []);

  return { counts, loading };
};

export default usePropertyCounts;
