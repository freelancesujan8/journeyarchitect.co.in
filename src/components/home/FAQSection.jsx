import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { FAQS_DATA } from '../../data/faqsData';

export function FAQSection({ navigate, limit = 6 }) {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const displayFaqs = limit ? FAQS_DATA.slice(0, limit) : FAQS_DATA;

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-padding bg-warm" id="faq-section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <SectionHeading
          eyebrow="Clear & Honest Answers"
          eyebrowVariant="teal"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about planning, customizing, and booking your next journey with Journey Architect."
        />

        <div className="faq-list">
          {displayFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  id={`faq-btn-${faq.id}`}
                >
                  <span>{faq.question}</span>
                  <div className="faq-icon-wrapper">
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-btn-${faq.id}`}
                    className="faq-answer animate-fade-in"
                  >
                    <p style={{ margin: 0 }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {limit && limit < FAQS_DATA.length && (
          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <Button
              variant="outline"
              onClick={() => {
                navigate('/faq');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              icon={<ArrowRight size={16} />}
            >
              View All Travel FAQs
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
