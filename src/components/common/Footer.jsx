import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, ExternalLink, ShieldCheck, Star, Sparkles, Navigation, ArrowRight, HeartHandshake } from 'lucide-react';
import { Logo } from './Logo';
import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon, GoogleIcon } from './SocialIcons';
import { LEGAL_LINKS } from '../../config/navigation';
import { BUSINESS_CONFIG, getWhatsAppUrl, getPhoneCallUrl } from '../../config/businessConfig';

export function Footer({ navigate, onOpenLegalModal, onOpenTripPlanner }) {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e, path) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exploreLinks = [
    { label: "Home", path: "/" },
    { label: "About Journey Architect", path: "/about" },
    { label: "Tour Packages", path: "/tours" },
    { label: "Customized Tours", path: "/customized-tours" },
    { label: "Find My Booking", path: "/booking/lookup" },
    { label: "Travel Gallery", path: "/gallery" },
    { label: "Traveler Reviews", path: "/reviews" },
    { label: "Planning FAQ", path: "/faq" },
    { label: "Contact & Location", path: "/contact" }
  ];

  const popularTours = [
    { label: "Darjeeling & Kalimpong (5D/4N)", path: "/tours/darjeeling-kalimpong-himalayan-retreat" },
    { label: "Sikkim Highland Explorer (6D/5N)", path: "/tours/sikkim-highland-explorer-gangtok-north-sikkim" },
    { label: "Dooars & Lataguri Safari (4D/3N)", path: "/tours/dooars-wilderness-tea-trail-safari" },
    { label: "Puri & Konark Coastal (4D/3N)", path: "/tours/puri-coastal-serenity-konark-sun-temple" },
    { label: "Sundarbans Mangrove Tour", path: "/tours" },
    { label: "Kashmir Paradise Valley", path: "/tours" }
  ];

  return (
    <footer
      className="site-footer"
      style={{
        background: 'linear-gradient(180deg, #12304A 0%, #0A1E30 100%)',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '3px solid var(--color-accent, #F4A340)',
        boxShadow: '0 -4px 24px rgba(18, 48, 74, 0.15)',
        marginTop: 'auto'
      }}
    >
      {/* Top Pre-Footer Trust Highlights Strip */}
      <div
        className="footer-trust-strip"
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          padding: '24px 0'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              alignItems: 'center'
            }}
          >
            {/* Trust item 1: Google Real Reviews */}
            <a
              href={BUSINESS_CONFIG.googleReviewUrl || BUSINESS_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer'
              }}
              title="Read Real Customer Reviews on Google Maps"
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
                }}
              >
                <GoogleIcon size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ fontSize: '0.925rem', color: '#FFFFFF', display: 'block' }}>
                    {BUSINESS_CONFIG.googleRating || '5.0'}/5.0 Google Reviews
                  </strong>
                  <div style={{ display: 'flex', color: '#FBBC05' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill="#FBBC05" />
                    ))}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: 'rgba(255, 255, 255, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Real Reviews on Google Maps
                  <ExternalLink size={11} style={{ opacity: 0.8 }} />
                </span>
              </div>
            </a>

            {/* Trust item 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(22, 124, 128, 0.2)',
                  color: '#2AD5DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.925rem', color: '#FFFFFF', display: 'block' }}>
                  100% Transparent Planning
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                  Clear stays, vehicles & permits upfront
                </span>
              </div>
            </div>

            {/* Trust item 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(37, 211, 102, 0.15)',
                  color: '#25D366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <MessageCircle size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.925rem', color: '#FFFFFF', display: 'block' }}>
                  Direct WhatsApp Assistance
                </strong>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.78rem', color: '#25D366', textDecoration: 'none', fontWeight: 600 }}
                >
                  Chat with Journey Architect: {BUSINESS_CONFIG.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container" style={{ padding: '48px 1.5rem 36px 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'clamp(2rem, 3.5vw, 3rem)',
            marginBottom: '3rem'
          }}
        >
          {/* Column 1: Brand Profile & Recognition */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'flex-start' }}>
            <Logo light={true} size="footer" />

            <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 0.5rem 0' }}>
              Your dedicated tour operator based at Elgin 1, New Batanagar Road, Maheshtala, Batanagar. We craft personalized holiday packages, reliable itineraries, and comfortable travel experiences with genuine care.
            </p>

            {/* Social Media Links with Icons */}
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
                Follow Our Journeys
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <a
                  href={BUSINESS_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Journey Architect on Facebook"
                  title="Facebook - Journey Architect"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1877F2';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <FacebookIcon size={18} />
                </a>

                <a
                  href={BUSINESS_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Journey Architect on Instagram"
                  title="Instagram - @journeyarchitect2026"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E4405F';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <InstagramIcon size={18} />
                </a>

                <a
                  href={BUSINESS_CONFIG.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Journey Architect on X"
                  title="X (Twitter) - @nan59130"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <XIcon size={16} />
                </a>

                <a
                  href={BUSINESS_CONFIG.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Journey Architect on YouTube"
                  title="YouTube - @SUDIPTANANDI-t9b"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF0000';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <YoutubeIcon size={19} />
                </a>

                <a
                  href={BUSINESS_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Journey Architect Office on Google Maps"
                  title="Google Maps Location"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(244, 163, 64, 0.3)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(244, 163, 64, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Navigation size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--color-accent)',
                marginBottom: '1rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '8px'
              }}
            >
              Explore Journey Architect
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', listStyle: 'none', padding: 0, margin: 0 }}>
              {exploreLinks.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.path}
                    onClick={(e) => handleNavClick(e, item.path)}
                    style={{
                      color: 'rgba(255, 255, 255, 0.72)',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      transition: 'color var(--transition-fast), transform var(--transition-fast)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Core Services */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--color-accent)',
                marginBottom: '1rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '8px'
              }}
            >
              Services & Tours
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', listStyle: 'none', padding: 0, margin: 0 }}>
              <li>
                <a
                  href="/services/tour-and-travel"
                  onClick={(e) => handleNavClick(e, '/services/tour-and-travel')}
                  style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.875rem', textDecoration: 'none' }}
                >
                  🏔️ Tour and travel
                </a>
              </li>
              <li>
                <a
                  href="/services/catering"
                  onClick={(e) => handleNavClick(e, '/services/catering')}
                  style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.875rem', textDecoration: 'none' }}
                >
                  🍲 Catering Services
                </a>
              </li>
              <li>
                <a
                  href="/services/car-rental"
                  onClick={(e) => handleNavClick(e, '/services/car-rental')}
                  style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.875rem', textDecoration: 'none' }}
                >
                  🚗 Car Rental
                </a>
              </li>
              {popularTours.slice(0, 3).map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.path}
                    onClick={(e) => handleNavClick(e, item.path)}
                    style={{
                      color: 'rgba(255, 255, 255, 0.65)',
                      fontSize: '0.825rem',
                      textDecoration: 'none'
                    }}
                  >
                    • {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Official Team & Direct Contact */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--color-accent)',
                marginBottom: '1rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '8px'
              }}
            >
              Direct Contacts & Team
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', color: 'rgba(255, 255, 255, 0.85)' }}>
              {/* Founder */}
              <div style={{ fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: 700, display: 'block' }}>Founder (Sudipta Nandi):</span>
                <a href="tel:+917980331022" style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600 }}>79803 31022</a> / <a href="tel:+919830354307" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>98303 54307</a>
              </div>

              {/* Co-Founder */}
              <div style={{ fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: 700, display: 'block' }}>Co-Founder (Dipankar Mitra):</span>
                <a href="tel:+919563395633" style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600 }}>95633 95633</a>
              </div>

              {/* WhatsApp & Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <MessageCircle size={14} color="#25D366" />
                <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#25D366', textDecoration: 'none', fontWeight: 600 }}>
                  WhatsApp: 79803 31022
                </a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={14} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 700, display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Head Office:</span>
                    <span>Elgin 1, Batanagar, Kolkata - 700140</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={14} color="#2AD5DC" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ color: '#2AD5DC', fontWeight: 700, display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Branch Office:</span>
                    <span>P-23, Michael nagar , Kolkata - 700 133</span>
                  </div>
                </div>
              </div>

              {/* Trade License & MSME */}
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px' }}>
                <div>Trade Lic: <strong>{BUSINESS_CONFIG.tradeLicenseNo}</strong></div>
                <div>MSME: <strong>{BUSINESS_CONFIG.udyamRegistrationNo}</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Copyright & Legal Bar */}
        <div
          style={{
            paddingTop: '1.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}
        >
          <div>
            © {currentYear} {BUSINESS_CONFIG.name}. Trade Lic: {BUSINESS_CONFIG.tradeLicenseNo} | UDYAM: {BUSINESS_CONFIG.udyamRegistrationNo}
          </div>

          {/* Legal Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            {LEGAL_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => onOpenLegalModal(link.id)}
                style={{
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontSize: '0.8125rem',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)')}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

