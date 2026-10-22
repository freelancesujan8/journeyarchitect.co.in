import React from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquareHeart, Send, MapPin, Heart } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Button } from '../components/common/Button';
import { SectionHeading } from '../components/common/SectionHeading';
import { REVIEWS_OVERVIEW, CORE_VALUES_FEEDBACK } from '../data/reviewsData';
import { BUSINESS_CONFIG } from '../config/businessConfig';

export function ReviewsPage({ onOpenTripPlanner }) {
  return (
    <>
      <SEOHead
        title="Traveler Reviews & Trust"
        description="Read about traveler trust and verified public ratings for Journey Architect in Bongaon, West Bengal."
        path="/reviews"
      />

      {/* Page Banner */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-nav">
            <a href="/">Home</a>
            <span>/</span>
            <span>Reviews & Trust</span>
          </div>

          <span className="eyebrow eyebrow-amber">
            Customer Sentiment
          </span>

          <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.25rem)' }}>
            Traveler Trust & Feedback
          </h1>

          <p>
            We believe transparent communication and honest travel planning build long-lasting customer relationships.
          </p>
        </div>
      </div>

      {/* Main Reviews Section */}
      <section className="section-padding bg-warm">
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Public Score Card */}
          <div
            className="card-base"
            style={{
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              marginBottom: '3.5rem'
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
                <div style={{ display: 'inline-flex', color: 'var(--color-accent)', gap: '4px', marginBottom: '0.75rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={30} fill="currentColor" />
                  ))}
                </div>
                <div style={{ fontSize: '3.25rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                  {REVIEWS_OVERVIEW.verifiedDirectoryScore}
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-secondary)', display: 'block', marginTop: '0.5rem' }}>
                  5.0 out of 5 Stars
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  Based on {REVIEWS_OVERVIEW.verifiedRatingCount} Verified Ratings
                </span>
              </div>

              {/* Right Source Explanation */}
              <div>
                <span className="eyebrow eyebrow-teal" style={{ marginBottom: '0.5rem' }}>
                  Source Attribution
                </span>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  Public Directory Listing Record
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                  The 5.0/5 score represents the public listing for Journey Architect in the Bongaon area. As part of our strict transparency policy, we only attribute ratings to their verified origins.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                  <ShieldCheck size={16} color="var(--color-secondary)" />
                  <span>Zero fabricated or paid reviews.</span>
                </div>
              </div>
            </div>
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
              We'd love to hear your feedback! Share your trip photos and experience with our team to be featured in our upcoming traveler testimonial spotlight.
            </p>
            <Button
              variant="primary"
              onClick={onOpenTripPlanner}
              icon={<Send size={16} />}
            >
              Plan Your Next Trip With Us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
