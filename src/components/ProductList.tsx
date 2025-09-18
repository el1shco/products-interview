'use client';

import { useEffect, useState, useCallback } from 'react';

// Ikonkalar
import { Loader2, AlertCircle } from 'lucide-react';

// Tipler
import { Product, ProductFilters } from '@/types/products';

// Komponentler
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

// Helperler
import { fetcher } from '@/helpers/fetcher';
import { throttle } from '@/helpers/utils';

interface ProductsListProps {
  filters: ProductFilters;
}

export function ProductsList({ filters }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const ITEMS_PER_PAGE = 12;

  const loadProducts = useCallback(async (page: number, isNewSearch: boolean = false) => {
    try {
      if (isNewSearch) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const skip = page * ITEMS_PER_PAGE;
      const response = await fetcher.getProducts({
        ...filters,
        limit: ITEMS_PER_PAGE,
        skip,
      });

      // Qiymete gore filterleme
      let filteredProducts = response.products;
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        filteredProducts = response.products.filter((product) => {
          const price = product.price;
          const minPrice = filters.minPrice ?? 0;
          const maxPrice = filters.maxPrice ?? Infinity;
          return price >= minPrice && price <= maxPrice;
        });
      }

      if (isNewSearch) {
        setProducts(filteredProducts);
      } else {
        setProducts(prev => [...prev, ...filteredProducts]);
      }

      setHasMore(filteredProducts.length === ITEMS_PER_PAGE && (skip + ITEMS_PER_PAGE) < response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters]);

  // Scroll handleri
  const handleScroll = useCallback(
    throttle(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        if (hasMore && !loadingMore && !loading) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          loadProducts(nextPage, false);
        }
      }
    }, 500),
    [hasMore, loadingMore, loading, currentPage, loadProducts]
  );
  

  // Filter deyisikliklerinde ve ilk yuklemede mehsullari yukleme
  useEffect(() => {
    setCurrentPage(0);
    setHasMore(true);
    loadProducts(0, true);
  }, [filters]);

  // Scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Daha cox product yuklemesi
  const loadMore = () => {
    if (hasMore && !loadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadProducts(nextPage, false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Error Loading Products</h3>
          <p className="text-muted-foreground max-w-md">{error}</p>
          <Button onClick={() => loadProducts(0, true)} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No Products Found</h3>
          <p className="text-muted-foreground max-w-md">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Product sayi */}
      <div className="text-sm text-muted-foreground">
        Showing {products.length} products
        {hasMore && ' (scroll for more)'}
      </div>

      {/* Product gridi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="animate-fade-in"
            style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 0.1}s` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Spinner */}
      {loadingMore && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading more products...</span>
          </div>
        </div>
      )}

      {/* Daha cox gostermek */}
      {hasMore && !loadingMore && (
        <div className="flex justify-center">
          <Button onClick={loadMore} variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">You've seen all the products!</p>
        </div>
      )}
    </div>
  );
}