import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, isAuthenticated } = useAuth();

  const connect = () => {
    if (!token || socket?.connected) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
    
    const newSocket = io(socketUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('📱 Connected to WebSocket server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('📱 Disconnected from WebSocket:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('📱 WebSocket connection error:', error.message);
      setIsConnected(false);
    });

    // Handle authentication errors
    newSocket.on('error', (error) => {
      console.error('📱 WebSocket error:', error);
      if (error.message === 'Authentication failed' || error.message === 'Authentication token required') {
        disconnect();
      }
    });

    setSocket(newSocket);
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  const value: SocketContextType = {
    socket,
    isConnected,
    connect,
    disconnect
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
