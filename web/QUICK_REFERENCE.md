# Quick Reference Card

## 🚀 Start Services

```bash
# Terminal 1 - Backend
cd /path/to/kiosk-hackethon-project
uvicorn src.api:app --reload

# Terminal 2 - Frontend  
cd web
npm run dev
```

## 📦 Import Everything

```typescript
import { 
  // Hooks
  useProductSearch,
  useCelebritySearch,
  useVibeSearch,
  useCelebrities,
  useVibes,
  useCategories,
  usePersonalizedRecommendations,
  
  // Context
  usePreferences,
  useCart,
  
  // Services
  searchProducts,
  getCelebrities,
  
  // Types
  Product,
  SearchRequest,
  
  // Components (separate imports)
} from '@/lib';

import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import ProductCard from '@/components/ProductCard';
```

## 🎣 Hook Cheat Sheet

### Product Search
```typescript
const { data, mutate, isLoading, error } = useProductSearch();

mutate({
  query: 'necklace',
  min_price: 50000,
  max_price: 100000,
  top_k: 10
});
```

### Celebrity Search
```typescript
const { data, mutate, isLoading } = useCelebritySearch();

mutate({
  celebrity_name: 'deepika_padukone',
  top_k: 6
});
```

### Vibe Search
```typescript
const { data, mutate } = useVibeSearch();

mutate({
  vibe: 'elegant',
  min_price: 100000,
  top_k: 10
});
```

### Metadata
```typescript
const { data: celebrities } = useCelebrities();
const { data: vibes } = useVibes();
const { data: categories } = useCategories();
```

### Recommendations
```typescript
const { getRecommendations, data } = usePersonalizedRecommendations();

getRecommendations({
  occasion: 'wedding',
  budget: { min: 100000, max: 500000 },
  vibe: 'elegant',
  category: 'necklace'
});
```

## 🎨 Context Usage

### Preferences
```typescript
const {
  preferences,      // Current state
  setOccasion,     // Set occasion
  setBudget,       // Set budget
  setVibe,         // Set vibe
  setCategory,     // Set category
  setCelebrity,    // Set celebrity
  resetPreferences // Reset all
} = usePreferences();

// Usage
setOccasion('wedding');
setBudget(50000, 100000);
setVibe('elegant');
```

### Cart
```typescript
const {
  items,          // Cart items
  addItem,        // Add product
  removeItem,     // Remove by ID
  updateQuantity, // Update quantity
  clearCart,      // Clear all
  getTotalItems,  // Get count
  getTotalPrice,  // Get total
  isInCart        // Check if in cart
} = useCart();

// Usage
addItem(product, 1);
removeItem(productId);
getTotalPrice();
```

## 🎯 Common Patterns

### Standard API Call Pattern
```typescript
function MyComponent() {
  const { data, mutate, isLoading, error } = useProductSearch();

  // Loading state
  if (isLoading) return <LoadingSpinner />;
  
  // Error state
  if (error) return <ErrorMessage message={error} onRetry={() => mutate(...)} />;

  // Success state
  return (
    <div>
      {data?.map(item => (
        <ProductCard key={item.id} product={item} />
      ))}
    </div>
  );
}
```

### Form with Preferences
```typescript
function SelectionPage() {
  const router = useRouter();
  const { setOccasion } = usePreferences();

  const handleSelect = (value: string) => {
    setOccasion(value);
    router.push('/next-page');
  };

  return (
    <button onClick={() => handleSelect('wedding')}>
      Wedding
    </button>
  );
}
```

### Product Display with Cart
```typescript
function ProductList() {
  const { data } = useProductSearch();
  const { addItem } = useCart();

  return (
    <div className="grid grid-cols-3 gap-6">
      {data?.map(product => (
        <ProductCard 
          key={product.id} 
          product={product}
          onAddToCart={() => addItem(product)}
        />
      ))}
    </div>
  );
}
```

## 📡 API Endpoints

```
POST   /search                    # Search products
POST   /search/celebrity          # Celebrity search
POST   /search/vibe               # Vibe search
GET    /search/suggestions?q=...  # Suggestions

GET    /celebrities               # List celebrities
GET    /vibes                     # List vibes
GET    /categories                # List categories
GET    /collections               # List collections

GET    /stats/vibes               # Vibe statistics
GET    /stats/price-range         # Price stats

GET    /product/{id}              # Get product
GET    /health                    # Health check
```

## 🛠️ Utility Functions

```typescript
import { formatPrice, formatCelebrityName, parseBudgetString } from '@/lib';

formatPrice(100000);              // "₹1,00,000"
formatCelebrityName('deepika_padukone');  // "Deepika Padukone"
parseBudgetString('50k-1L');      // { min: 50000, max: 100000 }
```

## 🎨 Component Props

### LoadingSpinner
```typescript
<LoadingSpinner 
  size="lg"                    // 'sm' | 'md' | 'lg'
  message="Loading..."
  fullScreen={true}
/>
```

### ErrorMessage
```typescript
<ErrorMessage 
  message="Error occurred"
  onRetry={() => refetch()}
  fullScreen={false}
/>
```

### ProductCard
```typescript
<ProductCard 
  product={product}
  onTryOn={(p) => handleTryOn(p)}
/>
```

## 🔧 Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=30000
```

## ⚡ Quick Tips

1. **Always handle loading and error states**
   ```typescript
   if (isLoading) return <LoadingSpinner />;
   if (error) return <ErrorMessage message={error} />;
   ```

2. **Use TypeScript types**
   ```typescript
   const { data } = useApi<Product[]>(getProducts);
   ```

3. **Leverage caching**
   - Metadata is cached automatically for 5 minutes

4. **Use context for global state**
   - Preferences: User selections
   - Cart: Shopping cart items

5. **Import from central location**
   ```typescript
   import { ... } from '@/lib';
   ```

## 🐛 Debug Commands

```bash
# Check backend health
curl http://localhost:8000/health

# Test product search
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"query":"necklace","top_k":5}'

# Check TypeScript errors
npx tsc --noEmit

# View API docs
open http://localhost:8000/docs
```

## 📱 URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

## 🎓 Learning Path

1. Read `SETUP.md` - Get started
2. Read `API_INTEGRATION.md` - Understand architecture
3. Check `INTEGRATION_SUMMARY.md` - See what's available
4. Use this `QUICK_REFERENCE.md` - Quick lookup

## 💾 File Locations

```
web/lib/api/          # API client & services
web/lib/hooks/        # Custom hooks
web/lib/context/      # State management
web/lib/types/        # TypeScript types
web/components/       # UI components
web/app/             # Pages
```

## ✅ Checklist for New Features

- [ ] Define types in `types/api.ts`
- [ ] Create service function in `services.ts`
- [ ] Create custom hook in `hooks/`
- [ ] Add loading/error handling
- [ ] Update this quick reference
- [ ] Test the integration

That's it! You're ready to build! 🚀

