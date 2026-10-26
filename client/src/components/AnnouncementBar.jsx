import { useState } from "react";
import { Sparkles, X, ShieldCheck } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="announcement-bar">
      <div className="announcement-content">
        <div className="announcement-left">
          <span className="announcement-badge">PRIVILEGE</span>
          <span className="announcement-text">
            Complimentary express delivery across India on orders above ₹1,999
          </span>
        </div>

        <div className="announcement-center">
          <span className="announcement-code-hint">
            Use code <strong>SPHERE10</strong> at checkout for 10% privilege savings
          </span>
        </div>

        <div className="announcement-right">
          <span className="announcement-location">IN · INR (₹)</span>
          <button
            type="button"
            className="announcement-close"
            onClick={() => setVisible(false)}
            aria-label="Dismiss notice"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
