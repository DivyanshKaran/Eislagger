"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  User,
  Send,
  MoreVertical,
  Phone,
  Video,
  Clock,
  Check,
  CheckCheck,
  MessageSquare,
  Users,
  CheckCircle,
  Mic,
  FileText,
  Image,
  File,
  Download,
  Pin,
  Filter,
  Plus,
  Zap,
  Square,
  Circle,
  Truck,
  Wrench,
  Package,
  Shield,
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

// Mock data for manufacturer chat
const contacts = [
  {
    id: "1",
    name: "Production Team",
    role: "production",
    status: "online",
    unread: 3,
    lastMessage: "Quality check completed for batch #245",
    time: "2 min ago",
    avatar: "🏭",
    priority: "high",
  },
  {
    id: "2",
    name: "Quality Control",
    role: "quality",
    status: "online",
    unread: 0,
    lastMessage: "New testing protocols ready for review",
    time: "15 min ago",
    avatar: "🔬",
    priority: "medium",
  },
  {
    id: "3",
    name: "Store #15 Manager",
    role: "store",
    status: "idle",
    unread: 1,
    lastMessage: "Delivery received successfully",
    time: "1 hour ago",
    avatar: "🏪",
    priority: "low",
  },
  {
    id: "4",
    name: "DairyCo Supplier",
    role: "supplier",
    status: "online",
    unread: 0,
    lastMessage: "Next shipment scheduled for Monday",
    time: "2 hours ago",
    avatar: "🚛",
    priority: "medium",
  },
  {
    id: "5",
    name: "Maintenance Team",
    role: "maintenance",
    status: "offline",
    unread: 0,
    lastMessage: "Equipment maintenance completed",
    time: "3 hours ago",
    avatar: "🔧",
    priority: "high",
  },
  {
    id: "6",
    name: "Inventory Management",
    role: "inventory",
    status: "online",
    unread: 0,
    lastMessage: "Stock levels updated for all products",
    time: "4 hours ago",
    avatar: "📦",
    priority: "medium",
  },
  {
    id: "7",
    name: "Safety Committee",
    role: "safety",
    status: "offline",
    unread: 0,
    lastMessage: "Monthly safety review meeting scheduled",
    time: "1 day ago",
    avatar: "🛡️",
    priority: "high",
  },
];

const messages = [
  {
    id: "1",
    senderId: "1",
    senderName: "Production Team",
    text: "Good morning! Starting production for vanilla ice cream batch #245",
    timestamp: "09:00",
    read: true,
    senderRole: "production",
  },
  {
    id: "2",
    senderId: "current",
    senderName: "You",
    text: "Perfect! Please ensure quality standards are maintained",
    timestamp: "09:02",
    read: true,
    senderRole: "manufacturer",
  },
  {
    id: "3",
    senderId: "1",
    senderName: "Production Team",
    text: "Quality check completed for batch #245. All parameters within range",
    timestamp: "09:15",
    read: true,
    senderRole: "production",
  },
  {
    id: "4",
    senderId: "current",
    senderName: "You",
    text: "Excellent! Proceed with packaging",
    timestamp: "09:16",
    read: true,
    senderRole: "manufacturer",
  },
  {
    id: "5",
    senderId: "1",
    senderName: "Production Team",
    text: "Packaging started. Expected completion in 2 hours",
    timestamp: "09:20",
    read: false,
    senderRole: "production",
  },
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case "production":
      return <Truck className="w-4 h-4" />;
    case "quality":
      return <CheckCircle className="w-4 h-4" />;
    case "store":
      return <Store className="w-4 h-4" />;
    case "supplier":
      return <Truck className="w-4 h-4" />;
    case "maintenance":
      return <Wrench className="w-4 h-4" />;
    case "inventory":
      return <Package className="w-4 h-4" />;
    case "safety":
      return <Shield className="w-4 h-4" />;
    default:
      return <User className="w-4 h-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    case "medium":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    case "low":
      return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400";
  }
};

export default function ManufacturerChatPage() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messageInput, setMessageInput] = useState("");
  const [search, setSearch] = useState("");

  const handleSend = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message
      setMessageInput("");
    }
  };

  // Filter messages for selected contact
  const filteredMessages = messages.filter(
    (msg) =>
      msg.senderId === selectedContact.id ||
      (msg.senderId === "current" && msg.senderRole === "manufacturer")
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex overflow-hidden">
          {/* Chat List Sidebar */}
          <div className="w-96 bg-white/80 dark:bg-slate-800/80 border-r border-blue-200/50 dark:border-slate-700/50 backdrop-blur-sm overflow-y-auto">
            <div className="p-4 border-b border-blue-200/50 dark:border-slate-700/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                Chats
              </h2>
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search chats..."
                  // Optionally add search state/logic
                  className="rounded-2xl pl-12 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 shadow-lg border-0 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border border-transparent text-left hover:bg-blue-50 dark:hover:bg-slate-700/50 focus:outline-none ${
                      selectedContact.id === contact.id
                        ? "bg-gradient-to-r from-blue-100 to-sky-100 dark:from-blue-900/20 dark:to-sky-900/20 border-blue-300 dark:border-blue-700"
                        : ""
                    }`}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-sky-600 text-white">
                        {contact.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold truncate text-slate-800 dark:text-white">
                          {contact.name}
                        </span>
                        {contact.status === "online" && (
                          <span className="ml-1 w-2 h-2 bg-green-500 rounded-full inline-block" />
                        )}
                        {contact.status === "idle" && (
                          <span className="ml-1 w-2 h-2 bg-yellow-400 rounded-full inline-block" />
                        )}
                        {contact.status === "offline" && (
                          <span className="ml-1 w-2 h-2 bg-slate-400 rounded-full inline-block" />
                        )}
                        {contact.unread > 0 && (
                          <Badge className="ml-2 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {contact.unread}
                          </Badge>
                        )}
                      </div>
                      <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {contact.lastMessage}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 min-w-fit">
                      <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {contact.time}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Chat Header */}
            <div className="p-6 border-b border-blue-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-sky-500 text-white text-xl">
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
                    className="hover:bg-blue-100 dark:hover:bg-slate-700 rounded-xl"
                  >
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-blue-100 dark:hover:bg-slate-700 rounded-xl"
                  >
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-blue-100 dark:hover:bg-slate-700 rounded-xl"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === "current" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-lg px-4 py-2 rounded-2xl shadow-md text-sm ${
                      msg.senderId === "current"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                    <div className="text-xs text-slate-400 mt-1 text-right">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-blue-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 flex items-center gap-3">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message ${selectedContact.name}...`}
                className="flex-1 rounded-2xl px-4 py-2 bg-white/90 dark:bg-slate-800/90 border-0 shadow"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && messageInput.trim()) {
                    // handleSend();
                  }
                }}
              />
              <Button className="bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-xl px-6 py-2 shadow-lg">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
