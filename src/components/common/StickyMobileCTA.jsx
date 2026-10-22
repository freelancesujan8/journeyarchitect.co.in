import React from 'react';
import { Phone, MessageCircle, Send } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppUrl, getPhoneCallUrl } from '../../config/businessConfig';

export function StickyMobileCTA({ onOpenTripPlanner }) {
  return (
    <aside className="mobile-sticky-bar" aria-label="Quick Actions">
      {/* Call Button */}
      <a
        href={getPhoneCallUrl()}
        className="btn btn-outline btn-sm"
        style={{ flex: 1, padding: '10px 8px', fontSize: '0.8125rem' }}
        aria-label="Call Journey Architect"
      >
        <Phone size={15} />
        <span>Call</span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-whatsapp btn-sm pulse-whatsapp"
        style={{ flex: 1, padding: '10px 8px', fontSize: '0.8125rem' }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={15} />
        <span>WhatsApp</span>
      </a>

      {/* Plan Trip Button */}
      <button
        type="button"
        onClick={onOpenTripPlanner}
        className="btn btn-amber btn-sm"
        style={{ flex: 1.3, padding: '10px 8px', fontSize: '0.8125rem' }}
        aria-label="Plan My Trip"
      >
        <Send size={14} />
        <span>Plan Trip</span>
      </button>
    </aside>
  );
}
