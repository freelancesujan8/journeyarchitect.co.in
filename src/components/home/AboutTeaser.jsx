import React from 'react';
import { ArrowRight, MapPin, Star, ShieldCheck, HeartHandshake, Compass, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { BUSINESS_CONFIG, getWhatsAppUrl } from '../../config/businessConfig';

export function AboutTeaser({ navigate, onOpenTripPlanner }) {
  const highlights = [
    {
      icon: MapPin,
      title: "Direct Consultation",
      desc: "Speak with real coordinators based at Elgin 1, New Batanagar Road."
    },
    {
      icon: Compass,
      title: "Customized Itineraries",
      desc: "Flexible pacing, hotel choices, and sights shaped around your group."
    },
    {
      icon: ShieldCheck,
      title: "Transparent & Clear",
      desc: "No hidden charges — understand stays, vehicles, and inclusions upfront."
    },
    {
      icon: HeartHandshake,
      title: "Dedicated Assistance",
      desc: "Direct guidance before departure and throughout your holiday."
    }
  ];

  return (
    <section className="section-padding bg-white" id="about-teaser" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Subtle decorative background glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '-5%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(22, 124, 128, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 'clamp(2.5rem, 5vw, 4.5rem)',
            alignItems: 'center'
          }}
        >
          {/* Visual Layered Image Collage */}
          <div className="about-visual-wrapper" style={{ position: 'relative', paddingBottom: '1.5rem', paddingRight: '1rem' }}>
            {/* Main Scenic Landscape Card */}
            <div
              className="about-main-img-card"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px -15px rgba(18, 48, 74, 0.18)',
                border: '1px solid var(--color-border)',
                aspectRatio: '16 / 11',
                position: 'relative',
                backgroundColor: 'var(--color-bg-alt)'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85"
                alt="Scenic Himalayan hills and alpine valleys in Darjeeling"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 65%, rgba(11, 35, 55, 0.4) 100%)'
                }}
              />
            </div>

            {/* Secondary Inset Photo */}
            <div
              className="about-secondary-img-card"
              style={{
                position: 'absolute',
                top: '-16px',
                right: '-10px',
                width: 'clamp(140px, 32%, 190px)',
                aspectRatio: '1 / 1',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 14px 30px rgba(11, 35, 55, 0.22)',
                border: '3.5px solid #FFFFFF',
                zIndex: 2,
                backgroundColor: '#FFFFFF'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=600&q=80"
                alt="High-altitude alpine lake in Sikkim"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Floating Top Trust Badge */}
            <div
              className="about-trust-badge animate-float"
              style={{
                position: 'absolute',
                top: '24px',
                left: '-12px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '10px 16px',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 10px 25px rgba(18, 48, 74, 0.12)',
                border: '1px solid rgba(22, 124, 128, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 3
              }}
            >
              <div style={{ display: 'flex', color: 'var(--color-accent)' }}>
                <Star size={16} fill="currentColor" />
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {BUSINESS_CONFIG.directoryRating.score} / 5.0
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', borderLeft: '1px solid var(--color-border)', paddingLeft: '8px' }}>
                Verified Operator
              </span>
            </div>

            {/* Floating Bottom Location & Contact Card */}
            <div
              className="about-location-badge"
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: '20px',
                right: '20px',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                boxShadow: '0 16px 36px rgba(11, 35, 55, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(244, 163, 64, 0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--color-accent)'
                  }}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.9375rem', color: '#ffffff', display: 'block', marginBottom: '2px' }}>
                    Batanagar, West Bengal
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.82)', display: 'block' }}>
                    Elgin 1, New Batanagar Road • Personal Travel Guidance
                  </span>
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: 'var(--color-accent)',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-full)',
                  whiteSpace: 'nowrap'
                }}
              >
                Local Office
              </span>
            </div>
          </div>

          {/* Text & Features Content */}
          <div className="about-text-content">
            {/* Header Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              <span className="eyebrow eyebrow-teal" style={{ margin: 0 }}>
                About Journey Architect
              </span>
            </div>

            <h2
              className="section-title"
              style={{
                color: 'var(--color-primary)',
                marginBottom: '1rem',
                lineHeight: 1.18
              }}
            >
              A Local Travel Partner for Your Next Escape
            </h2>

            <p
              style={{
                fontSize: '1.025rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.65,
                marginBottom: '1.5rem'
              }}
            >
              Every great journey begins long before you pack your bags. Based at Tower 02, Elgin 1, New Batanagar Road, Maheshtala, <strong>{BUSINESS_CONFIG.name}</strong> was created to make domestic holiday planning personal, organized, and genuinely transparent. We take care of itineraries, hotel choices, and vehicle arrangements so you can travel without logistical stress.
            </p>

            {/* 4 Highlights Feature Matrix */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
                marginBottom: '2rem'
              }}
            >
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '12px 14px',
                      backgroundColor: 'var(--color-bg)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-light)',
                      transition: 'border-color var(--transition-fast), transform var(--transition-fast)'
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--color-secondary-subtle)',
                        color: 'var(--color-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 2px 0' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.45 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons & WhatsApp Quick Callout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                onClick={() => {
                  navigate('/about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                icon={<ArrowRight size={16} />}
              >
                Know More About Journey Architect
              </Button>

              <Button
                variant="outline"
                onClick={() => onOpenTripPlanner()}
              >
                Discuss Your Trip
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Component Styles */}
      <style>{`
        .about-main-img-card:hover img {
          transform: scale(1.04);
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: floatSlow 4s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .about-location-badge {
            position: relative !important;
            bottom: auto !important;
            left: auto !important;
            right: auto !important;
            margin-top: 1rem;
          }
          .about-secondary-img-card {
            width: 120px !important;
            top: -10px !important;
            right: -6px !important;
          }
        }
      `}</style>
    </section>
  );
}
