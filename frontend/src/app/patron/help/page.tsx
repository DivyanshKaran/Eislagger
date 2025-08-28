"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Star,
  Heart,
  ShoppingBag,
  CreditCard,
  Truck,
  User,
  Settings,
  Globe,
  FileText,
  Video,
  BookOpen,
  Users,
  Award,
  Shield,
  Zap,
} from "lucide-react";

// Custom styles for animations
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
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  .animate-slide-in-up {
    animation: slideInUp 0.6s ease-out forwards;
  }
  
  .animate-fade-in-scale {
    animation: fadeInScale 0.5s ease-out forwards;
  }
`;

const faqCategories = [
  {
    id: "ordering",
    title: "Ordering & Payment",
    icon: <ShoppingBag className="w-5 h-5" />,
    questions: [
      {
        question: "How do I place an order?",
        answer:
          "To place an order, browse our flavors, select your desired size and quantity, and click 'Add to Cart'. You can then proceed to checkout and choose your payment method.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and cash on delivery in select areas.",
      },
      {
        question: "Can I cancel or modify my order?",
        answer:
          "You can modify or cancel your order within 30 minutes of placing it. After that, please contact our customer support team for assistance.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "Yes, we offer full refunds if you're not satisfied with your order. Please contact us within 24 hours of delivery.",
      },
    ],
  },
  {
    id: "delivery",
    title: "Delivery & Pickup",
    icon: <Truck className="w-5 h-5" />,
    questions: [
      {
        question: "How long does delivery take?",
        answer:
          "Standard delivery takes 30-45 minutes. Express delivery (15-20 minutes) is available for an additional fee in select areas.",
      },
      {
        question: "Do you offer pickup options?",
        answer:
          "Yes, you can choose to pick up your order from any of our store locations. Pickup orders are typically ready within 15 minutes.",
      },
      {
        question: "What are your delivery hours?",
        answer:
          "We deliver from 10:00 AM to 10:00 PM daily. Some locations may have extended hours during weekends and holidays.",
      },
      {
        question: "Is there a minimum order for delivery?",
        answer:
          "Yes, there's a minimum order of €5 for delivery. Free delivery is available for orders over €15.",
      },
    ],
  },
  {
    id: "account",
    title: "Account & Profile",
    icon: <User className="w-5 h-5" />,
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "You can create an account by clicking 'Sign Up' and providing your email, name, and password. You can also sign up using your Google or Facebook account.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "Click 'Forgot Password' on the login page and enter your email address. We'll send you a link to reset your password.",
      },
      {
        question: "Can I save my favorite flavors?",
        answer:
          "Yes, you can save your favorite flavors by clicking the heart icon on any flavor. These will appear in your 'Favorites' section.",
      },
      {
        question: "How do I update my profile information?",
        answer:
          "Go to Settings > Profile and click 'Edit' to update your personal information, address, and preferences.",
      },
    ],
  },
  {
    id: "technical",
    title: "Technical Support",
    icon: <Settings className="w-5 h-5" />,
    questions: [
      {
        question: "The app is not loading properly",
        answer:
          "Try refreshing the page or clearing your browser cache. If the issue persists, please contact our technical support team.",
      },
      {
        question: "I can't log into my account",
        answer:
          "Check that you're using the correct email and password. If you've forgotten your password, use the 'Forgot Password' feature.",
      },
      {
        question: "The map is not showing store locations",
        answer:
          "Make sure you've allowed location permissions in your browser. You can also manually search for stores by entering your address.",
      },
      {
        question: "Payment is not going through",
        answer:
          "Check that your card details are correct and that you have sufficient funds. If the issue persists, try a different payment method.",
      },
    ],
  },
];

const supportChannels = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: <MessageCircle className="w-6 h-6" />,
    action: "Start Chat",
    color: "from-blue-500 to-purple-600",
    available: true,
  },
  {
    title: "Phone Support",
    description: "Call us for immediate assistance",
    icon: <Phone className="w-6 h-6" />,
    action: "Call Now",
    color: "from-green-500 to-teal-600",
    available: true,
    phone: "+49 30 12345678",
  },
  {
    title: "Email Support",
    description: "Send us a detailed message",
    icon: <Mail className="w-6 h-6" />,
    action: "Send Email",
    color: "from-orange-500 to-pink-600",
    available: true,
    email: "support@eislager.com",
  },
  {
    title: "Visit Store",
    description: "Get help in person at our stores",
    icon: <MapPin className="w-6 h-6" />,
    action: "Find Store",
    color: "from-purple-500 to-indigo-600",
    available: true,
  },
];

export default function PatronHelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFaqs = faqCategories.flatMap((category) =>
    category.questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const toggleFaq = (question: string) => {
    setExpandedFaq(expandedFaq === question ? null : question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-orange-950/20 dark:via-pink-950/20 dark:to-rose-950/20">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-300/30 to-pink-300/30 dark:from-orange-300/20 dark:to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-rose-300/30 to-orange-300/30 dark:from-rose-300/20 dark:to-orange-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-rose-300/20 dark:from-pink-300/10 dark:to-rose-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-in-up">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Help & Support
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to your questions and get the support you need
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-slide-in-up">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-gray-700/50 border-orange-200 dark:border-orange-700 focus:border-orange-500 dark:focus:border-orange-400"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 animate-fade-in-scale">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {supportChannels.map((channel, index) => (
                  <div
                    key={channel.title}
                    className={`p-4 rounded-lg bg-gradient-to-r ${channel.color} text-white cursor-pointer hover:shadow-lg transition-all duration-300 animate-fade-in-scale`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3">
                      {channel.icon}
                      <div>
                        <h3 className="font-semibold">{channel.title}</h3>
                        <p className="text-sm opacity-90">
                          {channel.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                    >
                      {channel.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Categories */}
        <div className="mb-8 animate-fade-in-scale">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={activeCategory === "all" ? "default" : "outline"}
                  onClick={() => setActiveCategory("all")}
                  className={
                    activeCategory === "all"
                      ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white"
                      : "border-orange-200 dark:border-orange-700"
                  }
                >
                  All Questions
                </Button>
                {faqCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      activeCategory === category.id ? "default" : "outline"
                    }
                    onClick={() => setActiveCategory(category.id)}
                    className={
                      activeCategory === category.id
                        ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white"
                        : "border-orange-200 dark:border-orange-700"
                    }
                  >
                    {category.icon}
                    <span className="ml-2">{category.title}</span>
                  </Button>
                ))}
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {(activeCategory === "all"
                  ? filteredFaqs
                  : faqCategories.find((c) => c.id === activeCategory)
                      ?.questions || []
                ).map((faq, index) => (
                  <div
                    key={index}
                    className="border border-orange-200 dark:border-orange-700 rounded-lg overflow-hidden animate-fade-in-scale"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <button
                      onClick={() => toggleFaq(faq.question)}
                      className="w-full p-4 text-left bg-orange-50/50 dark:bg-orange-950/20 hover:bg-orange-100/50 dark:hover:bg-orange-900/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {faq.question}
                        </h3>
                        {expandedFaq === faq.question ? (
                          <ChevronUp className="w-5 h-5 text-orange-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-orange-600" />
                        )}
                      </div>
                    </button>
                    {expandedFaq === faq.question && (
                      <div className="p-4 bg-white/50 dark:bg-gray-700/50 border-t border-orange-200 dark:border-orange-700">
                        <p className="text-gray-600 dark:text-gray-300">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="animate-fade-in-scale">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Phone Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Available 24/7
                  </p>
                  <p className="text-orange-600 dark:text-orange-400 font-medium">
                    +49 30 12345678
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Email Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Response within 2 hours
                  </p>
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    support@eislager.com
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Business Hours
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Monday - Sunday
                  </p>
                  <p className="text-purple-600 dark:text-purple-400 font-medium">
                    10:00 AM - 10:00 PM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
