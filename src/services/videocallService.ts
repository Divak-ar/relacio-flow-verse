import api from '../lib/api';

export interface VideoCall {
  id: string;
  callId: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  initiatorId: string;
  status: 'pending' | 'active' | 'ended' | 'declined';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  dailyRoomUrl: string;
  createdAt: Date;
}

export interface InitiateCallRequest {
  recipientUserId: string;
}

export const videocallAPI = {
  // Create a video call room
  createRoom: async (participantId: string): Promise<VideoCall> => {
    const response = await api.post('/api/videocall/initiate', { participantId });
    return response.data.data.call;
  },

  // Join a video call
  joinCall: async (callId: string): Promise<VideoCall> => {
    const response = await api.put(`/api/videocall/${callId}/accept`);
    return response.data.data.call;
  },

  // Decline a video call
  declineCall: async (callId: string): Promise<VideoCall> => {
    const response = await api.put(`/api/videocall/${callId}/decline`);
    return response.data.data.call;
  },

  // End a video call
  endCall: async (callId: string): Promise<VideoCall> => {
    const response = await api.put(`/api/videocall/${callId}/end`);
    return response.data.data.call;
  },

  // Get call history
  getCallHistory: async (): Promise<VideoCall[]> => {
    const response = await api.get('/api/videocall/history');
    return response.data.data.calls;
  },

  // Get active calls
  getActiveCalls: async (): Promise<VideoCall[]> => {
    const response = await api.get('/api/videocall/active');
    return response.data.data.calls;
  },
};
