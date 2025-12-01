import React, { useState, useRef, useEffect } from 'react'
import styles from './FilterBar.module.css'

export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'rating_asc' | 'rating_desc' | 'name_asc' | 'name_desc'

interface Props {
  sort: SortOption
  setSort: (s: SortOption) => void
  search: string
  setSearch: (v: string) => void
  minPrice: number | ''
  setMinPrice: (v: number | '') => void
  maxPrice: number | ''
  setMaxPrice: (v: number | '') => void
  minRating: number | ''
  setMinRating: (v: number | '') => void
  clearFilters: () => void
}

export const FilterBar: React.FC<Props> = ({ sort, setSort, search, setSearch, minPrice, setMinPrice, maxPrice, setMaxPrice, minRating, setMinRating, clearFilters }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState(search)
  const filterRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<NodeJS.Timeout>()

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      setSearch(localSearch)
    }, 300)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [localSearch, setSearch])

  // Sync with external search changes
  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isFilterOpen])

  const hasActiveFilters = minPrice !== '' || maxPrice !== '' || minRating !== ''

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Products</h1>
      
      <div className={styles.bar} role="toolbar" aria-label="product filters">
        {/* Search Bar - Left */}
        <div className={styles.searchWrapper}>
          <input 
            className={styles.searchInput} 
            value={localSearch} 
            onChange={(e) => setLocalSearch(e.target.value)} 
            placeholder="Search products..." 
            aria-label="Search products"
          />
        </div>

        {/* Right aligned controls */}
        <div className={styles.rightControls}>
          {/* Sort Dropdown */}
          <div className={styles.dropdown}>
            <select 
              className={styles.select} 
              value={sort} 
              onChange={(e) => setSort(e.target.value as SortOption)}
              aria-label="Sort products"
            >
              <option value="default">Sort: Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_asc">Rating: Low to High</option>
              <option value="rating_desc">Rating: High to Low</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="name_desc">Name: Z-A</option>
            </select>
          </div>

          {/* Filter Dropdown */}
          <div className={styles.filterDropdown} ref={filterRef}>
            <button 
              className={`${styles.filterButton} ${hasActiveFilters ? styles.filterButtonActive : ''}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-expanded={isFilterOpen}
              aria-label="Filter products"
            >
              Filter {hasActiveFilters && <span className={styles.activeDot}>●</span>}
            </button>

            {isFilterOpen && (
              <div className={styles.filterPanel}>
                <div className={styles.filterSection}>
                  <label className={styles.filterLabel}>Price Range</label>
                  <div className={styles.priceInputs}>
                    <input 
                      className={styles.filterInput} 
                      type="number" 
                      placeholder="Min" 
                      value={minPrice === '' ? '' : minPrice} 
                      onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))} 
                      aria-label="Minimum price"
                    />
                    <span className={styles.separator}>—</span>
                    <input 
                      className={styles.filterInput} 
                      type="number" 
                      placeholder="Max" 
                      value={maxPrice === '' ? '' : maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))} 
                      aria-label="Maximum price"
                    />
                  </div>
                </div>

                <div className={styles.filterSection}>
                  <label className={styles.filterLabel}>Minimum Rating</label>
                  <input 
                    className={styles.filterInput} 
                    type="number" 
                    min="0" 
                    max="5" 
                    step="0.1" 
                    placeholder="Min rating (0-5)" 
                    value={minRating === '' ? '' : minRating} 
                    onChange={(e) => setMinRating(e.target.value === '' ? '' : Number(e.target.value))} 
                    aria-label="Minimum rating"
                  />
                </div>

                <div className={styles.filterActions}>
                  <button 
                    className={styles.clearFiltersBtn} 
                    onClick={() => {
                      clearFilters()
                      setIsFilterOpen(false)
                    }}
                    aria-label="Clear all filters"
                  >
                    Clear Filters
                  </button>
                  <button 
                    className={styles.applyBtn} 
                    onClick={() => setIsFilterOpen(false)}
                    aria-label="Apply filters"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
