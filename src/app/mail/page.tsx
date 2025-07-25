"use client";
import React, { useState } from "react";
import {
  FaInbox,
  FaPen,
  FaFolderOpen,
  FaArchive,
  FaExclamationTriangle,
  FaStar,
  FaPaperclip,
  FaReply,
  FaReplyAll,
  FaShare,
  FaBars,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

// --- Types ---
interface Folder {
  key: string;
  name: string;
  icon: JSX.Element;
  color: string;
}

interface User {
  name: string;
  role: string;
  avatar: string;
}

interface Email {
  id: string;
  folder: string;
  subject: string;
  senderId: string;
  tags: string[];
  unread: boolean;
  starred: boolean;
  important: boolean;
  date: string;
  preview: string;
  status: string;
  attachments: string[];
  body: string;
}

// --- Mock Data ---
const folders: Folder[] = [
  {
    key: "inbox",
    name: "Inbox",
    icon: <FaInbox />,
    color: "bg-pink-200 text-pink-700",
  },
  {
    key: "sent",
    name: "Sent",
    icon: <FaPen />,
    color: "bg-yellow-200 text-yellow-700",
  },
  {
    key: "drafts",
    name: "Drafts",
    icon: <FaFolderOpen />,
    color: "bg-mint-200 text-green-700",
  },
  {
    key: "archived",
    name: "Archived",
    icon: <FaArchive />,
    color: "bg-gray-200 text-gray-700",
  },
  {
    key: "important",
    name: "Important",
    icon: <FaExclamationTriangle />,
    color: "bg-yellow-100 text-yellow-700",
  },
];

const users: Record<string, User> = {
  "1": { name: "Ava CEO", role: "executive", avatar: "/window.svg" },
  "2": { name: "Mint Factory", role: "manufacturer", avatar: "/globe.svg" },
  "3": { name: "Store #12 Clerk", role: "clerk", avatar: "/next.svg" },
  "4": { name: "Divyansh", role: "patron", avatar: "/vercel.svg" },
};

const roleMeta: Record<string, { color: string; label: string }> = {
  executive: { color: "bg-yellow-200 text-yellow-800", label: "EXECUTIVE" },
  manufacturer: { color: "bg-mint-200 text-green-800", label: "FACTORY OWNER" },
  clerk: { color: "bg-orange-100 text-orange-800", label: "STORE CLERK" },
  patron: { color: "bg-pink-100 text-pink-800", label: "CUSTOMER" },
};

const emailsMock: Email[] = [
  {
    id: "e1",
    folder: "inbox",
    subject: "Approval: New Store Launch – Pune",
    senderId: "1",
    tags: ["APPROVAL"],
    unread: true,
    starred: true,
    important: true,
    date: "2024-06-10 09:01",
    preview: "Please find budget details attached. Approve if acceptable.",
    status: "pending",
    attachments: ["budget.pdf"],
    body: "Please find budget details attached. Approve if acceptable.<br/><br/>Regards,<br/>Ava CEO",
  },
  {
    id: "e2",
    folder: "inbox",
    subject: "Stock Registered – Vanilla Bean",
    senderId: "2",
    tags: ["INVOICE"],
    unread: false,
    starred: false,
    important: false,
    date: "2024-06-09 15:22",
    preview: "100L ready. Expected delivery window: July 4–6.",
    status: "approved",
    attachments: ["invoice.pdf"],
    body: "100L ready. Expected delivery window: July 4–6.<br/><br/>Regards,<br/>Mint Factory",
  },
  {
    id: "e3",
    folder: "important",
    subject: "Stock Expiry Alert – Mango Swirl",
    senderId: "3",
    tags: ["ALERT"],
    unread: true,
    starred: true,
    important: true,
    date: "2024-06-08 11:00",
    preview:
      "Batch #A123 will expire in 3 days. Please replace or clear stock.",
    status: "rejected",
    attachments: [],
    body: "Batch #A123 will expire in 3 days. Please replace or clear stock.<br/><br/>Regards,<br/>Store #12 Clerk",
  },
];

// --- Components ---
function MailTagChip({ tag }: { tag: string }) {
  return (
    <span
      className={cn(
        "text-xs px-2 py-0.5 rounded-full font-semibold mr-1 bg-blue-100 text-blue-900 border border-blue-200"
      )}
    >
      {tag}
    </span>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-peach-100 text-peach-900 border border-peach-200",
    pending: "bg-blue-100 text-blue-900 border border-blue-200",
    rejected: "bg-pink-100 text-pink-900 border border-pink-200",
  };
  return status ? (
    <span
      className={cn(
        "text-xs px-2 py-0.5 rounded-full font-semibold ml-2",
        map[status]
      )}
    >
      {status?.toUpperCase()}
    </span>
  ) : null;
}

function EmailReaderPanel({ email }: { email: Email | null }) {
  if (!email)
    return (
      <div className="flex-1 flex items-center justify-center text-pink-400">
        Select an email to read
      </div>
    );
  const sender = users[email.senderId];
  const meta = {
    color: "bg-blue-100 text-blue-900 border border-blue-200",
    label: roleMeta[sender.role].label,
  };
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-4 pb-4 border-b border-pink-100">
        <img
          src={sender.avatar}
          alt={sender.name}
          className="w-10 h-10 rounded-full border-2 border-white shadow"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-blue-900 truncate">
              {email.subject}
            </span>
            {email.tags.map((tag) => (
              <MailTagChip key={tag} tag={tag} />
            ))}
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full ml-1",
                meta.color
              )}
            >
              {meta.label}
            </span>
            <StatusChip status={email.status} />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-pink-400">From: {sender.name}</span>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full ml-1",
                meta.color
              )}
            >
              {meta.label}
            </span>
            <span className="text-xs text-pink-400">{email.date}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div
          className="prose max-w-none text-blue-900"
          dangerouslySetInnerHTML={{ __html: email.body }}
        />
        {email.attachments.length > 0 && (
          <div className="mt-4">
            <div className="font-semibold text-sm text-pink-400 mb-1">
              Attachments:
            </div>
            <div className="flex gap-2 flex-wrap">
              {email.attachments.map((file) => (
                <a
                  key={file}
                  href="#"
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-900 rounded shadow text-xs hover:underline border border-blue-200"
                >
                  <FaPaperclip /> {file}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 pt-4 border-t border-pink-100">
        <button className="flex items-center gap-1 px-3 py-1 rounded bg-peach-100 text-peach-900 font-semibold hover:bg-peach-200 border border-peach-200 shadow">
          <FaReply /> Reply
        </button>
        <button className="flex items-center gap-1 px-3 py-1 rounded bg-blue-100 text-blue-900 font-semibold hover:bg-blue-200 border border-blue-200 shadow">
          <FaReplyAll /> Reply All
        </button>
        <button className="flex items-center gap-1 px-3 py-1 rounded bg-blue-100 text-blue-900 font-semibold hover:bg-blue-200 border border-blue-200 shadow">
          <FaShare /> Forward
        </button>
      </div>
      <div className="px-2 py-2 text-xs text-pink-400 border-t border-pink-100">
        Regards,{" "}
        <span className="font-semibold text-blue-900">
          {meta.label} – {sender.name}
        </span>
      </div>
    </div>
  );
}

function ComposeMailModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-pink-400"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4 text-pink-700">Compose Email</h2>
        <form className="flex flex-col gap-3">
          <input
            className="rounded bg-pink-50 px-3 py-2"
            placeholder="To: (select user)"
          />
          <input
            className="rounded bg-pink-50 px-3 py-2"
            placeholder="Subject"
          />
          <textarea
            className="rounded bg-pink-50 px-3 py-2 min-h-[80px]"
            placeholder="Message body..."
          />
          <div className="flex items-center gap-2">
            <button type="button" className="text-pink-400 hover:text-pink-600">
              <FaPaperclip />
            </button>
            <select className="rounded bg-pink-50 px-2 py-1 text-xs">
              <option>Normal</option>
              <option>Important</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-2 bg-pink-400 hover:bg-pink-500 text-white rounded-lg px-4 py-2 font-bold"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Main Component ---
export function Mail() {
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(
    emailsMock[0]
  );
  const [composeOpen, setComposeOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const filteredEmails = emailsMock.filter(
    (e) =>
      e.folder === selectedFolder ||
      (selectedFolder === "important" && e.important)
  );
  return (
    <div className="flex h-screen min-h-0 bg-[#FDF6FA] dark:bg-[#1a151b] text-foreground overflow-hidden relative">
      {/* Main Mail View */}
      <main className="flex-1 flex flex-row items-stretch bg-[#FDF6FA] dark:bg-[#1a151b] gap-8 p-0 min-h-0 h-full overflow-hidden">
        {/* Email List */}
        <section className="w-full md:w-80 bg-[#FCE7F3] dark:bg-[#2a202b] border-r border-pink-100 dark:border-zinc-800 flex-shrink-0 min-h-0 h-full flex flex-col overflow-hidden rounded-2xl shadow-lg border border-pink-100 dark:border-zinc-800">
          {/* Burger Button at the top of mail list */}
          <div className="flex items-center justify-between p-4 border-b border-pink-100 dark:border-zinc-800">
            <button
              className="bg-white dark:bg-zinc-900 border border-pink-200 dark:border-zinc-700 rounded-lg p-2 shadow-lg"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <FaBars className="w-6 h-6 text-pink-400 dark:text-pink-300" />
            </button>
            <span className="font-bold text-pink-400 dark:text-pink-200 text-lg">
              Mail
            </span>
          </div>
          <div className="p-4 flex flex-col gap-6">
            {filteredEmails.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground dark:text-zinc-400">
                No emails in this folder
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                const isUnread = email.unread;
                return (
                  <button
                    key={email.id}
                    className={cn(
                      "w-full flex flex-row items-center rounded-2xl shadow group border transition-all text-left h-28 min-h-[7rem] max-h-28 px-4 py-3 relative bg-white dark:bg-zinc-900",
                      isSelected
                        ? "border-blue-400 ring-2 ring-blue-300 dark:ring-blue-800 bg-blue-50 dark:bg-zinc-800"
                        : isUnread
                        ? "border-pink-300 dark:border-pink-800"
                        : "border-pink-100 dark:border-zinc-800 hover:bg-pink-50 dark:hover:bg-zinc-800",
                      "focus:outline-none"
                    )}
                    onClick={() => setSelectedEmail(email)}
                  >
                    {/* Colored left accent for unread/selected */}
                    <span
                      className={cn(
                        "absolute left-0 top-2 bottom-2 w-1 rounded-full",
                        isSelected
                          ? "bg-blue-400"
                          : isUnread
                          ? "bg-pink-300"
                          : "bg-transparent"
                      )}
                    />
                    {/* Avatar */}
                    <img
                      src={users[email.senderId].avatar}
                      alt={users[email.senderId].name}
                      className="w-12 h-12 rounded-full border border-pink-100 dark:border-zinc-700 flex-shrink-0 mr-3"
                    />
                    {/* Main info column */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={cn(
                            "truncate text-base font-semibold flex-1",
                            isUnread
                              ? "text-blue-900 dark:text-blue-200"
                              : "text-zinc-700 dark:text-zinc-100"
                          )}
                        >
                          {email.subject}
                        </span>
                        {email.starred && (
                          <FaStar className="text-yellow-400 ml-1" />
                        )}
                        {email.important && (
                          <FaExclamationTriangle className="text-pink-400 ml-1" />
                        )}
                        {email.attachments.length > 0 && (
                          <FaPaperclip className="text-blue-300 ml-1" />
                        )}
                      </div>
                      <span className="truncate text-pink-400 dark:text-pink-200 text-xs font-medium">
                        {users[email.senderId].name}
                      </span>
                      <span className="truncate text-xs text-gray-400 dark:text-zinc-400">
                        {email.preview}
                      </span>
                    </div>
                    {/* Right info column */}
                    <div className="flex flex-col items-end justify-between h-full ml-3 gap-2 min-w-[70px]">
                      <span className="text-xs text-pink-300 dark:text-pink-400">
                        {email.date.slice(0, 10)}
                      </span>
                      {email.status && (
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-semibold border mt-1",
                            email.status === "pending"
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                              : email.status === "approved"
                              ? "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-200 border-green-200 dark:border-green-800"
                              : email.status === "rejected"
                              ? "bg-pink-100 dark:bg-pink-900 text-pink-900 dark:text-pink-200 border-pink-200 dark:border-pink-800"
                              : "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-200 border-gray-200 dark:border-zinc-700"
                          )}
                        >
                          {email.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>
        {/* Sidebar Modal (only visible when sidebarOpen) - now visually anchored to mail list area */}
        {sidebarOpen && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <aside
              className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xs bg-[#FCE7F3] p-6 flex flex-col shadow-2xl rounded-2xl h-auto min-h-[400px] border border-pink-200 items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button inside modal, top right */}
              <button
                className="absolute top-4 right-4 bg-white border border-pink-200 rounded-lg p-2 shadow-lg z-50"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                ✕
              </button>
              <div className="mb-4 mt-4 w-full">
                <input
                  type="text"
                  placeholder="Search folders..."
                  className="w-full rounded-lg bg-[#FFF1F9] text-foreground px-3 py-2 border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              <nav className="flex flex-col gap-2 mb-4 w-full">
                {folders.map((f) => (
                  <button
                    key={f.key}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm border border-pink-100 transition-all text-left font-medium ${
                      selectedFolder === f.key
                        ? "bg-white ring-2 ring-pink-300"
                        : "bg-[#FFF1F9] hover:bg-pink-100"
                    }`}
                    onClick={() => {
                      setSelectedFolder(f.key);
                      setSidebarOpen(false);
                    }}
                  >
                    <span className="text-lg">{f.icon}</span>
                    <span>{f.name}</span>
                  </button>
                ))}
              </nav>
              <button
                onClick={() => setComposeOpen(true)}
                className="mt-auto bg-peach-100 hover:bg-peach-200 text-peach-900 rounded-lg px-4 py-2 font-bold shadow flex items-center gap-2 border border-peach-200 w-full"
              >
                <FaPen /> Compose
              </button>
            </aside>
          </div>
        )}
        {/* Reader Panel */}
        <section className="flex-1 min-w-0 w-full hidden md:block bg-white dark:bg-zinc-900 border border-pink-100 dark:border-zinc-800 rounded-2xl shadow-lg p-8 flex flex-col gap-6 h-full min-h-0">
          <EmailReaderPanel email={selectedEmail} />
        </section>
      </main>
      {/* Mobile Reader Panel */}
      <section
        className={cn(
          "fixed inset-0 bg-[#FDF6FA] z-40 transition-transform duration-300 md:hidden",
          selectedEmail ? "translate-x-0" : "translate-x-full"
        )}
      >
        <EmailReaderPanel email={selectedEmail} />
      </section>
      {/* Floating Compose Button (Mobile) */}
      <button
        onClick={() => setComposeOpen(true)}
        className="md:hidden fixed bottom-6 right-6 bg-peach-100 hover:bg-peach-200 text-peach-900 rounded-full p-4 shadow-lg z-50 border border-peach-200"
      >
        <FaPen size={24} />
      </button>
      {/* Compose Modal */}
      <ComposeMailModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
      />
    </div>
  );
}
