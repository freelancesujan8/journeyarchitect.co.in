import React from 'react';
import { Send, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { BUSINESS_CONFIG, getWhatsAppUrl, getPhoneCallUrl } from '../../config/businessConfig';

export function FinalCTA({ onOpenTripPlanner }) {
  return (
    <section
      className="final-cta-section"
      style={{
        position: 'relative',
        color: '#ffffff',
        padding: 'clamp(2.75rem, 5vw, 4.25rem) 0',
        overflow: 'hidden'
      }}
    >
      {/* Visual Background with Dark Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80"
          alt="High mountain peaks and golden clouds at sunset"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(11, 35, 55, 0.92) 0%, rgba(18, 48, 74, 0.88) 100%)'
          }}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '820px' }}>
        <span
          className="eyebrow eyebrow-amber"
          style={{ marginBottom: '1.25rem' }}
        >
          <Sparkles size={14} />
          Start Your Journey
        </span>

        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
            color: '#ffffff',
            marginBottom: '1.25rem',
            lineHeight: 1.15
          }}
        >
          Have a Trip in Mind? Let's Start Planning.
        </h2>

        <p
          style={{
            fontSize: 'clamp(1.05rem, 1.3vw, 1.25rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '2.5rem',
            lineHeight: 1.6,
            maxWidth: '640px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          Tell us where you want to go, when you want to travel, and how many people are joining. We'll help you take the next step with personalized options.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <Button
            variant="amber"
            size="lg"
            onClick={onOpenTripPlanner}
            icon={<Send size={18} />}
          >
            Plan My Trip
          </Button>

          <Button
            variant="whatsapp"
            size="lg"
            href={getWhatsAppUrl()}
            target="_blank"
            icon={<MessageCircle size={18} />}
          >
            WhatsApp Us
          </Button>

          <Button
            variant="outline-white"
            size="lg"
            href={getPhoneCallUrl()}
            icon={<Phone size={18} />}
          >
            Call Journey Architect
          </Button>
        </div>

        {/* Sub-note */}
        <p style={{ marginTop: '2rem', fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.65)' }}>
          Tower 02, Elgin 1, New Batanagar Road, Maheshtala, Batanagar, West Bengal - 700140 • Direct Travel Assistance
        </p>
      </div>
    </section>
  );
}
