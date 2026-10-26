import { useState, useEffect } from "react";
import {
  Package,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
  Copy,
  Check,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import FallbackImage from "./FallbackImage";

export default function OrderHistory({
  formatPrice,
  onGoHome,
  onShowToast
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  async function fetchOrders() {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("shopsphere_token");
    let fetchedOrders = [];

    // 1. Try fetching from MongoDB API
    if (token) {
      try {
        const res = await fetch("http://localhost:5000/api/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            fetchedOrders = data;
          }
        }
      } catch (err) {
        console.warn("Could not connect to MongoDB orders API:", err);
      }
    }

    // 2. Merge with locally saved persistent orders
    try {
      const localOrders = JSON.parse(localStorage.getItem("shopsphere_demo_orders") || "[]");
      const combined = [...fetchedOrders];
      localOrders.forEach((lo) => {
        if (!combined.some((o) => o._id === lo._id)) {
          combined.push(lo);
        }
      });
      // Sort newest first
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(combined);
    } catch (e) {
      setOrders(fetchedOrders);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  function handleCopyOrderId(id) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      onShowToast("Order ID copied to clipboard", "success");
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  function getStatusBadge(status) {
    const s = (status || "Pending").toLowerCase();
    switch (s) {
      case "confirmed":
      case "processing":
        return (
          <span className="order-status-badge status-confirmed">
            <CheckCircle2 size={13} />
            <span>Confirmed</span>
          </span>
        );
      case "shipped":
        return (
          <span className="order-status-badge status-shipped">
            <Truck size={13} />
            <span>Shipped</span>
          </span>
        );
      case "delivered":
        return (
          <span className="order-status-badge status-delivered">
            <CheckCircle2 size={13} />
            <span>Delivered</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="order-status-badge status-cancelled">
            <RotateCcw size={13} />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="order-status-badge status-pending">
            <Clock size={13} />
            <span>Pending</span>
          </span>
        );
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true;
    return (order.status || "Pending").toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <main className="orders-page-container">
      {/* Top Navigation Row */}
      <div className="orders-top-nav">
        <button type="button" className="orders-back-btn" onClick={onGoHome}>
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </button>

        <button
          type="button"
          className="orders-refresh-btn"
          onClick={fetchOrders}
          disabled={loading}
          title="Refresh orders from MongoDB"
        >
          <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Page Header */}
      <div className="orders-header">
        <div>
          <span className="orders-eyebrow">CUSTOMER PORTAL</span>
          <h1 className="orders-title">My Order History</h1>
          <p className="orders-subtitle">
            Review live order statuses, dispatch tracking, and receipts stored in your ShopSphere account.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="orders-filter-tabs">
          <button
            type="button"
            className={`filter-tab-btn ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All Orders ({orders.length})
          </button>
          <button
            type="button"
            className={`filter-tab-btn ${statusFilter === "confirmed" ? "active" : ""}`}
            onClick={() => setStatusFilter("confirmed")}
          >
            Confirmed
          </button>
          <button
            type="button"
            className={`filter-tab-btn ${statusFilter === "shipped" ? "active" : ""}`}
            onClick={() => setStatusFilter("shipped")}
          >
            Shipped
          </button>
          <button
            type="button"
            className={`filter-tab-btn ${statusFilter === "delivered" ? "active" : ""}`}
            onClick={() => setStatusFilter("delivered")}
          >
            Delivered
          </button>
        </div>
      </div>

      {/* Orders Content */}
      <div className="orders-content-wrapper">
        {loading ? (
          <div className="orders-loading-state">
            <div className="orders-skeleton-card" />
            <div className="orders-skeleton-card" />
          </div>
        ) : error ? (
          <div className="orders-error-card">
            <p>{error}</p>
            <button type="button" className="retry-btn" onClick={fetchOrders}>
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="orders-empty-state">
            <div className="empty-orders-orb">
              <Package size={48} className="empty-orders-svg" />
            </div>
            <h3 className="empty-orders-heading">No orders found</h3>
            <p className="empty-orders-sub">
              {statusFilter === "all"
                ? "You haven't placed any orders yet. Discover our curated collections."
                : `No orders matching filter '${statusFilter}'.`}
            </p>
            <button type="button" className="empty-orders-cta" onClick={onGoHome}>
              <ShoppingBag size={16} />
              <span>Explore Collection</span>
            </button>
          </div>
        ) : (
          <div className="orders-cards-list">
            {filteredOrders.map((order) => {
              const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              });
              const orderTime = new Date(order.createdAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <article key={order._id} className="order-history-card">
                  {/* Order Card Header */}
                  <div className="order-card-header">
                    <div className="order-card-id-block">
                      <div className="order-id-label-row">
                        <span className="order-label-caption">ORDER PLACED</span>
                        <div className="order-id-copy-wrap">
                          <strong className="order-id-string">#{order._id}</strong>
                          <button
                            type="button"
                            className="order-copy-btn"
                            onClick={() => handleCopyOrderId(order._id)}
                            title="Copy Order Reference"
                          >
                            {copiedId === order._id ? (
                              <Check size={13} className="green-icon" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="order-date-row">
                        <span>{orderDate} at {orderTime}</span>
                        {order.paymentMethod && (
                          <span className="order-payment-pill">
                            {order.paymentMethod}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="order-card-status-block">
                      {getStatusBadge(order.status)}
                      <span className="order-card-total-val">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Order Progress Visual Timeline */}
                  <div className="order-progress-timeline">
                    <div className="timeline-step completed">
                      <div className="timeline-dot" />
                      <span className="timeline-label">Order Placed</span>
                    </div>
                    <div className="timeline-bar completed" />
                    <div className={`timeline-step ${order.status !== "Pending" ? "completed" : "active"}`}>
                      <div className="timeline-dot" />
                      <span className="timeline-label">Confirmed</span>
                    </div>
                    <div className={`timeline-bar ${order.status === "Shipped" || order.status === "Delivered" ? "completed" : ""}`} />
                    <div className={`timeline-step ${order.status === "Shipped" || order.status === "Delivered" ? "completed" : ""}`}>
                      <div className="timeline-dot" />
                      <span className="timeline-label">Dispatched</span>
                    </div>
                    <div className={`timeline-bar ${order.status === "Delivered" ? "completed" : ""}`} />
                    <div className={`timeline-step ${order.status === "Delivered" ? "completed" : ""}`}>
                      <div className="timeline-dot" />
                      <span className="timeline-label">Delivered</span>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="order-items-grid">
                    {order.items && order.items.map((item, idx) => (
                      <div key={item._id || idx} className="order-item-mini-card">
                        <div className="order-item-img-wrap">
                          <FallbackImage
                            src={item.image}
                            alt={item.name}
                            className="order-item-thumb"
                          />
                        </div>
                        <div className="order-item-info">
                          <h4 className="order-item-name">{item.name || "Curated Item"}</h4>
                          <p className="order-item-qty-price">
                            Qty: {item.quantity} · {formatPrice(item.price)} each
                          </p>
                        </div>
                        <span className="order-item-subtotal">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer Info */}
                  <div className="order-card-footer">
                    <div className="order-recipient-info">
                      <span className="recipient-label">Recipient:</span>
                      <span className="recipient-name">
                        {order.customerName || "ShopSphere Customer"}
                      </span>
                      {order.customerEmail && (
                        <span className="recipient-email">({order.customerEmail})</span>
                      )}
                    </div>

                    <div className="order-card-actions">
                      <button
                        type="button"
                        className="order-invoice-btn"
                        onClick={() => onShowToast(`Invoice generated for order #${order._id}`, "success")}
                      >
                        <span>Download Invoice</span>
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
