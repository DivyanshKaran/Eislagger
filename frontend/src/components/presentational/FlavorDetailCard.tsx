import React from "react";

import {
  Heart,
  ShoppingCart,
  MapPin,
  Clock,
  Users,
  Award,
  Share2,
  MessageCircle,
  ThumbsUp,
  CheckCircle,
  Plus,
  Minus,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlavorData, FlavorSize } from "@/hooks/useFlavorDetail";

import { StarRating } from "./StarRating";

export interface FlavorDetailCardProps {
  flavor: FlavorData;
  selectedSize: string;
  quantity: number;
  isFavorite: boolean;
  availableSizes: FlavorSize[];
  onSizeChange: (sizeId: string) => void;
  onQuantityChange: (quantity: number) => void;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
  onShare: () => void;
  className?: string;
}

export function FlavorDetailCard({
  flavor,
  selectedSize,
  quantity,
  isFavorite,
  availableSizes,
  onSizeChange,
  onQuantityChange,
  onToggleFavorite,
  onAddToCart,
  onShare,
  className = "",
}: FlavorDetailCardProps) {
  const selectedSizeData = availableSizes.find((s) => s.id === selectedSize);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="text-6xl animate-float">{flavor.emoji}</div>
            <div>
              <CardTitle className="text-2xl mb-2">{flavor.name}</CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={flavor.rating} showValue />
                <span className="text-sm text-gray-500">
                  ({flavor.reviewCount} reviews)
                </span>
              </div>
              <Badge variant="secondary" className="mb-2">
                {flavor.category}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleFavorite}
              className={isFavorite ? "text-red-500" : "text-gray-400"}
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
              />
            </Button>
            <Button variant="ghost" size="icon" onClick={onShare}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {flavor.description}
          </p>
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="font-semibold mb-2">Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {flavor.ingredients.map((ingredient, index) => (
              <Badge key={index} variant="outline">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>

        {/* Nutrition */}
        <div>
          <h3 className="font-semibold mb-2">Nutrition (per serving)</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span>Calories:</span>
              <span className="font-medium">{flavor.nutrition.calories}</span>
            </div>
            <div className="flex justify-between">
              <span>Fat:</span>
              <span className="font-medium">{flavor.nutrition.fat}g</span>
            </div>
            <div className="flex justify-between">
              <span>Protein:</span>
              <span className="font-medium">{flavor.nutrition.protein}g</span>
            </div>
            <div className="flex justify-between">
              <span>Carbs:</span>
              <span className="font-medium">{flavor.nutrition.carbs}g</span>
            </div>
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <h3 className="font-semibold mb-3">Size</h3>
          <div className="grid grid-cols-1 gap-2">
            {availableSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => onSizeChange(size.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedSize === size.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{size.name}</div>
                    <div className="text-sm text-gray-500">
                      {size.description}
                    </div>
                  </div>
                  <div className="font-semibold">{size.price}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Quantity</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onQuantityChange(Math.max(quantity - 1, 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onQuantityChange(Math.min(quantity + 1, 10))}
                disabled={quantity >= 10}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            onClick={onAddToCart}
            className="w-full h-12 text-lg"
            disabled={!flavor.availability.inStock}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {flavor.availability.inStock
              ? `Add to Cart - ${selectedSizeData?.price || flavor.price}`
              : "Out of Stock"}
          </Button>
        </div>

        {/* Availability */}
        <div>
          <h3 className="font-semibold mb-2">Availability</h3>
          <div className="flex items-center gap-2">
            {flavor.availability.inStock ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-600">In Stock</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-orange-600">Out of Stock</span>
              </>
            )}
          </div>
          {flavor.availability.stores.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-3 h-3" />
                Available at {flavor.availability.stores.length} stores
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
