"use client";

import { useCallback, useState } from "react";

// Komponentler
import { ProductFilters } from "@/components/ProductFilter";
import { ProductsList } from "@/components/ProductList";

// Tipler
import { ProductFilters as ProductFiltersType } from "@/types/products";

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFiltersType>({});

  const handleFiltersChange = useCallback((newFilters: ProductFiltersType) => {
    setFilters(newFilters);
  }, []);

  console.log('Current Filters:', filters);
  

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/*Filter */}
        <div className="lg:col-span-1">
          <ProductFilters onFiltersChange={handleFiltersChange} />
        </div>

        {/* List */}
        <div className="lg:col-span-3">
          <ProductsList filters={filters} />
        </div>
      </div>
    </div>
  );
}
