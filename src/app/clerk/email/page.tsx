"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

// Mock email data
const emails = [
  {
    id: 1,
    from: "Sarah Johnson",
    fromEmail: "sarah.johnson@eislagger.com",
    subject: "Q4 Financial Report - Executive Summary",
    preview:
      "I've prepared the comprehensive Q4 financial report with key insights and recommendations for the upcoming quarter...",
    content:
      "Dear Clerk,\n\nI've prepared the comprehensive Q4 financial report with key insights and recommendations for the upcoming quarter. The report highlights our strong performance in the European market and identifies opportunities for expansion in Asia Pacific.\n\nKey highlights:\n 2 Revenue growth: 23% YoY\n 22 Market share increase: 5.2%\n 22 New store openings: 12 locations\n 22 Customer satisfaction: 4.8/5\n\nPlease review the attached documents and let me know if you need any clarification.\n\nBest regards,\nSarah Johnson\nCFO, Eislagger",
    timestamp: "2 hours ago",
    isRead: false,
    isStarred: true,
    priority: "high",
    category: "finance",
    attachments: ["Q4_Report.pdf", "Financial_Summary.xlsx"],
  },
  {
    id: 2,
    from: "Michael Chen",
    fromEmail: "michael.chen@eislagger.com",
    subject: "Manufacturing Efficiency Improvements",
    preview:
      "Our new automated production line has increased efficiency by 35% and reduced costs by 18%...",
    content:
      "Hello,\n\nI'm pleased to report that our new automated production line has exceeded expectations. We've achieved:\n\n 2 35% increase in production efficiency\n 2 18% reduction in operational costs\n 2 99.2% quality assurance rate\n 2 40% faster delivery times\n\nThe team has also identified additional optimization opportunities that could further improve our performance.\n\nRegards,\nMichael Chen\nHead of Manufacturing",
    timestamp: "4 hours ago",
    isRead: true,
    isStarred: false,
    priority: "medium",
    category: "operations",
    attachments: ["Production_Report.pdf"],
  },
  {
    id: 3,
    from: "Emma Rodriguez",
    fromEmail: "emma.rodriguez@eislagger.com",
    subject: "Customer Feedback Analysis - New Flavors",
    preview:
      "The customer feedback for our new seasonal flavors has been overwhelmingly positive...",
    content:
      "Hi there,\n\nThe customer feedback for our new seasonal flavors has been overwhelmingly positive! Here are the key findings:\n\nTop performing flavors:\n1. Mango Tango - 4.9/5 rating\n2. Chocolate Dream - 4.8/5 rating\n3. Vanilla Bean - 4.7/5 rating\n\nCustomer requests:\n 2 More vegan options\n 2 Sugar-free alternatives\n 2 Limited edition flavors\n\nWe're planning to expand the seasonal menu based on this feedback.\n\nBest,\nEmma Rodriguez\nMarketing Director",
    timestamp: "1 day ago",
    isRead: true,
    isStarred: true,
    priority: "medium",
    category: "marketing",
    attachments: ["Customer_Feedback.pdf", "Flavor_Analysis.xlsx"],
  },
  {
    id: 4,
    from: "David Thompson",
    fromEmail: "david.thompson@eislagger.com",
    subject: "IT Infrastructure Upgrade - Security Enhancement",
    preview:
      "We need to schedule the critical security updates for our systems...",
    content:
      "Dear Clerk,\n\nWe need to schedule critical security updates for our systems. The updates include:\n\n 2 Enhanced firewall protection\n 2 Two-factor authentication rollout\n 2 Data encryption improvements\n 2 Backup system upgrades\n\nEstimated downtime: 2 hours\nRecommended time: Sunday 2 AM - 4 AM\n\nPlease confirm if this schedule works for you.\n\nThanks,\nDavid Thompson\nIT Director",
    timestamp: "2 days ago",
    isRead: false,
    isStarred: false,
    priority: "high",
    category: "it",
    attachments: ["Security_Plan.pdf"],
  },
  {
    id: 5,
    from: "Lisa Wang",
    fromEmail: "lisa.wang@eislagger.com",
    subject: "HR Update - New Employee Benefits Package",
    preview:
      "I'm excited to announce our enhanced employee benefits package...",
    content:
      "Hello everyone,\n\nI'm excited to announce our enhanced employee benefits package! The new package includes:\n\n 2 Increased health insurance coverage\n 2 Flexible work arrangements\n 2 Professional development budget\n 2 Wellness program\n 2 Enhanced parental leave\n\nThis will help us attract and retain top talent.\n\nBest regards,\nLisa Wang\nHR Director",
    timestamp: "3 days ago",
    isRead: true,
    isStarred: false,
    priority: "low",
    category: "hr",
    attachments: ["Benefits_Package.pdf"],
  },
];

const categories = [
  { label: "All", value: "all", icon: "📧" },
  { label: "Finance", value: "finance", icon: "💰" },
  { label: "Operations", value: "operations", icon: "⚙️" },
  { label: "Marketing", value: "marketing", icon: "📢" },
  { label: "IT", value: "it", icon: "💻" },
  { label: "HR", value: "hr", icon: "👥" },
];

export default function ClerkEmailPage() {
  const [search] = useState("");
  const [selectedEmail, setSelectedEmail] = useState(emails[0]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(search.toLowerCase()) ||
      email.from.toLowerCase().includes(search.toLowerCase()) ||
      email.preview.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || email.category === selectedCategory;
    const matchesUnread = !showUnreadOnly || !email.isRead;
    return matchesSearch && matchesCategory && matchesUnread;
  });

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
      {/* Executive Glassy Gradient Background */}
      <div className="min-h-screen min-w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300/30 to-purple-300/30 dark:from-pink-300/20 dark:to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-pink-200/30 dark:from-blue-300/20 dark:to-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-300/10 dark:to-pink-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="relative flex h-screen gap-8 z-10">
          {/* Sidebar */}
          <div className="w-80 bg-white/80 dark:bg-slate-800/80 border-r border-pink-200/50 dark:border-slate-700/50 shadow-xl backdrop-blur-xl rounded-r-3xl flex flex-col">
            {/* Category Filters */}
            <div className="p-6 border-b border-pink-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                  Categories
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                  className="text-xs hover:bg-pink-100 dark:hover:bg-slate-700 rounded-lg"
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
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                        : "hover:bg-pink-100 dark:hover:bg-slate-700"
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
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 hover:bg-pink-50 dark:hover:bg-slate-700/50 ${
                    selectedEmail.id === email.id
                      ? "bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-200 dark:border-pink-700"
                      : ""
                  } ${
                    !email.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-sm">
                        {email.from
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-800 dark:text-white truncate">
                          {email.from}
                        </h3>
                        {getPriorityIcon(email.priority)}
                        {email.isStarred && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        {!email.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                        {email.subject}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-1">
                        {email.preview}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-500 dark:text-slate-500">
                          {email.timestamp}
                        </span>
                        <Badge
                          className={`text-xs ${getPriorityColor(
                            email.priority
                          )}`}
                        >
                          {email.priority}
                        </Badge>
                        {email.attachments.length > 0 && (
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
                <div className="rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-xl border border-pink-200/60 dark:border-pink-800/40 backdrop-blur-xl overflow-hidden animate-fade-in-scale">
                  {/* Email Header */}
                  <div className="p-8 border-b border-pink-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70 flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-lg">
                          {selectedEmail.from
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            {selectedEmail.from}
                          </h2>
                          {getPriorityIcon(selectedEmail.priority)}
                          {selectedEmail.isStarred && (
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedEmail.fromEmail}
                        </p>
                        <p className="text-lg font-semibold text-slate-800 dark:text-white mt-2">
                          {selectedEmail.subject}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-slate-500 dark:text-slate-500">
                            {selectedEmail.timestamp}
                          </span>
                          <Badge
                            className={`text-xs ${getPriorityColor(
                              selectedEmail.priority
                            )}`}
                          >
                            {selectedEmail.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-pink-100 dark:hover:bg-slate-700 rounded-xl"
                      >
                        <Reply className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-pink-100 dark:hover:bg-slate-700 rounded-xl"
                      >
                        <Forward className="w-5 h-5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-pink-100 dark:hover:bg-slate-700 rounded-xl"
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
                        <div className="mb-6 p-4 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl border border-pink-200/50 dark:border-slate-600/50">
                          <h3 className="text-sm font-medium text-slate-800 dark:text-white mb-3">
                            Attachments
                          </h3>
                          <div className="space-y-2">
                            {selectedEmail.attachments.map(
                              (attachment, index) => (
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
                                    className="hover:bg-pink-100 dark:hover:bg-slate-500"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed">
                          {selectedEmail.content}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Reply Section */}
                  <div className="p-6 border-t border-pink-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-700/70 backdrop-blur-xl rounded-b-2xl shadow">
                    <div className="flex items-end gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-pink-100 dark:hover:bg-slate-700 rounded-xl"
                      >
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <div className="flex-1">
                        <Input
                          placeholder="Type your reply..."
                          className="rounded-2xl py-3 bg-white/70 dark:bg-slate-700/70 border-pink-200 dark:border-slate-600 focus:ring-2 focus:ring-pink-500/50"
                        />
                      </div>
                      <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
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
