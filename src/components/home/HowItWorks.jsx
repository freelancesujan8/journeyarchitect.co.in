import React from 'react';
import { MessageSquare, FileCheck2, CheckCircle2, Luggage } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

const STEPS = [
  {
    stepNumber: "01",
    title: "Tell Us Your Plan",
    description: "Share your destination idea, approximate travel dates, and number of travelers through our website, WhatsApp, or phone.",
    icon: MessageSquare
  },
  {
    stepNumber: "02",
    title: "Discuss Your Options",
    description: "We'll understand your group's preferences, budget, and recommend comfortable hotel categories, routes, and schedules.",
    icon: FileCheck2
  },
  {
    stepNumber: "03",
    title: "Confirm Your Trip",
    description: "Review the finalized itinerary, clarify any questions about inclusions or timing, and confirm your plan with complete clarity.",
    icon: CheckCircle2
  },
  {
    stepNumber: "04",
    title: "Get Ready to Travel",
    description: "Receive your trip details and coordination support, pack your bags, and get ready to enjoy a relaxing, memorable journey.",
    icon: Luggage
  }
];

export function HowItWorks() {
  return (
    <section className="section-padding bg-white" id="how-it-works">
      <div className="container">
        <SectionHeading
          eyebrow="Easy 4-Step Process"
          eyebrowVariant="amber"
          title="Planning Your Trip Is Simple"
          subtitle="From your initial destination idea to getting your bags packed, our transparent planning process keeps everything organized and stress-free."
        />

        <div className="grid-4" style={{ position: 'relative' }}>
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="card-base"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2.25rem 1.75rem',
                  position: 'relative'
                }}
              >
                {/* Step Number Top Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-primary-alpha15)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.75rem',
                      color: 'var(--color-accent)',
                      fontWeight: 400
                    }}
                  >
                    {step.stepNumber}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                  {step.title}
                </h3>

                <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
