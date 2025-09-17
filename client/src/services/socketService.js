import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('🔌 Connected to Socket.io server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from Socket.io server');
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket.io error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinRoom(projectId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('joinRoom', projectId);
    }
  }

  leaveRoom(projectId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leaveRoom', projectId);
    }
  }

  sendMessage(projectId, message) {
    if (this.socket && this.isConnected) {
      this.socket.emit('sendMessage', { projectId, message });
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('newMessage', callback);
    }
  }

  onRecentMessages(callback) {
    if (this.socket) {
      this.socket.on('recentMessages', callback);
    }
  }

  onError(callback) {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

const socketService = new SocketService();
export default socketService;
