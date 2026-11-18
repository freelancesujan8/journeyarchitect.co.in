import React, { useState, useEffect } from 'react';
import {
  Home, MapPin, Users, Calendar, CheckCircle2, Sparkles, X,
  Phone, MessageCircle, ArrowRight, ShieldCheck, Coffee, Wifi, Flame,
  Waves, Mountain, Bed
} from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { ApiClient } from '../../api/client';
import { getWhatsAppUrl } from '../../config/businessConfig';

export function HomestaySection({ onOpenTripPlanner, navigate }) {
  const [homestays, setHomestays] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedHomestay, setSelectedHomestay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Fetch Homestays from API
  useEffect(() => {
    let isMounted = true;
    async function loadHomestays() {
      try {
        setLoading(true);
        const res = await ApiClient.getHomestays();
        if (isMounted) {
          if (res && res.success) {
            setIsEnabled(Boolean(res.enabled));
            setHomestays(res.homestays || []);
          } else {
            setIsEnabled(false);
            setHomestays([]);
          }
        }
      } catch (err) {
        console.warn('HomestaySection: Error loading homestays:', err);
        if (isMounted) {
          setIsEnabled(false);
          setHomestays([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadHomestays();
    return () => { isMounted = false; };
  }, []);

  // Set default dates when opening booking modal (tomorrow & day after)
  const handleOpenBooking = (homestay) => {
    setSelectedHomestay(homestay);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 3);

    const fmt = (d) => d.toISOString().split('T')[0];

    setBookingForm({
      guest_name: '',
      phone: '',
      whatsapp_number: '',
      sameAsPhone: true,
      email: '',
      check_in: fmt(tomorrow),
      check_out: fmt(dayAfter),
      guests_count: 2,
      rooms_count: 1,
      special_requests: ''
    });
    setBookingSuccess(null);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHomestay(null);
    setBookingSuccess(null);
  };

  // Live calculation of nights & total price
  const calculateBookingTotals = () => {
    if (!selectedHomestay || !bookingForm.check_in || !bookingForm.check_out) {
      return { nights: 1, total: selectedHomestay?.price_per_night || 0, advance: 0 };
    }
    const inD = new Date(bookingForm.check_in);
    const outD = new Date(bookingForm.check_out);
    let diffDays = Math.round((outD - inD) / (1000 * 60 * 60 * 24));
    if (isNaN(diffDays) || diffDays < 1) diffDays = 1;

    const rooms = parseInt(bookingForm.rooms_count, 10) || 1;
    const pricePerNight = Number(selectedHomestay.price_per_night) || 0;
    const total = pricePerNight * diffDays * rooms;
    const advancePercent = selectedHomestay.booking_advance_percent || 25;
    const advance = Math.round((total * advancePercent) / 100);

    return { nights: diffDays, total, advance };
  };

  const totals = calculateBookingTotals();

  // Handle Form Submission
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!bookingForm.guest_name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!bookingForm.phone.trim() || bookingForm.phone.trim().length < 8) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }
    if (!bookingForm.check_in || !bookingForm.check_out) {
      setErrorMessage('Please choose valid check-in and check-out dates.');
      return;
    }

    try {
      setSubmitting(true);
      const whatsapp = bookingForm.sameAsPhone ? bookingForm.phone : (bookingForm.whatsapp_number || bookingForm.phone);

      const payload = {
        homestay_id: selectedHomestay.id,
        guest_name: bookingForm.guest_name.trim(),
        phone: bookingForm.phone.trim(),
        whatsapp_number: whatsapp.trim(),
        email: bookingForm.email.trim(),
        check_in: bookingForm.check_in,
        check_out: bookingForm.check_out,
        guests_count: parseInt(bookingForm.guests_count, 10) || 2,
        rooms_count: parseInt(bookingForm.rooms_count, 10) || 1,
        special_requests: bookingForm.special_requests.trim()
      };

      const res = await ApiClient.bookHomestay(payload);
      if (res && res.success && res.booking) {
        setBookingSuccess(res.booking);
      } else {
        setErrorMessage(res?.error || 'Failed to submit booking. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error communicating with booking server.');
    } finally {
      setSubmitting(false);
    }
  };

  // If feature is toggled OFF by admin, or no homestays exist and not loading, HIDE SECTION ENTIRELY
  if (!loading && (!isEnabled || homestays.length === 0)) {
    return null;
  }

  // Amenity icon helper
  const getAmenityIcon = (amenity) => {
    const text = amenity.toLowerCase();
    if (text.includes('wifi')) return <Wifi size={13} />;
    if (text.includes('meal') || text.includes('food') || text.includes('breakfast')) return <Coffee size={13} />;
    if (text.includes('view') || text.includes('mountain') || text.includes('kanchenjunga')) return <Mountain size={13} />;
    if (text.includes('bonfire') || text.includes('fire')) return <Flame size={13} />;
    if (text.includes('river')) return <Waves size={13} />;
    return <CheckCircle2 size={13} />;
  };

  return (
    <section className="section-padding bg-warm" id="homestays" style={{ position: 'relative' }}>
      <div className="container">
        {/* Section Heading */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ maxWidth: '680px' }}>
            <SectionHeading
              eyebrow="Authentic Living & Offbeat Stays"
              eyebrowVariant="teal"
              title="Scenic Himalayan & Forest Homestays"
              subtitle="Step away from crowded commercial hotels. Stay with warm local families, taste traditional hearth-cooked feasts, and wake up to serene mountain sunrises."
              align="left"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Button
              variant="outline"
              size="medium"
              onClick={() => onOpenTripPlanner ? onOpenTripPlanner('holiday') : null}
            >
              Need a Custom Homestay Route?
            </Button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px', borderColor: 'var(--color-secondary)', borderTopColor: 'transparent' }} />
            <p style={{ color: 'var(--color-text-muted)' }}>Loading verified partner homestays...</p>
          </div>
        ) : (
          /* Homestay Cards Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem'
            }}
          >
            {homestays.map((h) => {
              const amenities = Array.isArray(h.amenities) ? h.amenities : [];

              return (
                <div
                  key={h.id || h.homestay_id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(18, 48, 74, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  {/* Property Image Cover */}
                  <div
                    onClick={() => navigate ? navigate(`/homestays/${h.slug}`) : window.location.href = `/homestays/${h.slug}`}
                    style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden', cursor: 'pointer' }}
                    title="Click to view details, photos and food menu"
                  >
                    <img
                      src={h.thumbnail || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'}
                      alt={h.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(14, 34, 53, 0.2) 0%, transparent 40%, rgba(14, 34, 53, 0.75) 100%)' }} />

                    {/* Top Badges */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ backgroundColor: 'rgba(14, 34, 53, 0.88)', color: '#FFFFFF', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                        🏡 Verified Homestay
                      </span>
                      {h.featured ? (
                        <span style={{ backgroundColor: 'rgba(244, 163, 64, 0.95)', color: '#12304A', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800 }}>
                          ⭐ Guest Favorite
                        </span>
                      ) : null}
                    </div>

                    {/* Bottom Location & Price Overlay */}
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: '#FFFFFF' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(0, 0, 0, 0.55)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                        <MapPin size={13} color="#F4A340" />
                        <span>{h.location}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
                          ₹{Number(h.price_per_night || 0).toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#E2E8F0', marginTop: '2px' }}>
                          per night / room
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                      <Bed size={14} color="var(--color-secondary)" />
                      <span>{h.room_type || 'Deluxe Room'}</span>
                      <span>•</span>
                      <Users size={14} color="var(--color-secondary)" />
                      <span>Up to {h.max_guests || 4} Guests</span>
                    </div>

                    <h3
                      onClick={() => navigate ? navigate(`/homestays/${h.slug}`) : window.location.href = `/homestays/${h.slug}`}
                      style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 8px 0', lineHeight: 1.3, cursor: 'pointer' }}
                    >
                      {h.name}
                    </h3>

                    <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, margin: '0 0 14px 0', flexGrow: 1 }}>
                      {h.short_description || h.description}
                    </p>

                    {/* Amenities Highlights */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
                      {amenities.slice(0, 4).map((amenity, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#F1F5F9',
                            color: '#334155',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 600
                          }}
                        >
                          {getAmenityIcon(amenity)}
                          {amenity}
                        </span>
                      ))}
                      {amenities.length > 4 && (
                        <span style={{ fontSize: '0.72rem', color: '#64748B', padding: '3px 6px', fontWeight: 600 }}>
                          +{amenities.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        Host: <strong style={{ color: '#1E293B' }}>{h.host_name || 'Journey Partner'}</strong>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => navigate ? navigate(`/homestays/${h.slug}`) : window.location.href = `/homestays/${h.slug}`}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            backgroundColor: '#EFF6FF',
                            color: '#2563EB',
                            border: '1px solid #BFDBFE',
                            cursor: 'pointer'
                          }}
                        >
                          Details
                        </button>
                        <Button
                          variant="secondary"
                          size="small"
                          icon={<ArrowRight size={14} />}
                          onClick={() => handleOpenBooking(h)}
                        >
                          Book Stay
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* HOMESTAY BOOKING MODAL */}
      {/* ============================================================ */}
      {isModalOpen && selectedHomestay && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(14, 34, 53, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            overflowY: 'auto'
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '92vh',
              overflowY: 'auto',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  <Home size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                    {bookingSuccess ? 'Booking Request Confirmed!' : `Book ${selectedHomestay.name}`}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={12} color="#F4A340" />
                    <span>{selectedHomestay.location}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem' }}>
              {/* SUCCESS VIEW */}
              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                    <CheckCircle2 size={36} />
                  </div>

                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 6px 0' }}>
                    Thank You, {bookingSuccess.guest_name}!
                  </h4>
                  <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Your homestay reservation request has been received. Our team will verify room availability with the host and contact you shortly.
                  </p>

                  {/* Summary Card */}
                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px dashed #CBD5E1', paddingBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Booking Reference ID:</span>
                      <strong style={{ fontSize: '0.85rem', color: '#059669' }}>{bookingSuccess.booking_id}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                      <span style={{ color: '#64748B' }}>Property:</span>
                      <strong style={{ color: '#1E293B' }}>{bookingSuccess.homestay_name}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                      <span style={{ color: '#64748B' }}>Stay Dates:</span>
                      <strong style={{ color: '#1E293B' }}>{bookingSuccess.check_in} to {bookingSuccess.check_out} ({bookingSuccess.nights} nights)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                      <span style={{ color: '#64748B' }}>Guests & Rooms:</span>
                      <strong style={{ color: '#1E293B' }}>{bookingSuccess.guests} Guest(s) / {bookingSuccess.rooms} Room(s)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #E2E8F0', fontSize: '0.95rem' }}>
                      <span style={{ fontWeight: 700, color: '#1E293B' }}>Estimated Total:</span>
                      <strong style={{ fontWeight: 800, color: 'var(--color-primary)' }}>₹{Number(bookingSuccess.total_amount).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <a
                      href={getWhatsAppUrl(`Hello Journey Architect! I just requested a homestay booking for *${bookingSuccess.homestay_name}* (Ref: ${bookingSuccess.booking_id}). Please confirm room availability for ${bookingSuccess.check_in} to ${bookingSuccess.check_out}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        backgroundColor: '#25D366',
                        color: '#FFFFFF',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textDecoration: 'none'
                      }}
                    >
                      <MessageCircle size={18} />
                      Chat on WhatsApp for Instant Confirmation
                    </a>

                    <Button variant="outline" size="medium" onClick={handleCloseModal}>
                      Close & Return to Website
                    </Button>
                  </div>
                </div>
              ) : (
                /* FORM VIEW */
                <form onSubmit={handleSubmitBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Property Quick Summary Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <img
                      src={selectedHomestay.thumbnail}
                      alt={selectedHomestay.name}
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                        {selectedHomestay.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>₹{Number(selectedHomestay.price_per_night).toLocaleString('en-IN')} / night</span>
                        <span>•</span>
                        <span>{selectedHomestay.room_type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem' }}>
                      {errorMessage}
                    </div>
                  )}

                  {/* Dates Selection (Check-In & Check-Out) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Check-in Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.check_in}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setBookingForm({ ...bookingForm, check_in: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Check-out Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.check_out}
                        min={bookingForm.check_in || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setBookingForm({ ...bookingForm, check_out: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  {/* Guests & Rooms */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Total Guests *
                      </label>
                      <select
                        value={bookingForm.guests_count}
                        onChange={(e) => setBookingForm({ ...bookingForm, guests_count: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(n => (
                          <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Rooms Count *
                      </label>
                      <select
                        value={bookingForm.rooms_count}
                        onChange={(e) => setBookingForm({ ...bookingForm, rooms_count: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                      >
                        {[1, 2, 3, 4, 5].map(n => (
                          <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Guest Contact Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sudipta Nandi"
                        value={bookingForm.guest_name}
                        onChange={(e) => setBookingForm({ ...bookingForm, guest_name: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Calling Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 79803 31022"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  {/* WhatsApp Checkbox */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={bookingForm.sameAsPhone}
                        onChange={(e) => setBookingForm({ ...bookingForm, sameAsPhone: e.target.checked })}
                      />
                      <span>WhatsApp number is the same as calling phone</span>
                    </label>

                    {!bookingForm.sameAsPhone && (
                      <div style={{ marginTop: '8px' }}>
                        <input
                          type="tel"
                          placeholder="Enter your WhatsApp Number"
                          value={bookingForm.whatsapp_number}
                          onChange={(e) => setBookingForm({ ...bookingForm, whatsapp_number: e.target.value })}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Email & Special Requirements */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. you@example.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Food Preferences / Special Requests
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Pure veg food, late evening check-in, pickup needed from NJP railway station..."
                      value={bookingForm.special_requests}
                      onChange={(e) => setBookingForm({ ...bookingForm, special_requests: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  </div>

                  {/* Live Cost Calculation Bar */}
                  <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '14px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
                        {totals.nights} Night(s) × {bookingForm.rooms_count} Room(s)
                      </span>
                      <strong style={{ fontSize: '1.2rem', color: '#14532D' }}>
                        ₹{totals.total.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#15803D' }}>
                      <span>Advance to block room ({selectedHomestay.booking_advance_percent || 25}%):</span>
                      <strong>₹{totals.advance.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--color-secondary)',
                      color: '#FFFFFF',
                      padding: '12px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(22, 124, 128, 0.25)'
                    }}
                  >
                    {submitting ? (
                      <>
                        <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%' }} />
                        <span>Submitting Booking...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Homestay Booking Request</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
export default HomestaySection;
