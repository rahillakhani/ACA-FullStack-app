import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react'

// Types
export interface ProductItem {
  id: number
  title: string
  price: number
  thumbnail?: string
  quantity?: number
}

interface CartState {
  items: ProductItem[]
  wishlist: ProductItem[]
}

type Action =
  | { type: 'ADD_ITEM'; payload: ProductItem }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'INCREMENT_ITEM'; payload: { id: number; amount?: number } }
  | { type: 'DECREMENT_ITEM'; payload: { id: number; amount?: number } }
  | { type: 'ADD_WISHLIST'; payload: ProductItem }
  | { type: 'REMOVE_WISHLIST'; payload: { id: number } }
  | { type: 'SET'; payload: CartState }
  | { type: 'UPDATE_FROM_API'; payload: { items?: ProductItem[]; wishlist?: ProductItem[] } }
  | { type: 'CLEAR_CART' }
  | { type: 'CLEAR_WISHLIST' }

const initialState: CartState = { items: [], wishlist: [] }

const STORAGE_KEY = 'rlcommerce_cart_data'

const CartContext = createContext<{
  state: CartState
  addItem: (p: ProductItem) => void
  removeItem: (id: number) => void
  addToWishlist: (p: ProductItem) => void
  removeFromWishlist: (id: number) => void
  incrementItem: (id: number, amount?: number) => void
  decrementItem: (id: number, amount?: number) => void
  updateFromAPI: (data: { items?: ProductItem[]; wishlist?: ProductItem[] }) => void
  clearCart: () => void
  clearWishlist: () => void
} | null>(null)

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find((it) => it.id === action.payload.id)
      if (exists) {
        // increase quantity
        return {
          ...state,
          items: state.items.map((it) =>
            it.id === action.payload.id
              ? { ...it, quantity: (it.quantity || 1) + (action.payload.quantity || 1) }
              : it
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }] }
    }
    case 'REMOVE_ITEM': {
      return { ...state, items: state.items.filter((it) => it.id !== action.payload.id) }
    }
    case 'INCREMENT_ITEM': {
      const { id, amount = 1 } = action.payload
      return {
        ...state,
        items: state.items.map((it) => (it.id === id ? { ...it, quantity: (it.quantity || 1) + amount } : it)),
      }
    }
    case 'DECREMENT_ITEM': {
      const { id, amount = 1 } = action.payload
      return {
        ...state,
        items: state.items
          .map((it) => (it.id === id ? { ...it, quantity: (it.quantity || 1) - amount } : it))
          .filter((it) => (it.quantity ?? 0) > 0),
      }
    }
    case 'SET': {
      return action.payload
    }
    case 'ADD_WISHLIST': {
      const exists = state.wishlist.find((it) => it.id === action.payload.id)
      if (exists) return state
      return { ...state, wishlist: [...state.wishlist, action.payload] }
    }
    case 'REMOVE_WISHLIST': {
      return { ...state, wishlist: state.wishlist.filter((it) => it.id !== action.payload.id) }
    }
    case 'UPDATE_FROM_API': {
      // Optional: Merge API data with existing data or replace
      return {
        items: action.payload.items !== undefined ? action.payload.items : state.items,
        wishlist: action.payload.wishlist !== undefined ? action.payload.wishlist : state.wishlist,
      }
    }
    case 'CLEAR_CART': {
      return { ...state, items: [] }
    }
    case 'CLEAR_WISHLIST': {
      return { ...state, wishlist: [] }
    }
    default:
      return state
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [isInitialized, setIsInitialized] = React.useState(false)

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = window.sessionStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as CartState
          dispatch({ type: 'SET', payload: parsed })
          console.log('Cart data loaded from sessionStorage:', parsed)
        }
      }
    } catch (e) {
      console.error('Failed to load cart from sessionStorage', e)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Save to sessionStorage when state changes (but not on initial load)
  useEffect(() => {
    if (!isInitialized) return
    
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        console.log('Cart data saved to sessionStorage:', state)
      }
    } catch (e) {
      console.error('Failed to save cart to sessionStorage', e)
    }
  }, [state, isInitialized])

  const addItem = useCallback((p: ProductItem) => dispatch({ type: 'ADD_ITEM', payload: p }), [])
  const removeItem = useCallback((id: number) => dispatch({ type: 'REMOVE_ITEM', payload: { id } }), [])
  const incrementItem = useCallback((id: number, amount = 1) => dispatch({ type: 'INCREMENT_ITEM', payload: { id, amount } }), [])
  const decrementItem = useCallback((id: number, amount = 1) => dispatch({ type: 'DECREMENT_ITEM', payload: { id, amount } }), [])
  const addToWishlist = useCallback((p: ProductItem) => dispatch({ type: 'ADD_WISHLIST', payload: p }), [])
  const removeFromWishlist = useCallback((id: number) => dispatch({ type: 'REMOVE_WISHLIST', payload: { id } }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])
  const clearWishlist = useCallback(() => dispatch({ type: 'CLEAR_WISHLIST' }), [])
  
  // Update cart from API data (optional feature)
  const updateFromAPI = useCallback((data: { items?: ProductItem[]; wishlist?: ProductItem[] }) => {
    dispatch({ type: 'UPDATE_FROM_API', payload: data })
    console.log('Cart updated from API:', data)
  }, [])

  return (
    <CartContext.Provider 
      value={{ 
        state, 
        addItem, 
        removeItem, 
        addToWishlist, 
        removeFromWishlist, 
        incrementItem, 
        decrementItem,
        updateFromAPI,
        clearCart,
        clearWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}

// Optional: Hook to sync cart with API
export const useCartSync = (apiEndpoint?: string) => {
  const { updateFromAPI } = useCart()

  const syncFromAPI = useCallback(async () => {
    if (!apiEndpoint) {
      console.warn('No API endpoint provided for cart sync')
      return
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      // Expecting API to return: { items: ProductItem[], wishlist: ProductItem[] }
      if (data) {
        updateFromAPI(data)
      }
    } catch (error) {
      console.error('Failed to sync cart from API:', error)
    }
  }, [apiEndpoint, updateFromAPI])

  const syncToAPI = useCallback(async (cartData: CartState) => {
    if (!apiEndpoint) {
      console.warn('No API endpoint provided for cart sync')
      return
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartData),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      console.log('Cart synced to API successfully')
    } catch (error) {
      console.error('Failed to sync cart to API:', error)
    }
  }, [apiEndpoint])

  return { syncFromAPI, syncToAPI }
}
