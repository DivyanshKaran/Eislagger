"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFlavor } from "@/hooks/useFlavors";
import { Skeleton } from "@/components/ui/skeleton";
import type { Flavor } from "@/types/models";
import Image from "next/image";

export default function FlavorDetailPage({
  params,
}: {
  params: Promise<{ flavorId: string }>;
}) {
  const { flavorId } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState("regular");

  // Use the new hook for data fetching
  const { data: flavor, isLoading: loading, error } = useFlavor(flavorId);

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
    return size ? size.price : flavor?.price;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-rose-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-24 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20" />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-16" />
                  ))}
                </div>
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-rose-950/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Oops! Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400">{error?.message || 'An error occurred'}</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:from-orange-500 hover:to-pink-600"
            >
              Try Again
            </Button>
            <Link href="/patron/browse">
              <Button variant="outline">
                Back to Browse
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!flavor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-rose-950/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🍦</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Flavor Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The flavor you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/patron/browse">
            <Button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:from-orange-500 hover:to-pink-600">
              Back to Browse
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-rose-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/patron/browse">
            <Button
              variant="outline"
              className="bg-white dark:bg-gray-900 border-orange-200 dark:border-orange-900 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <Card className="bg-white dark:bg-gray-900 border border-orange-200/70 dark:border-orange-900/40 overflow-hidden">
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={flavor.images?.[0] ?? "/favicon.png"}
                  alt={flavor.name}
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </Card>
            {/* Flavor Header */}
            <Card className="bg-white dark:bg-gray-900 border border-orange-200/70 dark:border-orange-900/40">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          variant="outline"
                          className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900 text-orange-700 dark:text-orange-300"
                        >
                          {flavor.category}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Base: {flavor.category}
                        </span>
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {flavor.name}
                      </h1>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          {renderStars(5)}
                          <span className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
                            5.0
                          </span>
                        </div>
                        <span className="text-gray-600 dark:text-gray-300">
                          (10 reviews)
                        </span>
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
                          ? "text-red-500 border-red-200 dark:border-red-800"
                          : "text-gray-400 border-gray-200 dark:border-gray-800"
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
                  {flavor.description ?? "A delightful creation crafted with premium ingredients and balanced sweetness."}
                </p>

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Prep Time
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      5 min
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg">
                    <Users className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Calories
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {flavor.nutritionalInfo?.calories ?? "—"}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg">
                    <MapPin className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Available At
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      5 stores
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg">
                    <Award className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Rating
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      5.0/5
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card className="bg-white dark:bg-gray-900 border border-orange-200/70 dark:border-orange-900/40">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Base Flavor</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{flavor.category}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Sugar (per 100g)</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{flavor.nutritionalInfo?.sugar ?? "—"}g</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Price</p>
                    <p className="font-semibold text-gray-900 dark:text-white">€{Number(flavor.price).toFixed(2)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Available Factories</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{flavor.stock ?? "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients & Nutrition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-900 border border-orange-200/70 dark:border-orange-900/40">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    Ingredients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {flavor.ingredients?.map((ingredient: string, index: number) => (
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

              <Card className="bg-white dark:bg-gray-900 border border-orange-200/70 dark:border-orange-900/40">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    Nutrition Facts
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Per 100g
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        Calories
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {flavor.nutritionalInfo?.calories ?? "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        Fat
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {flavor.nutritionalInfo?.fat ?? "—"}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        Carbohydrates
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {/* {flavor.carbohydrates}g */}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        Protein
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {/* {flavor.protein}g */}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reviews */}
            <Card className="bg-white dark:bg-gray-900 border border-orange-200/70 dark:border-orange-900/40">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Customer Reviews
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {/* {flavor.reviews.length} reviews */}
                  5 reviews
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* {flavor.reviews.map((review) => ( */}
                {[].map((review: any) => (
                  <div
                    key={review.id}
                    className="border-b border-orange-100 dark:border-orange-900/30 pb-6 last:border-b-0"
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
            <Card className="bg-white dark:bg-gray-900 border border-orange-200/70 dark:border-orange-900/40 sticky top-6">
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
                          : "border-gray-200 dark:border-gray-800 hover:border-orange-300"
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
                <div className="border-t border-orange-100 dark:border-orange-900/30 pt-4">
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
                    {flavor.allergens?.map((allergen: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300"
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
