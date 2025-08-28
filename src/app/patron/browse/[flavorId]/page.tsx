"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart,
  Star,
  ShoppingCart,
  MapPin,
  Clock,
  Users,
  Award,
  ArrowLeft,
  Share2,
  MessageCircle,
  ThumbsUp,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

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

// Mock data for individual flavor
const flavorData = {
  id: 1,
  name: "Mango Tango",
  emoji: "🥭",
  category: "fruity",
  description:
    "Experience the perfect harmony of tropical sweetness and tangy zest with our signature Mango Tango ice cream. This artisanal creation features hand-picked Alphonso mangoes from the sun-kissed orchards of Maharashtra, blended with a secret recipe that has been perfected over generations. The velvety smooth texture melts in your mouth, revealing layers of complex flavors that dance between sweet and tangy notes. Each scoop is a journey through the tropics, with hints of citrus and a subtle creaminess that makes this flavor truly unforgettable. Perfect for those who appreciate the authentic taste of fresh mangoes, this premium ice cream is made with real fruit puree and no artificial flavors or colors. The Mango Tango is not just an ice cream flavor – it's a celebration of nature's most delicious gift, crafted with love and served with a smile.",
  shortDescription: "Tropical mango with a tangy twist",
  price: "€8.50",
  rating: 4.9,
  reviewCount: 127,
  isFavorite: true,
  isPremium: false,
  isSeasonal: false,
  allergens: ["Dairy", "Mango"],
  calories: 180,
  preparationTime: "5 min",
  availableAt: ["Berlin Central", "Mumbai Downtown", "Pune HQ"],
  tags: ["Tropical", "Fruity", "Fresh", "Natural", "Creamy", "Tangy"],
  ingredients: [
    "Fresh Alphonso Mango Puree",
    "Organic Whole Milk",
    "Heavy Cream",
    "Cane Sugar",
    "Natural Vanilla Extract",
    "Citrus Zest",
    "Sea Salt",
  ],
  nutritionInfo: {
    servingSize: "100g",
    calories: 180,
    fat: 12,
    saturatedFat: 7,
    carbohydrates: 18,
    sugar: 15,
    protein: 3,
    fiber: 1,
  },
  reviews: [
    {
      id: 1,
      user: "Sarah M.",
      rating: 5,
      date: "2024-01-15",
      title: "Absolutely Amazing!",
      content:
        "This mango flavor is incredible! Perfect balance of sweetness and tanginess. The texture is smooth and creamy. Will definitely order again!",
      helpful: 12,
      verified: true,
      avatar: "SM",
    },
    {
      id: 2,
      user: "Michael K.",
      rating: 4,
      date: "2024-01-14",
      title: "Great Tropical Flavor",
      content:
        "Very authentic mango taste. The tangy notes really make it special. A bit pricey but worth it for the quality.",
      helpful: 8,
      verified: true,
      avatar: "MK",
    },
    {
      id: 3,
      user: "Emma L.",
      rating: 5,
      date: "2024-01-13",
      title: "Perfect Summer Treat",
      content:
        "This is exactly what I was looking for! The mango flavor is so fresh and natural. Love the creamy texture.",
      helpful: 15,
      verified: true,
      avatar: "EL",
    },
    {
      id: 4,
      user: "David R.",
      rating: 4,
      date: "2024-01-12",
      title: "Delicious but Sweet",
      content:
        "Great mango flavor, very authentic. A bit too sweet for my taste, but the quality is excellent.",
      helpful: 6,
      verified: true,
      avatar: "DR",
    },
    {
      id: 5,
      user: "Lisa P.",
      rating: 5,
      date: "2024-01-11",
      title: "Best Mango Ice Cream Ever!",
      content:
        "I've tried many mango ice creams, but this one is by far the best. The texture is perfect and the flavor is amazing.",
      helpful: 20,
      verified: true,
      avatar: "LP",
    },
  ],
  similarFlavors: [
    {
      id: 2,
      name: "Chocolate Dream",
      emoji: "🍫",
      rating: 4.8,
      price: "€9.00",
    },
    { id: 3, name: "Vanilla Bean", emoji: "🌿", rating: 4.7, price: "€7.50" },
    {
      id: 4,
      name: "Strawberry Delight",
      emoji: "🍓",
      rating: 4.6,
      price: "€8.00",
    },
  ],
};

export default function FlavorDetailPage({
  params,
}: {
  params: Promise<{ flavorId: string }>;
}) {
  // Unwrap the params Promise using React.use()
  const { flavorId } = use(params);

  // Use flavorId to potentially fetch different flavor data
  console.log("Flavor ID:", flavorId);

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(flavorData.isFavorite);
  const [selectedSize, setSelectedSize] = useState("regular");

  const sizes = [
    {
      id: "small",
      name: "Small",
      price: "€6.50",
      description: "Perfect for a quick treat",
    },
    {
      id: "regular",
      name: "Regular",
      price: "€8.50",
      description: "Our most popular size",
    },
    {
      id: "large",
      name: "Large",
      price: "€10.50",
      description: "For serious ice cream lovers",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const getCurrentPrice = () => {
    const size = sizes.find((s) => s.id === selectedSize);
    return size ? size.price : flavorData.price;
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
        {/* Back Button */}
        <div className="mb-6 animate-slide-in-up">
          <Link href="/patron/browse">
            <Button
              variant="outline"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flavor Header */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 animate-fade-in-scale">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-4xl">{flavorData.emoji}</span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {flavorData.name}
                      </h1>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          {renderStars(flavorData.rating)}
                          <span className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
                            {flavorData.rating}
                          </span>
                        </div>
                        <span className="text-gray-600 dark:text-gray-300">
                          ({flavorData.reviewCount} reviews)
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300"
                        >
                          {flavorData.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleFavorite}
                      className={`${
                        isFavorite
                          ? "text-red-500 border-red-200 dark:border-red-700"
                          : "text-gray-400 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isFavorite ? "fill-current" : ""
                        }`}
                      />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {flavorData.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {flavorData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Prep Time
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {flavorData.preparationTime}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg">
                    <Users className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Calories
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {flavorData.calories}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg">
                    <MapPin className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Available At
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {flavorData.availableAt.length} stores
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg">
                    <Award className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Rating
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {flavorData.rating}/5
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients & Nutrition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 animate-fade-in-scale">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    Ingredients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {flavorData.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {ingredient}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 animate-fade-in-scale">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    Nutrition Facts
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Per {flavorData.nutritionInfo.servingSize}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        Calories
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {flavorData.nutritionInfo.calories}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        Fat
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {flavorData.nutritionInfo.fat}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        Carbohydrates
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {flavorData.nutritionInfo.carbohydrates}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        Protein
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {flavorData.nutritionInfo.protein}g
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reviews */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 animate-fade-in-scale">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Customer Reviews
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {flavorData.reviews.length} reviews
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {flavorData.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-orange-100 dark:border-orange-800/30 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30">
                        <AvatarFallback className="text-sm font-medium">
                          {review.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {review.user}
                          </h4>
                          {review.verified && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {review.date}
                          </span>
                        </div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                          {review.title}
                        </h5>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {review.content}
                        </p>
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
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 animate-fade-in-scale sticky top-6">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Order Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Size Selection */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Choose Size
                  </h4>
                  {sizes.map((size) => (
                    <div
                      key={size.id}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedSize === size.id
                          ? "border-orange-400 bg-orange-50 dark:bg-orange-950/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-orange-300"
                      }`}
                      onClick={() => setSelectedSize(size.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {size.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {size.description}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {size.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quantity */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Quantity
                  </h4>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 p-0"
                    >
                      -
                    </Button>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white w-8 text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-orange-100 dark:border-orange-800/30 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getCurrentPrice()}
                    </span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white py-3">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>

                {/* Allergens */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Allergens
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {flavorData.allergens.map((allergen, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300"
                      >
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
