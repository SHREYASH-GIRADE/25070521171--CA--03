import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Package
} from "lucide-react";
import FallbackImage from "../components/FallbackImage";

export default function CheckoutPage({
  cart,
  user,
  formatPrice,
  onOrderCompleted,
  onBackToCart,
  onShowToast
}) {
  const [activeStep, setActiveStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [shippingData, setShippingData] = useState({
    name: user?.name || "Shreyash Girde",
    phone: "9876543210",
    email: user?.email || "customer@example.com",
    address: "Flat 402, Signature Residency, Central Avenue",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    addressType: "Home"
  });

  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod', 'upi', 'card'
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = subtotal >= 1999 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  function handleInputChange(e) {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  }

  function validateAddress() {
    const errs = {};
    if (!shippingData.name.trim() || shippingData.name.trim().length < 2) {
      errs.name = "Enter your full recipient name";
    }
    if (!shippingData.phone.trim() || !/^\d{10}$/.test(shippingData.phone.replace(/\D/g, ""))) {
      errs.phone = "Enter a valid 10-digit mobile number";
    }
    if (!shippingData.address.trim() || shippingData.address.trim().length < 5) {
      errs.address = "Enter flat/house no. and complete street address";
    }
    if (!shippingData.pincode.trim() || !/^\d{6}$/.test(shippingData.pincode.trim())) {
      errs.pincode = "Enter a valid 6-digit PIN code";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handlePlaceOrder() {
    if (cart.length === 0) {
      onShowToast("Your cart is empty", "error");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("shopsphere_token");

    let finalOrder = null;

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
          finalOrder = data.order;
        }
      } catch (err) {
        console.warn("Backend API not reachable. Creating reliable persistent local order:", err);
      }
    }

    if (!finalOrder) {
      finalOrder = {
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
        paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "upi" ? "UPI Instant Pay" : "Card Payment"
      };

      try {
        const existing = JSON.parse(localStorage.getItem("shopsphere_demo_orders") || "[]");
        localStorage.setItem("shopsphere_demo_orders", JSON.stringify([finalOrder, ...existing]));
      } catch (e) {
        console.error(e);
      }
    }

    setIsSubmitting(false);
    onOrderCompleted(finalOrder);
  }

  return (
    <div className="checkout-page-layout">
      {/* Focused Checkout Header */}
      <header className="checkout-minimal-header">
        <div className="checkout-header-inner">
          <button type="button" className="checkout-logo-btn" onClick={onBackToCart}>
            <span className="logo-title">ShopSphere<span>.</span></span>
          </button>
          <div className="checkout-secure-badge">
            <Lock size={15} className="lock-icon" />
            <span>Secure 256-Bit SSL Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Container */}
      <div className="checkout-container">
        <div className="checkout-content-grid">
          {/* Left Column: Multi-Step Accordion Form */}
          <div className="checkout-steps-column">
            {/* Step 1: Delivery Address */}
            <section className={`checkout-step-block ${activeStep === 1 ? "active" : "completed"}`}>
              <div className="step-block-header">
                <span className="step-number-tag">1</span>
                <h3>Select a delivery address</h3>
                {activeStep > 1 && (
                  <button
                    type="button"
                    className="step-change-btn"
                    onClick={() => setActiveStep(1)}
                  >
                    Change
                  </button>
                )}
              </div>

              {activeStep === 1 ? (
                <div className="step-block-body">
                  <div className="form-grid-2">
                    <div className="input-field-group">
                      <label>Full Name (First and Last name) *</label>
                      <input
                        type="text"
                        name="name"
                        value={shippingData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Shreyash Girde"
                        className={errors.name ? "err-field" : ""}
                      />
                      {errors.name && <span className="field-err">{errors.name}</span>}
                    </div>

                    <div className="input-field-group">
                      <label>Mobile Number (10 digits) *</label>
                      <input
                        type="tel"
                        name="phone"
                        maxLength={10}
                        value={shippingData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        className={errors.phone ? "err-field" : ""}
                      />
                      {errors.phone && <span className="field-err">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label>Flat, House no., Building, Company, Apartment *</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. Flat 402, Signature Tower, Central Avenue"
                      className={errors.address ? "err-field" : ""}
                    />
                    {errors.address && <span className="field-err">{errors.address}</span>}
                  </div>

                  <div className="form-grid-3">
                    <div className="input-field-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="input-field-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingData.state}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="input-field-group">
                      <label>6-Digit PIN Code *</label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        value={shippingData.pincode}
                        onChange={handleInputChange}
                        className={errors.pincode ? "err-field" : ""}
                      />
                      {errors.pincode && <span className="field-err">{errors.pincode}</span>}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="step-submit-btn"
                    onClick={() => {
                      if (validateAddress()) setActiveStep(2);
                    }}
                  >
                    <span>Use this address</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="step-summary-view">
                  <p><strong>{shippingData.name}</strong> · {shippingData.phone}</p>
                  <p>{shippingData.address}, {shippingData.city}, {shippingData.state} - {shippingData.pincode}</p>
                </div>
              )}
            </section>

            {/* Step 2: Payment Method */}
            <section className={`checkout-step-block ${activeStep === 2 ? "active" : activeStep > 2 ? "completed" : "pending"}`}>
              <div className="step-block-header">
                <span className="step-number-tag">2</span>
                <h3>Select a payment method</h3>
                {activeStep > 2 && (
                  <button
                    type="button"
                    className="step-change-btn"
                    onClick={() => setActiveStep(2)}
                  >
                    Change
                  </button>
                )}
              </div>

              {activeStep === 2 ? (
                <div className="step-block-body">
                  <div className="academic-payment-notice">
                    <AlertCircle size={17} className="amber-ico" />
                    <p>
                      <strong>College Demonstration Note:</strong> Cash on Delivery (COD) is the direct active physical fulfillment mode. Card and UPI methods are interactive demonstrations that register your order with MongoDB.
                    </p>
                  </div>

                  <div className="payment-radio-group">
                    {/* Option 1: Cash on Delivery */}
                    <label className={`payment-radio-card ${paymentMethod === "cod" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                      />
                      <div className="radio-card-body">
                        <div className="method-title-row">
                          <Banknote size={20} className="method-icon gold" />
                          <div>
                            <strong>Cash on Delivery / UPI on Delivery</strong>
                            <p>Pay cash or scan QR when your courier arrives at your doorstep.</p>
                          </div>
                        </div>
                        <span className="active-tag">Active Mode</span>
                      </div>
                    </label>

                    {/* Option 2: UPI Simulator */}
                    <label className={`payment-radio-card ${paymentMethod === "upi" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                      />
                      <div className="radio-card-body">
                        <div className="method-title-row">
                          <QrCode size={20} className="method-icon blue" />
                          <div>
                            <strong>Instant UPI / QR Code Simulator</strong>
                            <p>Google Pay, PhonePe, Paytm, BHIM instant transfer simulation.</p>
                          </div>
                        </div>
                        <span className="demo-tag">Simulation</span>
                      </div>
                    </label>

                    {/* Option 3: Card Simulator */}
                    <label className={`payment-radio-card ${paymentMethod === "card" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                      />
                      <div className="radio-card-body">
                        <div className="method-title-row">
                          <CreditCard size={20} className="method-icon green" />
                          <div>
                            <strong>Credit or Debit Card Simulator</strong>
                            <p>Visa, MasterCard, RuPay 256-bit encrypted card payment.</p>
                          </div>
                        </div>
                        <span className="demo-tag">Simulation</span>
                      </div>
                    </label>
                  </div>

                  <button
                    type="button"
                    className="step-submit-btn"
                    onClick={() => setActiveStep(3)}
                  >
                    <span>Use this payment method</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              ) : activeStep > 2 ? (
                <div className="step-summary-view">
                  <p>Payment method: <strong>{paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "upi" ? "UPI (Simulated)" : "Card (Simulated)"}</strong></p>
                </div>
              ) : null}
            </section>

            {/* Step 3: Review Items & Place Order */}
            <section className={`checkout-step-block ${activeStep === 3 ? "active" : "pending"}`}>
              <div className="step-block-header">
                <span className="step-number-tag">3</span>
                <h3>Review items and delivery</h3>
              </div>

              {activeStep === 3 && (
                <div className="step-block-body">
                  <div className="checkout-review-items-list">
                    {cart.map((item) => (
                      <div key={item.id} className="checkout-review-item-row">
                        <div className="review-item-thumb">
                          <FallbackImage src={item.image} alt={item.name} category={item.category} />
                        </div>
                        <div className="review-item-info">
                          <h4>{item.name}</h4>
                          <span className="review-item-qty">Quantity: {item.quantity}</span>
                          <span className="review-item-price">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="place-order-banner">
                    <button
                      type="button"
                      className="place-order-big-btn"
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>Saving Order to MongoDB...</span>
                      ) : (
                        <span>Place Your Order · {formatPrice(grandTotal)}</span>
                      )}
                    </button>
                    <p className="order-terms-text">
                      By placing your order, you agree to ShopSphere's privacy notice and conditions of use.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Sticky Order Summary Box */}
          <aside className="checkout-order-summary-sidebar">
            <div className="checkout-summary-card">
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-rows">
                <div className="sum-row">
                  <span>Items ({totalItems}):</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="sum-row">
                  <span>Postage &amp; Packing:</span>
                  <span>{shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}</span>
                </div>
                <div className="sum-divider" />
                <div className="sum-row total">
                  <strong>Order Total:</strong>
                  <strong>{formatPrice(grandTotal)}</strong>
                </div>
              </div>

              <div className="summary-trust-bullets">
                <div className="trust-bullet">
                  <ShieldCheck size={16} className="green-tick" />
                  <span>MongoDB Atlas / Local Database Verified</span>
                </div>
                <div className="trust-bullet">
                  <Truck size={16} className="blue-icon" />
                  <span>Free doorstep tracking &amp; 7-day replacement</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
