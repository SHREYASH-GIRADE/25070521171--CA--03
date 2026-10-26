import { ArrowRight, Sparkles } from "lucide-react";
import { categoriesData } from "../data/defaultProducts";

export default function CategorySection({ activeCategory, onSelectCategory }) {
  return (
    <section className="category-section">
      <div className="section-header-wrap">
        <div>
          <div className="section-eyebrow">
            <Sparkles size={13} className="eyebrow-sparkle" />
            <span>DISCOVER BY CURATION</span>
          </div>
          <h2 className="section-title">Explore Distinct Collections</h2>
          <p className="section-subtitle">
            Fine products organized by lifestyle discipline, each meeting our rigorous design and build criteria.
          </p>
        </div>
      </div>

      <div className="category-grid">
        {categoriesData.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <article
              key={cat.id}
              className={`category-card ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <div className="category-image-wrap">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="category-img"
                />
                <div className="category-overlay" />
              </div>

              <div className="category-content">
                <div className="category-header-row">
                  <span className="category-item-count">{cat.itemCount}</span>
                  <span className="category-tagline">{cat.tagline}</span>
                </div>

                <h3 className="category-name">{cat.name}</h3>
                <p className="category-desc">{cat.description}</p>

                <div className="category-cta">
                  <span>Explore {cat.name}</span>
                  <ArrowRight size={16} className="category-arrow" />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
