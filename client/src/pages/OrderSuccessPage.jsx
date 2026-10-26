import {
  CheckCircle2,
  Package,
  ArrowRight,
  Truck,
  Copy,
  Check,
  Calendar,
  MapPin,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import FallbackImage from "../components/FallbackImage";

export default function OrderSuccessPage({
  order,
  formatPrice,
  onGoToOrders,
  onContinueShopping,
  onShowToast
}) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  function copyOrderId() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(order._id);
      setCopied(true);
      onShowToast("Order ID copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="order-success-page-layout">
      <div className="order-success-container">
        {/* Top Celebration Card */}
        <div className="order-success-hero-card">
          <div className="success-check-badge">
            <CheckCircle2 size={54} className="success-icon-green" />
          </div>

          <h1 className="success-main-title">Order Placed, thank you!</h1>
          <p className="success-sub">
            Confirmation and dispatch tracking will be updated in real time in your account.
          </p>

          <div className="success-order-id-pill">
            <span>Order #: <strong>{order._id}</strong></span>
            <button type="button" onClick={copyOrderId} title="Copy Order ID">
              {copied ? <Check size={14} className="green-tick" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Order Details & Tracking Card */}
        <div className="order-details-summary-card">
          <div className="summary-card-header">
            <div className="header-meta-item">
              <span className="meta-label">ORDER PLACED</span>
              <span className="meta-val">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            <div className="header-meta-item">
              <span className="meta-label">TOTAL</span>
              <span className="meta-val">{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="header-meta-item">
              <span className="meta-label">SHIP TO</span>
              <span className="meta-val">{order.customerName || "Customer"}</span>
            </div>
          </div>

          {/* Progress Tracking Bar */}
          <div className="order-tracking-strip">
            <div className="tracking-step completed">
              <span className="step-dot" />
              <span className="step-name">Ordered</span>
            </div>
            <div className="tracking-connector completed" />
            <div className="tracking-step completed">
              <span className="step-dot" />
              <span className="step-name">Confirmed</span>
            </div>
            <div className="tracking-connector" />
            <div className="tracking-step">
              <span className="step-dot" />
              <span className="step-name">Dispatched</span>
            </div>
            <div className="tracking-connector" />
            <div className="tracking-step">
              <span className="step-dot" />
              <span className="step-name">Delivered</span>
            </div>
          </div>

          {/* Items List */}
          <div className="success-items-list">
            <h3 className="items-title">Items in this delivery</h3>
            {order.items && order.items.map((item, i) => (
              <div key={item._id || i} className="success-item-row">
                <div className="item-thumb-box">
                  <FallbackImage src={item.image} alt={item.name} category={item.category} />
                </div>
                <div className="item-details">
                  <h4>{item.name || "Curated Item"}</h4>
                  <span className="item-qty-tag">Quantity: {item.quantity}</span>
                  <span className="item-price-tag">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Payment notes */}
          <div className="success-footer-notes">
            <div className="footer-note-col">
              <MapPin size={16} className="note-ico" />
              <div>
                <strong>Delivery Address:</strong>
                <p>
                  {order.shippingAddress ? (
                    `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
                  ) : (
                    "Mumbai, Maharashtra 400001"
                  )}
                </p>
              </div>
            </div>

            <div className="footer-note-col">
              <Truck size={16} className="note-ico" />
              <div>
                <strong>Payment Mode:</strong>
                <p>{order.paymentMethod || "Cash on Delivery"}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="success-action-buttons">
            <button
              type="button"
              className="view-orders-action-btn"
              onClick={onGoToOrders}
            >
              <Package size={17} />
              <span>Go to My Orders</span>
            </button>

            <button
              type="button"
              className="continue-shopping-action-btn"
              onClick={onContinueShopping}
            >
              <span>Continue Shopping</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
