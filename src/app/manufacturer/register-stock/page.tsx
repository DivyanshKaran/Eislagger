"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Package,
  DollarSign,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  ArrowRight,
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
  
  .form-input {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.3);
    transition: all 0.3s ease;
  }
  
  .form-input:focus {
    background: rgba(255, 255, 255, 0.95);
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .dark .form-input {
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(71, 85, 105, 0.3);
  }
  
  .dark .form-input:focus {
    background: rgba(30, 41, 59, 0.95);
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

export default function RegisterStockPage() {
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    unitPrice: "",
    category: "",
    description: "",
    supplier: "",
    expiryDate: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const recentRegistrations = [
    {
      id: 1,
      productName: "Vanilla Ice Cream Base",
      quantity: "500L",
      unitPrice: "$2.50",
      category: "Base Mix",
      status: "registered",
      date: "2024-01-15",
      change: "+15.2%",
    },
    {
      id: 2,
      productName: "Chocolate Syrup",
      quantity: "200L",
      unitPrice: "$3.20",
      category: "Toppings",
      status: "pending",
      date: "2024-01-14",
      change: "+8.5%",
    },
    {
      id: 3,
      productName: "Strawberry Flavoring",
      quantity: "150L",
      unitPrice: "$4.10",
      category: "Flavorings",
      status: "registered",
      date: "2024-01-13",
      change: "+12.3%",
    },
    {
      id: 4,
      productName: "Mint Extract",
      quantity: "100L",
      unitPrice: "$5.80",
      category: "Flavorings",
      status: "registered",
      date: "2024-01-12",
      change: "+22.1%",
    },
  ];

  const stats = [
    {
      title: "Total Stock Value",
      value: "$45,230",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      subtitle: "Current inventory",
    },
    {
      title: "Active Products",
      value: "156",
      change: "+8",
      changeType: "positive" as const,
      icon: <Package className="w-6 h-6" />,
      color: "from-sky-500 to-sky-600",
      subtitle: "In production",
    },
    {
      title: "Pending Registrations",
      value: "23",
      change: "-5",
      changeType: "negative" as const,
      icon: <Clock className="w-6 h-6" />,
      color: "from-indigo-500 to-indigo-600",
      subtitle: "Awaiting approval",
    },
  ];

  const getChangeIcon = (changeType: string) => {
    return changeType === "positive" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
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
                Register Stock
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Add new inventory items to the production system
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search registrations..."
                  className="pl-12 w-72 form-input text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                />
              </div>
              <Button
                variant="outline"
                className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button
                variant="outline"
                className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Registration Form */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                New Stock Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                      Product Name *
                    </label>
                    <Input
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                      Quantity *
                    </label>
                    <Input
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="e.g., 500L, 100kg"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                      Unit Price *
                    </label>
                    <Input
                      name="unitPrice"
                      value={formData.unitPrice}
                      onChange={handleInputChange}
                      placeholder="Enter unit price"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                      Category *
                    </label>
                    <Input
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Base Mix, Toppings"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                      Supplier *
                    </label>
                    <Input
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      placeholder="Enter supplier name"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                      Expiry Date
                    </label>
                    <Input
                      name="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                    Description
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description, specifications, or notes"
                    rows={4}
                    className="form-input resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Register Stock
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Enhanced Recent Registrations */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  Recent Registrations
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
                {recentRegistrations.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {item.productName}
                          </h4>
                          <Badge
                            className={`${getStatusColor(
                              item.status
                            )} font-medium`}
                          >
                            {item.status === "registered" ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {item.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">
                              Quantity:
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white ml-2">
                              {item.quantity}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">
                              Price:
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white ml-2">
                              {item.unitPrice}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 dark:text-slate-500">
                            {item.category} • {item.date}
                          </span>
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            {item.change}
                          </span>
                        </div>
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
  );
}
