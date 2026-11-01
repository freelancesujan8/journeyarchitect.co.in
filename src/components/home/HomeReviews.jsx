import React from 'react';
import { Star, ShieldCheck, HeartHandshake, CheckCircle2, MapPin, ArrowRight, ExternalLink, MessageSquareHeart } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { REVIEWS_OVERVIEW, CORE_VALUES_FEEDBACK, GOOGLE_REVIEWS } from '../../data/reviewsData';
import { BUSINESS_CONFIG } from '../../config/businessConfig';
import { GoogleIcon } from '../common/SocialIcons';

export function HomeReviews({ navigate }) {
  return (
    <section className="section-padding bg-white" id="home-reviews">
      <div className="container">
        <SectionHeading
          eyebrow="Traveler Feedback & Trust"
          eyebrowVariant="amber"
          title="Google Real Reviews & Customer Trust"
          subtitle="Genuine experiences from travelers who booked tour packages, car rentals, and catering services with Journey Architect."
        />

        {/* Rating Highlight Banner */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2rem',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
              >
                <GoogleIcon size={22} />
              </div>
              <div style={{ display: 'flex', color: '#FBBC05' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="#FBBC05" />
                ))}
              </div>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {BUSINESS_CONFIG.googleRating || '5.0'}
              </span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
                / 5.0
              </span>
            </div>

            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
              Google Real Reviews ({BUSINESS_CONFIG.googleRatingCount || 28}+ Verified Ratings)
            </span>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
              {REVIEWS_OVERVIEW.attributionNotice}
            </p>
          </div>

          {/* Right policy statement & CTA */}
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              100% Verified Real Client Experiences
            </h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              We take pride in transparent holiday planning, punctual transport, and authentic catering. Read our direct Google traveler reviews below or add your own feedback.
            </p>
            <a
              href={BUSINESS_CONFIG.googleReviewUrl || BUSINESS_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <GoogleIcon size={16} /> Write a Review on Google Maps <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Real Google Reviews Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}
        >
          {GOOGLE_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="card-base"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: rev.avatarBg,
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}
                    >
                      {rev.avatarText}
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)', display: 'block' }}>
                        {rev.authorName}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {rev.location} • {rev.date}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                    }}
                    title="Verified on Google"
                  >
                    <GoogleIcon size={16} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', color: '#FBBC05' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#FBBC05" />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(22, 124, 128, 0.1)',
                      color: 'var(--color-secondary)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    {rev.service}
                  </span>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#167C80" />
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Verified Google Traveler Review
                </span>
              </div>
            </div>
          ))}
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
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Button
            variant="outline"
            onClick={() => {
              navigate('/reviews');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            icon={<ArrowRight size={16} />}
          >
            Read All Reviews & Trust Details
          </Button>
        </div>
      </div>
    </section>
  );
}
