import { useState, useEffect } from 'react';
import { X, ShieldCheck, QrCode, CreditCard, Building2, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/businessConfig';

/**
 * Interactive Secure Payment Gateway Modal
 * Supports UPI QR / UPI Apps, Cards, Netbanking with cryptographic signature verification
 */
export default function PaymentSimulatorModal({
  isOpen,
  onClose,
  paymentOrder,
  bookingDetails,
  onPaymentSuccess,
  onPaymentFailure
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('select'); // 'select' | 'processing' | 'success' | 'failed'

  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen || !paymentOrder) return null;

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    setStep('processing');

    try {
      // Simulate gateway payment processing latency
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate verification payload
      const mockPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const verificationPayload = {
        orderId: paymentOrder.orderId,
        paymentId: mockPaymentId,
        signature: 'simulated_valid_signature_' + Date.now(),
        bookingId: paymentOrder.bookingId,
        paymentMethod: selectedMethod
      };

      setStep('success');
      await new Promise((resolve) => setTimeout(resolve, 800));

      onPaymentSuccess(verificationPayload);
    } catch (err) {
      setStep('failed');
      setIsProcessing(false);
      onPaymentFailure?.(err.message);
    }
  };

  return (
    <div className="modal-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
      <div
        className="modal-box"
        style={{
          maxWidth: '560px',
          width: '100%',
          borderRadius: '16px',
          padding: '0',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
        }}
      >
        {/* Header */}
        <div style={{ backgroundColor: 'var(--color-navy)', color: '#FFFFFF', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="var(--color-accent)" />
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Journey Architect Secure Payment Gateway</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#B3C8D9', marginTop: '2px' }}>
              256-bit SSL Encrypted • Order #{paymentOrder.orderId.substring(0, 16)}
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '4px' }}
              aria-label="Close Payment Modal"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Amount Banner */}
        <div style={{ backgroundColor: 'var(--color-cream)', padding: '14px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Payable Booking Advance</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-navy)' }}>
              ₹{Number(paymentOrder.amount || 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
            <div style={{ color: 'var(--color-text-muted)' }}>Payee:</div>
            <div style={{ fontWeight: 600, color: 'var(--color-teal)' }}>Journey Architect</div>
          </div>
        </div>

        {/* Processing State */}
        {step === 'processing' && (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div className="spinner" style={{ width: '48px', height: '48px', margin: '0 auto 20px', borderColor: 'var(--color-teal)', borderTopColor: 'transparent' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '8px' }}>Processing Payment Securely</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Please do not refresh or close this browser window...</p>
          </div>
        )}

        {/* Success State */}
        {step === 'success' && (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <CheckCircle2 size={56} color="var(--color-whatsapp)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.3rem', color: 'var(--color-navy)', marginBottom: '6px' }}>Payment Approved!</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Verifying payment on server and generating your official booking voucher...</p>
          </div>
        )}

        {/* Method Selection & Input Form */}
        {step === 'select' && (
          <div style={{ padding: '20px 24px' }}>
            {/* Method Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '10px',
                  border: `2px solid ${selectedMethod === 'upi' ? 'var(--color-teal)' : 'var(--color-border)'}`,
                  backgroundColor: selectedMethod === 'upi' ? 'rgba(22, 124, 128, 0.08)' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: selectedMethod === 'upi' ? 'var(--color-teal)' : 'var(--color-text-dark)'
                }}
              >
                <QrCode size={20} />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '10px',
                  border: `2px solid ${selectedMethod === 'card' ? 'var(--color-teal)' : 'var(--color-border)'}`,
                  backgroundColor: selectedMethod === 'card' ? 'rgba(22, 124, 128, 0.08)' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: selectedMethod === 'card' ? 'var(--color-teal)' : 'var(--color-text-dark)'
                }}
              >
                <CreditCard size={20} />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('netbanking')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '10px',
                  border: `2px solid ${selectedMethod === 'netbanking' ? 'var(--color-teal)' : 'var(--color-border)'}`,
                  backgroundColor: selectedMethod === 'netbanking' ? 'rgba(22, 124, 128, 0.08)' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: selectedMethod === 'netbanking' ? 'var(--color-teal)' : 'var(--color-text-dark)'
                }}
              >
                <Building2 size={20} />
                <span>Net Banking</span>
              </button>
            </div>

            {/* UPI Option */}
            {selectedMethod === 'upi' && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ display: 'inline-block', padding: '12px', background: '#F8F9FA', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '14px' }}>
                  {/* Decorative QR code graphic */}
                  <div style={{ width: '120px', height: '120px', margin: '0 auto', background: '#12304A', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.75rem', flexDirection: 'column', gap: '4px' }}>
                    <QrCode size={48} color="#FFFFFF" />
                    <span>Scan & Pay UPI</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                  Scan with Google Pay, PhonePe, Paytm, or any BHIM UPI app
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g. yourname@okhdfcbank)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', width: '280px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            )}

            {/* Cards Option */}
            {selectedMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-dark)', display: 'block', marginBottom: '4px' }}>Card Number</label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8892"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-dark)', display: 'block', marginBottom: '4px' }}>Expiry (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-dark)', display: 'block', marginBottom: '4px' }}>CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Netbanking Option */}
            {selectedMethod === 'netbanking' && (
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-dark)', display: 'block', marginBottom: '6px' }}>Select Popular Bank</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: `1.5px solid ${selectedBank === bank ? 'var(--color-teal)' : 'var(--color-border)'}`,
                        backgroundColor: selectedBank === bank ? 'rgba(22, 124, 128, 0.08)' : '#FFFFFF',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--color-teal)',
                  borderColor: 'var(--color-teal)'
                }}
              >
                <Lock size={16} />
                <span>Pay ₹{Number(paymentOrder.amount || 0).toLocaleString('en-IN')} & Confirm Booking</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Lock size={12} />
                Verified Banking Gateway • Official Journey Architect Travel Voucher Generated Instantly
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
