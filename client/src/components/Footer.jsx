import { Mail, Phone, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function Footer({
  onSelectCategory,
  onOpenOrders,
  onGoHome
}) {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Top 4-Column Grid */}
        <div className="footer-grid">
          {/* Column 1: Brand & Identity */}
          <div className="footer-col brand-col">
            <BrandLogo variant="light" size="normal" onClick={onGoHome} />
            <p className="footer-brand-bio">
              ShopSphere is a premier retail destination dedicated to everyday distinction.
              We curate studio-grade audio, bespoke apparel, and timeless accessories designed for endurance.
            </p>

            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <MapPin size={15} className="footer-contact-icon" />
                <span>BKC Financial Center, Bandra East, Mumbai 400051</span>
              </div>
              <div className="footer-contact-item">
                <Mail size={15} className="footer-contact-icon" />
                <a href="mailto:concierge@shopsphere.in">concierge@shopsphere.in</a>
              </div>
              <div className="footer-contact-item">
                <Phone size={15} className="footer-contact-icon" />
                <span>+91 (022) 8492-9100 (Mon–Sat 9AM–7PM IST)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="footer-col">
            <h4 className="footer-col-title">Curated Disciplines</h4>
            <ul className="footer-links-list">
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => onSelectCategory("Electronics")}
                >
                  Precision Electronics & Audio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => onSelectCategory("Fashion")}
                >
                  Tailored Contemporary Apparel
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => onSelectCategory("Accessories")}
                >
                  Fine Leather & Daily Horology
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => onSelectCategory("All")}
                >
                  The Autumn/Winter Edit 2026
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="footer-col">
            <h4 className="footer-col-title">Client Experience</h4>
            <ul className="footer-links-list">
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={onOpenOrders}
                >
                  Track Order & History
                </button>
              </li>
              <li>
                <span className="footer-static-link">Complimentary Express Shipping (₹1,999+)</span>
              </li>
              <li>
                <span className="footer-static-link">7-Day Doorstep Replacement Guarantee</span>
              </li>
              <li>
                <span className="footer-static-link">Authentic Serialized Verification</span>
              </li>
              <li>
                <span className="footer-static-link">Payment Protection with 256-bit SSL</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Brand & Demonstration */}
          <div className="footer-col">
            <h4 className="footer-col-title">About ShopSphere</h4>
            <p className="footer-academic-note">
              ShopSphere is developed as a production-grade full-stack e-commerce project demonstration
              featuring Node.js, Express, MongoDB Atlas, and React.
            </p>
            <div className="footer-badge-box">
              <ShieldCheck size={16} className="gold-icon" />
              <span>Engineered with Premium Architecture</span>
            </div>
          </div>
        </div>

        {/* Footer Payment & Trust Badges Strip */}
        <div className="footer-payment-strip">
          <span className="payment-strip-label">Supported Payment Ecosystem:</span>
          <div className="payment-badges-row">
            <span className="payment-pill">UPI Instant</span>
            <span className="payment-pill">RuPay</span>
            <span className="payment-pill">Visa</span>
            <span className="payment-pill">MasterCard</span>
            <span className="payment-pill">NetBanking</span>
            <span className="payment-pill">Cash on Delivery</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © 2026 ShopSphere Retail India Pvt. Ltd. All rights reserved.
          </p>
          <div className="footer-legal-links">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Consumer Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
