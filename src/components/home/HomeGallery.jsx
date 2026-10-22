import React, { useState, useEffect } from 'react';
import { ArrowRight, Maximize2, MapPin, Sparkles, Camera } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { LightboxModal } from '../common/LightboxModal';
import { GALLERY_DATA, GALLERY_CATEGORIES } from '../../data/galleryData';
import { ApiClient } from '../../api/client';

const FALLBACK_IMG = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80";

export function HomeGallery({ navigate }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryList, setGalleryList] = useState(GALLERY_DATA);

  // Fetch live gallery from database
  useEffect(() => {
    let isMounted = true;
    async function loadGallery() {
      try {
        const res = await ApiClient.getGallery('all');
        if (isMounted && res && res.items && res.items.length > 0) {
          setGalleryList(res.items);
        }
      } catch (err) {
        console.warn('HomeGallery: Fallback to local gallery data:', err);
      }
    }
    loadGallery();
    return () => { isMounted = false; };
  }, []);

  // Filter items based on active category
  const filteredImages = selectedCategory === 'all'
    ? galleryList
    : galleryList.filter((img) => img.category === selectedCategory);

  const displayImages = filteredImages.slice(0, 6);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  return (
    <section className="section-padding bg-warm" id="home-gallery">
      <div className="container">
        {/* Section Heading */}
        <SectionHeading
          eyebrow="Visual Inspiration"
          eyebrowVariant="teal"
          title="Moments Worth Travelling For"
          subtitle="A glimpse of scenic tea valleys, misty mountain passes, pristine beaches, and peaceful holiday getaways."
        />

        {/* Interactive Filter Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}
        >
          {GALLERY_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? 'var(--color-primary)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-main)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
                  boxShadow: isActive ? '0 4px 12px rgba(18, 48, 74, 0.15)' : 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.borderColor = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Bento Mosaic Layout */}
        <div className="home-bento-gallery">
          {displayImages.map((item, index) => {
            const isFeatured = index === 0 && selectedCategory === 'all';
            return (
              <div
                key={item.id}
                className={`bento-gallery-card ${isFeatured ? 'bento-featured' : ''}`}
                onClick={() => openLightbox(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View photo: ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="bento-gallery-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                />

                {/* Permanent subtle top pill */}
                <div className="bento-top-badges">
                  {item.location && (
                    <span className="bento-location-pill">
                      <MapPin size={11} />
                      <span>{item.location}</span>
                    </span>
                  )}
                  {isFeatured && (
                    <span className="bento-featured-pill">
                      <Sparkles size={11} />
                      <span>Featured Spot</span>
                    </span>
                  )}
                </div>

                {/* Bottom glassmorphic overlay */}
                <div className="bento-overlay">
                  <span className="bento-category-tag">{item.categoryLabel}</span>
                  <h3 className="bento-title">{item.title}</h3>
                  <p className="bento-caption">{item.caption}</p>
                  <div className="bento-action-hint">
                    <Maximize2 size={13} />
                    <span>Click to view full photo</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View Full Gallery Link */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '2.25rem',
            gap: '12px'
          }}
        >
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              navigate('/gallery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            icon={<ArrowRight size={16} />}
          >
            Explore Complete Travel Gallery (100+ Photos)
          </Button>
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        images={displayImages}
        activeIndex={lightboxIndex !== null ? lightboxIndex : 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />

      {/* Scoped CSS for Bento Gallery */}
      <style>{`
        .home-bento-gallery {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 240px;
          gap: 16px;
        }

        .bento-gallery-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          background-color: #0E2235;
        }

        .bento-gallery-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(18, 48, 74, 0.16);
        }

        /* Hero Spotlight item spans 2 columns & 2 rows */
        .bento-gallery-card.bento-featured {
          grid-column: span 2;
          grid-row: span 2;
        }

        .bento-gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bento-gallery-card:hover .bento-gallery-img {
          transform: scale(1.06);
        }

        /* Top Location & Featured Pills */
        .bento-top-badges {
          position: absolute;
          top: 14px;
          left: 14px;
          right: 14px;
          display: flex;
          align-items: center;
          justifyContent: space-between;
          gap: 8px;
          z-index: 2;
          pointer-events: none;
        }

        .bento-location-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(14, 34, 53, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .bento-featured-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(244, 163, 64, 0.9);
          color: #0E2235;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        /* Bottom Overlay */
        .bento-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(14, 34, 53, 0.95) 0%, rgba(14, 34, 53, 0.4) 45%, rgba(14, 34, 53, 0) 75%);
          display: flex;
          flex-direction: column;
          justifyContent: flex-end;
          padding: 1.25rem;
          color: #FFFFFF;
          z-index: 1;
          transition: background 0.3s ease;
        }

        .bento-featured .bento-overlay {
          padding: 1.75rem;
        }

        .bento-category-tag {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-accent);
          font-weight: 700;
          margin-bottom: 4px;
        }

        .bento-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }

        .bento-featured .bento-title {
          font-size: 1.45rem;
        }

        .bento-caption {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 8px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .bento-featured .bento-caption {
          font-size: 0.88rem;
          -webkit-line-clamp: 3;
        }

        .bento-action-hint {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--color-accent);
          font-size: 0.75rem;
          font-weight: 600;
          opacity: 0.9;
          transform: translateY(2px);
          transition: all 0.25s ease;
        }

        .bento-gallery-card:hover .bento-action-hint {
          opacity: 1;
          transform: translateY(0);
          color: #FFFFFF;
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .home-bento-gallery {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 220px;
          }
          .bento-gallery-card.bento-featured {
            grid-column: span 2;
            grid-row: span 1;
          }
        }

        @media (max-width: 580px) {
          .home-bento-gallery {
            grid-template-columns: 1fr;
            grid-auto-rows: 220px;
          }
          .bento-gallery-card.bento-featured {
            grid-column: span 1;
            grid-row: span 1;
          }
        }
      `}</style>
    </section>
  );
}
