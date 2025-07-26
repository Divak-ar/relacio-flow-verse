import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatAPI } from '../services/chatService';

// Get conversations
export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatAPI.getConversations(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get messages for a conversation
export const useMessages = (conversationId: string, page: number = 1, limit: number = 50) => {
  return useQuery({
    queryKey: ['messages', conversationId, page, limit],
    queryFn: () => chatAPI.getMessages(conversationId, page, limit),
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
  });
};

// Send message mutation
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      chatAPI.sendMessage(conversationId, content),
    onSuccess: (data, variables) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      // Invalidate conversations to update last message
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

// Send media message mutation
export const useSendMediaMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, file }: { conversationId: string; file: File }) =>
      chatAPI.sendMediaMessage(conversationId, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

// Mark as read mutation
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (conversationId: string) => chatAPI.markAsRead(conversationId),
    onSuccess: (data, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
  });
};

// Delete message mutation
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageId: string) => chatAPI.deleteMessage(messageId),
    onSuccess: () => {
      // Invalidate all messages queries to refetch
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

// Get chat matches
export const useChatMatches = () => {
  return useQuery({
    queryKey: ['chat', 'matches'],
    queryFn: () => chatAPI.getMatches(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Unmatch user mutation
export const useUnmatchUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (matchId: string) => chatAPI.unmatchUser(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'matches'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
};
