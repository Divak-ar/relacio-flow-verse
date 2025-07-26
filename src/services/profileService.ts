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
    return response.data.data.profile;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileRequest): Promise<Profile> => {
    const response = await api.put('/api/profile/update', data);
    return response.data.data.profile;
  },

  // Upload profile picture
  uploadProfilePicture: async (file: File): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await api.post('/api/profile/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.photo;
  },

  // Upload additional photos
  uploadPhotos: async (files: File[]): Promise<{ photos: { url: string; publicId: string }[] }> => {
    // Since backend only supports single photo upload, upload one by one
    const uploadPromises = files.map(file => {
      const formData = new FormData();
      formData.append('photo', file);
      return api.post('/api/profile/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    });
    
    const responses = await Promise.all(uploadPromises);
    return {
      photos: responses.map(response => response.data.data.photo)
    };
  },

  // Delete photo
  deletePhoto: async (photoId: string): Promise<void> => {
    await api.delete(`/api/profile/photo/${photoId}`);
  },

  // Get user profile by ID
  getUserProfile: async (userId: string): Promise<Profile> => {
    const response = await api.get(`/api/profile/${userId}`);
    return response.data.data.profile;
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
