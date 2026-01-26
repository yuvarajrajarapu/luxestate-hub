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
          const listingType = data.listingType as string | undefined;
          
          // Count by category
          countMap[category] = (countMap[category] || 0) + 1;
          
          // Count land types separately (plot, agricultural, farm-houses)
          if (category === 'land-for-sale' && landType) {
            // Count the landType directly (e.g., 'plot', 'agricultural', 'farm-houses')
            countMap[landType] = (countMap[landType] || 0) + 1;
            
            // For farm-houses, also count by sale/rent
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

    return () => unsubscribe();
  }, []);

  return { counts, loading };
};

export default usePropertyCounts;
