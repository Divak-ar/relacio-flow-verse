import api from '../lib/api';

export interface DiscoveryProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  education: string;
  bio: string;
  interests: string[];
  photos: {
    id: string;
    url: string;
    isMain: boolean;
  }[];
  compatibility: number;
  distance?: number;
}

export interface SwipeAction {
  targetUserId: string;
  action: 'like' | 'pass' | 'super_like';
}

export interface Match {
  id: string;
  user: {
    id: string;
    name: string;
    photos: { url: string; isMain: boolean }[];
  };
  matchedAt: Date;
  compatibility: number;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
}

export const discoveryAPI = {
  // Get potential matches for swiping
  getDiscoveryProfiles: async (limit: number = 10): Promise<DiscoveryProfile[]> => {
    const response = await api.get(`/api/discovery/profiles?limit=${limit}`);
    return response.data.data.profiles;
  },

  // Swipe on a profile
  swipe: async (data: SwipeAction): Promise<{ isMatch: boolean; matchId?: string }> => {
    const response = await api.post('/api/discovery/swipe', data);
    return response.data.data;
  },

  // Super like a profile
  superLike: async (targetUserId: string): Promise<{ isMatch: boolean; matchId?: string }> => {
    const response = await api.post('/api/discovery/super-like', { targetUserId });
    return response.data.data;
  },

  // Undo last swipe
  undoSwipe: async (): Promise<{ success: boolean }> => {
    const response = await api.post('/api/discovery/undo');
    return response.data;
  },

  // Get matches
  getMatches: async (): Promise<Match[]> => {
    const response = await api.get('/api/discovery/matches');
    return response.data.data.matches;
  },
};
