"use client";
import React, { useState } from "react";
import {
  FaStar,
  FaIndustry,
  FaShoppingCart,
  FaIceCream,
  FaPaperPlane,
  FaPaperclip,
  FaSmile,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

// --- Mock Data ---
const roles = {
  executive: {
    label: "EXECUTIVE",
    color: "bg-[#FFE066] text-[#1F1F1F]",
    tag: "Gold",
    icon: <FaStar className="text-yellow-400" />,
    sidebar: "bg-yellow-400/20 text-yellow-300",
    bubble: "bg-[#FFE066] text-[#1F1F1F]",
  },
  manufacturer: {
    label: "FACTORY OWNER",
    color: "bg-[#A8FFDF] text-[#1F1F1F]",
    tag: "Mint",
    icon: <FaIndustry className="text-green-400" />,
    sidebar: "bg-green-300/20 text-green-200",
    bubble: "bg-[#A8FFDF] text-[#1F1F1F]",
  },
  clerk: {
    label: "STORE CLERK",
    color: "bg-[#FFDAB3] text-[#1F1F1F]",
    tag: "Coral",
    icon: <FaShoppingCart className="text-orange-300" />,
    sidebar: "bg-orange-200/20 text-orange-200",
    bubble: "bg-[#FFDAB3] text-[#1F1F1F]",
  },
  patron: {
    label: "CUSTOMER",
    color: "bg-[#FFB7CE] text-[#1F1F1F]",
    tag: "Pink",
    icon: <FaIceCream className="text-pink-300" />,
    sidebar: "bg-pink-200/20 text-pink-200",
    bubble: "bg-[#FFB7CE] text-[#1F1F1F]",
  },
};

const users: User[] = [
  {
    id: "1",
    name: "Ava CEO",
    role: "executive" as Role,
    status: "online" as Status,
    unread: 2,
    avatar: "/window.svg",
  },
  {
    id: "2",
    name: "Mint Factory",
    role: "manufacturer" as Role,
    status: "idle" as Status,
    unread: 0,
    avatar: "/globe.svg",
  },
  {
    id: "3",
    name: "Store #12 Clerk",
    role: "clerk" as Role,
    status: "online" as Status,
    unread: 0,
    avatar: "/next.svg",
  },
  {
    id: "4",
    name: "Divyansh",
    role: "patron" as Role,
    status: "dnd" as Status,
    unread: 1,
    avatar: "/vercel.svg",
  },
];

const messagesMock: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      senderId: "1",
      senderRole: "executive" as Role,
      text: "Please push more Strawberry Dream to Store #22. Sales up 30%.",
      timestamp: "09:01",
      read: true,
    },
    {
      id: "m2",
      senderId: "3",
      senderRole: "clerk" as Role,
      text: "On it! Will update inventory and notify the team.",
      timestamp: "09:02",
      read: true,
    },
  ],
  "2": [
    {
      id: "m3",
      senderId: "3",
      senderRole: "clerk" as Role,
      text: "We’re running low on Mango Swirl. Could you deliver 100L by Friday?",
      timestamp: "10:15",
      read: true,
    },
    {
      id: "m4",
      senderId: "2",
      senderRole: "manufacturer" as Role,
      text: "Confirmed! Will dispatch on Thursday.",
      timestamp: "10:16",
      read: true,
    },
  ],
  "4": [
    {
      id: "m5",
      senderId: "4",
      senderRole: "patron" as Role,
      text: "My last order was melted upon delivery. Can I get a refund?",
      timestamp: "11:00",
      read: false,
    },
    {
      id: "m6",
      senderId: "3",
      senderRole: "clerk" as Role,
      text: "Sorry about that! I’ll process your refund right away.",
      timestamp: "11:01",
      read: false,
    },
  ],
};

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

// --- Utility ---
function getRoleMeta(role: Role) {
  return roles[role] || roles.clerk;
}

// --- Components ---
// (ChatSidebar, ChatHeader, MessageBubble are now unused and can be removed)
function StatusDot({ status }: { status: Status }) {
  const color =
    status === "online"
      ? "bg-green-400"
      : status === "idle"
      ? "bg-gray-400"
      : "bg-red-400";
  return (
    <span className={cn("inline-block w-2 h-2 rounded-full mr-1", color)} />
  );
}

function TypingIndicator({ user }: { user: User | null }) {
  if (!user) return null;
  const meta = getRoleMeta(user.role);
  return (
    <div className="flex items-center gap-2 px-6 py-2">
      <span className="text-xs text-gray-300">{user.name} is typing</span>
      <span className="flex gap-1">
        <span
          className={cn("w-2 h-2 rounded-full", meta.color, "animate-bounce")}
          style={{ animationDelay: "0ms" }}
        />
        <span
          className={cn("w-2 h-2 rounded-full", meta.color, "animate-bounce")}
          style={{ animationDelay: "100ms" }}
        />
        <span
          className={cn("w-2 h-2 rounded-full", meta.color, "animate-bounce")}
          style={{ animationDelay: "200ms" }}
        />
      </span>
    </div>
  );
}

function ChatInputBox({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  return (
    <form
      className="flex items-end gap-2 bg-[#FFF1F9] rounded-xl border border-pink-200 px-4 py-3 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) {
          onSend(value);
          setValue("");
        }
      }}
    >
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="text-pink-400 hover:text-pink-600"
      >
        <FaPaperclip size={20} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.pdf,.xlsx"
        className="hidden"
      />
      <textarea
        className="flex-1 rounded-lg bg-transparent text-pink-900 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 min-h-[48px] max-h-[120px] text-base"
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a message..."
      />
      <button type="button" className="text-pink-400 hover:text-pink-600">
        <FaSmile size={20} />
      </button>
      <button
        type="submit"
        className="bg-pink-400 hover:bg-pink-500 text-white rounded-full p-2 shadow"
      >
        <FaPaperPlane size={20} />
      </button>
    </form>
  );
}

// --- Main Component ---
export function Chat() {
  const [selectedId, setSelectedId] = useState<string>("1");
  const [messages, setMessages] = useState<Message[]>(messagesMock["1"] || []);
  const [typing, setTyping] = useState<User | null>(null);
  const selectedUser: User | undefined = users.find((u) => u.id === selectedId);
  const currentUser = users.find((u) => u.role === "clerk")!; // Demo: clerk as current user, always defined

  React.useEffect(() => {
    setMessages(messagesMock[selectedId] || []);
    if (selectedId === "2") {
      const user = users.find((u) => u.id === "2");
      setTyping(user ?? null);
      const t = setTimeout(() => setTyping(null), 2000);
      return () => clearTimeout(t);
    } else {
      setTyping(null);
    }
  }, [selectedId]);

  function handleSend(text: string) {
    if (!currentUser) return;
    setMessages((prev: Message[]) => [
      ...prev,
      {
        id: `m${Math.random()}`,
        senderId: currentUser.id,
        senderRole: currentUser.role as Role,
        text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        read: false,
      },
    ]);
  }

  return (
    <div className="flex flex-1 h-full min-h-0 bg-[#FDF6FA] text-foreground">
      {/* Sidebar */}
      <aside className="w-80 bg-[#FCE7F3] p-4 flex flex-col shadow-md">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full rounded-lg bg-[#FFF1F9] text-foreground px-3 py-2 border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedId(user.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm border border-pink-100 transition-all text-left ${
                selectedId === user.id
                  ? "bg-white ring-2 ring-pink-300"
                  : "bg-[#FFF1F9] hover:bg-pink-100"
              }`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-white shadow"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-semibold truncate text-pink-900">
                    {user.name}
                  </span>
                  {user.unread > 0 && (
                    <span className="ml-2 bg-pink-300 text-pink-900 text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                      {user.unread}
                    </span>
                  )}
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full mt-1 bg-pink-100 text-pink-600">
                  {getRoleMeta(user.role).label}
                </span>
              </div>
              <StatusDot status={user.status} />
            </button>
          ))}
        </div>
      </aside>
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full min-h-0 gap-6 p-8 bg-[#FDF6FA] rounded-2xl shadow-lg border border-pink-100">
        {/* Header */}
        {selectedUser && (
          <div className="rounded-2xl shadow bg-white px-8 py-5 flex items-center gap-4 border border-pink-100">
            <img
              src={selectedUser.avatar}
              alt={selectedUser.name}
              className="w-12 h-12 rounded-full border-2 border-white shadow"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-pink-900 truncate">
                  {selectedUser.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold ml-1 bg-pink-200 text-pink-800">
                  {getRoleMeta(selectedUser.role).label}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <StatusDot status={selectedUser.status} />
                <span className="text-xs text-pink-400">
                  {selectedUser.status === "online"
                    ? "Online"
                    : selectedUser.status === "idle"
                    ? "Idle"
                    : "Do Not Disturb"}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Message Area */}
        <div className="flex-1 overflow-y-auto rounded-2xl bg-[#FDF6FA] shadow-inner px-6 py-6 flex flex-col gap-6 border border-pink-100">
          {messages.map((msg, idx) => {
            const isOwn = msg.senderId === currentUser.id;
            const showAvatar =
              idx === 0 || messages[idx - 1].senderId !== msg.senderId;
            const sender =
              users.find((u) => u.id === msg.senderId) || currentUser;
            // Pastel bubble colors
            const bubbleBg = isOwn
              ? "bg-pink-200 text-pink-900"
              : sender.role === "executive"
              ? "bg-yellow-100 text-yellow-900 border border-yellow-200"
              : "bg-white text-pink-900 border border-pink-100";
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full",
                  isOwn ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "flex items-end gap-2",
                    isOwn ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {!isOwn && showAvatar && (
                    <img
                      src={sender.avatar}
                      alt={sender.name}
                      className="w-8 h-8 rounded-full border-2 border-white shadow"
                    />
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 shadow-sm max-w-xs md:max-w-md",
                      bubbleBg
                    )}
                  >
                    <span className="text-base break-words">{msg.text}</span>
                  </div>
                  {isOwn && (
                    <span className="text-xs text-pink-400 ml-2">
                      {msg.timestamp}
                    </span>
                  )}
                  {!isOwn && (
                    <span className="text-xs text-pink-400 mr-2">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {typing && <TypingIndicator user={typing} />}
        </div>
        {/* Message Input */}
        <div className="rounded-2xl shadow bg-white border border-pink-200 px-6 py-4 mt-2">
          <ChatInputBox onSend={handleSend} />
        </div>
      </main>
    </div>
  );
}
