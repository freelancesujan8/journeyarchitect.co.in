import React from 'react';
import { Star, MapPin, HeartHandshake, PhoneCall } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/businessConfig';

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
          {/* Trust Item 1: Verified Directory Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-accent-light)',
                color: 'var(--color-accent-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Star size={22} fill="currentColor" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-primary)' }}>
                  {rating.score} / {rating.maxScore}
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  ({rating.ratingCount} Ratings)
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                {rating.source}
              </span>
            </div>
          </div>

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
