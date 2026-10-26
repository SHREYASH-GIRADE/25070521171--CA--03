import { useState, useRef, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Package,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Sparkles,
  Zap
} from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function Navbar({
  user,
  cartCount,
  cartTotal,
  wishlistCount,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  onOpenAuth,
  onLogout,
  onGoHome,
  formatPrice
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFilterCat, setSelectedFilterCat] = useState("All");
  const userMenuRef = useRef(null);

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleCategoryNav(cat) {
    onSelectCategory(cat);
    onGoHome();
  }

  return (
    <header className="ecomm-navbar-header">
      {/* Main Upper Navigation Bar */}
      <div className="ecomm-navbar-main">
        <div className="ecomm-nav-container">
          {/* Mobile hamburger */}
          <button
            type="button"
            className="ecomm-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo Section */}
          <div className="ecomm-brand-block">
            <BrandLogo variant="light" size="normal" onClick={onGoHome} />
            <span className="brand-tagline">ONLINE MEGASTORE</span>
          </div>

          {/* Deliver To Location Selector */}
          <div className="ecomm-delivery-pin" title="Deliver to Mumbai 400001">
            <MapPin size={17} className="pin-icon" />
            <div className="pin-details">
              <span className="pin-sub">Deliver to</span>
              <span className="pin-city">Mumbai 400001</span>
            </div>
          </div>

          {/* Prominent Centered E-Commerce Search Bar */}
          <div className="ecomm-search-bar">
            <select
              value={selectedFilterCat}
              onChange={(e) => {
                setSelectedFilterCat(e.target.value);
                onSelectCategory(e.target.value);
              }}
              className="search-cat-dropdown"
              aria-label="Select Category"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Accessories">Accessories</option>
            </select>

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products, brands, models (e.g. Sony, Watch, Sneakers)..."
              className="search-input-field"
              aria-label="Search ShopSphere Catalog"
            />

            {searchQuery && (
              <button
                type="button"
                className="search-clear-cross"
                onClick={() => onSearchChange("")}
                aria-label="Clear Search"
              >
                <X size={14} />
              </button>
            )}

            <button
              type="button"
              className="search-submit-btn"
              onClick={onGoHome}
              aria-label="Submit search"
            >
              <Search size={18} />
            </button>
          </div>

          {/* Right Action Icons & Customer Accounts */}
          <div className="ecomm-header-actions">
            {/* Returns & Orders (Amazon Style) */}
            <button
              type="button"
              className="ecomm-nav-item orders-link"
              onClick={onOpenOrders}
            >
              <span className="nav-item-sub">Returns</span>
              <span className="nav-item-main">&amp; Orders</span>
            </button>

            {/* Saved Wishlist */}
            <button
              type="button"
              className="ecomm-nav-item wishlist-item"
              onClick={onOpenWishlist}
              title="Saved Wishlist"
            >
              <div className="action-icon-pill">
                <Heart size={20} className={wishlistCount > 0 ? "wishlist-red" : ""} />
                {wishlistCount > 0 && <span className="action-counter-badge red">{wishlistCount}</span>}
              </div>
              <span className="nav-item-main hide-mobile">Wishlist</span>
            </button>

            {/* Cart / Shopping Bag */}
            <button
              type="button"
              className="ecomm-cart-button"
              onClick={onOpenCart}
              aria-label={`Cart with ${cartCount} items`}
            >
              <div className="cart-icon-container">
                <ShoppingCart size={22} />
                <span className="cart-counter-badge">{cartCount}</span>
              </div>
              <div className="cart-info-labels">
                <span className="cart-caption">Cart</span>
                <span className="cart-price-sum">{formatPrice(cartTotal)}</span>
              </div>
            </button>

            {/* User Profile / Sign In */}
            {user ? (
              <div className="ecomm-user-dropdown-wrap" ref={userMenuRef}>
                <button
                  type="button"
                  className="ecomm-user-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="user-initials-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="user-nav-labels">
                    <span className="user-greeting">Hello, {user.name ? user.name.split(" ")[0] : "Customer"}</span>
                    <span className="user-account-title">
                      Account <ChevronDown size={12} />
                    </span>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="ecomm-dropdown-menu">
                    <div className="dropdown-account-info">
                      <p className="acc-name">{user.name}</p>
                      <p className="acc-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider" />
                    <button
                      type="button"
                      className="dropdown-link-row"
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenOrders();
                      }}
                    >
                      <Package size={16} />
                      <span>My Orders</span>
                    </button>
                    <button
                      type="button"
                      className="dropdown-link-row"
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenWishlist();
                      }}
                    >
                      <Heart size={16} />
                      <span>My Wishlist ({wishlistCount})</span>
                    </button>
                    <div className="dropdown-divider" />
                    <button
                      type="button"
                      className="dropdown-link-row logout"
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="ecomm-signin-link-btn"
                onClick={onOpenAuth}
              >
                <User size={16} />
                <div className="signin-labels">
                  <span className="signin-sub">Hello, Sign In</span>
                  <span className="signin-main">Account &amp; Lists</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation Ribbon (Lower Navigation Bar) */}
      <nav className="ecomm-ribbon-bar" aria-label="Department Navigation">
        <div className="ecomm-ribbon-container">
          <button
            type="button"
            className={`ribbon-item all ${activeCategory === "All" ? "active" : ""}`}
            onClick={() => handleCategoryNav("All")}
          >
            <Menu size={16} />
            <span>All Departments</span>
          </button>

          <button
            type="button"
            className={`ribbon-item ${activeCategory === "Electronics" ? "active" : ""}`}
            onClick={() => handleCategoryNav("Electronics")}
          >
            <span>Mobiles &amp; Electronics</span>
          </button>

          <button
            type="button"
            className={`ribbon-item ${activeCategory === "Fashion" ? "active" : ""}`}
            onClick={() => handleCategoryNav("Fashion")}
          >
            <span>Fashion &amp; Shoes</span>
          </button>

          <button
            type="button"
            className={`ribbon-item ${activeCategory === "Accessories" ? "active" : ""}`}
            onClick={() => handleCategoryNav("Accessories")}
          >
            <span>Watches, Bags &amp; Wallets</span>
          </button>

          <button
            type="button"
            className="ribbon-item deals-highlight"
            onClick={() => handleCategoryNav("All")}
          >
            <Zap size={14} fill="#F59E0B" color="#F59E0B" />
            <span>Today's Top Deals</span>
          </button>

          <div className="ribbon-promo-tag">
            <Sparkles size={13} className="sparkle-gold" />
            <span>Extra 10% Off with code <strong>SPHERE10</strong></span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <BrandLogo variant="dark" size="small" onClick={() => { setMobileMenuOpen(false); onGoHome(); }} />
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-section">
              <span className="mobile-sec-title">DEPARTMENTS</span>
              {["All", "Electronics", "Fashion", "Accessories"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`mobile-drawer-link ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => {
                    onSelectCategory(cat);
                    setMobileMenuOpen(false);
                    onGoHome();
                  }}
                >
                  {cat === "All" ? "All Categories" : cat}
                </button>
              ))}
            </div>

            <div className="mobile-drawer-divider" />

            <div className="mobile-drawer-section">
              <span className="mobile-sec-title">YOUR ACCOUNT</span>
              {user ? (
                <>
                  <button
                    type="button"
                    className="mobile-drawer-link"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenOrders();
                    }}
                  >
                    <Package size={16} />
                    <span>My Orders</span>
                  </button>
                  <button
                    type="button"
                    className="mobile-drawer-link"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenWishlist();
                    }}
                  >
                    <Heart size={16} />
                    <span>Saved Wishlist ({wishlistCount})</span>
                  </button>
                  <button
                    type="button"
                    className="mobile-drawer-link logout"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="mobile-drawer-signin-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                >
                  <User size={18} />
                  <span>Sign In / Create Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
