import { ArrowDown, Sparkles, ShieldCheck, Truck, RotateCcw, Award } from "lucide-react";

export default function Hero({ onExploreClick, onCategoryClick }) {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-pill-badge">
            <span className="hero-pill-dot" />
            <Sparkles size={13} className="hero-pill-icon" />
            <span>COLLECTION 2026 · AUTUMN / WINTER EDIT</span>
          </div>

          <h1 className="hero-title">
            Curated Elegance <br />
            <span className="hero-title-accent">for Modern Living.</span>
          </h1>

          <p className="hero-description">
            Experience studio-grade acoustics, tailored apparel, and handcrafted horology.
            Each piece is meticulously evaluated for enduring performance, timeless form,
            and understated sophistication.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-primary-btn"
              onClick={onExploreClick}
            >
              <span>Explore Collection</span>
              <ArrowDown size={17} className="hero-btn-arrow" />
            </button>

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={() => onCategoryClick("Electronics")}
            >
              <span>Featured Tech</span>
            </button>
          </div>

          <div className="hero-metrics">
            <div className="hero-metric-item">
              <span className="metric-number">100%</span>
              <span className="metric-label">Verified Authentic</span>
            </div>
            <div className="metric-separator" />
            <div className="hero-metric-item">
              <span className="metric-number">4.9 ★</span>
              <span className="metric-label">Customer Satisfaction</span>
            </div>
            <div className="metric-separator" />
            <div className="hero-metric-item">
              <span className="metric-number">48 Hr</span>
              <span className="metric-label">Express Dispatch</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="hero-visual-wrapper">
          <div className="hero-image-card">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85"
              alt="ShopSphere Curated Living"
              className="hero-main-img"
            />
            <div className="hero-image-overlay" />

            {/* Floating Luxury Tag */}
            <div className="hero-floating-tag">
              <Award size={18} className="gold-icon" />
              <div>
                <p className="floating-tag-title">Editor's Signature Pick</p>
                <p className="floating-tag-sub">Acoustic Titanium Headphones</p>
              </div>
            </div>

            <div className="hero-floating-stat">
              <span className="floating-stat-badge">IN STOCK</span>
              <span className="floating-stat-price">₹1,499</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Highlights Bar */}
      <div className="hero-trust-bar">
        <div className="trust-bar-container">
          <div className="trust-item">
            <Truck size={18} className="trust-icon" />
            <div>
              <strong>Complimentary Express Delivery</strong>
              <p>On all domestic orders exceeding ₹1,999</p>
            </div>
          </div>
          <div className="trust-item">
            <ShieldCheck size={18} className="trust-icon" />
            <div>
              <strong>Certified Authenticity</strong>
              <p>Direct from verified licensed manufacturers</p>
            </div>
          </div>
          <div className="trust-item">
            <RotateCcw size={18} className="trust-icon" />
            <div>
              <strong>7-Day Seamless Returns</strong>
              <p>Hassle-free doorstep collection & replacement</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
