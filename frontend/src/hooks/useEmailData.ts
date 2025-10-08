import { useState, useMemo } from "react";

export interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
  category: string;
  attachments?: string[];
}

export interface UseEmailDataOptions {
  emails: Email[];
  initialCategory?: string;
  showUnreadOnly?: boolean;
}

export function useEmailData({
  emails,
  initialCategory = "all",
  showUnreadOnly = false,
}: UseEmailDataOptions) {
  const [search, setSearch] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(
    emails[0] || null,
  );
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showUnreadOnlyFilter, setShowUnreadOnlyFilter] =
    useState(showUnreadOnly);

  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      const matchesSearch =
        email.subject.toLowerCase().includes(search.toLowerCase()) ||
        email.from.toLowerCase().includes(search.toLowerCase()) ||
        email.preview.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || email.category === selectedCategory;

      const matchesUnread = !showUnreadOnlyFilter || !email.isRead;

      return matchesSearch && matchesCategory && matchesUnread;
    });
  }, [emails, search, selectedCategory, showUnreadOnlyFilter]);

  const unreadCount = useMemo(() => {
    return emails.filter((email) => !email.isRead).length;
  }, [emails]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: emails.length };

    emails.forEach((email) => {
      counts[email.category] = (counts[email.category] || 0) + 1;
    });

    return counts;
  }, [emails]);

  const markAsRead = (emailId: string) => {
    // This would typically update the email in the backend
    // For now, we'll just update the local state
    setSelectedEmail((prev) =>
      prev?.id === emailId ? { ...prev, isRead: true } : prev,
    );
  };

  const markAsUnread = (emailId: string) => {
    setSelectedEmail((prev) =>
      prev?.id === emailId ? { ...prev, isRead: false } : prev,
    );
  };

  const deleteEmail = (emailId: string) => {
    // This would typically delete the email from the backend
    // For now, we'll just remove it from the local state
    if (selectedEmail?.id === emailId) {
      const remainingEmails = emails.filter((email) => email.id !== emailId);
      setSelectedEmail(remainingEmails[0] || null);
    }
  };

  return {
    emails: filteredEmails,
    selectedEmail,
    setSelectedEmail,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    showUnreadOnlyFilter,
    setShowUnreadOnlyFilter,
    unreadCount,
    categoryCounts,
    markAsRead,
    markAsUnread,
    deleteEmail,
  };
}
