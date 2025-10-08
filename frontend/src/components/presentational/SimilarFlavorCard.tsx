import React from "react";

import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

import { StarRating } from "./StarRating";

export interface SimilarFlavor {
  id: number;
  name: string;
  emoji: string;
  rating: number;
  price: string;
}

export interface SimilarFlavorCardProps {
  flavor: SimilarFlavor;
  className?: string;
}

export function SimilarFlavorCard({
  flavor,
  className = "",
}: SimilarFlavorCardProps) {
  return (
    <Link href={`/patron/browse/${flavor.id}`}>
      <Card
        className={`hover:shadow-md transition-shadow cursor-pointer ${className}`}
      >
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-3xl mb-2">{flavor.emoji}</div>
            <h3 className="font-medium mb-1">{flavor.name}</h3>
            <div className="flex items-center justify-center gap-1 mb-2">
              <StarRating rating={flavor.rating} size="sm" showValue />
            </div>
            <p className="text-sm font-medium text-blue-600">{flavor.price}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
