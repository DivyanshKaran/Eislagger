"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Clock,
  MapPin,
  Star,
  ShoppingBag,
  Truck,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  MessageCircle,
  Share2,
  Calendar,
  DollarSign,
  Package,
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

// Mock data for orders page
const orders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    time: "14:30",
    store: "EisLager Berlin Central",
    status: "delivered",
    items: [
      { name: "Mango Tango", quantity: 2, price: "€8.50", emoji: "🥭" },
      { name: "Vanilla Bean", quantity: 1, price: "€7.50", emoji: "🌿" },
    ],
    total: "€24.50",
    deliveryAddress: "Unter den Linden 15, 10117 Berlin",
    deliveryTime: "15:15",
    rating: 5,
    review: "Perfect delivery! Ice cream was still frozen and delicious.",
    trackingSteps: [
      { step: "Order Placed", time: "14:30", completed: true },
      { step: "Preparing", time: "14:35", completed: true },
      { step: "Out for Delivery", time: "15:00", completed: true },
      { step: "Delivered", time: "15:15", completed: true },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-14",
    time: "19:45",
    store: "EisLager Mumbai Downtown",
    status: "in-transit",
    items: [
      { name: "Chocolate Dream", quantity: 1, price: "€9.00", emoji: "🍫" },
      { name: "Espresso Shot", quantity: 1, price: "€8.50", emoji: "☕" },
    ],
    total: "€17.50",
    deliveryAddress: "Colaba Causeway 23, Mumbai 400001",
    estimatedDelivery: "20:30",
    trackingSteps: [
      { step: "Order Placed", time: "19:45", completed: true },
      { step: "Preparing", time: "19:50", completed: true },
      { step: "Out for Delivery", time: "20:15", completed: true },
      { step: "Delivered", time: "20:30", completed: false },
    ],
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-13",
    time: "12:15",
    store: "EisLager Pune HQ",
    status: "preparing",
    items: [
      { name: "Strawberry Delight", quantity: 2, price: "€8.00", emoji: "🍓" },
      { name: "Hazelnut Heaven", quantity: 1, price: "€9.50", emoji: "🥜" },
    ],
    total: "€25.50",
    deliveryAddress: "Koregaon Park 7, Pune 411001",
    estimatedDelivery: "13:00",
    trackingSteps: [
      { step: "Order Placed", time: "12:15", completed: true },
      { step: "Preparing", time: "12:20", completed: true },
      { step: "Out for Delivery", time: "12:45", completed: false },
      { step: "Delivered", time: "13:00", completed: false },
    ],
  },
  {
    id: "ORD-2024-004",
    date: "2024-01-12",
    time: "16:20",
    store: "EisLager Berlin Central",
    status: "delivered",
    items: [
      { name: "Pumpkin Spice", quantity: 1, price: "€9.00", emoji: "🎃" },
      { name: "Vanilla Bean", quantity: 1, price: "€7.50", emoji: "🌿" },
    ],
    total: "€16.50",
    deliveryAddress: "Friedrichstraße 45, 10117 Berlin",
    deliveryTime: "17:05",
    rating: 4,
    review: "Good delivery time, but the pumpkin spice was a bit too sweet.",
    trackingSteps: [
      { step: "Order Placed", time: "16:20", completed: true },
      { step: "Preparing", time: "16:25", completed: true },
      { step: "Out for Delivery", time: "16:50", completed: true },
      { step: "Delivered", time: "17:05", completed: true },
    ],
  },
  {
    id: "ORD-2024-005",
    date: "2024-01-11",
    time: "21:00",
    store: "EisLager Mumbai Downtown",
    status: "delivered",
    items: [{ name: "Royal Gold", quantity: 1, price: "€15.00", emoji: "👑" }],
    total: "€15.00",
    deliveryAddress: "Marine Drive 12, Mumbai 400002",
    deliveryTime: "21:45",
    rating: 5,
    review: "Absolutely worth the premium price! The saffron flavor is divine.",
    trackingSteps: [
      { step: "Order Placed", time: "21:00", completed: true },
      { step: "Preparing", time: "21:05", completed: true },
      { step: "Out for Delivery", time: "21:30", completed: true },
      { step: "Delivered", time: "21:45", completed: true },
    ],
  },
];

const orderStats = {
  totalOrders: 47,
  totalSpent: "€1,247.50",
  averageRating: 4.6,
  favoriteStore: "EisLager Berlin Central",
  thisMonth: 5,
  lastMonth: 8,
};

const filters = [
  { id: "all", label: "All Orders" },
  { id: "delivered", label: "Delivered" },
  { id: "in-transit", label: "In Transit" },
  { id: "preparing", label: "Preparing" },
  { id: "this-month", label: "This Month" },
  { id: "last-month", label: "Last Month" },
];

export default function PatronOrdersPage() {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.store.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );

    let matchesFilter = true;
    if (selectedFilter === "delivered")
      matchesFilter = order.status === "delivered";
    else if (selectedFilter === "in-transit")
      matchesFilter = order.status === "in-transit";
    else if (selectedFilter === "preparing")
      matchesFilter = order.status === "preparing";
    else if (selectedFilter === "this-month") {
      const orderDate = new Date(order.date);
      const now = new Date();
      matchesFilter =
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear();
    } else if (selectedFilter === "last-month") {
      const orderDate = new Date(order.date);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      matchesFilter =
        orderDate.getMonth() === lastMonth.getMonth() &&
        orderDate.getFullYear() === lastMonth.getFullYear();
    }

    return matchesSearch && matchesFilter;
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "in-transit":
        return <Truck className="w-4 h-4" />;
      case "preparing":
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Orders
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Track your orders and view order history
          </p>
        </div>

        {/* Stats Overview */}
        <div
          className="mb-8 animate-slide-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {orderStats.totalOrders}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Total Orders
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {orderStats.totalSpent}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Total Spent
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {orderStats.averageRating}
                  </div>
                  <div className="flex justify-center mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(orderStats.averageRating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Average Rating
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {orderStats.thisMonth}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div
          className="mb-8 space-y-4 animate-slide-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search orders by ID, store, or items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 focus:border-orange-400 dark:focus:border-orange-500"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                onClick={() => setSelectedFilter(filter.id)}
                size="sm"
                className={`${
                  selectedFilter === filter.id
                    ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white border-0"
                    : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                } transition-all duration-200`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order, index) => (
            <Card
              key={order.id}
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-900/20 animate-fade-in-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {order.id}
                      </h3>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {order.date} at {order.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {order.store}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {order.total}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-orange-100 dark:border-orange-800/30 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{item.emoji}</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tracking Steps */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Order Progress:
                  </p>
                  <div className="space-y-2">
                    {order.trackingSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-xs">{idx + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              step.completed
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {step.step}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {step.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="pt-4 border-t border-orange-100 dark:border-orange-800/30">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Delivery Address:
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.deliveryAddress}
                      </p>
                      {order.status === "delivered" && order.deliveryTime && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Delivered at {order.deliveryTime}
                        </p>
                      )}
                      {order.status === "in-transit" &&
                        order.estimatedDelivery && (
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Estimated delivery: {order.estimatedDelivery}
                          </p>
                        )}
                    </div>
                    <div className="flex space-x-2">
                      {order.status === "delivered" && order.rating && (
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < order.rating!
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white"
                      >
                        {order.status === "delivered"
                          ? "Reorder"
                          : "Track Order"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Review */}
                {order.status === "delivered" && order.review && (
                  <div className="pt-4 border-t border-orange-100 dark:border-orange-800/30">
                    <div className="flex items-start space-x-2">
                      <MessageCircle className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Your review:
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white italic">
                          "{order.review}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 animate-fade-in-scale">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start ordering your favorite flavors!
            </p>
            <Button className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white">
              Browse Flavors
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
