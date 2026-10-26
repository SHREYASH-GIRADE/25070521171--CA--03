import { Heart, ShoppingBag, Trash2, ArrowRight, ChevronRight, ShoppingCart } from "lucide-react";
import FallbackImage from "../components/FallbackImage";

export default function WishlistPage({
  wishlist,
  onRemoveFromWishlist,
  onMoveToCart,
  onExploreProducts,
  onNavigateProduct,
  formatPrice,
  onShowToast
}) {
  function handleMoveAll() {
    if (wishlist.length === 0) return;
    wishlist.forEach((item) => onMoveToCart(item));
    onShowToast(`Moved ${wishlist.length} items to your shopping bag!`, "success");
  }

  return (
    <div className="wishlist-page-layout">
      <div className="wishlist-page-container">
        {/* Breadcrumb */}
        <nav className="pdp-breadcrumbs">
          <button type="button" onClick={onExploreProducts}>Home</button>
          <ChevronRight size={13} />
          <span className="pdp-current-name">My Wishlist</span>
        </nav>

        <div className="wishlist-header-banner">
          <div>
            <h1 className="wishlist-title">My Saved Wishlist</h1>
            <span className="wishlist-subtitle">{wishlist.length} saved {wishlist.length === 1 ? "item" : "items"}</span>
          </div>

          {wishlist.length > 0 && (
            <button
              type="button"
              className="wishlist-move-all-btn"
              onClick={handleMoveAll}
            >
              <ShoppingCart size={16} />
              <span>Move All to Cart</span>
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="cart-empty-fullscreen-card">
            <div className="cart-empty-circle">
              <Heart size={52} className="cart-empty-icon" />
            </div>
            <h2>Your Wishlist is empty</h2>
            <p>Save items you'd love to buy later by clicking the heart icon on any product.</p>
            <button
              type="button"
              className="cart-shop-deals-btn"
              onClick={onExploreProducts}
            >
              <span>Explore Products</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="wishlist-items-grid">
            {wishlist.map((item) => (
              <article key={item.id} className="wishlist-card">
                <div
                  className="wishlist-card-media"
                  onClick={() => onNavigateProduct(item)}
                >
                  <FallbackImage src={item.image} alt={item.name} category={item.category} />
                  {item.discount && (
                    <span className="discount-tag-badge">{item.discount}</span>
                  )}
                </div>

                <div className="wishlist-card-body">
                  <span className="wishlist-brand-label">{item.brand || item.category}</span>
                  <h3
                    className="wishlist-item-title"
                    onClick={() => onNavigateProduct(item)}
                  >
                    {item.name}
                  </h3>

                  <div className="wishlist-pricing-row">
                    <span className="wishlist-price">{formatPrice(item.price)}</span>
                    {item.originalPrice && (
                      <span className="wishlist-mrp"><del>{formatPrice(item.originalPrice)}</del></span>
                    )}
                  </div>

                  <span className="wishlist-stock-tag">In Stock · Ready to dispatch</span>

                  <div className="wishlist-card-actions">
                    <button
                      type="button"
                      className="wishlist-add-cart-btn"
                      onClick={() => onMoveToCart(item)}
                    >
                      <ShoppingCart size={15} />
                      <span>Move to Cart</span>
                    </button>

                    <button
                      type="button"
                      className="wishlist-remove-btn"
                      onClick={() => onRemoveFromWishlist(item.id)}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
