import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowRight, MapPin, Eye, ChevronLeft, ChevronRight, Clock, Sparkles, Compass } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { DESTINATIONS_DATA } from '../../data/destinationsData';
import { ApiClient } from '../../api/client';

export function PopularDestinations({ onOpenTripPlanner, navigate }) {
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [packages, setPackages] = useState(DESTINATIONS_DATA);

  // Dynamically fetch packages from database
  useEffect(() => {
    let isMounted = true;
    async function loadPackages() {
      try {
        const res = await ApiClient.getPackages('all');
        if (isMounted && res && res.success && Array.isArray(res.packages)) {
          const formatted = res.packages.map((pkg) => ({
            id: pkg.slug,
            slug: pkg.slug,
            name: pkg.name,
            subtitle: pkg.destination,
            region: pkg.destination.split(',')[0],
            category: pkg.tour_category,
            image: pkg.thumbnail || pkg.featured_image,
            description: pkg.short_description || pkg.description,
            highlights: (pkg.inclusions && pkg.inclusions.length > 0) ? pkg.inclusions.slice(0, 4) : ['Custom Itinerary', 'Hotel Stay', 'Guided Tours'],
            duration: `${pkg.duration_days} Days / ${pkg.duration_nights} Nights`,
            price: pkg.total_price,
            bookingAmount: pkg.booking_amount,
            priceStatus: 'Online Booking Open',
            featured: Boolean(pkg.featured),
            tag: ({
              'long-distance': 'Long distance',
              'weekend': 'Weekend',
              'day-trip': 'Day Trip',
              'picnic': 'Get togethor / Picnic',
              'upcoming': 'Upcomeing',
              'mountains': 'Hills & Mountains',
              'nature': 'Wildlife Safari',
              'coastal': 'Beach & Coastal'
            }[pkg.tour_category] || pkg.tour_category || 'Tour Package')
          }));
          setPackages(formatted);
        }
      } catch (err) {
        console.warn('PopularDestinations: Error fetching packages from DB:', err);
      }
    }
    loadPackages();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateScrollState = useCallback(() => {
    if (!sliderRef.current) return;
    const el = sliderRef.current;
    const scrollLeft = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;

    setCanScrollPrev(scrollLeft > 10);
    setCanScrollNext(scrollLeft < maxScroll - 10);

    const firstCard = el.querySelector('.destination-slider-item');
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth + 20;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(0, index), packages.length - 1));
    }
  }, [packages.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const handleScroll = (direction) => {
    if (!sliderRef.current) return;
    const el = sliderRef.current;
    const firstCard = el.querySelector('.destination-slider-item');
    const cardWidth = firstCard ? firstCard.offsetWidth + 20 : 360;
    el.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  };

  // Auto-scroll effect (3.8s interval, pauses when hovering or touching)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (!sliderRef.current) return;
      const el = sliderRef.current;
      const firstCard = el.querySelector('.destination-slider-item');
      const cardWidth = firstCard ? firstCard.offsetWidth + 20 : 360;
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScroll - 15) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scrollToDotIndex = (index) => {
    if (!sliderRef.current) return;
    const el = sliderRef.current;
    const firstCard = el.querySelector('.destination-slider-item');
    const cardWidth = firstCard ? firstCard.offsetWidth + 20 : 360;
    el.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
  };

  return (
    <section className="section-padding bg-warm" id="destinations">
      <div className="container">
        {/* Section Header with Left/Right Navigation Arrows */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ maxWidth: '680px' }}>
            <SectionHeading
              eyebrow="Destination Inspiration"
              eyebrowVariant="teal"
              title="Explore Your Next Destination"
              subtitle="From peaceful Himalayan foothills and tea valleys to coastal beaches and forest safaris, explore travel possibilities for your next vacation."
              align="left"
              className="m-0"
            />
          </div>

          {/* Slider Navigation Arrows */}
          <div
            className="slider-arrows-wrapper"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '0.25rem'
            }}
          >
            <button
              type="button"
              className="dest-slider-nav-btn"
              onClick={() => handleScroll(-1)}
              aria-label="Previous destination"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              className="dest-slider-nav-btn"
              onClick={() => handleScroll(1)}
              aria-label="Next destination"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Slider Container (shows 3 cards on desktop) */}
        <div
          className="dest-carousel-wrapper"
          style={{ position: 'relative' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            ref={sliderRef}
            className="dest-slider-track"
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              padding: '8px 4px 18px 4px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {packages.map((dest) => {
              const slug = dest.slug;
              return (
                <div
                  key={dest.id || dest.slug}
                  className="destination-slider-item"
                  style={{
                    flex: '0 0 calc((100% - 2 * 20px) / 3)',
                    minWidth: '300px',
                    scrollSnapAlign: 'start'
                  }}
                >
                  <div
                    className="enhanced-destination-card"
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '18px',
                      border: '1px solid var(--color-border)',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(18, 48, 74, 0.06)',
                      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {/* Image Container with Badges */}
                    <div
                      className="destination-image-wrapper"
                      style={{
                        position: 'relative',
                        aspectRatio: '16 / 10',
                        overflow: 'hidden',
                        backgroundColor: '#0E2235'
                      }}
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="dest-card-img"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80';
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      />
                      
                      {/* Gradient Overlay for high readability */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(14, 34, 53, 0.45) 0%, transparent 35%, rgba(14, 34, 53, 0.75) 100%)',
                          pointerEvents: 'none'
                        }}
                      />

                      {/* Top Badges Row */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          right: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          zIndex: 2,
                          pointerEvents: 'none'
                        }}
                      >
                        {/* Category Tag */}
                        <span
                          style={{
                            backgroundColor: 'rgba(14, 34, 53, 0.85)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            color: '#FFFFFF',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Sparkles size={11} color="var(--color-accent)" />
                          <span>{dest.tag}</span>
                        </span>

                        {/* Duration Pill */}
                        <span
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.92)',
                            backdropFilter: 'blur(6px)',
                            color: 'var(--color-primary)',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                          }}
                        >
                          <Clock size={12} color="var(--color-secondary)" />
                          <span>{dest.duration}</span>
                        </span>
                      </div>

                      {/* Bottom Region Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '12px',
                          zIndex: 2,
                          pointerEvents: 'none'
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: 'rgba(14, 34, 53, 0.85)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            color: '#FFFFFF',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: '1px solid rgba(255, 255, 255, 0.15)'
                          }}
                        >
                          <MapPin size={12} color="var(--color-accent)" />
                          <span>{dest.region}</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div
                      style={{
                        padding: '1.4rem 1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.25rem',
                          color: 'var(--color-primary)',
                          margin: '0 0 4px 0',
                          lineHeight: 1.25,
                          fontWeight: 700
                        }}
                      >
                        {dest.name}
                      </h3>

                      <span
                        style={{
                          fontSize: '0.825rem',
                          fontWeight: 600,
                          color: 'var(--color-secondary)',
                          marginBottom: '0.65rem',
                          display: 'block'
                        }}
                      >
                        {dest.subtitle}
                      </span>

                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                          lineHeight: 1.55,
                          marginBottom: '0.85rem',
                          flexGrow: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {dest.description}
                      </p>

                      {/* Highlights Chips */}
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                          margin: '0 0 1.25rem 0'
                        }}
                      >
                        {dest.highlights.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.74rem',
                              padding: '4px 9px',
                              backgroundColor: 'var(--color-bg)',
                              border: '1px solid var(--color-border)',
                              borderRadius: '6px',
                              color: 'var(--color-text-main)',
                              fontWeight: 500
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      {/* Card Footer: Status & Action Buttons */}
                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: '1rem',
                          borderTop: '1px solid var(--color-border-light)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                      >
                        {/* Live Booking status & Price */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.8rem'
                          }}
                        >
                          <div>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', display: 'block' }}>
                              Starting From
                            </span>
                            {dest.price && (
                              <strong style={{ fontSize: '1.05rem', color: 'var(--color-primary)' }}>
                                ₹{Number(dest.price).toLocaleString('en-IN')}
                              </strong>
                            )}
                          </div>
                          <span style={{ color: '#16A34A', fontWeight: 700, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block' }} />
                            {dest.priceStatus}
                          </span>
                        </div>

                        {/* Action buttons row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/tours/${slug}`)}
                            icon={<Eye size={14} />}
                            style={{
                              padding: '9px 8px',
                              fontSize: '0.84rem',
                              width: '100%',
                              borderRadius: '9px',
                              fontWeight: 600
                            }}
                          >
                            Details
                          </Button>

                          <Button
                            variant="amber"
                            size="sm"
                            onClick={() => navigate(`/book/${slug}`)}
                            icon={<ArrowRight size={14} />}
                            style={{
                              padding: '9px 8px',
                              fontSize: '0.84rem',
                              width: '100%',
                              borderRadius: '9px',
                              fontWeight: 700,
                              boxShadow: '0 4px 12px rgba(244, 163, 64, 0.25)'
                            }}
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Dots Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '1.25rem' }}>
          {packages.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => scrollToDotIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              style={{
                width: activeIndex === dotIdx ? '26px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: activeIndex === dotIdx ? 'var(--color-primary)' : 'var(--color-border)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          ))}
        </div>

        {/* View All CTA */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              navigate('/tours');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            icon={<ArrowRight size={18} />}
          >
            Browse All Tours & Destinations ({packages.length})
          </Button>
        </div>
      </div>

      {/* Embedded CSS for 3-card layout and hover animations */}
      <style>{`
        .dest-slider-track::-webkit-scrollbar {
          display: none;
        }

        .dest-slider-nav-btn {
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

        .dest-slider-nav-btn:hover {
          background-color: var(--color-primary);
          color: #FFFFFF;
          border-color: var(--color-primary);
          transform: translateY(-2px) scale(1.05);
          box-shadow: var(--shadow-md);
        }

        .dest-slider-nav-btn:active {
          transform: scale(0.95);
        }

        .enhanced-destination-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(18, 48, 74, 0.14);
          border-color: rgba(22, 124, 128, 0.4);
        }

        .enhanced-destination-card:hover .dest-card-img {
          transform: scale(1.08);
        }

        /* Desktop: Exactly 3 cards visible */
        @media (min-width: 1024px) {
          .destination-slider-item {
            flex: 0 0 calc((100% - 2 * 20px) / 3) !important;
          }
        }

        /* Tablet: 2 cards visible */
        @media (max-width: 1023px) and (min-width: 680px) {
          .destination-slider-item {
            flex: 0 0 calc((100% - 20px) / 2) !important;
          }
        }

        /* Mobile: 1 card + peek */
        @media (max-width: 679px) {
          .destination-slider-item {
            flex: 0 0 88% !important;
          }
        }
      `}</style>
    </section>
  );
}
export default PopularDestinations;
