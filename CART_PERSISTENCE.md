# Cart & Wishlist Persistence with API Sync

## Overview
The cart and wishlist are now persisted in **sessionStorage** and will survive page refreshes. Optional API sync functionality is also available.

## SessionStorage Persistence

### How it Works
- Cart and wishlist data are automatically saved to `sessionStorage` with key: `rlcommerce_cart_data`
- Data persists across page refreshes within the same browser session
- Data is cleared when the browser tab/window is closed
- Data format:
```json
{
  "items": [
    {
      "id": 1,
      "title": "Product Name",
      "price": 99.99,
      "thumbnail": "url",
      "quantity": 2
    }
  ],
  "wishlist": [
    {
      "id": 2,
      "title": "Wishlist Product",
      "price": 49.99,
      "thumbnail": "url"
    }
  ]
}
```

## New Cart Actions

### Clear Cart
```typescript
const { clearCart } = useCart()
clearCart() // Removes all items from cart
```

### Clear Wishlist
```typescript
const { clearWishlist } = useCart()
clearWishlist() // Removes all items from wishlist
```

### Update from API
```typescript
const { updateFromAPI } = useCart()
updateFromAPI({
  items: [...], // Optional: new cart items
  wishlist: [...] // Optional: new wishlist items
})
```

## API Sync Feature (Optional)

### Setup
The `useCartSync` hook provides functions to sync cart data with your backend API.

### Usage Example

```typescript
import { useCart, useCartSync } from '../src/context/CartContext'

function MyComponent() {
  const { state } = useCart()
  const { syncFromAPI, syncToAPI } = useCartSync('https://api.example.com/cart')

  // Sync cart FROM API on component mount
  useEffect(() => {
    syncFromAPI()
  }, [syncFromAPI])

  // Sync cart TO API whenever it changes
  useEffect(() => {
    if (state.items.length > 0) {
      syncToAPI(state)
    }
  }, [state, syncToAPI])
}
```

### API Endpoints

#### GET - Fetch Cart Data
**Endpoint:** `GET /api/cart`

**Expected Response:**
```json
{
  "items": [
    {
      "id": 1,
      "title": "Product Name",
      "price": 99.99,
      "thumbnail": "https://...",
      "quantity": 2
    }
  ],
  "wishlist": [
    {
      "id": 2,
      "title": "Wishlist Item",
      "price": 49.99,
      "thumbnail": "https://..."
    }
  ]
}
```

#### POST - Save Cart Data
**Endpoint:** `POST /api/cart`

**Request Body:**
```json
{
  "items": [...],
  "wishlist": [...]
}
```

**Expected Response:** 200 OK

### Implementation in Pages

**Example: pages/cart.tsx**
```typescript
import { useCart, useCartSync } from '../src/context/CartContext'

export default function CartPage() {
  const { state } = useCart()
  const { syncFromAPI, syncToAPI } = useCartSync('https://api.example.com/cart')

  // Load cart from API on mount
  useEffect(() => {
    syncFromAPI()
  }, [])

  // Save cart to API on changes
  useEffect(() => {
    syncToAPI(state)
  }, [state])

  // ... rest of component
}
```

## Configuration

### Enable API Sync
1. Uncomment the `useCartSync` hook call
2. Replace the API endpoint with your actual backend URL
3. Uncomment the `useEffect` hooks for syncing

### Disable API Sync
- Keep the code commented out (default state)
- Cart will only persist in sessionStorage

## Storage Strategy

### Why sessionStorage?
- Survives page refreshes
- Cleared when tab/window closes
- Prevents stale data accumulation
- Better for e-commerce (encourages fresh sessions)

### Alternative: localStorage
To use localStorage instead:
1. Change `window.sessionStorage` to `window.localStorage` in CartContext.tsx
2. Cart will persist even after browser is closed

## Testing

### Test Persistence
1. Add items to cart
2. Refresh the page
3. Items should still be in cart

### Test API Sync
1. Enable API sync with a mock endpoint
2. Add items to cart
3. Check network tab for API calls
4. Verify data is sent correctly

## Error Handling
- Failed sessionStorage reads/writes are logged to console
- Failed API syncs are logged but don't block the UI
- Cart continues to work even if API is unavailable

## Notes
- SessionStorage limit: ~5-10MB (browser dependent)
- API sync is completely optional
- Cart data is only in memory until first action
- Console logs help debug storage and sync issues
