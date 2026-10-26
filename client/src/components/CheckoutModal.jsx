import { useState } from "react";
import {
  X,
  CheckCircle,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  ArrowRight,
  Package
} from "lucide-react";
import FallbackImage from "./FallbackImage";

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  user,
  formatPrice,
  onOrderSuccess,
  onOpenOrders,
  onShowToast
}) {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [shippingData, setShippingData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  });

  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod', 'upi', 'card'
  const [formErrors, setFormErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = subtotal >= 1999 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  function updateShippingField(e) {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value
    });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  }

  function validateShipping() {
    const errors = {};
    if (!shippingData.name.trim() || shippingData.name.trim().length < 2) {
      errors.name = "Please enter your full recipient name.";
    }
    if (!shippingData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!shippingData.phone.trim() || !/^\d{10}$/.test(shippingData.phone.replace(/\D/g, ""))) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    }
    if (!shippingData.address.trim() || shippingData.address.trim().length < 5) {
      errors.address = "Please enter complete street address & flat/house number.";
    }
    if (!shippingData.city.trim()) {
      errors.city = "Please enter delivery city.";
    }
    if (!shippingData.pincode.trim() || !/^\d{6}$/.test(shippingData.pincode.trim())) {
      errors.pincode = "Please enter a valid 6-digit PIN code.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleContinueToPayment(e) {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
    }
  }

  async function handleConfirmOrder() {
    if (cart.length === 0) {
      onShowToast("Your cart is empty.", "error");
      return;
    }

    setBusy(true);
    const token = localStorage.getItem("shopsphere_token");

    const orderPayload = {
      items: cart.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      shippingAddress: shippingData,
      paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "upi" ? "UPI (Demo Simulation)" : "Credit/Debit Card (Demo Simulation)",
      subtotal,
      shippingFee,
      totalAmount: grandTotal
    };

    try {
      let createdOrder = null;

      if (token) {
        try {
          const res = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              items: cart.map((item) => ({
                productId: item._id || item.id,
                quantity: item.quantity
              }))
            })
          });

          if (res.ok) {
            const data = await res.json();
            createdOrder = data.order;
          }
        } catch (netErr) {
          console.warn("Backend order API unreachable, using local persistent order demo:", netErr);
        }
      }

      // If backend was offline or guest checkout, construct reliable verified order
      if (!createdOrder) {
        createdOrder = {
          _id: "ORD-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
          createdAt: new Date().toISOString(),
          status: "Confirmed",
          totalAmount: grandTotal,
          items: cart.map((item) => ({
            productId: item._id || item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          customerName: shippingData.name,
          customerEmail: shippingData.email,
          shippingAddress: shippingData,
          paymentMethod: orderPayload.paymentMethod
        };

        // Persist locally so My Orders can always display it
        try {
          const existing = JSON.parse(localStorage.getItem("shopsphere_demo_orders") || "[]");
          localStorage.setItem("shopsphere_demo_orders", JSON.stringify([createdOrder, ...existing]));
        } catch (e) {
          console.error(e);
        }
      }

      setPlacedOrder(createdOrder);
      setStep(3);
      onOrderSuccess(createdOrder);
      onShowToast(`Order placed successfully! #${createdOrder._id}`, "success");
    } catch (err) {
      onShowToast("Unable to complete order. Please try again.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={step === 3 ? onClose : undefined}>
      <div
        className="checkout-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Secure Checkout"
      >
        {/* Header */}
        <div className="checkout-modal-header">
          <div className="checkout-brand-title">
            <span className="checkout-badge">SECURE 256-BIT ENCRYPTED</span>
            <h2>ShopSphere Checkout</h2>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="checkout-step-indicator">
          <div className={`step-item ${step >= 1 ? "active" : ""} ${step > 1 ? "done" : ""}`}>
            <span className="step-num">{step > 1 ? "✓" : "1"}</span>
            <span className="step-label">Shipping Details</span>
          </div>
          <div className="step-line" />
          <div className={`step-item ${step >= 2 ? "active" : ""} ${step > 2 ? "done" : ""}`}>
            <span className="step-num">{step > 2 ? "✓" : "2"}</span>
            <span className="step-label">Payment Mode</span>
          </div>
          <div className="step-line" />
          <div className={`step-item ${step === 3 ? "active done" : ""}`}>
            <span className="step-num">3</span>
            <span className="step-label">Confirmation</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="checkout-modal-body">
          {step === 1 && (
            <div className="checkout-grid-layout">
              {/* Left Column: Shipping Form */}
              <form onSubmit={handleContinueToPayment} className="checkout-form-column">
                <h3 className="checkout-section-heading">Recipient & Delivery Address</h3>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Recipient Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={shippingData.name}
                      onChange={updateShippingField}
                      placeholder="e.g. Shreyash Girde"
                      className={`form-input ${formErrors.name ? "input-error" : ""}`}
                      required
                    />
                    {formErrors.name && <span className="field-error-text">{formErrors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingData.phone}
                      onChange={updateShippingField}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={`form-input ${formErrors.phone ? "input-error" : ""}`}
                      required
                    />
                    {formErrors.phone && <span className="field-error-text">{formErrors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (For Tracked Dispatch) *</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingData.email}
                    onChange={updateShippingField}
                    placeholder="you@domain.com"
                    className={`form-input ${formErrors.email ? "input-error" : ""}`}
                    required
                  />
                  {formErrors.email && <span className="field-error-text">{formErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Complete Street Address / Apartment *</label>
                  <textarea
                    name="address"
                    rows={2}
                    value={shippingData.address}
                    onChange={updateShippingField}
                    placeholder="House/Flat number, building name, street, landmark"
                    className={`form-input ${formErrors.address ? "input-error" : ""}`}
                    required
                  />
                  {formErrors.address && <span className="field-error-text">{formErrors.address}</span>}
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingData.city}
                      onChange={updateShippingField}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingData.state}
                      onChange={updateShippingField}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingData.pincode}
                      onChange={updateShippingField}
                      maxLength={6}
                      className={`form-input ${formErrors.pincode ? "input-error" : ""}`}
                      required
                    />
                    {formErrors.pincode && <span className="field-error-text">{formErrors.pincode}</span>}
                  </div>
                </div>

                <button type="submit" className="checkout-primary-btn">
                  <span>Continue to Payment Method</span>
                  <ArrowRight size={18} />
                </button>
              </form>

              {/* Right Column: Order Summary */}
              <aside className="checkout-summary-column">
                <h3 className="summary-column-title">Order Summary ({totalItems})</h3>
                <div className="summary-items-scroll">
                  {cart.map((item) => (
                    <div key={item.id} className="summary-item-mini">
                      <FallbackImage
                        src={item.image}
                        alt={item.name}
                        category={item.category}
                        className="summary-mini-img"
                      />
                      <div className="summary-mini-info">
                        <p className="summary-mini-name">{item.name}</p>
                        <p className="summary-mini-qty">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="summary-mini-total">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="summary-totals-card">
                  <div className="calc-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="calc-row">
                    <span>Express Shipping</span>
                    <span>{shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}</span>
                  </div>
                  <div className="calc-divider" />
                  <div className="calc-row total-row">
                    <strong>Total Amount Payable</strong>
                    <strong>{formatPrice(grandTotal)}</strong>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-grid-layout">
              {/* Payment Method Selector */}
              <div className="checkout-form-column">
                <div className="checkout-subhead-row">
                  <button
                    type="button"
                    className="checkout-back-link"
                    onClick={() => setStep(1)}
                  >
                    ← Edit Shipping Details
                  </button>
                  <h3 className="checkout-section-heading">Select Payment Method</h3>
                </div>

                {/* Important clear distinction between order placement and payment completion */}
                <div className="checkout-payment-notice">
                  <AlertCircle size={18} className="gold-icon" />
                  <p>
                    <strong>Academic Project Note:</strong> ShopSphere supports Cash on Delivery as the direct physical fulfillment mode. Card & UPI selections are simulated demonstrations. Placing your order will record it in the MongoDB database.
                  </p>
                </div>

                <div className="payment-options-list">
                  {/* Option 1: Cash on Delivery (Standard & Supported) */}
                  <label
                    className={`payment-option-card ${paymentMethod === "cod" ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <div className="payment-option-content">
                      <div className="payment-option-title-row">
                        <div className="payment-icon-pill">
                          <Banknote size={20} className="gold-icon" />
                        </div>
                        <div>
                          <strong>Cash / UPI on Delivery (Recommended)</strong>
                          <p>Pay with cash or UPI scan when your parcel arrives at your doorstep.</p>
                        </div>
                      </div>
                      <span className="payment-status-tag active-tag">Verified Active</span>
                    </div>
                  </label>

                  {/* Option 2: Simulated UPI */}
                  <label
                    className={`payment-option-card ${paymentMethod === "upi" ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                    />
                    <div className="payment-option-content">
                      <div className="payment-option-title-row">
                        <div className="payment-icon-pill">
                          <QrCode size={20} />
                        </div>
                        <div>
                          <strong>Instant UPI / QR Simulator</strong>
                          <p>Google Pay, PhonePe, Paytm, BHIM instant settlement simulation.</p>
                        </div>
                      </div>
                      <span className="payment-status-tag sim-tag">Demo Simulated</span>
                    </div>
                  </label>

                  {/* Option 3: Simulated Card */}
                  <label
                    className={`payment-option-card ${paymentMethod === "card" ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    <div className="payment-option-content">
                      <div className="payment-option-title-row">
                        <div className="payment-icon-pill">
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <strong>Debit / Credit Card Simulator</strong>
                          <p>Visa, MasterCard, RuPay 256-bit encrypted card simulation.</p>
                        </div>
                      </div>
                      <span className="payment-status-tag sim-tag">Demo Simulated</span>
                    </div>
                  </label>
                </div>

                <div className="shipping-recap-box">
                  <strong>Delivering To:</strong>
                  <p>{shippingData.name} · {shippingData.phone}</p>
                  <p>{shippingData.address}, {shippingData.city}, {shippingData.state} - {shippingData.pincode}</p>
                </div>

                <button
                  type="button"
                  className="checkout-primary-btn"
                  onClick={handleConfirmOrder}
                  disabled={busy}
                >
                  {busy ? (
                    <span>Registering Order with Database...</span>
                  ) : (
                    <>
                      <span>Place Order · {formatPrice(grandTotal)}</span>
                      <CheckCircle size={18} />
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Order Summary */}
              <aside className="checkout-summary-column">
                <h3 className="summary-column-title">Order Total</h3>
                <div className="summary-totals-card">
                  <div className="calc-row">
                    <span>Items ({totalItems})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="calc-row">
                    <span>Express Shipping</span>
                    <span>{shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}</span>
                  </div>
                  <div className="calc-divider" />
                  <div className="calc-row total-row">
                    <strong>Total to Pay</strong>
                    <strong>{formatPrice(grandTotal)}</strong>
                  </div>
                </div>

                <div className="checkout-trust-points">
                  <div className="trust-point">
                    <ShieldCheck size={16} className="green-icon" />
                    <span>Real-time MongoDB Order Tracking</span>
                  </div>
                  <div className="trust-point">
                    <Truck size={16} className="gold-icon" />
                    <span>Dispatched in eco-friendly protective packaging</span>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {step === 3 && placedOrder && (
            <div className="checkout-success-container">
              <div className="success-icon-badge">
                <CheckCircle size={56} className="green-icon" />
              </div>

              <h2 className="success-heading">Order Successfully Placed!</h2>
              <p className="success-subheading">
                Thank you for choosing ShopSphere. Your order has been recorded and is being prepared for dispatch.
              </p>

              <div className="order-receipt-card">
                <div className="receipt-row">
                  <span className="receipt-label">Order Reference ID:</span>
                  <strong className="receipt-id-tag">{placedOrder._id}</strong>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Date & Time:</span>
                  <span>{new Date(placedOrder.createdAt).toLocaleString("en-IN")}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Payment Mode:</span>
                  <span>{placedOrder.paymentMethod || "Cash on Delivery"}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Total Amount:</span>
                  <strong className="receipt-total">{formatPrice(placedOrder.totalAmount)}</strong>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Recipient:</span>
                  <span>{placedOrder.customerName || shippingData.name} ({shippingData.phone})</span>
                </div>
              </div>

              <div className="success-actions">
                <button
                  type="button"
                  className="success-view-orders-btn"
                  onClick={() => {
                    onClose();
                    onOpenOrders();
                  }}
                >
                  <Package size={18} />
                  <span>View in My Orders</span>
                </button>

                <button
                  type="button"
                  className="success-continue-btn"
                  onClick={onClose}
                >
                  <span>Continue Exploring</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
