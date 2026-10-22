import React, { useState } from 'react';
import { Star, ShieldCheck, HeartHandshake, CheckCircle2, MapPin, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { REVIEWS_OVERVIEW, CORE_VALUES_FEEDBACK } from '../../data/reviewsData';
import { FAQS_DATA } from '../../data/faqsData';

export function TrustAndFAQSection({ navigate }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Top 5 FAQs for the side-by-side view
  const displayFaqs = FAQS_DATA.slice(0, 5);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'HeartHandshake': return HeartHandshake;
      case 'CheckCircle2': return CheckCircle2;
      case 'MapPin': return MapPin;
      case 'ShieldCheck': return ShieldCheck;
      default: return CheckCircle2;
    }
  };

  return (
    <section className="section-padding bg-white" id="trust-and-faq">
      <div className="container">
        <div
          className="trust-faq-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            alignItems: 'stretch'
          }}
        >
          {/* =========================================
             LEFT COLUMN: What Travelers Value in Journey Architect
             ========================================= */}
          <div
            className="trust-column"
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'space-between'
            }}
          >
            <div>
              {/* Header Box with matching minimum height */}
              <div style={{ minHeight: '110px' }}>
                <span className="eyebrow eyebrow-amber" style={{ marginBottom: '0.65rem' }}>
                  Traveler Feedback & Trust
                </span>
                <h2
                  className="section-title"
                  style={{
                    fontSize: 'clamp(1.6rem, 2.5vw, 2.25rem)',
                    color: 'var(--color-primary)',
                    marginBottom: '0.5rem',
                    lineHeight: 1.2
                  }}
                >
                  What Travelers Value in Journey Architect
                </h2>
                <p
                  className="section-subtitle"
                  style={{
                    fontSize: '0.925rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.5,
                    margin: 0
                  }}
                >
                  Real sentiment and our steadfast commitment to dependable, stress-free holiday planning.
                </p>
              </div>

              {/* Rating Highlight Card */}
              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.15rem 1.25rem',
                  margin: '1.25rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', color: 'var(--color-accent)' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {REVIEWS_OVERVIEW.verifiedDirectoryScore}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      / {REVIEWS_OVERVIEW.maxScore}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    backgroundColor: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  {REVIEWS_OVERVIEW.verifiedRatingCount} Verified Ratings
                </span>
              </div>

              {/* 4 Core Value Pillars in 2x2 Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px',
                  marginBottom: '1rem'
                }}
              >
                {CORE_VALUES_FEEDBACK.map((item) => {
                  const IconComponent = getIcon(item.icon);
                  return (
                    <div
                      key={item.id}
                      className="card-base"
                      style={{
                        padding: '1.1rem 0.95rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '8px',
                        borderRadius: '12px',
                        height: '100%',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--color-secondary-subtle)',
                          color: 'var(--color-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <IconComponent size={15} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', color: 'var(--color-primary)', margin: '0 0 2px 0', fontWeight: 700, lineHeight: 1.3 }}>
                          {item.title}
                        </h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: 0 }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Left Button Pinned to Bottom */}
            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigate('/reviews');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                icon={<ArrowRight size={14} />}
              >
                Read Reviews & Trust Policy
              </Button>
            </div>
          </div>

          {/* =========================================
             RIGHT COLUMN: Frequently Asked Questions
             ========================================= */}
          <div
            className="faq-column"
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'space-between'
            }}
          >
            <div>
              {/* Header Box with matching minimum height */}
              <div style={{ minHeight: '110px' }}>
                <span className="eyebrow eyebrow-teal" style={{ marginBottom: '0.65rem' }}>
                  Clear & Honest Answers
                </span>
                <h2
                  className="section-title"
                  style={{
                    fontSize: 'clamp(1.6rem, 2.5vw, 2.25rem)',
                    color: 'var(--color-primary)',
                    marginBottom: '0.5rem',
                    lineHeight: 1.2
                  }}
                >
                  Frequently Asked Questions
                </h2>
                <p
                  className="section-subtitle"
                  style={{
                    fontSize: '0.925rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.5,
                    margin: 0
                  }}
                >
                  Quick answers about customized plans, booking steps, and travel arrangements.
                </p>
              </div>

              {/* Accordion List */}
              <div className="faq-list" style={{ margin: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {displayFaqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={faq.id}
                      className={`faq-item ${isOpen ? 'open' : ''}`}
                      style={{
                        backgroundColor: isOpen ? 'var(--color-bg)' : '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <button
                        type="button"
                        className="faq-button"
                        onClick={() => toggleFaq(index)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-side-answer-${faq.id}`}
                        id={`faq-side-btn-${faq.id}`}
                        style={{
                          padding: '0.9rem 1.15rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          textAlign: 'left',
                          fontSize: '0.925rem',
                          fontWeight: 600,
                          color: 'var(--color-primary)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          gap: '10px'
                        }}
                      >
                        <span>{faq.question}</span>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: isOpen ? 'var(--color-secondary)' : 'var(--color-bg)',
                            color: isOpen ? '#FFFFFF' : 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                            transition: 'transform 0.25s ease, background-color 0.25s ease'
                          }}
                        >
                          <ChevronDown size={14} />
                        </div>
                      </button>

                      {isOpen && (
                        <div
                          id={`faq-side-answer-${faq.id}`}
                          role="region"
                          aria-labelledby={`faq-side-btn-${faq.id}`}
                          className="faq-answer animate-fade-in"
                          style={{
                            padding: '0 1.15rem 0.9rem 1.15rem',
                            color: 'var(--color-text-secondary)',
                            fontSize: '0.84rem',
                            lineHeight: 1.5,
                            borderTop: '1px solid var(--color-border-light)'
                          }}
                        >
                          <p style={{ margin: '0.4rem 0 0 0' }}>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Button Pinned to Bottom */}
            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigate('/faq');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                icon={<ArrowRight size={14} />}
              >
                View All Travel FAQs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive media queries */}
      <style>{`
        @media (max-width: 900px) {
          .trust-faq-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .trust-faq-grid .trust-column > div:first-child > div:first-child,
          .trust-faq-grid .faq-column > div:first-child > div:first-child {
            min-height: auto !important;
          }
        }
        @media (max-width: 580px) {
          .trust-column .card-base {
            grid-column: span 2;
          }
        }
      `}</style>
    </section>
  );
}
