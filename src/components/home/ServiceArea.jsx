import React from 'react';
import { MapPin, Navigation, Phone, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { BUSINESS_CONFIG, getWhatsAppUrl, getPhoneCallUrl } from '../../config/businessConfig';

export function ServiceArea() {
  return (
    <section className="section-padding bg-white" id="service-area">
      <div className="container">
        <SectionHeading
          eyebrow="Local Presence"
          eyebrowVariant="amber"
          title="Travel Assistance From Bongaon"
          subtitle="Based in the Bongaon area of North 24 Parganas, Journey Architect is your accessible local partner for domestic and holiday getaways."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'stretch'
          }}
        >
          {/* Left Info Card */}
          <div
            className="card-base"
            style={{
              padding: 'clamp(2rem, 4vw, 2.75rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--color-secondary-subtle)',
                  color: 'var(--color-secondary)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  marginBottom: '1.25rem'
                }}
              >
                <MapPin size={14} />
                <span>Kolkata & Batanagar, West Bengal</span>
              </div>

              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                Visit or Contact Our Office
              </h3>

              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
                We serve travelers from Kolkata, Batanagar, Maheshtala, and surrounding West Bengal regions who appreciate speaking directly with a dedicated travel operator rather than dealing with impersonal online algorithms.
              </p>

              {/* Verified Contact Details List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MapPin size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)', display: 'block' }}>
                      Office Address:
                    </strong>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      {BUSINESS_CONFIG.address}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Phone size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)', display: 'block' }}>
                      Phone Call:
                    </strong>
                    <a href={getPhoneCallUrl()} style={{ fontSize: '0.875rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
                      {BUSINESS_CONFIG.phone}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MessageCircle size={20} color="var(--color-whatsapp)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)', display: 'block' }}>
                      WhatsApp Direct:
                    </strong>
                    <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: 'var(--color-whatsapp-dark)', fontWeight: 600 }}>
                      {BUSINESS_CONFIG.whatsapp}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button
                variant="whatsapp"
                href={getWhatsAppUrl()}
                target="_blank"
                icon={<MessageCircle size={16} />}
              >
                Chat on WhatsApp
              </Button>

              <Button
                variant="outline"
                href={BUSINESS_CONFIG.googleMapsUrl}
                target="_blank"
                icon={<Navigation size={16} />}
              >
                Get Directions
              </Button>
            </div>
          </div>

          {/* Right Map Visual Placeholder with Directions Overlay */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-md)',
              position: 'relative'
            }}
          >
            {/* Visual Map Representation */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-alt)',
                flexGrow: 1,
                minHeight: '280px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--color-border)',
                  maxWidth: '320px',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem'
                  }}
                >
                  <MapPin size={24} color="var(--color-accent)" />
                </div>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: '0 0 4px 0' }}>
                  Journey Architect
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0 0 1rem 0' }}>
                  Tower 02, Elgin 1, New Batanagar Road, Maheshtala
                </p>
                <a
                  href={BUSINESS_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', fontSize: '0.8125rem' }}
                >
                  <Navigation size={14} /> Open in Google Maps
                </a>
              </div>
            </div>

            <div
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'var(--color-surface)',
                borderTop: '1px solid var(--color-border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)'
              }}
            >
              <span>Verified Public Business Location</span>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Elgin 1, Batanagar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
