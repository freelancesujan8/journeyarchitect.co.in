import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppUrl } from '../../config/businessConfig';

export function AnnouncementBar({ onOpenTripPlanner }) {
  const [dismissed, setDismissed] = useState(false);

  if (!BUSINESS_CONFIG.announcement?.enabled || dismissed) {
    return null;
  }

  return (
    <aside
      className="announcement-bar"
      aria-label="Announcement"
      style={{
        backgroundColor: 'var(--color-primary-dark)',
        color: '#ffffff',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '0.875rem',
        padding: '8px 16px',
        position: 'relative',
        zIndex: 250
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          position: 'relative',
          paddingRight: '32px'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent)',
              display: 'inline-block'
            }}
          />
          {BUSINESS_CONFIG.announcement.text}
        </span>

        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--color-accent)',
            fontWeight: 700,
            textDecoration: 'underline',
            fontSize: '0.8125rem'
          }}
        >
          <MessageCircle size={14} />
          {BUSINESS_CONFIG.announcement.ctaText}
        </a>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255, 255, 255, 0.6)',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>
      </div>
    </aside>
  );
}
