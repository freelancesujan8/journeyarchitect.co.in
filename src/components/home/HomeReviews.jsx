import React from 'react';
import { Star, ShieldCheck, HeartHandshake, CheckCircle2, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { REVIEWS_OVERVIEW, CORE_VALUES_FEEDBACK } from '../../data/reviewsData';
import { BUSINESS_CONFIG } from '../../config/businessConfig';

export function HomeReviews({ navigate }) {
  return (
    <section className="section-padding bg-white" id="home-reviews">
      <div className="container">
        <SectionHeading
          eyebrow="Traveler Feedback & Trust"
          eyebrowVariant="amber"
          title="What Travelers Value in Journey Architect"
          subtitle="Real sentiment and our steadfast commitment to dependable, stress-free holiday planning."
        />

        {/* Rating Highlight Banner */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '1.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            alignItems: 'center'
          }}
        >
          {/* Left score box */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              borderRight: '1px solid var(--color-border-light)',
              paddingRight: '2rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', color: 'var(--color-accent)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={22} fill="currentColor" />
                ))}
              </div>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {REVIEWS_OVERVIEW.verifiedDirectoryScore}
              </span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
                / {REVIEWS_OVERVIEW.maxScore}
              </span>
            </div>

            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
              Public Listing Rating ({REVIEWS_OVERVIEW.verifiedRatingCount} Verified Ratings)
            </span>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
              {REVIEWS_OVERVIEW.attributionNotice}
            </p>
          </div>

          {/* Right policy statement */}
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Our Strict Review Integrity Policy
            </h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              We believe trust is earned through honest communication. We never fabricate customer quotes, fake star ratings, or invent reviews. Genuine customer language will be published with full transparency.
            </p>
          </div>
        </div>

        {/* 4 Core Value Pillars */}
        <div className="grid-2">
          {CORE_VALUES_FEEDBACK.map((item) => (
            <div
              key={item.id}
              className="card-base"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1.75rem'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-secondary-subtle)',
                  color: 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews Navigation Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <Button
            variant="outline"
            onClick={() => {
              navigate('/reviews');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            icon={<ArrowRight size={16} />}
          >
            Read More About Reviews & Ratings
          </Button>
        </div>
      </div>
    </section>
  );
}
