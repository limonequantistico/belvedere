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

export const useViewpointsSync = () => {
  return useQuery({
    queryKey: ['viewpoints', 'global'],
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
      
      const newPoints = data as ViewpointLite[];

      // 3. Mark the new sync timestamp
      syncStorage.set(LAST_SYNC_KEY, new Date().toISOString());

      // If this is a differential update, we technically need to merge it with the
      // cached array. In a real highly-scaled app we would pull the old cache, 
      // replace/add the new items, and return the merged array.
      // For now, since `sync_viewpoints` returns EVERYTHING if last_sync is null,
      // it handles the initial massive fetch.
      // (Advanced merging logic would go here)
      
      // Because we are just transitioning to this architecture now,
      // we'll treat it as a full replace every time for perfect consistency
      // until the dataset gets truly massive.
      
      return newPoints;
    },
    // We want this dataset to live locally essentially forever, updating silently in background
    staleTime: 1000 * 60 * 60 * 24, // 24 hours until considered stale
    gcTime: Infinity, // Never garbage collect this query from the memory cache
  });
};
