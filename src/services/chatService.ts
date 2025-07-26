import api from '../lib/api';

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: Date;
  }[];
  lastMessage?: {
    id: string;
    content: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  fileName?: string;
  fileUrl?: string;
  isDisappearing?: boolean;
  disappearTime?: number;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  type?: 'text' | 'image' | 'file';
  isDisappearing?: boolean;
  disappearTime?: number;
}

export const chatAPI = {
  // Get all conversations
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  // Get messages for a conversation
  getMessages: async (
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<Message[]> => {
    const response = await api.get(`/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Send a message
  sendMessage: async (conversationId: string, content: string): Promise<Message> => {
    const response = await api.post(`/chat/conversations/${conversationId}/messages`, { content });
    return response.data;
  },

  // Send media message
  sendMediaMessage: async (conversationId: string, file: File): Promise<Message> => {
    const formData = new FormData();
    formData.append('media', file);
    
    const response = await api.post(`/chat/conversations/${conversationId}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (conversationId: string): Promise<void> => {
    await api.put(`/chat/conversations/${conversationId}/read`);
  },

  // Delete message
  deleteMessage: async (messageId: string): Promise<void> => {
    await api.delete(`/chat/messages/${messageId}`);
  },

  // Get matches
  getMatches: async (): Promise<unknown[]> => {
    const response = await api.get('/chat/matches');
    return response.data;
  },

  // Unmatch user
  unmatchUser: async (matchId: string): Promise<void> => {
    await api.delete(`/chat/matches/${matchId}`);
  },
};
