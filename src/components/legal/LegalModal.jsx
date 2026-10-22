import React, { useEffect, useRef } from 'react';
import { X, Shield, FileText, AlertCircle } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/businessConfig';

export function LegalModal({ policyId, isOpen, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleDialogClick = (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInside = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInside) {
        onClose();
      }
    };

    dialog.addEventListener('click', handleDialogClick);
    return () => dialog.removeEventListener('click', handleDialogClick);
  }, [onClose]);

  const getContent = () => {
    if (policyId === 'privacy') {
      return {
        title: 'Privacy Policy',
        icon: <Shield size={20} color="var(--color-secondary)" />,
        body: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            <p>
              At <strong>{BUSINESS_CONFIG.name}</strong>, we respect your personal privacy. When you submit a travel enquiry via our website or message us via WhatsApp/Phone, your contact details (name, telephone number, travel requirements) are used solely to respond to your specific enquiry and coordinate your travel arrangements.
            </p>
            <h4 style={{ color: 'var(--color-primary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>Information Collection & Usage</h4>
            <p>
              We collect information that you voluntarily provide to us when requesting itinerary planning, price quotes, and travel bookings. We do not sell, trade, or rent your personal information to third parties.
            </p>
            <h4 style={{ color: 'var(--color-primary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>Data Security</h4>
            <p>
              We implement industry-standard precautions to safeguard your travel details. Communication over WhatsApp and direct telephony is subject to respective platform security and carrier standards.
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.75rem' }}>
              Office Address: {BUSINESS_CONFIG.address}. For questions regarding this privacy policy, please contact our team.
            </p>
          </div>
        )
      };
    }

    if (policyId === 'cancellation') {
      return {
        title: 'Cancellation & Booking Policy',
        icon: <AlertCircle size={20} color="var(--color-accent)" />,
        body: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            <p>
              Journey Architect maintains a transparent booking and cancellation workflow. Because tour packages and customized itineraries involve hotel bookings, transport reservations, and seasonal permits, cancellation terms are itemized clearly before booking confirmation.
            </p>
            <h4 style={{ color: 'var(--color-primary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>Booking Confirmation</h4>
            <p>
              A tour is formally confirmed upon mutually agreed advance payment and written confirmation of the finalized itinerary.
            </p>
            <h4 style={{ color: 'var(--color-primary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>Cancellation Terms</h4>
            <p>
              In case of unforeseen circumstances or cancellation requests, refunds are processed according to the respective hotel, vehicle, and operational cancellation windows active for your travel dates. The exact timeline is shared in your written travel quote.
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.75rem' }}>
              For specific cancellation terms on an active booking, please contact Journey Architect directly with your itinerary reference.
            </p>
          </div>
        )
      };
    }

    return {
      title: 'Terms & Conditions',
      icon: <FileText size={20} color="var(--color-primary)" />,
      body: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          <p>
            Welcome to the website of <strong>{BUSINESS_CONFIG.name}</strong>, a tour operator operating from Bongaon, West Bengal.
          </p>
          <h4 style={{ color: 'var(--color-primary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>Service Representations</h4>
          <p>
            The destination listings, suggested itineraries, and travel ideas on this website are designed for planning and inspiration. Final trip costs, inclusions, and schedules are determined upon direct discussion and written quotation.
          </p>
          <h4 style={{ color: 'var(--color-primary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>Customer Responsibilities</h4>
          <p>
            Travelers are responsible for carrying valid government identity cards (Voter ID, Aadhaar, Passport) and adhering to regional environmental and permit regulations during their journeys.
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.75rem' }}>
            Location: {BUSINESS_CONFIG.address}.
          </p>
        </div>
      )
    };
  };

  const content = getContent();

  return (
    <dialog
      ref={dialogRef}
      className="custom-dialog animate-scale-in"
      closedby="any"
      aria-labelledby="legal-modal-title"
    >
      <div className="modal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {content.icon}
          <h2 id="legal-modal-title" style={{ fontSize: '1.3rem', color: 'var(--color-primary)' }}>
            {content.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
      </div>

      <div className="modal-body">
        {content.body}
      </div>
    </dialog>
  );
}
