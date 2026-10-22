import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, Navigation, ExternalLink, ShieldCheck, FileText, Eye, X } from 'lucide-react';
import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon } from '../components/common/SocialIcons';
import { SEOHead } from '../components/common/SEOHead';
import { TripEnquiryForm } from '../components/forms/TripEnquiryForm';
import { Button } from '../components/common/Button';
import { BUSINESS_CONFIG, getWhatsAppUrl, getPhoneCallUrl } from '../config/businessConfig';
import { ApiClient } from '../api/client';

const CERTIFICATES = [
  {
    fileName: "Journey Architect Company Profile (1).pdf",
    title: "Journey Architect Company Profile (1).pdf",
    subtitle: "Official Company Profile & Tour Portfolio",
    url: "/certificates/Journey%20Architect%20Company%20Profile%20(1).pdf"
  },
  {
    fileName: "MSME _ Udyam Registration Certificate.pdf",
    title: "MSME _ Udyam Registration Certificate.pdf",
    subtitle: "Ministry of MSME, Govt. of India Registration",
    url: "/certificates/MSME%20_%20Udyam%20Registration%20Certificate.pdf"
  },
  {
    fileName: "P.TAX Certificate of Enrolment.pdf",
    title: "P.TAX Certificate of Enrolment.pdf",
    subtitle: "Professional Tax Enrolment, Govt. of West Bengal",
    url: "/certificates/P.TAX%20Certificate%20of%20Enrolment.pdf"
  }
];

export function ContactPage() {
  const [contact, setContact] = useState(null);
  const [activePdfModal, setActivePdfModal] = useState(null);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activePdfModal) {
        setActivePdfModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePdfModal]);

  // Lock body scroll
  useEffect(() => {
    if (activePdfModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activePdfModal]);

  useEffect(() => {
    let isMounted = true;
    async function loadContact() {
      try {
        const res = await ApiClient.getContactSettings();
        if (isMounted && res && res.contact) {
          setContact(res.contact);
        }
      } catch (err) {
        console.warn('ContactPage: Using fallback contact config:', err);
      }
    }
    loadContact();
    return () => { isMounted = false; };
  }, []);

  const founderName = contact?.founder_name || "Sudipta Nandi";
  const founderPhone = contact?.founder_phone || "79803 31022";
  const founderPhoneAlt = contact?.founder_phone_alt || "98303 54307, 82401 12378";
  const cofounderName = contact?.cofounder_name || "Dipankar Mitra";
  const cofounderPhone = contact?.cofounder_phone || "95633 95633";

  const officeAddress = contact?.address_full || BUSINESS_CONFIG.address;
  const branchAddress = contact?.branch_address || BUSINESS_CONFIG.branchAddress || "P-23, Michael nagar , Kolkata - 700 133";
  const tradeLic = contact?.trade_license_no || BUSINESS_CONFIG.tradeLicenseNo;
  const udyamNo = contact?.udyam_registration_no || BUSINESS_CONFIG.udyamRegistrationNo;
  const primaryEmail = contact?.email_primary || BUSINESS_CONFIG.email;
  const mapEmbed = contact?.google_map_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.8521039864223!2d88.225574!3d22.496587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02796075908b9b%3A0x6b09312521c379a!2sBatanagar%2C%20Maheshtala%2C%20West%20Bengal%20700140!5e0!3m2!1sen!2sin!4v1700000000000";
  return (
    <>
      <SEOHead
        title="Contact Us & Office Location"
        description="Get in touch with Journey Architect. Contact via phone, WhatsApp, or visit our office at Elgin 1, New Batanagar Road, Maheshtala, Batanagar, West Bengal."
        path="/contact"
      />

      {/* Page Banner */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-nav">
            <a href="/">Home</a>
            <span>/</span>
            <span>Contact</span>
          </div>

          <span className="eyebrow eyebrow-amber">
            Get In Touch
          </span>

          <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.25rem)' }}>
            Contact Journey Architect
          </h1>

          <p>
            Have a question or ready to discuss your next holiday? Reach out to our team via WhatsApp, phone, or our online enquiry form.
          </p>
        </div>
      </div>

      {/* Main Contact Section */}
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
            {/* Left Column: Contact Cards & Office Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div
                className="card-base"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: 'clamp(2rem, 4vw, 2.5rem)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                  Office & Team Contact Information
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Head Office Address */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)', display: 'block', marginBottom: '2px' }}>
                        Head Office Address
                      </strong>
                      <span style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                        {officeAddress}
                      </span>
                    </div>
                  </div>

                  {/* Branch Office Address */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(244, 163, 64, 0.18)', color: 'var(--color-accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)', display: 'block', marginBottom: '2px' }}>
                        Branch Office Address
                      </strong>
                      <span style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                        {branchAddress}
                      </span>
                    </div>
                  </div>

                  {/* Founder & Tour Contact */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', backgroundColor: 'var(--color-bg)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                          Founder: {founderName}
                        </strong>
                        <span style={{ fontSize: '0.72rem', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent-dark)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Tour Packages
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
                        <a href={`tel:+91${founderPhone.replace(/\D/g, '')}`} style={{ fontSize: '0.925rem', color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
                          📞 {founderPhone} <span style={{ fontSize: '0.75rem', color: 'var(--color-whatsapp-dark)' }}>(WhatsApp)</span>
                        </a>
                        {founderPhoneAlt && (
                          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            📞 {founderPhoneAlt}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Co-Founder Contact */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', backgroundColor: 'var(--color-bg)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                          Co-Founder: {cofounderName}
                        </strong>
                        <span style={{ fontSize: '0.72rem', backgroundColor: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Catering & Operations
                        </span>
                      </div>
                      <a href={`tel:+91${cofounderPhone.replace(/\D/g, '')}`} style={{ fontSize: '0.925rem', color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none', display: 'block', marginTop: '4px' }}>
                        📞 {cofounderPhone} <span style={{ fontSize: '0.75rem', color: 'var(--color-whatsapp-dark)' }}>(WhatsApp)</span>
                      </a>
                    </div>
                  </div>


                  {/* Email & Hours */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      <Mail size={16} color="var(--color-secondary)" />
                      <span>{primaryEmail}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      <Clock size={16} color="var(--color-secondary)" />
                      <span>{BUSINESS_CONFIG.openingHours}</span>
                    </div>
                  </div>

                  {/* License & MSME Strip */}
                  <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-secondary-subtle)', border: '1px solid rgba(22, 124, 128, 0.25)', fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                    <div style={{ fontWeight: 700, marginBottom: '2px' }}>
                      Official Registrations:
                    </div>
                    <div>Trade License No.: <strong>{tradeLic}</strong></div>
                    <div>UDYAM (MSME) No.: <strong>{udyamNo}</strong></div>
                  </div>
                </div>

                {/* Social Media Channels */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-light)' }}>
                  <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
                    Connect on Social Media
                  </span>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    {/* Facebook */}
                    <a
                      href={contact?.facebook_url || BUSINESS_CONFIG.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Follow us on Facebook"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(24, 119, 242, 0.08)',
                        color: '#1877F2',
                        textDecoration: 'none',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        border: '1px solid rgba(24, 119, 242, 0.2)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1877F2';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(24, 119, 242, 0.08)';
                        e.currentTarget.style.color = '#1877F2';
                      }}
                    >
                      <FacebookIcon size={18} />
                      <span>Facebook</span>
                    </a>

                    {/* Instagram */}
                    <a
                      href={contact?.instagram_url || BUSINESS_CONFIG.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Follow us on Instagram"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(228, 64, 95, 0.08)',
                        color: '#E4405F',
                        textDecoration: 'none',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        border: '1px solid rgba(228, 64, 95, 0.2)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#E4405F';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(228, 64, 95, 0.08)';
                        e.currentTarget.style.color = '#E4405F';
                      }}
                    >
                      <InstagramIcon size={18} />
                      <span>Instagram</span>
                    </a>

                    {/* X (Twitter) */}
                    <a
                      href={contact?.twitter_url || BUSINESS_CONFIG.xUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Follow us on X"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(15, 20, 25, 0.06)',
                        color: '#0F1419',
                        textDecoration: 'none',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        border: '1px solid rgba(15, 20, 25, 0.15)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#000000';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(15, 20, 25, 0.06)';
                        e.currentTarget.style.color = '#0F1419';
                      }}
                    >
                      <XIcon size={16} />
                      <span>X (Twitter)</span>
                    </a>

                    {/* YouTube */}
                    <a
                      href={contact?.youtube_url || BUSINESS_CONFIG.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Subscribe to our YouTube channel"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(255, 0, 0, 0.08)',
                        color: '#DC2626',
                        textDecoration: 'none',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        border: '1px solid rgba(255, 0, 0, 0.2)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FF0000';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.08)';
                        e.currentTarget.style.color = '#DC2626';
                      }}
                    >
                      <YoutubeIcon size={18} />
                      <span>YouTube</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Official Company Certificates & Verification Card */}
              <div
                className="card-base"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: 'clamp(1.5rem, 3.5vw, 2rem)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--color-border-light)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(22, 124, 128, 0.1)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', margin: 0, fontWeight: 700 }}>
                      Official Registrations & Certificates
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Click "View" to preview official government PDFs in popup modal
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {CERTIFICATES.map((cert) => (
                    <div
                      key={cert.fileName}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border-light)',
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px', flex: 1 }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FileText size={20} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <strong style={{ fontSize: '0.875rem', color: 'var(--color-primary)', display: 'block', wordBreak: 'break-word', overflowWrap: 'break-word', lineHeight: 1.35 }}>
                            {cert.title}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '2px' }}>
                            {cert.subtitle}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setActivePdfModal(cert)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 18px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--color-secondary)',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Card */}
              <div
                className="card-base"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: 'clamp(1.5rem, 3vw, 2rem)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Navigation size={18} color="var(--color-secondary)" />
                  <span>Interactive Map & Directions</span>
                </h3>

                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '240px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    marginBottom: '1rem'
                  }}
                >
                  <iframe
                    title="Journey Architect Office Location Map"
                    src={mapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Located at Elgin 1, New Batanagar Road, Maheshtala, Batanagar, accessible from Kolkata and surrounding areas.
                </p>

                <Button
                  variant="primary"
                  href={BUSINESS_CONFIG.googleMapsUrl}
                  target="_blank"
                  icon={<Navigation size={16} />}
                  style={{ width: '100%' }}
                >
                  Open Directions in Google Maps
                </Button>
              </div>
            </div>

            {/* Right Column: Send Message / Enquiry Form */}
            <div
              className="card-base"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(2rem, 4vw, 2.75rem)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <span className="eyebrow eyebrow-amber" style={{ marginBottom: '0.5rem' }}>
                Direct Contact
              </span>
              <h2 style={{ fontSize: '1.65rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                Send a Message or Travel Enquiry
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                Fill out your details below and we will get back to you promptly with travel guidance.
              </p>

              <TripEnquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* Certificate PDF Popup Modal */}
      {activePdfModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePdfModal.title}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(10, 25, 40, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(0.5rem, 2vw, 2rem)'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActivePdfModal(null);
            }
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '960px',
              width: '100%',
              height: '90vh',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <FileText size={18} color="var(--color-accent)" />
                <span style={{ fontSize: '0.925rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activePdfModal.title}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a
                  href={activePdfModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                  title="Open in new window"
                >
                  <ExternalLink size={14} />
                  <span>Open Fullscreen</span>
                </a>

                <button
                  type="button"
                  onClick={() => setActivePdfModal(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Close PDF viewer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal PDF Viewer Body */}
            <div style={{ flex: 1, position: 'relative', backgroundColor: '#525659' }}>
              <iframe
                src={`${activePdfModal.url}#view=FitH`}
                title={activePdfModal.title}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
