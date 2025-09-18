"use client";

import { useEffect, useMemo, useState } from "react";

// Ikonkalar
import { Search, Filter, X } from "lucide-react";

// Nuqs
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";

// Komponentler
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// Helperler
import { fetcher } from "@/helpers/fetcher";
import { debounce, makeCapitalize } from "@/helpers/utils";

interface ProductFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    category: parseAsString.withDefault(""),
    minPrice: parseAsInteger.withDefault(0),
    maxPrice: parseAsInteger.withDefault(2000),
  });

  // Debounced search function
  const debouncedOnFiltersChange = useMemo(
    () => debounce(onFiltersChange, 500),
    [onFiltersChange]
  );
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetcher.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const activeFilters = {
      search: filters.search || undefined,
      category: filters.category || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice < 2000 ? filters.maxPrice : undefined,
    };

    debouncedOnFiltersChange(activeFilters);
  }, [filters, debouncedOnFiltersChange]);

  const handleSearchChange = (value: string) => {
    setFilters({ search: value || null });
  };

  const handleCategoryChange = (value: string) => {
    setFilters({ category: value === "all" ? null : value });
  };

  const handlePriceRangeChange = (value: number[]) => {
    setFilters({
      minPrice: value[0] || null,
      maxPrice: value[1] < 2000 ? value[1] : null,
    });
  };

  const clearFilters = () => {
    setFilters({
      search: null,
      category: null,
      minPrice: null,
      maxPrice: null,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.minPrice > 0 ||
    filters.maxPrice < 2000;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search Products</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={filters.category || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium">Price Range</label>
          <div className="px-2 mt-2">
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={handlePriceRangeChange}
              max={2000}
              min={0}
              step={10}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${filters.minPrice}</span>
            <span>
              ${filters.maxPrice >= 2000 ? "2000+" : filters.maxPrice}
            </span>
          </div>
        </div>

        {/* Active filters indicator */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  Search: {filters.search}
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  {makeCapitalize(filters.category)}
                </span>
              )}
              {(filters.minPrice > 0 || filters.maxPrice < 2000) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  ${filters.minPrice} - $
                  {filters.maxPrice >= 2000 ? "2000+" : filters.maxPrice}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
