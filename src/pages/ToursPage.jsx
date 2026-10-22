import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Clock, ShieldCheck, Compass, Sparkles, Send } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Button } from '../components/common/Button';
import { ApiClient } from '../api/client';
import { DESTINATIONS_DATA, DESTINATION_CATEGORIES } from '../data/destinationsData';

export function ToursPage({ onOpenTripPlanner, navigate }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [packages, setPackages] = useState(DESTINATIONS_DATA);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPackages() {
      try {
        setLoading(true);
        const res = await ApiClient.getPackages(selectedCategory);
        if (isMounted) {
          if (res && res.success && Array.isArray(res.packages)) {
            setPackages(res.packages);
          } else {
            const filtered = DESTINATIONS_DATA.filter((pkg) =>
              selectedCategory === 'all' ? true : (pkg.tour_category === selectedCategory || pkg.category === selectedCategory)
            );
            setPackages(filtered);
          }
        }
      } catch (err) {
        console.warn('ToursPage: Error loading packages from API, using fallback:', err);
        if (isMounted) {
          const filtered = DESTINATIONS_DATA.filter((pkg) =>
            selectedCategory === 'all' ? true : (pkg.tour_category === selectedCategory || pkg.category === selectedCategory)
          );
          setPackages(filtered);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadPackages();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  return (
    <>
      <SEOHead
        title="Tours & Holiday Packages | Online Booking Available"
        description="Explore holiday tour destinations and travel packages with Journey Architect. Book Darjeeling, Sikkim, Dooars, Puri with instant PDF confirmation."
        path="/tours"
      />

      {/* Page Banner */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-nav">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
            <span>/</span>
            <span>Tours & Packages</span>
          </div>

          <span className="eyebrow eyebrow-amber">
            Verified Travel Packages
          </span>

          <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.25rem)' }}>
            Tour Packages & Online Booking
          </h1>

          <p>
            Explore handcrafted tour packages with detailed itineraries, transparent advance booking amounts, and instant official PDF travel vouchers.
          </p>
        </div>
      </div>

      {/* Main Tour Catalog Section */}
      <section className="section-padding bg-warm">
        <div className="container">
          {/* Category Filter Chips */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '3rem'
            }}
          >
            {DESTINATION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: selectedCategory === cat.id ? 700 : 500,
                  backgroundColor: selectedCategory === cat.id ? 'var(--color-primary)' : '#FFFFFF',
                  color: selectedCategory === cat.id ? '#FFFFFF' : 'var(--color-text-main)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--color-border)',
                  boxShadow: selectedCategory === cat.id ? '0 4px 12px rgba(18, 48, 74, 0.2)' : 'none',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Destination & Package Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px', borderColor: 'var(--color-teal)', borderTopColor: 'transparent' }} />
              <p style={{ color: 'var(--color-text-muted)' }}>Loading verified tour packages from database...</p>
            </div>
          ) : (
            <div className="grid-2" style={{ gap: '2.5rem' }}>
              {packages.map((pkg) => {
                const remainingSeats = pkg.max_seats ? Math.max(0, pkg.max_seats - (pkg.booked_seats || 0)) : null;
                const isSoldOut = pkg.availability_status === 'sold_out' || (remainingSeats !== null && remainingSeats === 0);
                const thumbnail = pkg.thumbnail || pkg.featured_image || pkg.image;
                const destinationName = pkg.destination || pkg.region || 'India';
                const durationDays = pkg.duration_days || (pkg.duration ? parseInt(pkg.duration) : 4);
                const durationNights = pkg.duration_nights || Math.max(1, durationDays - 1);
                const totalPrice = pkg.total_price || 20000;
                const bookingAmount = pkg.booking_amount || Math.round(totalPrice * 0.25);
                const inclusions = pkg.inclusions || [];

                return (
                  <div key={pkg.id || pkg.slug} className="destination-card">
                    <div className="destination-image-wrapper" style={{ position: 'relative' }}>
                      <img
                        src={thumbnail}
                        alt={pkg.name}
                        className="destination-image"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      {/* Subtle gradient overlay for readability */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(14, 34, 53, 0.35) 0%, transparent 35%, rgba(14, 34, 53, 0.7) 100%)',
                          pointerEvents: 'none'
                        }}
                      />

                      {/* Top Badges: Category on Left, Urgency on Right */}
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
                          pointerEvents: 'none',
                          zIndex: 2
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: 'rgba(14, 34, 53, 0.88)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            color: '#FFFFFF',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          {({
                            'long-distance': 'Long distance',
                            'weekend': 'Weekend',
                            'day-trip': 'Day Trip',
                            'picnic': 'Get togethor / Picnic',
                            'upcoming': 'Upcomeing',
                            'mountains': 'Mountains & Hills',
                            'nature': 'Nature & Wildlife',
                            'coastal': 'Beach & Coastal',
                            'heritage': 'Heritage & Pilgrimage'
                          }[pkg.tour_category] || pkg.tour_category || 'Tour Package')}
                        </span>

                        {remainingSeats !== null && !isSoldOut ? (
                          <span
                            style={{
                              backgroundColor: 'rgba(244, 163, 64, 0.95)',
                              color: '#12304A',
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}
                          >
                            🔥 {remainingSeats} Seats Left
                          </span>
                        ) : (
                          <span
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              color: 'var(--color-primary)',
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.74rem',
                              fontWeight: 700
                            }}
                          >
                            {durationDays}D / {durationNights}N
                          </span>
                        )}
                      </div>

                      {/* Bottom Badges: Destination Location Pill on Left */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '12px',
                          right: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          pointerEvents: 'none',
                          zIndex: 2
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(6px)',
                            WebkitBackdropFilter: 'blur(6px)',
                            color: 'var(--color-primary)',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            maxWidth: '75%',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                          }}
                        >
                          <MapPin size={12} color="var(--color-secondary)" flexShrink={0} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{destinationName}</span>
                        </span>

                        {remainingSeats !== null && !isSoldOut && (
                          <span
                            style={{
                              backgroundColor: 'rgba(14, 34, 53, 0.85)',
                              color: '#FFFFFF',
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              border: '1px solid rgba(255, 255, 255, 0.15)'
                            }}
                          >
                            {durationDays}D / {durationNights}N
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="destination-body">
                      <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                        {pkg.name}
                      </h3>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '0.75rem', display: 'block' }}>
                        {durationDays} Days / {durationNights} Nights • {pkg.hotel_info || 'Deluxe Mountain Stays'}
                      </span>

                      <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                        {pkg.short_description || pkg.description}
                      </p>

                      {/* Inclusions Chips */}
                      {inclusions && inclusions.length > 0 && (
                        <div style={{ marginBottom: '1.25rem' }}>
                          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 700 }}>
                            Key Inclusions
                          </span>
                          <div className="destination-highlights" style={{ margin: 0 }}>
                            {inclusions.slice(0, 3).map((item, idx) => (
                              <span key={idx} className="highlight-chip">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Card Footer with Live Pricing & Booking CTA */}
                      <div className="destination-footer" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Starting From</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                            ₹{Number(totalPrice).toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
                            Advance: ₹{Number(bookingAmount).toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => navigate(`/tours/${pkg.slug}`)}
                            className="btn btn-outline"
                            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                          >
                            Details
                          </button>

                          <button
                            type="button"
                            disabled={isSoldOut}
                            onClick={() => navigate(`/book/${pkg.slug}`)}
                            className="btn btn-primary"
                            style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <span>{isSoldOut ? 'Sold Out' : 'Book Now'}</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Custom Destination Banner Callout */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(2rem, 4vw, 3rem)',
              marginTop: '4rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-secondary-subtle)',
                color: 'var(--color-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Compass size={28} />
            </div>

            <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Want to visit a destination not listed above?
            </h3>

            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', maxWidth: '600px', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Whether it's a specific temple pilgrimage, a customized heritage tour, or an offbeat hill retreat, we help you plan journeys across India based on your personal wishlist.
            </p>

            <Button
              variant="primary"
              size="lg"
              onClick={() => onOpenTripPlanner('customized')}
              icon={<Send size={16} />}
            >
              Design a Custom Itinerary
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
export default ToursPage;
