import React, { useState } from 'react'
import styles from './ProductDetail.module.css'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { AiOutlineHeart, AiFillHeart, AiFillStar, AiOutlineStar } from 'react-icons/ai'

interface Props {
  product: {
    id: number
    title: string
    description: string
    images?: string[]
    price: number
    discountPercentage?: number
    rating?: number
  }
}

interface Review {
  id: string
  userName: string
  rating: number
  comment: string
  date: string
}

export const ProductDetail: React.FC<Props> = ({ product }) => {
  const { addItem, addToWishlist, removeFromWishlist, state, removeItem } = useCart()
  const existsInWishlist = state.wishlist.some((w) => w.id === product.id)
  const { showToast } = useToast()
  
  // Review state
  const [reviews, setReviews] = useState<Review[]>([])
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [userName, setUserName] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)

  const addProduct = () => {
    addItem({ id: product.id, title: product.title, price: product.price, thumbnail: product.images?.[0] })
    showToast({ message: `${product.title} added to cart`, actionLabel: 'Undo', onAction: () => removeItem(product.id) })
  }

  const toggleWishlist = () => {
    if (existsInWishlist) removeFromWishlist(product.id)
    else addToWishlist({ id: product.id, title: product.title, price: product.price, thumbnail: product.images?.[0] })
    showToast({ message: existsInWishlist ? `${product.title} removed from wishlist` : `${product.title} added to wishlist`, duration: 2000 })
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userName.trim() || !reviewComment.trim() || userRating === 0) {
      showToast({ message: 'Please fill all fields and select a rating', duration: 3000 })
      return
    }

    const newReview: Review = {
      id: Date.now().toString(),
      userName: userName.trim(),
      rating: userRating,
      comment: reviewComment.trim(),
      date: new Date().toLocaleDateString()
    }

    setReviews([newReview, ...reviews])
    setUserRating(0)
    setReviewComment('')
    setUserName('')
    setShowReviewForm(false)
    showToast({ message: 'Review submitted successfully!', duration: 3000 })
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : product.rating || 0

  return (
    <div className={styles.root}>
      <div className={styles.image}>
        <img src={product.images?.[0]} alt={product.title} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{product.title}</div>
        <div className={styles.price}>${product.price.toFixed(2)}</div>
        <div className={styles.meta}>
          <small>⭐ {averageRating.toFixed(1)}</small> • 
          <small>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</small> • 
          <small>{product.discountPercentage ?? 0}% off</small>
        </div>
        <div className={styles.description}>{product.description}</div>
        <div className={styles.actions}>
          <button className={styles.addBtn} onClick={addProduct}>
            Add to Cart
          </button>
          <button 
            onClick={toggleWishlist} 
            className={`${styles.addBtn} ${styles.wishlistBtn}`} 
            style={{ background: existsInWishlist ? '#ff4d6d' : undefined }}
            aria-label={existsInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {existsInWishlist ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
        </div>

        {/* Rating & Review Section */}
        <div className={styles.reviewSection}>
          <div className={styles.reviewHeader}>
            <h3>Customer Reviews</h3>
            {!showReviewForm && (
              <button 
                className={styles.writeReviewBtn} 
                onClick={() => setShowReviewForm(true)}
              >
                Write a Review
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form className={styles.reviewForm} onSubmit={handleSubmitReview}>
              <div className={styles.formGroup}>
                <label>Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Your Rating</label>
                <div className={styles.starRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={styles.starButton}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(star)}
                      aria-label={`Rate ${star} stars`}
                    >
                      {star <= (hoverRating || userRating) ? (
                        <AiFillStar className={styles.starFilled} />
                      ) : (
                        <AiOutlineStar className={styles.starEmpty} />
                      )}
                    </button>
                  ))}
                  {userRating > 0 && (
                    <span className={styles.ratingText}>({userRating} star{userRating !== 1 ? 's' : ''})</span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Your Review</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className={styles.textarea}
                  rows={4}
                  required
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn}>
                  Submit Review
                </button>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowReviewForm(false)
                    setUserRating(0)
                    setReviewComment('')
                    setUserName('')
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className={styles.reviewsList}>
            {reviews.length === 0 ? (
              <div className={styles.noReviews}>
                No reviews yet. Be the first to review this product!
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div>
                      <div className={styles.reviewerName}>{review.userName}</div>
                      <div className={styles.reviewDate}>{review.date}</div>
                    </div>
                    <div className={styles.reviewRating}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < review.rating ? (
                            <AiFillStar className={styles.starFilledSmall} />
                          ) : (
                            <AiOutlineStar className={styles.starEmptySmall} />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.reviewComment}>{review.comment}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
