import React from "react";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { FlavorDetailCard } from "@/components/presentational/FlavorDetailCard";
import { ReviewCard } from "@/components/presentational/ReviewCard";
import { SimilarFlavorCard } from "@/components/presentational/SimilarFlavorCard";
import { Button } from "@/components/ui/button";
import { useFlavorDetail, FlavorData } from "@/hooks/useFlavorDetail";

export interface FlavorDetailContainerProps {
  flavorData: FlavorData;
  className?: string;
}

export function FlavorDetailContainer({
  flavorData,
  className = "",
}: FlavorDetailContainerProps) {
  const {
    quantity,
    isFavorite,
    selectedSize,
    availableSizes,
    // Removed unused destructuring
    toggleFavorite,
    setSelectedSize,
    incrementQuantity,
    decrementQuantity,
    addToCart,
    shareFlavor,
  } = useFlavorDetail({ flavorData });

  const handleHelpful = (reviewId: number) => {
    console.log("Marked review as helpful:", reviewId);
  };

  const handleReply = (reviewId: number) => {
    console.log("Reply to review:", reviewId);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > quantity) {
      incrementQuantity();
    } else if (newQuantity < quantity) {
      decrementQuantity();
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-orange-950/20 dark:via-pink-950/20 dark:to-rose-950/20 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/patron/browse">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Flavor Details */}
          <div className="lg:col-span-2">
            <FlavorDetailCard
              flavor={flavorData}
              selectedSize={selectedSize}
              quantity={quantity}
              isFavorite={isFavorite}
              availableSizes={availableSizes}
              onSizeChange={setSelectedSize}
              onQuantityChange={handleQuantityChange}
              onToggleFavorite={toggleFavorite}
              onAddToCart={addToCart}
              onShare={shareFlavor}
            />
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">
                Reviews ({flavorData.reviews.length})
              </h2>
              <div className="space-y-4">
                {flavorData.reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onHelpful={handleHelpful}
                    onReply={handleReply}
                  />
                ))}
              </div>
            </div>

            {/* Similar Flavors */}
            <div>
              <h2 className="text-xl font-bold mb-4">Similar Flavors</h2>
              <div className="grid grid-cols-1 gap-3">
                {flavorData.similarFlavors.map((flavor) => (
                  <SimilarFlavorCard key={flavor.id} flavor={flavor} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
