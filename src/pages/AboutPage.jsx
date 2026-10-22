import React from 'react';
import { MapPin, HeartHandshake, ShieldCheck, Sparkles, Send, CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Button } from '../components/common/Button';
import { SectionHeading } from '../components/common/SectionHeading';
import { BUSINESS_CONFIG, getWhatsAppUrl } from '../config/businessConfig';

export function AboutPage({ onOpenTripPlanner }) {
  return (
    <>
      <SEOHead
        title="About Us & Leadership Team | Journey Architect"
        description="Learn about Journey Architect. Meet Founder Sudipta, Co-Founder Dipankar Mitra, Soham Chowdhury, and check our MSME registration."
        path="/about"
      />

      {/* Page Header Banner */}
      <div className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-nav">
            <a href="/">Home</a>
            <span>/</span>
            <span>About Journey Architect</span>
          </div>

          <span className="eyebrow eyebrow-amber">
            Our Story & Leadership
          </span>

          <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.25rem)' }}>
            A Trusted Local Partner for Travel, Car Rental & Catering
          </h1>

          <p>
            Based at Tower 02, Elgin 1, New Batanagar Road, Maheshtala, Batanagar, West Bengal, Journey Architect is focused on turning holiday ideas, road journeys, and special occasions into practical, well-planned, and memorable experiences.
          </p>
        </div>
      </div>

      {/* Main Story Section */}
      <section className="section-padding bg-warm">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(2.5rem, 5vw, 4.5rem)',
              alignItems: 'center'
            }}
          >
            <div>
              <span className="eyebrow eyebrow-teal">
                Our Local Roots
              </span>

              <h2 className="section-title" style={{ color: 'var(--color-primary)', marginTop: '0.5rem' }}>
                Making Travel Planning Personal & Stress-Free
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                <p>
                  Every good journey begins long before the suitcase is packed. It starts with choosing the right destination, understanding the travel routes, selecting comfortable stays, and having someone experienced you can speak with when you need guidance.
                </p>
                <p>
                  <strong>{BUSINESS_CONFIG.name}</strong> was established to serve travelers in the Bongaon and surrounding North 24 Parganas area who prefer a warm, personalized travel-planning experience over complicated, faceless online booking algorithms.
                </p>
                <p>
                  Whether you are planning an annual family vacation to the Himalayan foothills, a weekend beach break, commercial cab booking for Kolkata airport, or event catering for a group picnic, our goal is to understand your unique preferences and build an arrangement that suits your schedule, comfort, and budget.
                </p>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button
                  variant="primary"
                  onClick={onOpenTripPlanner}
                  icon={<Send size={16} />}
                >
                  Plan Your Trip With Us
                </Button>
                <Button
                  variant="whatsapp"
                  href={getWhatsAppUrl()}
                  target="_blank"
                  icon={<MessageCircle size={16} />}
                >
                  Message on WhatsApp
                </Button>
              </div>
            </div>

            {/* Visual Image Grid */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--color-border)',
                  aspectRatio: '4 / 3'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80"
                  alt="High mountain viewpoint in Sikkim"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Location Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '20px',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-primary)',
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  maxWidth: '300px',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <MapPin size={18} color="var(--color-secondary)" />
                  <strong style={{ fontSize: '0.9375rem' }}>Local Office Presence</strong>
                </div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                  <strong>Head Office:</strong> Tower 02, Flat No - 6B3, Elgin 1, New Batanagar Road, Maheshtala, Batanagar - 700140<br />
                  <strong>Branch Office:</strong> P-23, Michael nagar , Kolkata - 700 133
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <SectionHeading
            eyebrow="Our Commitments"
            eyebrowVariant="amber"
            title="How We Approach Your Journey"
            subtitle="Four guiding principles that shape every travel itinerary, car rental trip, and catering service."
          />

          <div className="grid-2">
            <div className="card-base" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HeartHandshake size={22} />
                </div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', margin: 0 }}>
                  Human & Personal Consultation
                </h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
                We believe the best holiday planning happens through direct conversation. We take the time to listen to your preferences, budget range, and special needs before proposing an itinerary.
              </p>
            </div>

            <div className="card-base" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} />
                </div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', margin: 0 }}>
                  Transparent & Clear Details
                </h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
                No ambiguous claims or hidden exclusions. We provide an itemized explanation of stays, transport arrangements, catering menus, and sightseeing schedules upfront.
              </p>
            </div>

            <div className="card-base" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-alpha15)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={22} />
                </div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', margin: 0 }}>
                  3-in-1 Complete Solution
                </h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
                Tour packages, clean commercial car rentals, and delicious live catering — all coordinated under one trustworthy roof without third-party commission markups.
              </p>
            </div>

            <div className="card-base" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-whatsapp-light)', color: 'var(--color-whatsapp-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={22} />
                </div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', margin: 0 }}>
                  Accessible & Responsive Team
                </h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
                Being locally based at Elgin 1, New Batanagar Road, Batanagar means you have dependable founders and coordinators nearby who are easily reachable via WhatsApp, phone, or in person.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Core Team Section */}
      <section className="section-padding bg-warm" id="leadership">
        <div className="container">
          <SectionHeading
            eyebrow="Key People & Leadership"
            eyebrowVariant="teal"
            title="Meet Our Core Team & Leadership"
            subtitle="Directly accountable, deeply experienced, and committed to giving you the best travel, transport, and culinary experience."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              marginTop: '2.5rem'
            }}
          >
            {/* 1st Leader: Sudipta — Founder & Owner */}
            <div
              className="card-base"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1.5px solid var(--color-border)',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              {/* Photo & Badge Container */}
              <div style={{ position: 'relative', width: '100%', height: '340px', backgroundColor: '#0E2235', overflow: 'hidden' }}>
                <img
                  src="/team/sudipta-nandi.png"
                  alt="Sudipta — Founder & Owner, Journey Architect"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(14, 34, 53, 0.75) 100%)' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(244, 163, 64, 0.95)',
                    color: '#0E2235',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  Founder & Owner
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', margin: '0 0 4px 0', fontWeight: 800 }}>
                  Sudipta
                </h3>
                <span style={{ fontSize: '0.95rem', color: 'var(--color-secondary)', fontWeight: 700, marginBottom: '1.25rem' }}>
                  Founder & Owner, Journey Architect
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                  <p style={{ margin: 0 }}>
                    Sudipta is the founder of <strong>Journey Architect</strong>, a travel, transport and catering company that designs journeys from the first plan to the last mile. With a background in hospitality and property management, he combines hands-on experience in looking after guests with a deep understanding of what travellers truly need.
                  </p>
                  <p style={{ margin: 0 }}>
                    Through Journey Architect, Sudipta offers curated weekly, short and long trip packages, train and flight ticket booking, reliable car and transport services in and around Kolkata, and event catering.
                  </p>
                  <p style={{ margin: 0 }}>
                    He is committed to building lasting partnerships with hotel, homestay and car owners across India, so that every guest enjoys a smooth, comfortable and memorable journey.
                  </p>
                </div>

                {/* Contact Box */}
                <div style={{ backgroundColor: 'var(--color-bg)', padding: '14px 16px', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--color-border-light)' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Direct Contact Lines:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <a href="tel:+917980331022" style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem', textDecoration: 'none' }}>
                      📞 79803 31022 <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 600 }}>(Primary / WhatsApp)</span>
                    </a>
                    <a href="tel:+919830354307" style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.9rem', textDecoration: 'none' }}>
                      📞 98303 54307
                    </a>
                    <a href="tel:+918240112378" style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.9rem', textDecoration: 'none' }}>
                      📞 82401 12378
                    </a>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <Button
                    variant="whatsapp"
                    size="sm"
                    href="https://wa.me/917980331022?text=Hello%20Sudipta,%20I%20want%20to%20discuss%20a%20tour%20plan%20with%20Journey%20Architect."
                    target="_blank"
                    icon={<MessageCircle size={15} />}
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    href="tel:+917980331022"
                    icon={<Phone size={15} />}
                  >
                    Call Sudipta
                  </Button>
                </div>
              </div>
            </div>

            {/* 2nd Leader: Dipankar Mitra — Co-Founder & Executive Chef */}
            <div
              className="card-base"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1.5px solid var(--color-border)',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              {/* Photo & Badge Container */}
              <div style={{ position: 'relative', width: '100%', height: '340px', backgroundColor: '#0E2235', overflow: 'hidden' }}>
                <img
                  src="/team/dipankar-mitra.png"
                  alt="Dipankar Mitra — Co-Founder & Executive Chef"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(14, 34, 53, 0.75) 100%)' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: 'var(--color-secondary)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  Co-Founder & Executive Chef
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', margin: '0 0 4px 0', fontWeight: 800 }}>
                  Dipankar Mitra
                </h3>
                <span style={{ fontSize: '0.95rem', color: 'var(--color-secondary)', fontWeight: 700, marginBottom: '1.25rem' }}>
                  Co-Founder & Executive Chef
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  <p style={{ margin: 0 }}>
                    With a background in hotel management and decades of hands-on experience in professional kitchens across India and abroad, <strong>Dipankar Mitra</strong> brings a rare blend of culinary artistry and hospitality expertise to Journey Architect.
                  </p>
                  <p style={{ margin: 0 }}>
                    A chef at heart, Dipankar has cooked for guests of every taste and culture, and he believes great food is the soul of every journey and every celebration. His years in the industry have taught him that exceptional hospitality lies in the details: fresh ingredients, honest flavours, and genuine warmth.
                  </p>
                  <p style={{ margin: 0 }}>
                    Today, he also runs his own restaurant, <strong>23 Spice Lane</strong>, where his passion for authentic, beautifully crafted food comes to life.
                  </p>
                  <p style={{ margin: 0 }}>
                    As co-founder of Journey Architect, Dipankar leads our catering services and shapes the food experience for our travellers and event guests, ensuring every meal is memorable.
                  </p>
                </div>

                {/* Quote Highlight */}
                <div style={{ backgroundColor: 'rgba(22, 124, 128, 0.08)', borderLeft: '4px solid var(--color-secondary)', padding: '12px 16px', borderRadius: '4px', marginBottom: '1.5rem', fontStyle: 'italic', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.92rem' }}>
                  "Good food turns a trip into a memory and a gathering into a celebration."
                </div>

                {/* Contact Box */}
                <div style={{ backgroundColor: 'var(--color-bg)', padding: '14px 16px', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--color-border-light)' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Direct Contact Line:
                  </span>
                  <a href="tel:+919563395633" style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.05rem', textDecoration: 'none', display: 'block' }}>
                    📞 95633 95633 <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 600 }}>(Direct & WhatsApp)</span>
                  </a>
                </div>

                <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <Button
                    variant="whatsapp"
                    size="sm"
                    href="https://wa.me/919563395633?text=Hello%20Dipankar%20da,%20I%20want%20to%20enquire%20about%20catering%20and%20travel%20services%20with%20Journey%20Architect."
                    target="_blank"
                    icon={<MessageCircle size={15} />}
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    href="tel:+919563395633"
                    icon={<Phone size={15} />}
                  >
                    Call Dipankar
                  </Button>
                </div>
              </div>
            </div>

            {/* 3rd Team Member: Soham Chowdhury — Sales & Business Development Executive */}
            <div
              className="card-base"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1.5px solid var(--color-border)',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              {/* Photo & Badge Container */}
              <div style={{ position: 'relative', width: '100%', height: '340px', backgroundColor: '#0E2235', overflow: 'hidden' }}>
                <img
                  src="/team/soham-chowdhury.jpg"
                  alt="Soham Chowdhury — Sales & Business Development Executive"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(14, 34, 53, 0.75) 100%)' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: '#0E8388',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  Sales & Business Development
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', margin: '0 0 4px 0', fontWeight: 800 }}>
                  Soham Chowdhury
                </h3>
                <span style={{ fontSize: '0.95rem', color: 'var(--color-secondary)', fontWeight: 700, marginBottom: '1.25rem' }}>
                  Sales & Business Development Executive
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  <p style={{ margin: 0 }}>
                    Soham plays a pivotal role in driving guest outreach and business development at <strong>Journey Architect</strong>. With a strong focus on understanding travelers’ distinct aspirations, he bridges personalized travel planning with seamless on-ground coordination.
                  </p>
                  <p style={{ margin: 0 }}>
                    Soham is dedicated to delivering transparent communication, prompt assistance, and tailored solutions—ensuring that every Journey Architect itinerary begins with clarity, reliability, and warm hospitality.
                  </p>
                </div>

                {/* Focus Areas Box */}
                <div style={{ backgroundColor: 'var(--color-bg)', padding: '14px 16px', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--color-border-light)' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Key Focus Areas:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                    <span>✨ Guest Outreach & Personalized Itineraries</span>
                    <span>🤝 Corporate & Group Tour Partnerships</span>
                    <span>📍 End-to-End On-Ground Coordination</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <Button
                    variant="whatsapp"
                    size="sm"
                    href="https://wa.me/917980331022?text=Hello%20Soham,%20I%20would%20like%20to%20connect%20regarding%20travel%20planning%20and%20packages%20with%20Journey%20Architect."
                    target="_blank"
                    icon={<MessageCircle size={15} />}
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenTripPlanner}
                    icon={<Send size={15} />}
                  >
                    Plan A Trip
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Legal Registrations & Trade License Section */}
      <section className="section-padding bg-white">
        <div className="container" style={{ maxWidth: '960px' }}>
          <div
            className="card-base"
            style={{
              padding: 'clamp(2rem, 4vw, 3rem)',
              backgroundColor: '#FFFFFF',
              border: '2px solid var(--color-secondary)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', margin: 0 }}>
                    Government Registrations & Verification
                  </h3>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    Fully Licensed Tour Operator, Transport & Catering Business
                  </span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(37, 211, 102, 0.12)',
                  color: '#15803d',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle2 size={16} />
                <span>Govt. Verified Entity</span>
              </div>
            </div>

            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Journey Architect is officially recognized under the Ministry of Micro, Small and Medium Enterprises (MSME), Government of India, and operates under a valid West Bengal Municipal Trade License.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {/* Trade License Card */}
              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.06em', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Official Trade License Number
                </span>
                <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.03em' }}>
                  {BUSINESS_CONFIG.tradeLicenseNo}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  West Bengal Municipal Authority Registration
                </div>
              </div>

              {/* UDYAM MSME Registration Card */}
              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.06em', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  UDYAM MSME Registration Number
                </span>
                <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '0.03em' }}>
                  {BUSINESS_CONFIG.udyamRegistrationNo}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Ministry of MSME, Government of India
                </div>
              </div>
            </div>

            {/* Address & Presence Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', fontWeight: 700 }}>Registered Name</span>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginTop: '2px' }}>{BUSINESS_CONFIG.name}</div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', fontWeight: 700 }}>Registered Office</span>
                <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginTop: '2px' }}>Elgin 1, New Batanagar Road</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Maheshtala, Batanagar, WB 700140</div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', fontWeight: 700 }}>Verified Services</span>
                <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginTop: '2px' }}>Tour & Travel, Car Rental, Catering</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>All-India Permits & Operations</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default AboutPage;
