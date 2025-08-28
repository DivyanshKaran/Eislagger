"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Check,
  X,
  Star,
  Heart,
  ShoppingBag,
  Truck,
  Gift,
  Award,
  Clock,
  MapPin,
  Mail,
  Phone,
  Filter,
  Search,
  Trash2,
  Archive,
  Settings,
  MoreHorizontal,
  ExternalLink,
  Calendar,
  Tag,
  Users,
  Zap,
  Sparkles,
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

const notificationTypes = [
  { id: "all", label: "All", icon: <Bell className="w-4 h-4" /> },
  { id: "orders", label: "Orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { id: "delivery", label: "Delivery", icon: <Truck className="w-4 h-4" /> },
  { id: "promotions", label: "Promotions", icon: <Gift className="w-4 h-4" /> },
  { id: "rewards", label: "Rewards", icon: <Award className="w-4 h-4" /> },
  { id: "system", label: "System", icon: <Settings className="w-4 h-4" /> },
];

const notifications = [
  {
    id: 1,
    type: "orders",
    title: "Order Confirmed",
    message: "Your order #12345 has been confirmed and is being prepared.",
    time: "2 minutes ago",
    read: false,
    icon: <ShoppingBag className="w-5 h-5" />,
    color: "from-blue-500 to-purple-600",
    action: "View Order",
    orderId: "12345",
  },
  {
    id: 2,
    type: "delivery",
    title: "Out for Delivery",
    message:
      "Your ice cream is on its way! Expected delivery in 15-20 minutes.",
    time: "10 minutes ago",
    read: false,
    icon: <Truck className="w-5 h-5" />,
    color: "from-green-500 to-teal-600",
    action: "Track Order",
    orderId: "12345",
  },
  {
    id: 3,
    type: "promotions",
    title: "Special Offer",
    message:
      "Get 20% off on all chocolate flavors this weekend! Use code CHOCO20.",
    time: "1 hour ago",
    read: true,
    icon: <Gift className="w-5 h-5" />,
    color: "from-orange-500 to-pink-600",
    action: "Shop Now",
    promoCode: "CHOCO20",
  },
  {
    id: 4,
    type: "rewards",
    title: "Points Earned",
    message:
      "You earned 50 points for your recent purchase! Total points: 1,250.",
    time: "2 hours ago",
    read: true,
    icon: <Award className="w-5 h-5" />,
    color: "from-yellow-500 to-orange-600",
    action: "View Rewards",
    points: 50,
  },
  {
    id: 5,
    type: "system",
    title: "App Update",
    message:
      "New features available! Update your app to enjoy improved navigation and faster checkout.",
    time: "1 day ago",
    read: true,
    icon: <Settings className="w-5 h-5" />,
    color: "from-purple-500 to-indigo-600",
    action: "Update Now",
    version: "2.1.0",
  },
  {
    id: 6,
    type: "promotions",
    title: "New Flavor Alert",
    message:
      "Try our new 'Midnight Chocolate' flavor! Available for a limited time only.",
    time: "2 days ago",
    read: true,
    icon: <Sparkles className="w-5 h-5" />,
    color: "from-pink-500 to-rose-600",
    action: "Order Now",
    flavor: "Midnight Chocolate",
  },
  {
    id: 7,
    type: "rewards",
    title: "Birthday Bonus",
    message:
      "Happy Birthday! Enjoy 100 bonus points and a free scoop on your next order.",
    time: "3 days ago",
    read: true,
    icon: <Gift className="w-5 h-5" />,
    color: "from-red-500 to-pink-600",
    action: "Claim Bonus",
    bonus: 100,
  },
  {
    id: 8,
    type: "orders",
    title: "Order Delivered",
    message:
      "Your order #12340 has been successfully delivered. Enjoy your ice cream!",
    time: "1 week ago",
    read: true,
    icon: <Check className="w-5 h-5" />,
    color: "from-green-500 to-emerald-600",
    action: "Rate Order",
    orderId: "12340",
  },
];

export default function PatronNotificationsPage() {
  const [selectedType, setSelectedType] = useState("all");
  const [notificationsList, setNotificationsList] = useState(notifications);
  const [showRead, setShowRead] = useState(true);

  const filteredNotifications = notificationsList.filter((notification) => {
    const typeMatch =
      selectedType === "all" || notification.type === selectedType;
    const readMatch = showRead || !notification.read;
    return typeMatch && readMatch;
  });

  const markAsRead = (id: number) => {
    setNotificationsList((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationsList((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotificationsList((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const getUnreadCount = () => notificationsList.filter((n) => !n.read).length;

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Notifications
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Stay updated with your orders, promotions, and rewards
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                {getUnreadCount()} unread
              </Badge>
              <Button
                variant="outline"
                onClick={markAllAsRead}
                className="border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 animate-slide-in-up">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {notificationTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    onClick={() => setSelectedType(type.id)}
                    className={`${
                      selectedType === type.id
                        ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white"
                        : "border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                    }`}
                  >
                    {type.icon}
                    <span className="ml-2">{type.label}</span>
                  </Button>
                ))}
              </div>
              <div className="mt-4 flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showRead}
                    onChange={(e) => setShowRead(e.target.checked)}
                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Show read notifications
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <div className="space-y-4 animate-fade-in-scale">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
              <CardContent className="p-8 text-center">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No notifications
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  You're all caught up! Check back later for new updates.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => (
              <Card
                key={notification.id}
                className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 transition-all duration-300 hover:shadow-lg animate-fade-in-scale ${
                  !notification.read
                    ? "ring-2 ring-orange-200 dark:ring-orange-700"
                    : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${notification.color} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      {notification.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {notification.time}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                            >
                              {notification.action}
                            </Button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Notification Settings */}
        <div className="mt-8 animate-fade-in-scale">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Email Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Order updates",
                      "Promotions",
                      "Rewards",
                      "System updates",
                    ].map((setting) => (
                      <div
                        key={setting}
                        className="flex items-center justify-between p-3 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg"
                      >
                        <span className="text-gray-700 dark:text-gray-300">
                          {setting}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-200 dark:border-orange-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Push Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Order status",
                      "Delivery updates",
                      "Special offers",
                      "App updates",
                    ].map((setting) => (
                      <div
                        key={setting}
                        className="flex items-center justify-between p-3 bg-pink-50/50 dark:bg-pink-950/20 rounded-lg"
                      >
                        <span className="text-gray-700 dark:text-gray-300">
                          {setting}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-pink-200 dark:border-pink-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
