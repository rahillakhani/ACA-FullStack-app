import Link from 'next/link'
import React from 'react'
import styles from './Header.module.css'
import { useCart } from '../context/CartContext'
import { FiHome, FiShoppingCart, FiUser } from 'react-icons/fi'
import { AiOutlineHeart } from 'react-icons/ai'

export const Header: React.FC = () => {
  const { state } = useCart()
  const totalCount = state.items.reduce((s, it) => s + (it.quantity || 1), 0)

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link href="/">
          <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            <FiHome /> RLEcommernce
          </span>
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link className={styles.link} href="/">Home</Link>
        <Link className={styles.link} href="/wishlist">
          <button className={styles.cartBtn} aria-label="Wishlist">
            <AiOutlineHeart /> <span>({state.wishlist.length})</span>
          </button>
        </Link>
        <Link className={styles.link} href="/cart">
          <button className={styles.cartBtn} aria-label="Cart">
            <FiShoppingCart /> <span>({totalCount})</span>
          </button>
        </Link>
        <Link className={styles.link} href="/login">
          <button className={styles.cartBtn} aria-label="Login">
            <FiUser />
          </button>
        </Link>
      </nav>
    </header>
  )
}

export default Header
