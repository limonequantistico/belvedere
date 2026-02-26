import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/supabase-provider';
import { useStyledToast } from './useStyledToast';

export const useFavorites = () => {
  const { session } = useAuth();
  
  return useQuery({
    queryKey: ['favorites', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('viewpoint_id')
        .eq('user_id', session.user.id);
        
      if (error) throw new Error(error.message);
      
      return data.map(f => f.viewpoint_id);
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const toast = useStyledToast();

  return useMutation({
    mutationFn: async ({ viewpointId, isFavorite }: { viewpointId: string, isFavorite: boolean }) => {
      if (!session?.user?.id) {
        throw new Error('You must be logged in to save favorites.');
      }

      if (isFavorite) {
        // Remove favorite
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('viewpoint_id', viewpointId);
          
        if (error) throw new Error(error.message);
      } else {
        // Add favorite
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: session.user.id,
            viewpoint_id: viewpointId
          });
          
        if (error) throw new Error(error.message);
      }
    },
    onMutate: async ({ viewpointId, isFavorite }) => {
      if (!session?.user?.id) {
        toast.showError('Login Required', 'Please log in to save favorites.');
        throw new Error('Not logged in');
      }

      const queryKey = ['favorites', session.user.id];
      
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData<string[]>(queryKey);

      // Optimistically update to the new value
      if (previousFavorites) {
        queryClient.setQueryData<string[]>(queryKey, (old) => {
          if (!old) return [];
          if (isFavorite) {
            return old.filter(id => id !== viewpointId);
          } else {
            return [...old, viewpointId];
          }
        });
      }

      // Return a context object with the snapshotted value
      return { previousFavorites, queryKey };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousFavorites) {
        queryClient.setQueryData(context.queryKey, context.previousFavorites);
      }
      
      if (err.message !== 'Not logged in') {
        toast.showError('Operation Failed', 'Could not update favorites. Please login and try again.');
      }
    },
    onSettled: (data, error, variables, context) => {
      // Always refetch after error or success to ensure cache is correct
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });
};
