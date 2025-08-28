"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Bell,
  User,
  TrendingUp,
  TrendingDown,
  Heart,
  Star,
  ShoppingBag,
  MapPin,
  ArrowRight,
  Award,
  Calendar,
  DollarSign,
  Users,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

// Mock data for charts
const orderTrendData = [
  { month: "Jan", orders: 12, spending: 180 },
  { month: "Feb", orders: 15, spending: 220 },
  { month: "Mar", orders: 18, spending: 280 },
  { month: "Apr", orders: 14, spending: 210 },
  { month: "May", orders: 22, spending: 320 },
  { month: "Jun", orders: 25, spending: 380 },
  { month: "Jul", orders: 28, spending: 420 },
  { month: "Aug", orders: 32, spending: 480 },
  { month: "Sep", orders: 29, spending: 440 },
  { month: "Oct", orders: 35, spending: 520 },
  { month: "Nov", orders: 38, spending: 570 },
  { month: "Dec", orders: 42, spending: 630 },
];

const flavorPreferencesData = [
  { name: "Mango Tango", value: 25, color: "#f97316" },
  { name: "Chocolate Dream", value: 20, color: "#7c2d12" },
  { name: "Vanilla Bean", value: 18, color: "#fef3c7" },
  { name: "Strawberry Delight", value: 15, color: "#fda4af" },
  { name: "Espresso Shot", value: 12, color: "#92400e" },
  { name: "Others", value: 10, color: "#fbbf24" },
];

const weeklyActivityData = [
  { day: "Mon", orders: 8, visits: 12 },
  { day: "Tue", orders: 12, visits: 18 },
  { day: "Wed", orders: 15, visits: 22 },
  { day: "Thu", orders: 18, visits: 25 },
  { day: "Fri", orders: 22, visits: 30 },
  { day: "Sat", orders: 28, visits: 35 },
  { day: "Sun", orders: 20, visits: 28 },
];

const storePerformanceData = [
  { store: "Berlin Central", orders: 45, rating: 4.8, distance: "0.8km" },
  { store: "Mumbai Downtown", orders: 38, rating: 4.6, distance: "1.2km" },
  { store: "Pune HQ", orders: 32, rating: 4.7, distance: "2.1km" },
  { store: "Hamburg Harbor", orders: 28, rating: 4.5, distance: "3.5km" },
  { store: "Bangalore Tech", orders: 35, rating: 4.9, distance: "4.2km" },
];

// Mock data for customer dashboard
const recentOrders = [
  {
    id: 1,
    flavor: "Mango Tango",
    store: "EisLager Berlin Central",
    status: "delivered",
    date: "2024-01-15",
    amount: "€8.50",
    rating: 5,
  },
  {
    id: 2,
    flavor: "Chocolate Dream",
    store: "EisLager Mumbai Downtown",
    status: "in-transit",
    date: "2024-01-14",
    amount: "₹120.00",
    rating: null,
  },
  {
    id: 3,
    flavor: "Vanilla Bean",
    store: "EisLager Pune HQ",
    status: "preparing",
    date: "2024-01-13",
    amount: "₹95.00",
    rating: null,
  },
];

const favoriteFlavors = [
  {
    name: "Mango Tango",
    emoji: "🥭",
    rating: 4.9,
    orders: 12,
    lastOrdered: "2 days ago",
  },
  {
    name: "Chocolate Dream",
    emoji: "🍫",
    rating: 4.8,
    orders: 8,
    lastOrdered: "1 week ago",
  },
  {
    name: "Strawberry Delight",
    emoji: "🍓",
    rating: 4.7,
    orders: 6,
    lastOrdered: "3 days ago",
  },
];

const nearbyStores = [
  {
    name: "EisLager Berlin Central",
    distance: "0.8 km",
    rating: 4.8,
    status: "open",
    specialties: ["Artisan Ice Cream", "Gelato"],
  },
  {
    name: "EisLager Mumbai Downtown",
    distance: "1.2 km",
    rating: 4.6,
    status: "open",
    specialties: ["Kulfi", "Falooda"],
  },
  {
    name: "EisLager Pune HQ",
    distance: "2.1 km",
    rating: 4.7,
    status: "open",
    specialties: ["Gelato", "Smoothies"],
  },
];

const customerStats = [
  {
    title: "Total Orders",
    value: "47",
    change: "+12",
    changeType: "increase",
    icon: <ShoppingBag className="w-6 h-6" />,
    color: "from-orange-400 to-pink-500",
    bgColor:
      "from-orange-50/80 to-pink-50/80 dark:from-orange-950/20 dark:to-pink-950/20",
  },
  {
    title: "Favorites",
    value: "8",
    change: "+2",
    changeType: "increase",
    icon: <Heart className="w-6 h-6" />,
    color: "from-pink-400 to-rose-500",
    bgColor:
      "from-pink-50/80 to-rose-50/80 dark:from-pink-950/20 dark:to-rose-950/20",
  },
  {
    title: "Reviews",
    value: "23",
    change: "+5",
    changeType: "increase",
    icon: <Star className="w-6 h-6" />,
    color: "from-yellow-400 to-orange-500",
    bgColor:
      "from-yellow-50/80 to-orange-50/80 dark:from-yellow-950/20 dark:to-orange-950/20",
  },
  {
    title: "Loyalty Points",
    value: "1,247",
    change: "+89",
    changeType: "increase",
    icon: <Award className="w-6 h-6" />,
    color: "from-purple-400 to-pink-500",
    bgColor:
      "from-purple-50/80 to-pink-50/80 dark:from-purple-950/20 dark:to-pink-950/20",
  },
];

export default function PatronDashboardPage() {
  const [search, setSearch] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "in-transit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "preparing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getChangeIcon = (changeType: string) => {
    return changeType === "increase" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-orange-950/20 dark:via-pink-950/20 dark:to-rose-950/20">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-200/30 to-pink-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-200/30 to-rose-200/30 rounded-full blur-2xl animate-pulse-glow"></div>
        <div
          className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, Ice Cream Lover! 🍦
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Here's what's happening with your ice cream adventures
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <Avatar className="w-10 h-10 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30">
                <AvatarFallback className="text-lg">🍦</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {customerStats.map((stat, index) => (
            <Card
              key={stat.title}
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-900/20 animate-fade-in-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {getChangeIcon(stat.changeType)}
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-1">
                        {stat.change} this month
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Order Trends Chart */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Order Trends
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your ice cream ordering patterns over time
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={orderTrendData}>
                  <defs>
                    <linearGradient
                      id="orderGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#f97316"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #f3f4f6",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#f97316"
                    fill="url(#orderGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Flavor Preferences Chart */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Flavor Preferences
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your favorite ice cream flavors
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={flavorPreferencesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {flavorPreferencesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #f3f4f6",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Activity Chart */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 mb-8 animate-fade-in-scale">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Weekly Activity
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your activity patterns throughout the week
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid #f3f4f6",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="visits" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Store Performance */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 mb-8 animate-fade-in-scale">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Store Performance
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your favorite stores and their performance
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storePerformanceData.map((store, index) => (
                <div
                  key={store.store}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🏪</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {store.store}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {store.distance}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Orders
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {store.orders}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Rating
                      </p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900 dark:text-white ml-1">
                          {store.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🍦</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.flavor}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {order.store}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {order.amount}
                    </p>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-950/30"
              >
                View All Orders
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Favorite Flavors */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Favorite Flavors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {favoriteFlavors.map((flavor) => (
                <div
                  key={flavor.name}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{flavor.emoji}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {flavor.name}
                      </p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                          {flavor.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {flavor.orders} orders
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {flavor.lastOrdered}
                    </p>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-950/30"
              >
                Browse Flavors
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Nearby Stores */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Nearby Stores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nearbyStores.map((store) => (
                <div
                  key={store.name}
                  className="p-3 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {store.name}
                    </h4>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      {store.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {store.distance}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-600 dark:text-gray-300 ml-1">
                        {store.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {store.specialties.map((specialty, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-950/30"
              >
                View All Stores
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
