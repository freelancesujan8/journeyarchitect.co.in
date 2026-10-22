import React, { useState, useRef } from 'react';
import { Camera, MapPin, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { LightboxModal } from './LightboxModal';

// Exactly 16 curated high-res travel images (8 in Line 1, 8 in Line 2)
const DEFAULT_16_IMAGES = [
  // Line 1 (8 images)
  {
    id: "r1-1",
    src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    title: "Kanchenjunga Golden Sunrise",
    location: "Tiger Hill, Darjeeling"
  },
  {
    id: "r1-2",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    title: "Gurudongmar Glacial Lake",
    location: "North Sikkim (17,800 ft)"
  },
  {
    id: "r1-3",
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    title: "Pine Canopy Trails",
    location: "Lava & Rishop"
  },
  {
    id: "r1-4",
    src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    title: "Scenic Teesta Valley Road",
    location: "Sikkim Highway"
  },
  {
    id: "r1-5",
    src: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
    title: "Monastery Stupas",
    location: "Gangtok Ridge"
  },
  {
    id: "r1-6",
    src: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80",
    title: "Wildlife Safari Trail",
    location: "Gorumara National Park"
  },
  {
    id: "r1-7",
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    title: "Starlit Highland Twilight",
    location: "Lachen Valley"
  },
  {
    id: "r1-8",
    src: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
    title: "Alpine Valleys & Meadows",
    location: "Yumthang Valley"
  },

  // Line 2 (8 images)
  {
    id: "r2-1",
    src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    title: "Mangrove Estuary Cruise",
    location: "Sundarbans Delta"
  },
  {
    id: "r2-2",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    title: "Golden Coast Horizon",
    location: "Puri Beach"
  },
  {
    id: "r2-3",
    src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    title: "Deep Tea Trail",
    location: "Lataguri Foothills"
  },
  {
    id: "r2-4",
    src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    title: "Emerald Tea Terraces",
    location: "Happy Valley Estate"
  },
  {
    id: "r2-5",
    src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    title: "Riverside Forest Shallows",
    location: "Murti Riverbank"
  },
  {
    id: "r2-6",
    src: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80",
    title: "Majestic Himalayan Passes",
    location: "Nathula Pass Border"
  },
  {
    id: "r2-7",
    src: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80",
    title: "Traveler Memories & Joy",
    location: "Himalayan Viewpoint"
  },
  {
    id: "r2-8",
    src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    title: "High Mountain Explorers",
    location: "Zero Point"
  }
];

export function MasonryStreamGallery({
  destinationName = "Destinations",
  images = []
}) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);

  // Exact 16 images maximum (8 per line)
  const allImages = React.useMemo(() => {
    if (images && images.length >= 6) {
      return images.slice(0, 16).map((img, i) => ({
        id: `img-${i}`,
        src: typeof img === 'string' ? img : img.src || img.image,
        title: img.title || `${destinationName} Highlight ${i + 1}`,
        location: img.location || destinationName
      }));
    }
    return DEFAULT_16_IMAGES.slice(0, 16);
  }, [images, destinationName]);

  // Split into 2 lines of 8 images each
  const line1Images = allImages.slice(0, 8);
  const line2Images = allImages.slice(8, 16);

  const handleManualScroll = (direction) => {
    const amount = direction === 'left' ? -380 : 380;
    if (track1Ref.current) track1Ref.current.scrollBy({ left: amount, behavior: 'smooth' });
    if (track2Ref.current) track2Ref.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const flatListForLightbox = allImages.map(img => ({
    image: img.src,
    title: img.title,
    alt: `${img.title} - ${img.location}`
  }));

  return (
    <section
      className="two-line-gallery-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      style={{
        backgroundColor: '#FFFFFF',
        padding: '36px 0 44px 0',
        borderTop: '1px solid var(--color-border)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Top Controls Row (Without Section Title and Description) */}
      <div className="container" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Camera size={15} color="var(--color-secondary)" />
            <span>Click to view full size</span>
          </span>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="gallery-nav-arrow-btn"
              onClick={() => handleManualScroll('left')}
              aria-label="Previous gallery images"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              className="gallery-nav-arrow-btn"
              onClick={() => handleManualScroll('right')}
              aria-label="Next gallery images"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 2-LINE CONTINUOUS AUTO-SCROLLING GALLERY TRACKS */}
      <div
        className="two-line-gallery-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {/* LINE 1 (Auto-scrolls left) */}
        <div className="marquee-wrapper">
          <div
            ref={track1Ref}
            className={`marquee-track scroll-line-1 ${isPaused ? 'paused' : ''}`}
          >
            {/* Render 2 sets for continuous infinite loop */}
            {[...line1Images, ...line1Images].map((item, idx) => {
              const globalIdx = idx % line1Images.length;
              return (
                <div
                  key={`line1-${item.id}-${idx}`}
                  className="two-line-photo-card"
                  onClick={() => setLightboxIndex(globalIdx)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${item.title}`}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="gallery-card-img"
                  />
                  <div className="card-gradient-overlay" />
                  <div className="card-caption-bar">
                    <span className="card-location-pill">
                      <MapPin size={11} color="var(--color-accent)" />
                      <span>{item.location}</span>
                    </span>
                    <span className="card-zoom-circle">
                      <Maximize2 size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LINE 2 (Auto-scrolls left with staggered offset) */}
        <div className="marquee-wrapper">
          <div
            ref={track2Ref}
            className={`marquee-track scroll-line-2 ${isPaused ? 'paused' : ''}`}
          >
            {/* Render 2 sets for continuous infinite loop */}
            {[...line2Images, ...line2Images].map((item, idx) => {
              const globalIdx = 8 + (idx % line2Images.length);
              return (
                <div
                  key={`line2-${item.id}-${idx}`}
                  className="two-line-photo-card"
                  onClick={() => setLightboxIndex(globalIdx)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${item.title}`}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="gallery-card-img"
                  />
                  <div className="card-gradient-overlay" />
                  <div className="card-caption-bar">
                    <span className="card-location-pill">
                      <MapPin size={11} color="var(--color-accent)" />
                      <span>{item.location}</span>
                    </span>
                    <span className="card-zoom-circle">
                      <Maximize2 size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      <LightboxModal
        images={flatListForLightbox}
        activeIndex={lightboxIndex !== null ? lightboxIndex : 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />

      {/* Scoped CSS for 2-Line Infinite Auto-Scroll & Navigation Arrows */}
      <style>{`
        .marquee-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .marquee-track {
          display: flex;
          gap: 14px;
          width: max-content;
        }

        @keyframes marqueeScrollLine1 {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 7px));
          }
        }

        @keyframes marqueeScrollLine2 {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 7px));
          }
        }

        .scroll-line-1 {
          animation: marqueeScrollLine1 32s linear infinite;
        }

        .scroll-line-2 {
          animation: marqueeScrollLine2 36s linear infinite;
        }

        .marquee-track.paused {
          animation-play-state: paused !important;
        }

        .two-line-photo-card {
          flex: 0 0 auto;
          width: 320px;
          height: 210px;
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(18, 48, 74, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.08);
          background-color: #F1F5F9;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .gallery-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .two-line-photo-card:hover .gallery-card-img {
          transform: scale(1.08);
        }

        .two-line-photo-card:hover {
          border-color: var(--color-accent) !important;
          box-shadow: 0 10px 25px rgba(18, 48, 74, 0.18) !important;
        }

        .card-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(14, 34, 53, 0.85) 0%, rgba(14, 34, 53, 0.15) 50%, transparent 100%);
          pointer-events: none;
        }

        .card-caption-bar {
          position: absolute;
          bottom: 10px;
          left: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
          pointer-events: none;
        }

        .card-location-pill {
          background: rgba(14, 34, 53, 0.85);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: #FFFFFF;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          max-width: 82%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-zoom-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: var(--color-accent);
          color: #0E2235;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .gallery-nav-arrow-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background-color: #FFFFFF;
          border: 1.5px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gallery-nav-arrow-btn:hover {
          background-color: var(--color-primary);
          color: #FFFFFF;
          border-color: var(--color-primary);
          transform: translateY(-2px) scale(1.05);
          box-shadow: var(--shadow-md);
        }

        .gallery-nav-arrow-btn:active {
          transform: scale(0.95);
        }

        @media (max-width: 600px) {
          .two-line-photo-card {
            width: 260px !important;
            height: 175px !important;
          }
          .gallery-nav-arrow-btn {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </section>
  );
}
