import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export type ViewpointDetail = {
  id: string;
  name: string;
  description: string | null;
  video_url: string | null;
  cover_image_url: string | null;
  viewpoint_media?: {
    id: string;
    media_url: string;
    media_type: string;
    sort_order: number | null;
  }[];
};

export const useViewpointDetails = (id: string | null) => {
  return useQuery({
    queryKey: ['viewpoint', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('viewpoints')
        .select(`
          id, name, description, video_url, cover_image_url,
          viewpoint_media(id, media_url, media_type, sort_order)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw new Error(error.message);
      return data as ViewpointDetail;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
