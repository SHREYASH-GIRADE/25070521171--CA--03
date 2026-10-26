import { useState } from "react";
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Share2,
  MapPin,
  Tag,
  CreditCard,
  ThumbsUp,
  Award,
  PackageCheck
} from "lucide-react";
import FallbackImage from "../components/FallbackImage";
import ProductCard from "../components/ProductCard";

export default function ProductDetailPage({
  product,
  allProducts,
  onAddToCart,
  onBuyNow,
  formatPrice,
  isWishlisted,
  onToggleWishlist,
  onNavigateProduct,
  onBackToHome,
  onShowToast
}) {
  const [selectedImg, setSelectedImg] = useState(product?.image);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("400001");
  const [pinChecked, setPinChecked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'specs', 'reviews'

  if (!product) return null;

  const gallery = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  const rating = product.rating || 4.8;
  const reviewCount = product.reviewCount || 1420;
  const inStock = product.stock !== undefined ? product.stock > 0 : true;

  // Real specifications table
  const specs = [
    { label: "Brand", value: product.brand || "ShopSphere Signature" },
    { label: "Model / SKU", value: product.sku || "SS-PROD-2026" },
    { label: "Category", value: product.category },
    { label: "Sub-Category", value: product.subCategory || "General" },
    { label: "Item Condition", value: "100% Brand New · Factory Sealed" },
    { label: "Warranty", value: "1 Year Manufacturer Comprehensive Warranty" },
    { label: "Return Policy", value: "7 Days Doorstep Replacement Guarantee" },
    { label: "Origin", value: "Certified Licensed Manufacturer" }
  ];

  // Customer reviews
  const customerReviews = [
    {
      author: "Aditya Verma",
      rating: 5,
      date: "22 October 2026",
      verified: true,
      headline: "Exceeded expectations! Build quality is phenomenal.",
      text: "The delivery was lightning-fast (arrived the very next day). The packaging was premium, and the product performs even better than advertised. Definitely recommending ShopSphere to friends."
    },
    {
      author: "Pooja Sharma",
      rating: 5,
      date: "18 October 2026",
      verified: true,
      headline: "100% authentic. Worth every rupee.",
      text: "Checked the serial number and it's genuine. Everything works seamlessly. Great customer support when I inquired about the warranty."
    },
    {
      author: "Rohan Kulkarni",
      rating: 4,
      date: "14 October 2026",
      verified: true,
      headline: "Great product, excellent battery and finish.",
      text: "Very satisfied with the purchase. Beautiful styling and comfortable for daily use. Delivery was smooth."
    }
  ];

  // Related products
  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast("Product link copied to clipboard!", "success");
    }
  }

  function handlePincodeSubmit(e) {
    e.preventDefault();
    if (/^\d{6}$/.test(pincode.trim())) {
      setPinChecked(true);
      onShowToast(`Delivery verified for PIN ${pincode}: Free delivery available!`, "success");
    } else {
      onShowToast("Please enter a valid 6-digit PIN code", "error");
    }
  }

  return (
    <div className="product-page-layout">
      <div className="product-page-container">
        {/* Breadcrumb Navigation */}
        <nav className="pdp-breadcrumbs" aria-label="Breadcrumb">
          <button type="button" onClick={onBackToHome}>Home</button>
          <ChevronRight size={13} />
          <button type="button" onClick={onBackToHome}>{product.category}</button>
          {product.subCategory && (
            <>
              <ChevronRight size={13} />
              <span>{product.subCategory}</span>
            </>
          )}
          <ChevronRight size={13} />
          <span className="pdp-current-name">{product.name}</span>
        </nav>

        {/* 3-Column PDP Grid: Gallery | Info & Specs | Buy Box */}
        <div className="pdp-main-grid">
          {/* Column 1: Multi-Image Gallery */}
          <div className="pdp-gallery-column">
            <div className="pdp-gallery-inner">
              {/* Thumbnails strip */}
              <div className="pdp-thumbs-vertical">
                {gallery.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`pdp-thumb-tile ${selectedImg === imgUrl ? "selected" : ""}`}
                    onClick={() => setSelectedImg(imgUrl)}
                  >
                    <FallbackImage src={imgUrl} alt={`${product.name} ${i}`} category={product.category} />
                  </button>
                ))}
              </div>

              {/* Main Image Showcase */}
              <div className="pdp-main-showcase">
                <FallbackImage
                  src={selectedImg}
                  alt={product.name}
                  category={product.category}
                  className="pdp-showcase-img"
                />
                {product.discount && (
                  <span className="pdp-floating-discount">{product.discount}</span>
                )}
                <button
                  type="button"
                  className="pdp-share-btn"
                  onClick={handleShare}
                  title="Share product"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Product Information & Specifications */}
          <div className="pdp-info-column">
            {/* Brand Link */}
            <span className="pdp-brand-link">
              Brand: <strong>{product.brand || product.category}</strong>
            </span>

            <h1 className="pdp-title">{product.name}</h1>

            {/* Ratings Summary */}
            <div className="pdp-ratings-block">
              <div className="pdp-rating-badge">
                <span>{rating.toFixed(1)}</span>
                <Star size={12} fill="#FFFFFF" color="#FFFFFF" />
              </div>
              <span className="pdp-review-count">
                {reviewCount.toLocaleString()} ratings &amp; 380+ customer reviews
              </span>
              <span className="pdp-assured-pill">
                <ShieldCheck size={13} />
                <span>ShopSphere Assured</span>
              </span>
            </div>

            <div className="pdp-divider" />

            {/* Price Box */}
            <div className="pdp-price-section">
              <div className="pdp-price-row">
                {product.discount && (
                  <span className="pdp-discount-rate">{product.discount}</span>
                )}
                <span className="pdp-main-price">{formatPrice(product.price)}</span>
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="pdp-mrp-row">
                  <span>M.R.P.: <del>{formatPrice(product.originalPrice)}</del></span>
                  <span className="pdp-save-green">
                    You Save: {formatPrice(product.originalPrice - product.price)}
                  </span>
                </div>
              )}
              <span className="pdp-taxes-note">Inclusive of all taxes. Free shipping on this order.</span>
              <div className="pdp-emi-tag">
                <CreditCard size={13} className="emi-icon" />
                <span>EMI starts at ₹138/month. No Cost EMI available.</span>
              </div>
            </div>

            <div className="pdp-divider" />

            {/* Bank & Promotional Offers Carousel */}
            <div className="pdp-offers-box">
              <div className="offers-header-row">
                <Tag size={15} className="offers-icon" />
                <strong>Available Offers &amp; Bank Discounts</strong>
              </div>
              <div className="offers-cards-grid">
                <div className="offer-tile">
                  <span className="offer-tag">Bank Offer</span>
                  <p>10% Instant Discount up to ₹1,250 on HDFC &amp; ICICI Bank Credit Cards.</p>
                </div>
                <div className="offer-tile">
                  <span className="offer-tag">Privilege Code</span>
                  <p>Use coupon code <strong>SPHERE10</strong> at checkout for extra 10% savings.</p>
                </div>
                <div className="offer-tile">
                  <span className="offer-tag">Partner Offer</span>
                  <p>Get GST invoice and save up to 28% on business purchases.</p>
                </div>
              </div>
            </div>

            {/* Product Narrative & Highlights */}
            <div className="pdp-description-block">
              <h3 className="pdp-section-subhead">About this item</h3>
              <p className="pdp-narrative">{product.description}</p>
              {product.features && (
                <ul className="pdp-features-bullets">
                  {product.features.map((feat, idx) => (
                    <li key={idx}>
                      <Check size={14} className="feature-tick" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Technical Specifications Table */}
            <div className="pdp-specs-block">
              <h3 className="pdp-section-subhead">Technical Details</h3>
              <table className="pdp-specs-table">
                <tbody>
                  {specs.map((s, idx) => (
                    <tr key={idx}>
                      <td className="spec-label">{s.label}</td>
                      <td className="spec-value">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Column 3: Amazon-Style Buy Box */}
          <aside className="pdp-buybox-column">
            <div className="pdp-buybox-card">
              <div className="buybox-price-header">
                <span className="buybox-price">{formatPrice(product.price)}</span>
                <span className="buybox-free-delivery">FREE delivery</span>
              </div>

              <div className="buybox-delivery-timing">
                <span>Arrives: <strong>{product.deliveryDate || "Tomorrow by 2 PM"}</strong></span>
              </div>

              {/* Pin Code Delivery Checker */}
              <div className="buybox-pin-checker">
                <div className="pin-title-row">
                  <MapPin size={14} className="pin-ico" />
                  <span>Deliver to:</span>
                </div>
                <form onSubmit={handlePincodeSubmit} className="pin-form-inline">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit PIN"
                    className="pin-box-input"
                  />
                  <button type="submit" className="pin-check-btn">Apply</button>
                </form>
                {pinChecked && (
                  <p className="pin-valid-msg">✓ Available for Fast Delivery to {pincode}</p>
                )}
              </div>

              {/* Stock Status */}
              <div className="buybox-stock-status">
                {inStock ? (
                  <span className="stock-green">In Stock</span>
                ) : (
                  <span className="stock-red">Currently Unavailable</span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="buybox-quantity-row">
                <label htmlFor="pdpQuantity">Quantity:</label>
                <select
                  id="pdpQuantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="buybox-qty-select"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="buybox-buttons">
                <button
                  type="button"
                  className="buybox-cart-btn"
                  onClick={() => onAddToCart(product, quantity)}
                >
                  <ShoppingCart size={17} />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  className="buybox-buynow-btn"
                  onClick={() => onBuyNow(product, quantity)}
                >
                  <Zap size={17} />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                className={`buybox-wishlist-btn ${isWishlisted ? "active" : ""}`}
                onClick={() => onToggleWishlist(product)}
              >
                <Heart size={16} className={isWishlisted ? "heart-filled" : ""} />
                <span>{isWishlisted ? "Saved in Wishlist" : "Add to Wishlist"}</span>
              </button>

              {/* Seller & Trust Details */}
              <div className="buybox-seller-info">
                <div className="seller-row">
                  <span className="seller-label">Ships from</span>
                  <span className="seller-val">ShopSphere Fulfillment</span>
                </div>
                <div className="seller-row">
                  <span className="seller-label">Sold by</span>
                  <span className="seller-val">ShopSphere Retail India</span>
                </div>
                <div className="seller-row">
                  <span className="seller-label">Returns</span>
                  <span className="seller-val">7-Day Replacement</span>
                </div>
                <div className="seller-row">
                  <span className="seller-label">Payment</span>
                  <span className="seller-val">Secure Transaction · COD Available</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Customer Reviews & Ratings Breakdown */}
        <section className="pdp-reviews-section">
          <div className="reviews-section-header">
            <h2>Customer Reviews &amp; Ratings</h2>
          </div>

          <div className="reviews-layout-grid">
            {/* Left Breakdown */}
            <div className="reviews-breakdown-card">
              <div className="big-rating-number">{rating.toFixed(1)}</div>
              <div className="breakdown-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <span className="breakdown-total">{reviewCount.toLocaleString()} global ratings</span>

              <div className="rating-bars-list">
                {[
                  { stars: 5, pct: "82%" },
                  { stars: 4, pct: "12%" },
                  { stars: 3, pct: "4%" },
                  { stars: 2, pct: "1%" },
                  { stars: 1, pct: "1%" }
                ].map((bar) => (
                  <div key={bar.stars} className="rating-bar-row">
                    <span className="bar-star-num">{bar.stars} star</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: bar.pct }} />
                    </div>
                    <span className="bar-pct">{bar.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Verified Reviews */}
            <div className="reviews-cards-list">
              {customerReviews.map((rev, i) => (
                <div key={i} className="customer-review-card">
                  <div className="reviewer-header">
                    <div className="reviewer-avatar">{rev.author.charAt(0)}</div>
                    <div>
                      <span className="reviewer-name">{rev.author}</span>
                      {rev.verified && (
                        <span className="verified-badge">
                          <Check size={11} /> Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="review-stars-date">
                    <div className="rev-stars">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} size={12} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                    <strong className="review-headline">{rev.headline}</strong>
                  </div>

                  <span className="review-date-text">Reviewed in India on {rev.date}</span>
                  <p className="review-comment-body">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Similar / Related Products Strip */}
        {related.length > 0 && (
          <section className="pdp-related-section">
            <h2 className="related-title">Customers Also Viewed</h2>
            <div className="ecomm-product-grid">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  formatPrice={formatPrice}
                  onOpenProduct={() => onNavigateProduct(p)}
                  onAddToCart={(prod) => onAddToCart(prod, 1)}
                  isWishlisted={false}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
