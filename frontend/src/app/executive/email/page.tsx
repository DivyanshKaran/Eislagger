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

// Mock email data for executives
const emails = [
  {
    id: 1,
    from: "Board of Directors",
    fromEmail: "board@eislagger.com",
    subject: "Q4 Board Meeting - Strategic Planning Session",
    preview:
      "Quarterly board meeting scheduled for December 15th to discuss strategic initiatives...",
    content:
      "Dear Executive Team,\n\nQuarterly board meeting scheduled for December 15th to discuss strategic initiatives for 2025.\n\nAgenda Items:\n• Financial performance review\n• Market expansion strategy\n• Technology investments\n• Sustainability initiatives\n• Leadership development programs\n\nKey Metrics to Present:\n• Revenue growth: 23% YoY\n• Market share: 15.2%\n• Customer satisfaction: 4.8/5\n• Employee retention: 94%\n• ESG score: 8.7/10\n\nPlease prepare comprehensive reports for each agenda item.\n\nBest regards,\nBoard of Directors\nEisLagger Corporation",
    timestamp: "1 hour ago",
    isRead: false,
    isStarred: true,
    priority: "high",
    category: "board",
    attachments: ["Board_Meeting_Agenda.pdf", "Q4_Financial_Report.xlsx", "Strategic_Plan_2025.pdf"],
  },
  {
    id: 2,
    from: "CFO Office",
    fromEmail: "cfo@eislagger.com",
    subject: "Monthly Financial Dashboard - November 2024",
    preview:
      "November financial performance exceeded expectations with strong growth across all segments...",
    content:
      "Dear Executive Team,\n\nNovember financial performance exceeded expectations with strong growth across all segments:\n\nFinancial Highlights:\n• Total Revenue: $2.8M (+18% MoM)\n• Gross Margin: 68.5% (+2.1% MoM)\n• Operating Expenses: $1.2M (-5% MoM)\n• Net Profit: $890K (+28% MoM)\n• Cash Flow: $1.1M positive\n\nSegment Performance:\n• Retail Sales: $1.9M (+22% MoM)\n• Online Orders: $650K (+15% MoM)\n• Corporate Accounts: $250K (+8% MoM)\n\nKey Drivers:\n• Holiday season boost\n• New product launches\n• Marketing campaign success\n• Operational efficiency improvements\n\nOutlook: December projections show continued strong performance.\n\nCFO Office\nEisLagger Corporation",
    timestamp: "3 hours ago",
    isRead: true,
    isStarred: false,
    priority: "high", 
    category: "finance",
    attachments: ["November_Dashboard.pdf", "Financial_Analysis.xlsx"],
  },
  {
    id: 3,
    from: "Legal Department",
    fromEmail: "legal@eislagger.com",
    subject: "Contract Review - New Distribution Partnership",
    preview:
      "Legal review completed for the proposed distribution partnership with Global Foods Inc...",
    content:
      "Dear Executive Team,\n\nLegal review completed for the proposed distribution partnership with Global Foods Inc.\n\nContract Summary:\n• Partnership duration: 3 years with 2-year extension option\n• Territory: North America (US, Canada, Mexico)\n• Revenue sharing: 60/40 split (EisLagger/Global Foods)\n• Minimum annual commitment: $5M\n• Exclusivity: Non-exclusive in specified territories\n\nKey Terms:\n• Intellectual property protection\n• Quality standards compliance\n• Marketing support requirements\n• Termination clauses\n• Dispute resolution procedures\n\nRecommendation: APPROVE with minor modifications\n\nNext Steps:\n• Finalize contract terms\n• Schedule signing ceremony\n• Prepare announcement materials\n\nLegal Department\nEisLagger Corporation",
    timestamp: "5 hours ago",
    isRead: true,
    isStarred: true,
    priority: "medium",
    category: "legal",
    attachments: ["Contract_Review.pdf", "Partnership_Agreement.docx", "Risk_Assessment.pdf"],
  },
  {
    id: 4,
    from: "HR Director",
    fromEmail: "hr@eislagger.com",
    subject: "Executive Compensation Review - 2025",
    preview:
      "Annual executive compensation review completed with recommendations for 2025...",
    content:
      "Dear Executive Team,\n\nAnnual executive compensation review completed with recommendations for 2025:\n\nCurrent Compensation Analysis:\n• Base salaries: Competitive with market median\n• Bonus structure: Performance-based with 20% increase potential\n• Equity grants: 15% of total compensation\n• Benefits package: Comprehensive health and retirement plans\n\n2025 Recommendations:\n• Base salary increase: 8% across all executive positions\n• Bonus target increase: 25% of base salary\n• Additional equity grants: $500K per executive\n• Enhanced benefits: Executive wellness program\n\nMarket Comparison:\n• EisLagger executives: 95th percentile\n• Industry average: 75th percentile\n• Peer companies: 90th percentile\n\nImplementation: Effective January 1, 2025\n\nHR Director\nEisLagger Corporation",
    timestamp: "1 day ago",
    isRead: false,
    isStarred: false,
    priority: "medium",
    category: "hr",
    attachments: ["Compensation_Review.pdf", "Market_Analysis.xlsx"],
  },
  {
    id: 5,
    from: "Strategic Planning",
    fromEmail: "strategy@eislagger.com",
    subject: "Market Expansion Analysis - European Markets",
    preview:
      "Comprehensive analysis of European market opportunities for EisLagger expansion...",
    content:
      "Dear Executive Team,\n\nComprehensive analysis of European market opportunities for EisLagger expansion:\n\nTarget Markets:\n• Germany: Large ice cream market, health-conscious consumers\n• France: Premium segment opportunity, artisanal positioning\n• UK: Established market, convenience store partnerships\n• Netherlands: High per-capita consumption, sustainability focus\n\nMarket Analysis:\n• Total addressable market: $12.5B\n• Serviceable market: $3.2B\n• Competitive landscape: Moderate competition\n• Regulatory environment: Favorable\n\nInvestment Requirements:\n• Initial investment: $15M over 3 years\n• Break-even timeline: 24 months\n• Expected ROI: 35% by year 5\n• Risk assessment: Medium\n\nRecommendation: Proceed with pilot program in Germany\n\nStrategic Planning Team\nEisLagger Corporation",
    timestamp: "2 days ago",
    isRead: true,
    isStarred: false,
    priority: "low",
    category: "strategy",
    attachments: ["European_Market_Analysis.pdf", "Expansion_Plan.xlsx", "Financial_Projections.pdf"],
  },
];

const categories = [
  { label: "All", value: "all", icon: "📧" },
  { label: "Board", value: "board", icon: "👔" },
  { label: "Finance", value: "finance", icon: "💰" },
  { label: "Legal", value: "legal", icon: "⚖️" },
  { label: "HR", value: "hr", icon: "👥" },
  { label: "Strategy", value: "strategy", icon: "🎯" },
];

export default function ExecutiveEmailPage() {
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
      <div className="min-h-screen min-w-full bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/20 relative overflow-hidden">
        {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-300/30 to-violet-300/30 dark:from-purple-300/20 dark:to-violet-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-300/30 to-purple-200/30 dark:from-indigo-300/20 dark:to-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-violet-200/20 to-purple-200/20 dark:from-violet-300/10 dark:to-purple-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
        <div className="relative flex h-screen gap-8 z-10">
          {/* Sidebar */}
          <div className="w-80 bg-white/80 dark:bg-slate-800/80 border-r border-purple-200/50 dark:border-slate-700/50 shadow-xl backdrop-blur-xl rounded-r-3xl flex flex-col">
            {/* Category Filters */}
            <div className="p-6 border-b border-purple-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                  Categories
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                  className="text-xs hover:bg-purple-100 dark:hover:bg-slate-700 rounded-lg"
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
                        ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg"
                        : "hover:bg-purple-100 dark:hover:bg-slate-700"
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
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 hover:bg-purple-50 dark:hover:bg-slate-700/50 ${
                    selectedEmail.id === email.id
                      ? "bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200 dark:border-purple-700"
                      : ""
                  } ${
                    !email.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-violet-500 text-white text-sm">
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
                            email.priority,
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
                <div className="rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-xl border border-purple-200/60 dark:border-purple-800/40 backdrop-blur-xl overflow-hidden animate-fade-in-scale">
                  {/* Email Header */}
                  <div className="p-8 border-b border-purple-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70 flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-violet-500 text-white text-lg">
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
                              selectedEmail.priority,
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
                        className="hover:bg-purple-100 dark:hover:bg-slate-700 rounded-xl"
                      >
                        <Reply className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-purple-100 dark:hover:bg-slate-700 rounded-xl"
                      >
                        <Forward className="w-5 h-5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-purple-100 dark:hover:bg-slate-700 rounded-xl"
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
                        <div className="mb-6 p-4 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl border border-purple-200/50 dark:border-slate-600/50">
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
                                    className="hover:bg-purple-100 dark:hover:bg-slate-500"
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
                          {selectedEmail.content}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Reply Section */}
                  <div className="p-6 border-t border-purple-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-700/70 backdrop-blur-xl rounded-b-2xl shadow">
                    <div className="flex items-end gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-purple-100 dark:hover:bg-slate-700 rounded-xl"
                      >
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <div className="flex-1">
                        <Input
                          placeholder="Type your reply..."
                          className="rounded-2xl py-3 bg-white/70 dark:bg-slate-700/70 border-purple-200 dark:border-slate-600 focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                      <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
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