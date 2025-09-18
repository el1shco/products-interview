# AzStudy Texniki Tapşırıq

## Xüsusiyyətlər

- **İstifadə olunan texnologiyalar**: Next.js 15, TypeScript, Tailwind
- **URL idarəetməsi**: URL-lər (filtrləmə və.s üçün) nuqs paketi ilə idarə olunur
- **Filtrləmə**: Axtarış, kateqoriya filtrləri və qiymət aralığı real-time yenilənmə ilə
- **İnfinite scroll**: Məhsulların avtomatik yüklənməsi və səhifələmə
- **Responsiv dizayn**: Mobile-first yanaşmalı custom UI komponentləri
- **Performans optimizasiyası**: Şəkil optimizasiyası və lazy loading

## Texnologiya Yığını

- **Freymvork**: Next.js 15 App Router ilə
- **Dil**: TypeScript
- **Style**: Tailwind CSS v4
- **Custom UI componentləri**: shadcn/ui komponentləri (Radix UI əsaslı)
- **URL idarəetməsi**: nuqs ilə URL vəziyyətinin idarə olunması  
- **Məlumatların çəkilməsi**: Xüsusi API client və error handling
- **İkonkalar**: Lucide React
- **Data üçün API endpointlər**: DummyJSON API

## Layihə Strukturu

```
src/
├── app/
│   ├── globals.css           # Qlobal stillər və CSS dəyişənləri
│   ├── layout.tsx           # Ana layout (NuqsAdapter ilə)
│   ├── page.tsx             # Ana səhifə (/products-a yönləndirir)
│   └── products/
│       ├── page.tsx         # Products səhifəsi
│       └── [id]/
│           └── page.tsx     # Product detail səhifəsi
├── components/
│   ├── ui/                  # Custom reusable UI komponentləri
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── slider.tsx
│   ├── ProductCard.tsx      # Product kartı komponenti
│   ├── ProductDetails.tsx   # Product detalları görünüşü
│   ├── ProductFilters.tsx   # Nuqs ilə filter sidebar
│   └── ProductsList.tsx     # İnfinite scroll ilə məhsullar grid-i
├── helpers/
│   ├── fetcher.ts          # Error handling ilə API
│   └── utils.ts            # Utility funksiyaları
└── types/
    └── product.ts          # TypeScript (tiplər)
```

## Əsas xüsusiyyətlər

### URL idarə edilməsi

APP-də filter vəziyyətini URL-də `nuqs` ilə idarə edir, paylaşımı və yadda saxlanmasını asanlaşdırır:

```typescript
const [filters, setFilters] = useQueryStates({
  search: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  minPrice: parseAsInteger.withDefault(0),
  maxPrice: parseAsInteger.withDefault(2000),
});
```

### Custom API request-ləri

Mərkəzləşdirilmiş API və error handling:

```typescript
class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Error və response handling
  }
  
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    // Filterlərlə productların çəkilməsi
  }
}
```

### İnfinite sxroll

Aşağıya sürüşdürdükcə məhsulların avtomatik yüklənməsi:

```typescript
const handleScroll = useCallback(
  throttle(() => {
    if (/* səhifənin aşağısına yaxın işə düşür */) {
      loadProducts(nextPage, false);
    }
  }, 500),
  [hasMore, loadingMore, loading, currentPage, loadProducts]
);
```

### Filter Sistemi

Real time update ilə filtrləmə:
- **Axtarış**: Məhsullar üzrə mətn axtarışı
- **Kateqoriya**: Məhsul kateqoriyalarına görə filter  
- **Qiymət Aralığı**: Slider ilə qiymət filteri
- **URL Sinxronizasiya**: Bütün filtrlər URL ilə sinxronlaşdırılır

## Səhifələr

### `/products` - Product siyahısı
- Product kartları ilə grid görünüşü
- Filter sidebarı (axtarış, kateqoriya, qiymət aralığı)
- İnfinite scroll səhifələmə
- Responsiv dizayn

### `/products/[id]` - Product detalları  
- Geniş prduct məlumatı
- Şəkillər və breadcrumblar
- Müştəri rəyləri bölməsi
- Səbətə əlavə etmə və favoritə əlavə etmə (localStorage) funksiyası

## 🎨 UI komponentləri

shadcn/ui komponentləri ilə hazırlanıb:
- **button**: Müxtəlif variantlı və ölçülü buttonlar
- **card**: Productt kartları və content konteynerləri  
- **input**: İnput komponenti
- **select**: Kateqoriyalar üçün dropdown select
- **slider**: Qiymət aralığı seçimi

## 📊 Performans xüsusiyyətləri

- **Şəkil optimizasiyası**: Next.js Image komponenti ilə düzgün ölçüləndirmə
- **Lazy loading**: Komponentlər və şəkillər ehtiyac olduqda yüklənir
- **Throttled scroll**: Scrollun optimallaşdırılması
- **Debounced search**: Filter üçün debounce

