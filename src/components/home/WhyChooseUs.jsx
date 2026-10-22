import React from 'react';
import { MapPin, SlidersHorizontal, MessageSquare, PhoneCall } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

const PILLARS = [
  {
    id: "local-assistance",
    title: "Local Assistance",
    description: "Get in touch directly and discuss your travel requirements with a local travel team based right in the Bongaon area.",
    icon: MapPin,
    iconBg: "var(--color-secondary-subtle)",
    iconColor: "var(--color-secondary)"
  },
  {
    id: "flexible-planning",
    title: "Flexible Planning",
    description: "Your destination, dates and personal preferences come first. We work together to shape a schedule that suits your group.",
    icon: SlidersHorizontal,
    iconBg: "var(--color-accent-light)",
    iconColor: "var(--color-accent-dark)"
  },
  {
    id: "clear-communication",
    title: "Clear Communication",
    description: "Understand the important details of your travel plan, stays, vehicles, and inclusions before making any confirmation.",
    icon: MessageSquare,
    iconBg: "var(--color-primary-alpha15)",
    iconColor: "var(--color-primary)"
  },
  {
    id: "easy-enquiry",
    title: "Easy Enquiry",
    description: "Send your requirements seamlessly through WhatsApp, phone, or our online form with fast, helpful responses.",
    icon: PhoneCall,
    iconBg: "var(--color-whatsapp-light)",
    iconColor: "var(--color-whatsapp-dark)"
  }
];

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-warm" id="why-choose-us">
      <div className="container">
        <SectionHeading
          eyebrow="Why Plan With Journey Architect?"
          eyebrowVariant="amber"
          title="Travel Planning, With a Personal Touch."
          subtitle="Travel planning should feel exciting — not complicated. We focus on personal communication, honest guidance, and reliable organization."
        />

        <div className="grid-4">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="card-base card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2rem 1.75rem'
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: pillar.iconBg,
                    color: pillar.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}
                >
                  <Icon size={24} />
                </div>

                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                  {pillar.title}
                </h3>

                <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
