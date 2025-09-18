import Image from "next/image";
import Link from "next/link";

// Ikonkalar
import { Star, ShoppingCart } from "lucide-react";

// Tipler
import { Product } from "@/types/products";

// Komponentler
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Helperler
import {
  formatPrice,
  calculateDiscountedPrice,
  formatRating,
  makeCapitalize,
} from "@/helpers/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] h-full flex flex-col justify-between">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              -{Math.round(product.discountPercentage)}%
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
            {makeCapitalize(product.category)}
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>

        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {formatRating(product.rating)}
            </span>
            <span className="text-muted-foreground text-xs">
              ({product.reviews?.length || 0})
            </span>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-2">
              {product.discountPercentage > 0 && (
                <span className="text-muted-foreground text-sm line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="font-bold text-lg text-primary">
                {formatPrice(discountedPrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Brand: {product.brand || "N/A"}</span>
          <span
            className={product.stock > 0 ? "text-green-600" : "text-red-600"}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex space-x-2 w-full">
          <Button asChild className="flex-1">
            <Link href={`/products/${product.id}`}>View Details</Link>
          </Button>
          <Button variant="outline" size="icon" disabled={product.stock === 0}>
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
