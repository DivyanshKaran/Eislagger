import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  MapPin,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Mock data for charts
const revenueData = [
  { month: "Jan", revenue: 65000, orders: 1200 },
  { month: "Feb", revenue: 72000, orders: 1350 },
  { month: "Mar", revenue: 68000, orders: 1280 },
  { month: "Apr", revenue: 85000, orders: 1600 },
  { month: "May", revenue: 92000, orders: 1750 },
  { month: "Jun", revenue: 89100, orders: 1680 },
];

const factoryData = [
  { factory: "Berlin", output: 45000, efficiency: 92 },
  { factory: "Mumbai", output: 38000, efficiency: 88 },
  { factory: "Pune", output: 42000, efficiency: 95 },
  { factory: "Delhi", output: 35000, efficiency: 85 },
];

const flavorData = [
  { name: "Mango Tango", value: 3421, color: "#f97316" },
  { name: "Chocolate Dream", value: 2890, color: "#7c3aed" },
  { name: "Vanilla Bean", value: 2650, color: "#fbbf24" },
  { name: "Strawberry", value: 2100, color: "#ec4899" },
  { name: "Mint Chip", value: 1850, color: "#10b981" },
];

const salesData = [
  { region: "North", sales: 25000, growth: 12 },
  { region: "South", sales: 32000, growth: 18 },
  { region: "East", sales: 28000, growth: 8 },
  { region: "West", sales: 35000, growth: 22 },
];

const inventoryData = [
  { item: "Mango Tango", stock: 45, threshold: 50, status: "Low" },
  { item: "Chocolate Dream", stock: 120, threshold: 50, status: "Good" },
  { item: "Vanilla Bean", stock: 35, threshold: 50, status: "Critical" },
  { item: "Strawberry", stock: 85, threshold: 50, status: "Good" },
  { item: "Mint Chip", stock: 60, threshold: 50, status: "Good" },
];

const budgetData = [
  { month: "Jan", budget: 100000, spent: 85000 },
  { month: "Feb", budget: 100000, spent: 92000 },
  { month: "Mar", budget: 100000, spent: 78000 },
  { month: "Apr", budget: 100000, spent: 95000 },
  { month: "May", budget: 100000, spent: 102000 },
  { month: "Jun", budget: 100000, spent: 89100 },
];

export default function ChartsSection() {
  const chartData = [
    {
      title: "Revenue Trends",
      subtitle: "Monthly revenue performance",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-emerald-500 to-teal-600",
      bgColor:
        "from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/20 dark:to-teal-950/20",
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Factory Output",
      subtitle: "Production capacity utilization",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "from-blue-500 to-indigo-600",
      bgColor:
        "from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20",
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={factoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="factory" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar
              dataKey="output"
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
            >
              {factoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(${200 + index * 30}, 70%, 60%)`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Top Flavors",
      subtitle: "Customer preference analysis",
      icon: <PieChart className="w-5 h-5" />,
      color: "from-purple-500 to-pink-600",
      bgColor:
        "from-purple-50/80 to-pink-50/80 dark:from-purple-950/20 dark:to-pink-950/20",
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <RechartsPieChart>
            <Pie
              data={flavorData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {flavorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Regional Sales",
      subtitle: "Geographic performance analysis",
      icon: <MapPin className="w-5 h-5" />,
      color: "from-orange-500 to-red-600",
      bgColor:
        "from-orange-50/80 to-red-50/80 dark:from-orange-950/20 dark:to-red-950/20",
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={salesData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis dataKey="region" type="category" stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar
              dataKey="sales"
              fill="url(#salesGradient)"
              radius={[0, 4, 4, 0]}
            >
              {salesData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(${15 + index * 30}, 70%, 60%)`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Inventory Alerts",
      subtitle: "Stock level monitoring",
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "from-red-500 to-pink-600",
      bgColor:
        "from-red-50/80 to-pink-50/80 dark:from-red-950/20 dark:to-pink-950/20",
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="item"
              stroke="#6b7280"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar
              dataKey="stock"
              fill="url(#inventoryGradient)"
              radius={[4, 4, 0, 0]}
            >
              {inventoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.status === "Critical"
                      ? "#ef4444"
                      : entry.status === "Low"
                      ? "#f59e0b"
                      : "#10b981"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Budget Utilization",
      subtitle: "Financial performance tracking",
      icon: <Calendar className="w-5 h-5" />,
      color: "from-green-500 to-emerald-600",
      bgColor:
        "from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20",
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={budgetData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="budget"
              stroke="#6b7280"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="spent"
              stroke="#10b981"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-fr">
      {chartData.map((chart, index) => {
        // Pick background based on chart type/title for flavor/blue variants
        let bg =
          "bg-gradient-to-br from-pink-100/80 to-purple-100/80 dark:from-pink-900/30 dark:to-purple-900/30";
        if (
          chart.title.toLowerCase().includes("flavor") ||
          chart.title.toLowerCase().includes("regional")
        ) {
          bg =
            "bg-gradient-to-br from-blue-100/80 to-pink-100/80 dark:from-blue-900/30 dark:to-pink-900/30";
        }
        return (
          <div
            key={chart.title}
            className={`rounded-2xl ${bg} shadow-xl border border-pink-200/60 dark:border-pink-800/40 backdrop-blur-xl p-8 flex flex-col gap-4 animate-fade-in-scale`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <h2 className="text-xl font-bold text-pink-900 dark:text-pink-100 mb-2 flex items-center gap-2">
              {chart.icon}
              {chart.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {chart.subtitle}
            </p>
            <div className="h-64 w-full">{chart.chart}</div>
          </div>
        );
      })}
    </div>
  );
}
