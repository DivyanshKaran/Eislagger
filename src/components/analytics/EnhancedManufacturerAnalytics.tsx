"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Factory,
  Package,
  Truck,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Clock,
  Thermometer,
  Gauge,
  Zap,
  Shield,
  Users,
  Calendar,
  MapPin,
  Star,
  Layers,
  Cpu,
  Database,
  Wifi,
  Battery,
  Volume2,
  Lightbulb,
  Droplets,
  Wind,
  Leaf,
  BarChart,
  ScatterChart,
  Radar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  ScatterChart as RechartsScatterChart,
  Scatter,
  ComposedChart,
  FunnelChart,
  Funnel,
  Cell as FunnelCell,
} from "recharts";

// Enhanced data for advanced analytics
const productionEfficiencyData = [
  { month: "Jan", efficiency: 85, quality: 92, energy: 78, waste: 3.2 },
  { month: "Feb", efficiency: 88, quality: 94, energy: 82, waste: 2.8 },
  { month: "Mar", efficiency: 92, quality: 96, energy: 85, waste: 2.1 },
  { month: "Apr", efficiency: 89, quality: 93, energy: 80, waste: 2.9 },
  { month: "May", efficiency: 94, quality: 97, energy: 88, waste: 1.8 },
  { month: "Jun", efficiency: 96, quality: 98, energy: 91, waste: 1.4 },
];

const factoryComparisonData = [
  {
    factory: "Factory A",
    production: 4200,
    efficiency: 96,
    quality: 98,
    energy: 92,
    cost: 85,
  },
  {
    factory: "Factory B",
    production: 3800,
    efficiency: 92,
    quality: 95,
    energy: 88,
    cost: 82,
  },
  {
    factory: "Factory C",
    production: 4450,
    efficiency: 98,
    quality: 99,
    energy: 95,
    cost: 90,
  },
  {
    factory: "Factory D",
    production: 3200,
    efficiency: 88,
    quality: 92,
    energy: 82,
    cost: 78,
  },
];

const qualityTrendData = [
  {
    week: "W1",
    temperature: 98.5,
    humidity: 92.3,
    consistency: 96.8,
    packaging: 99.1,
    hygiene: 100,
  },
  {
    week: "W2",
    temperature: 99.1,
    humidity: 93.7,
    consistency: 97.2,
    packaging: 99.3,
    hygiene: 100,
  },
  {
    week: "W3",
    temperature: 98.8,
    humidity: 94.1,
    consistency: 97.8,
    packaging: 99.5,
    hygiene: 100,
  },
  {
    week: "W4",
    temperature: 99.3,
    humidity: 95.2,
    consistency: 98.1,
    packaging: 99.7,
    hygiene: 100,
  },
];

const energyConsumptionData = [
  { hour: "00:00", energy: 65, temperature: 4.0, efficiency: 85, cost: 45 },
  { hour: "04:00", energy: 45, temperature: 3.8, efficiency: 90, cost: 32 },
  { hour: "08:00", energy: 85, temperature: 4.2, efficiency: 88, cost: 58 },
  { hour: "12:00", energy: 95, temperature: 4.5, efficiency: 92, cost: 68 },
  { hour: "16:00", energy: 88, temperature: 4.3, efficiency: 89, cost: 62 },
  { hour: "20:00", energy: 75, temperature: 4.1, efficiency: 87, cost: 52 },
];

const productPerformanceData = [
  { name: "Vanilla Base", sales: 35, profit: 28, quality: 96, growth: 12 },
  { name: "Chocolate Mix", sales: 28, profit: 32, quality: 94, growth: 8 },
  { name: "Strawberry", sales: 18, profit: 22, quality: 98, growth: 15 },
  { name: "Mint Extract", sales: 12, profit: 15, quality: 92, growth: 5 },
  { name: "Caramel", sales: 7, profit: 12, quality: 95, growth: 20 },
];

const environmentalImpactData = [
  { metric: "Energy Efficiency", value: 94.2, target: 90, impact: "positive" },
  { metric: "Water Usage", value: 85.7, target: 80, impact: "positive" },
  { metric: "Waste Reduction", value: 92.8, target: 85, impact: "positive" },
  { metric: "Carbon Footprint", value: 78.3, target: 75, impact: "positive" },
  { metric: "Recycling Rate", value: 96.5, target: 90, impact: "positive" },
];

const supplyChainData = [
  { stage: "Raw Materials", efficiency: 95, cost: 85, time: 92, quality: 98 },
  { stage: "Production", efficiency: 96, cost: 88, time: 94, quality: 97 },
  { stage: "Quality Control", efficiency: 98, cost: 92, time: 96, quality: 99 },
  { stage: "Packaging", efficiency: 94, cost: 90, time: 93, quality: 96 },
  { stage: "Distribution", efficiency: 92, cost: 87, time: 91, quality: 95 },
];

export default function EnhancedManufacturerAnalytics() {
  const [selectedMetric, setSelectedMetric] = useState("efficiency");

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case "efficiency":
        return "from-blue-500 to-blue-600";
      case "quality":
        return "from-green-500 to-green-600";
      case "energy":
        return "from-yellow-500 to-yellow-600";
      case "waste":
        return "from-red-500 to-red-600";
      default:
        return "from-blue-500 to-blue-600";
    }
  };

  const getImpactColor = (impact: string) => {
    return impact === "positive"
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };

  return (
    <div className="space-y-8">
      {/* Advanced Production Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Production Efficiency Radar Chart */}
        <Card className="glass-effect border-blue-300/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                <Radar className="w-5 h-5 text-white" />
              </div>
              Production Efficiency Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={factoryComparisonData}>
                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                <PolarAngleAxis dataKey="factory" tick={{ fill: "#e2e8f0" }} />
                <PolarRadiusAxis tick={{ fill: "#e2e8f0" }} />
                <RechartsRadar
                  name="Efficiency"
                  dataKey="efficiency"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
                <RechartsRadar
                  name="Quality"
                  dataKey="quality"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 58, 138, 0.95)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "12px",
                    color: "white",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quality Metrics Trend */}
        <Card className="glass-effect border-blue-300/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                <Shield className="w-5 h-5 text-white" />
              </div>
              Quality Metrics Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={qualityTrendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="week" stroke="#e2e8f0" />
                <YAxis stroke="#e2e8f0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 58, 138, 0.95)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "12px",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  name="Temperature Control"
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  name="Humidity Levels"
                />
                <Line
                  type="monotone"
                  dataKey="consistency"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                  name="Batch Consistency"
                />
                <Line
                  type="monotone"
                  dataKey="packaging"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                  name="Packaging Quality"
                />
                <Line
                  type="monotone"
                  dataKey="hygiene"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                  name="Hygiene Standards"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Energy and Cost Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Energy Consumption Analysis */}
        <Card className="glass-effect border-blue-300/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
                <Zap className="w-5 h-5 text-white" />
              </div>
              Energy & Cost Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={energyConsumptionData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="hour" stroke="#e2e8f0" />
                <YAxis stroke="#e2e8f0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 58, 138, 0.95)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "12px",
                    color: "white",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="energy"
                  stroke="#fbbf24"
                  fill="#fbbf24"
                  fillOpacity={0.3}
                  name="Energy Usage (%)"
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                  name="Cost ($)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Performance Funnel */}
        <Card className="glass-effect border-blue-300/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600">
                <BarChart className="w-5 h-5 text-white" />
              </div>
              Product Performance Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <FunnelChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 58, 138, 0.95)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "12px",
                    color: "white",
                  }}
                />
                <Funnel
                  dataKey="sales"
                  data={productPerformanceData}
                  isAnimationActive
                >
                  {productPerformanceData.map((entry, index) => (
                    <FunnelCell
                      key={`cell-${index}`}
                      fill={`hsl(${200 + index * 30}, 70%, 60%)`}
                    />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {productPerformanceData.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white/10 rounded-lg"
                >
                  <span className="text-white font-medium">{product.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-blue-200">{product.sales}%</span>
                    <span className="text-green-400">+{product.growth}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supply Chain and Environmental Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Supply Chain Efficiency */}
        <Card className="glass-effect border-blue-300/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600">
                <Layers className="w-5 h-5 text-white" />
              </div>
              Supply Chain Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={supplyChainData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="stage" stroke="#e2e8f0" />
                <YAxis stroke="#e2e8f0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 58, 138, 0.95)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "12px",
                    color: "white",
                  }}
                />
                <Bar
                  dataKey="efficiency"
                  fill="#3b82f6"
                  name="Efficiency (%)"
                />
                <Bar dataKey="quality" fill="#10b981" name="Quality (%)" />
                <Bar dataKey="time" fill="#f59e0b" name="Time (%)" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Environmental Impact Metrics */}
        <Card className="glass-effect border-blue-300/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {environmentalImpactData.map((metric, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-white">
                      {metric.metric}
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">
                        {metric.value}
                      </span>
                      <span className="text-blue-200 ml-1">%</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(
                          (metric.value / metric.target) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-blue-200">
                      Target: {metric.target}%
                    </span>
                    <Badge className={getImpactColor(metric.impact)}>
                      {metric.impact === "positive"
                        ? "✓ Positive"
                        : "⚠️ Negative"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Monitoring Dashboard */}
      <Card className="glass-effect border-blue-300/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Real-time Production Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {factoryComparisonData.map((factory, index) => (
              <div
                key={index}
                className="p-6 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">{factory.factory}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Online</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Production:</span>
                    <span className="font-medium text-white">
                      {factory.production}L
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Efficiency:</span>
                    <span className="font-medium text-white">
                      {factory.efficiency}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Quality:</span>
                    <span className="font-medium text-white">
                      {factory.quality}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Energy:</span>
                    <span className="font-medium text-white">
                      {factory.energy}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                      style={{ width: `${factory.efficiency}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
