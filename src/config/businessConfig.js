/**
 * Journey Architect — Centralized Business Configuration
 * 
 * IMPORTANT DATA INTEGRITY POLICY:
 * - Verified public facts are stated with exact source attribution.
 * - Unverified operational data (exact phone, WhatsApp number, email, hours, pricing, Google reviews)
 *   are maintained as clearly marked editable placeholders.
 * - DO NOT invent fake data.
 */

export const BUSINESS_CONFIG = {
  // Brand Identity
  name: "Journey Architect",
  category: "Tour Operator, Car Rental & Catering",
  concept: "Journey Begins Here",
  tagline: "Your Complete Travel, Car Rental & Catering Partner.",
  heroSupportingCopy: "Planning a holiday, family vacation, car rental, or catering service? Journey Architect provides complete, reliable, and personalized travel and event services.",
  
  // Leadership & Team Information
  founder: {
    name: "Sudipta Nandi",
    role: "Founder & Tour Director",
    phones: ["79803 31022", "98303 54307", "82401 12378"],
    primaryPhone: "79803 31022",
    whatsapp: "79803 31022"
  },
  coFounder: {
    name: "Dipankar Mitra",
    role: "Co-Founder & Operations Head",
    phones: ["95633 95633"],
    primaryPhone: "95633 95633",
    whatsapp: "95633 95633"
  },
  executive: {
    name: "Soham Chowdhury",
    role: "Sales & Business Development Executive"
  },

  // Official Legal Registrations
  tradeLicenseNo: "0917P299826472603",
  udyamRegistrationNo: "UDYAM-WB-18-0199709",
  isMsmeRegistered: true,
  
  // Location details
  headOfficeAddress: "Tower 02, Flat No - 6B3, Elgin 1, New Batanagar Road, Maheshtala, Batanagar, West Bengal, India, 700140",
  branchOfficeAddress: "P-23, Michael nagar , Kolkata - 700 133",
  address: "Tower 02, Flat No - 6B3, Elgin 1, New Batanagar Road, Maheshtala, Batanagar, West Bengal, India, 700140",
  branchAddress: "P-23, Michael nagar , Kolkata - 700 133",
  city: "Maheshtala, Batanagar",
  branchCity: "Michael nagar, Kolkata",
  district: "South 24 Parganas",
  state: "West Bengal",
  country: "India",
  postalCode: "700140",
  
  // Primary Contact details
  phone: "+91 79803 31022",
  phoneRaw: "917980331022",
  phoneNumbersList: [
    { label: "Founder (Sudipta Nandi)", number: "79803 31022", tel: "+917980331022" },
    { label: "Founder Alternate", number: "98303 54307", tel: "+919830354307" },
    { label: "Founder Alternate", number: "82401 12378", tel: "+918240112378" },
    { label: "Co-Founder (Dipankar Mitra)", number: "95633 95633", tel: "+919563395633" }
  ],
  whatsapp: "+91 79803 31022",
  whatsappRaw: "917980331022",
  email: "sudiptajourneys@gmail.com",
  
  // Business Hours
  openingHours: "Open Daily: 8:00 AM – 9:30 PM",
  daysOpen: "All 7 Days: Call or WhatsApp anytime",
  
  // Ratings & Verification
  directoryRating: {
    score: "5.0",
    maxScore: "5.0",
    ratingCount: 28,
    source: "Verified Google & Client Reviews",
    verificationNote: "Govt. UDYAM MSME Registered & Trade License Verified."
  },
  googleRating: "5.0",
  googleRatingCount: 28,
  googleReviewUrl: "https://share.google/sivygyIsAaYgFkLu1",
  
  // Social Media & Web Presence
  facebookUrl: "https://www.facebook.com/share/1BiZE547Cc/",
  instagramUrl: "https://www.instagram.com/journeyarchitect2026?xtok=MWg3YXl2N3Q3cWk5Mg==",
  xUrl: "https://x.com/nan59130",
  twitterUrl: "https://x.com/nan59130",
  youtubeUrl: "https://www.youtube.com/@SUDIPTANANDI-t9b",
  googleMapsUrl: "https://share.google/sivygyIsAaYgFkLu1",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.8521039864223!2d88.225574!3d22.496587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02796075908b9b%3A0x6b09312521c379a!2sBatanagar%2C%20Maheshtala%2C%20West%20Bengal%20700140!5e0!3m2!1sen!2sin!4v1700000000000",
  
  // Announcement Bar
  announcement: {
    enabled: false,
    text: "Tour & Travel • Car Rental • Catering Services | Kolkata & Batanagar",
    ctaText: "Call: 79803 31022"
  },
  
  // Default WhatsApp pre-filled messages
  whatsappDefaultMessage: "Hello Journey Architect, I would like to enquire about your services (Tour Packages / Car Rental / Catering).",
  whatsappCustomPlanMessage: "Hello Journey Architect, I would like to discuss a customized travel & rental plan.",
  
  // Brand color tokens
  brandColors: {
    primary: "#12304A",     // Deep Travel Navy
    secondary: "#167C80",   // Himalayan Teal
    accent: "#F4A340",      // Sunrise Amber
    background: "#F7F5F0",  // Warm Off-White
    surface: "#FFFFFF",     // White
    text: "#17212B",        // Main dark text
    muted: "#66717C",       // Muted gray
    whatsapp: "#25D366"     // WhatsApp green
  }
};

/**
 * Helper to get a sanitized WhatsApp link
 */
export function getWhatsAppUrl(customMessage, phoneOverride) {
  const number = phoneOverride || BUSINESS_CONFIG.whatsappRaw || "917980331022";
  const cleanNumber = number.replace(/\D/g, '');
  const text = encodeURIComponent(customMessage || BUSINESS_CONFIG.whatsappDefaultMessage);
  return `https://wa.me/${cleanNumber.startsWith('91') ? cleanNumber : '91' + cleanNumber}?text=${text}`;
}

/**
 * Helper to get phone call link
 */
export function getPhoneCallUrl(phoneOverride) {
  const number = phoneOverride || BUSINESS_CONFIG.phoneRaw || "917980331022";
  const cleanNumber = number.replace(/\D/g, '');
  return `tel:+${cleanNumber}`;
}
