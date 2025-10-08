"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Crown,
  Building,
  Store,
  User,
  Truck,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Custom animations
const customStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  .animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
  .animate-slide-in { animation: slideIn 0.3s ease-out; }
`;

// Mock contacts data for manufacturer
const contacts = [
  {
    id: "1",
    name: "Production Team",
    role: "production",
    status: "online",
    unread: 3,
    lastMessage: "Quality check completed for batch #245",
    time: "2m ago",
    avatar: "🏭",
  },
  {
    id: "2",
    name: "Quality Control",
    role: "quality",
    status: "idle",
    unread: 1,
    lastMessage: "New testing protocols ready for review",
    time: "15m ago",
    avatar: "🔬",
  },
  {
    id: "3",
    name: "Store #15 Manager",
    role: "store",
    status: "online",
    unread: 0,
    lastMessage: "Delivery received successfully",
    time: "1h ago",
    avatar: "🏪",
  },
  {
    id: "4",
    name: "DairyCo Supplier",
    role: "supplier",
    status: "offline",
    unread: 0,
    lastMessage: "Next shipment scheduled for Monday",
    time: "2h ago",
    avatar: "🚛",
  },
];

// Mock messages for first conversation
const sampleMessages = [
  {
    id: "1",
    senderId: "1",
    senderName: "Production Team",
    text: "Good morning! Starting production for vanilla ice cream batch #245. All ingredients checked and ready.",
    timestamp: "9:00 AM",
    read: true,
    isOwn: false,
  },
  {
    id: "2",
    senderId: "current",
    senderName: "You",
    text: "Perfect! Please ensure quality standards are maintained throughout the process.",
    timestamp: "9:02 AM",
    read: true,
    isOwn: true,
  },
  {
    id: "3",
    senderId: "1",
    senderName: "Production Team",
    text: "Quality check completed for batch #245. All parameters within optimal range. Proceeding with packaging.",
    timestamp: "9:15 AM",
    read: true,
    isOwn: false,
  },
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case "production":
      return <Truck className="w-4 h-4" />;
    case "quality":
      return <Package className="w-4 h-4" />;
    case "store":
      return <Store className="w-4 h-4" />;
    case "supplier":
      return <Truck className="w-4 h-4" />;
    default:
      return <Building className="w-4 h-4" />;
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

export default function ManufacturerChatPage() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(sampleMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !document.head.querySelector("#manufacturer-chat-styles")) {
      const style = document.createElement("style");
      style.id = "manufacturer-chat-styles";
      style.innerHTML = customStyles;
      document.head.appendChild(style);
    }
  }, []);

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
    <div className="h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-sky-300/30 dark:from-blue-300/20 dark:to-sky-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-300/30 to-blue-200/30 dark:from-indigo-300/20 dark:to-blue-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>

      {/* Main Chat Container */}
      <div className="relative z-10 h-full flex items-center justify-center p-6">
        <div className="w-full max-w-6xl h-[90vh] bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200/50 dark:border-blue-800/40 overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-r from-blue-100/80 to-sky-100/80 dark:from-blue-900/30 dark:to-sky-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Manufacturing Chat</h1>
                  <p className="text-slate-600 dark:text-slate-400">Connect with production teams and suppliers</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="hover:bg-blue-100 dark:hover:bg-slate-700">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-blue-100 dark:hover:bg-slate-700">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-blue-100 dark:hover:bg-slate-700">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 min-h-0">
            
            {/* Contacts Sidebar */}
            <div className="w-80 border-r border-blue-200/50 dark:border-blue-800/50 flex flex-col">
              <div className="p-4 border-b border-blue-200/50 dark:border-blue-800/50">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Team Contacts</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-2">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`p-3 rounded-xl cursor-pointer transition-all hover:bg-blue-50 dark:hover:bg-slate-700/50 animate-slide-in ${
                        selectedContact.id === contact.id
                          ? "bg-gradient-to-r from-blue-100 to-sky-100 dark:from-blue-900/20 dark:to-sky-900/20 border border-blue-200 dark:border-blue-700"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-sky-600 text-white text-lg">
                              {contact.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-slate-800 dark:text-white truncate">{contact.name}</h3>
                            {contact.unread > 0 && (
                              <Badge className="bg-blue-500 text-white text-xs">
                                {contact.unread}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 truncate mt-1">
                            {contact.lastMessage}
                          </p>
                        </div>
                        <div className="text-xs text-slate-500">{contact.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-r from-blue-50/80 to-sky-50/80 dark:from-blue-900/20 dark:to-sky-900/20">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-sky-600 text-white">
                      {selectedContact.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 dark:text-white">{selectedContact.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${selectedContact.status === "online" ? "text-green-600" : selectedContact.status === "idle" ? "text-yellow-600" : "text-gray-500"}`} >
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

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? "justify-end" : "justify-start"} animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`max-w-md ${msg.isOwn ? "order-2" : "order-1"}`}>
                      <div
                        className={`p-4 rounded-2xl shadow-sm ${
                          msg.isOwn
                            ? "bg-gradient-to-r from-blue-500 to-sky-600 text-white"
                            : "bg-white dark:bg-slate-700 border border-blue-200/50 dark:border-slate-600/50"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <div className={`flex items-center gap-1 mt-2 text-xs ${msg.isOwn ? "text-blue-100" : "text-slate-500"}`}>
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

              {/* Message Input */}
              <div className="p-4 border-t border-blue-200/50 dark:border-blue-800/50 bg-blue-50/80 dark:bg-slate-800/80">
                <div className="flex items-end gap-3">
                  <Button variant="ghost" size="icon" className="hover:bg-blue-100 dark:hover:bg-slate-700 rounded-xl">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="rounded-2xl pr-12 py-3 bg-white/90 dark:bg-slate-800/90 border-blue-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500/50"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-blue-100 dark:hover:bg-slate-600 rounded-xl"
                    >
                      <Smile className="w-5 h-5" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white rounded-xl px-6 py-3 shadow-lg transition-all duration-300"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}