import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getUserShortlistedPropertyIds, 
  toggleShortlist as toggleShortlistService 
} from '@/lib/shortlist';

export const useShortlist = () => {
  const { user } = useAuth();
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch user's shortlisted properties on mount
  useEffect(() => {
    const fetchShortlist = async () => {
      if (!user) {
        setShortlistedIds(new Set());
        setLoading(false);
        return;
      }

      try {
        const ids = await getUserShortlistedPropertyIds(user.uid);
        setShortlistedIds(new Set(ids));
      } catch (error) {
        console.error('Error fetching shortlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShortlist();
  }, [user]);

  /**
   * Toggle shortlist status for a property
   * Returns true if added, false if removed
   */
  const toggleShortlist = async (propertyId: string): Promise<boolean> => {
    if (!user) {
      throw new Error('User must be logged in to shortlist properties');
    }

    try {
      const isAdded = await toggleShortlistService(user.uid, propertyId);
      
      // Update local state
      setShortlistedIds(prev => {
        const newSet = new Set(prev);
        if (isAdded) {
          newSet.add(propertyId);
        } else {
          newSet.delete(propertyId);
        }
        return newSet;
      });

      return isAdded;
    } catch (error) {
      console.error('Error toggling shortlist:', error);
      throw error;
    }
  };

  /**
   * Check if a property is shortlisted
   */
  const isShortlisted = (propertyId: string): boolean => {
    return shortlistedIds.has(propertyId);
  };

  return {
    shortlistedIds: Array.from(shortlistedIds),
    isShortlisted,
    toggleShortlist,
    loading,
    isAuthenticated: !!user,
  };
};
