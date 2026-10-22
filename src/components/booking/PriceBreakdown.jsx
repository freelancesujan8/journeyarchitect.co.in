import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

export default function PriceBreakdown({ pricing, pkg }) {
  if (!pricing) return null;

  const { totalAmount, adults, children } = pricing;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
      }}
    >
      <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '16px', fontWeight: 700 }}>
        Tour Price Summary
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dark)' }}>
          <span>
            {adults} Adult{adults > 1 ? 's' : ''} {children > 0 ? `+ ${children} Child${children > 1 ? 'ren' : ''}` : ''}
          </span>
          <span style={{ fontWeight: 600 }}>₹{Number(totalAmount).toLocaleString('en-IN')}</span>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
          <CheckCircle2 size={14} />
          <span>No advance deposit required online</span>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '6px 0' }} />

        {/* Total Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dark)', fontSize: '1rem', fontWeight: 700 }}>
          <span>Estimated Total Price</span>
          <span style={{ color: 'var(--color-secondary)', fontSize: '1.25rem' }}>₹{Number(totalAmount).toLocaleString('en-IN')}</span>
        </div>

        {/* Free Online Booking Banner */}
        <div
          style={{
            backgroundColor: '#ECFDF5',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid #A7F3D0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            marginTop: '6px'
          }}
        >
          <Info size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.8rem', color: '#065F46', lineHeight: 1.45 }}>
            <strong>Direct Booking Confirmation:</strong> Submit your travel booking without paying online today. Our tour planner will contact you directly to finalize your itinerary and discuss convenient offline payment options (Cash, UPI, or Bank Transfer).
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#16A34A', marginTop: '8px' }}>
          <ShieldCheck size={15} />
          <span>Instant PDF Travel Voucher • 100% Transparent Planning</span>
        </div>
      </div>
    </div>
  );
}
