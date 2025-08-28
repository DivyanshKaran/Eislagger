"use client";
import { useState } from "react";
import {
  Gauge,
  Package,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Calendar,
  Truck,
  Pencil,
  Trash2,
  PlusCircle,
  Search,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const kpis = [
  {
    title: "Total SKUs",
    value: "42",
    icon: <Package className="w-6 h-6" />,
    change: "+2",
    changeType: "increase",
    subtitle: "Active Products",
  },
  {
    title: "Total Stock Value",
    value: "₹1,23,400",
    icon: <Gauge className="w-6 h-6" />,
    change: "+4%",
    changeType: "increase",
    subtitle: "Current Value",
  },
  {
    title: "Low Stock Items",
    value: "5",
    icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
    change: "+1",
    changeType: "increase",
    subtitle: "Below Min Level",
  },
  {
    title: "Out of Stock",
    value: "1",
    icon: <XCircle className="w-6 h-6 text-red-500" />,
    change: "0",
    changeType: "neutral",
    subtitle: "Needs Restock",
  },
  {
    title: "Inventory Turnover",
    value: "2.8",
    icon: <RefreshCw className="w-6 h-6" />,
    change: "+0.3",
    changeType: "increase",
    subtitle: "This Month",
  },
  {
    title: "Expiring Soon",
    value: "3",
    icon: <Calendar className="w-6 h-6 text-orange-500" />,
    change: "+1",
    changeType: "increase",
    subtitle: "Within 7 Days",
  },
  {
    title: "Damaged/Returned",
    value: "2",
    icon: <XCircle className="w-6 h-6 text-red-400" />,
    change: "-1",
    changeType: "decrease",
    subtitle: "This Month",
  },
  {
    title: "Last Restock",
    value: "2 days ago",
    icon: <Truck className="w-6 h-6" />,
    change: "",
    changeType: "neutral",
    subtitle: "",
  },
];

const initialInventory = [
  {
    name: "Choco Burst",
    sku: "SKU-001",
    stock: 32,
    min: 10,
    status: "Good",
    lastRestock: "2024-06-10",
    expiry: "2024-07-15",
  },
  {
    name: "Mango Swirl",
    sku: "SKU-002",
    stock: 8,
    min: 15,
    status: "Low",
    lastRestock: "2024-06-08",
    expiry: "2024-06-25",
  },
  {
    name: "Vanilla Dream",
    sku: "SKU-003",
    stock: 0,
    min: 10,
    status: "Out",
    lastRestock: "2024-06-01",
    expiry: "2024-06-20",
  },
  {
    name: "Raspberry Delight",
    sku: "SKU-004",
    stock: 12,
    min: 10,
    status: "Good",
    lastRestock: "2024-06-09",
    expiry: "2024-07-01",
  },
  {
    name: "Hazelnut Heaven",
    sku: "SKU-005",
    stock: 5,
    min: 8,
    status: "Low",
    lastRestock: "2024-06-07",
    expiry: "2024-06-18",
  },
];

const expiring = initialInventory.filter(
  (item) =>
    new Date(item.expiry) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
);

function getStatusBadge(status: string) {
  if (status === "Good")
    return (
      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
        Good
      </span>
    );
  if (status === "Low")
    return (
      <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
        Low
      </span>
    );
  if (status === "Out")
    return (
      <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
        Out
      </span>
    );
  return (
    <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
      Unknown
    </span>
  );
}

// Inventory trend mock data
const inventoryTrend = [
  { date: "2024-06-01", stock: 120 },
  { date: "2024-06-05", stock: 110 },
  { date: "2024-06-10", stock: 130 },
  { date: "2024-06-15", stock: 125 },
  { date: "2024-06-20", stock: 140 },
  { date: "2024-06-25", stock: 135 },
  { date: "2024-06-30", stock: 128 },
];

export default function ClerkStockPage() {
  // Placeholder for API/database integration:
  // const [inventory, setInventory] = useState(fetchInventoryFromAPI());
  const [inventory] = useState(initialInventory);
  const [search, setSearch] = useState("");

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
      <div className="min-h-screen min-w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300/30 to-purple-300/30 dark:from-pink-300/20 dark:to-purple-300/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-pink-200/30 dark:from-blue-300/20 dark:to-pink-300/20 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-300/10 dark:to-pink-300/10 rounded-full blur-3xl animate-float delay-500"></div>
        </div>
        <div className="relative flex flex-col h-screen z-10">
          <main className="flex-1 flex flex-col p-8 max-w-5xl mx-auto gap-12 overflow-y-auto scrollbar-none">
            {/* KPIs Row */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-8 gap-6 gap-y-6 mb-4">
              {kpis.map((kpi, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-6 bg-gradient-to-br from-pink-100/80 to-purple-100/80 dark:from-pink-900/30 dark:to-purple-900/30 shadow-xl border border-pink-200/60 dark:border-pink-800/40 backdrop-blur-xl overflow-hidden group transition-transform hover:scale-[1.025] animate-fade-in-scale flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg animate-float">
                      {kpi.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-pink-900 dark:text-pink-100">
                        {kpi.title}
                      </h3>
                      {kpi.subtitle && (
                        <p className="text-xs text-pink-700 dark:text-pink-300 mt-0.5">
                          {kpi.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-pink-900 dark:text-pink-100">
                      {kpi.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Inventory Trend Chart */}
            <div className="rounded-2xl bg-gradient-to-br from-pink-100/80 to-purple-100/80 dark:from-pink-900/30 dark:to-purple-900/30 shadow-xl border border-pink-200/60 dark:border-pink-800/40 backdrop-blur-xl p-8 animate-fade-in-scale">
              <h2 className="text-xl font-bold text-pink-900 dark:text-pink-100 mb-4 flex items-center gap-2">
                <Gauge className="w-5 h-5" /> Inventory Trend
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={inventoryTrend}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#ec4899", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#a78bfa", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#fdf2f8",
                      borderRadius: 8,
                      border: "none",
                    }}
                    labelStyle={{ color: "#ec4899" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="stock"
                    stroke="#ec4899"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Search Bar */}
            <div className="w-full max-w-xs mb-4">
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search inventory..."
                  className="w-full rounded-xl border-pink-200 dark:border-pink-800 focus:ring-pink-400/50 bg-white dark:bg-slate-900 pl-10 text-lg py-2"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400 pointer-events-none" />
              </div>
            </div>
            {/* Inventory Table */}
            <div className="rounded-2xl bg-gradient-to-br from-pink-100/80 to-purple-100/80 dark:from-pink-900/30 dark:to-purple-900/30 shadow-xl border border-pink-200/60 dark:border-pink-800/40 backdrop-blur-xl p-8 animate-fade-in-scale">
              <h2 className="text-xl font-bold text-pink-900 dark:text-pink-100 mb-4">
                Inventory Table
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-2">
                  <thead>
                    <tr>
                      <th className="text-left text-xs text-pink-700 dark:text-pink-200">
                        Product
                      </th>
                      <th className="text-left text-xs text-pink-700 dark:text-pink-200">
                        SKU
                      </th>
                      <th className="text-left text-xs text-pink-700 dark:text-pink-200">
                        Stock
                      </th>
                      <th className="text-left text-xs text-pink-700 dark:text-pink-200">
                        Min Level
                      </th>
                      <th className="text-left text-xs text-pink-700 dark:text-pink-200">
                        Status
                      </th>
                      <th className="text-left text-xs text-pink-700 dark:text-pink-200">
                        Last Restock
                      </th>
                      <th className="text-left text-xs text-pink-700 dark:text-pink-200">
                        Expiry
                      </th>
                      <th className="text-left text-xs text-pink-700 dark:text-pink-200">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => (
                      <tr key={item.sku} className="">
                        <td className="text-sm font-semibold text-pink-900 dark:text-pink-100 pr-2">
                          {item.name}
                        </td>
                        <td className="text-xs text-pink-700 dark:text-pink-300">
                          {item.sku}
                        </td>
                        <td className="text-sm text-pink-900 dark:text-pink-100">
                          {item.stock}
                        </td>
                        <td className="text-sm text-pink-900 dark:text-pink-100">
                          {item.min}
                        </td>
                        <td>{getStatusBadge(item.status)}</td>
                        <td className="text-xs text-pink-700 dark:text-pink-300">
                          {item.lastRestock}
                        </td>
                        <td className="text-xs text-pink-700 dark:text-pink-300">
                          {item.expiry}
                        </td>
                        <td className="flex gap-2">
                          <button
                            className="rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 text-white px-2 py-1 shadow hover:scale-105 transition-transform"
                            title="Restock"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                          <button
                            className="rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 text-white px-2 py-1 shadow hover:scale-105 transition-transform"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            className="rounded-lg bg-gradient-to-br from-red-400 to-pink-500 text-white px-2 py-1 shadow hover:scale-105 transition-transform"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Expiring Soon Table */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-100/80 to-pink-100/80 dark:from-blue-900/30 dark:to-pink-900/30 shadow-xl border border-blue-200/60 dark:border-blue-800/40 backdrop-blur-xl p-8 animate-fade-in-scale">
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Expiring Soon
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-2">
                  <thead>
                    <tr>
                      <th className="text-left text-xs text-blue-700 dark:text-blue-200">
                        Product
                      </th>
                      <th className="text-left text-xs text-blue-700 dark:text-blue-200">
                        SKU
                      </th>
                      <th className="text-left text-xs text-blue-700 dark:text-blue-200">
                        Stock
                      </th>
                      <th className="text-left text-xs text-blue-700 dark:text-blue-200">
                        Expiry
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiring.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center text-blue-400 py-4"
                        >
                          No items expiring soon.
                        </td>
                      </tr>
                    ) : (
                      expiring.map((item) => (
                        <tr key={item.sku}>
                          <td className="text-sm font-semibold text-blue-900 dark:text-blue-100 pr-2">
                            {item.name}
                          </td>
                          <td className="text-xs text-blue-700 dark:text-blue-300">
                            {item.sku}
                          </td>
                          <td className="text-sm text-blue-900 dark:text-blue-100">
                            {item.stock}
                          </td>
                          <td className="text-xs text-blue-700 dark:text-blue-300">
                            {item.expiry}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
