"use client";

import React, { useState } from "react";

import {
  Mail as MailIcon,
  Send,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  MoreVertical,
  Paperclip,
  Download,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEmails, useUnreadEmailCount, useMarkEmailAsRead, useStarEmail } from "@/hooks";
import { useAuth } from "@/lib/auth-context";

// Custom styles for animations
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  .animate-pulse-slow {
    animation: pulse 2s ease-in-out infinite;
  }
`;

// Mock email data for patrons
const emails = [
  {
    id: 1,
    from: "EisLagger Support",
    fromEmail: "support@eislagger.com",
    subject: "Welcome to EisLagger! Your Account is Ready",
    preview:
      "Thank you for joining EisLagger! We're excited to have you as part of our ice cream community...",
    content:
      "Dear Valued Customer,\n\nThank you for joining EisLagger! We're excited to have you as part of our ice cream community.\n\nYour account is now active and you can:\n• Browse our delicious ice cream flavors\n• Place orders for pickup or delivery\n• Track your order history\n• Earn loyalty points\n• Get exclusive offers and promotions\n\nVisit our stores or order online to get started!\n\nSweet regards,\nThe EisLagger Team",
    timestamp: "1 hour ago",
    isRead: false,
    isStarred: true,
    priority: "high",
    category: "welcome",
    attachments: ["Welcome_Guide.pdf", "Loyalty_Program.pdf"],
  },
  {
    id: 2,
    from: "Sarah Johnson",
    fromEmail: "sarah.johnson@eislagger.com",
    subject: "New Seasonal Flavors Available Now!",
    preview:
      "We're excited to announce our new seasonal collection featuring unique flavors...",
    content:
      "Hello Ice Cream Lover!\n\nWe're excited to announce our new seasonal collection featuring unique flavors inspired by autumn:\n\nNew Flavors:\n• Pumpkin Spice Delight\n• Apple Cinnamon Swirl\n• Maple Pecan Crunch\n• Caramel Apple Pie\n\nThese flavors are available for a limited time only. Visit your nearest EisLagger store or order online!\n\nBest,\nSarah Johnson\nProduct Development Manager",
    timestamp: "3 hours ago",
    isRead: true,
    isStarred: false,
    priority: "medium",
    category: "promotions",
    attachments: ["Seasonal_Menu.pdf"],
  },
  {
    id: 3,
    from: "EisLagger Rewards",
    fromEmail: "rewards@eislagger.com",
    subject: "You've Earned 50 Loyalty Points!",
    preview:
      "Congratulations! You've earned 50 loyalty points from your recent purchase...",
    content:
      "Congratulations!\n\nYou've earned 50 loyalty points from your recent purchase at EisLagger Downtown.\n\nYour current balance: 150 points\n\nRedeem your points for:\n• Free scoop (100 points)\n• 20% off your next order (200 points)\n• Free sundae (300 points)\n• Exclusive merchandise (500 points)\n\nKeep earning points with every purchase!\n\nHappy scooping,\nEisLagger Rewards Team",
    timestamp: "1 day ago",
    isRead: true,
    isStarred: true,
    priority: "low",
    category: "rewards",
    attachments: ["Rewards_Catalog.pdf"],
  },
  {
    id: 4,
    from: "Store Manager - Downtown",
    fromEmail: "downtown@eislagger.com",
    subject: "Store Hours Update - Holiday Schedule",
    preview:
      "Please note our updated store hours for the upcoming holiday season...",
    content:
      "Dear Valued Customers,\n\nPlease note our updated store hours for the upcoming holiday season:\n\nHoliday Hours:\n• Thanksgiving Day: Closed\n• Black Friday: 8 AM - 10 PM\n• Christmas Eve: 9 AM - 6 PM\n• Christmas Day: Closed\n• New Year's Eve: 9 AM - 8 PM\n• New Year's Day: 12 PM - 8 PM\n\nWe apologize for any inconvenience and wish you a wonderful holiday season!\n\nBest regards,\nMike Chen\nStore Manager, Downtown Location",
    timestamp: "2 days ago",
    isRead: false,
    isStarred: false,
    priority: "medium",
    category: "updates",
    attachments: ["Holiday_Schedule.pdf"],
  },
  {
    id: 5,
    from: "Customer Feedback Team",
    fromEmail: "feedback@eislagger.com",
    subject: "Thank You for Your Feedback!",
    preview:
      "We received your feedback about our Chocolate Dream flavor and truly appreciate it...",
    content:
      "Dear Customer,\n\nWe received your feedback about our Chocolate Dream flavor and truly appreciate you taking the time to share your thoughts with us.\n\nYour feedback helps us:\n• Improve our recipes\n• Develop new flavors\n• Enhance customer experience\n• Maintain quality standards\n\nWe've shared your comments with our product development team. Keep the feedback coming!\n\nThank you,\nCustomer Feedback Team\nEisLagger",
    timestamp: "3 days ago",
    isRead: true,
    isStarred: false,
    priority: "low",
    category: "feedback",
    attachments: [],
  },
];

const categories = [
  { label: "All", value: "all", icon: "📧" },
  { label: "Welcome", value: "welcome", icon: "🎉" },
  { label: "Promotions", value: "promotions", icon: "🎁" },
  { label: "Rewards", value: "rewards", icon: "⭐" },
  { label: "Updates", value: "updates", icon: "📢" },
  { label: "Feedback", value: "feedback", icon: "💬" },
];

export default function PatronEmailPage() {
  const [search] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const { user } = useAuth();

  // Fetch emails from backend
  const { data: emailsResponse, isLoading: emailsLoading, error: emailsError } = useEmails({
    page: 1,
    limit: 50,
    folder: selectedCategory === "all" ? undefined : selectedCategory,
    unreadOnly: showUnreadOnly,
    search: search || undefined,
  });
  
  const { unreadCount } = useUnreadEmailCount();
  const markEmailAsRead = useMarkEmailAsRead();
  const starEmail = useStarEmail();

  const emails = emailsResponse?.data || [];
  
  // Set first email as selected when data loads
  React.useEffect(() => {
    if (emails.length > 0 && !selectedEmail) {
      setSelectedEmail(emails[0]);
    }
  }, [emails, selectedEmail]);

  const filteredEmails = emails;

  // Show loading state
  if (emailsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading emails...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (emailsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Emails</h2>
          <p className="text-gray-600">{emailsError.message}</p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
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
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <Clock className="w-4 h-4 text-orange-500" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      {/* Patron Glassy Gradient Background */}
      <div className="min-h-screen min-w-full bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-orange-900/20 dark:via-pink-900/20 dark:to-rose-900/20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-300/30 to-pink-300/30 dark:from-orange-300/20 dark:to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-rose-300/30 to-orange-300/30 dark:from-rose-300/20 dark:to-orange-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-rose-300/20 dark:from-pink-300/10 dark:to-rose-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="relative flex h-screen gap-8 z-10">
          {/* Sidebar */}
          <div className="w-80 bg-white/80 dark:bg-slate-800/80 border-r border-orange-200/50 dark:border-slate-700/50 shadow-xl backdrop-blur-xl rounded-r-3xl flex flex-col">
            {/* Category Filters */}
            <div className="p-6 border-b border-orange-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                  Categories
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                  className="text-xs hover:bg-orange-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  {showUnreadOnly ? (
                    <EyeOff className="w-3 h-3 mr-1" />
                  ) : (
                    <Eye className="w-3 h-3 mr-1" />
                  )}
                  {showUnreadOnly ? "Show All" : "Unread Only"}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={
                      selectedCategory === category.value ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className={`justify-start text-xs rounded-xl transition-all duration-300 ${
                      selectedCategory === category.value
                        ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                        : "hover:bg-orange-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
            {/* Email List */}
            <div className="p-6 space-y-3 flex-1 overflow-y-auto">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 hover:bg-orange-50 dark:hover:bg-slate-700/50 ${
                    selectedEmail.id === email.id
                      ? "bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 border border-orange-200 dark:border-orange-700"
                      : ""
                  } ${
                    !email.unread ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-500 text-white text-sm">
                        {email.senderId
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-800 dark:text-white truncate">
                          {email.senderId}
                        </h3>
                        {getPriorityIcon(email.priority)}
                        {email.starred && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        {email.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                        {email.subject}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-1">
                        {email.content?.substring(0, 100) || 'No preview'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-500 dark:text-slate-500">
                          {email.createdAt || email.updatedAt || 'No date'}
                        </span>
                        <Badge
                          className={`text-xs ${getPriorityColor(
                            email.priority,
                          )}`}
                        >
                          {email.priority?.toUpperCase() || 'NORMAL'}
                        </Badge>
                        {email.attachments && email.attachments.length > 0 && (
                          <Paperclip className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1 flex flex-col p-8">
            <div className="w-full max-w-3xl">
              {selectedEmail ? (
                <div className="rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-xl border border-orange-200/60 dark:border-orange-800/40 backdrop-blur-xl overflow-hidden animate-fade-in-scale">
                  {/* Email Header */}
                  <div className="p-8 border-b border-orange-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70 flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-500 text-white text-lg">
                          {selectedEmail.senderId
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            {selectedEmail.from}
                          </h2>
                          {getPriorityIcon(selectedEmail.priority)}
                          {selectedEmail.starred && (
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedEmail.senderId}
                        </p>
                        <p className="text-lg font-semibold text-slate-800 dark:text-white mt-2">
                          {selectedEmail.subject}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-slate-500 dark:text-slate-500">
                          {selectedEmail.createdAt || selectedEmail.updatedAt || 'No date'}
                        </span>
                          <Badge
                            className={`text-xs ${getPriorityColor(
                              selectedEmail.priority,
                            )}`}
                          >
                            {selectedEmail.priority?.toUpperCase() || 'NORMAL'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-orange-100 dark:hover:bg-slate-700 rounded-xl"
                      >
                        <Reply className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-orange-100 dark:hover:bg-slate-700 rounded-xl"
                      >
                        <Forward className="w-5 h-5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-orange-100 dark:hover:bg-slate-700 rounded-xl"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="w-4 h-4 mr-2" />
                            Star
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {/* Email Body */}
                  <div className="flex-1 p-8 overflow-y-auto bg-white/60 dark:bg-slate-800/60">
                    <div className="max-w-2xl mx-auto">
                      {selectedEmail.attachments.length > 0 && (
                        <div className="mb-6 p-4 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl border border-orange-200/50 dark:border-slate-600/50">
                          <h3 className="text-sm font-medium text-slate-800 dark:text-white mb-3">
                            Attachments
                          </h3>
                          <div className="space-y-2">
                            {selectedEmail.attachments?.map(
                              (attachment: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-white dark:bg-slate-600 rounded-lg"
                                >
                                  <span className="text-sm text-slate-700 dark:text-slate-300">
                                    {attachment}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-orange-100 dark:hover:bg-slate-500"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed">
                          {selectedEmail.content || 'No content available'}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Reply Section */}
                  <div className="p-6 border-t border-orange-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-700/70 backdrop-blur-xl rounded-b-2xl shadow">
                    <div className="flex items-end gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-orange-100 dark:hover:bg-slate-700 rounded-xl"
                      >
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <div className="flex-1">
                        <Input
                          placeholder="Type your reply..."
                          className="rounded-2xl py-3 bg-white/70 dark:bg-slate-700/70 border-orange-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500/50"
                        />
                      </div>
                      <Button className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <MailIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                      Select an Email
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Choose an email from the list to view its content
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

