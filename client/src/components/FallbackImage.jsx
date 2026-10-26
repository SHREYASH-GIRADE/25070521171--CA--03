import { useState } from "react";
import { Package, Smartphone, Watch, Shirt, Sparkles } from "lucide-react";

export default function FallbackImage({
  src,
  alt = "Product",
  className = "",
  category = "",
  loading = "lazy",
  onClick = null
}) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  function getCategoryIcon() {
    switch (category?.toLowerCase()) {
      case "electronics":
        return <Smartphone className="fallback-icon" size={32} />;
      case "fashion":
        return <Shirt className="fallback-icon" size={32} />;
      case "accessories":
        return <Watch className="fallback-icon" size={32} />;
      default:
        return <Package className="fallback-icon" size={32} />;
    }
  }

  if (error || !src) {
    return (
      <div className={`fallback-image-placeholder ${className}`} onClick={onClick}>
        <div className="fallback-image-inner">
          <div className="fallback-icon-wrap">{getCategoryIcon()}</div>
          <span className="fallback-brand-tag">SHOPSPHERE</span>
          <span className="fallback-name">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`image-wrapper ${className} ${loaded ? "loaded" : "loading"}`} onClick={onClick}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className="product-actual-img"
      />
    </div>
  );
}
