"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Filter,
  Eye,
  Edit,
  Plus,
  ArrowRight,
  Warehouse,
  Thermometer,
  Scale,
  Activity,
} from "lucide-react";

// Professional pastel blue theme styles
const customStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-slide-in-up {
    animation: slideInUp 0.6s ease-out forwards;
  }
  
  .animate-fade-in-scale {
    animation: fadeInScale 0.5s ease-out forwards;
  }
  
  .professional-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(147, 197, 253, 0.2);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .professional-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
  
  .dark .professional-card {
    background: rgba(30, 41, 59, 0.95);
    border: 1px solid rgba(59, 130, 246, 0.3);
  }
  
  .search-input {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.3);
    transition: all 0.3s ease;
  }
  
  .search-input:focus {
    background: rgba(255, 255, 255, 0.95);
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .dark .search-input {
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(71, 85, 105, 0.3);
  }
  
  .dark .search-input:focus {
    background: rgba(30, 41, 59, 0.95);
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

export default function InventoryStockPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const inventoryData = [
    {
      id: 1,
      productName: "Vanilla Ice Cream Base",
      category: "Base Mix",
      quantity: "2,500L",
      unitPrice: "$2.50",
      totalValue: "$6,250",
      status: "in-stock",
      lastUpdated: "2024-01-15",
      expiryDate: "2024-03-15",
      supplier: "DairyCo Ltd",
      location: "Warehouse A",
      minThreshold: "500L",
      currentLevel: "high",
      icon: "🥛",
      color: "from-blue-500 to-sky-500",
      change: "+15.2%",
    },
    {
      id: 2,
      productName: "Chocolate Syrup",
      category: "Toppings",
      quantity: "800L",
      unitPrice: "$3.20",
      totalValue: "$2,560",
      status: "low-stock",
      lastUpdated: "2024-01-14",
      expiryDate: "2024-04-20",
      supplier: "ChocoCorp",
      location: "Warehouse B",
      minThreshold: "200L",
      currentLevel: "low",
      icon: "🍫",
      color: "from-sky-500 to-indigo-500",
      change: "-8.5%",
    },
    {
      id: 3,
      productName: "Strawberry Flavoring",
      category: "Flavorings",
      quantity: "1,200L",
      unitPrice: "$4.10",
      totalValue: "$4,920",
      status: "in-stock",
      lastUpdated: "2024-01-13",
      expiryDate: "2024-05-10",
      supplier: "BerryFresh",
      location: "Warehouse A",
      minThreshold: "300L",
      currentLevel: "medium",
      icon: "🍓",
      color: "from-indigo-500 to-purple-500",
      change: "+12.3%",
    },
    {
      id: 4,
      productName: "Mint Extract",
      category: "Flavorings",
      quantity: "150L",
      unitPrice: "$5.50",
      totalValue: "$825",
      status: "critical",
      lastUpdated: "2024-01-12",
      expiryDate: "2024-02-28",
      supplier: "MintCo",
      location: "Warehouse C",
      minThreshold: "100L",
      currentLevel: "critical",
      icon: "🌿",
      color: "from-purple-500 to-pink-500",
      change: "-22.1%",
    },
    {
      id: 5,
      productName: "Caramel Sauce",
      category: "Toppings",
      quantity: "1,800L",
      unitPrice: "$2.80",
      totalValue: "$5,040",
      status: "in-stock",
      lastUpdated: "2024-01-11",
      expiryDate: "2024-06-15",
      supplier: "SweetCo",
      location: "Warehouse B",
      minThreshold: "400L",
      currentLevel: "high",
      icon: "🍯",
      color: "from-pink-500 to-rose-500",
      change: "+18.7%",
    },
  ];

  const stats = [
    {
      title: "Total Inventory Value",
      value: "$19,595",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: <Package className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      subtitle: "Current stock value",
    },
    {
      title: "Total Items",
      value: "156",
      change: "+12",
      changeType: "positive" as const,
      icon: <Warehouse className="w-6 h-6" />,
      color: "from-sky-500 to-sky-600",
      subtitle: "Active products",
    },
    {
      title: "Low Stock Items",
      value: "8",
      change: "-3",
      changeType: "negative" as const,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "from-indigo-500 to-indigo-600",
      subtitle: "Needs reorder",
    },
    {
      title: "Expiring Soon",
      value: "5",
      change: "+2",
      changeType: "positive" as const,
      icon: <Clock className="w-6 h-6" />,
      color: "from-blue-600 to-cyan-600",
      subtitle: "Within 30 days",
    },
  ];

  const categories = [
    { id: "all", label: "All Categories", icon: "📦" },
    { id: "base-mix", label: "Base Mix", icon: "🥛" },
    { id: "toppings", label: "Toppings", icon: "🍫" },
    { id: "flavorings", label: "Flavorings", icon: "🍓" },
    { id: "packaging", label: "Packaging", icon: "📦" },
  ];

  const warehouseStats = [
    {
      name: "Warehouse A",
      capacity: 85,
      temperature: "2.5°C",
      humidity: "65%",
      status: "optimal",
    },
    {
      name: "Warehouse B",
      capacity: 72,
      temperature: "2.8°C",
      humidity: "68%",
      status: "good",
    },
    {
      name: "Warehouse C",
      capacity: 45,
      temperature: "2.2°C",
      humidity: "62%",
      status: "maintenance",
    },
  ];

  const recentActivities = [
    {
      action: "Stock Updated",
      product: "Vanilla Base",
      time: "2 hours ago",
      icon: <Package className="w-4 h-4" />,
      color: "text-blue-600",
      status: "completed",
    },
    {
      action: "Low Stock Alert",
      product: "Chocolate Syrup",
      time: "4 hours ago",
      icon: <AlertTriangle className="w-4 h-4" />,
      color: "text-orange-600",
      status: "warning",
    },
    {
      action: "Delivery Received",
      product: "Strawberry Flavoring",
      time: "1 day ago",
      icon: <CheckCircle className="w-4 h-4" />,
      color: "text-green-600",
      status: "completed",
    },
  ];

  const filteredInventory = inventoryData.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      item.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-stock":
        return <CheckCircle className="w-4 h-4" />;
      case "low-stock":
        return <AlertTriangle className="w-4 h-4" />;
      case "critical":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getChangeIcon = (changeType: string) => {
    return changeType === "positive" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getWarehouseStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "maintenance":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      <div className="relative z-10 p-6">
        {/* Professional Header */}
        <div className="mb-8 animate-slide-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
                Inventory Management
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Monitor and manage your stock levels efficiently
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 w-72 search-input text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                />
              </div>
              <Button
                variant="outline"
                className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="professional-card animate-fade-in-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}
                  >
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(stat.changeType)}
                    <span
                      className={`text-sm font-bold ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {stat.subtitle}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Categories Sidebar */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full justify-start text-left transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="mr-3 text-lg">{category.icon}</span>
                    <span className="font-medium">{category.label}</span>
                    <Badge className="ml-auto bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {
                        inventoryData.filter(
                          (item) =>
                            category.id === "all" ||
                            item.category.toLowerCase().includes(category.id)
                        ).length
                      }
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Inventory List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Enhanced Warehouse Stats */}
            <Card className="professional-card animate-fade-in-scale">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                    <Warehouse className="w-5 h-5 text-white" />
                  </div>
                  Warehouse Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {warehouseStats.map((warehouse, index) => (
                    <div
                      key={index}
                      className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {warehouse.name}
                        </h4>
                        <Badge
                          className={getWarehouseStatusColor(warehouse.status)}
                        >
                          {warehouse.status}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Package className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              Capacity
                            </span>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {warehouse.capacity}%
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Thermometer className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              Temperature
                            </span>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {warehouse.temperature}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Scale className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              Humidity
                            </span>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {warehouse.humidity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Inventory Table */}
            <Card className="professional-card animate-fade-in-scale">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    Inventory Items ({filteredInventory.length})
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInventory.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-6">
                        <div className="text-4xl">{item.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="font-semibold text-slate-900 dark:text-white text-lg">
                              {item.productName}
                            </h4>
                            <Badge
                              className={`${getStatusColor(
                                item.status
                              )} font-medium`}
                            >
                              {getStatusIcon(item.status)}
                              <span className="ml-1">{item.status}</span>
                            </Badge>
                            <span
                              className={`text-sm font-medium ${
                                item.change.startsWith("+")
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {item.change}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                            <div>
                              <span className="text-slate-600 dark:text-slate-400 block mb-1">
                                Quantity
                              </span>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {item.quantity}
                              </p>
                            </div>
                            <div>
                              <span className="text-slate-600 dark:text-slate-400 block mb-1">
                                Value
                              </span>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {item.totalValue}
                              </p>
                            </div>
                            <div>
                              <span className="text-slate-600 dark:text-slate-400 block mb-1">
                                Location
                              </span>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {item.location}
                              </p>
                            </div>
                            <div>
                              <span className="text-slate-600 dark:text-slate-400 block mb-1">
                                Expires
                              </span>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {item.expiryDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-500">
                              Supplier: {item.supplier} • Last updated:{" "}
                              {item.lastUpdated}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Recent Activities */}
            <Card className="professional-card animate-fade-in-scale">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm">
                          <div className={activity.color}>{activity.icon}</div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {activity.action}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {activity.product}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-500 dark:text-slate-500 block">
                            {activity.time}
                          </span>
                          <Badge
                            className={`${
                              activity.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            } text-xs mt-1`}
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
