import React from 'react'
import styles from './WishlistItem.module.css'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export const WishlistItem: React.FC<{ id: number; title: string; price: number; thumbnail?: string; quantity?: number }> = ({ id, title, price, thumbnail, quantity }) => {
  const { removeFromWishlist, addItem, removeItem } = useCart()
  const { showToast } = useToast()
  const addToCart = () => {
    addItem({ id, title, price, thumbnail })
    removeFromWishlist(id)
    showToast({ message: `${title} added to cart`, actionLabel: 'Undo', onAction: () => removeItem(id) })
  }
  return (
    <div className={styles.row}>
      <div className={styles.thumb}>{thumbnail ? <img src={thumbnail} alt={title} /> : <span>📦</span>}</div>
      <div>
        <div className={styles.title}>{title}</div>
      </div>
      <div className={styles.price}>${(price * (quantity || 1)).toFixed(2)}</div>
      <div className={styles.action}>
        <button className={styles.add} onClick={addToCart}>
          Add to Cart
        </button>
        <button className={styles.remove} onClick={() => removeFromWishlist(id)}>
          Remove
        </button>
      </div>
    </div>
  )
}

export default WishlistItem
