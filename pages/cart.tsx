import React, { useEffect } from 'react'
import { useCart, useCartSync } from '../src/context/CartContext'
import CartItem from '../src/components/CartItem'

export default function CartPage() {
  const { state, clearCart } = useCart()
  
  // Optional: Enable API sync by providing an endpoint
  // Uncomment and configure the endpoint when your API is ready
  // const { syncFromAPI, syncToAPI } = useCartSync('https://your-api.com/cart')
  
  const totalCount = state.items.reduce((s, it) => s + (it.quantity || 1), 0)
  const totalPrice = state.items.reduce((s, it) => s + it.price * (it.quantity || 1), 0)

  // Optional: Sync cart from API on mount
  // useEffect(() => {
  //   syncFromAPI()
  // }, [syncFromAPI])

  // Optional: Sync cart to API whenever it changes
  // useEffect(() => {
  //   if (state.items.length > 0) {
  //     syncToAPI(state)
  //   }
  // }, [state, syncToAPI])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Your Cart</h1>
        {state.items.length > 0 && (
          <button
            onClick={clearCart}
            style={{
              padding: '8px 16px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            Clear Cart
          </button>
        )}
      </div>
      
      <div style={{ marginBottom: '20px', padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <p style={{ margin: '8px 0' }}>
          Items: <strong>{totalCount}</strong>
        </p>
        <p style={{ margin: '8px 0', fontSize: '1.2rem' }}>
          Total: <strong style={{ color: '#0070f3' }}>${totalPrice.toFixed(2)}</strong>
        </p>
      </div>

      <div>
        {state.items.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            background: 'white', 
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>🛒</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#111' }}>Your cart is empty</h3>
            <p style={{ margin: 0, color: '#6b7280' }}>Add some products to get started!</p>
          </div>
        )}
        {state.items.map((it) => (
          <CartItem key={it.id} id={it.id} title={it.title} price={it.price} thumbnail={it.thumbnail} quantity={it.quantity} />
        ))}
      </div>
    </div>
  )
}
