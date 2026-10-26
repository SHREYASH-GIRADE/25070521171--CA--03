import { useState } from "react";
import { Mail, Check, Sparkles, ShieldCheck } from "lucide-react";

export default function NewsletterSection({ onShowToast }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Save subscriber in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem("shopsphere_subscribers") || "[]");
      if (!existing.includes(trimmed)) {
        existing.push(trimmed);
        localStorage.setItem("shopsphere_subscribers", JSON.stringify(existing));
      }
    } catch (err) {
      console.error(err);
    }

    setSubscribed(true);
    onShowToast("Welcome to the Sphere Circle! Exclusive perk code sent to your email.", "success");
  }

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-card">
          <div className="newsletter-header">
            <div className="newsletter-badge">
              <Sparkles size={13} className="gold-icon" />
              <span>THE SPHERE CIRCLE</span>
            </div>
            <h2 className="newsletter-title">Subscribe to Exclusive Privilege Updates</h2>
            <p className="newsletter-subtitle">
              Receive early access to seasonal capsule drops, private collector releases, and an immediate 10% privilege savings coupon.
            </p>
          </div>

          {subscribed ? (
            <div className="newsletter-success-box">
              <div className="success-check-orb">
                <Check size={20} className="green-icon" />
              </div>
              <div>
                <strong>Thank you for subscribing!</strong>
                <p>We've registered {email}. Use code <strong>SPHERE10</strong> for 10% off your order.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="newsletter-input-wrap">
                <Mail size={18} className="newsletter-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your email address..."
                  className={`newsletter-input ${error ? "has-error" : ""}`}
                  aria-label="Email address for newsletter"
                  required
                />
              </div>

              <button type="submit" className="newsletter-submit-btn">
                <span>Join Privilege</span>
              </button>
            </form>
          )}

          {error && <p className="newsletter-error">{error}</p>}

          <div className="newsletter-privacy-note">
            <ShieldCheck size={13} className="gold-icon" />
            <span>We respect your inbox. No spam, ever. Unsubscribe with one click anytime.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
