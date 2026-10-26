import { useState } from "react";
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  ShoppingBag,
  Heart,
  ChevronRight
} from "lucide-react";
import FallbackImage from "../components/FallbackImage";

export default function CartPage({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onExploreProducts,
  onNavigateProduct,
  formatPrice,
  onShowToast
}) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [savedForLater, setSavedForLater] = useState([]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const freeThreshold = 1999;
  const isFreeDelivery = subtotal >= freeThreshold || subtotal === 0;
  const shippingFee = isFreeDelivery ? 0 : 99;
  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  function handleApplyCoupon(e) {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }
    if (code === "SPHERE10" || code === "SPHERE") {
      setAppliedDiscount(10);
      onShowToast("Promo code SPHERE10 applied: 10% instant discount!", "success");
    } else {
      setCouponError("Invalid promo code. Try SPHERE10");
    }
  }

  function handleSaveForLater(item) {
    onRemoveItem(item.id);
    setSavedForLater((prev) => [...prev, item]);
    onShowToast(`Saved "${item.name}" for later`, "info");
  }

  function handleMoveBackToCart(item) {
    setSavedForLater((prev) => prev.filter((s) => s.id !== item.id));
    onUpdateQuantity(item.id, 1);
    onShowToast(`Moved "${item.name}" back to cart`, "success");
  }

  return (
    <div className="cart-page-layout">
      <div className="cart-page-container">
        {/* Breadcrumb */}
        <nav className="pdp-breadcrumbs">
          <button type="button" onClick={onExploreProducts}>Home</button>
          <ChevronRight size={13} />
          <span className="pdp-current-name">Shopping Cart</span>
        </nav>

        {cart.length === 0 ? (
          <div className="cart-empty-fullscreen-card">
            <div className="cart-empty-circle">
              <ShoppingBag size={56} className="cart-empty-icon" />
            </div>
            <h2>Your ShopSphere Cart is empty</h2>
            <p>Your shopping cart is waiting. Give it purpose — fill it with electronics, sneakers, and everyday carry.</p>
            <div className="empty-cart-buttons-row">
              <button
                type="button"
                className="cart-shop-deals-btn"
                onClick={onExploreProducts}
              >
                <span>Shop Today's Deals</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="cart-layout-columns">
            {/* Left 2/3: Items list */}
            <div className="cart-items-main-column">
              <div className="cart-main-card">
                <div className="cart-card-header">
                  <div>
                    <h1 className="cart-page-heading">Shopping Cart</h1>
                    <span className="cart-items-count-text">
                      {totalItems} {totalItems === 1 ? "item" : "items"} selected
                    </span>
                  </div>
                  <span className="cart-price-col-header">Price</span>
                </div>

                {/* Free shipping banner */}
                <div className="cart-free-shipping-indicator">
                  {isFreeDelivery ? (
                    <div className="free-ship-success">
                      <Check size={16} className="green-tick" />
                      <span>Part of your order qualifies for <strong>FREE Delivery</strong> across India.</span>
                    </div>
                  ) : (
                    <div className="free-ship-alert">
                      <span>Add <strong>{formatPrice(freeThreshold - subtotal)}</strong> of eligible items to get FREE Delivery.</span>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="cart-items-table">
                  {cart.map((item) => (
                    <article key={item.id} className="cart-item-card-row">
                      {/* Product Thumbnail */}
                      <div
                        className="cart-row-thumbnail"
                        onClick={() => onNavigateProduct(item)}
                      >
                        <FallbackImage
                          src={item.image}
                          alt={item.name}
                          category={item.category}
                        />
                      </div>

                      {/* Info & Controls */}
                      <div className="cart-row-info">
                        <div className="cart-row-title-price">
                          <h3
                            className="cart-row-product-title"
                            onClick={() => onNavigateProduct(item)}
                          >
                            {item.name}
                          </h3>
                          <span className="cart-row-price-val">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>

                        <span className="cart-row-stock-status">In Stock</span>
                        <span className="cart-row-delivery-estimate">
                          Eligible for FREE Delivery &amp; 7-Day Replacement
                        </span>

                        {/* Controls: Stepper, Delete, Save for Later */}
                        <div className="cart-row-actions-toolbar">
                          <div className="cart-item-stepper">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="stepper-count">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <span className="action-divider">|</span>

                          <button
                            type="button"
                            className="cart-text-action-btn delete"
                            onClick={() => onRemoveItem(item.id)}
                          >
                            Delete
                          </button>

                          <span className="action-divider">|</span>

                          <button
                            type="button"
                            className="cart-text-action-btn"
                            onClick={() => handleSaveForLater(item)}
                          >
                            Save for later
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Bottom Subtotal row */}
                <div className="cart-bottom-subtotal-row">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"}):</span>
                  <strong className="subtotal-bold-val">{formatPrice(subtotal)}</strong>
                </div>
              </div>

              {/* Saved For Later Section */}
              {savedForLater.length > 0 && (
                <div className="saved-for-later-card">
                  <h2 className="saved-heading">Saved for later ({savedForLater.length} items)</h2>
                  <div className="saved-items-list">
                    {savedForLater.map((saved) => (
                      <div key={saved.id} className="saved-item-row">
                        <div className="saved-thumb">
                          <FallbackImage src={saved.image} alt={saved.name} category={saved.category} />
                        </div>
                        <div className="saved-info">
                          <h4>{saved.name}</h4>
                          <span className="saved-price">{formatPrice(saved.price)}</span>
                          <button
                            type="button"
                            className="move-back-btn"
                            onClick={() => handleMoveBackToCart(saved)}
                          >
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 1/3: Sticky Order Summary & Checkout Box */}
            <aside className="cart-checkout-sidebar">
              <div className="cart-summary-box">
                {/* Free shipping reminder */}
                <div className="summary-free-ship-header">
                  <Check size={18} className="green-tick" />
                  <p>Your order is eligible for <strong>FREE Delivery</strong>.</p>
                </div>

                {/* Subtotal */}
                <div className="summary-subtotal-headline">
                  <span>Subtotal ({totalItems} items):</span>
                  <span className="summary-subtotal-val">{formatPrice(subtotal)}</span>
                </div>

                {/* Proceed to Buy button */}
                <button
                  type="button"
                  className="proceed-to-buy-btn"
                  onClick={onProceedToCheckout}
                >
                  <span>Proceed to Buy</span>
                  <ArrowRight size={17} />
                </button>

                {/* Coupon Code Box */}
                <div className="summary-coupon-section">
                  {appliedDiscount > 0 ? (
                    <div className="coupon-active-badge">
                      <Tag size={14} />
                      <span>Code <strong>SPHERE10</strong> applied ({appliedDiscount}% Off)</span>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="coupon-entry-form">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Apply Promo Code (SPHERE10)"
                        className="coupon-field"
                      />
                      <button type="submit" className="coupon-submit">Apply</button>
                    </form>
                  )}
                  {couponError && <span className="coupon-err">{couponError}</span>}
                </div>

                {/* Price Breakdown */}
                <div className="summary-breakdown-table">
                  <div className="breakdown-row">
                    <span>Items Total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="breakdown-row discount">
                      <span>Privilege Savings</span>
                      <span>- {formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="breakdown-row">
                    <span>Delivery Charge</span>
                    <span>{shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}</span>
                  </div>
                  <div className="breakdown-divider" />
                  <div className="breakdown-row grand-total">
                    <strong>Total Amount</strong>
                    <strong>{formatPrice(grandTotal)}</strong>
                  </div>
                </div>

                <div className="summary-protection-badge">
                  <ShieldCheck size={15} className="shield-icon" />
                  <span>100% Purchase Protection · 256-Bit SSL Encryption</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
