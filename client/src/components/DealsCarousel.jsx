import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Zap, ShieldCheck, Truck, RotateCcw, ArrowRight } from "lucide-react";

export default function DealsCarousel({ onCategoryClick, onExploreClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 24, seconds: 18 });

  const slides = [
    {
      id: 1,
      badge: "MEGA ELECTRONICS FESTIVAL",
      title: "Up to 45% Off Smart Tech & Audio",
      subtitle: "Sony Noise-Cancelling, Apple Watches & Samsung Flagships with instant bank discounts.",
      cta: "Shop Tech Deals",
      category: "Electronics",
      bgGradient: "linear-gradient(105deg, #0F172A 0%, #1E293B 45%, #0B1120 100%)",
      accentColor: "#F59E0B",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85",
      sticker: "SAVE UP TO ₹5,000"
    },
    {
      id: 2,
      badge: "NEW SEASON FOOTWEAR & APPAREL",
      title: "Min. 35% Off Top Fashion Brands",
      subtitle: "Nike Zoom Pegasus, fine Merino wool knitwear, and contemporary streetwear essentials.",
      cta: "Explore Fashion",
      category: "Fashion",
      bgGradient: "linear-gradient(105deg, #18181B 0%, #27272A 50%, #09090B 100%)",
      accentColor: "#EF4444",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",
      sticker: "TRENDING SNEAKERS"
    },
    {
      id: 3,
      badge: "LIFESTYLE & TRAVEL CARRY",
      title: "Bags, Wallets & Ray-Ban Eyewear",
      subtitle: "Weatherproof 32L commuter packs, Italian polarized optics & genuine leather wallets.",
      cta: "Shop Accessories",
      category: "Accessories",
      bgGradient: "linear-gradient(105deg, #111827 0%, #1F2937 50%, #030712 100%)",
      accentColor: "#10B981",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
      sticker: "STARTING ₹649"
    }
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Flash sale countdown timer
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="ecomm-hero-container">
      {/* Main Promo Banner Slider */}
      <div className="ecomm-slider-card" style={{ background: slide.bgGradient }}>
        <div className="slider-content-pane">
          <div className="slider-top-badge" style={{ borderColor: slide.accentColor, color: slide.accentColor }}>
            <Zap size={13} fill={slide.accentColor} />
            <span>{slide.badge}</span>
          </div>

          <h1 className="slider-heading">{slide.title}</h1>
          <p className="slider-subheading">{slide.subtitle}</p>

          <div className="slider-cta-row">
            <button
              type="button"
              className="slider-cta-btn"
              onClick={() => onCategoryClick(slide.category)}
            >
              <span>{slide.cta}</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              className="slider-secondary-cta"
              onClick={onExploreClick}
            >
              <span>View All Products</span>
            </button>
          </div>
        </div>

        {/* Visual Product Showcase */}
        <div className="slider-visual-pane">
          <img src={slide.image} alt={slide.title} className="slider-product-img" />
          <div className="slider-sticker-badge" style={{ background: slide.accentColor }}>
            {slide.sticker}
          </div>
        </div>

        {/* Slider Controls */}
        <button
          type="button"
          className="slider-nav-arrow prev"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          className="slider-nav-arrow next"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        <div className="slider-dots-container">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`slider-dot ${idx === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Commercial E-Commerce Category Bubbles Strip (Amazon / Flipkart Style) */}
      <div className="category-bubbles-strip">
        <div
          className="category-bubble-item"
          onClick={() => onCategoryClick("All")}
        >
          <div className="bubble-circle-icon all">🔥</div>
          <span className="bubble-label">All Offers</span>
        </div>

        <div
          className="category-bubble-item"
          onClick={() => onCategoryClick("Electronics")}
        >
          <div className="bubble-circle-img">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80"
              alt="Mobiles & Audio"
            />
          </div>
          <span className="bubble-label">Tech & Audio</span>
        </div>

        <div
          className="category-bubble-item"
          onClick={() => onCategoryClick("Fashion")}
        >
          <div className="bubble-circle-img">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80"
              alt="Footwear & Fashion"
            />
          </div>
          <span className="bubble-label">Shoes & Wear</span>
        </div>

        <div
          className="category-bubble-item"
          onClick={() => onCategoryClick("Accessories")}
        >
          <div className="bubble-circle-img">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80"
              alt="Watches & Bags"
            />
          </div>
          <span className="bubble-label">Bags & Watches</span>
        </div>
      </div>

      {/* Urgent Deals of the Day Flash Strip */}
      <div className="flash-deals-ticker-bar">
        <div className="ticker-left">
          <div className="flash-badge">
            <Zap size={14} fill="#EF4444" color="#EF4444" />
            <span>DEALS OF THE DAY</span>
          </div>
          <span className="ticker-deal-text">
            Special discounts ending soon! Guaranteed next-day delivery on Prime orders.
          </span>
        </div>

        <div className="ticker-timer-box">
          <span className="timer-label">Ends in:</span>
          <span className="timer-digits">
            {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
          </span>
        </div>
      </div>

      {/* Quick Buyer Guarantee Strip */}
      <div className="ecomm-trust-ribbon">
        <div className="trust-ribbon-item">
          <Truck size={18} className="ribbon-icon blue" />
          <span><strong>Fast & Free Delivery</strong> on orders over ₹1,999</span>
        </div>
        <div className="trust-ribbon-item">
          <ShieldCheck size={18} className="ribbon-icon green" />
          <span><strong>100% Genuine Certified</strong> direct from brands</span>
        </div>
        <div className="trust-ribbon-item">
          <RotateCcw size={18} className="ribbon-icon orange" />
          <span><strong>7-Day Easy Returns</strong> & Instant Replacement</span>
        </div>
      </div>
    </div>
  );
}
