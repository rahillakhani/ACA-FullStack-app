/**
 * Example: How to use Cart API Sync
 * 
 * This file demonstrates how to integrate the optional API sync feature
 * with your backend. Uncomment and modify as needed.
 */

import { useEffect } from 'react'
import { useCart, useCartSync } from '../context/CartContext'

export function ExampleCartSyncComponent() {
  const { state, updateFromAPI } = useCart()
  
  // Option 1: Using the useCartSync hook (recommended)
  const { syncFromAPI, syncToAPI } = useCartSync('https://api.yourbackend.com/cart')

  // Load cart from API when component mounts
  useEffect(() => {
    syncFromAPI()
  }, [syncFromAPI])

  // Save cart to API whenever it changes
  useEffect(() => {
    if (state.items.length > 0 || state.wishlist.length > 0) {
      syncToAPI(state)
    }
  }, [state, syncToAPI])

  // Option 2: Manual API integration
  useEffect(() => {
    async function fetchCartFromAPI() {
      try {
        const response = await fetch('https://api.yourbackend.com/cart', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          // Expected format: { items: ProductItem[], wishlist: ProductItem[] }
          updateFromAPI(data)
        }
      } catch (error) {
        console.error('Failed to fetch cart from API:', error)
      }
    }

    // Uncomment to enable:
    // fetchCartFromAPI()
  }, [updateFromAPI])

  // Option 3: Save cart to API on specific events
  async function handleCheckout() {
    try {
      const response = await fetch('https://api.yourbackend.com/cart/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
          total: state.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
        }),
      })

      if (response.ok) {
        console.log('Checkout successful')
      }
    } catch (error) {
      console.error('Checkout failed:', error)
    }
  }

  return null // This is just an example component
}

/**
 * Backend API Examples
 * 
 * Node.js/Express example:
 * 
 * // GET /api/cart - Fetch user's cart
 * app.get('/api/cart', authenticate, async (req, res) => {
 *   const userId = req.user.id
 *   const cart = await db.cart.findOne({ userId })
 *   res.json({
 *     items: cart?.items || [],
 *     wishlist: cart?.wishlist || []
 *   })
 * })
 * 
 * // POST /api/cart - Save user's cart
 * app.post('/api/cart', authenticate, async (req, res) => {
 *   const userId = req.user.id
 *   const { items, wishlist } = req.body
 *   
 *   await db.cart.upsert({
 *     userId,
 *     items,
 *     wishlist,
 *     updatedAt: new Date()
 *   })
 *   
 *   res.json({ success: true })
 * })
 */

export default ExampleCartSyncComponent
