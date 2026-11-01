import React from 'react';
import { Star, MapPin, HeartHandshake, PhoneCall, ExternalLink } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/businessConfig';
import { GoogleIcon } from '../common/SocialIcons';

export function TrustStrip() {
  const rating = BUSINESS_CONFIG.directoryRating;

  return (
    <section
      className="trust-strip-section"
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)',
        padding: '1.5rem 0',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center'
          }}
        >
          {/* Trust Item 1: Google Real Reviews */}
          <a
            href={BUSINESS_CONFIG.googleReviewUrl || BUSINESS_CONFIG.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: 'inherit'
            }}
            title="Read Real Customer Reviews on Google Maps"
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
            >
              <GoogleIcon size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-primary)' }}>
                  {BUSINESS_CONFIG.googleRating || '5.0'} / 5.0
                </span>
                <div style={{ display: 'flex', color: '#FBBC05' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#FBBC05" />
                  ))}
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Real Google Reviews ({BUSINESS_CONFIG.googleRatingCount || 28}+)
                <ExternalLink size={10} style={{ opacity: 0.7 }} />
              </span>
            </div>
          </a>

          {/* Trust Item 2: Local Travel Assistance */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-secondary-subtle)',
                color: 'var(--color-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <MapPin size={22} />
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)', display: 'block' }}>
                Local Travel Partner
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Based at Elgin 1, Batanagar
              </span>
            </div>
          </div>

          {/* Trust Item 3: Personalized Planning */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <HeartHandshake size={22} />
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)', display: 'block' }}>
                Personalized Itineraries
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Tailored for families & groups
              </span>
            </div>
          </div>

          {/* Trust Item 4: Direct Enquiry Support */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-whatsapp-light)',
                color: 'var(--color-whatsapp-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <PhoneCall size={22} />
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)', display: 'block' }}>
                Direct Enquiry Support
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                WhatsApp & Phone assistance
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
