import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { TripEnquiryForm } from './TripEnquiryForm';

export function PlanMyTripModal({ isOpen, onClose, initialDestination = '', initialTripType = 'holiday' }) {
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

  // Fallback light-dismiss for browsers without native closedby support
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

    const handleCancel = (e) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('click', handleDialogClick);
    dialog.addEventListener('cancel', handleCancel);

    return () => {
      dialog.removeEventListener('click', handleDialogClick);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="custom-dialog animate-scale-in"
      closedby="any"
      aria-labelledby="plan-trip-modal-title"
    >
      <div className="modal-header">
        <div>
          <h2 id="plan-trip-modal-title" style={{ fontSize: '1.4rem', color: 'var(--color-primary)' }}>
            Plan Your Journey
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Personalized travel planning assistance with Journey Architect
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close trip planning modal"
        >
          <X size={20} />
        </button>
      </div>

      <div className="modal-body">
        <TripEnquiryForm
          initialDestination={initialDestination}
          initialTripType={initialTripType}
          onSuccess={() => {}}
          isModal={true}
        />
      </div>
    </dialog>
  );
}
