import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export function LightboxModal({ images, activeIndex, isOpen, onClose, onNavigate }) {
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      onNavigate((activeIndex - 1 + images.length) % images.length);
    } else if (e.key === 'ArrowRight') {
      onNavigate((activeIndex + 1) % images.length);
    }
  }, [isOpen, activeIndex, images.length, onClose, onNavigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen || !images[activeIndex]) return null;

  const currentImage = images[activeIndex];

  return (
    <div
      className="lightbox-backdrop animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image Preview"
    >
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="lightbox-close-btn"
          onClick={onClose}
          aria-label="Close Lightbox"
        >
          <X size={24} />
        </button>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            className="lightbox-nav-btn lightbox-nav-prev"
            onClick={() => onNavigate((activeIndex - 1 + images.length) % images.length)}
            aria-label="Previous Image"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Image Display */}
        <div className="lightbox-img-wrapper">
          <img
            src={currentImage.image}
            alt={currentImage.alt || currentImage.title}
            className="lightbox-img animate-scale-in"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            className="lightbox-nav-btn lightbox-nav-next"
            onClick={() => onNavigate((activeIndex + 1) % images.length)}
            aria-label="Next Image"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Caption & Counter */}
        <div className="lightbox-caption-bar">
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '4px' }}>
            {currentImage.title}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
            {currentImage.caption}
          </p>
          <div style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--color-accent)' }}>
            {activeIndex + 1} of {images.length}
          </div>
        </div>
      </div>
    </div>
  );
}
