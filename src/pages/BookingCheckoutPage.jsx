import { useState, useEffect } from 'react';
import {
  Calendar, Users, User, Phone, Mail, MapPin, CheckCircle2,
  AlertCircle, ArrowRight, ArrowLeft, ShieldCheck
} from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import TravelerFields from '../components/booking/TravelerFields';
import PriceBreakdown from '../components/booking/PriceBreakdown';
import { ApiClient } from '../api/client';
import { SEED_PACKAGES_PARSED } from '../data/seedPackagesData';

export default function BookingCheckoutPage({ slug, onNavigate }) {
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Trip Details, 2: Customer & Travelers, 3: Review & Confirm
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    whatsapp_number: '',
    sameAsPhone: true,
    email: '',
    address: ''
  });

  const [travelers, setTravelers] = useState([
    { name: '', age: '', gender: 'Male', id_type: 'Aadhaar', id_number: '' }
  ]);

  const [pickupLocation, setPickupLocation] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Pricing State from Server
  const [pricing, setPricing] = useState(null);

  // Load Package Details
  useEffect(() => {
    let isMounted = true;
    async function loadPackage() {
      try {
        setLoading(true);
        let loadedPkg = null;
        try {
          const res = await ApiClient.getPackageBySlug(slug);
          if (res && res.package) {
            loadedPkg = res.package;
          }
        } catch (apiErr) {
          console.warn('BookingCheckoutPage: API error, trying fallback:', apiErr);
        }

        if (!loadedPkg) {
          loadedPkg = SEED_PACKAGES_PARSED.find(p => p.slug === slug);
        }

        if (isMounted && loadedPkg) {
          setPkg(loadedPkg);
          try {
            const priceRes = await ApiClient.calculatePrice({
              slug: loadedPkg.slug,
              adults: 2,
              children: 0
            });
            if (isMounted && priceRes && priceRes.pricing) {
              setPricing(priceRes.pricing);
            }
          } catch (pErr) {
            // Local price calculation fallback
            const validTotal = Number(loadedPkg.total_price) || 15000;
            const adultRate = Number(loadedPkg.adult_price) || Math.round(validTotal / 2) || 7500;
            const subtotal = adultRate * 2;
            const advance = Number(loadedPkg.booking_amount) || Math.round(subtotal * 0.25) || 2500;
            if (isMounted) {
              setPricing({
                totalAmount: subtotal,
                bookingAmount: advance,
                remainingAmount: Math.max(0, subtotal - advance),
                paymentType: loadedPkg.payment_type || 'fixed',
                adults: 2,
                children: 0
              });
            }
          }
        } else if (isMounted) {
          setErrorMessage('Package not found');
        }
      } catch (err) {
        if (isMounted) setErrorMessage(err.message || 'Failed to load package');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPackage();
    window.scrollTo(0, 0);
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Recalculate Server-side Price when adults or children change
  useEffect(() => {
    if (!pkg) return;
    async function updatePricing() {
      try {
        const res = await ApiClient.calculatePrice({
          slug: pkg.slug,
          adults,
          children
        });
        if (res && res.pricing) {
          setPricing(res.pricing);
        }
      } catch (err) {
        console.error('Error recalculating price:', err);
        const validTotal = Number(pkg.total_price) || 15000;
        const adultRate = Number(pkg.adult_price) || Math.round(validTotal / 2) || 7500;
        const childRate = Number(pkg.child_price) || Math.round(validTotal * 0.35) || 4500;
        const subtotal = (adults * adultRate) + (children * childRate);
        const advance = Number(pkg.booking_amount) || Math.round(subtotal * 0.25) || 2500;
        setPricing({
          totalAmount: subtotal,
          bookingAmount: Math.min(subtotal, advance),
          remainingAmount: Math.max(0, subtotal - advance),
          paymentType: pkg.payment_type || 'fixed',
          adults,
          children
        });
      }
    }
    updatePricing();
  }, [pkg, adults, children]);

  // Sync Lead Passenger with Customer Name
  const handleCustomerNameChange = (name) => {
    setCustomer((prev) => ({ ...prev, name }));
    if (travelers.length > 0) {
      const updated = [...travelers];
      updated[0].name = name;
      setTravelers(updated);
    }
  };

  // Step 1 Validation
  const handleProceedToStep2 = () => {
    setErrorMessage('');
    if (!travelDate) {
      setErrorMessage('Please select a travel departure date.');
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(travelDate) < today) {
      setErrorMessage('Travel date cannot be in the past.');
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  // Step 2 Validation
  const handleProceedToStep3 = () => {
    setErrorMessage('');
    if (!customer.name.trim()) {
      setErrorMessage('Please enter lead traveler full name.');
      return;
    }
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit calling phone number.');
      return;
    }
    const waNumber = customer.sameAsPhone ? customer.phone : customer.whatsapp_number;
    const cleanWa = (waNumber || '').replace(/[^0-9]/g, '');
    if (!cleanWa || cleanWa.length < 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    setStep(3);
    window.scrollTo(0, 0);
  };

  // Step 3: Direct Booking Confirmation (No Online Payment Required)
  const handleConfirmBooking = async () => {
    if (!termsAgreed) {
      setErrorMessage('Please accept the booking terms to proceed.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await ApiClient.createDirectBooking({
        slug: pkg.slug,
        travelDate,
        returnDate,
        adults,
        children,
        customer: {
          ...customer,
          whatsapp_number: (customer.sameAsPhone ? customer.phone : customer.whatsapp_number).trim()
        },
        travelers,
        pickupLocation,
        specialRequirements
      });

      if (response && response.success && response.bookingId) {
        onNavigate(`/booking/success/${response.bookingId}?token=${response.accessToken}`);
      } else {
        throw new Error(response?.error || 'Failed to confirm booking.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to confirm booking. Please try again or reach out to us on WhatsApp.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px', borderColor: 'var(--color-teal)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--color-text-muted)' }}>Preparing checkout session...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <AlertCircle size={48} color="#DC2626" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ color: 'var(--color-navy)', marginBottom: '12px' }}>Package Unavailable</h2>
          <button className="btn btn-primary" onClick={() => onNavigate('/tours')}>Browse Available Packages</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`Book ${pkg.name} | Secure Checkout | Journey Architect`}
        description="Book your tour package securely with instant advance confirmation and PDF travel voucher."
        canonicalUrl={`/book/${pkg.slug}`}
      />

      <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', padding: '32px 0 80px' }}>
        <div className="container">

          {/* Checkout Header */}
          <div style={{ marginBottom: '28px', textAlign: 'center' }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--color-navy)', marginBottom: '6px' }}>
              Tour Package Booking & Checkout
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              {pkg.name} • {pkg.destination} ({pkg.duration_days}D / {pkg.duration_nights}N)
            </p>

            {/* Stepper Indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step >= 1 ? 'var(--color-teal)' : 'var(--color-text-muted)', fontWeight: 700, fontSize: '0.85rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 1 ? 'var(--color-teal)' : 'var(--color-border)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</div>
                <span>Dates & Travelers</span>
              </div>
              <div style={{ width: '40px', height: '2px', backgroundColor: step >= 2 ? 'var(--color-teal)' : 'var(--color-border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step >= 2 ? 'var(--color-teal)' : 'var(--color-text-muted)', fontWeight: 700, fontSize: '0.85rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 2 ? 'var(--color-teal)' : 'var(--color-border)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</div>
                <span>Traveler Details</span>
              </div>
              <div style={{ width: '40px', height: '2px', backgroundColor: step >= 3 ? 'var(--color-teal)' : 'var(--color-border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step >= 3 ? 'var(--color-teal)' : 'var(--color-text-muted)', fontWeight: 700, fontSize: '0.85rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 3 ? 'var(--color-teal)' : 'var(--color-border)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>3</div>
                <span>Review & Confirm</span>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div style={{ maxWidth: '840px', margin: '0 auto 20px', padding: '12px 16px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Main 2-Column Grid */}
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'start' }}>

            {/* Left Box: Active Step Form */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', border: '1px solid var(--color-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>

              {/* STEP 1: Dates & Travelers */}
              {step === 1 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <Calendar size={22} color="var(--color-teal)" />
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', fontWeight: 700 }}>1. Select Travel Dates & Travelers</h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '6px' }}>
                        Departure Travel Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={travelDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setTravelDate(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '6px' }}>
                          Adults (Age 12+)
                        </label>
                        <select
                          value={adults}
                          onChange={(e) => setAdults(parseInt(e.target.value, 10))}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '0.95rem', backgroundColor: '#FFFFFF' }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '6px' }}>
                          Children (Age 3-11)
                        </label>
                        <select
                          value={children}
                          onChange={(e) => setChildren(parseInt(e.target.value, 10))}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '0.95rem', backgroundColor: '#FFFFFF' }}
                        >
                          {[0, 1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>{n} Child{n > 1 ? 'ren' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={handleProceedToStep2}
                        className="btn btn-primary"
                        style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <span>Continue to Traveler Info</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Customer & Traveler Information */}
              {step === 2 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <User size={22} color="var(--color-teal)" />
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', fontWeight: 700 }}>2. Primary Contact & Travelers</h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '4px' }}>
                          Lead Passenger Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Subrata Mukherjee"
                          value={customer.name}
                          onChange={(e) => handleCustomerNameChange(e.target.value)}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '4px' }}>
                          Calling Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit number"
                          value={customer.phone}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomer(prev => ({
                              ...prev,
                              phone: val,
                              whatsapp_number: prev.sameAsPhone ? val : prev.whatsapp_number
                            }));
                          }}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                            WhatsApp Number *
                          </label>
                          <label style={{ fontSize: '0.78rem', color: 'var(--color-teal)', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={customer.sameAsPhone}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setCustomer(prev => ({
                                  ...prev,
                                  sameAsPhone: checked,
                                  whatsapp_number: checked ? prev.phone : ''
                                }));
                              }}
                            />
                            Same as phone
                          </label>
                        </div>
                        <input
                          type="tel"
                          required
                          disabled={customer.sameAsPhone}
                          placeholder="10-digit WhatsApp number"
                          value={customer.sameAsPhone ? customer.phone : customer.whatsapp_number}
                          onChange={(e) => setCustomer({ ...customer, whatsapp_number: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            fontSize: '0.9rem',
                            backgroundColor: customer.sameAsPhone ? '#F3F4F6' : '#FFFFFF'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '4px' }}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="your.email@example.com"
                          value={customer.email}
                          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '4px' }}>
                        Home / City Address
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bongaon, West Bengal"
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
                      />
                    </div>

                    {/* Additional Travelers Input */}
                    <div style={{ marginTop: '8px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '8px' }}>
                        Travelers List
                      </label>
                      <TravelerFields
                        travelers={travelers}
                        onChange={setTravelers}
                        maxTravelers={adults + children}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn btn-outline"
                        style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <ArrowLeft size={16} /> Back
                      </button>

                      <button
                        type="button"
                        onClick={handleProceedToStep3}
                        className="btn btn-primary"
                        style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <span>Review Booking</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Review & Confirm Booking (No Online Payment Required) */}
              {step === 3 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <ShieldCheck size={22} color="var(--color-teal)" />
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', fontWeight: 700 }}>3. Review & Confirm Booking</h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                    <div style={{ backgroundColor: 'var(--color-cream)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '1rem', marginBottom: '6px' }}>
                        {pkg.name}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px', color: 'var(--color-text-dark)', fontSize: '0.85rem' }}>
                        <div><strong>Travel Date:</strong> {new Date(travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div><strong>Party Size:</strong> {adults} Adults {children > 0 ? `, ${children} Children` : ''}</div>
                        <div><strong>Lead Traveler:</strong> {customer.name}</div>
                        <div><strong>Phone:</strong> {customer.phone}</div>
                        <div><strong>WhatsApp:</strong> {customer.sameAsPhone ? customer.phone : customer.whatsapp_number}</div>
                      </div>
                    </div>

                    {/* Terms Agreement Checkbox */}
                    <div style={{ backgroundColor: '#FFFFFF', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-dark)' }}>
                        <input
                          type="checkbox"
                          checked={termsAgreed}
                          onChange={(e) => setTermsAgreed(e.target.checked)}
                          style={{ marginTop: '3px', cursor: 'pointer' }}
                        />
                        <span>
                          I have read and agree to the <strong>Booking Terms & Cancellation Policy</strong>. No advance payment is required online today; our tour manager will verify all dates, hotel choices, and itinerary details with you directly.
                        </span>
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={submitting}
                        className="btn btn-outline"
                        style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <ArrowLeft size={16} /> Back
                      </button>

                      <button
                        type="button"
                        onClick={handleConfirmBooking}
                        disabled={submitting || !termsAgreed}
                        className="btn btn-primary"
                        style={{
                          padding: '14px 28px',
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          backgroundColor: 'var(--color-teal)',
                          borderColor: 'var(--color-teal)',
                          cursor: submitting || !termsAgreed ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <CheckCircle2 size={18} />
                        <span>{submitting ? 'Confirming Tour Booking...' : 'Confirm Tour Booking (No Payment Required)'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right Box: Live Server Price Breakdown */}
            <div>
              <PriceBreakdown pricing={pricing} pkg={pkg} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
