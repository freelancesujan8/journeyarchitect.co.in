import React, { useEffect } from 'react';
import { BUSINESS_CONFIG } from '../../config/businessConfig';

export function SEOHead({
  title,
  description,
  path = '/'
}) {
  const siteTitle = title 
    ? `${title} | ${BUSINESS_CONFIG.name}`
    : `${BUSINESS_CONFIG.name} | ${BUSINESS_CONFIG.tagline}`;

  const siteDescription = description || 
    `Plan your next holiday with ${BUSINESS_CONFIG.name}. Explore customized tour packages, car rentals, and event catering services.`;

  useEffect(() => {
    // Update Page Title
    document.title = siteTitle;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', siteDescription);
    }

    // Update OpenGraph Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', siteTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', siteDescription);

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://journeyarchitect.in${path}`);

    // Update Structured Data JSON-LD
    let scriptTag = document.getElementById('journeyarchitect-schema-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'journeyarchitect-schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": BUSINESS_CONFIG.name,
      "description": siteDescription,
      "url": "https://journeyarchitect.in",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Tower 02, Flat No - 6B3, Elgin 1, New Batanagar Road",
        "addressLocality": "Maheshtala, Batanagar",
        "addressRegion": "West Bengal",
        "postalCode": "700140",
        "addressCountry": "IN"
      },
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "Kolkata, Batanagar, West Bengal & Pan-India"
      },
      "sameAs": [
        BUSINESS_CONFIG.facebookUrl
      ].filter(Boolean)
    };

    scriptTag.textContent = JSON.stringify(schemaData);
  }, [siteTitle, siteDescription, path]);

  return null;
}

export default SEOHead;
