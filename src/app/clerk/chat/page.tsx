"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Store,
  Crown,
  Building,
  Check,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Custom Animations ---
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
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
  .animate-slide-in-up { animation: slideInUp 0.6s ease-out forwards; }
  .animate-fade-in-scale { animation: fadeInScale 0.5s ease-out forwards; }
`;

// --- Types ---
type Role = "executive" | "manufacturer" | "clerk" | "patron";
type Status = "online" | "idle" | "dnd";
interface User {
  id: string;
  name: string;
  role: Role;
  status: Status;
  unread: number;
  avatar: string;
}
interface Message {
  id: string;
  senderId: string;
  senderRole: Role;
  text: string;
  timestamp: string;
  read: boolean;
}

// --- Mock Data ---
const users: User[] = [
  {
    id: "1",
    name: "Ava CEO",
    role: "executive",
    status: "online",
    unread: 2,
    avatar: "/window.svg",
  },
  {
    id: "2",
    name: "Mint Factory",
    role: "manufacturer",
    status: "idle",
    unread: 0,
    avatar: "/globe.svg",
  },
  {
    id: "3",
    name: "Store #12 Clerk",
    role: "clerk",
    status: "online",
    unread: 0,
    avatar: "/next.svg",
  },
  {
    id: "4",
    name: "Divyansh",
    role: "patron",
    status: "dnd",
    unread: 1,
    avatar: "/vercel.svg",
  },
];

const messagesMock: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      senderId: "1",
      senderRole: "executive",
      text: "Please push more Strawberry Dream to Store #22. Sales up 30%.",
      timestamp: "09:01",
      read: true,
    },
    {
      id: "m2",
      senderId: "3",
      senderRole: "clerk",
      text: "On it! Will update inventory and notify the team.",
      timestamp: "09:02",
      read: true,
    },
  ],
  "2": [
    {
      id: "m3",
      senderId: "3",
      senderRole: "clerk",
      text: "We’re running low on Mango Swirl. Could you deliver 100L by Friday?",
      timestamp: "10:15",
      read: true,
    },
    {
      id: "m4",
      senderId: "2",
      senderRole: "manufacturer",
      text: "Confirmed! Will dispatch on Thursday.",
      timestamp: "10:16",
      read: true,
    },
  ],
  "4": [
    {
      id: "m5",
      senderId: "4",
      senderRole: "patron",
      text: "My last order was melted upon delivery. Can I get a refund?",
      timestamp: "11:00",
      read: false,
    },
    {
      id: "m6",
      senderId: "3",
      senderRole: "clerk",
      text: "Sorry about that! I’ll process your refund right away.",
      timestamp: "11:01",
      read: false,
    },
  ],
};

const getRoleIcon = (role: Role) => {
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

const getPriority = (user: User) => {
  // Just for demo: executive/manufacturer = high, clerk = medium, patron = low
  if (user.role === "executive" || user.role === "manufacturer") return "high";
  if (user.role === "clerk") return "medium";
  return "low";
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

const getStatusDot = (status: Status) => {
  return (
    <span
      className={cn(
        "inline-block w-3 h-3 rounded-full border-2 border-white",
        status === "online"
          ? "bg-green-500"
          : status === "idle"
          ? "bg-yellow-500"
          : "bg-gray-400"
      )}
    />
  );
};

export default function ClerkChatPage() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !document.head.querySelector("#clerk-chat-animations")
    ) {
      const style = document.createElement("style");
      style.id = "clerk-chat-animations";
      style.innerHTML = customStyles;
      document.head.appendChild(style);
    }
  }, []);

  const [selectedUser, setSelectedUser] = useState<User>(users[0]);
  const [messages, setMessages] = useState<Message[]>(
    messagesMock[users[0].id] || []
  );
  const [message, setMessage] = useState("");
  const [search] = useState("");
  const currentUser = users.find((u) => u.role === "clerk");

  useEffect(() => {
    setMessages(messagesMock[selectedUser.id] || []);
  }, [selectedUser]);

  const handleSend = () => {
    if (message.trim() && currentUser) {
      setMessages((prev) => [
        ...prev,
        {
          id: `m${Math.random()}`,
          senderId: currentUser.id,
          senderRole: currentUser.role,
          text: message,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          read: false,
        },
      ]);
      setMessage("");
    }
  };

  // Filter contacts by search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="flex h-screen w-full overflow-hidden">
        {/* Contacts Sidebar */}
        <div className="w-80 bg-white/80 dark:bg-slate-800/80 border-r border-pink-200/50 dark:border-slate-700/50 backdrop-blur-sm overflow-y-auto">
          <div className="p-4 border-b border-pink-200/50 dark:border-slate-700/50">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
              Team Contacts
            </h2>
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-pink-50 dark:hover:bg-slate-700/50 ${
                    selectedUser.id === user.id
                      ? "bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-200 dark:border-pink-700"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-lg">
                          {user.avatar.endsWith(".svg") ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8"
                            />
                          ) : (
                            user.avatar
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {getStatusDot(user.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-800 dark:text-white truncate">
                          {user.name}
                        </h3>
                        {user.unread > 0 && (
                          <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                            {user.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {messagesMock[user.id]?.slice(-1)[0]?.text ||
                          "No messages yet"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 dark:text-slate-500">
                          {messagesMock[user.id]?.slice(-1)[0]?.timestamp || ""}
                        </span>
                        <Badge
                          className={`text-xs ${getPriorityColor(
                            getPriority(user)
                          )}`}
                        >
                          {getPriority(user)}
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
        <div className="flex-1 flex flex-col p-8 max-w-full">
          {/* Chat Header */}
          <div className="p-6 border-b border-pink-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-xl">
                    {selectedUser.avatar.endsWith(".svg") ? (
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-8 h-8"
                      />
                    ) : (
                      selectedUser.avatar
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    {selectedUser.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${
                        selectedUser.status === "online"
                          ? "text-green-600"
                          : selectedUser.status === "idle"
                          ? "text-yellow-600"
                          : "text-gray-500"
                      }`}
                    >
                      {selectedUser.status}
                    </span>
                    <span className="text-slate-400">•</span>
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      {getRoleIcon(selectedUser.role)}
                      <span className="text-sm capitalize">
                        {selectedUser.role}
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
            {messages.map((msg) => {
              const isOwn = msg.senderId === currentUser?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-md ${isOwn ? "order-2" : "order-1"}`}>
                    <div
                      className={`p-4 rounded-2xl ${
                        isOwn
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "bg-white dark:bg-slate-700 border border-pink-200/50 dark:border-slate-600/50"
                      } shadow-lg`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <div
                        className={`flex items-center gap-1 mt-2 ${
                          isOwn ? "text-pink-100" : "text-slate-500"
                        }`}
                      >
                        <span className="text-xs">{msg.timestamp}</span>
                        {isOwn && (
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
              );
            })}
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
    </>
  );
}
