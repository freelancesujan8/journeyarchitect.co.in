import React, { useState } from 'react';
import { Search, ChevronDown, MessageCircle, Send, HelpCircle } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Button } from '../components/common/Button';
import { FAQS_DATA } from '../data/faqsData';
import { BUSINESS_CONFIG, getWhatsAppUrl } from '../config/businessConfig';

export function FAQPage({ onOpenTripPlanner }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs = FAQS_DATA.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SEOHead
        title="Frequently Asked Questions (FAQ)"
        description="Find answers to common questions about tour planning, customized packages, hotel inclusions, and travel booking with Journey Architect."
        path="/faq"
      />

      {/* Page Banner */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-nav">
            <a href="/">Home</a>
            <span>/</span>
            <span>FAQ</span>
          </div>

          <span className="eyebrow eyebrow-amber">
            Help & Guidance
          </span>

          <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.25rem)' }}>
            Frequently Asked Questions
          </h1>

          <p>
            Got questions about planning your holiday, customized itineraries, or booking with Journey Architect? Find clear, honest answers below.
          </p>
        </div>
      </div>

      {/* Main FAQ Section */}
      <section className="section-padding bg-warm">
        <div className="container" style={{ maxWidth: '860px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search travel questions (e.g. customized, hotels, office location, dates...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: '48px',
                paddingTop: '14px',
                paddingBottom: '14px',
                fontSize: '1.05rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#FFFFFF',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
          </div>

          {/* Accordion List */}
          {filteredFaqs.length > 0 ? (
            <div className="faq-list">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={faq.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                    <button
                      type="button"
                      className="faq-button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-page-answer-${faq.id}`}
                      id={`faq-page-btn-${faq.id}`}
                    >
                      <span>{faq.question}</span>
                      <div className="faq-icon-wrapper">
                        <ChevronDown size={18} />
                      </div>
                    </button>

                    {isOpen && (
                      <div
                        id={`faq-page-answer-${faq.id}`}
                        role="region"
                        aria-labelledby={`faq-page-btn-${faq.id}`}
                        className="faq-answer animate-fade-in"
                      >
                        <p style={{ margin: 0, fontSize: '0.975rem', lineHeight: 1.65 }}>
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)'
              }}
            >
              <HelpCircle size={40} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                No matching questions found
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
                Feel free to ask our team directly on WhatsApp or submit a quick enquiry.
              </p>
              <Button
                variant="whatsapp"
                href={getWhatsAppUrl()}
                target="_blank"
                icon={<MessageCircle size={16} />}
              >
                Ask on WhatsApp
              </Button>
            </div>
          )}

          {/* Still Have Questions Box */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(2rem, 4vw, 3rem)',
              marginTop: '3.5rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Still have a specific question about your trip?
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              We're here to help you understand all the details before planning. Connect directly with our team.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                onClick={onOpenTripPlanner}
                icon={<Send size={16} />}
              >
                Send Trip Enquiry
              </Button>
              <Button
                variant="whatsapp"
                href={getWhatsAppUrl()}
                target="_blank"
                icon={<MessageCircle size={16} />}
              >
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
