import Link from 'next/link'
import React from 'react'
import styles from './ProductCard.module.css'
import { useCart, ProductItem } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'

interface Props {
  product: {
    id: number
    title: string
    price: number
    rating?: number
    thumbnail?: string
  }
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { state, addToWishlist, removeFromWishlist, addItem, removeItem } = useCart()
  const existsInWishlist = state.wishlist.some((w) => w.id === product.id)
  const { showToast } = useToast()
  const addProduct = () => {
    addItem({ id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail })
    showToast({ message: `${product.title} added to cart`, actionLabel: 'Undo', onAction: () => removeItem(product.id) })
  }
  const toggleWishlist = () => {
    if (existsInWishlist) removeFromWishlist(product.id)
    else addToWishlist({ id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail })
    showToast({ message: existsInWishlist ? `${product.title} removed from wishlist` : `${product.title} added to wishlist`, duration: 2000 })
  }
  return (
    <div className={styles.card}>
      <Link className={styles.imageLink} href={`/products/${product.id}`}>
        <div className={styles.imageWrap}>
          <img src={product.thumbnail} alt={product.title} />
        </div>
      </Link>
      <Link className={styles.titleLink} href={`/products/${product.id}`}>
        <div className={styles.title}>{product.title}</div>
      </Link>
      <div className={styles.meta}>
        <div className={styles.price}>${product.price.toFixed(2)}</div>
        <div className={styles.rating}>⭐ {product.rating ?? '—'}</div>
      </div>
      <div className={styles.cardFooter}>
        <button onClick={addProduct} className={styles.addBtn}>
          Add to Cart
        </button>
        <button onClick={toggleWishlist} aria-label="Add to wishlist" className={`${styles.addBtn} ${styles.wishlistBtn}`} style={{ background: existsInWishlist ? '#ff4d6d' : undefined }}>
          {existsInWishlist ? <AiFillHeart /> : <AiOutlineHeart />}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
