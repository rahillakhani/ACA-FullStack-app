import React from 'react'
import { ProductCard } from './ProductCard'
import styles from './ProductList.module.css'

interface ProductListProps {
  products: Array<{
    id: number
    title: string
    price: number
    rating?: number
    thumbnail?: string
  }>
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className={styles.noProducts}>
        <div className={styles.noProductsIcon}>🔍</div>
        <h3 className={styles.noProductsTitle}>No products found</h3>
        <p className={styles.noProductsText}>
          There are no products found, please update your search or try again
        </p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export default ProductList
