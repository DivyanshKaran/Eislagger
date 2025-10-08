import React from "react";

import { MessageCircle, ThumbsUp, CheckCircle } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FlavorReview } from "@/hooks/useFlavorDetail";

import { StarRating } from "./StarRating";

export interface ReviewCardProps {
  review: FlavorReview;
  onHelpful?: (reviewId: number) => void;
  onReply?: (reviewId: number) => void;
  className?: string;
}

export function ReviewCard({
  review,
  onHelpful,
  onReply,
  className = "",
}: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {review.avatar}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">{review.user}</span>
              {review.verified && (
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm text-gray-500">
                {formatDate(review.date)}
              </span>
            </div>

            <h4 className="font-medium mb-2">{review.title}</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              {review.content}
            </p>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onHelpful?.(review.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                Helpful ({review.helpful})
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply?.(review.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Reply
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
