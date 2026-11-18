import React, { useState, useEffect } from 'react';
import {
  Home, MapPin, Users, Calendar, CheckCircle2, Sparkles, X,
  Phone, MessageCircle, ArrowRight, ShieldCheck, Coffee, Wifi, Flame,
  Waves, Mountain, Bed, UtensilsCrossed, ChevronLeft, ChevronRight,
  Clock, AlertCircle, Eye, Share2, Info, ArrowLeft, Heart
} from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { ApiClient } from '../api/client';
import { getWhatsAppUrl, BUSINESS_CONFIG } from '../config/businessConfig';

export default function HomestayDetailPage({ slug, onNavigate, onOpenTripPlanner }) {
  const [homestay, setHomestay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lightbox State (image click to view enlarged photo)
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Selected Day for Food Menu
  const [selectedMenuDay, setSelectedMenuDay] = useState(0);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    guest_name: '',
    phone: '',
    whatsapp_number: '',
    sameAsPhone: true,
    email: '',
    check_in: '',
    check_out: '',
    guests_count: 2,
    rooms_count: 1,
    special_requests: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch Homestay Details by Slug
  useEffect(() => {
    let isMounted = true;
    async function loadHomestay() {
      try {
        setLoading(true);
        setError(null);
        const res = await ApiClient.getHomestayBySlug(slug);
        if (isMounted) {
          if (res && res.success && res.homestay) {
            setHomestay(res.homestay);

            // Default dates: tomorrow and day after
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dayAfter = new Date();
            dayAfter.setDate(dayAfter.getDate() + 3);
            const fmt = (d) => d.toISOString().split('T')[0];

            setBookingForm((prev) => ({
              ...prev,
              check_in: fmt(tomorrow),
              check_out: fmt(dayAfter)
            }));
          } else {
            setError(res?.error || 'Homestay not found');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load homestay details');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (slug) loadHomestay();
    return () => { isMounted = false; };
  }, [slug]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      const images = getAllImages();
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, homestay]);

  // Combine thumbnail & gallery images
  const getAllImages = () => {
    if (!homestay) return [];
    const list = [];
    if (homestay.thumbnail) list.push(homestay.thumbnail);
    if (Array.isArray(homestay.gallery_images)) {
      homestay.gallery_images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'];
  };

  // Helper for amenity icon
  const getAmenityIcon = (name) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('wifi')) return <Wifi size={16} color="#059669" />;
    if (lower.includes('food') || lower.includes('meal') || lower.includes('thali')) return <Coffee size={16} color="#D97706" />;
    if (lower.includes('bonfire') || lower.includes('fire') || lower.includes('bbq')) return <Flame size={16} color="#EA580C" />;
    if (lower.includes('river') || lower.includes('water')) return <Waves size={16} color="#0284C7" />;
    if (lower.includes('view') || lower.includes('peak') || lower.includes('kanchenjunga')) return <Mountain size={16} color="#7C3AED" />;
    if (lower.includes('room') || lower.includes('heater') || lower.includes('bed')) return <Bed size={16} color="#4B5563" />;
    return <Sparkles size={16} color="#0D9488" />;
  };

  // Calculate nights, total and advance
  const calculateTotals = () => {
    if (!bookingForm.check_in || !bookingForm.check_out || !homestay) {
      return { nights: 1, total: homestay?.price_per_night || 0, advance: Math.round((homestay?.price_per_night || 0) * 0.25) };
    }
    const d1 = new Date(bookingForm.check_in);
    const d2 = new Date(bookingForm.check_out);
    const diffTime = d2.getTime() - d1.getTime();
    let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (nights < 1) nights = 1;

    const rooms = parseInt(bookingForm.rooms_count, 10) || 1;
    const pricePerNight = Number(homestay.price_per_night) || 1500;
    const total = nights * rooms * pricePerNight;
    const advancePercent = homestay.booking_advance_percent || 25;
    const advance = Math.round((total * advancePercent) / 100);

    return { nights, total, advance, pricePerNight, rooms };
  };

  const { nights, total, advance, pricePerNight, rooms } = calculateTotals();

  // Handle Booking Submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.guest_name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!bookingForm.phone.trim() || bookingForm.phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      const payload = {
        homestay_id: homestay.id,
        guest_name: bookingForm.guest_name.trim(),
        phone: bookingForm.phone.trim(),
        whatsapp_number: bookingForm.sameAsPhone ? bookingForm.phone.trim() : (bookingForm.whatsapp_number || bookingForm.phone).trim(),
        email: bookingForm.email.trim(),
        check_in: bookingForm.check_in,
        check_out: bookingForm.check_out,
        guests_count: parseInt(bookingForm.guests_count, 10) || 2,
        rooms_count: parseInt(bookingForm.rooms_count, 10) || 1,
        special_requests: bookingForm.special_requests.trim()
      };

      const res = await ApiClient.bookHomestay(payload);
      if (res && res.success) {
        setBookingSuccess(res.booking);
      } else {
        setErrorMessage(res?.error || 'Failed to submit booking. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please contact us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  // Build WhatsApp confirmation url
  const buildWhatsAppConfirmUrl = (booking) => {
    const text = `🏡 *HOMESTAY BOOKING RESERVATION*
--------------------------------
*Booking ID:* ${booking.booking_id}
*Homestay:* ${booking.homestay_name} (${homestay.location})
*Guest Name:* ${booking.guest_name}
*Phone:* ${booking.phone}
*Check-in:* ${booking.check_in}
*Check-out:* ${booking.check_out} (${booking.nights} night${booking.nights > 1 ? 's' : ''})
*Rooms & Guests:* ${booking.rooms} Room(s), ${booking.guests} Guest(s)
*Total Amount:* ₹${Number(booking.total_amount).toLocaleString('en-IN')}
*Advance Deposit Required:* ₹${Number(booking.advance_amount).toLocaleString('en-IN')}

Hello Journey Architect team, I have submitted a booking request for this homestay. Please confirm room availability and payment details. Thank you!`;
    return getWhatsAppUrl(text);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #E2E8F0', borderTopColor: 'var(--color-secondary, #167C80)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#64748B', fontWeight: 600 }}>Loading verified homestay details...</p>
      </div>
    );
  }

  if (error || !homestay) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '480px', textAlign: 'center', backgroundColor: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
          <AlertCircle size={48} color="#EF4444" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary, #0E2235)', marginBottom: '8px' }}>
            Homestay Not Found
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            The requested homestay property may have been updated or is temporarily unavailable.
          </p>
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('/') : window.location.href = '/'}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--color-primary, #0E2235)',
              color: '#FFFFFF',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ← Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const allImages = getAllImages();
  const foodMenu = Array.isArray(homestay.food_menu) && homestay.food_menu.length > 0 ? homestay.food_menu : null;
  const amenitiesList = Array.isArray(homestay.amenities) ? homestay.amenities : [];

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '4rem' }}>
      <SEOHead
        title={`${homestay.name} - Verified Homestay in ${homestay.location} | Journey Architect`}
        description={homestay.short_description || `Book ${homestay.name} in ${homestay.location}. Authentic home-cooked meals, peaceful mountain view rooms, and verified hosts.`}
        image={homestay.thumbnail}
      />

      {/* Breadcrumb Bar */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0.85rem 1.5rem' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748B' }}>
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/') : window.location.href = '/'}
              style={{ background: 'none', border: 'none', color: 'var(--color-secondary, #167C80)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              Home
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/#homestays') : window.location.href = '/#homestays'}
              style={{ background: 'none', border: 'none', color: 'var(--color-secondary, #167C80)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              Homestays
            </button>
            <span>/</span>
            <span style={{ color: '#1E293B', fontWeight: 600 }}>{homestay.name}</span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('/') : window.location.href = '/'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#475569',
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to All Homestays</span>
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1240px', margin: '1.5rem auto 0', padding: '0 1rem' }}>
        {/* Title Header */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <span style={{ backgroundColor: '#DEF7EC', color: '#03543F', fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} />
                Verified Partner Homestay
              </span>
              <span style={{ backgroundColor: '#E0F2FE', color: '#0369A1', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' }}>
                {homestay.region || 'North Bengal & Sikkim'}
              </span>
              {homestay.featured === 1 && (
                <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px' }}>
                  ★ Recommended Stay
                </span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: 'var(--color-primary, #0E2235)', margin: '0 0 8px 0', lineHeight: 1.2 }}>
              {homestay.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.95rem' }}>
              <MapPin size={18} color="var(--color-secondary, #167C80)" style={{ flexShrink: 0 }} />
              <span>{homestay.location}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Starting from</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#059669', lineHeight: 1 }}>
              ₹{Number(homestay.price_per_night || 0).toLocaleString('en-IN')}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}> / night</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700, marginTop: '4px' }}>
              Only {homestay.booking_advance_percent || 25}% advance to reserve
            </div>
          </div>
        </div>

        {/* PHOTO GALLERY GRID WITH INTERACTIVE LIGHTBOX */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary, #0E2235)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📸 Property Photos & Surroundings</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                ({allImages.length} Photos • Click any image to enlarge)
              </span>
            </h2>
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--color-secondary, #167C80)',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              <Eye size={14} />
              <span>View Fullscreen Gallery</span>
            </button>
          </div>

          {/* Mosaic Image Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: allImages.length > 2 ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
              gap: '12px',
              borderRadius: '16px',
              overflow: 'hidden'
            }}
          >
            {allImages.slice(0, 6).map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                style={{
                  position: 'relative',
                  height: idx === 0 && allImages.length > 2 ? '320px' : '220px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <img
                  src={imgUrl}
                  alt={`${homestay.name} photo ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  loading="lazy"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.15)',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
                >
                  <Eye size={18} />
                  <span>Click to Enlarge</span>
                </div>

                {idx === 5 && allImages.length > 6 && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(14, 34, 53, 0.75)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '1.25rem',
                      fontWeight: 800
                    }}
                  >
                    +{allImages.length - 6} More Photos
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MAIN 2-COLUMN LAYOUT: Content on left, Booking widget on right */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* LEFT COLUMN: Details, Food Menu, Amenities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Quick Highlights Strip */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '1.25rem 1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                  <Bed size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Room Type</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)' }}>{homestay.room_type || 'Deluxe Cottage'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  <Users size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Capacity</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)' }}>Up to {homestay.max_guests || 4} Guests</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                  <Coffee size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Meal Plan</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)' }}>Organic Home Cooked</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}>
                  <Home size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Local Host</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)' }}>{homestay.host_name || 'Verified Host'}</div>
                </div>
              </div>
            </div>

            {/* About / Description */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary, #0E2235)', margin: '0 0 1rem 0' }}>
                About this Homestay Experience
              </h2>
              {homestay.short_description && (
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-secondary, #167C80)', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                  "{homestay.short_description}"
                </p>
              )}
              <div style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {homestay.description || 'Welcome to this authentic homestay nestled amidst scenic nature. Experience peaceful mornings, pristine mountain air, warm local smiles, and genuine hospitality.'}
              </div>
            </div>

            {/* DAY-TO-DAY FOOD MENU (As requested by user) */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary, #0E2235)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UtensilsCrossed size={22} color="var(--color-secondary, #167C80)" />
                    Day-to-Day Home-Cooked Food Menu
                  </h2>
                  <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                    Freshly prepared with local mountain vegetables, organic ingredients, and pure mountain spring water.
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#DEF7EC', color: '#03543F', padding: '4px 10px', borderRadius: '999px' }}>
                  🌱 Veg & 🍗 Non-Veg Options
                </span>
              </div>

              {foodMenu && foodMenu.length > 0 ? (
                <div>
                  {/* Day Tabs */}
                  {foodMenu.length > 1 && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '4px' }}>
                      {foodMenu.map((dayItem, dIdx) => (
                        <button
                          key={dIdx}
                          type="button"
                          onClick={() => setSelectedMenuDay(dIdx)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            border: selectedMenuDay === dIdx ? '2px solid var(--color-secondary, #167C80)' : '1px solid #D1D5DB',
                            backgroundColor: selectedMenuDay === dIdx ? '#ECFDF5' : '#FFFFFF',
                            color: selectedMenuDay === dIdx ? 'var(--color-secondary, #167C80)' : '#4B5563',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <span>{dayItem.day || `Day ${dIdx + 1}`}</span>
                          {dayItem.title && <span style={{ fontSize: '0.72rem', color: '#64748B' }}>• {dayItem.title}</span>}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Active Day Food Details Card */}
                  {(() => {
                    const activeDay = foodMenu[selectedMenuDay] || foodMenu[0];
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
                        {activeDay.title && (
                          <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1rem', paddingBottom: '8px', borderBottom: '1px solid #E2E8F0' }}>
                            {activeDay.day ? `${activeDay.day}: ` : ''}{activeDay.title}
                          </div>
                        )}

                        {/* Morning Bed Tea */}
                        {activeDay.morning_tea && (
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', flexShrink: 0 }}>
                              <Coffee size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>
                                Morning Bed Tea (6:30 AM - 7:30 AM)
                              </div>
                              <div style={{ fontSize: '0.9rem', color: '#1E293B', marginTop: '2px' }}>
                                {activeDay.morning_tea}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Breakfast */}
                        {activeDay.breakfast && (
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0 }}>
                              <Sparkles size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase' }}>
                                Healthy Breakfast (8:30 AM - 9:30 AM)
                              </div>
                              <div style={{ fontSize: '0.9rem', color: '#1E293B', marginTop: '2px' }}>
                                {activeDay.breakfast}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Lunch */}
                        {activeDay.lunch && (
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
                              <UtensilsCrossed size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase' }}>
                                Traditional Pahari Lunch (1:00 PM - 2:00 PM)
                              </div>
                              <div style={{ fontSize: '0.9rem', color: '#1E293B', marginTop: '2px' }}>
                                {activeDay.lunch}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Evening Snacks */}
                        {activeDay.evening_snacks && (
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C', flexShrink: 0 }}>
                              <Coffee size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#9A3412', textTransform: 'uppercase' }}>
                                Evening Snacks & Hot Tea (5:30 PM - 6:30 PM)
                              </div>
                              <div style={{ fontSize: '0.9rem', color: '#1E293B', marginTop: '2px' }}>
                                {activeDay.evening_snacks}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Dinner */}
                        {activeDay.dinner && (
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED', flexShrink: 0 }}>
                              <UtensilsCrossed size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#5B21B6', textTransform: 'uppercase' }}>
                                Homestyle Hearth Dinner (8:30 PM - 9:30 PM)
                              </div>
                              <div style={{ fontSize: '0.9rem', color: '#1E293B', marginTop: '2px' }}>
                                {activeDay.dinner}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div style={{ padding: '1.25rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  🍽️ <strong>Fresh Local Meals Included:</strong> Wholesome home-cooked breakfast, authentic Nepali & Bengali lunch/dinner, evening snacks with hot Darjeeling tea. Specially prepared by your local host family with organic farm-fresh ingredients.
                </div>
              )}
            </div>

            {/* Amenities Grid */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary, #0E2235)', margin: '0 0 1rem 0' }}>
                Included Amenities & Facilities
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {amenitiesList.map((amenity, aIdx) => (
                  <div
                    key={aIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#1E293B'
                    }}
                  >
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules & Host Contacts */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary, #0E2235)', margin: '0 0 1rem 0' }}>
                House Rules & Host Information
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {homestay.house_rules || '• Check-in: 12:00 PM | Check-out: 11:00 AM\n• Fresh home-cooked meals served at scheduled timings\n• Bonfire & BBQ available on prior request with host\n• Please carry valid Government Photo ID for all adult travelers'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Primary Host / Caretaker:</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {homestay.host_name || 'Journey Architect Host'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={`tel:${(homestay.host_phone || '7980331022').replace(/\s+/g, '')}`}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        border: '1px solid #BFDBFE',
                        textDecoration: 'none',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Phone size={14} />
                      <span>{homestay.host_phone || 'Call Host'}</span>
                    </a>
                    <a
                      href={getWhatsAppUrl(`Hello ${homestay.host_name || 'Host'}, I have an enquiry regarding staying at ${homestay.name}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        backgroundColor: '#25D366',
                        color: '#FFFFFF',
                        border: 'none',
                        textDecoration: 'none',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <MessageCircle size={14} />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY INSTANT BOOKING WIDGET */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '1.75rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
              }}
            >
              <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Reserve This Homestay
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontSize: '1.85rem', fontWeight: 900, color: '#059669' }}>
                    ₹{Number(homestay.price_per_night || 0).toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>/ room night</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                  ✓ Instant Booking Request • Pay only {homestay.booking_advance_percent || 25}% advance to block
                </div>
              </div>

              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#DEF7EC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#059669' }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 6px 0' }}>
                    Booking Request Submitted!
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 1rem 0' }}>
                    Your booking reference is <strong style={{ color: 'var(--color-primary)' }}>{bookingSuccess.booking_id}</strong>.
                  </p>

                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '1rem', border: '1px solid #E2E8F0', textAlign: 'left', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div><strong>Stay:</strong> {bookingSuccess.homestay_name}</div>
                    <div><strong>Dates:</strong> {bookingSuccess.check_in} to {bookingSuccess.check_out} ({bookingSuccess.nights} night(s))</div>
                    <div><strong>Total Amount:</strong> ₹{Number(bookingSuccess.total_amount).toLocaleString('en-IN')}</div>
                    <div><strong>Advance Required:</strong> <span style={{ color: '#D97706', fontWeight: 700 }}>₹{Number(bookingSuccess.advance_amount).toLocaleString('en-IN')}</span></div>
                  </div>

                  <a
                    href={buildWhatsAppConfirmUrl(bookingSuccess)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#25D366',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                    }}
                  >
                    <MessageCircle size={20} />
                    <span>Confirm on WhatsApp Now</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setBookingSuccess(null)}
                    style={{ marginTop: '10px', background: 'none', border: 'none', color: '#64748B', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Book another date
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {errorMessage && (
                    <div style={{ padding: '10px 12px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={16} flexShrink={0} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Dates: Check-in & Check-out */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                        Check-in *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.check_in}
                        onChange={(e) => setBookingForm({ ...bookingForm, check_in: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                        Check-out *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.check_out}
                        onChange={(e) => setBookingForm({ ...bookingForm, check_out: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>

                  {/* Rooms and Guests */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                        Rooms Count
                      </label>
                      <select
                        value={bookingForm.rooms_count}
                        onChange={(e) => setBookingForm({ ...bookingForm, rooms_count: parseInt(e.target.value, 10) })}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.82rem' }}
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                        Total Guests
                      </label>
                      <select
                        value={bookingForm.guests_count}
                        onChange={(e) => setBookingForm({ ...bookingForm, guests_count: parseInt(e.target.value, 10) })}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.82rem' }}
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                          <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Guest Name & Phone */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                      Lead Guest Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sudipta Nandi"
                      value={bookingForm.guest_name}
                      onChange={(e) => setBookingForm({ ...bookingForm, guest_name: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                      Contact Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98765 43210"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#4B5563', cursor: 'pointer', marginBottom: '6px' }}>
                      <input
                        type="checkbox"
                        checked={bookingForm.sameAsPhone}
                        onChange={(e) => setBookingForm({ ...bookingForm, sameAsPhone: e.target.checked })}
                      />
                      <span>WhatsApp number is the same as contact phone</span>
                    </label>
                    {!bookingForm.sameAsPhone && (
                      <input
                        type="tel"
                        placeholder="WhatsApp Number"
                        value={bookingForm.whatsapp_number}
                        onChange={(e) => setBookingForm({ ...bookingForm, whatsapp_number: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                      />
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                      Special Requests / Food Preferences
                    </label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Sunrise view attic room preferred, 2 vegetarian and 2 non-veg meals"
                      value={bookingForm.special_requests}
                      onChange={(e) => setBookingForm({ ...bookingForm, special_requests: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.82rem', resize: 'vertical' }}
                    />
                  </div>

                  {/* Live Financial Breakdown */}
                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '12px 14px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#475569' }}>
                      <span>₹{pricePerNight.toLocaleString('en-IN')} × {nights} night(s) × {rooms} room(s)</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-primary)', paddingTop: '6px', borderTop: '1px dashed #CBD5E1' }}>
                      <span>Total Stay Price:</span>
                      <span style={{ color: '#059669' }}>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#D97706', fontWeight: 700, marginTop: '4px' }}>
                      <span>Advance to block (25%):</span>
                      <span>₹{advance.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'var(--color-secondary, #167C80)',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(22, 124, 128, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {submitting ? 'Submitting Request...' : (
                      <>
                        <span>Submit Booking Request</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#64748B' }}>
                    🔒 No upfront payment required to submit inquiry • Pay advance only after room confirmation.
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* INTERACTIVE FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {/* (image e click kkorle image boro hoye show korbe) */}
      {/* ============================================================ */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 15, 25, 0.95)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            userSelect: 'none'
          }}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100000,
              transition: 'background-color 0.2s ease'
            }}
            title="Close Lightbox (Esc)"
          >
            <X size={24} />
          </button>

          {/* Left Arrow Button */}
          {allImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
              }}
              style={{
                position: 'absolute',
                left: '20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100000
              }}
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Right Arrow Button */}
          {allImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev + 1) % allImages.length);
              }}
              style={{
                position: 'absolute',
                right: '20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100000
              }}
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Main Enlarged Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '92vw',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <img
              src={allImages[lightboxIndex]}
              alt={`${homestay.name} enlarged view ${lightboxIndex + 1}`}
              style={{
                maxWidth: '92vw',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                border: '2px solid rgba(255,255,255,0.2)'
              }}
            />

            {/* Bottom Caption / Counter */}
            <div
              style={{
                marginTop: '12px',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: 600,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                padding: '6px 16px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span>{homestay.name}</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>•</span>
              <span style={{ color: '#FCD34D' }}>Photo {lightboxIndex + 1} of {allImages.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
