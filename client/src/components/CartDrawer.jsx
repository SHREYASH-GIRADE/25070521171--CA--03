import { useState } from "react";
import {
  X,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check
} from "lucide-react";
import FallbackImage from "./FallbackImage";

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  formatPrice,
  onExploreProducts,
  onShowToast
}) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percent
  const [couponError, setCouponError] = useState("");

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Free delivery threshold: ₹1,999
  const freeShippingThreshold = 1999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  function handleApplyCoupon(e) {
    e.preventDefault();
    setCouponError("");

    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a promotion code.");
      return;
    }

    if (code === "SPHERE10" || code === "SPHERE") {
      setAppliedDiscount(10);
      onShowToast("Code SPHERE10 applied! 10% privilege discount added.", "success");
    } else if (code === "WELCOME20") {
      setAppliedDiscount(20);
      onShowToast("Code WELCOME20 applied! 20% privilege discount added.", "success");
    } else {
      setCouponError("Invalid or expired promotional code. Try SPHERE10");
    }
  }

  function handleRemoveCoupon() {
    setAppliedDiscount(0);
    setCouponCode("");
    onShowToast("Promotional discount removed", "info");
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Shopping Bag"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <ShoppingBag size={20} className="gold-icon" />
            <h2 className="drawer-title">Shopping Bag</h2>
            <span className="drawer-count-pill">{totalItems}</span>
          </div>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {subtotal > 0 && (
          <div className="free-shipping-bar">
            {subtotal >= freeShippingThreshold ? (
              <div className="free-shipping-achieved">
                <Check size={14} className="green-icon" />
                <span>You have unlocked <strong>Complimentary Express Delivery</strong>!</span>
              </div>
            ) : (
              <div className="free-shipping-needed">
                <span>
                  Add <strong>{formatPrice(freeShippingThreshold - subtotal)}</strong> more for Complimentary Express Shipping
                </span>
                <div className="shipping-progress-track">
                  <div
                    className="shipping-progress-fill"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Drawer Content */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-cart-orb">
                <ShoppingBag size={48} className="empty-cart-svg" />
              </div>
              <h3 className="empty-cart-heading">Your shopping bag is empty</h3>
              <p className="empty-cart-text">
                Your curated selections will appear here. Discover our limited editions,
                precision electronics, and tailored essentials.
              </p>
              <button
                type="button"
                className="empty-cart-cta"
                onClick={() => {
                  onClose();
                  onExploreProducts();
                }}
              >
                <span>Explore Catalog</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => {
                const lineTotal = item.price * item.quantity;
                return (
                  <article key={item.id} className="cart-item-row">
                    <div className="cart-item-thumbnail">
                      <FallbackImage
                        src={item.image}
                        alt={item.name}
                        category={item.category}
                        className="cart-thumb-img"
                      />
                    </div>

                    <div className="cart-item-details">
                      <div className="cart-item-meta">
                        <span className="cart-item-category">{item.category}</span>
                        <button
                          type="button"
                          className="cart-item-delete"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <h4 className="cart-item-title">{item.name}</h4>

                      <div className="cart-item-unit-price">
                        {formatPrice(item.price)} each
                      </div>

                      <div className="cart-item-bottom-row">
                        {/* Quantity Stepper */}
                        <div className="cart-stepper">
                          <button
                            type="button"
                            className="cart-stepper-btn"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="cart-stepper-val">{item.quantity}</span>
                          <button
                            type="button"
                            className="cart-stepper-btn"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Line Total */}
                        <span className="cart-item-total">{formatPrice(lineTotal)}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer with calculation */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Promo Code Input */}
            <div className="cart-promo-section">
              {appliedDiscount > 0 ? (
                <div className="promo-applied-tag">
                  <div className="promo-tag-info">
                    <Tag size={14} className="gold-icon" />
                    <span>Code <strong>SPHERE10</strong> applied ({appliedDiscount}% Off)</span>
                  </div>
                  <button
                    type="button"
                    className="promo-remove-btn"
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="promo-input-form">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Promotional code (try SPHERE10)"
                    className="promo-input"
                    aria-label="Promotional Code"
                  />
                  <button type="submit" className="promo-apply-btn">
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="promo-error-msg">{couponError}</p>}
            </div>

            {/* Price Calculations */}
            <div className="cart-calculation-breakdown">
              <div className="calc-row">
                <span className="calc-label">Subtotal ({totalItems} items)</span>
                <span className="calc-val">{formatPrice(subtotal)}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="calc-row discount-row">
                  <span className="calc-label">Privilege Discount</span>
                  <span className="calc-val">- {formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="calc-row">
                <span className="calc-label">Estimated Shipping</span>
                <span className="calc-val">
                  {shippingFee === 0 ? (
                    <span className="free-shipping-tag">FREE</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              <div className="calc-divider" />

              <div className="calc-row total-row">
                <span className="calc-total-label">Estimated Total</span>
                <span className="calc-total-val">{formatPrice(grandTotal)}</span>
              </div>
              <p className="tax-inclusive-caption">Includes all local taxes and freight duties.</p>
            </div>

            {/* Checkout Action */}
            <button
              type="button"
              className="cart-checkout-btn"
              onClick={() => {
                onClose();
                onProceedToCheckout({
                  subtotal,
                  discountAmount,
                  shippingFee,
                  grandTotal,
                  items: cart
                });
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div className="cart-security-badge">
              <ShieldCheck size={14} className="green-icon" />
              <span>256-bit encrypted checkout · 7-day guarantee</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
