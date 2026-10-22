import React, { useState, useEffect } from 'react';
import { Maximize2, Send, Play, Film, Camera, X, Volume2, Sparkles } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { LightboxModal } from '../components/common/LightboxModal';
import { Button } from '../components/common/Button';
import { GALLERY_DATA, GALLERY_CATEGORIES } from '../data/galleryData';
import { ApiClient } from '../api/client';

export function GalleryPage({ onOpenTripPlanner }) {
  const [selectedMediaType, setSelectedMediaType] = useState('all'); // 'all', 'photo', 'video'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [galleryList, setGalleryList] = useState(GALLERY_DATA);

  // Fetch live gallery from API
  useEffect(() => {
    let isMounted = true;
    async function loadGallery() {
      try {
        const res = await ApiClient.getGallery('all');
        if (isMounted && res && res.items && res.items.length > 0) {
          setGalleryList(res.items);
        }
      } catch (err) {
        console.warn('GalleryPage: Using fallback gallery data:', err);
      }
    }
    loadGallery();
    return () => { isMounted = false; };
  }, []);

  // Filter by both media type and category
  const filteredMedia = galleryList.filter((item) => {
    const matchesMedia = selectedMediaType === 'all' || item.mediaType === selectedMediaType;
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesMedia && matchesCat;
  });

  const photoCount = galleryList.filter(i => i.mediaType === 'photo').length;
  const videoCount = galleryList.filter(i => i.mediaType === 'video').length;

  const handleMediaClick = (item, index) => {
    if (item.mediaType === 'video') {
      setActiveVideoModal(item);
    } else {
      // Find index in filtered list
      setLightboxIndex(index);
    }
  };

  return (
    <>
      <SEOHead
        title="Travel Gallery & Videos | Journey Architect"
        description="Browse inspiring travel photos and videos, mountain highways, forest safaris, and beach sunsets captured with Journey Architect."
        path="/gallery"
      />

      {/* Page Banner */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-nav">
            <a href="/">Home</a>
            <span>/</span>
            <span>Gallery & Videos</span>
          </div>

          <span className="eyebrow eyebrow-amber">
            Visual Travel Stories
          </span>

          <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.25rem)' }}>
            Moments & Videos Worth Travelling For
          </h1>

          <p>
            Immerse yourself in authentic footage from our trips — high mountain passes, misty tea hills, forest jeep safaris, and coastal getaways.
          </p>
        </div>
      </div>

      {/* Main Gallery Section */}
      <section className="section-padding bg-warm">
        <div className="container">
          {/* Main Media Type Filter Bar (Photos vs Videos vs All) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '2rem'
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedMediaType('all')}
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                fontWeight: selectedMediaType === 'all' ? 700 : 600,
                backgroundColor: selectedMediaType === 'all' ? 'var(--color-primary)' : '#FFFFFF',
                color: selectedMediaType === 'all' ? '#FFFFFF' : 'var(--color-primary)',
                border: '2px solid',
                borderColor: selectedMediaType === 'all' ? 'var(--color-primary)' : 'var(--color-border)',
                boxShadow: selectedMediaType === 'all' ? 'var(--shadow-md)' : 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={16} />
              <span>All Media ({GALLERY_DATA.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMediaType('photo')}
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                fontWeight: selectedMediaType === 'photo' ? 700 : 600,
                backgroundColor: selectedMediaType === 'photo' ? 'var(--color-secondary)' : '#FFFFFF',
                color: selectedMediaType === 'photo' ? '#FFFFFF' : 'var(--color-text-main)',
                border: '2px solid',
                borderColor: selectedMediaType === 'photo' ? 'var(--color-secondary)' : 'var(--color-border)',
                boxShadow: selectedMediaType === 'photo' ? 'var(--shadow-md)' : 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Camera size={16} />
              <span>Photos ({photoCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMediaType('video')}
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                fontWeight: selectedMediaType === 'video' ? 700 : 600,
                backgroundColor: selectedMediaType === 'video' ? 'var(--color-accent)' : '#FFFFFF',
                color: selectedMediaType === 'video' ? '#12304A' : 'var(--color-text-main)',
                border: '2px solid',
                borderColor: selectedMediaType === 'video' ? 'var(--color-accent)' : 'var(--color-border)',
                boxShadow: selectedMediaType === 'video' ? 'var(--shadow-md)' : 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Film size={16} />
              <span>🎬 Videos & Clips ({videoCount})</span>
            </button>
          </div>

          {/* Destination Category Filter Chips */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '3rem'
            }}
          >
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: selectedCategory === cat.id ? 700 : 500,
                  backgroundColor: selectedCategory === cat.id ? 'rgba(18, 48, 74, 0.12)' : 'transparent',
                  color: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat.id ? 'var(--color-primary)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="gallery-masonry-grid">
            {filteredMedia.map((item, index) => {
              const isVideo = item.mediaType === 'video';
              return (
                <div
                  key={item.id}
                  className="gallery-item"
                  onClick={() => handleMediaClick(item, index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleMediaClick(item, index);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${isVideo ? 'video' : 'photo'}: ${item.title}`}
                  style={{ position: 'relative' }}
                >
                  <img
                    src={item.image || item.posterImage}
                    alt={item.alt}
                    className="gallery-thumb"
                    loading="lazy"
                  />

                  {/* Video Indicator Badge */}
                  {isVideo && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(18, 48, 74, 0.85)',
                        backdropFilter: 'blur(4px)',
                        color: 'var(--color-accent)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        zIndex: 2,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                      }}
                    >
                      <Play size={12} fill="currentColor" />
                      <span>Video {item.duration && `• ${item.duration}`}</span>
                    </div>
                  )}

                  {/* Center Play Button on Hover / Always on Video */}
                  {isVideo && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(244, 163, 64, 0.95)',
                        color: '#12304A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                        zIndex: 2,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <Play size={24} fill="#12304A" style={{ marginLeft: '3px' }} />
                    </div>
                  )}

                  <div className="gallery-overlay">
                    <span className="gallery-overlay-badge">{item.categoryLabel}</span>
                    <h3 className="gallery-overlay-title">{item.title}</h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.8125rem', margin: '4px 0 0 0' }}>
                      {item.caption}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)', fontSize: '0.78rem', marginTop: '8px' }}>
                      {isVideo ? <Play size={14} fill="currentColor" /> : <Maximize2 size={13} />}
                      <span>{isVideo ? 'Click to play travel video' : 'Click to view full size'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inspiration CTA footer */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(2rem, 4vw, 3rem)',
              marginTop: '4rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Inspired by our travel stories & videos?
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '560px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              Let's turn these beautiful destinations into your next holiday itinerary with Journey Architect.
            </p>
            <Button
              variant="amber"
              size="lg"
              onClick={onOpenTripPlanner}
              icon={<Send size={16} />}
            >
              Plan A Trip To These Places
            </Button>
          </div>
        </div>
      </section>

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div
          className="video-modal-backdrop animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(10, 25, 40, 0.92)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="video-modal-content animate-slide-up"
            style={{
              width: '100%',
              maxWidth: '860px',
              backgroundColor: '#0E2235',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Film size={20} color="var(--color-accent)" />
                <strong style={{ fontSize: '1.05rem' }}>{activeVideoModal.title}</strong>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#FFFFFF',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Close video"
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Player */}
            <div style={{ position: 'relative', width: '100%', backgroundColor: '#000000', aspectRatio: '16 / 9' }}>
              <video
                src={activeVideoModal.videoUrl}
                poster={activeVideoModal.posterImage || activeVideoModal.image}
                controls
                autoPlay
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              >
                Your browser does not support HTML5 video.
              </video>
            </div>

            {/* Video Info Footer */}
            <div style={{ padding: '16px 20px', backgroundColor: '#0E2235', color: 'rgba(255, 255, 255, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {activeVideoModal.location}
                </span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                  {activeVideoModal.caption}
                </p>
              </div>
              <Button
                variant="amber"
                size="sm"
                onClick={() => {
                  setActiveVideoModal(null);
                  onOpenTripPlanner && onOpenTripPlanner();
                }}
                icon={<Send size={14} />}
              >
                Plan Trip Here
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Component for Photos */}
      <LightboxModal
        images={filteredMedia.filter(i => i.mediaType !== 'video')}
        activeIndex={lightboxIndex !== null ? lightboxIndex : 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </>
  );
}

