import React from 'react'
import { GetServerSideProps } from 'next'
import ProductDetail from '../../src/components/ProductDetail'

interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage?: number
  rating?: number
  images?: string[]
}

export default function ProductPage({ product }: { product: Product | null }) {
  if (!product) return <div>Product not found</div>
  return (
    <div>
      <ProductDetail product={product} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id
  if (!id) return { props: { product: null } }
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`)
    if (!res.ok) throw new Error('Failed to fetch product')
    const product = await res.json()
    return { props: { product } }
  } catch (e) {
    return { props: { product: null } }
  }
}
