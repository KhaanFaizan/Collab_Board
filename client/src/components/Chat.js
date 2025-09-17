import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, setMessages, setConnected, setError, clearError } from '../store/slices/chatSlice';
import socketService from '../services/socketService';
import './Chat.css';

const Chat = ({ projectId, projectName }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { messages, isConnected, error } = useSelector((state) => state.chat);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;

    // Connect to socket
    socketService.connect(token);

    // Set up event listeners
    socketService.onNewMessage((newMessage) => {
      dispatch(addMessage(newMessage));
    });

    socketService.onRecentMessages((recentMessages) => {
      dispatch(setMessages(recentMessages));
    });

    socketService.onError((error) => {
      dispatch(setError(error.message));
    });

    // Join the project room
    if (projectId) {
      socketService.joinRoom(projectId);
    }

    return () => {
      if (projectId) {
        socketService.leaveRoom(projectId);
      }
      socketService.removeAllListeners();
    };
  }, [projectId, token, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    dispatch(setConnected(socketService.isConnected));
  }, [dispatch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !isConnected) return;

    socketService.sendMessage(projectId, message.trim());
    setMessage('');
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set typing indicator
    setIsTyping(true);

    // Clear typing indicator after 1 second of no typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const isOwnMessage = (senderId) => {
    return senderId === user?.id;
  };

  if (error) {
    return (
      <div className="chat-container">
        <div className="chat-error">
          <p>❌ {error}</p>
          <button onClick={() => dispatch(clearError())} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>
          <i className="fas fa-comments"></i>
          {projectName} Chat
        </h3>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          <i className={`fas fa-circle ${isConnected ? 'connected' : 'disconnected'}`}></i>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <i className="fas fa-comment-slash"></i>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`message ${isOwnMessage(msg.senderId) ? 'own-message' : 'other-message'}`}
            >
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">
                    {msg.sender?.name || 'Unknown User'}
                  </span>
                  <span className="message-time">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div className="message-text">{msg.message}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <div className="chat-input-container">
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected}
            className="chat-input"
          />
          <button
            type="submit"
            disabled={!message.trim() || !isConnected}
            className="send-button"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        {isTyping && (
          <div className="typing-indicator">
            <span>Someone is typing...</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default Chat;
