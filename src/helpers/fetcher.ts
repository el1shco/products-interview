import { Product, ProductFilters, ProductsResponse } from '@/types/products';

const BASE_URL = 'https://dummyjson.com'; // Base URL

// API Client classi
class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new ApiError({
          message: `HTTP error! status: ${response.status}`,
          status: response.status,
        });
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        message: error instanceof Error ? error.message : 'Network error occurred',
        status: 0,
      });
    }
  }

  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    
    if (filters.limit) searchParams.set('limit', filters.limit.toString());
    if (filters.skip) searchParams.set('skip', filters.skip.toString());
    
    let endpoint = '/products';
    
    if (filters.search) {
      endpoint = `/products/search?q=${encodeURIComponent(filters.search)}`;
    } else if (filters.category) {
      endpoint = `/products/category/${encodeURIComponent(filters.category)}`;
    }
    
    // Pagination paramslari
    const params = searchParams.toString();
    if (params) {
      const separator = endpoint.includes('?') ? '&' : '?';
      endpoint += separator + params;
    }
    
    return this.request<ProductsResponse>(endpoint);
  }

  async getProductById(id: string | number): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/products/categories');
  }
}

export const apiClient = new ApiClient();

// Helper istifadesi
export const fetcher = {
  getProducts: (filters?: ProductFilters) => apiClient.getProducts(filters),
  getProductById: (id: string | number) => apiClient.getProductById(id),
  getCategories: () => apiClient.getCategories(),
};

// Error classi (API Errorlari ucun)
export class ApiError extends Error {
  public status?: number;

  constructor({ message, status }: { message: string; status?: number }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}