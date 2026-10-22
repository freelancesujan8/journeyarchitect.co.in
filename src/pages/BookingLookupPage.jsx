import { useState } from 'react';
import {
  Search, ShieldCheck, Download, CreditCard, AlertCircle,
  CheckCircle2, Calendar, MapPin, Users, Phone, ArrowRight, Lock
} from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { ApiClient } from '../api/client';
import { generateBookingPDF } from '../utils/pdfGenerator';
import PaymentSimulatorModal from '../components/booking/PaymentSimulatorModal';

export default function BookingLookupPage({ onNavigate }) {
  const [bookingId, setBookingId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Remaining Payment State
  const [isPayRemainingModalOpen, setIsPayRemainingModalOpen] = useState(false);
  const [remainingPaymentOrder, setRemainingPaymentOrder] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bookingId.trim()) {
      setErrorMessage('Please enter your Booking ID (e.g. PKHM-2026-000124).');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setBooking(null);

    try {
      const res = await ApiClient.getBookingDetails(bookingId.trim(), '', phone.trim());
      setBooking(res.booking);
    } catch (err) {
      setErrorMessage(err.message || 'No booking found matching the provided Booking ID and Phone number.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (booking) {
      generateBookingPDF(booking);
    }
  };

  const handleInitiateRemainingPayment = async () => {
    if (!booking || booking.remaining_amount <= 0) return;

    // Build mock order for remaining amount
    const orderData = {
      orderId: `order_rem_${Date.now()}`,
      bookingId: booking.booking_id,
      amount: booking.remaining_amount,
      customer: {
        name: booking.customer_name,
        email: booking.customer_email,
        phone: booking.customer_phone
      }
    };
    setRemainingPaymentOrder(orderData);
    setIsPayRemainingModalOpen(true);
  };

  const handleRemainingPaymentSuccess = async (verificationPayload) => {
    try {
      setIsPayRemainingModalOpen(false);
      setLoading(true);

      // Verify payment with server
      await ApiClient.verifyPayment(verificationPayload);

      // Refresh booking record
      const refreshed = await ApiClient.getBookingDetails(booking.booking_id, '', booking.customer_phone);
      setBooking(refreshed.booking);
    } catch (err) {
      setErrorMessage('Payment verification error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Find My Booking & Download Voucher | Journey Architect"
        description="Lookup your tour package booking status, download your official travel voucher PDF, or settle remaining balances."
        canonicalUrl="/booking/lookup"
      />

      <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', padding: '40px 0 80px' }}>
        <div className="container" style={{ maxWidth: '760px' }}>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: 'var(--color-navy)', marginBottom: '8px' }}>
              Find My Booking & Travel Voucher
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Enter your Booking ID to view travel details, download your official PDF voucher, or manage remaining payments.
            </p>
          </div>

          {/* Search Box */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid var(--color-border)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              marginBottom: '28px'
            }}
          >
            <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '6px' }}>
                    Booking ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PKHM-2026-000124"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '6px' }}>
                    Registered Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              {errorMessage && (
                <div style={{ padding: '10px 14px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.95rem'
                }}
              >
                <Search size={18} />
                <span>{loading ? 'Searching Booking...' : 'Search Booking'}</span>
              </button>
            </form>
          </div>

          {/* Search Result Display */}
          {booking && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Booking ID</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-navy)' }}>{booking.booking_id}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge" style={{ backgroundColor: booking.booking_status === 'CONFIRMED' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(244, 163, 64, 0.15)', color: booking.booking_status === 'CONFIRMED' ? '#16A34A' : 'var(--color-accent)', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem' }}>
                    {booking.booking_status}
                  </span>
                </div>
              </div>

              {/* Grid Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', backgroundColor: 'var(--color-cream)', padding: '16px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Lead Passenger</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{booking.customer_name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Tour Package</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{booking.package_name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Travel Date</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{new Date(booking.travel_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Travelers</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{booking.adults} Adults {booking.children > 0 ? `, ${booking.children} Children` : ''}</div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                  <span>Total Tour Price:</span>
                  <span style={{ fontWeight: 700 }}>₹{Number(booking.total_amount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(34, 197, 94, 0.06)', fontSize: '0.9rem' }}>
                  <span style={{ color: '#16A34A', fontWeight: 600 }}>Total Paid:</span>
                  <span style={{ fontWeight: 800, color: '#16A34A' }}>₹{Number(booking.paid_amount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--color-cream)', fontSize: '0.95rem' }}>
                  <span style={{ fontWeight: 600 }}>Remaining Due Balance:</span>
                  <span style={{ fontWeight: 800, color: 'var(--color-navy)' }}>₹{Number(booking.remaining_amount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Actions: Download PDF & Pay Remaining */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="btn btn-primary"
                  style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
                >
                  <Download size={16} />
                  <span>Download Official PDF Voucher</span>
                </button>

                {booking.remaining_amount > 0 && (
                  <button
                    type="button"
                    onClick={handleInitiateRemainingPayment}
                    className="btn btn-primary"
                    style={{
                      padding: '10px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9rem',
                      backgroundColor: 'var(--color-teal)',
                      borderColor: 'var(--color-teal)'
                    }}
                  >
                    <CreditCard size={16} />
                    <span>Pay Remaining ₹{Number(booking.remaining_amount).toLocaleString('en-IN')} Online</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Remaining Payment Modal */}
      {isPayRemainingModalOpen && remainingPaymentOrder && (
        <PaymentSimulatorModal
          isOpen={isPayRemainingModalOpen}
          onClose={() => setIsPayRemainingModalOpen(false)}
          paymentOrder={remainingPaymentOrder}
          bookingDetails={{
            packageName: booking.package_name,
            travelDate: booking.travel_date,
            adults: booking.adults,
            children: booking.children
          }}
          onPaymentSuccess={handleRemainingPaymentSuccess}
          onPaymentFailure={(err) => setErrorMessage(err)}
        />
      )}
    </>
  );
}
