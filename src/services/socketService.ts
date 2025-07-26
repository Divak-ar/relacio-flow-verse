import { io, Socket } from 'socket.io-client';

// Socket event types
export interface SocketMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: Date;
}

export interface SocketUser {
  userId: string;
  timestamp: Date;
}

export interface SocketTyping {
  userId: string;
  conversationId: string;
  isTyping: boolean;
}

export interface SocketVideoCall {
  callId: string;
  participantId: string;
  type: 'video' | 'audio';
}

export interface SocketNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown>;
}

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  initialize(token: string) {
    if (this.socket?.connected) {
      this.socket.disconnect();
    }

    this.token = token;
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
    
    this.socket = io(socketUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  // Chat events
  joinConversation(conversationId: string) {
    this.socket?.emit('join_conversation', { conversationId });
  }

  leaveConversation(conversationId: string) {
    this.socket?.emit('leave_conversation', { conversationId });
  }

  sendMessage(conversationId: string, content: string, type: string = 'text') {
    this.socket?.emit('send_message', {
      conversationId,
      content,
      type
    });
  }

  onNewMessage(callback: (message: SocketMessage) => void) {
    this.socket?.on('new_message', callback);
  }

  onMessageDelivered(callback: (data: { messageId: string; timestamp: Date }) => void) {
    this.socket?.on('message_delivered', callback);
  }

  onMessageRead(callback: (data: { messageId: string; timestamp: Date }) => void) {
    this.socket?.on('message_read', callback);
  }

  onTypingStart(callback: (data: SocketTyping) => void) {
    this.socket?.on('typing_start', callback);
  }

  onTypingStop(callback: (data: SocketTyping) => void) {
    this.socket?.on('typing_stop', callback);
  }

  startTyping(conversationId: string) {
    this.socket?.emit('typing_start', { conversationId });
  }

  stopTyping(conversationId: string) {
    this.socket?.emit('typing_stop', { conversationId });
  }

  // User presence
  onUserOnline(callback: (data: SocketUser) => void) {
    this.socket?.on('user_online', callback);
  }

  onUserOffline(callback: (data: SocketUser) => void) {
    this.socket?.on('user_offline', callback);
  }

  // Video call events
  onVideoCallInvite(callback: (data: SocketVideoCall) => void) {
    this.socket?.on('video_call_invite', callback);
  }

  onVideoCallAccept(callback: (data: SocketVideoCall) => void) {
    this.socket?.on('video_call_accept', callback);
  }

  onVideoCallReject(callback: (data: SocketVideoCall) => void) {
    this.socket?.on('video_call_reject', callback);
  }

  onVideoCallEnd(callback: (data: SocketVideoCall) => void) {
    this.socket?.on('video_call_end', callback);
  }

  sendVideoCallInvite(participantId: string, callId: string) {
    this.socket?.emit('video_call_invite', { participantId, callId });
  }

  acceptVideoCall(callId: string) {
    this.socket?.emit('video_call_accept', { callId });
  }

  rejectVideoCall(callId: string) {
    this.socket?.emit('video_call_reject', { callId });
  }

  endVideoCall(callId: string) {
    this.socket?.emit('video_call_end', { callId });
  }

  // Match notifications
  onNewMatch(callback: (data: { matchId: string; userId: string }) => void) {
    this.socket?.on('new_match', callback);
  }

  onNewLike(callback: (data: { userId: string; likeId: string }) => void) {
    this.socket?.on('new_like', callback);
  }

  // General notifications
  onNotification(callback: (data: SocketNotification) => void) {
    this.socket?.on('notification', callback);
  }

  // Clean up
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Remove specific listeners
  off(event: string, listener?: (...args: unknown[]) => void) {
    this.socket?.off(event, listener);
  }

  // Get socket instance
  getSocket(): Socket | null {
    return this.socket;
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
export default socketService;
