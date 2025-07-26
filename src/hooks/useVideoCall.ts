import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { videocallAPI } from '../services/videocallService';

// Create video call room
export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (participantId: string) => videocallAPI.createRoom(participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videocall', 'active'] });
    },
  });
};

// Join video call
export const useJoinCall = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (callId: string) => videocallAPI.joinCall(callId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videocall', 'active'] });
    },
  });
};

// End video call
export const useEndCall = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (callId: string) => videocallAPI.endCall(callId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videocall'] });
    },
  });
};

// Get call history
export const useCallHistory = () => {
  return useQuery({
    queryKey: ['videocall', 'history'],
    queryFn: () => videocallAPI.getCallHistory(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get active calls
export const useActiveCalls = () => {
  return useQuery({
    queryKey: ['videocall', 'active'],
    queryFn: () => videocallAPI.getActiveCalls(),
    refetchInterval: 10 * 1000, // Refetch every 10 seconds
    staleTime: 5 * 1000, // 5 seconds
  });
};
