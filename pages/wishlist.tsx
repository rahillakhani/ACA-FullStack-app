import React from 'react'
import { useCart } from '../src/context/CartContext'
import WishlistItem from '../src/components/WishlistItem'

export default function WishlistPage() {
  const { state } = useCart()
  const totalCount = state.wishlist.length
  const totalPrice = state.wishlist.reduce((s, it) => s + it.price * (it.quantity || 1), 0)

  return (
    <div>
      <h1>Your Wishlist</h1>
      <div>
        <p>
          Items: <strong>{totalCount}</strong>
        </p>
        <p>
          Total: <strong>${totalPrice.toFixed(2)}</strong>
        </p>
      </div>

      <div>
        {state.wishlist.length === 0 && <div>Your wishlist is empty.</div>}
        {state.wishlist.map((it) => (
          <WishlistItem key={it.id} id={it.id} title={it.title} price={it.price} thumbnail={it.thumbnail} quantity={it.quantity} />
        ))}
      </div>
    </div>
  )
}
