import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { MMKV } from 'react-native-mmkv';

// We store the last sync timestamp separately so we can query just the diff
export const syncStorage = new MMKV({
  id: 'viewpoint-sync-state',
});

const LAST_SYNC_KEY = 'last_sync_timestamp';

// Lite viewpoint data structure for the global map
export type ViewpointLite = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category_name: string;
  verified: boolean;
};

import { useQueryClient } from '@tanstack/react-query';

export const useViewpointsSync = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['viewpoints', 'global', 'v2'], // using v2 to sidestep any previous bad cached state
    queryFn: async () => {
      // 1. Get the last time we synced the full list (or null if first launch)
      const lastSync = syncStorage.getString(LAST_SYNC_KEY) || null;

      // 2. Fetch the differential payload from Supabase
      const { data, error } = await supabase.rpc('sync_viewpoints', {
        last_sync: lastSync,
      });

      if (error) {
        throw new Error(error.message);
      }
      
      const newPoints = (data || []) as ViewpointLite[];

      // 3. Mark the new sync timestamp
      syncStorage.set(LAST_SYNC_KEY, new Date().toISOString());

      // 4. Merge true differential data
      if (lastSync) {
        // If we had a previous sync, we need to merge the incoming changes
        // with the existing array of viewpoints currently preserved in the cache.
        const oldCache: ViewpointLite[] = queryClient.getQueryData(['viewpoints', 'global', 'v2']) || [];
        
        // Create a map of existing items for O(1) lookups
        const cacheMap = new Map(oldCache.map(vp => [vp.id, vp]));
        
        // Overwrite existing or add new
        newPoints.forEach(point => cacheMap.set(point.id, point));
        
        return Array.from(cacheMap.values());
      }
      
      // If lastSync was null, newPoints represents the entire catalog.
      return newPoints;
    },
    // We want this dataset to live locally essentially forever, updating silently in background
    staleTime: 1000 * 60 * 60 * 24, // 24 hours until considered stale
    gcTime: Infinity, // Never garbage collect this query from the memory cache
  });
};
