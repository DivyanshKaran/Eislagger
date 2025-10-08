"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Crown,
  Building,
  Star,
  Phone,
  Video,
  MoreVertical,
  MessageCircle,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Executive team contacts
const executiveContacts = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "VP Strategy & Development", 
    status: "online",
    lastMessage: "Board presentation materials ready",
    time: "2m ago",
    unread: 0,
    priority: "high",
    avatar: "SC"
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    title: "Regional Operations Director",
    status: "busy", 
    lastMessage: "Q4 expansion metrics uploaded",
    time: "15m ago",
    unread: 2,
    priority: "medium",
    avatar: "MR"
  },
  {
    id: "3", 
    name: "Emma Thompson",
    title: "Corporate Communications",
    status: "online",
    lastMessage: "Investor relations update sent",
    time: "1h ago", 
    unread: 0,
    priority: "high",
    avatar: "ET"
  },
  {
    id: "4",
    name: "David Kim", 
    title: "Technology Innovation Lead",
    status: "away",
    lastMessage: "Tech upgrade proposal ready",
    time: "2h ago",
    unread: 1,
    priority: "medium", 
    avatar: "DK"
  },
  {
    id: "5",
    name: "Lisa Zhang",
    title: "Financial Planning Director", 
    status: "online",
    lastMessage: "Revenue projections updated",
    time: "3h ago",
    unread: 0,
    priority: "high",
    avatar: "LZ"
  }
];

// Sample executive messages
const executiveMessages = [
  {
    id: "1",
    senderId: "1", 
    content: "Good morning! The board meeting materials are ready for your review. The quarterly performance metrics look excellent.",
    timestamp: "09:15 AM",
    isOwn: false
  },
  {
    id: "2",
    senderId: "user",
    content: "Excellent Sarah. Please share the detailed breakdown for our market expansion strategy.",
    timestamp: "09:16 AM", 
    isOwn: true
  },
  {
    id: "3",
    senderId: "1",
    content: "Certainly! Market expansion shows 34% growth in target regions with digital channels outperforming traditional by 22%.",
    timestamp: "09:17 AM",
    isOwn: false
  },
  {
    id: "4", 
    senderId: "user",
    content: "Outstanding performance. Let's schedule the executive planning session for next Tuesday.",
    timestamp: "09:18 AM",
    isOwn: true
  }
];

export default function ExecutiveChatPage() {
  const [selectedContact, setSelectedContact] = useState(executiveContacts[0]);
  const [messages, setMessages] = useState(executiveMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        senderId: "user",
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-emerald-500";
      case "busy": return "bg-orange-500";
      case "away": return "bg-yellow-500";
      default: return "bg-slate-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      default: return "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/20 relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-violet-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-300/20 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main chat interface */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto">
        <div className="flex h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 dark:border-purple-800/50 overflow-hidden">
          
          {/* Executive contacts sidebar */}
          <div className="w-80 flex-shrink-0 border-r border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-900/20 dark:to-slate-800">
            
            {/* Header */}
            <div className="p-6 border-b border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/80 to-violet-50/80 dark:from-purple-900/20 dark:to-violet-900/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800 dark:text-white">Executive Board</h1>
                  <p className="text-xs text-purple-600 dark:text-purple-400">Strategic Communications</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor("high")}`}>
                  {executiveContacts.filter(c => c.priority === "high").length} High Priority
                </span>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor("medium")}`}>
                  {executiveContacts.filter(c => c.priority === "medium").length} Active
                </span>
              </div>
            </div>

            {/* Contacts list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {executiveContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                    selectedContact.id === contact.id
                      ? "bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700 shadow-md"
                      : "bg-white/70 dark:bg-slate-800/70 border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50/50 dark:hover:bg-slate-700/50 hover:border-purple-300 dark:hover:border-purple-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                        contact.priority === "high" ? "from-purple-600 to-violet-700" : "from-violet-600 to-purple-700"
                      } flex items-center justify-center text-white font-bold text-sm`}>
                        {contact.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${getStatusColor(contact.status)}`}></div>
                      {contact.priority === "high" && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Contact info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-800 dark:text-white text-sm truncate">{contact.name}</h3>
                        {contact.unread > 0 && (
                          <div className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {contact.unread}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium truncate mb-1">{contact.title}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-0.5 rounded-md ${getPriorityColor(contact.priority)}`}>
                          {contact.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{contact.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-h-0">
            
            {/* Chat header */}
            <div className="p-6 border-b border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/80 to-violet-50/80 dark:from-purple-900/20 dark:to-violet-900/20 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-13 h-13 rounded-xl bg-gradient-to-br ${
                      selectedContact.priority === "high" ? "from-purple-600 to-violet-700" : "from-violet-600 to-purple-700"
                    } flex items-center justify-center text-white font-bold text-lg`}>
                      {selectedContact.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 ${getStatusColor(selectedContact.status)}`}></div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white">{selectedContact.name}</h2>
                      {selectedContact.priority === "high" && (
                        <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-md">
                          <Star className="w-3 h-3 text-yellow-600" />
                          <span className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">VIP</span>
                        </div>
                      )}
                    </div>
                    <p className="text-purple-600 dark:text-purple-400 font-medium mb-1">{selectedContact.title}</p>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(selectedContact.priority)}`}>
                        {selectedContact.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400`}>
                        {selectedContact.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-slate-700">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-slate-700">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-slate-700">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-purple-50/30 to-transparent dark:from-purple-900/10">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] ${message.isOwn ? "order-2" : ""}`}>
                    
                    {/* Sender info for other's messages */}
                    {!message.isOwn && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center text-white font-semibold text-xs">
                          {selectedContact.avatar}
                        </div>
                        <span className="text-sm font-medium text-slate-800 dark:text-white">{selectedContact.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{message.timestamp}</span>
                      </div>
                    )}
                    
                    {/* Message bubble */}
                    <div className={`p-4 rounded-2xl ${
                      message.isOwn
                        ? "bg-gradient-to-r from-purple-600 to-violet-700 text-white ml-auto"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-lg border border-purple-200/50 dark:border-purple-800/50"
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      {message.isOwn && (
                        <div className="text-xs text-purple-100 mt-2 text-right">{message.timestamp}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-6 border-t border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/80 to-violet-50/80 dark:from-purple-900/20 dark:to-violet-900/20 flex-shrink-0">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Send strategic message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-800 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white rounded-xl px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}