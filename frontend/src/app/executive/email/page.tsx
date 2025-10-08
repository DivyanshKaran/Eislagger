"use client";

import { useState } from "react";
import {
  Mail,
  Send,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  Search,
  Filter,
  Plus,
  MailIcon,
  FileText,
  SendIcon,
  AlertTriangle,
  Clock,
  AlertCircle,
  CheckCircle,
  Edit,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Executive email data
const executiveEmails = [
  {
    id: "1",
    from: "sarah.chen@company.com",
    fromName: "Sarah Chen",
    title: "VP Strategy & Development",
    subject: "Q4 Board Presentation Materials Ready",
    preview: "The executive summary for the quarterly board meeting is prepared. All key metrics show positive growth...",
    timestamp: "2m ago",
    priority: "high",
    status: "unread",
    starred: true,
    folder: "inbox"
  },
  {
    id: "2",
    from: "investors@capitalgroup.com",
    fromName: "Capital Investment Group", 
    title: "External Partner",
    subject: "Investment Proposal Review - Strategic Expansion",
    preview: "We're interested in discussing your market expansion plans for Southeast Asia region...",
    timestamp: "45m ago",
    priority: "high", 
    status: "read",
    starred: false,
    folder: "inbox"
  },
  {
    id: "3",
    from: "marcus.rodriguez@company.com",
    fromName: "Marcus Rodriguez",
    title: "Regional Operations Director",
    subject: "Operations Report - Q3 Results",
    preview: "Regional performance metrics exceed targets by 12%. All manufacturing facilities operating at optimal capacity...",
    timestamp: "1h ago",
    priority: "medium",
    status: "read", 
    starred: false,
    folder: "inbox"
  },
  {
    id: "4",
    from: "legal@company.com",
    fromName: "Legal Department",
    title: "Internal Team",
    subject: "Contract Review Required - Partnership Agreement",
    preview: "The proposed merger agreement requires executive review before finalizing terms with TechCorp...",
    timestamp: "2h ago", 
    priority: "high",
    status: "unread",
    starred: true,
    folder: "inbox"
  },
  {
    id: "5",
    from: "emma.thompson@company.com",
    fromName: "Emma Thompson",
    title: "Corporate Communications",
    subject: "Press Release Approval Needed",
    preview: "Draft press release for the technology partnership announcement ready for your review...",
    timestamp: "3h ago",
    priority: "medium",
    status: "read",
    starred: false,
    folder: "inbox"
  }
];

const folders = [
  { name: "Inbox", count: 12, icon: MailIcon },
  { name: "Sent", count: 45, icon: SendIcon },
  { name: "Drafts", count: 3, icon: FileText },
  { name: "Important", count: 8, icon: AlertTriangle },
  { name: "Archive", count: 156, icon: Archive },
];

export default function ExecutiveEmailPage() {
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState(executiveEmails[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredEmails = executiveEmails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = email.folder === selectedFolder;
    const matchesFilter = activeFilter === "all" || email.status === activeFilter;
    return matchesSearch && matchesFolder && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      case "low": return "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      default: return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800";
    }
  };

  const getAvatarFromName = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/20 relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-violet-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-300/20 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main email interface */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto p-6">
        <div className="flex h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 dark:border-purple-800/50 overflow-hidden">
          
          {/* Email sidebar */}
          <div className="w-80 flex-shrink-0 border-r border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-900/20 dark:to-slate-800">
            
            {/* Header */}
            <div className="p-6 border-b border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/80 to-violet-50/80 dark:from-purple-900/20 dark:to-violet-900/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800 dark:text-white">Executive Mail</h1>
                  <p className="text-xs text-purple-600 dark:text-purple-400">Strategic Communications</p>
                </div>
              </div>
              
              {/* Compose button */}
              <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Compose Message
              </Button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-purple-200/50 dark:border-purple-800/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-800 rounded-xl"
                />
              </div>
              
              {/* Filter */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeFilter === "all"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter("unread")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeFilter === "unread"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setActiveFilter("read")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeFilter === "read"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  Read
                </button>
              </div>
            </div>

            {/* Folders */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {folders.map((folder) => (
                <button
                  key={folder.name}
                  onClick={() => setSelectedFolder(folder.name.toLowerCase())}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    selectedFolder === folder.name.toLowerCase()
                      ? "bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-700"
                      : "hover:bg-purple-50/50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <folder.icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-slate-800 dark:text-white">{folder.name}</span>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 text-xs">
                    {folder.count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Email list and content area */}
          <div className="flex-1 flex flex-col min-h-0">
            
            {/* Email list */}
            <div className="h-1/2 flex-shrink-0 border-b border-purple-200/50 dark:border-purple-800/50 overflow-y-auto">
              <div className="p-4 bg-gradient-to-r from-purple-50/50 to-violet-50/50 dark:from-purple-900/10 dark:to-violet-900/10 border-b border-purple-200/50 dark:border-purple-800/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white capitalize">{selectedFolder}</h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-purple-200 dark:border-purple-800">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button size="sm" variant="outline" className="border-purple-200 dark:border-purple-800">
                      <Archive className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Email items */}
              <div className="space-y-1">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-4 cursor-pointer transition-all border-b border-purple-100/50 dark:border-purple-800/30 ${
                      selectedEmail.id === email.id
                        ? "bg-purple-50 dark:bg-purple-900/20 border-l-4 border-l-purple-600"
                        : email.status === "unread" 
                        ? "bg-white dark:bg-slate-900 hover:bg-purple-50/50 dark:hover:bg-slate-800/50"
                        : "bg-white/70 dark:bg-slate-900/70 hover:bg-purple-50/50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                        email.priority === "high" ? "from-purple-600 to-violet-700" : "from-violet-600 to-purple-700"
                      } flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {getAvatarFromName(email.fromName)}
                      </div>
                      
                      {/* Email content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold text-sm ${
                            email.status === "unread" ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                          }`}>
                            {email.fromName}
                          </h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(email.priority)}`}>
                            {email.priority.toUpperCase()}
                          </span>
                          {email.starred && (
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        <p className="text-sm font-medium text-slate-800 dark:text-white mb-1">{email.subject}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate mb-2">{email.preview}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 dark:text-slate-500">{email.title}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-500">{email.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email content */}
            <div className="flex-1 overflow-y-auto">
              {selectedEmail && (
                <div className="p-6">
                  {/* Email header */}
                  <div className="border-b border-purple-200/50 dark:border-purple-800/50 pb-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                          selectedEmail.priority === "high" ? "from-purple-600 to-violet-700" : "from-violet-600 to-purple-700"
                        } flex items-center justify-center text-white font-bold text-lg`}>
                          {getAvatarFromName(selectedEmail.fromName)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{selectedEmail.fromName}</h3>
                            {selectedEmail.starred && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-purple-600 dark:text-purple-400 font-medium">{selectedEmail.title}</p>
                          <span className={`text-sm px-3 py-1 rounded-full ${getPriorityColor(selectedEmail.priority)}`}>
                            {selectedEmail.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-purple-200 dark:border-purple-800">
                          <Reply className="w-4 h-4 mr-2" />
                          Reply
                        </Button>
                        <Button size="sm" variant="outline" className="border-purple-200 dark:border-purple-800">
                          <Forward className="w-4 h-4 mr-2" />
                          Forward
                        </Button>
                        <Button size="sm" variant="outline" className="border-purple-200 dark:border-purple-800">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{selectedEmail.subject}</h2>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span>{selectedEmail.timestamp}</span>
                      <span>{selectedEmail.from}</span>
                    </div>
                  </div>

                  {/* Email body */}
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="bg-purple-50/50 dark:bg-purple-900/10 rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                      <p className="text-slate-800 dark:text-white leading-relaxed">
                        {selectedEmail.preview}
                      </p>
                      <p className="text-slate-800 dark:text-white leading-relaxed mt-4">
                        As discussed in our strategic planning session, this initiative aligns perfectly with our quarterly objectives. 
                        The market analysis shows exceptional growth potential in our target segments.
                      </p>
                      <p className="text-slate-800 dark:text-white leading-relaxed mt-4">
                        Please review the attached documents and provide your feedback by end of business day.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t border-purple-200/50 dark:border-purple-800/50">
                    <div className="flex gap-3">
                      <Button className="bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Read
                      </Button>
                      <Button variant="outline" className="border-purple-200 dark:border-purple-800">
                        <Download className="w-4 h-4 mr-2" />
                        Download Attachments
                      </Button>
                      <Button variant="outline" className="border-purple-200 dark:border-purple-800">
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}