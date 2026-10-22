import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppUrl } from '../../config/businessConfig';

export function WhatsAppFloating() {
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  return (
    <div
      className="whatsapp-floating-container"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 'var(--z-sticky)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px'
      }}
    >
      {/* Friendly Tooltip */}
      {!tooltipDismissed && (
        <div
          className="animate-slide-up"
          style={{
            backgroundColor: '#FFFFFF',
            color: 'var(--color-primary)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border)',
            fontSize: '0.8125rem',
            maxWidth: '220px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            position: 'relative'
          }}
        >
          <span>Planning a trip? Chat with Journey Architect on WhatsApp!</span>
          <button
            type="button"
            onClick={() => setTooltipDismissed(true)}
            style={{ color: 'var(--color-text-muted)', padding: '2px' }}
            aria-label="Dismiss WhatsApp hint"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn pulse-whatsapp"
        aria-label="Chat with Journey Architect on WhatsApp"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-whatsapp)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
          transition: 'transform var(--transition-fast)'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <MessageCircle size={30} />
      </a>

      {/* Hide floating button on mobile to avoid overlapping with sticky bottom bar */}
      <style>{`
        @media (max-width: 768px) {
          .whatsapp-floating-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
