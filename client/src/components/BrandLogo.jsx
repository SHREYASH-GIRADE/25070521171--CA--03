export default function BrandLogo({ variant = "dark", size = "normal", onClick = null }) {
  const isLight = variant === "light";

  const sizeStyles = {
    small: { icon: 26, fontSize: "18px", gap: "8px" },
    normal: { icon: 32, fontSize: "22px", gap: "10px" },
    large: { icon: 42, fontSize: "28px", gap: "14px" }
  }[size] || { icon: 32, fontSize: "22px", gap: "10px" };

  return (
    <button
      type="button"
      className={`brand-logo-btn ${isLight ? "brand-light" : "brand-dark"}`}
      onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: sizeStyles.gap }}
      aria-label="ShopSphere Home"
    >
      <svg
        width={sizeStyles.icon}
        height={sizeStyles.icon}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-logo-svg"
      >
        {/* Outer subtle sphere ring */}
        <circle
          cx="18"
          cy="18"
          r="16.5"
          stroke={isLight ? "rgba(255,255,255,0.2)" : "#E4E7EC"}
          strokeWidth="1.2"
        />
        {/* Orbital gold ellipse */}
        <ellipse
          cx="18"
          cy="18"
          rx="15"
          ry="6.5"
          transform="rotate(-25 18 18)"
          stroke="#B88A44"
          strokeWidth="1.6"
          strokeDasharray="2 1"
        />
        {/* Luxury shopping bag silhouette */}
        <rect
          x="11"
          y="14"
          width="14"
          height="13"
          rx="2.5"
          fill={isLight ? "#FFFFFF" : "#101828"}
        />
        {/* Handle */}
        <path
          d="M14.5 14V11C14.5 9.067 16.067 7.5 18 7.5C19.933 7.5 21.5 9.067 21.5 11V14"
          stroke="#B88A44"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Micro sphere center accent */}
        <circle cx="18" cy="20.5" r="1.5" fill="#B88A44" />
      </svg>

      <span
        className="brand-title"
        style={{
          fontSize: sizeStyles.fontSize,
          fontWeight: 700,
          letterSpacing: "-0.5px",
          fontFamily: "var(--font-heading)"
        }}
      >
        <span className="brand-shop" style={{ color: isLight ? "#FFFFFF" : "#101828" }}>
          Shop
        </span>
        <span className="brand-sphere" style={{ color: isLight ? "#FDF8ED" : "#101828" }}>
          Sphere
        </span>
        <span className="brand-dot" style={{ color: "#B88A44" }}>
          .
        </span>
      </span>
    </button>
  );
}
