import React, { useMemo, useState } from 'react'
import { GetServerSideProps } from 'next'
import ProductList from '../src/components/ProductList'
import FilterBar, { SortOption } from '../src/components/FilterBar'

interface Product {
  id: number
  title: string
  price: number
  rating?: number
  thumbnail?: string
}

export default function Home({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortOption>('default')
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState<number | ''>('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [minRating, setMinRating] = useState<number | ''>('')

  const clearFilters = () => {
    setSort('default')
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    setMinRating('')
  }

  const filtered = useMemo(() => {
    let list = [...products]
    // search
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((p) => p.title.toLowerCase().includes(q))
    }
    // price
    if (minPrice !== '') list = list.filter((p) => p.price >= (minPrice as number))
    if (maxPrice !== '') list = list.filter((p) => p.price <= (maxPrice as number))
    // rating
    if (minRating !== '') list = list.filter((p) => (p.rating ?? 0) >= (minRating as number))
    // sorting
    switch (sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating_asc':
        list.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0))
        break
      case 'rating_desc':
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        break
      case 'name_asc':
        list.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'name_desc':
        list.sort((a, b) => b.title.localeCompare(a.title))
        break
      default:
        break
    }
    return list
  }, [products, search, minPrice, maxPrice, minRating, sort])

  return (
    <div>
      <FilterBar
        sort={sort}
        setSort={setSort}
        search={search}
        setSearch={setSearch}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minRating={minRating}
        setMinRating={setMinRating}
        clearFilters={clearFilters}
      />
      <ProductList products={filtered} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch('https://dummyjson.com/products')
    if (!res.ok) throw new Error('Failed to fetch products')
    const json = await res.json()
    const products = (json.products || []).slice(0, 30) // limit
    return {
      props: {
        products,
      },
    }
  } catch (e) {
    return {
      props: {
        products: [],
      },
    }
  }
}
