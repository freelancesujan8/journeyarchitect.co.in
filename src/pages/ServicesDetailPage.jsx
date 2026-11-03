import React, { useState, useEffect } from 'react';
import { 
  Compass, Car, Utensils, Check, Phone, MessageCircle, 
  Sparkles, ShieldCheck, MapPin, ArrowRight, ChevronRight, 
  HelpCircle, Calendar, Users, Star, Award, Clock
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Button } from '../components/common/Button';
import { SectionHeading } from '../components/common/SectionHeading';
import { CORE_SERVICES } from '../data/servicesData';
import { BUSINESS_CONFIG, getWhatsAppUrl, getPhoneCallUrl } from '../config/businessConfig';
import { CateringEnquiryForm } from '../components/forms/CateringEnquiryForm';
import { CarRentalEnquiryForm } from '../components/forms/CarRentalEnquiryForm';
import { CuisineWeServeSection } from '../components/catering/CuisineWeServeSection';

const ICONS_MAP = {
  Compass: Compass,
  Car: Car,
  Utensils: Utensils
};

const normalizeServiceSlug = (slug) => {
  if (!slug) return 'tour-and-travel';
  if (slug === 'catering' || slug === 'catering-services') return 'catering';
  if (slug === 'car-rental' || slug === 'car-rental-services') return 'car-rental';
  return slug;
};

export function ServicesDetailPage({ initialServiceSlug = 'tour-and-travel', onOpenTripPlanner, navigate }) {
  const [activeSlug, setActiveSlug] = useState(() => normalizeServiceSlug(initialServiceSlug));

  useEffect(() => {
    if (initialServiceSlug) {
      setActiveSlug(normalizeServiceSlug(initialServiceSlug));
    }
  }, [initialServiceSlug]);

  const activeService = CORE_SERVICES.find(s => s.slug === activeSlug) || CORE_SERVICES[0];
  const IconComponent = ICONS_MAP[activeService.icon] || Compass;

  const handleSelectService = (slug) => {
    setActiveSlug(normalizeServiceSlug(slug));
    if (navigate) {
      navigate(`/services/${slug}`);
    }
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <>
      <SEOHead
        title={`${activeService.title} | Journey Architect`}
        description={activeService.description}
        path={`/services/${activeService.slug}`}
      />

      {/* Page Hero Banner */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-nav">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
            <span>/</span>
            <a href="/services" onClick={(e) => { e.preventDefault(); navigate('/services'); }}>Services</a>
            <span>/</span>
            <span>{activeService.title}</span>
          </div>

          <span className="eyebrow eyebrow-amber">
            Our Specialised Services
          </span>

          <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.25rem)' }}>
            Tour and Travel, Catering Services & Car Rental
          </h1>

          <p>
            Experience hassle-free travel planning, clean rental vehicles, and authentic catering services managed directly by the Journey Architect leadership team.
          </p>
        </div>
      </div>

      {/* Main Service Layout */}
      <section className="section-padding bg-warm">
        <div className="container">
          {/* Service Selector Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
              marginBottom: '3rem'
            }}
          >
            {CORE_SERVICES.map((srv) => {
              const SrvIcon = ICONS_MAP[srv.icon] || Compass;
              const isActive = srv.slug === activeSlug;
              return (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => handleSelectService(srv.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '1.25rem 1.5rem',
                    borderRadius: 'var(--radius-xl)',
                    backgroundColor: isActive ? 'var(--color-primary)' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : 'var(--color-primary)',
                    border: `2px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    boxShadow: isActive ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left'
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: isActive ? 'rgba(244, 163, 64, 0.2)' : 'var(--color-bg)',
                      color: isActive ? 'var(--color-accent)' : 'var(--color-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <SrvIcon size={24} />
                  </div>
                  <div>
                    <strong
                      style={{
                        fontSize: '1rem',
                        color: isActive ? '#FFFFFF' : 'var(--color-primary)',
                        display: 'block'
                      }}
                    >
                      {srv.title}
                    </strong>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Service In-Depth Details */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(2rem, 4vw, 3.5rem)',
              alignItems: 'flex-start'
            }}
          >
            {/* Left Content Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    backgroundColor: 'var(--color-secondary-subtle)',
                    color: 'var(--color-secondary)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {activeService.badge}
                </span>
              </div>

              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                {activeService.title}
              </h2>

              <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
                {activeService.overview}
              </p>

              {/* Key Features Bullet List */}
              <div
                className="card-base"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '2rem',
                  borderRadius: 'var(--radius-xl)',
                  marginBottom: '2.5rem',
                  border: '1px solid var(--color-border)'
                }}
              >
                <h4 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={20} color="var(--color-accent-dark)" />
                  <span>{activeService.highlightsTitle || 'Key Highlights & Inclusions'}</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeService.keyFeatures.map((feat, idx) => {
                    const colonIdx = feat.indexOf(':');
                    const hasLabel = colonIdx > -1 && colonIdx < 35;
                    const label = hasLabel ? feat.slice(0, colonIdx) : null;
                    const content = hasLabel ? feat.slice(colonIdx + 1) : feat;

                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-secondary-subtle)',
                            color: 'var(--color-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px'
                          }}
                        >
                          <Check size={14} />
                        </div>
                        <span style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: 1.55 }}>
                          {hasLabel ? (
                            <>
                              <strong style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{label}:</strong>
                              {content}
                            </>
                          ) : (
                            feat
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Specific Offerings Grid */}
              <h4 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                Available Options & Packages
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {activeService.offerings.map((offering, idx) => (
                  <div
                    key={idx}
                    className="card-base"
                    style={{
                      backgroundColor: '#FFFFFF',
                      padding: '1.5rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <strong style={{ fontSize: '1rem', color: 'var(--color-primary)', display: 'block', marginBottom: '6px' }}>
                      {offering.title}
                    </strong>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      {offering.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* FAQs Section for Active Service */}
              <div
                className="card-base"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '2rem',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <h4 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={20} color="var(--color-secondary)" />
                  <span>Frequently Asked Questions</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {activeService.faqs.map((faq, idx) => (
                    <div key={idx} style={{ borderBottom: idx !== activeService.faqs.length - 1 ? '1px solid var(--color-border-light)' : 'none', paddingBottom: idx !== activeService.faqs.length - 1 ? '1rem' : 0 }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)', display: 'block', marginBottom: '4px' }}>
                        {faq.q}
                      </strong>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual & Direct Contact Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Feature Visual */}
              <div
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--color-border)',
                  position: 'relative'
                }}
              >
                <img
                  src={activeService.heroImage}
                  alt={activeService.title}
                  style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    backgroundColor: 'rgba(18, 48, 74, 0.92)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 700 }}>
                      Verified Service
                    </span>
                    <strong style={{ fontSize: '0.925rem', display: 'block' }}>
                      Govt. UDYAM & Trade Licensed
                    </strong>
                  </div>
                  <ShieldCheck size={24} color="#25D366" />
                </div>
              </div>

              {/* Direct Booking & Team Contact Card */}
              <div
                className="card-base"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '2rem',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '2px solid var(--color-secondary-subtle)'
                }}
              >
                <span className="eyebrow eyebrow-teal" style={{ marginBottom: '0.5rem' }}>
                  Direct Lead Contact
                </span>

                <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                  Connect with Team Journey Architect
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                  Get instantaneous quotation, availability check, and expert planning advice.
                </p>

                {/* Lead Contact info */}
                <div
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '1.5rem',
                    border: '1px solid var(--color-border-light)'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                    Service Coordinator
                  </div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)', display: 'block' }}>
                    {activeService.leadContact.name}
                  </strong>
                  <div style={{ fontSize: '0.95rem', color: 'var(--color-secondary)', fontWeight: 700, marginTop: '2px' }}>
                    Direct No: {activeService.leadContact.phone}
                  </div>

                  {activeService.leadContact.alternatePhones && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Alt: {activeService.leadContact.alternatePhones.join(' / ')}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      const el = document.getElementById('enquiry-form-section');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else if (onOpenTripPlanner) {
                        onOpenTripPlanner(activeService.id);
                      }
                    }}
                    icon={<Sparkles size={16} />}
                    style={{ width: '100%' }}
                  >
                    Request Instant Quotation
                  </Button>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <Button
                      variant="whatsapp"
                      href={getWhatsAppUrl(`Hello Journey Architect, I want to enquire about ${activeService.title}.`, activeService.leadContact.phone)}
                      target="_blank"
                      icon={<MessageCircle size={16} />}
                    >
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      href={getPhoneCallUrl(activeService.leadContact.phone)}
                      icon={<Phone size={16} />}
                    >
                      Call Now
                    </Button>
                  </div>
                </div>

                {/* Office Note */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <MapPin size={15} color="var(--color-secondary)" />
                  <span>Office: Elgin 1, New Batanagar Road, Maheshtala, Batanagar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cuisine We Serve Section (Categorized Food Gallery) */}
          {(activeService.slug === 'catering' || activeService.slug === 'catering-services') && (
            <CuisineWeServeSection />
          )}

          {/* Dedicated Service Enquiry Section */}
          <div style={{ marginTop: '4.5rem', paddingTop: '3.5rem', borderTop: '2px dashed var(--color-border)' }} id="enquiry-form-section">
            <SectionHeading
              eyebrow={(activeService.slug === 'catering' || activeService.slug === 'catering-services') ? "Live Catering Booking" : (activeService.slug === 'car-rental' ? "Commercial Fleet Booking" : "Customized Holiday Planning")}
              eyebrowVariant="amber"
              title={(activeService.slug === 'catering' || activeService.slug === 'catering-services') ? "Book / Enquire About Catering Services" : (activeService.slug === 'car-rental' ? "Request Commercial Car Rental & Cab" : "Plan Your Tour Package")}
              subtitle={(activeService.slug === 'catering' || activeService.slug === 'catering-services') ? "Fill in your celebration date, guest count, and menu style for direct consultation with Executive Chef Dipankar Mitra." : (activeService.slug === 'car-rental' ? "Enter your travel dates, route, and preferred car type for guaranteed availability and verified transparent tariff." : "Connect with our founders for personalized sightseeing itineraries and verified hotel accommodations.")}
            />

            <div style={{ maxWidth: '960px', margin: '2.5rem auto 0 auto' }}>
              {(activeService.slug === 'catering' || activeService.slug === 'catering-services') && <CateringEnquiryForm />}
              {activeService.slug === 'car-rental' && <CarRentalEnquiryForm />}
              {activeService.slug !== 'catering' && activeService.slug !== 'catering-services' && activeService.slug !== 'car-rental' && (
                <div style={{ textAlign: 'center', backgroundColor: '#FFFFFF', padding: '3.5rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                    <Sparkles size={28} />
                  </div>
                  <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                    Personalized Holiday & Tour Itineraries
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', maxWidth: '540px', margin: '0 auto 1.75rem', lineHeight: 1.6, fontSize: '1rem' }}>
                    Browse our curated weekly and long-distance tour packages, or let our founder Sudipta tailor a unique journey designed around your family or group.
                  </p>
                  <div style={{ display: 'inline-flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => onOpenTripPlanner && onOpenTripPlanner(activeService.id)}
                      icon={<Sparkles size={16} />}
                    >
                      Open Trip Planner
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => navigate('/tours')}
                      icon={<ArrowRight size={16} />}
                    >
                      Browse Tour Packages
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default ServicesDetailPage;
