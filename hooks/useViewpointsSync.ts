import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { MMKV } from 'react-native-mmkv';
import { useStyledToast } from './useStyledToast';

// We store the last sync timestamp separately so we can query just the diff
export const syncStorage = new MMKV({
  id: 'viewpoint-sync-state',
});

const LAST_SYNC_KEY = 'last_sync_timestamp';
const VIEWPOINTS_CACHE_KEY = 'viewpoints_cache';

// Lite viewpoint data structure for the global map
export type ViewpointLite = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category_name: string;
  category_icon: string | null;
  category_color: string | null;
  cover_image_url: string | null;
  verified: boolean;
};

export const useViewpointsSync = () => {
  const queryClient = useQueryClient();
  const toast = useStyledToast();

  return useQuery({
    queryKey: ['viewpoints', 'global', 'v3'], // bumping to v3 to force a fresh fetch and trigger the toast
    queryFn: async () => {
      toast.showDefault("Testing sync");
      // 1. Get the last time we synced the full list (or null if first launch)
      let lastSync = syncStorage.getString(LAST_SYNC_KEY) || null;
      const cachedStr = syncStorage.getString(VIEWPOINTS_CACHE_KEY);

      // If we have a last sync date but NO cached string, our payload was lost.
      // We must do a full sync instead of a differential sync.
      if (lastSync && !cachedStr) {
        lastSync = null;
      }

      // 2. Fetch the differential payload from Supabase
      const { data, error } = await supabase.rpc('sync_viewpoints', {
        last_sync: lastSync,
      });

      if (error) {
        throw new Error(error.message);
      }
      
      const newPoints = (data || []) as ViewpointLite[];

      let finalPoints = newPoints;

      // 3. Mark the new sync timestamp
      syncStorage.set(LAST_SYNC_KEY, new Date().toISOString());

      // 4. Merge true differential data
      if (lastSync) {
        // If we had a previous sync, we need to load the persistent cache
        // React Query's in-memory cache clears on reload, but MMKV persists `lastSync`.
        const oldCache: ViewpointLite[] = cachedStr ? JSON.parse(cachedStr) : [];
        
        // Create a map of existing items for O(1) lookups
        const cacheMap = new Map(oldCache.map(vp => [vp.id, vp]));
        
        // Overwrite existing or add new
        newPoints.forEach(point => cacheMap.set(point.id, point));
        
        finalPoints = Array.from(cacheMap.values());
      }
      
      // Save changes back to MMKV persistent storage
      syncStorage.set(VIEWPOINTS_CACHE_KEY, JSON.stringify(finalPoints));
      
      return finalPoints;
    },
    // We want this dataset to live locally essentially forever, updating silently in background
    staleTime: 1000 * 60 * 60 * 24, // 24 hours until considered stale
    gcTime: Infinity, // Never garbage collect this query from the memory cache
  });
};
