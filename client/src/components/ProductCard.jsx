import { useState } from "react";
import { Star, Heart, ShoppingCart, Check, Eye, ShieldCheck, Zap } from "lucide-react";
import FallbackImage from "./FallbackImage";

export default function ProductCard({
  product,
  formatPrice,
  onOpenProduct,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}) {
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  function handleQuickAdd(e) {
    e.stopPropagation();
    setAdding(true);
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => {
      setAdding(false);
      setTimeout(() => setJustAdded(false), 1600);
    }, 350);
  }

  function handleWishlistClick(e) {
    e.stopPropagation();
    onToggleWishlist(product);
  }

  const rating = product.rating || 4.8;
  const reviewCount = product.reviewCount || 420;
  const inStock = product.stock !== undefined ? product.stock > 0 : true;

  // Calculate discount percentage if not explicitly present
  const discountPercent = product.discount || (
    product.originalPrice && product.originalPrice > product.price
      ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`
      : null
  );

  return (
    <article
      className="ecomm-product-card"
      onClick={() => onOpenProduct(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenProduct(product);
        }
      }}
      aria-label={`View ${product.name}`}
    >
      {/* Product Image Frame */}
      <div className="card-media-wrapper">
        <FallbackImage
          src={product.image}
          alt={product.name}
          category={product.category}
          className="card-product-img"
        />

        {/* Top Badges */}
        <div className="card-top-badges">
          {discountPercent && (
            <span className="discount-tag-badge">{discountPercent}</span>
          )}
          {product.badge && (
            <span className="card-deal-badge">{product.badge}</span>
          )}
        </div>

        {/* Wishlist Heart Icon */}
        <button
          type="button"
          className={`card-wishlist-toggle ${isWishlisted ? "active" : ""}`}
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title="Save to Wishlist"
        >
          <Heart size={16} className={isWishlisted ? "heart-filled" : "heart-outline"} />
        </button>

        {/* Hover Quick View */}
        <div className="card-hover-action-overlay">
          <span className="quick-preview-pill">
            <Eye size={14} />
            <span>Quick View</span>
          </span>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="card-info-content">
        {/* Brand and Assured Tag */}
        <div className="card-brand-row">
          <span className="card-brand-name">{product.brand || product.category}</span>
          <span className="card-assured-tag" title="100% Genuine Certified Quality">
            <ShieldCheck size={12} className="assured-icon" />
            <span>Assured</span>
          </span>
        </div>

        {/* Product Title */}
        <h3 className="card-title-text" title={product.name}>
          {product.name}
        </h3>

        {/* Star Ratings Cluster */}
        <div className="card-ratings-row">
          <div className="rating-pill-box">
            <span>{rating.toFixed(1)}</span>
            <Star size={11} className="rating-star-icon" />
          </div>
          <span className="review-count-number">({reviewCount.toLocaleString()})</span>
        </div>

        {/* Price & Savings Block */}
        <div className="card-price-block">
          <div className="main-price-row">
            <span className="deal-price">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="mrp-price">
                M.R.P: <del>{formatPrice(product.originalPrice)}</del>
              </span>
            )}
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="savings-callout">
              Save {formatPrice(product.originalPrice - product.price)}
            </span>
          )}
        </div>

        {/* Delivery Guarantee */}
        <div className="card-delivery-info">
          <span className="free-tag">FREE Delivery</span>
          <span className="delivery-timing">{product.deliveryDate || "Tomorrow by 2 PM"}</span>
        </div>

        {/* Stock urgency */}
        {product.stock && product.stock <= 5 && (
          <div className="low-stock-alert">
            <Zap size={12} />
            <span>Only {product.stock} left in stock - order soon!</span>
          </div>
        )}

        {/* Add to Cart CTA */}
        <div className="card-actions-row">
          <button
            type="button"
            className={`card-add-cart-btn ${justAdded ? "added-state" : ""} ${adding ? "busy" : ""}`}
            onClick={handleQuickAdd}
            disabled={!inStock || adding}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <>
                <Check size={16} />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
