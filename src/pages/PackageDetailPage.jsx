import React, { useState, useEffect } from 'react';
import {
  Clock, MapPin, Check, X, Shield, Calendar, Users, AlertCircle,
  MessageCircle, Sparkles, Hotel, Car, Utensils, ChevronDown, ChevronUp,
  ArrowRight, Phone, Mail, Navigation, ShieldCheck, CheckCircle2,
  CalendarCheck, Info
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { MasonryStreamGallery } from '../components/common/MasonryStreamGallery';
import { ApiClient } from '../api/client';
import { SEED_PACKAGES_PARSED } from '../data/seedPackagesData';
import { BUSINESS_CONFIG, getWhatsAppUrl, getPhoneCallUrl } from '../config/businessConfig';

// Destination-specific curated photo sets for the 6-column masonry stream
const DESTINATION_GALLERY_SETS = {
  mountains: [
    { src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80", height: 280, title: "Kanchenjunga Sunrise", location: "Tiger Hill, Darjeeling" },
    { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", height: 160, title: "Gurudongmar Glacial Lake", location: "North Sikkim (17,800 ft)" },
    { src: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80", height: 140, title: "Misty Mountain Monasteries", location: "Gangtok Ridge" },
    { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80", height: 200, title: "Pine Forest Trails", location: "Kalimpong & Lava" },
    { src: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80", height: 260, title: "High Altitude Passes", location: "Nathula Pass Border" },
    { src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80", height: 170, title: "Scenic Teesta Valley Road", location: "Sikkim Highway" },
    { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80", height: 320, title: "Starlit Highland Twilight", location: "Lachen Valley" },
    { src: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80", height: 150, title: "Alpine Valleys & Meadows", location: "Yumthang Valley" },
    { src: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80", height: 170, title: "Traveler Memories & Joy", location: "Himalayan Viewpoint" },
    { src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80", height: 340, title: "Emerald Tea Terraces", location: "Happy Valley Estate" },
    { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", height: 160, title: "Tsomgo Glacial Lake", location: "East Sikkim" },
    { src: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80", height: 360, title: "Majestic Snow Peaks", location: "North Sikkim" },
    { src: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80", height: 180, title: "Rumtek Monastery Stupas", location: "Gangtok" },
    { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80", height: 230, title: "Cedar Canopy Walk", location: "Delo Hill" },
    { src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80", height: 320, title: "High Mountain Explorers", location: "Zero Point" }
  ],
  nature: [
    { src: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80", height: 280, title: "Jungle Safari Trails", location: "Gorumara National Park" },
    { src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80", height: 160, title: "Deep Forest Canopy", location: "Lataguri" },
    { src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80", height: 140, title: "Murti River Shallows", location: "Murti Riverbank" },
    { src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80", height: 320, title: "Mangrove Estuary Cruise", location: "Sundarbans Delta" },
    { src: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=800&q=80", height: 220, title: "One-Horned Rhinoceros", location: "Jaldapara Sanctuary" },
    { src: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80", height: 170, title: "Tea Resort Bonfire", location: "Dooars" },
    { src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80", height: 340, title: "Riverside Forest Stroll", location: "Suntalekhola" },
    { src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80", height: 160, title: "Tea Garden Trails", location: "Samsing Hills" },
    { src: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80", height: 360, title: "Wilderness Canopy", location: "Buxa Tiger Reserve" }
  ],
  coastal: [
    { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", height: 280, title: "Golden Beach Waves", location: "Puri Sea Beach" },
    { src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80", height: 160, title: "Chilika Lake Lagoon", location: "Satapada Dolphin Point" },
    { src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80", height: 320, title: "Marine Drive Coastal Highway", location: "Puri to Konark" },
    { src: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80", height: 180, title: "Beachside Sunset Walks", location: "Chandrabhaga Beach" },
    { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", height: 340, title: "Ocean Horizon at Dusk", location: "VIP Road Coast" },
    { src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80", height: 160, title: "Artisan Heritage Village", location: "Raghurajpur" }
  ]
};

export default function PackageDetailPage({ slug, onNavigate }) {
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadPackage() {
      try {
        setLoading(true);
        setError(null);
        const res = await ApiClient.getPackageBySlug(slug);
        if (isMounted) {
          if (res && res.package) {
            setPkg(res.package);
          } else {
            const fallbackPkg = SEED_PACKAGES_PARSED.find(p => p.slug === slug);
            if (fallbackPkg) {
              setPkg(fallbackPkg);
            } else {
              setError('Tour package not found');
            }
          }
        }
      } catch (err) {
        console.error('PackageDetailPage: API error, attempting fallback:', err);
        if (isMounted) {
          const fallbackPkg = SEED_PACKAGES_PARSED.find(p => p.slug === slug);
          if (fallbackPkg) {
            setPkg(fallbackPkg);
          } else {
            setError(err.message || 'Failed to load package details');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadPackage();
    window.scrollTo(0, 0);
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px', borderColor: 'var(--color-teal)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--color-text-muted)' }}>Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <AlertCircle size={48} color="#DC2626" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ color: 'var(--color-navy)', marginBottom: '12px' }}>Tour Package Not Found</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>{error || "The package you are looking for might have been updated or moved."}</p>
          <button className="btn btn-primary" onClick={() => onNavigate('/tours')}>Browse All Packages</button>
        </div>
      </div>
    );
  }

  const remainingSeats = pkg.max_seats ? Math.max(0, pkg.max_seats - (pkg.booked_seats || 0)) : null;
  const isSoldOut = pkg.availability_status === 'sold_out' || (remainingSeats !== null && remainingSeats === 0);

  // Safely parse JSON array fields from DB
  let safeItinerary = pkg.itinerary;
  if (typeof safeItinerary === 'string') {
    try { safeItinerary = JSON.parse(safeItinerary); } catch { safeItinerary = []; }
  }
  if (!Array.isArray(safeItinerary)) safeItinerary = [];

  let safeInclusions = pkg.inclusions;
  if (typeof safeInclusions === 'string') {
    try { safeInclusions = JSON.parse(safeInclusions); } catch { safeInclusions = []; }
  }
  if (!Array.isArray(safeInclusions)) safeInclusions = [];

  let safeExclusions = pkg.exclusions;
  if (typeof safeExclusions === 'string') {
    try { safeExclusions = JSON.parse(safeExclusions); } catch { safeExclusions = []; }
  }
  if (!Array.isArray(safeExclusions)) safeExclusions = [];

  // Get gallery list matching package category or custom images
  let customGallery = [];
  let rawGallery = pkg.gallery_images;
  if (typeof rawGallery === 'string') {
    try { rawGallery = JSON.parse(rawGallery); } catch { rawGallery = []; }
  }
  if (Array.isArray(rawGallery) && rawGallery.length > 0) {
    customGallery = rawGallery.map((img, i) => ({
      src: img,
      height: [280, 160, 200, 320, 170, 340][i % 6],
      title: `${pkg.destination} Photo #${i + 1}`,
      location: pkg.destination
    }));
  }

  const gallerySet = customGallery.length > 0
    ? customGallery
    : (DESTINATION_GALLERY_SETS[pkg.tour_category] || DESTINATION_GALLERY_SETS.mountains);

  return (
    <>
      <SEOHead
        title={`${pkg.name} | Tour Package Details | Journey Architect`}
        description={pkg.short_description || `${pkg.name} tour package with day-wise itinerary, verified hotel stays, and online booking.`}
        path={`/tours/${pkg.slug}`}
      />

      <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Header Banner */}
        <div style={{ backgroundColor: '#0E2235', color: '#FFFFFF', padding: '36px 0 48px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="container">
            {/* Breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#B3C8D9', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('/')}>Home</span>
              <span>/</span>
              <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('/tours')}>Tour Packages</span>
              <span>/</span>
              <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{pkg.destination}</span>
            </div>

            {/* Badges row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  color: '#FFFFFF',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {pkg.tour_category || 'Featured Tour'}
              </span>

              {remainingSeats !== null && !isSoldOut && (
                <span
                  style={{
                    backgroundColor: 'rgba(244, 163, 64, 0.2)',
                    color: 'var(--color-accent)',
                    border: '1px solid rgba(244, 163, 64, 0.4)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  🔥 {remainingSeats} Seats Left
                </span>
              )}

              <span
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CalendarCheck size={13} color="var(--color-accent)" />
                <span>{pkg.start_date || 'Every Friday & Custom Dates'}</span>
              </span>
            </div>

            {/* Package Title */}
            <h1
              style={{
                fontSize: 'clamp(1.9rem, 3.8vw, 3rem)',
                color: '#FFFFFF',
                marginBottom: '16px',
                lineHeight: 1.2,
                fontFamily: 'var(--font-heading)'
              }}
            >
              {pkg.name}
            </h1>

            {/* Meta badges: Destination, Duration, Operator */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', fontSize: '0.925rem', color: '#E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={17} color="var(--color-accent)" />
                <span><strong>Covering:</strong> {pkg.destination}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={17} color="var(--color-accent)" />
                <span><strong>Duration:</strong> {pkg.duration_days} Days / {pkg.duration_nights} Nights</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={17} color="#2AD5DC" />
                <span><strong>Tour Operator:</strong> Journey Architect, Bongaon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="container" style={{ padding: '40px 1rem', flex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 380px',
              gap: 'clamp(24px, 3.5vw, 36px)',
              alignItems: 'start'
            }}
            className="pkg-detail-grid"
          >
            {/* =========================================
               LEFT COLUMN: Overview, Pillars, Itinerary, Inclusions
               ========================================= */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Overview Card */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '12px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                  Tour Overview & Experience
                </h2>
                <p style={{ color: 'var(--color-text-main)', fontSize: '0.975rem', lineHeight: '1.7', margin: '0 0 16px 0' }}>
                  {pkg.description || pkg.short_description}
                </p>

                {/* 3 Core Accommodation Pillars */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-border-light)' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-secondary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)', flexShrink: 0 }}>
                      <Hotel size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>Hotel & Stay</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>{pkg.hotel_info || 'Deluxe comfortable accommodations with modern amenities'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-secondary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)', flexShrink: 0 }}>
                      <Car size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>Transportation</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>{pkg.transport_info || 'Dedicated private sightseeing vehicle with hill driver'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-secondary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)', flexShrink: 0 }}>
                      <Utensils size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>Meals Plan</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>{pkg.meals_info || 'Daily breakfast & dinner buffet included'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day-by-Day Detailed Itinerary */}
              {safeItinerary && safeItinerary.length > 0 && (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                    <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', fontWeight: 700, fontFamily: 'var(--font-heading)', margin: 0 }}>
                      Day-by-Day Detailed Itinerary
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
                      {safeItinerary.length} Days Comprehensive Schedule
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {safeItinerary.map((item, idx) => {
                      const isOpen = activeDay === idx;
                      return (
                        <div
                          key={idx}
                          style={{
                            border: `1.5px solid ${isOpen ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                            borderRadius: '12px',
                            overflow: 'hidden',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setActiveDay(isOpen ? -1 : idx)}
                            style={{
                              width: '100%',
                              padding: '16px 20px',
                              backgroundColor: isOpen ? 'var(--color-bg)' : '#FFFFFF',
                              border: 'none',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer',
                              textAlign: 'left',
                              gap: '12px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span
                                style={{
                                  backgroundColor: isOpen ? 'var(--color-secondary)' : 'var(--color-primary)',
                                  color: '#FFFFFF',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  fontWeight: 800,
                                  flexShrink: 0
                                }}
                              >
                                DAY {item.day || idx + 1}
                              </span>
                              <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                                {item.title}
                              </span>
                            </div>
                            <div
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                backgroundColor: isOpen ? 'var(--color-secondary-subtle)' : 'var(--color-bg)',
                                color: isOpen ? 'var(--color-secondary)' : 'var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </button>

                          {isOpen && (
                            <div style={{ padding: '0 20px 18px 20px', color: 'var(--color-text-secondary)', fontSize: '0.925rem', lineHeight: 1.65, borderTop: '1px solid var(--color-border-light)' }}>
                              <p style={{ marginTop: '12px', marginBottom: '8px', whiteSpace: 'pre-line' }}>{item.description || item.activities || 'Sightseeing and excursion activities.'}</p>
                              {(item.meals || item.stay) && (
                                <div style={{ display: 'flex', gap: '16px', fontSize: '0.825rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '8px' }}>
                                  {item.meals && <span>🍽️ Meals: {item.meals}</span>}
                                  {item.stay && <span>🏨 Stay: {item.stay}</span>}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {/* Inclusions */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1.5px solid #BBF7D0', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px' }}>
                    <CheckCircle2 size={20} />
                    <span>What's Included</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                    {safeInclusions.map((inc, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <Check size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1.5px solid #FECACA', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px' }}>
                    <X size={20} />
                    <span>What's Excluded</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                    {safeExclusions.map((exc, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <X size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Guidelines & Cancellation Policy */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={18} color="var(--color-secondary)" />
                  <span>Important Guidelines & Cancellation Terms</span>
                </h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ margin: 0 }}><strong>Travel Notes:</strong> {pkg.important_notes || 'Please carry valid government photo IDs for all travelers.'}</p>
                  <p style={{ margin: 0 }}><strong>Cancellation & Rescheduling:</strong> {pkg.cancellation_policy || 'Free date rescheduling up to 7 days before departure. Advance booking amount is refundable as per standard policy.'}</p>
                </div>
              </div>
            </div>

            {/* =========================================
               RIGHT COLUMN: STICKY BOOKING & CONTACT PANEL
               ========================================= */}
            <div className="pkg-sticky-sidebar" style={{ position: 'sticky', top: '90px' }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '28px',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 12px 35px rgba(18, 48, 74, 0.1)'
                }}
              >
                {/* Price Display */}
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Starting Price Per Person
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0 14px 0' }}>
                  <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                    ₹{Number(pkg.adult_price || pkg.total_price / 2 || 12000).toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>/ adult</span>
                </div>

                {/* Advance Amount Highlight Box */}
                <div
                  style={{
                    backgroundColor: 'rgba(22, 124, 128, 0.08)',
                    border: '1.5px solid rgba(22, 124, 128, 0.25)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 700 }}>
                    ⚡ Pay Advance To Confirm Booking:
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-secondary)', marginTop: '2px' }}>
                    ₹{Number(pkg.booking_amount || 5000).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Remaining amount payable comfortably during your tour
                  </div>
                </div>

                {/* Prominent Book Now Button */}
                <button
                  type="button"
                  disabled={isSoldOut}
                  onClick={() => onNavigate(`/book/${pkg.slug}`)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    backgroundColor: 'var(--color-accent)',
                    color: '#0E2235',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: isSoldOut ? 'not-allowed' : 'pointer',
                    boxShadow: '0 6px 18px rgba(244, 163, 64, 0.35)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span>{isSoldOut ? 'Sold Out' : 'Book This Package Now'}</span>
                  <ArrowRight size={18} />
                </button>

                {/* Direct WhatsApp Action */}
                <a
                  href={getWhatsAppUrl(`Hello Journey Architect, I want to enquire/book the "${pkg.name}" package.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#25D366',
                    backgroundColor: 'rgba(37, 211, 102, 0.08)',
                    border: '1.5px solid rgba(37, 211, 102, 0.3)',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    marginBottom: '20px',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <MessageCircle size={18} />
                  <span>Enquire on WhatsApp</span>
                </a>

                {/* Contact Information & Office Details */}
                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--color-border-light)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '2px', fontSize: '0.85rem' }}>
                    Need Assistance? Contact Our Bongaon Team:
                  </div>

                  <a
                    href={getPhoneCallUrl()}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    <Phone size={15} color="var(--color-secondary)" />
                    <span>{BUSINESS_CONFIG.phone}</span>
                  </a>

                  <a
                    href={`mailto:${BUSINESS_CONFIG.email}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', textDecoration: 'none' }}
                  >
                    <Mail size={15} color="var(--color-secondary)" />
                    <span>{BUSINESS_CONFIG.email}</span>
                  </a>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    <Navigation size={15} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{BUSINESS_CONFIG.address}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--color-border-light)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} color="var(--color-secondary)" />
                    <span>Instant Booking Confirmation PDF Voucher</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color="var(--color-secondary)" />
                    <span>Free Date Rescheduling Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
           6-COLUMN VERTICAL FLUID MASONRY STREAM GALLERY (EXACT REFERENCE STYLE)
           PLACED DIRECTLY ABOVE THE FOOTER
           ==================================================================== */}
        <MasonryStreamGallery
          title={`Glimpse of ${pkg.destination}`}
          subtitle="Explore authentic travel moments, high-altitude passes, and scenic landmarks from this tour."
          destinationName={pkg.destination}
          images={gallerySet}
        />
      </div>

      {/* Scoped CSS for package detail page */}
      <style>{`
        @media (max-width: 991px) {
          .pkg-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .pkg-sticky-sidebar {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
