import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Search, MoreVertical, Phone, Video, Crown, Circle, Wifi, WifiOff, Plus, Paperclip, Smile } from 'lucide-react';

// Mock WebSocket implementation
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 1;
    this.onmessage = null;
    this.onopen = null;
    this.onclose = null;
    this.onerror = null;
    
    setTimeout(() => {
      if (this.onopen) this.onopen();
    }, 100);
  }
  
  send(data) {
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({ data });
      }
    }, 100);
  }
  
  close() {
    this.readyState = 3;
    if (this.onclose) this.onclose();
  }
}

// Mock data
const mockUsers = [
  { id: 'ceo-1', name: 'Sarah Chen', role: 'CEO', avatar: '👩‍💼', isOnline: true, lastSeen: new Date(), lastMessage: 'Ready for sprint review?', unread: 2 },
  { id: 'user-2', name: 'Mike Johnson', role: 'CTO', avatar: '👨‍💻', isOnline: true, lastSeen: new Date(), lastMessage: 'Technical updates prepared', unread: 0 },
  { id: 'user-3', name: 'Emma Davis', role: 'Product Manager', avatar: '👩‍🎯', isOnline: false, lastSeen: new Date(Date.now() - 300000), lastMessage: 'Let me check with the team', unread: 1 },
  { id: 'user-4', name: 'Alex Rodriguez', role: 'Designer', avatar: '👨‍🎨', isOnline: true, lastSeen: new Date(), lastMessage: 'UI components ready', unread: 0 },
  { id: 'user-5', name: 'Lisa Wang', role: 'Developer', avatar: '👩‍💻', isOnline: false, lastSeen: new Date(Date.now() - 600000), lastMessage: 'Working on the backend', unread: 3 },
];

const mockMessages = [
  { id: '1', senderId: 'ceo-1', content: 'Good morning team! Ready for today\'s sprint review?', timestamp: new Date(Date.now() - 600000), type: 'text' },
  { id: '2', senderId: 'user-2', content: 'Absolutely! I\'ve prepared the technical updates.', timestamp: new Date(Date.now() - 580000), type: 'text' },
  { id: '3', senderId: 'current-user', content: 'Looking forward to it! I have some design questions to discuss.', timestamp: new Date(Date.now() - 560000), type: 'text' },
  { id: '4', senderId: 'user-4', content: 'The new UI components are ready for review. Should we schedule a quick demo?', timestamp: new Date(Date.now() - 300000), type: 'text' },
  { id: '5', senderId: 'ceo-1', content: 'Perfect! Let\'s do it after lunch. Great work everyone! 🚀', timestamp: new Date(Date.now() - 120000), type: 'text' },
];

const EisLagerChat = () => {
  const [users, setUsers] = useState(mockUsers);
  const [messages, setMessages] = useState(mockMessages);
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [wsConnection, setWsConnection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const currentUserId = 'current-user';

  // WebSocket connection
  useEffect(() => {
    const ws = new MockWebSocket('ws://localhost:3000/chat');
    
    ws.onopen = () => {
      setIsConnected(true);
      console.log('Connected to EisLager chat');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages(prev => [...prev, data.message]);
      }
    };
    
    ws.onclose = () => {
      setIsConnected(false);
    };
    
    setWsConnection(ws);
    
    return () => {
      ws.close();
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !isConnected) return;
    
    const message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, message]);
    
    if (wsConnection) {
      wsConnection.send(JSON.stringify({
        type: 'message',
        message,
        recipientId: selectedUser.id
      }));
    }
    
    setNewMessage('');
  }, [newMessage, isConnected, wsConnection, selectedUser.id]);

  // Handle keyboard shortcuts
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    
    return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get user by ID
  const getUserById = (id) => {
    return users.find(user => user.id === id) || { name: 'You', avatar: '👤' };
  };

  // Filter users by search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort users (CEO first, then by online status, then by unread messages)
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a.role === 'CEO') return -1;
    if (b.role === 'CEO') return 1;
    if (a.unread > 0 && b.unread === 0) return -1;
    if (a.unread === 0 && b.unread > 0) return 1;
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;
    return 0;
  });

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-champagne-pink">
      {/* Sidebar - Conversations */}
      <div className="w-96 bg-gradient-to-b from-blue-900 to-blue-800 text-white border-r border-blue-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-blue-700/50">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-blue-100">
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-blue-800/30 border border-blue-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-aquamarine focus:border-transparent placeholder-blue-300 text-white"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {sortedUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-4 flex items-center space-x-3 hover:bg-blue-800/30 border-b border-blue-700/30 transition-colors ${
                selectedUser.id === user.id ? 'bg-blue-700/50 border-l-4 border-l-aquamarine' : ''
              } ${user.role === 'CEO' ? 'bg-gradient-to-r from-yellow-500/20 to-transparent' : ''}`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                  {user.avatar}
                </div>
                {user.role === 'CEO' && (
                  <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
                )}
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  user.isOnline ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white truncate">{user.name}</h3>
                  <span className="text-xs text-blue-200">{formatTimestamp(user.lastSeen)}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-blue-100 truncate">{user.lastMessage}</p>
                  {user.unread > 0 && (
                    <span className="ml-2 px-2 py-1 bg-french-rose text-white text-xs rounded-full">
                      {user.unread}
                    </span>
                  )}
                </div>
                {user.role === 'CEO' && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-yellow-400 text-yellow-900 rounded-full">
                    CEO
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white shadow-lg">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                  {selectedUser.avatar}
                </div>
                {selectedUser.role === 'CEO' && (
                  <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400" />
                )}
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  selectedUser.isOnline ? 'bg-green-400' : 'bg-gray-400'
                }`} />
              </div>
              <div>
                <h2 className="font-semibold text-white">{selectedUser.name}</h2>
                <p className="text-sm text-blue-100">
                  {selectedUser.isOnline ? (
                    <span className="flex items-center">
                      <Circle className="w-2 h-2 fill-green-400 mr-1" />
                      Online
                    </span>
                  ) : (
                    `Last seen ${formatTimestamp(selectedUser.lastSeen)}`
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-white" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-white" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-blue-50/30 to-champagne-pink/30">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message, index) => {
              const sender = getUserById(message.senderId);
              const isOwnMessage = message.senderId === currentUserId;
              const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
              
              return (
                <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!isOwnMessage && (
                      <div className="flex-shrink-0 mr-3">
                        {showAvatar ? (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm relative">
                            {sender.avatar}
                            {sender.role === 'CEO' && (
                              <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500" />
                            )}
                          </div>
                        ) : (
                          <div className="w-8 h-8" />
                        )}
                      </div>
                    )}
                    
                    <div className={`group relative ${isOwnMessage ? 'ml-3' : ''}`}>
                      {!isOwnMessage && showAvatar && (
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-semibold text-gray-900">{sender.name}</span>
                          {sender.role === 'CEO' && (
                            <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              CEO
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className={`rounded-2xl px-4 py-2 shadow-sm ${
                        isOwnMessage 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                          : sender.role === 'CEO' 
                            ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-gray-900 border border-yellow-300'
                            : 'bg-white text-gray-900 border border-blue-100'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      
                      <div className={`flex items-center mt-1 space-x-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</span>
                        {isOwnMessage && (
                          <span className="text-xs text-gray-500">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                    {selectedUser.avatar}
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-2 border border-blue-200 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-white border-t border-blue-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                <Plus className="w-5 h-5 text-blue-600" />
              </button>
              
              <div className="flex-1 relative">
                <div className="flex items-end bg-white rounded-2xl border border-blue-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 shadow-sm">
                  <textarea
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${selectedUser.name}...`}
                    disabled={!isConnected}
                    rows={1}
                    className="flex-1 px-4 py-3 bg-transparent border-0 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                  <div className="flex items-center space-x-2 px-3 pb-3">
                    <button className="p-1 hover:bg-blue-100 rounded-lg transition-colors">
                      <Paperclip className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-1 hover:bg-blue-100 rounded-lg transition-colors">
                      <Smile className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
              <span>Press Enter to send</span>
              <div className="flex items-center space-x-4">
                <span className={`flex items-center space-x-1 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EisLagerChat;