"use client";

import AppShell from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ShoppingCart,
  Bell,
  User,
  Star,
  Clock,
  MapPin,
  Gift,
  TrendingUp,
  Heart,
  Plus,
  Eye,
  FileText,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Calendar,
  Award,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

export default function PatronDashboard() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample data
  const favoriteFlavors = [
    {
      id: 1,
      name: "Mango Magic",
      emoji: "🥭",
      type: "Fruit",
      rating: 4.9,
      price: "₹120",
      image: "🍦",
    },
    {
      id: 2,
      name: "Chocolate Bomb",
      emoji: "🍫",
      type: "Chocolate",
      rating: 4.8,
      price: "₹150",
      image: "🍦",
    },
    {
      id: 3,
      name: "Rose Gelato",
      emoji: "🌹",
      type: "Floral",
      rating: 4.7,
      price: "₹180",
      image: "🍦",
    },
    {
      id: 4,
      name: "Blueberry Blast",
      emoji: "🫐",
      type: "Berry",
      rating: 4.6,
      price: "₹140",
      image: "🍦",
    },
    {
      id: 5,
      name: "Vanilla Dream",
      emoji: "🌿",
      type: "Classic",
      rating: 4.5,
      price: "₹100",
      image: "🍦",
    },
  ];

  const suggestions = [
    {
      id: 1,
      name: "Summer Berry Burst",
      emoji: "☀️",
      reason: "Based on your love for fruity flavors",
      rating: 4.8,
      price: "₹160",
      image: "🍦",
    },
    {
      id: 2,
      name: "Caramel Swirl",
      emoji: "🍯",
      reason: "Similar to your chocolate preferences",
      rating: 4.7,
      price: "₹140",
      image: "🍦",
    },
    {
      id: 3,
      name: "Mint Chocolate Chip",
      emoji: "🌿",
      reason: "Popular among chocolate lovers",
      rating: 4.6,
      price: "₹130",
      image: "🍦",
    },
  ];

  const recentOrders = [
    {
      id: "E345",
      date: "Jul 2, 2024",
      items: "Chocolate, Mango",
      total: "₹420",
      status: "Delivered",
      statusColor: "success",
    },
    {
      id: "E322",
      date: "Jun 28, 2024",
      items: "Vanilla, Blueberry",
      total: "₹300",
      status: "Delivered",
      statusColor: "success",
    },
    {
      id: "E301",
      date: "Jun 25, 2024",
      items: "Rose Gelato, Strawberry",
      total: "₹380",
      status: "Delivered",
      statusColor: "success",
    },
    {
      id: "E298",
      date: "Jun 22, 2024",
      items: "Chocolate Bomb, Mint",
      total: "₹450",
      status: "Delivered",
      statusColor: "success",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % Math.ceil(favoriteFlavors.length / 3)
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? Math.ceil(favoriteFlavors.length / 3) - 1 : prev - 1
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Preparing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Out for Delivery":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <AppShell role="patron">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome Back, Divyansh! 🍦
            </h1>
            <p className="text-muted-foreground">
              Craving something cold today? Let's find your perfect scoop!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Search Flavors
            </Button>
            <Button className="bg-gradient-to-r from-eis-warm to-eis-cool hover:from-eis-warm/90 hover:to-eis-cool/90">
              <ShoppingCart className="mr-2 h-4 w-4" />
              View Cart (3)
            </Button>
          </div>
        </div>

        {/* Top Row Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Welcome Card */}
          <Card className="bg-gradient-to-br from-eis-primary/10 to-eis-secondary/10 border-eis-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-eis-primary/20 to-eis-secondary/20 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-eis-primary to-eis-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  D
                </div>
                <div>
                  <CardTitle className="text-foreground">
                    Hey, Divyansh!
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Craving something cold today?
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Nearest store: Sweet Dreams Creamery (0.8km)</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Open Now
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Closes at 10 PM
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Reward Points Card */}
          <Card className="bg-gradient-to-br from-eis-warm/10 to-eis-cool/10 border-eis-warm/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-eis-warm/20 to-eis-cool/20 rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Gift className="h-5 w-5 text-eis-warm" />
                  Reward Points
                </CardTitle>
                <Sparkles className="h-5 w-5 text-eis-warm" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-foreground mb-2">
                2,450
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                +150 points this month
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next reward:</span>
                  <span className="font-medium">Free scoop at 3,000 pts</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-eis-warm to-eis-cool h-2 rounded-full"
                    style={{ width: "82%" }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Order Card */}
          <Card className="bg-gradient-to-br from-eis-accent/10 to-eis-primary/10 border-eis-accent/20">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Truck className="h-5 w-5 text-eis-accent" />
                Live Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Order #E356
                  </span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    <Clock className="h-3 w-3 mr-1" />
                    Preparing
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Chocolate Bomb, Mango Magic
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Est. delivery:</span>
                  <span className="font-medium">15-20 minutes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-eis-accent to-eis-primary h-2 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Favorite Flavors Carousel */}
        <Card className="bg-gradient-to-br from-eis-secondary/5 to-eis-accent/5 border-eis-secondary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-eis-secondary" />
                  Your Favorite Flavors
                </CardTitle>
                <CardDescription>Flavors you love the most</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {favoriteFlavors.map((flavor) => (
                <div
                  key={flavor.id}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="text-4xl mb-3 text-center">
                    {flavor.emoji}
                  </div>
                  <h3 className="font-semibold text-foreground text-center mb-1">
                    {flavor.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">
                      {flavor.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {flavor.type}
                    </Badge>
                    <span className="font-semibold text-foreground">
                      {flavor.price}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-3 bg-gradient-to-r from-eis-secondary to-eis-accent hover:from-eis-secondary/90 hover:to-eis-accent/90"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Purchase Trend and Suggestions */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Purchase Trend Chart */}
          <Card className="bg-gradient-to-br from-eis-primary/5 to-eis-secondary/5 border-eis-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-eis-primary" />
                Your Purchase Trend
              </CardTitle>
              <CardDescription>
                Your ice cream consumption pattern
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">24</div>
                    <div className="text-sm text-muted-foreground">
                      Scoops this month
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600 font-medium">
                      +12%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      vs last month
                    </div>
                  </div>
                </div>

                {/* Simple Chart */}
                <div className="h-32 flex items-end justify-between gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, index) => (
                      <div
                        key={day}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className="w-8 bg-gradient-to-t from-eis-primary to-eis-secondary rounded-t-sm"
                          style={{ height: `${Math.random() * 60 + 20}%` }}
                        ></div>
                        <span className="text-xs text-muted-foreground">
                          {day}
                        </span>
                      </div>
                    )
                  )}
                </div>

                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Most active on weekends
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions Panel */}
          <Card className="bg-gradient-to-br from-eis-warm/5 to-eis-cool/5 border-eis-warm/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-eis-warm" />
                Personalized Suggestions
              </CardTitle>
              <CardDescription>Flavors we think you'll love</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-border/50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="text-3xl">{suggestion.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">
                          {suggestion.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            {suggestion.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {suggestion.reason}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">
                          {suggestion.price}
                        </span>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-eis-warm to-eis-cool hover:from-eis-warm/90 hover:to-eis-cool/90"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="bg-gradient-to-br from-eis-accent/5 to-eis-primary/5 border-eis-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-eis-accent" />
              Recent Orders
            </CardTitle>
            <CardDescription>Your recent ice cream adventures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-border/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-eis-accent to-eis-primary rounded-lg flex items-center justify-center text-white font-bold">
                      {order.id.slice(-2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">
                          #{order.id}
                        </span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.items}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {order.total}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
