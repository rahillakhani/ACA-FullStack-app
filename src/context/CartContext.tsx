import React, { createContext, useContext, useEffect, useReducer } from 'react'

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

const initialState: CartState = { items: [], wishlist: [] }

const CartContext = createContext<{
  state: CartState
  addItem: (p: ProductItem) => void
  removeItem: (id: number) => void
  addToWishlist: (p: ProductItem) => void
  removeFromWishlist: (id: number) => void
  incrementItem: (id: number, amount?: number) => void
  decrementItem: (id: number, amount?: number) => void
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
    default:
      return state
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('cart') : null
      if (raw) {
        const parsed = JSON.parse(raw) as CartState
        dispatch({ type: 'SET', payload: parsed })
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e)
    }
  }, [])

  // Save to localStorage when changed
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('cart', JSON.stringify(state))
      }
    } catch (e) {
      console.error('Failed to save cart to localStorage', e)
    }
  }, [state])

  const addItem = (p: ProductItem) => dispatch({ type: 'ADD_ITEM', payload: p })
  const removeItem = (id: number) => dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  const incrementItem = (id: number, amount = 1) => dispatch({ type: 'INCREMENT_ITEM', payload: { id, amount } })
  const decrementItem = (id: number, amount = 1) => dispatch({ type: 'DECREMENT_ITEM', payload: { id, amount } })
  const addToWishlist = (p: ProductItem) => dispatch({ type: 'ADD_WISHLIST', payload: p })
  const removeFromWishlist = (id: number) => dispatch({ type: 'REMOVE_WISHLIST', payload: { id } })

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, addToWishlist, removeFromWishlist, incrementItem, decrementItem }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
