import api from '../lib/api';

export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'message' | 'like' | 'view' | 'video_call';
  title: string;
  message: string;
  fromUserId?: string;
  fromUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  isRead: boolean;
  createdAt: Date;
}

export const notificationAPI = {
  // Get user notifications
  getNotifications: async (
    page: number = 1,
    limit: number = 20,
    unread?: boolean
  ): Promise<Notification[]> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (unread !== undefined) {
      params.append('unread', unread.toString());
    }

    const response = await api.get(`/notifications?${params}`);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/mark-all-read');
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<void> => {
    await api.delete(`/notifications/${notificationId}`);
  },

  // Update notification settings
  updateSettings: async (settings: {
    pushNotifications?: boolean;
    emailNotifications?: boolean;
    matchNotifications?: boolean;
    messageNotifications?: boolean;
    promotionalNotifications?: boolean;
  }): Promise<void> => {
    await api.put('/notifications/settings', settings);
  },
};
