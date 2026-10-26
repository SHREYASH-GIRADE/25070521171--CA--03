import { ArrowRight, Sparkles, Award } from "lucide-react";

export default function PromoBanner({ onExplore }) {
  return (
    <section className="promo-banner-section">
      <div className="promo-banner-card">
        <div className="promo-banner-bg-pattern" />

        <div className="promo-banner-content">
          <div className="promo-eyebrow">
            <Sparkles size={14} className="gold-icon" />
            <span>THE HERITAGE CAPSULE · LIMITED RELEASE</span>
          </div>

          <h2 className="promo-headline">
            Where Precision Engineering Meets Everyday Utility.
          </h2>

          <p className="promo-subtext">
            Each artifact in our signature edit undergoes strict acoustic testing, ergonomic
            stress-analysis, and material verification. Crafted for those who appreciate understated distinction.
          </p>

          <div className="promo-actions">
            <button
              type="button"
              className="promo-cta-btn"
              onClick={onExplore}
            >
              <span>Explore The Capsule</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        <div className="promo-banner-visual">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85"
            alt="Sphere Heritage Watch"
            className="promo-visual-img"
          />
          <div className="promo-badge-float">
            <Award size={16} className="gold-icon" />
            <span>Master Crafted</span>
          </div>
        </div>
      </div>
    </section>
  );
}
