import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { Hero } from '../components/home/Hero';
import { TrustStrip } from '../components/home/TrustStrip';
import { ServicesSection } from '../components/home/ServicesSection';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { AboutTeaser } from '../components/home/AboutTeaser';
import { PopularDestinations } from '../components/home/PopularDestinations';
import { HowItWorks } from '../components/home/HowItWorks';
import { HomeGallery } from '../components/home/HomeGallery';
import { HomeBlogSection } from '../components/home/HomeBlogSection';
import { TrustAndFAQSection } from '../components/home/TrustAndFAQSection';
import { FinalCTA } from '../components/home/FinalCTA';

export function HomePage({ onOpenTripPlanner, navigate }) {
  return (
    <>
      <SEOHead
        title="Journey Architect | Tour Operator, Car Rental & Catering"
        description="Plan your holiday with Journey Architect. Tour packages, reliable car rental, and premium catering services for groups and events."
        path="/"
      />

      <div className="homepage-content">
        {/* Section 1: Hero */}
        <Hero onOpenTripPlanner={onOpenTripPlanner} navigate={navigate} />

        {/* Section 2: Trust Strip */}
        <TrustStrip />

        {/* Section 3: Core Services (Tour & Travel, Car Rental, Catering) */}
        <ServicesSection onOpenTripPlanner={onOpenTripPlanner} navigate={navigate} />

        {/* Section 4: Why Choose Journey Architect */}
        <WhyChooseUs />

        {/* Section 5: About Teaser */}
        <AboutTeaser navigate={navigate} onOpenTripPlanner={onOpenTripPlanner} />

        {/* Section 6: Popular Destinations */}
        <PopularDestinations onOpenTripPlanner={onOpenTripPlanner} navigate={navigate} />

        {/* Section 7: Process / How It Works */}
        <HowItWorks />

        {/* Section 8: Gallery Preview */}
        <HomeGallery navigate={navigate} />

        {/* Section 9: Latest Travel Blogs (3 on scroll) */}
        <HomeBlogSection navigate={navigate} onOpenTripPlanner={onOpenTripPlanner} />

        {/* Section 10: Reviews & FAQs Side-by-Side */}
        <TrustAndFAQSection navigate={navigate} />

        {/* Section 10: Final CTA */}
        <FinalCTA onOpenTripPlanner={onOpenTripPlanner} />
      </div>
    </>
  );
}

