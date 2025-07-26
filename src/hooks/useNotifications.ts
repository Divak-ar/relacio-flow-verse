import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationAPI } from '../services/notificationService';

// Get notifications
export const useNotifications = (page: number = 1, limit: number = 20, unread?: boolean) => {
  return useQuery({
    queryKey: ['notifications', page, limit, unread],
    queryFn: () => notificationAPI.getNotifications(page, limit, unread),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => notificationAPI.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => notificationAPI.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => notificationAPI.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Update notification settings
export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: {
      pushNotifications?: boolean;
      emailNotifications?: boolean;
      matchNotifications?: boolean;
      messageNotifications?: boolean;
      promotionalNotifications?: boolean;
    }) => notificationAPI.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
