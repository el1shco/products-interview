import { Suspense } from 'react';
import { notFound } from 'next/navigation';

// Komponentler
import { ProductDetails } from '@/components/ProductDetail';

// Helperler
import { fetcher } from '@/helpers/fetcher';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await fetcher.getProductById(params.id);
    
    return {
      title: `${product.title} - Products App`,
      description: product.description,
      keywords: [product.title, product.brand, product.category, ...product.tags],
      openGraph: {
        title: product.title,
        description: product.description,
        images: [product.thumbnail],
      },
    };
  } catch {
    return {
      title: 'Product Not Found - Products App',
      description: 'The requested product could not be found.',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product;
  
  try {
    product = await fetcher.getProductById(params.id);
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }

  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetails product={product} />
    </Suspense>
  );
}

function ProductDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="flex items-center space-x-2">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-4"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}