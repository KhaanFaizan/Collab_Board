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

    // Use relative URL in production (same domain), absolute URL in development
    const socketURL = process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : (process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    
    this.socket = io(socketURL, {
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

  // Task-related methods
  updateTask(taskId, updateData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('updateTask', { taskId, ...updateData });
    }
  }

  createTask(projectId, taskData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('createTask', { projectId, ...taskData });
    }
  }

  deleteTask(taskId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('deleteTask', { taskId });
    }
  }

  onTaskUpdated(callback) {
    if (this.socket) {
      this.socket.on('taskUpdated', callback);
    }
  }

  onTaskCreated(callback) {
    if (this.socket) {
      this.socket.on('taskCreated', callback);
    }
  }

  onTaskDeleted(callback) {
    if (this.socket) {
      this.socket.on('taskDeleted', callback);
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
