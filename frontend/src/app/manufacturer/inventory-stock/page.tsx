"use client";

import React, { useState } from "react";
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Edit,
  Upload,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const customStyles = `
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-slide-in-up { animation: slideInUp 0.6s ease-out forwards; }
  .animate-fade-in-scale { animation: fadeInScale 0.5s ease-out forwards; }
`;

interface StockProduct {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitPrice: number;
  lastUpdated: string;
  supplier: string;
  status: "in_stock" | "low_stock" | "out_of_stock" | "overstock";
}

export default function InventoryStockPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const stockProducts: StockProduct[] = [
    {
      id: 1,
      name: "Vanilla Ice Cream Base",
      category: "Base Ingredients",
      currentStock: 250,
      minStock: 100,
      maxStock: 500,
      unit: "Liters",
      unitPrice: 15.50,
      lastUpdated: "2 hours ago",
      supplier: "Dairy Supplies Co.",
      status: "in_stock"
    },
    {
      id: 2,
      name: "Chocolate Syrup",
      category: "Flavorings",
      currentStock: 45,
      minStock: 50,
      maxStock: 200,
      unit: "Liters",
      unitPrice: 8.75,
      lastUpdated: "4 hours ago",
      supplier: "ChocoMaster Inc.",
      status: "low_stock"
    },
    {
      id: 3,
      name: "Packaging Material",
      category: "Packaging",
      currentStock: 0,
      minStock: 20,
      maxStock: 100,
      unit: "Boxes",
      unitPrice: 12.00,
      lastUpdated: "1 day ago",
      supplier: "Box & Wrap Ltd.",
      status: "out_of_stock"
    }
  ];

  const filteredProducts = stockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "low_stock": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "out_of_stock": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "overstock": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  const formatStockStatus = (status: string) => {
    switch (status) {
      case "in_stock": return "In Stock";

      case "low_stock": return "Low Stock";

      case "out_of_stock": return "Out of Stock";

      case "overstock": return "Overstock";

      default: return status;

    }

  };

  return (
    <div className="relative">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      <div className="relative z-10 p-6">

        <div className="mb-8 animate-slide-in-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
                Inventory Management
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Track stock levels, monitor consumption, and manage inventory efficiently
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/80 dark:bg-slate-800/80 border-blue-200 dark:border-blue-800">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Stock Item
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-800/40">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+5.2%</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">₹15,425</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Inventory Value</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Across 3 items</p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-800/40">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <Package className="w-4 h-4" />
                  <span className="text-sm font-medium">3</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">3</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Active Products</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Currently tracked</p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-800/40">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+1</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">1</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Low Stock Items</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Need restocking</p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-800/40">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">-1</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">1</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Out of Stock</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Urgent attention needed</p>
              </div>
            </div>
          </div>

          <div className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-800/40">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search products or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-xl text-slate-700 dark:text-slate-300"
                >
                  <option value="all">All Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="overstock">Overstock</option>
                </select>
                <Button variant="outline" className="border-blue-200 dark:border-blue-800">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-200/50 dark:border-blue-800/40">
            <div className="p-6 border-b border-blue-200/50 dark:border-blue-800/40">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Stock Management</h2>
              <p className="text-slate-600 dark:text-slate-400">Overview of all inventory items</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-200/50 dark:border-blue-800/40">
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Product</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Category</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Current Stock</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Supplier</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-blue-100/50 dark:border-blue-800/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-medium text-sm">{product.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800 dark:text-white">{product.name}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{product.lastUpdated}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{product.category}</td>
                      <td className="p-4">
                        <div className="font-medium text-slate-800 dark:text-white">{product.currentStock} {product.unit}</div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(product.status)}>
                          {formatStockStatus(product.status)}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{product.supplier}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-blue-200 dark:border-blue-800">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-blue-200 dark:border-blue-800">
                            <Upload className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
