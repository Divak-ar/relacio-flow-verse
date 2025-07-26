import api from '../lib/api';

export interface Profile {
  id?: string;
  userId?: string;
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
  preferences: {
    ageRange: { min: number; max: number };
    maxDistance: number;
    lookingFor: string;
  };
  profileScore?: number;
  profileViews?: number;
  likesReceived?: number;
}

export interface UpdateProfileRequest {
  age?: number;
  location?: string;
  occupation?: string;
  education?: string;
  bio?: string;
  interests?: string[];
  preferences?: {
    ageRange?: { min: number; max: number };
    maxDistance?: number;
    lookingFor?: string;
  };
}

export const profileAPI = {
  // Get current user's profile
  getProfile: async (): Promise<Profile> => {
    const response = await api.get('/api/profile/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileRequest): Promise<Profile> => {
    const response = await api.put('/api/profile', data);
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (file: File): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await api.post('/api/profile/upload-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload additional photos
  uploadPhotos: async (files: File[]): Promise<{ photos: { url: string; publicId: string }[] }> => {
    const formData = new FormData();
    files.forEach(file => formData.append('photos', file));
    
    const response = await api.post('/api/profile/upload-photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete photo
  deletePhoto: async (photoId: string): Promise<void> => {
    await api.delete(`/api/profile/photos/${photoId}`);
  },

  // Get user profile by ID
  getUserProfile: async (userId: string): Promise<Profile> => {
    const response = await api.get(`/api/profile/${userId}`);
    return response.data;
  },

  // Update location
  updateLocation: async (latitude: number, longitude: number): Promise<void> => {
    await api.put('/api/profile/location', { latitude, longitude });
  },

  // Update preferences
  updatePreferences: async (preferences: Profile['preferences']): Promise<void> => {
    await api.put('/api/profile/preferences', preferences);
  },
};
