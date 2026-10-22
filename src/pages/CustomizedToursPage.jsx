import React from 'react';
import { Sliders, Calendar, Users, MapPin, Sparkles, MessageCircle, CheckCircle2, Shield } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { TripEnquiryForm } from '../components/forms/TripEnquiryForm';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { BUSINESS_CONFIG, getWhatsAppUrl } from '../config/businessConfig';

export function CustomizedToursPage({ onOpenTripPlanner }) {
  return (
    <>
      <SEOHead
        title="Customized Tours & Bespoke Travel Planning"
        description="Design your dream holiday tailored to your schedule, budget, and group preferences with Journey Architect in Bongaon."
        path="/customized-tours"
      />

      {/* Page Banner */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-nav">
            <a href="/">Home</a>
            <span>/</span>
            <span>Customized Tours</span>
          </div>

          <span className="eyebrow eyebrow-amber">
            Tailored To You
          </span>

          <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.25rem)' }}>
            Customized Tour Planning
          </h1>

          <p>
            Have a specific destination or pace in mind? Tell us what you need, and let's craft a trip designed around your schedule, budget, and comfort.
          </p>
        </div>
      </div>

      {/* Custom Planning Section */}
      <section className="section-padding bg-warm">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(2.5rem, 5vw, 4.5rem)',
              alignItems: 'flex-start'
            }}
          >
            {/* Left Content: Why Custom Tours */}
            <div>
              <span className="eyebrow eyebrow-teal">
                Bespoke Travel Experience
              </span>

              <h2 className="section-title" style={{ color: 'var(--color-primary)', marginTop: '0.5rem' }}>
                Your Holiday, Your Rules, Your Pace
              </h2>

              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Fixed group tour dates and rigid sightseeing schedules don't work for everyone. When you plan a customized trip with Journey Architect, every element is designed specifically for your party:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: '0 0 2px 0' }}>
                      Choose Your Own Dates & Duration
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                      Travel whenever it suits your work leave or family holidays, without waiting for fixed group departure dates.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: '0 0 2px 0' }}>
                      Private Vehicle & Group Comfort
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                      Enjoy dedicated private transportation with your family or friends, allowing you to stop for photos and tea whenever you like.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-primary-alpha15)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sliders size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: '0 0 2px 0' }}>
                      Tailored Hotel Categories & Sightseeing
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                      Pick boutique homestays, deluxe valley-view hotels, or budget-friendly stays based on your family's exact comfort preferences.
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Direct Message Box */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                  <MessageCircle size={20} color="var(--color-whatsapp)" />
                  <strong style={{ fontSize: '1rem' }}>Prefer discussing via WhatsApp?</strong>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  Send your preferred destination and rough dates directly to our team for a quick conversation.
                </p>
                <Button
                  variant="whatsapp"
                  href={getWhatsAppUrl(BUSINESS_CONFIG.whatsappCustomPlanMessage)}
                  target="_blank"
                  icon={<MessageCircle size={16} />}
                >
                  Start WhatsApp Discussion
                </Button>
              </div>
            </div>

            {/* Right: Interactive Form Container */}
            <div
              className="card-base"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(1.75rem, 4vw, 2.5rem)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="eyebrow eyebrow-amber" style={{ marginBottom: '0.5rem' }}>
                  Custom Plan Request
                </span>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', margin: 0 }}>
                  Share Your Travel Requirements
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
                  We'll review your details and propose a tailored itinerary.
                </p>
              </div>

              <TripEnquiryForm initialTripType="customized" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
