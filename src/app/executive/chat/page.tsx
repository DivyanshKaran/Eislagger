"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Search,
  User,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Star,
  Crown,
  Building,
  Store,
  IceCream,
  Clock,
  Check,
  CheckCheck,
} from "lucide-react";

// Add custom animations
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  .animate-slide-in-up {
    animation: slideInUp 0.6s ease-out forwards;
  }
  
  .animate-fade-in-scale {
    animation: fadeInScale 0.5s ease-out forwards;
  }
`;

// Mock data for executive chat
const contacts = [
  {
    id: "1",
    name: "Mumbai Factory Manager",
    role: "manufacturer",
    status: "online",
    unread: 3,
    lastMessage: "Production targets met for this week",
    time: "2 min ago",
    avatar: "🏭",
    priority: "high",
  },
  {
    id: "2",
    name: "Delhi Store Manager",
    role: "clerk",
    status: "online",
    unread: 0,
    lastMessage: "Sales report submitted",
    time: "1 hour ago",
    avatar: "🏪",
    priority: "medium",
  },
  {
    id: "3",
    name: "Bangalore Operations",
    role: "executive",
    status: "idle",
    unread: 1,
    lastMessage: "Budget review meeting scheduled",
    time: "3 hours ago",
    avatar: "👔",
    priority: "high",
  },
  {
    id: "4",
    name: "Chennai Factory",
    role: "manufacturer",
    status: "offline",
    unread: 0,
    lastMessage: "Equipment maintenance completed",
    time: "1 day ago",
    avatar: "🏭",
    priority: "low",
  },
  {
    id: "5",
    name: "Kolkata Store Chain",
    role: "clerk",
    status: "online",
    unread: 2,
    lastMessage: "New flavor launch feedback",
    time: "30 min ago",
    avatar: "🏪",
    priority: "medium",
  },
];

const messages = [
  {
    id: "1",
    senderId: "1",
    senderName: "Mumbai Factory Manager",
    text: "Good morning! Production targets met for this week. We've exceeded expectations by 15%.",
    timestamp: "09:15",
    read: true,
    senderRole: "manufacturer",
  },
  {
    id: "2",
    senderId: "current",
    senderName: "You",
    text: "Excellent work! Please prepare a detailed report for the board meeting.",
    timestamp: "09:16",
    read: true,
    senderRole: "executive",
  },
  {
    id: "3",
    senderId: "1",
    senderName: "Mumbai Factory Manager",
    text: "Will do! I'll have it ready by tomorrow morning. Should I include the cost analysis as well?",
    timestamp: "09:17",
    read: false,
    senderRole: "manufacturer",
  },
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case "manufacturer":
      return <Building className="w-4 h-4" />;
    case "clerk":
      return <Store className="w-4 h-4" />;
    case "executive":
      return <Crown className="w-4 h-4" />;
    default:
      return <User className="w-4 h-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    case "medium":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
    case "low":
      return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400";
  }
};

export default function ExecutiveChatPage() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      // In a real app, this would send the message
      setMessage("");
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="flex flex-col h-screen">
        {/* Stunning Glassy Top Navigation */}
        <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-800/70 border-b border-pink-200/50 dark:border-slate-700/50 px-8 py-6 flex items-center justify-between backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">💬</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-bold text-2xl bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                Communications
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Real-time team collaboration & management
              </p>
            </div>
          </div>

          <div className="flex-1 flex justify-center max-w-2xl mx-8">
            <div className="relative w-full group">
              <Input
                type="text"
                placeholder="Search contacts, messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-2xl pl-12 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 shadow-lg border-0 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 group-hover:shadow-xl"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-pink-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </Button>
            <Avatar className="ml-2 ring-2 ring-pink-200 dark:ring-slate-700 hover:ring-pink-400 transition-all duration-300">
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                <Crown className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Chat Interface */}
        <div className="flex-1 flex overflow-hidden">
          {/* Contacts Sidebar */}
          <div className="w-80 bg-white/80 dark:bg-slate-800/80 border-r border-pink-200/50 dark:border-slate-700/50 backdrop-blur-sm overflow-y-auto">
            <div className="p-4 border-b border-pink-200/50 dark:border-slate-700/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                Team Contacts
              </h2>
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-pink-50 dark:hover:bg-slate-700/50 ${
                      selectedContact.id === contact.id
                        ? "bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-200 dark:border-pink-700"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-lg">
                            {contact.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            contact.status === "online"
                              ? "bg-green-500"
                              : contact.status === "idle"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                          }`}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-slate-800 dark:text-white truncate">
                            {contact.name}
                          </h3>
                          {contact.unread > 0 && (
                            <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                              {contact.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                          {contact.lastMessage}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500 dark:text-slate-500">
                            {contact.time}
                          </span>
                          <Badge
                            className={`text-xs ${getPriorityColor(
                              contact.priority
                            )}`}
                          >
                            {contact.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-pink-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-xl">
                      {selectedContact.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                      {selectedContact.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          selectedContact.status === "online"
                            ? "text-green-600"
                            : selectedContact.status === "idle"
                            ? "text-yellow-600"
                            : "text-gray-500"
                        }`}
                      >
                        {selectedContact.status}
                      </span>
                      <span className="text-slate-400">•</span>
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                        {getRoleIcon(selectedContact.role)}
                        <span className="text-sm capitalize">
                          {selectedContact.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-pink-100 dark:hover:bg-slate-700 rounded-xl"
                  >
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-pink-100 dark:hover:bg-slate-700 rounded-xl"
                  >
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-pink-100 dark:hover:bg-slate-700 rounded-xl"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === "current" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md ${
                      msg.senderId === "current" ? "order-2" : "order-1"
                    }`}
                  >
                    <div
                      className={`p-4 rounded-2xl ${
                        msg.senderId === "current"
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "bg-white dark:bg-slate-700 border border-pink-200/50 dark:border-slate-600/50"
                      } shadow-lg`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <div
                        className={`flex items-center gap-1 mt-2 ${
                          msg.senderId === "current"
                            ? "text-pink-100"
                            : "text-slate-500"
                        }`}
                      >
                        <span className="text-xs">{msg.timestamp}</span>
                        {msg.senderId === "current" && (
                          <div className="flex items-center gap-1">
                            {msg.read ? (
                              <CheckCheck className="w-3 h-3" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-pink-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="flex items-end gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-pink-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="rounded-2xl pr-12 py-3 bg-white/70 dark:bg-slate-700/70 border-pink-200 dark:border-slate-600 focus:ring-2 focus:ring-pink-500/50"
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
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
                  onClick={handleSend}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
