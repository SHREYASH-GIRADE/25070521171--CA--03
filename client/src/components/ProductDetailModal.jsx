import { useState, useEffect } from "react";
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Minus,
  Plus,
  Share2,
  ChevronRight
} from "lucide-react";
import FallbackImage from "./FallbackImage";

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  formatPrice,
  isWishlisted,
  onToggleWishlist,
  onShowToast
}) {
  const [selectedImage, setSelectedImage] = useState(product?.image);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
      setPincodeStatus(null);
    }
  }, [product]);

  // Handle ESC key to close modal
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const maxStock = product.stock || 15;
  const rating = product.rating || 4.8;
  const reviewCount = product.reviewCount || 42;
  const gallery = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  function handleQuantityChange(delta) {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > maxStock) return maxStock;
      return next;
    });
  }

  function handleAdd() {
    onAddToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function handlePincodeCheck(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeStatus({ valid: false, message: "Please enter a valid 6-digit Indian PIN code." });
      return;
    }
    setPincodeStatus({
      valid: true,
      message: `Delivery available to ${pincode.trim()} within 2-3 business days. Free shipping applied!`
    });
  }

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast("Product link copied to clipboard", "success");
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="product-detail-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        {/* Modal Top Bar */}
        <div className="modal-top-bar">
          <nav className="modal-breadcrumbs" aria-label="Breadcrumb">
            <span>ShopSphere</span>
            <ChevronRight size={12} />
            <span>{product.category}</span>
            <ChevronRight size={12} />
            <span className="current-crumb">{product.name}</span>
          </nav>

          <div className="modal-top-actions">
            <button
              type="button"
              className="modal-icon-btn"
              onClick={handleShare}
              title="Share product"
              aria-label="Share product"
            >
              <Share2 size={16} />
            </button>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close details"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="product-detail-content">
          {/* Left Column: Gallery */}
          <div className="detail-media-column">
            <div className="detail-main-image-wrap">
              <FallbackImage
                src={selectedImage}
                alt={product.name}
                category={product.category}
                className="detail-main-img"
              />
              {product.badge && (
                <span className="detail-floating-badge">{product.badge}</span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {gallery.length > 1 && (
              <div className="detail-thumbnails-strip">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`detail-thumb-btn ${selectedImage === imgUrl ? "active" : ""}`}
                    onClick={() => setSelectedImage(imgUrl)}
                    aria-label={`View angle ${idx + 1}`}
                  >
                    <FallbackImage
                      src={imgUrl}
                      alt={`${product.name} thumb ${idx + 1}`}
                      category={product.category}
                      className="thumb-img"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="detail-info-column">
            <div className="detail-header">
              <div className="detail-meta-row">
                <span className="detail-category-tag">{product.category}</span>
                {product.sku && (
                  <span className="detail-sku">SKU: {product.sku}</span>
                )}
              </div>

              <h1 className="detail-title">{product.name}</h1>

              <div className="detail-rating-row">
                <div className="stars-cluster">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={i < Math.floor(rating) ? "star-gold" : "star-empty"}
                    />
                  ))}
                </div>
                <span className="rating-numeric">{rating.toFixed(1)}</span>
                <span className="rating-divider">·</span>
                <span className="reviews-label">{reviewCount} Verified Customer Reviews</span>
              </div>
            </div>

            {/* Price Block */}
            <div className="detail-price-box">
              <div className="detail-price-row">
                <span className="detail-price-main">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="detail-price-original">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="detail-savings-badge">
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
              <p className="detail-tax-note">Inclusive of all taxes. Free shipping on this order.</p>
            </div>

            {/* Stock status indicator */}
            <div className="detail-stock-row">
              <span className={`stock-indicator-dot ${maxStock > 0 ? "in-stock" : "out-of-stock"}`} />
              <span className="stock-status-text">
                {maxStock > 5
                  ? `In Stock (${maxStock} units ready for immediate dispatch)`
                  : maxStock > 0
                  ? `Hurry, only ${maxStock} units remaining!`
                  : "Currently Out of Stock"}
              </span>
            </div>

            {/* Narrative description */}
            <div className="detail-description-section">
              <p className="detail-narrative">{product.description}</p>
            </div>

            {/* Specifications / Highlights */}
            {product.features && product.features.length > 0 && (
              <div className="detail-features-box">
                <h4 className="features-title">Highlights & Craftsmanship</h4>
                <ul className="features-list">
                  {product.features.map((feature, i) => (
                    <li key={i} className="feature-item">
                      <Check size={14} className="feature-check-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="detail-purchase-section">
              <div className="quantity-selector-wrap">
                <span className="quantity-label">Quantity</span>
                <div className="quantity-stepper">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="stepper-value">{quantity}</span>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= maxStock}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="detail-action-buttons">
                <button
                  type="button"
                  className={`detail-add-cart-btn ${justAdded ? "added-success" : ""}`}
                  onClick={handleAdd}
                  disabled={maxStock <= 0}
                >
                  {justAdded ? (
                    <>
                      <Check size={18} />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Add to Bag · {formatPrice(product.price * quantity)}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className={`detail-wishlist-toggle ${isWishlisted ? "active" : ""}`}
                  onClick={() => onToggleWishlist(product)}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={18} className={isWishlisted ? "heart-filled" : ""} />
                </button>
              </div>
            </div>

            {/* Pin Code Delivery Check */}
            <div className="pincode-check-card">
              <div className="pincode-header">
                <Truck size={16} className="pincode-icon" />
                <span className="pincode-title">Estimated Delivery Checker</span>
              </div>
              <form onSubmit={handlePincodeCheck} className="pincode-form">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN Code (e.g. 400001)"
                  className="pincode-input"
                  aria-label="Enter PIN code"
                />
                <button type="submit" className="pincode-submit-btn">
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className={`pincode-feedback ${pincodeStatus.valid ? "success" : "error"}`}>
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            {/* Trust Assurance Strip */}
            <div className="detail-assurances">
              <div className="assurance-item">
                <ShieldCheck size={16} className="assurance-icon" />
                <span>100% Genuine Certified</span>
              </div>
              <div className="assurance-item">
                <RotateCcw size={16} className="assurance-icon" />
                <span>7-Day Doorstep Replacement</span>
              </div>
              <div className="assurance-item">
                <Truck size={16} className="assurance-icon" />
                <span>Tracked Express Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
