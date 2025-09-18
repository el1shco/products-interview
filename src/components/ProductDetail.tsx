"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Ikonkalar
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Heart,
  Truck,
  Shield,
  Package,
  Info,
} from "lucide-react";

// Tipler
import { Product } from "@/types/products";

// Komponentler
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Helperler
import {
  formatPrice,
  calculateDiscountedPrice,
  formatRating,
  makeCapitalize,
} from "@/helpers/utils";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorited(favorites.includes(product.id));
    }
  }, [product.id]);

  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );
  const savings = product.price - discountedPrice;

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail];

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorited) {
      const updated = favorites.filter((id: number) => id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(updated));
    } else {
      const updated = [...favorites, product.id];
      localStorage.setItem('favorites', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link
          href="/products"
          className="flex items-center space-x-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <span>/</span>
        <span>{makeCapitalize(product.category)}</span>
        <span>-</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Mehsul sekli */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={productImages[selectedImageIndex]}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                -{Math.round(product.discountPercentage)}%
              </div>
            )}
          </div>

          {/* Navigation */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index
                      ? "border-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product haqinda */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {product.brand}
              </span>
              <span className="text-sm bg-secondary px-2 py-1 rounded">
                {makeCapitalize(product.category)}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

            {/* Reyting */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">
                  {formatRating(product.rating)}
                </span>
              </div>
              <span className="text-muted-foreground">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Qiymet */}
          <div className="space-y-2">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(discountedPrice)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="text-sm text-green-600 font-medium">
                You save {formatPrice(savings)} (
                {Math.round(product.discountPercentage)}% off)
              </p>
            )}
          </div>

          {/* Anbar statusu */}
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span
              className={`font-medium ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} items in stock`
                : "Out of stock"}
            </span>
          </div>

          {/* Say */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border rounded-md px-3 py-2 bg-background"
                  disabled={product.stock === 0}
                >
                  {Array.from(
                    { length: Math.min(product.stock, 10) },
                    (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* Sebete at */}
            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="flex-1"
                disabled={product.stock === 0}
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => toggleFavorite()}
                className={isFavorited ? "text-red-500 border-red-500" : ""}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Shipping</p>
                  <p className="text-xs text-muted-foreground">
                    {product.shippingInformation}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Warranty</p>
                  <p className="text-xs text-muted-foreground">
                    {product.warrantyInformation}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Return Policy</p>
                  <p className="text-xs text-muted-foreground">
                    {product.returnPolicy}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product melumatlari */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Brand:</span>
                <span className="ml-2 text-muted-foreground">
                  {product.brand}
                </span>
              </div>
              <div>
                <span className="font-medium">SKU:</span>
                <span className="ml-2 text-muted-foreground">
                  {product.sku}
                </span>
              </div>
              <div>
                <span className="font-medium">Weight:</span>
                <span className="ml-2 text-muted-foreground">
                  {product.weight}kg
                </span>
              </div>
              <div>
                <span className="font-medium">Availability:</span>
                <span className="ml-2 text-muted-foreground">
                  {product.availabilityStatus}
                </span>
              </div>
              {product.dimensions && (
                <div className="col-span-2">
                  <span className="font-medium">Dimensions:</span>
                  <span className="ml-2 text-muted-foreground">
                    {product.dimensions.width} × {product.dimensions.height} ×{" "}
                    {product.dimensions.depth} cm
                  </span>
                </div>
              )}
              <div className="col-span-2">
                <span className="font-medium">Minimum Order:</span>
                <span className="ml-2 text-muted-foreground">
                  {product.minimumOrderQuantity} units
                </span>
              </div>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="pt-4 border-t">
                <span className="font-medium text-sm mb-2 block">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revievlar */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.slice(0, 3).map((review, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {review.rating}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm font-medium">
                          {review.reviewerName}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toISOString().slice(0, 10)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                ))}
                {product.reviews.length > 3 && (
                  <div className="text-center">
                    <Button variant="outline" size="sm">
                      View All {product.reviews.length} Reviews
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No reviews yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
