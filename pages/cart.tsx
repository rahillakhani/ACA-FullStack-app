import React from 'react'
import { useCart } from '../src/context/CartContext'
import CartItem from '../src/components/CartItem'

export default function CartPage() {
  const { state } = useCart()
  const totalCount = state.items.reduce((s, it) => s + (it.quantity || 1), 0)
  const totalPrice = state.items.reduce((s, it) => s + it.price * (it.quantity || 1), 0)

  return (
    <div>
      <h1>Your Cart</h1>
      <div>
        <p>
          Items: <strong>{totalCount}</strong>
        </p>
        <p>
          Total: <strong>${totalPrice.toFixed(2)}</strong>
        </p>
      </div>

      <div>
        {state.items.length === 0 && <div>Your cart is empty.</div>}
        {state.items.map((it) => (
          <CartItem key={it.id} id={it.id} title={it.title} price={it.price} thumbnail={it.thumbnail} quantity={it.quantity} />
        ))}
      </div>
    </div>
  )
}
