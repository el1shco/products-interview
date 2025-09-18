import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind CSS classlarini merge funksiyasi
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Valyuta formati
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

// Endirimli qiymet hesablama
export function calculateDiscountedPrice(price: number, discountPercentage: number): number {
  return price - (price * discountPercentage / 100);
}

// Reytinq formati
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

// Debounce ve Throttle funksiyalari
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Capitalize funksiyasi
export function makeCapitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}