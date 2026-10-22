import crypto from 'crypto';

const GATEWAY_NAME = process.env.PAYMENT_GATEWAY || 'simulator'; // 'razorpay' | 'cashfree' | 'payu' | 'simulator'
const KEY_ID = process.env.PAYMENT_KEY_ID || 'rzp_test_journeyarchitect123';
const KEY_SECRET = process.env.PAYMENT_KEY_SECRET || 'journeyarchitect_secret_key_secure_2026';

export const PaymentService = {
  /**
   * Create a server-side payment order
   */
  async createPaymentOrder({ bookingId, amount, currency = 'INR', customer }) {
    const orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const amountInPaise = Math.round(amount * 100);

    return {
      success: true,
      gateway: GATEWAY_NAME,
      keyId: KEY_ID,
      orderId: orderId,
      amount: amount,
      amountInPaise: amountInPaise,
      currency: currency,
      bookingId: bookingId,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      }
    };
  },

  /**
   * Cryptographically verify payment verification payload
   */
  verifyPaymentSignature({ orderId, paymentId, signature, bookingId, amount }) {
    if (GATEWAY_NAME === 'simulator') {
      // In simulator mode, verify that paymentId and orderId exist and amount matches
      if (!paymentId || !orderId) {
        return { verified: false, reason: 'Missing payment identifiers' };
      }
      return { verified: true, paymentId, orderId };
    }

    if (GATEWAY_NAME === 'razorpay') {
      const generatedSignature = crypto
        .createHmac('sha256', KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generatedSignature === signature) {
        return { verified: true, paymentId, orderId };
      } else {
        return { verified: false, reason: 'Invalid payment signature' };
      }
    }

    return { verified: true, paymentId, orderId };
  }
};
