import React from 'react';
import { Compass, Car, Utensils, Check, ArrowRight, Phone, Sparkles } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { CORE_SERVICES } from '../../data/servicesData';
import { getPhoneCallUrl } from '../../config/businessConfig';

const ICONS_MAP = {
  Compass: Compass,
  Car: Car,
  Utensils: Utensils
};

export function ServicesSection({ onOpenTripPlanner, navigate }) {
  const handleViewDetails = (slug) => {
    if (navigate) {
      navigate(`/services/${slug}`);
    } else {
      window.location.href = `/services/${slug}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="section-padding bg-warm" id="services" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="container">
        <SectionHeading
          eyebrow="Our Core Services"
          eyebrowVariant="teal"
          title="Complete Travel, Catering & Car Rental Solutions"
          subtitle="From bespoke holiday packages and sanitised rental cabs to fresh catering for your group trips & events — Journey Architect delivers everything under one roof."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.25rem',
            marginTop: '1.75rem'
          }}
        >
          {CORE_SERVICES.map((service) => {
            const IconComponent = ICONS_MAP[service.icon] || Compass;
            return (
              <div
                key={service.id}
                className="compact-service-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 4px 16px rgba(18, 48, 74, 0.06)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(18, 48, 74, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(18, 48, 74, 0.06)';
                }}
              >
                {/* Image Header with Badge */}
                <div style={{ position: 'relative', height: '190px', overflow: 'hidden', backgroundColor: '#0E2235' }}>
                  <img
                    src={service.heroImage}
                    alt={service.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(14, 34, 53, 0.92) 0%, rgba(14, 34, 53, 0.35) 60%, transparent 100%)'
                    }}
                  />

                  {/* Badge */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      backgroundColor: 'var(--color-accent)',
                      color: '#12304A',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                    }}
                  >
                    {service.badge}
                  </span>

                  {/* Icon & Category Title Over Image */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '14px',
                      right: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '9px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <IconComponent size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: 0, fontWeight: 700, lineHeight: 1.25 }}>
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Content Body */}
                <div style={{ padding: '1rem 1.15rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '4px', display: 'block' }}>
                    {service.shortTagline}
                  </span>

                  <p
                    style={{
                      fontSize: '0.825rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.45,
                      marginBottom: '10px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {service.description}
                  </p>

                  {/* Features list (2 items) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
                    {service.keyFeatures.slice(0, 2).map((feature, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-text-main)' }}>
                        <div style={{ color: 'var(--color-secondary)', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                          <Check size={13} strokeWidth={2.5} />
                        </div>
                        <span style={{ lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Direct Contact Info Pill */}
                  <div
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid var(--color-border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                        {service.leadContact.name.split(' ')[0]}:
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {service.leadContact.phone}
                      </span>
                    </div>
                    <a
                      href={getPhoneCallUrl(service.leadContact.phone)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-secondary-subtle)',
                        color: 'var(--color-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none'
                      }}
                      title={`Call ${service.leadContact.name}`}
                    >
                      <Phone size={13} />
                    </a>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleViewDetails(service.slug)}
                      icon={<ArrowRight size={13} />}
                      style={{ padding: '7px 10px', fontSize: '0.8rem', borderRadius: '8px' }}
                    >
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenTripPlanner && onOpenTripPlanner(service.id)}
                      icon={<Sparkles size={13} />}
                      style={{ padding: '7px 10px', fontSize: '0.8rem', borderRadius: '8px' }}
                    >
                      Enquire
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default ServicesSection;
