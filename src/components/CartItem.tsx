import React from 'react'
import Link from 'next/link'
import styles from './CartItem.module.css'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'

export const CartItem: React.FC<{ id: number; title: string; price: number; thumbnail?: string; quantity?: number }> = ({ id, title, price, thumbnail, quantity }) => {
  const { removeItem, incrementItem, decrementItem, addToWishlist, removeFromWishlist, state } = useCart()
  const { showToast } = useToast()
  const inWishlist = state.wishlist.some((w) => w.id === id)
  return (
    <div className={styles.row}>
      <div className={styles.thumb}>
        {thumbnail ? (
          <Link href={`/products/${id}`}>
            <img src={thumbnail} alt={title} />
          </Link>
        ) : (
          <span>📦</span>
        )}
      </div>
      <div>
        <Link href={`/products/${id}`} className={styles.title}>
          {title}
        </Link>
      </div>
      <div className={styles.controls}>
        <button
          className={styles.qtyBtn}
          onClick={() => {
            if ((quantity || 1) > 1) {
              decrementItem(id, 1)
              showToast({ message: `${title} quantity decreased`, duration: 1200 })
            } else {
              removeItem(id)
              showToast({ message: `${title} removed from cart`, duration: 1600 })
            }
          }}
        >
          −
        </button>
        <div className={styles.qtyValue}>{quantity || 1}</div>
        <button
          className={styles.qtyBtn}
          onClick={() => {
            incrementItem(id, 1)
            showToast({ message: `${title} quantity increased`, duration: 1200 })
          }}
        >
          +
        </button>
      </div>
      <div className={styles.price}>${(price * (quantity || 1)).toFixed(2)}</div>
      <div className={styles.action}>
        <button
          className={styles.wishlistBtn}
          onClick={() => {
            // Toggle wishlist membership without removing from cart
            if (inWishlist) {
              removeFromWishlist(id)
              showToast({ message: `${title} removed from wishlist`, duration: 2000 })
            } else {
              addToWishlist({ id, title, price, thumbnail })
              showToast({ message: `${title} added to wishlist`, duration: 2000 })
            }
          }}
          aria-label="Toggle wishlist"
        >
          {inWishlist ? <AiFillHeart /> : <AiOutlineHeart />}
        </button>
        <button
          className={styles.remove}
          onClick={() => {
            removeItem(id)
            showToast({ message: `${title} removed from cart`, duration: 2000 })
          }}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default CartItem
