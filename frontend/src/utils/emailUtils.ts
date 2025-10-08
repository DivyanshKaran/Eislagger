import React from "react";

import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

import type { Email } from "@/types";

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-100 dark:bg-red-900/20";
    case "medium":
      return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
    case "low":
      return "text-green-600 bg-green-100 dark:bg-green-900/20";
    default:
      return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
  }
}

export function getPriorityIcon(priority: string): React.ReactNode {
  switch (priority) {
    case "high":
      return React.createElement(AlertCircle, {
        className: "w-4 h-4 text-red-500",
      });
    case "medium":
      return React.createElement(Clock, {
        className: "w-4 h-4 text-orange-500",
      });
    case "low":
      return React.createElement(CheckCircle, {
        className: "w-4 h-4 text-green-500",
      });
    default:
      return React.createElement(XCircle, {
        className: "w-4 h-4 text-gray-500",
      });
  }
}

export function formatEmailDate(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInHours < 168) {
    // 7 days
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export function getEmailPreview(
  content: string,
  maxLength: number = 100,
): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength) + "...";
}

export function isEmailUnread(email: Email): boolean {
  return email.unread || false;
}

export function isEmailStarred(email: Email): boolean {
  return email.starred || false;
}

export function isEmailImportant(email: Email): boolean {
  return email.important || false;
}

export function getEmailFolder(email: Email): string {
  return email.folder || "inbox";
}

export function getEmailTags(email: Email): string[] {
  return email.tags || [];
}

export function hasEmailAttachments(email: Email): boolean {
  return Boolean(email.attachments && email.attachments.length > 0);
}

export function getEmailAttachmentCount(email: Email): number {
  return email.attachments ? email.attachments.length : 0;
}

export function getEmailSenderName(
  email: Email,
  users: Record<string, { name: string }>,
): string {
  return users[email.senderId]?.name || "Unknown Sender";
}

export function getEmailSenderAvatar(
  email: Email,
  users: Record<string, { avatar: string }>,
): string {
  return users[email.senderId]?.avatar || "/default-avatar.png";
}

export function getEmailStatus(email: Email): string {
  if (email.unread) return "unread";
  if (email.starred) return "starred";
  if (email.important) return "important";
  return "read";
}

export function getEmailPriority(email: Email): string {
  return email.priority || "medium";
}

export function getEmailCategory(email: Email): string {
  return email.folder || "inbox";
}

export function isEmailFromToday(email: Email): boolean {
  const emailDate = new Date(email.createdAt);
  const today = new Date();
  return emailDate.toDateString() === today.toDateString();
}

export function isEmailFromThisWeek(email: Email): boolean {
  const emailDate = new Date(email.createdAt);
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return emailDate >= weekAgo;
}

export function isEmailFromThisMonth(email: Email): boolean {
  const emailDate = new Date(email.createdAt);
  const today = new Date();
  return (
    emailDate.getMonth() === today.getMonth() &&
    emailDate.getFullYear() === today.getFullYear()
  );
}

export function getEmailTimeAgo(email: Email): string {
  return formatEmailDate(email.createdAt);
}

export function getEmailDisplayDate(email: Email): string {
  const date = new Date(email.createdAt);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffInHours < 168) {
    // 7 days
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}

export function getEmailSearchableText(email: Email): string {
  return `${email.subject} ${email.content} ${email.tags.join(" ")}`.toLowerCase();
}

export function filterEmailsBySearch(
  emails: Email[],
  searchQuery: string,
): Email[] {
  if (!searchQuery.trim()) return emails;

  const query = searchQuery.toLowerCase();
  return emails.filter((email) =>
    getEmailSearchableText(email).includes(query),
  );
}

export function filterEmailsByFolder(emails: Email[], folder: string): Email[] {
  if (folder === "all") return emails;
  return emails.filter((email) => getEmailFolder(email) === folder);
}

export function filterEmailsByStatus(emails: Email[], status: string): Email[] {
  switch (status) {
    case "unread":
      return emails.filter(isEmailUnread);
    case "starred":
      return emails.filter(isEmailStarred);
    case "important":
      return emails.filter(isEmailImportant);
    default:
      return emails;
  }
}

export function sortEmailsByDate(
  emails: Email[],
  order: "asc" | "desc" = "desc",
): Email[] {
  return [...emails].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
}

export function sortEmailsByPriority(
  emails: Email[],
  order: "asc" | "desc" = "desc",
): Email[] {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return [...emails].sort((a, b) => {
    const priorityA =
      priorityOrder[getEmailPriority(a) as keyof typeof priorityOrder] || 0;
    const priorityB =
      priorityOrder[getEmailPriority(b) as keyof typeof priorityOrder] || 0;
    return order === "asc" ? priorityA - priorityB : priorityB - priorityA;
  });
}

export function getUnreadEmailCount(emails: Email[]): number {
  return emails.filter(isEmailUnread).length;
}

export function getStarredEmailCount(emails: Email[]): number {
  return emails.filter(isEmailStarred).length;
}

export function getImportantEmailCount(emails: Email[]): number {
  return emails.filter(isEmailImportant).length;
}

export function getEmailStats(emails: Email[]) {
  return {
    total: emails.length,
    unread: getUnreadEmailCount(emails),
    starred: getStarredEmailCount(emails),
    important: getImportantEmailCount(emails),
    byFolder: emails.reduce(
      (acc, email) => {
        const folder = getEmailFolder(email);
        acc[folder] = (acc[folder] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  };
}
