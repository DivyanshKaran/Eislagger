"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Camera,
  Edit,
  Save,
  X,
  Check,
  Eye,
  EyeOff,
  Lock,
  Key,
  Moon,
  Sun,
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

export default function PatronSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
    orderUpdates: true,
    promotions: true,
    newFlavors: true,
    storeUpdates: true,
  });

  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("EUR");

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: <Palette className="w-4 h-4" />,
    },
    {
      id: "privacy",
      label: "Privacy & Security",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "payment",
      label: "Payment",
      icon: <CreditCard className="w-4 h-4" />,
    },
  ];

  const toggleNotification = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
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
            Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 animate-slide-in-up">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-150 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white"
                      }`}
                    >
                      {tab.icon}
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div className="animate-fade-in-scale">
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-900 dark:text-white">
                        Profile Information
                      </CardTitle>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                        className="border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                      >
                        {isEditing ? (
                          <X className="w-4 h-4 mr-2" />
                        ) : (
                          <Edit className="w-4 h-4 mr-2" />
                        )}
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-500 text-white text-xl">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          John Doe
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Premium Member
                        </p>
                        {isEditing && (
                          <Button variant="outline" size="sm" className="mt-2">
                            <Camera className="w-4 h-4 mr-2" />
                            Change Photo
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name
                        </label>
                        <Input
                          defaultValue="John"
                          disabled={!isEditing}
                          className="bg-white/50 dark:bg-gray-700/50 border-orange-200 dark:border-orange-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name
                        </label>
                        <Input
                          defaultValue="Doe"
                          disabled={!isEditing}
                          className="bg-white/50 dark:bg-gray-700/50 border-orange-200 dark:border-orange-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <Input
                          defaultValue="john.doe@example.com"
                          disabled={!isEditing}
                          className="bg-white/50 dark:bg-gray-700/50 border-orange-200 dark:border-orange-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone
                        </label>
                        <Input
                          defaultValue="+49 123 456 789"
                          disabled={!isEditing}
                          className="bg-white/50 dark:bg-gray-700/50 border-orange-200 dark:border-orange-700"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Address
                        </label>
                        <Input
                          defaultValue="123 Ice Cream Street, Berlin, Germany"
                          disabled={!isEditing}
                          className="bg-white/50 dark:bg-gray-700/50 border-orange-200 dark:border-orange-700"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex space-x-3 pt-4">
                        <Button className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <div className="animate-fade-in-scale">
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Email Notifications */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Mail className="w-5 h-5 mr-2" />
                        Email Notifications
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(notifications)
                          .slice(0, 4)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between p-3 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  Receive notifications via email
                                </p>
                              </div>
                              <Button
                                variant={value ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleNotification(key)}
                                className={
                                  value
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "border-orange-200 dark:border-orange-700"
                                }
                              >
                                {value ? <Check className="w-4 h-4" /> : "Off"}
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Push Notifications */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Bell className="w-5 h-5 mr-2" />
                        Push Notifications
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(notifications)
                          .slice(4)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between p-3 bg-pink-50/50 dark:bg-pink-950/20 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  Receive push notifications
                                </p>
                              </div>
                              <Button
                                variant={value ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleNotification(key)}
                                className={
                                  value
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "border-pink-200 dark:border-pink-700"
                                }
                              >
                                {value ? <Check className="w-4 h-4" /> : "Off"}
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Preferences Settings */}
            {activeTab === "preferences" && (
              <div className="animate-fade-in-scale">
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">
                      App Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Theme Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Palette className="w-5 h-5 mr-2" />
                        Theme
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            theme === "light"
                              ? "border-orange-400 bg-orange-50 dark:bg-orange-950/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-orange-300"
                          }`}
                          onClick={() => setTheme("light")}
                        >
                          <div className="flex items-center space-x-3">
                            <Sun className="w-6 h-6 text-yellow-500" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                Light
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Bright theme
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            theme === "dark"
                              ? "border-orange-400 bg-orange-50 dark:bg-orange-950/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-orange-300"
                          }`}
                          onClick={() => setTheme("dark")}
                        >
                          <div className="flex items-center space-x-3">
                            <Moon className="w-6 h-6 text-blue-500" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                Dark
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Dark theme
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Language Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Globe className="w-5 h-5 mr-2" />
                        Language & Region
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Language
                          </label>
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full p-3 bg-white/50 dark:bg-gray-700/50 border border-orange-200 dark:border-orange-700 rounded-lg focus:outline-none focus:border-orange-500 dark:focus:border-orange-400"
                          >
                            <option value="en">English</option>
                            <option value="de">Deutsch</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="hi">हिंदी</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Currency
                          </label>
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full p-3 bg-white/50 dark:bg-gray-700/50 border border-orange-200 dark:border-orange-700 rounded-lg focus:outline-none focus:border-orange-500 dark:focus:border-orange-400"
                          >
                            <option value="EUR">Euro (€)</option>
                            <option value="USD">US Dollar ($)</option>
                            <option value="GBP">British Pound (£)</option>
                            <option value="INR">Indian Rupee (₹)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Privacy & Security Settings */}
            {activeTab === "privacy" && (
              <div className="animate-fade-in-scale">
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">
                      Privacy & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Password Change */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Lock className="w-5 h-5 mr-2" />
                        Change Password
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter current password"
                              className="bg-white/50 dark:bg-gray-700/50 border-orange-200 dark:border-orange-700 pr-10"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            className="bg-white/50 dark:bg-gray-700/50 border-orange-200 dark:border-orange-700"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            className="bg-white/50 dark:bg-gray-700/50 border-orange-200 dark:border-orange-700"
                          />
                        </div>
                        <Button className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white">
                          <Key className="w-4 h-4 mr-2" />
                          Update Password
                        </Button>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Privacy Settings
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Profile Visibility
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Make your profile public
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-orange-200 dark:border-orange-700"
                          >
                            Off
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-pink-50/50 dark:bg-pink-950/20 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Location Sharing
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Share your location for nearby stores
                            </p>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === "payment" && (
              <div className="animate-fade-in-scale">
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Saved Cards */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Saved Payment Methods
                      </h3>
                      <div className="space-y-3">
                        <div className="p-4 border border-orange-200 dark:border-orange-700 rounded-lg bg-orange-50/50 dark:bg-orange-950/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Visa ending in 4242
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  Expires 12/25
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              Default
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-6 bg-gradient-to-r from-red-500 to-orange-600 rounded"></div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Mastercard ending in 8888
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  Expires 08/26
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Set Default
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add New Card */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Add New Payment Method
                      </h3>
                      <Button className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Add New Card
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
