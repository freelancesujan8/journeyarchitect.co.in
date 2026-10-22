import { useState, useEffect } from 'react';
import {
  CheckCircle2, Download, MessageCircle, Home, Calendar, Users,
  MapPin, ShieldCheck, CreditCard, ArrowRight, Clock, FileText
} from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { ApiClient } from '../api/client';
import { generateBookingPDF } from '../utils/pdfGenerator';
import { getWhatsAppUrl } from '../config/businessConfig';

export default function BookingSuccessPage({ bookingId, token, onNavigate }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBooking() {
      try {
        setLoading(true);
        const res = await ApiClient.getBookingDetails(bookingId, token);
        setBooking(res.booking);
      } catch (err) {
        setError(err.message || 'Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
    window.scrollTo(0, 0);
  }, [bookingId, token]);

  const handleDownloadPDF = () => {
    if (booking) {
      generateBookingPDF(booking);
    }
  };

  if (loading) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px', borderColor: 'var(--color-teal)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--color-text-muted)' }}>Fetching confirmed booking voucher...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <h2 style={{ color: 'var(--color-navy)', marginBottom: '12px' }}>Booking Confirmation Pending</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
            We are verifying your transaction. If you completed payment, please check your Booking ID or contact our team on WhatsApp.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('/booking/lookup')}>
            Search Booking
          </button>
        </div>
      </div>
    );
  }

  const latestPayment = booking.payments && booking.payments.length > 0 ? booking.payments[0] : null;

  return (
    <>
      <SEOHead
        title={`Booking Confirmed #${booking.booking_id} | Journey Architect`}
        description="Your tour package booking has been confirmed successfully."
        canonicalUrl={`/booking/success/${booking.booking_id}`}
      />

      <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', padding: '40px 0 80px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>

          {/* Success Card Header */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '36px',
              border: '1px solid var(--color-border)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
              textAlign: 'center',
              marginBottom: '28px'
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#16A34A'
              }}
            >
              <CheckCircle2 size={44} />
            </div>

            <div style={{ display: 'inline-block', backgroundColor: 'rgba(22, 124, 128, 0.1)', color: 'var(--color-teal)', padding: '4px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
              Booking Status: {booking.booking_status}
            </div>

            <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: 'var(--color-navy)', marginBottom: '8px' }}>
              Tour Booking Confirmed!
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '560px', margin: '0 auto 20px' }}>
              Thank you, <strong>{booking.customer_name}</strong>. Your tour booking has been safely registered with Journey Architect. No advance online payment was required; our tour planner will contact you directly to coordinate dates and arrangements.
            </p>

            {/* Booking ID Highlight Box */}
            <div
              style={{
                backgroundColor: 'var(--color-cream)',
                border: '2px dashed var(--color-teal)',
                borderRadius: '12px',
                padding: '16px',
                maxWidth: '420px',
                margin: '0 auto 24px'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                Official Booking Reference ID
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '0.5px', marginTop: '2px' }}>
                {booking.booking_id}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="btn btn-primary"
                style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}
              >
                <Download size={18} />
                <span>Download Official PDF Voucher</span>
              </button>

              <a
                href={getWhatsAppUrl(`Hi Journey Architect, I have confirmed my tour booking for "${booking.package_name}" with Booking ID: ${booking.booking_id}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: 'var(--color-navy)' }}
              >
                <MessageCircle size={18} color="var(--color-whatsapp)" />
                <span>Connect on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Detailed Itemized Booking Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid var(--color-border)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            {/* Trip Details Section */}
            <div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} color="var(--color-teal)" />
                <span>Trip & Package Details</span>
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', backgroundColor: 'var(--color-cream)', padding: '18px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Tour Package</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '0.95rem' }}>{booking.package_name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Destination</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '0.95rem' }}>{booking.destination}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Travel Date</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '0.95rem' }}>{new Date(booking.travel_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Travelers</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '0.95rem' }}>{booking.adults} Adults {booking.children > 0 ? `, ${booking.children} Children` : ''}</div>
                </div>
              </div>
            </div>

            {/* Financial Statement Section */}
            <div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} color="var(--color-teal)" />
                <span>Payment & Balance Statement</span>
              </h2>

              <div style={{ border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px', borderBottom: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                  <span>Total Tour Price:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>₹{Number(booking.total_amount || 0).toLocaleString('en-IN')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(34, 197, 94, 0.06)', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} color="#16A34A" />
                    <span style={{ fontWeight: 600, color: '#16A34A' }}>
                      {Number(booking.paid_amount || 0) > 0 ? 'Advance Booking Paid:' : 'Advance Online Payment:'}
                    </span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#16A34A' }}>
                    {Number(booking.paid_amount || 0) > 0
                      ? `₹${Number(booking.paid_amount).toLocaleString('en-IN')}`
                      : '₹0 (No Advance Required)'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px', backgroundColor: 'var(--color-cream)', fontSize: '0.95rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-dark)' }}>Payment Mode / Remaining Due:</span>
                  <span style={{ fontWeight: 800, color: 'var(--color-navy)' }}>
                    ₹{Number(booking.remaining_amount || booking.total_amount || 0).toLocaleString('en-IN')} (Pay on Arrival / Offline)
                  </span>
                </div>
              </div>

              {latestPayment ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px', display: 'flex', gap: '16px' }}>
                  <span>Transaction ID: <strong>{latestPayment.gateway_payment_id || latestPayment.payment_reference}</strong></span>
                  <span>Payment Gateway: <strong>Verified</strong></span>
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: '#059669', marginTop: '8px' }}>
                  ✓ Direct Booking Confirmed: Settle by Cash, UPI, or Bank Transfer as coordinated with your tour manager.
                </div>
              )}
            </div>

            {/* Next Steps Guide */}
            <div style={{ backgroundColor: 'rgba(22, 124, 128, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(22, 124, 128, 0.15)' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '8px' }}>
                What happens next?
              </h3>
              <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--color-text-dark)', lineHeight: 1.6 }}>
                <li>Our operations coordinator in Bongaon will call you within 24 hours to confirm hotel preferences and train/flight timings.</li>
                <li>Your driver contact and dedicated vehicle details will be shared 24 hours prior to travel date.</li>
                <li>You can download or view this voucher anytime by visiting our <strong>Booking Lookup</strong> page with your Booking ID.</li>
              </ol>
            </div>

            {/* Back Home Button */}
            <div style={{ textAlign: 'center', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="btn btn-outline"
                style={{ padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Home size={16} /> Back to Homepage
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
