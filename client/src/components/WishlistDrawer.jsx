import { X, Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import FallbackImage from "./FallbackImage";

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onMoveToCart,
  formatPrice,
  onExploreProducts
}) {
  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside
        className="cart-drawer wishlist-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Saved Wishlist"
      >
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <Heart size={20} className="gold-icon filled-heart" />
            <h2 className="drawer-title">My Saved Wishlist</h2>
            <span className="drawer-count-pill">{wishlist.length}</span>
          </div>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {wishlist.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-cart-orb">
                <Heart size={48} className="empty-cart-svg" />
              </div>
              <h3 className="empty-cart-heading">Your wishlist is empty</h3>
              <p className="empty-cart-text">
                Save items you covet while browsing by clicking the heart icon on any product card.
              </p>
              <button
                type="button"
                className="empty-cart-cta"
                onClick={() => {
                  onClose();
                  onExploreProducts();
                }}
              >
                <span>Discover Collections</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {wishlist.map((item) => (
                <article key={item.id} className="cart-item-row">
                  <div className="cart-item-thumbnail">
                    <FallbackImage
                      src={item.image}
                      alt={item.name}
                      category={item.category}
                      className="cart-thumb-img"
                    />
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-meta">
                      <span className="cart-item-category">{item.category}</span>
                      <button
                        type="button"
                        className="cart-item-delete"
                        onClick={() => onRemoveFromWishlist(item.id)}
                        aria-label={`Remove ${item.name} from wishlist`}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <h4 className="cart-item-title">{item.name}</h4>

                    <div className="cart-item-unit-price">
                      {formatPrice(item.price)}
                    </div>

                    <div className="wishlist-move-row">
                      <button
                        type="button"
                        className="wishlist-move-btn"
                        onClick={() => onMoveToCart(item)}
                      >
                        <ShoppingBag size={14} />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {wishlist.length > 0 && (
          <div className="cart-drawer-footer">
            <button
              type="button"
              className="cart-checkout-btn"
              onClick={() => {
                wishlist.forEach((item) => onMoveToCart(item));
              }}
            >
              <span>Move All to Bag</span>
              <ShoppingBag size={18} />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
