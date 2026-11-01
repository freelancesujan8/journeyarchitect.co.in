import React from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquareHeart, Send, MapPin, Heart, ExternalLink } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Button } from '../components/common/Button';
import { SectionHeading } from '../components/common/SectionHeading';
import { REVIEWS_OVERVIEW, CORE_VALUES_FEEDBACK, GOOGLE_REVIEWS } from '../data/reviewsData';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { GoogleIcon } from '../components/common/SocialIcons';

export function ReviewsPage({ onOpenTripPlanner }) {
  return (
    <>
      <SEOHead
        title="Google Real Reviews & Traveler Trust"
        description="Read verified traveler reviews and ratings on Google Maps for Journey Architect tour packages, car rentals, and catering services."
        path="/reviews"
      />

      {/* Page Banner */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-nav">
            <a href="/">Home</a>
            <span>/</span>
            <span>Google Reviews & Trust</span>
          </div>

          <span className="eyebrow eyebrow-amber">
            Customer Sentiment & Ratings
          </span>

          <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.25rem)' }}>
            Google Real Reviews & Traveler Feedback
          </h1>

          <p>
            We believe transparent communication, dependable vehicles, and honest travel planning build long-lasting traveler relationships.
          </p>
        </div>
      </div>

      {/* Main Reviews Section */}
      <section className="section-padding bg-warm">
        <div className="container" style={{ maxWidth: '1000px' }}>
          {/* Public Score Card */}
          <div
            className="card-base"
            style={{
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              marginBottom: '3rem'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2.5rem',
                alignItems: 'center'
              }}
            >
              {/* Left Score Block */}
              <div style={{ textAlign: 'center', padding: '1rem', borderRight: '1px solid var(--color-border-light)' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                >
                  <GoogleIcon size={28} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', color: '#FBBC05', gap: '4px', marginBottom: '0.5rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={24} fill="#FBBC05" />
                  ))}
                </div>
                <div style={{ fontSize: '3.25rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                  {BUSINESS_CONFIG.googleRating || '5.0'}
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-secondary)', display: 'block', marginTop: '0.5rem' }}>
                  5.0 out of 5 Stars on Google
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  Based on {BUSINESS_CONFIG.googleRatingCount || 28}+ Verified Customer Reviews
                </span>
              </div>

              {/* Right Source Explanation */}
              <div>
                <span className="eyebrow eyebrow-teal" style={{ marginBottom: '0.5rem' }}>
                  Verified Reviews
                </span>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  Genuine Google Maps Feedback
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  All ratings and testimonials reflect real experiences from travelers and clients who booked our tour packages, hired our outstation vehicles, or used our event catering across West Bengal.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  <a
                    href={BUSINESS_CONFIG.googleReviewUrl || BUSINESS_CONFIG.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-primary)',
                      color: '#FFFFFF',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    <GoogleIcon size={16} /> Write a Review on Google <ExternalLink size={14} />
                  </a>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                    <ShieldCheck size={16} color="var(--color-secondary)" />
                    <span>Zero paid or simulated reviews.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real Google Reviews Cards Section */}
          <SectionHeading
            eyebrow="Google Testimonials"
            eyebrowVariant="amber"
            title="Real Stories From Real Travelers"
            subtitle="Read what clients have to say about our tour planning, comfortable transport, and delicious catering."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3.5rem'
            }}
          >
            {GOOGLE_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="card-base"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          backgroundColor: rev.avatarBg,
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '1rem'
                        }}
                      >
                        {rev.avatarText}
                      </div>
                      <div>
                        <strong style={{ fontSize: '1rem', color: 'var(--color-primary)', display: 'block' }}>
                          {rev.authorName}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          {rev.location} • {rev.date}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                      }}
                      title="Verified on Google Maps"
                    >
                      <GoogleIcon size={18} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.875rem' }}>
                    <div style={{ display: 'flex', color: '#FBBC05' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="#FBBC05" />
                      ))}
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: 'rgba(22, 124, 128, 0.1)',
                        color: 'var(--color-secondary)',
                        padding: '3px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {rev.service}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    "{rev.comment}"
                  </p>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.875rem', borderTop: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} color="#167C80" />
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Verified Google Review • 5.0 Star Rating
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Core Values / What Travelers Value */}
          <SectionHeading
            eyebrow="Our Commitment"
            eyebrowVariant="amber"
            title="What Sets Our Service Apart"
            subtitle="The core qualities that our travelers look for when organizing holidays with Journey Architect."
          />

          <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '4rem' }}>
            {CORE_VALUES_FEEDBACK.map((val) => (
              <div key={val.id} className="card-base" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', margin: 0 }}>
                    {val.title}
                  </h3>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                  {val.description}
                </p>
              </div>
            ))}
          </div>

          {/* Notice on Customer Testimonials */}
          <div
            style={{
              backgroundColor: 'var(--color-secondary-subtle)',
              border: '1px solid rgba(22, 124, 128, 0.25)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              textAlign: 'center'
            }}
          >
            <MessageSquareHeart size={32} color="var(--color-secondary)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Have you traveled with Journey Architect?
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '560px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              We'd love to hear your feedback! Share your trip experience on Google or contact our team to plan your next journey.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href={BUSINESS_CONFIG.googleReviewUrl || BUSINESS_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-secondary)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.925rem',
                  textDecoration: 'none'
                }}
              >
                <GoogleIcon size={18} /> Review Us on Google
              </a>
              <Button
                variant="primary"
                onClick={onOpenTripPlanner}
                icon={<Send size={16} />}
              >
                Plan Your Next Trip With Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
