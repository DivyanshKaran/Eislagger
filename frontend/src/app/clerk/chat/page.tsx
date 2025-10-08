"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  Smile,
  Crown,
  Building,
  Store,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock contacts data
const contacts = [
  {
    id: "1",
    name: "Executive Team",
    role: "executive",
    status: "online",
    unread: 2,
    lastMessage: "Please update inventory for Store #12",
    time: "2m ago",
    avatar: "👑",
  },
  {
    id: "2",
    name: "Manufacturer",
    role: "manufacturer",
    status: "idle",
    unread: 1,
    lastMessage: "New flavor delivery tomorrow",
    time: "15m ago",
    avatar: "🏭",
  },
  {
    id: "3",
    name: "Customer Support",
    role: "clerk",
    status: "online",
    unread: 0,
    lastMessage: "Refund processed successfully",
    time: "1h ago",
    avatar: "🛍️",
  },
  {
    id: "4",
    name: "Store Manager",
    role: "clerk",
    status: "offline",
    unread: 0,
    lastMessage: "Daily reports completed",
    time: "2h ago",
    avatar: "👨‍💼",
  },
  {
    id: "5",
    name: "Supply Chain",
    role: "manufacturer",
    status: "online",
    unread: 0,
    lastMessage: "Inventory levels normal",
    time: "3h ago",
    avatar: "🚚",
  },
];

// Mock messages for first conversation
const sampleMessages = [
  {
    id: "1",
    senderId: "1",
    senderName: "Executive Team",
    text: "Hi! Please update the inventory for Store #12. We need accurate stock levels for today's report.",
    timestamp: "10:30 AM",
    read: true,
    isOwn: false,
  },
  {
    id: "2",
    senderId: "current",
    senderName: "You",
    text: "Will do! I'll update it right away. Should I include the damaged items in the report?",
    timestamp: "10:32 AM",
    read: true,
    isOwn: true,
  },
  {
    id: "3",
    senderId: "1",
    senderName: "Executive Team",
    text: "Yes, please include all damaged items with photos if possible. Thanks!",
    timestamp: "10:33 AM",
    read: false,
    isOwn: false,
  },
  {
    id: "4",
    senderId: "current",
    senderName: "You",
    text: "Perfect! I'll have the complete report ready within 30 minutes.",
    timestamp: "10:34 AM",
    read: false,
    isOwn: true,
  },
  {
    id: "5",
    senderId: "1",
    senderName: "Executive Team",
    text: "Great work! Keep up the excellent service.",
    timestamp: "10:37 AM",
    read: false,
    isOwn: false,
  },
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case "executive":
      return <Crown className="w-4 h-4" />;
    case "manufacturer":
      return <Building className="w-4 h-4" />;
    case "clerk":
      return <Store className="w-4 h-4" />;
    default:
      return <User className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-green-500";
    case "idle":
      return "bg-yellow-500";
    case "offline":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
};

export default function ClerkChatPage() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(sampleMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        senderId: "current",
        senderName: "You",
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
        isOwn: true,
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen w-screen fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300/30 to-purple-300/30 dark:from-pink-300/20 dark:to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-pink-200/30 dark:from-blue-300/20 dark:to-pink-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 z-10 flex">
      
        {/* Contacts Sidebar - Left Side */}
        <div className="w-80 flex-shrink-0 bg-white/90 dark:bg-slate-800/90 border-r border-pink-200/50 dark:border-pink-800/50 flex flex-col">
          {/* Contacts Header */}
          <div className="p-4 border-b border-pink-200/50 dark:border-pink-800/50 bg-pink-50/50 dark:bg-slate-700/50 flex-shrink-0">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Contacts</h2>
          </div>
          
          {/* Contacts List - SCROLLABLE */}
          <div className="flex-1 overflow-y-auto bg-pink-50/30 dark:bg-slate-700/30">
            <div className="p-4 space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-3 rounded-xl cursor-pointer transition-all hover:bg-pink-100/80 dark:hover:bg-slate-600/70 group ${
                    selectedContact.id === contact.id
                      ? "bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 border border-pink-200 dark:border-pink-700"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-lg">
                          {contact.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-800 dark:text-white truncate">{contact.name}</h3>
                        {contact.unread > 0 && (
                          <Badge className="bg-pink-500 text-white text-xs">
                            {contact.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate mt-1">
                        {contact.lastMessage}
                      </p>
                      <div className="text-xs text-slate-500 mt-1">{contact.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-white/90 dark:bg-slate-800/90">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-pink-200/50 dark:border-pink-800/50 bg-gradient-to-r from-pink-50/80 to-purple-50/80 dark:from-pink-900/20 dark:to-purple-900/20 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                  {selectedContact.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 dark:text-white">{selectedContact.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${selectedContact.status === "online" ? "text-green-600" : selectedContact.status === "idle" ? "text-yellow-600" : "text-gray-500"}`}>
                    {selectedContact.status}
                  </span>
                  <span className="text-slate-400">•</span>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    {getRoleIcon(selectedContact.role)}
                    <span className="text-sm capitalize">{selectedContact.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area - SCROLLABLE */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white/50 to-pink-50/50 dark:from-slate-800/50 dark:to-slate-700/50">
            <div className="p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? "justify-end" : "justify-start"} transition-all duration-300`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`max-w-md ${msg.isOwn ? "order-2" : "order-1"}`}>
                    <div
                      className={`p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                        msg.isOwn
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "bg-white dark:bg-slate-700 border border-pink-200/50 dark:border-slate-600/50"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-2 text-xs ${msg.isOwn ? "text-pink-100" : "text-slate-500"}`}>
                        <span>{msg.timestamp}</span>
                        {msg.isOwn && (
                          <span className="ml-1">
                            {msg.read ? "✓✓" : "✓"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-pink-200/50 dark:border-pink-800/50 bg-gradient-to-r from-pink-50/80 to-purple-50/80 dark:from-pink-900/20 dark:to-purple-900/20 flex-shrink-0">
            <div className="flex items-end gap-3">
              <Button variant="ghost" size="icon" className="hover:bg-pink-100 dark:hover:bg-slate-700 rounded-xl">
                <Paperclip className="w-5 h-5" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="rounded-2xl pr-12 py-3 bg-white/90 dark:bg-slate-800/90 border-pink-200 dark:border-slate-600 focus:ring-2 focus:ring-pink-500/50"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-pink-100 dark:hover:bg-slate-600 rounded-xl"
                >
                  <Smile className="w-5 h-5" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 shadow-lg transition-all duration-300"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}