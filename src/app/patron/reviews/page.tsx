"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Star,
  ThumbsUp,
  MessageCircle,
  Edit,
  Trash2,
  Filter,
  Calendar,
  MapPin,
  Award,
  Heart,
  Share2,
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

// Mock data for reviews page
const userReviews = [
  {
    id: 1,
    flavor: "Mango Tango",
    emoji: "🥭",
    store: "EisLager Berlin Central",
    rating: 5,
    title: "Absolutely Amazing!",
    content:
      "This mango flavor is incredible! Perfect balance of sweetness and tanginess. The texture is smooth and creamy. Will definitely order again!",
    date: "2024-01-15",
    helpful: 12,
    comments: 3,
    isVerified: true,
    orderDetails: "Order #1234 • 2 scoops",
    tags: ["Great Taste", "Good Value", "Fast Service"],
  },
  {
    id: 2,
    flavor: "Chocolate Dream",
    emoji: "🍫",
    store: "EisLager Mumbai Downtown",
    rating: 4,
    title: "Rich and Decadent",
    content:
      "Very rich chocolate flavor with nice cocoa nibs. A bit too sweet for my taste, but the quality is excellent. The premium price is justified.",
    date: "2024-01-14",
    helpful: 8,
    comments: 1,
    isVerified: true,
    orderDetails: "Order #1235 • 1 scoop",
    tags: ["Premium Quality", "Rich Flavor"],
  },
  {
    id: 3,
    flavor: "Vanilla Bean",
    emoji: "🌿",
    store: "EisLager Pune HQ",
    rating: 5,
    title: "Classic Perfection",
    content:
      "Perfect vanilla ice cream! You can see the real vanilla bean specks. Not too sweet, just right. This is how vanilla should taste.",
    date: "2024-01-13",
    helpful: 15,
    comments: 2,
    isVerified: true,
    orderDetails: "Order #1236 • 3 scoops",
    tags: ["Classic", "Perfect Balance", "Real Ingredients"],
  },
  {
    id: 4,
    flavor: "Strawberry Delight",
    emoji: "🍓",
    store: "EisLager Berlin Central",
    rating: 3,
    title: "Good but Could Be Better",
    content:
      "The strawberry flavor is nice but a bit artificial tasting. The texture is good though. Would prefer more natural strawberry taste.",
    date: "2024-01-12",
    helpful: 5,
    comments: 0,
    isVerified: true,
    orderDetails: "Order #1237 • 1 scoop",
    tags: ["Good Texture", "Artificial Taste"],
  },
  {
    id: 5,
    flavor: "Espresso Shot",
    emoji: "☕",
    store: "EisLager Mumbai Downtown",
    rating: 5,
    title: "Coffee Lover's Dream",
    content:
      "Perfect for coffee lovers! Strong coffee flavor with chocolate chips. Not too sweet, just the right amount of bitterness. Amazing!",
    date: "2024-01-11",
    helpful: 20,
    comments: 4,
    isVerified: true,
    orderDetails: "Order #1238 • 2 scoops",
    tags: ["Coffee Flavor", "Perfect Balance", "Chocolate Chips"],
  },
];

const reviewStats = {
  totalReviews: 23,
  averageRating: 4.4,
  ratingBreakdown: {
    5: 12,
    4: 7,
    3: 3,
    2: 1,
    1: 0,
  },
  recentReviews: 5,
  helpfulReviews: 18,
};

const filters = [
  { id: "all", label: "All Reviews" },
  { id: "5-star", label: "5 Stars" },
  { id: "4-star", label: "4 Stars" },
  { id: "3-star", label: "3 Stars" },
  { id: "verified", label: "Verified Orders" },
  { id: "recent", label: "Recent" },
];

export default function PatronReviewsPage() {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredReviews = userReviews.filter((review) => {
    const matchesSearch =
      review.flavor.toLowerCase().includes(search.toLowerCase()) ||
      review.title.toLowerCase().includes(search.toLowerCase()) ||
      review.content.toLowerCase().includes(search.toLowerCase()) ||
      review.store.toLowerCase().includes(search.toLowerCase());

    let matchesFilter = true;
    if (selectedFilter === "5-star") matchesFilter = review.rating === 5;
    else if (selectedFilter === "4-star") matchesFilter = review.rating === 4;
    else if (selectedFilter === "3-star") matchesFilter = review.rating === 3;
    else if (selectedFilter === "verified") matchesFilter = review.isVerified;
    else if (selectedFilter === "recent") {
      const reviewDate = new Date(review.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesFilter = reviewDate >= weekAgo;
    }

    return matchesSearch && matchesFilter;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "helpful") {
      return b.helpful - a.helpful;
    }
    return 0;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600 dark:text-green-400";
    if (rating >= 3) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
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
            My Reviews
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Share your thoughts and experiences with our flavors
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
                    {reviewStats.totalReviews}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Total Reviews
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {reviewStats.averageRating}
                  </div>
                  <div className="flex justify-center mb-2">
                    {renderStars(Math.round(reviewStats.averageRating))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Average Rating
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {reviewStats.recentReviews}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">This Month</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {reviewStats.helpfulReviews}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Helpful Votes
                  </p>
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
                placeholder="Search reviews..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 focus:border-orange-400 dark:focus:border-orange-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-orange-200 dark:border-orange-700 rounded-md focus:border-orange-400 dark:focus:border-orange-500"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
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

        {/* Reviews List */}
        <div className="space-y-6">
          {sortedReviews.map((review, index) => (
            <Card
              key={review.id}
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-900/20 animate-fade-in-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30">
                      <AvatarFallback className="text-2xl">
                        {review.emoji}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {review.flavor}
                        </h3>
                        {review.isVerified && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <Award className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span>{review.store}</span>
                        <span>•</span>
                        <Calendar className="w-4 h-4" />
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span
                    className={`font-semibold ${getRatingColor(review.rating)}`}
                  >
                    {review.rating}/5
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {review.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {review.content}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {review.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-orange-100 dark:border-orange-800/30">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-orange-600 dark:hover:text-orange-400"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-orange-600 dark:hover:text-orange-400"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Comments ({review.comments})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-orange-600 dark:hover:text-orange-400"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {review.orderDetails}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedReviews.length === 0 && (
          <div className="text-center py-12 animate-fade-in-scale">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start reviewing your favorite flavors!
            </p>
            <Button className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white">
              Write a Review
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
