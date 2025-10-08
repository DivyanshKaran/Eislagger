"use client";

import { useState } from "react";

import {
  Search,
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
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

// Mock email data for manufacturer
const emails = [
  {
    id: 1,
    from: "Sarah Johnson",
    fromEmail: "sarah.johnson@dairyco.com",
    subject: "Vanilla Base Supply Update - Q4 Order",
    preview:
      "We have successfully processed your order for 2,500L of vanilla base. The shipment will be delivered on Monday...",
    content:
      "Dear Manufacturing Team,\n\nWe have successfully processed your order for 2,500L of vanilla base. The shipment will be delivered on Monday as scheduled.\n\nOrder Details:\n• Product: Premium Vanilla Base\n• Quantity: 2,500L\n• Delivery Date: Monday, 9 AM\n• Quality Certificate: Attached\n\nPlease confirm receipt and quality inspection results within 24 hours of delivery.\n\nBest regards,\nSarah Johnson\nSupply Chain Manager\nDairyCo Ltd",
    timestamp: "2 hours ago",
    isRead: false,
    isStarred: true,
    priority: "high",
    category: "supplier",
    attachments: ["Quality_Certificate.pdf", "Delivery_Note.pdf"],
  },
  {
    id: 2,
    from: "Michael Chen",
    fromEmail: "michael.chen@eislager.com",
    subject: "Production Line Efficiency Report",
    preview:
      "Our new automated production line has increased efficiency by 35% and reduced costs by 18%...",
    content:
      "Hello Manufacturing Team,\n\nI'm pleased to report that our new automated production line has exceeded expectations. We've achieved:\n\n• 35% increase in production efficiency\n• 18% reduction in operational costs\n• 99.2% quality assurance rate\n• 40% faster delivery times\n\nThe team has also identified additional optimization opportunities that could further improve our performance.\n\nRegards,\nMichael Chen\nProduction Manager",
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
    fromEmail: "emma.rodriguez@eislager.com",
    subject: "Quality Control Standards Update",
    preview: "Updated quality control protocols for all ice cream products...",
    content:
      "Hi Manufacturing Team,\n\nI'm sharing the updated quality control protocols for all ice cream products. Key changes include:\n\nNew standards:\n• Temperature monitoring: ±0.5°C tolerance\n• pH testing: Every batch\n• Microbial testing: Enhanced frequency\n• Packaging integrity: 100% inspection\n\nPlease review and implement these changes by next week.\n\nBest,\nEmma Rodriguez\nQuality Control Manager",
    timestamp: "1 day ago",
    isRead: true,
    isStarred: true,
    priority: "medium",
    category: "quality",
    attachments: ["Quality_Protocols.pdf", "Testing_Procedures.xlsx"],
  },
  {
    id: 4,
    from: "David Thompson",
    fromEmail: "david.thompson@eislager.com",
    subject: "Equipment Maintenance Schedule",
    preview: "Scheduled maintenance for production line B is due next week...",
    content:
      "Dear Manufacturing Team,\n\nScheduled maintenance for production line B is due next week. The maintenance includes:\n\n• Equipment calibration\n• Safety system checks\n• Performance optimization\n• Parts replacement\n\nEstimated downtime: 8 hours\nRecommended time: Sunday 6 AM - 2 PM\n\nPlease coordinate with the maintenance team.\n\nThanks,\nDavid Thompson\nMaintenance Supervisor",
    timestamp: "2 days ago",
    isRead: false,
    isStarred: false,
    priority: "high",
    category: "maintenance",
    attachments: ["Maintenance_Plan.pdf"],
  },
  {
    id: 5,
    from: "Lisa Wang",
    fromEmail: "lisa.wang@eislager.com",
    subject: "Inventory Management Update",
    preview:
      "Stock levels updated for all products. New ordering system implemented...",
    content:
      "Hello Manufacturing Team,\n\nI'm sharing the latest inventory management updates:\n\nCurrent stock levels:\n• Vanilla Base: 1,200L (Optimal)\n• Chocolate Mix: 800L (Low - Order needed)\n• Strawberry: 600L (Low - Order needed)\n• Mint Extract: 400L (Critical - Order immediately)\n\nNew ordering system implemented for better tracking.\n\nBest regards,\nLisa Wang\nInventory Manager",
    timestamp: "3 days ago",
    isRead: true,
    isStarred: false,
    priority: "low",
    category: "inventory",
    attachments: ["Inventory_Report.pdf"],
  },
];

export default function ManufacturerEmailPage() {
  const [search, setSearch] = useState("");
  const [selectedEmail, setSelectedEmail] = useState(emails[0]);

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(search.toLowerCase()) ||
      email.from.toLowerCase().includes(search.toLowerCase()) ||
      email.preview.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      case "medium":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
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
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="flex flex-col h-screen">
        {/* Main Email Interface (no navigation bar) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Mail List Sidebar */}
          <div className="w-96 bg-white/80 dark:bg-slate-800/80 border-r border-blue-200/50 dark:border-slate-700/50 backdrop-blur-sm overflow-y-auto min-w-[24rem] max-w-[24rem]">
            <div className="p-4 border-b border-blue-200/50 dark:border-slate-700/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                Mail
              </h2>
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search emails, contacts, subjects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-2xl pl-12 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 shadow-lg border-0 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-2">
                {filteredEmails.map((email) => (
                  <button
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-200 border border-transparent text-left hover:bg-blue-50 dark:hover:bg-slate-700/50 focus:outline-none ${
                      selectedEmail.id === email.id
                        ? "bg-gradient-to-r from-blue-100 to-sky-100 dark:from-blue-900/20 dark:to-sky-900/20 border-blue-300 dark:border-blue-700"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col items-center mt-1">
                      {email.isStarred && (
                        <Star className="w-4 h-4 text-yellow-400 mb-1" />
                      )}
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-sky-600 text-white">
                          {email.from[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold truncate ${
                            email.isRead
                              ? "text-slate-700 dark:text-slate-300"
                              : "text-blue-700 dark:text-blue-300"
                          }`}
                        >
                          {email.from}
                        </span>
                        <Badge
                          className={`ml-2 text-xs ${getPriorityColor(
                            email.priority,
                          )}`}
                        >
                          {getPriorityIcon(email.priority)} {email.priority}
                        </Badge>
                        {!email.isRead && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block" />
                        )}
                      </div>
                      <div className="truncate text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {email.subject}
                      </div>
                      <div className="truncate text-xs text-slate-400 dark:text-slate-500">
                        {email.preview}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 min-w-fit">
                      <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {email.timestamp}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Email Content Panel (unchanged) */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Email Content */}
            {selectedEmail && (
              <div className="border-t border-blue-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-sky-500 text-white text-lg">
                          {selectedEmail.from.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                          {selectedEmail.from}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedEmail.fromEmail}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-100 dark:hover:bg-slate-700 rounded-xl"
                      >
                        <Reply className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-100 dark:hover:bg-slate-700 rounded-xl"
                      >
                        <Forward className="w-5 h-5" />
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

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                      {selectedEmail.subject}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span>{selectedEmail.timestamp}</span>
                      <span>•</span>
                      <Badge
                        className={`text-xs ${getPriorityColor(
                          selectedEmail.priority,
                        )}`}
                      >
                        {getPriorityIcon(selectedEmail.priority)}
                        <span className="ml-1">{selectedEmail.priority}</span>
                      </Badge>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 mb-6">
                    <p className="whitespace-pre-line">
                      {selectedEmail.content}
                    </p>
                  </div>

                  {selectedEmail.attachments.length > 0 && (
                    <div className="border-t border-blue-200/50 dark:border-slate-700/50 pt-4">
                      <h4 className="font-medium text-slate-800 dark:text-white mb-3">
                        Attachments ({selectedEmail.attachments.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedEmail.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-700"
                          >
                            <Paperclip className="w-5 h-5 text-blue-600" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                              {attachment}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-auto text-blue-600 hover:text-blue-700"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
