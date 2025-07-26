import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { discoveryAPI, SwipeAction } from '../services/discoveryService';

// Get discovery profiles
export const useDiscoveryProfiles = (limit: number = 10) => {
  return useQuery({
    queryKey: ['discovery', 'profiles', limit],
    queryFn: () => discoveryAPI.getDiscoveryProfiles(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Swipe mutation
export const useSwipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SwipeAction) => discoveryAPI.swipe(data),
    onSuccess: () => {
      // Invalidate discovery profiles to get new ones
      queryClient.invalidateQueries({ queryKey: ['discovery', 'profiles'] });
      // If it's a match, invalidate matches
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
};

// Super like mutation
export const useSuperLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (targetUserId: string) => discoveryAPI.superLike(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discovery', 'profiles'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
};

// Undo swipe mutation
export const useUndoSwipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => discoveryAPI.undoSwipe(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discovery', 'profiles'] });
    },
  });
};

// Get matches
export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: () => discoveryAPI.getMatches(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
