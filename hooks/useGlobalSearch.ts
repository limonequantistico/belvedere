import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.EXPO_PUBLIC_MAPBOX_KEY || '';

export type SearchResult = {
  id: string;
  type: 'place' | 'viewpoint';
  title: string;
  subtitle?: string;
  coordinates: [number, number]; // [longitude, latitude]
};

export const useGlobalSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];

      const results: SearchResult[] = [];

      // 1. Fetch Supabase Viewpoints
      try {
        const { data: viewpoints, error } = await supabase.rpc('search_viewpoints', {
          query_text: query,
        });

        if (!error && viewpoints) {
          viewpoints.forEach((vp: any) => {
            results.push({
              id: vp.id,
              type: 'viewpoint',
              title: vp.name,
              subtitle: vp.category_name,
              coordinates: [vp.lng, vp.lat], // Longitude, Latitude for Mapbox
            });
          });
        }
      } catch (err) {
        console.error('Error fetching viewpoints:', err);
      }

      // 2. Fetch Mapbox Places via standard Geocoding API
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&types=place,postcode,locality,neighborhood&limit=4`;
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          const features = data.features;
          
          for (const feature of features) {
            results.push({
              id: feature.id,
              type: 'place',
              title: feature.text,
              subtitle: feature.place_name.replace(`${feature.text}, `, ''), // Clean up subtitle
              coordinates: feature.center as [number, number], // [lng, lat] provided directly
            });
          }
        }
      } catch (err) {
        console.error('Error fetching Mapbox places:', err);
      }

      return results;
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60, // 1 minute
  });
};
