import { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";

// Components
import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import DealsCarousel from "./components/DealsCarousel";
import ProductCard from "./components/ProductCard";
import TrustSection from "./components/TrustSection";
import PromoBanner from "./components/PromoBanner";
import NewsletterSection from "./components/NewsletterSection";
import Footer from "./components/Footer";
import Toast from "./components/Toast";

// Pages
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import WishlistPage from "./pages/WishlistPage";
import OrderHistory from "./components/OrderHistory";
import AuthPage from "./components/AuthPage";

// Inventory data
import { defaultProducts } from "./data/defaultProducts";

// Icons
import {
  Filter,
  Search,
  Star,
  RotateCcw,
  ShieldCheck,
  X
} from "lucide-react";

const PRODUCTS_API = "http://localhost:5000/api/products";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);
}

export default function App() {
  // Multipage Router State: 'home' | 'product' | 'cart' | 'checkout' | 'order-success' | 'orders' | 'wishlist' | 'login'
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash.startsWith("product-")) return "product";
    if (["cart", "checkout", "orders", "wishlist", "login"].includes(hash)) return hash;
    return "home";
  });

  const [authMode, setAuthMode] = useState("login");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [recentOrder, setRecentOrder] = useState(null);

  // User Authentication
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shopsphere_user")) || null;
    } catch {
      return null;
    }
  });

  // Shopping Cart
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shopsphere_cart")) || [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shopsphere_wishlist")) || [];
    } catch {
      return [];
    }
  });

  // Products
  const [products, setProducts] = useState(defaultProducts);
  const [productsLoading, setProductsLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // Filters & Search
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Notifications
  const [toasts, setToasts] = useState([]);

  // Catalog anchor ref
  const catalogRef = useRef(null);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem("shopsphere_cart", JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem("shopsphere_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Sync browser URL hash with current page
  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.replace("#", "");
      if (hash.startsWith("product-")) {
        const prodId = hash.replace("product-", "");
        const found = products.find((p) => p.id === prodId || p._id === prodId);
        if (found) {
          setSelectedProduct(found);
          setCurrentPage("product");
        }
      } else if (["home", "cart", "checkout", "orders", "wishlist", "login"].includes(hash)) {
        setCurrentPage(hash);
      } else if (!hash) {
        setCurrentPage("home");
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [products]);

  // Update hash when page changes
  function navigateTo(pageName, param = null) {
    setCurrentPage(pageName);
    if (pageName === "product" && param) {
      setSelectedProduct(param);
      window.location.hash = `product-${param.id || param._id}`;
    } else if (pageName === "home") {
      window.location.hash = "";
    } else {
      window.location.hash = pageName;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Load products from MongoDB backend
  useEffect(() => {
    let cancelled = false;

    async function loadBackendProducts() {
      setProductsLoading(true);
      try {
        const response = await fetch(PRODUCTS_API);
        if (!response.ok) throw new Error("Failed to load products");
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0 && !cancelled) {
          const merged = data.map((item) => {
            const fallbackMatch = defaultProducts.find(
              (dp) => dp.name.toLowerCase() === item.name.toLowerCase()
            );
            return {
              ...item,
              id: item._id || item.id,
              brand: fallbackMatch?.brand || item.category,
              rating: fallbackMatch?.rating || 4.8,
              reviewCount: fallbackMatch?.reviewCount || 420,
              badge: fallbackMatch?.badge || "Popular",
              deliveryDate: fallbackMatch?.deliveryDate || "Tomorrow by 2 PM",
              discount: fallbackMatch?.discount || "35% OFF",
              originalPrice: fallbackMatch?.originalPrice || Math.round(item.price * 1.4),
              gallery: fallbackMatch?.gallery || [item.image],
              features: fallbackMatch?.features || [
                "100% Authentic Quality Guaranteed",
                "Includes ShopSphere 1-Year Comprehensive Warranty",
                "Eligible for Free Doorstep Express Dispatch"
              ]
            };
          });
          setProducts(merged);
          setBackendConnected(true);

          // If current hash matches a product, hydrate selectedProduct
          const hash = window.location.hash.replace("#", "");
          if (hash.startsWith("product-")) {
            const pId = hash.replace("product-", "");
            const found = merged.find((p) => p.id === pId || p._id === pId);
            if (found) setSelectedProduct(found);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setBackendConnected(false);
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    }

    loadBackendProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  // Toast Notification Trigger
  function showToast(message, type = "info", duration = 3500) {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }

  function dismissToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  // Cart Calculations
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  // Cart Actions
  function handleAddToCart(product, qty = 1) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...current, { ...product, quantity: qty }];
    });
    showToast(`Added "${product.name}" to cart`, "success");
  }

  function handleBuyNow(product, qty = 1) {
    handleAddToCart(product, qty);
    navigateTo("checkout");
  }

  function handleUpdateCartQuantity(id, delta) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function handleRemoveCartItem(id) {
    const item = cart.find((i) => i.id === id);
    setCart((current) => current.filter((i) => i.id !== id));
    if (item) {
      showToast(`Removed "${item.name}" from cart`, "info");
    }
  }

  // Wishlist Actions
  function handleToggleWishlist(product) {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((current) => current.filter((item) => item.id !== product.id));
      showToast(`Removed from saved wishlist`, "info");
    } else {
      setWishlist((current) => [...current, product]);
      showToast(`Saved "${product.name}" to wishlist`, "success");
    }
  }

  function handleMoveWishlistToCart(item) {
    handleAddToCart(item, 1);
    setWishlist((current) => current.filter((w) => w.id !== item.id));
  }

  // Auth Handlers
  function handleLogout() {
    localStorage.removeItem("shopsphere_token");
    localStorage.removeItem("shopsphere_user");
    setUser(null);
    showToast("Signed out successfully.", "info");
    navigateTo("home");
  }

  function handleAuthSuccess(loggedInUser) {
    setUser(loggedInUser);
    navigateTo("home");
  }

  function handleOrderCompleted(order) {
    setCart([]);
    localStorage.removeItem("shopsphere_cart");
    setRecentOrder(order);
    navigateTo("order-success");
  }

  function scrollToCatalog() {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleSelectCategory(cat) {
    setActiveCategory(cat);
    if (currentPage !== "home") {
      navigateTo("home");
      setTimeout(scrollToCatalog, 100);
    } else {
      scrollToCatalog();
    }
  }

  function resetFilters() {
    setActiveCategory("All");
    setSearchQuery("");
    setPriceFilter("all");
    setRatingFilter(0);
    setSortBy("featured");
  }

  // Filtered and Sorted Catalog
  const filteredProducts = useMemo(() => {
    let list = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.brand && product.brand.toLowerCase().includes(q)) ||
        (product.description && product.description.toLowerCase().includes(q));

      let matchesPrice = true;
      if (priceFilter === "under-1000") matchesPrice = product.price < 1000;
      else if (priceFilter === "1000-2500") matchesPrice = product.price >= 1000 && product.price <= 2500;
      else if (priceFilter === "above-2500") matchesPrice = product.price > 2500;

      const matchesRating = !ratingFilter || (product.rating && product.rating >= ratingFilter);

      return matchesCategory && matchesSearch && matchesPrice && matchesRating;
    });

    switch (sortBy) {
      case "price-low":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...list].sort((a, b) => b.price - a.price);
      case "rating":
        return [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "discount":
        return [...list].sort((a, b) => {
          const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return discB - discA;
        });
      default:
        return list;
    }
  }, [products, activeCategory, searchQuery, sortBy, priceFilter, ratingFilter]);

  return (
    <div className="shopsphere-app">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Slim Top Announcement Bar */}
      <AnnouncementBar />

      {/* Commercial E-Commerce Sticky Navigation Bar */}
      <Navbar
        user={user}
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (currentPage !== "home") navigateTo("home");
        }}
        onOpenCart={() => navigateTo("cart")}
        onOpenWishlist={() => navigateTo("wishlist")}
        onOpenOrders={() => navigateTo("orders")}
        onOpenAuth={() => {
          setAuthMode("login");
          navigateTo("login");
        }}
        onLogout={handleLogout}
        onGoHome={() => navigateTo("home")}
        formatPrice={formatPrice}
      />

      {/* Multipage Router View */}
      {currentPage === "cart" ? (
        /* Dedicated Full-Page Shopping Cart */
        <CartPage
          cart={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onProceedToCheckout={() => navigateTo("checkout")}
          onExploreProducts={() => navigateTo("home")}
          onNavigateProduct={(p) => navigateTo("product", p)}
          formatPrice={formatPrice}
          onShowToast={showToast}
        />
      ) : currentPage === "checkout" ? (
        /* Dedicated Full-Page Multi-Step Checkout */
        <CheckoutPage
          cart={cart}
          user={user}
          formatPrice={formatPrice}
          onOrderCompleted={handleOrderCompleted}
          onBackToCart={() => navigateTo("cart")}
          onShowToast={showToast}
        />
      ) : currentPage === "order-success" ? (
        /* Dedicated Order Success Receipt Page */
        <OrderSuccessPage
          order={recentOrder}
          formatPrice={formatPrice}
          onGoToOrders={() => navigateTo("orders")}
          onContinueShopping={() => navigateTo("home")}
          onShowToast={showToast}
        />
      ) : currentPage === "orders" ? (
        /* Dedicated Full-Page My Orders & Tracking */
        <OrderHistory
          formatPrice={formatPrice}
          onGoHome={() => navigateTo("home")}
          onShowToast={showToast}
        />
      ) : currentPage === "wishlist" ? (
        /* Dedicated Full-Page Saved Wishlist */
        <WishlistPage
          wishlist={wishlist}
          onRemoveFromWishlist={(id) => {
            setWishlist((current) => current.filter((item) => item.id !== id));
          }}
          onMoveToCart={handleMoveWishlistToCart}
          onExploreProducts={() => navigateTo("home")}
          onNavigateProduct={(p) => navigateTo("product", p)}
          formatPrice={formatPrice}
          onShowToast={showToast}
        />
      ) : currentPage === "login" ? (
        /* Dedicated Full-Page Authentication */
        <AuthPage
          initialMode={authMode}
          onAuthSuccess={handleAuthSuccess}
          onBackToHome={() => navigateTo("home")}
          onShowToast={showToast}
        />
      ) : currentPage === "product" && selectedProduct ? (
        /* Dedicated Full-Page Product Details */
        <ProductDetailPage
          product={selectedProduct}
          allProducts={products}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          formatPrice={formatPrice}
          isWishlisted={wishlist.some((w) => w.id === selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          onNavigateProduct={(p) => navigateTo("product", p)}
          onBackToHome={() => navigateTo("home")}
          onShowToast={showToast}
        />
      ) : (
        /* Real E-Commerce Storefront Homepage */
        <main className="ecomm-store-content">
          {/* Hero Slider & Deals of the Day Banner */}
          <DealsCarousel
            onCategoryClick={handleSelectCategory}
            onExploreClick={scrollToCatalog}
          />

          {/* Main E-Commerce Catalog Area with Filter Sidebar */}
          <section id="catalog" className="ecomm-catalog-section" ref={catalogRef}>
            <div className="ecomm-catalog-wrapper">
              {/* Left Filter Sidebar (Amazon / Flipkart Style) */}
              <aside className={`ecomm-filter-sidebar ${mobileFilterOpen ? "mobile-open" : ""}`}>
                <div className="sidebar-filter-header">
                  <div className="filter-title-row">
                    <Filter size={16} className="filter-icon-blue" />
                    <h3 className="filter-headline">Filters</h3>
                  </div>
                  <button
                    type="button"
                    className="clear-all-filter-btn"
                    onClick={resetFilters}
                  >
                    Clear All
                  </button>
                  <button
                    type="button"
                    className="sidebar-close-mobile"
                    onClick={() => setMobileFilterOpen(false)}
                    aria-label="Close filters"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Category Department Filter */}
                <div className="filter-group-block">
                  <h4 className="filter-group-title">Department</h4>
                  <div className="filter-options-list">
                    {["All", "Electronics", "Fashion", "Accessories"].map((cat) => (
                      <label key={cat} className="filter-radio-row">
                        <input
                          type="radio"
                          name="categoryFilter"
                          checked={activeCategory === cat}
                          onChange={() => setActiveCategory(cat)}
                        />
                        <span className="filter-label-text">
                          {cat === "All" ? "All Departments" : cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="filter-group-block">
                  <h4 className="filter-group-title">Price Range</h4>
                  <div className="filter-options-list">
                    <label className="filter-radio-row">
                      <input
                        type="radio"
                        name="priceFilter"
                        checked={priceFilter === "all"}
                        onChange={() => setPriceFilter("all")}
                      />
                      <span className="filter-label-text">All Prices</span>
                    </label>
                    <label className="filter-radio-row">
                      <input
                        type="radio"
                        name="priceFilter"
                        checked={priceFilter === "under-1000"}
                        onChange={() => setPriceFilter("under-1000")}
                      />
                      <span className="filter-label-text">Under ₹1,000</span>
                    </label>
                    <label className="filter-radio-row">
                      <input
                        type="radio"
                        name="priceFilter"
                        checked={priceFilter === "1000-2500"}
                        onChange={() => setPriceFilter("1000-2500")}
                      />
                      <span className="filter-label-text">₹1,000 - ₹2,500</span>
                    </label>
                    <label className="filter-radio-row">
                      <input
                        type="radio"
                        name="priceFilter"
                        checked={priceFilter === "above-2500"}
                        onChange={() => setPriceFilter("above-2500")}
                      />
                      <span className="filter-label-text">Above ₹2,500</span>
                    </label>
                  </div>
                </div>

                {/* Customer Rating Filter */}
                <div className="filter-group-block">
                  <h4 className="filter-group-title">Customer Ratings</h4>
                  <div className="filter-options-list">
                    <button
                      type="button"
                      className={`rating-filter-pill ${ratingFilter === 4 ? "active" : ""}`}
                      onClick={() => setRatingFilter(ratingFilter === 4 ? 0 : 4)}
                    >
                      <span className="stars-cluster">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
                        ))}
                        <Star size={13} color="#D1D5DB" />
                      </span>
                      <span>&amp; Up (4★+)</span>
                    </button>
                  </div>
                </div>

                {/* Assured Assurance Tag */}
                <div className="sidebar-assured-promo">
                  <ShieldCheck size={20} className="assured-gold-icon" />
                  <div>
                    <strong>ShopSphere Assured</strong>
                    <p>Tested for quality, authentic brands &amp; fast doorstep dispatch.</p>
                  </div>
                </div>
              </aside>

              {/* Right Products Catalog Area */}
              <div className="ecomm-catalog-main">
                {/* Catalog Control Header */}
                <div className="catalog-toolbar-panel">
                  <div className="toolbar-left-info">
                    <button
                      type="button"
                      className="mobile-filter-trigger-btn"
                      onClick={() => setMobileFilterOpen(true)}
                    >
                      <Filter size={15} />
                      <span>Filters</span>
                    </button>

                    <span className="results-count-text">
                      Showing <strong>{filteredProducts.length}</strong> products
                      {activeCategory !== "All" && ` in ${activeCategory}`}
                      {searchQuery && ` for "${searchQuery}"`}
                    </span>
                  </div>

                  {/* Sort By Dropdown */}
                  <div className="toolbar-sort-group">
                    <label htmlFor="sortSelect" className="sort-label">Sort by:</label>
                    <select
                      id="sortSelect"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="ecomm-sort-dropdown"
                    >
                      <option value="featured">Featured Deals</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Customer Rating</option>
                      <option value="discount">Biggest Discounts</option>
                    </select>
                  </div>
                </div>

                {/* Active Filter Badges Strip */}
                {(activeCategory !== "All" || priceFilter !== "all" || ratingFilter > 0 || searchQuery) && (
                  <div className="active-filters-strip">
                    <span className="active-filter-label">Active:</span>
                    {activeCategory !== "All" && (
                      <span className="filter-active-pill">
                        {activeCategory}
                        <button type="button" onClick={() => setActiveCategory("All")}>×</button>
                      </span>
                    )}
                    {priceFilter !== "all" && (
                      <span className="filter-active-pill">
                        Price: {priceFilter}
                        <button type="button" onClick={() => setPriceFilter("all")}>×</button>
                      </span>
                    )}
                    {ratingFilter > 0 && (
                      <span className="filter-active-pill">
                        4★ &amp; Up
                        <button type="button" onClick={() => setRatingFilter(0)}>×</button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="filter-active-pill">
                        "{searchQuery}"
                        <button type="button" onClick={() => setSearchQuery("")}>×</button>
                      </span>
                    )}
                    <button type="button" className="clear-link-btn" onClick={resetFilters}>
                      Reset All
                    </button>
                  </div>
                )}

                {/* Products Grid */}
                {productsLoading ? (
                  <div className="ecomm-loading-grid">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="ecomm-skeleton-card" />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="ecomm-empty-results">
                    <div className="empty-search-icon-wrap">
                      <Search size={42} className="empty-search-svg" />
                    </div>
                    <h3 className="empty-results-title">No matching products found</h3>
                    <p className="empty-results-subtitle">
                      Try checking your spelling or clearing filters to see our full inventory.
                    </p>
                    <button type="button" className="empty-reset-cta" onClick={resetFilters}>
                      <RotateCcw size={15} />
                      <span>Clear All Filters</span>
                    </button>
                  </div>
                ) : (
                  <div className="ecomm-product-grid">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id || product._id}
                        product={product}
                        formatPrice={formatPrice}
                        onOpenProduct={(p) => navigateTo("product", p)}
                        onAddToCart={(p) => handleAddToCart(p, 1)}
                        isWishlisted={wishlist.some((w) => w.id === product.id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Promotional Editorial Banner */}
          <PromoBanner onExplore={scrollToCatalog} />

          {/* Trust Guarantees */}
          <TrustSection />

          {/* Newsletter Subscription */}
          <NewsletterSection onShowToast={showToast} />
        </main>
      )}

      {/* Professional Retail Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenOrders={() => navigateTo("orders")}
        onGoHome={() => navigateTo("home")}
      />
    </div>
  );
}
