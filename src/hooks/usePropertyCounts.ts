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
    // Listen to all properties and compute counts client-side
    const q = query(collection(db, 'properties'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const countMap: Record<string, number> = {};
        
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const category = data.category as PropertyCategory;
          const landType = data.landType as LandType | undefined;
          
          // Count by category
          countMap[category] = (countMap[category] || 0) + 1;
          
          // Also count land types separately
          if (category === 'land-for-sale' && landType) {
            const landKey = `land-${landType}`;
            countMap[landKey] = (countMap[landKey] || 0) + 1;
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

    return () => unsubscribe();
  }, []);

  return { counts, loading };
};

export default usePropertyCounts;
