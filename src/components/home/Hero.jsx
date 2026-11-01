import React, { useState, useEffect } from 'react';
import { Send, Compass, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';
import { BUSINESS_CONFIG } from '../../config/businessConfig';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85',
    tag: 'Darjeeling & Kalimpong',
    location: 'West Bengal (North)',
    badgeText: 'Misty Tea Valleys & Kanchenjunga Sunrise'
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1920&q=85',
    tag: 'Sikkim Highland Explorer',
    location: 'Sikkim Himalayas',
    badgeText: 'Gangtok, Tsomgo Lake & Alpine Valleys'
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=85',
    tag: 'Dooars Lataguri Safari',
    location: 'Dooars, North Bengal',
    badgeText: 'Lush Tea Trails, Wildlife & Murti River'
  },
  {
    id: 'slide-4',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85',
    tag: 'Puri & Konark Coastal',
    location: 'Odisha Coast',
    badgeText: 'Golden Beach Sunsets & Sun Temple'
  },
  {
    id: 'slide-5',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
    tag: 'High Alpine Serenity',
    location: 'Eastern Himalayas',
    badgeText: 'Pristine Glacial Lakes & Pine Trails'
  }
];

export function Hero({ onOpenTripPlanner, navigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedQuickDest, setSelectedQuickDest] = useState('Darjeeling / Sikkim');

  // Auto-advance slider every 4.8s
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4800);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const activeSlideData = HERO_SLIDES[currentSlide];

  return (
    <section
      className="hero-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      style={{
        position: 'relative',
        minHeight: 'clamp(560px, 85vh, 760px)',
        display: 'flex',
        alignItems: 'center',
        color: '#ffffff',
        overflow: 'hidden',
        marginTop: 0,
        paddingTop: 'clamp(120px, 16vh, 150px)',
        paddingBottom: '3.5rem',
        backgroundColor: '#0A1E30'
      }}
    >
      {/* Background Image Slider with Ken-Burns Motion & Smooth Cross-Fade */}
      <div
        className="hero-background-slider"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          overflow: 'hidden'
        }}
      >
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scale(1.04)' : 'scale(1)',
                transition: 'opacity 1.2s ease-in-out, transform 6s cubic-bezier(0.25, 1, 0.5, 1)',
                pointerEvents: 'none'
              }}
            >
              <img
                src={slide.image}
                alt={slide.tag}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 40%'
                }}
              />
            </div>
          );
        })}

        {/* Sophisticated Multilayered Gradient Scrim for crisp readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(180deg, rgba(8, 22, 36, 0.75) 0%, rgba(10, 30, 48, 0.7) 45%, rgba(8, 22, 36, 0.95) 100%),
              radial-gradient(ellipse at 70% 30%, rgba(22, 124, 128, 0.25) 0%, transparent 60%)
            `,
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Main Hero Container */}
      <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'center'
          }}
        >
          {/* Hero Left Content */}
          <div className="hero-content animate-slide-up" style={{ maxWidth: '640px' }}>
            {/* Headline */}
            <h1
              className="hero-title"
              style={{
                color: '#ffffff',
                marginBottom: '1.25rem',
                fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
                lineHeight: 1.18,
                textShadow: '0 3px 15px rgba(0,0,0,0.4)',
                fontFamily: 'var(--font-heading)'
              }}
            >
              Your Next Journey Starts With a{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #F6B864 0%, #F4A340 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}
              >
                Better Plan.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p
              className="body-lead"
              style={{
                color: 'rgba(255, 255, 255, 0.92)',
                marginBottom: '2rem',
                fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                lineHeight: 1.6,
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                maxWidth: '560px'
              }}
            >
              Planning a holiday, family getaway or group tour? Journey Architect helps you turn your dream destination into a clear, enjoyable, and hassle-free journey.
            </p>

            {/* Call To Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <Button
                variant="amber"
                size="lg"
                onClick={onOpenTripPlanner}
                icon={<Send size={18} />}
                style={{
                  boxShadow: '0 8px 24px rgba(244, 163, 64, 0.35)',
                  fontWeight: 700
                }}
              >
                Plan My Trip
              </Button>

              <Button
                variant="outline-white"
                size="lg"
                onClick={() => {
                  navigate('/tours');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                icon={<Compass size={18} />}
              >
                Explore Tours
              </Button>
            </div>
          </div>

          {/* Hero Right Interactive Quick Trip Planner Card */}
          <div
            className="hero-card-container animate-fade-in"
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <div
              className="hero-planner-card"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                color: 'var(--color-text-main)',
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                maxWidth: '430px',
                width: '100%',
                position: 'relative'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <span
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(22, 124, 128, 0.12)',
                    color: 'var(--color-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Compass size={22} />
                </span>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', margin: 0, fontWeight: 700 }}>
                    Quick Trip Planner
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Share your idea & get a customized plan
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.15rem', lineHeight: 1.5 }}>
                Select your preferred destination circuit or let us know your travel dates for personalized guidance:
              </p>

              {/* Quick Destination Preset Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1.25rem' }}>
                {['Darjeeling / Sikkim', 'Dooars Safari', 'Puri Beach', 'Custom Itinerary'].map((destName) => {
                  const isSel = selectedQuickDest === destName;
                  return (
                    <button
                      key={destName}
                      type="button"
                      onClick={() => setSelectedQuickDest(destName)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: isSel ? 700 : 500,
                        backgroundColor: isSel ? 'var(--color-primary)' : 'var(--color-bg)',
                        color: isSel ? '#FFFFFF' : 'var(--color-text-main)',
                        border: '1px solid',
                        borderColor: isSel ? 'var(--color-primary)' : 'var(--color-border)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                    >
                      {destName}
                    </button>
                  );
                })}
              </div>

              {/* Key Planner Guarantees */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>✓</span>
                  <span>Free consultation & route guidance</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>✓</span>
                  <span>Verified hotel stays & mountain drivers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>✓</span>
                  <span>Direct phone & WhatsApp coordination</span>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={onOpenTripPlanner}
                icon={<ArrowRight size={16} />}
                style={{ width: '100%', padding: '12px', fontWeight: 700 }}
              >
                Start Planning Free
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Left Navigation Arrow (Floating over Image) */}
      <button
        type="button"
        onClick={handlePrevSlide}
        aria-label="Previous background slide"
        className="hero-side-nav-btn hero-side-nav-prev"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Navigation Arrow (Floating over Image) */}
      <button
        type="button"
        onClick={handleNextSlide}
        aria-label="Next background slide"
        className="hero-side-nav-btn hero-side-nav-next"
      >
        <ChevronRight size={24} />
      </button>

      {/* Centered Bottom Slide Indicator Dots */}
      <div
        className="hero-slider-dots"
        style={{
          position: 'absolute',
          bottom: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          backgroundColor: 'rgba(14, 34, 53, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: currentSlide === idx ? '26px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: currentSlide === idx ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.4)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        ))}
      </div>

      {/* Embedded Component Styles */}
      <style>{`
        .hero-side-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 15;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(14, 34, 53, 0.55);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.28);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
          transition: all 0.25s ease;
        }

        .hero-side-nav-prev {
          left: clamp(12px, 2.5vw, 32px);
        }

        .hero-side-nav-next {
          right: clamp(12px, 2.5vw, 32px);
        }

        .hero-side-nav-btn:hover {
          background: var(--color-accent);
          color: #0E2235;
          border-color: var(--color-accent);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 24px rgba(246, 184, 100, 0.45);
        }

        .hero-planner-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hero-planner-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 28px 56px rgba(0, 0, 0, 0.45);
        }
      `}</style>
    </section>
  );
}
