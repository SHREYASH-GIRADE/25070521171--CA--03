import { Truck, ShieldCheck, RotateCcw, Headphones, Lock } from "lucide-react";

export default function TrustSection() {
  const pillars = [
    {
      icon: <Truck size={24} className="trust-pillar-icon" />,
      title: "Complimentary Delivery",
      description: "Fast nationwide express courier dispatch on all orders above ₹1,999 across India."
    },
    {
      icon: <Lock size={24} className="trust-pillar-icon" />,
      title: "Encrypted Transactions",
      description: "256-bit SSL encrypted order processing backed by local MongoDB database storage."
    },
    {
      icon: <RotateCcw size={24} className="trust-pillar-icon" />,
      title: "7-Day Easy Returns",
      description: "Doorstep inspection and replacement for any transit damage or manufacturing defect."
    },
    {
      icon: <Headphones size={24} className="trust-pillar-icon" />,
      title: "Dedicated Concierge",
      description: "Prompt customer assistance available Monday through Saturday via email and phone."
    }
  ];

  return (
    <section className="trust-section">
      <div className="trust-container">
        <div className="trust-grid">
          {pillars.map((pillar, i) => (
            <div key={i} className="trust-pillar-card">
              <div className="trust-icon-container">{pillar.icon}</div>
              <h3 className="trust-pillar-title">{pillar.title}</h3>
              <p className="trust-pillar-desc">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
