import express from 'express';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { PaymentService } from '../services/paymentService.js';
import { NotificationService } from '../services/notificationService.js';

export const paymentsRouter = express.Router();

/**
 * Helper to generate official permanent Booking ID
 * Example: PKHM-2026-000124
 */
function generateOfficialBookingId(dbId) {
  const year = new Date().getFullYear();
  const paddedId = String(dbId || Math.floor(100 + Math.random() * 900)).padStart(6, '0');
  return `PKHM-${year}-${paddedId}`;
}

/**
 * POST /api/payment/verify — Server-side verification and confirmation
 */
paymentsRouter.post('/verify', async (req, res) => {
  try {
    const { orderId, paymentId, signature, bookingId, paymentMethod = 'upi' } = req.body;

    if (!orderId || !paymentId || !bookingId) {
      return res.status(400).json({ success: false, error: 'Missing required payment verification parameters.' });
    }

    // 1. Find booking
    const booking = db.prepare(`
      SELECT b.*, p.name as package_name, p.slug as package_slug, p.destination, p.duration_days, p.duration_nights,
             c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.address as customer_address
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      JOIN customers c ON b.customer_id = c.id
      WHERE b.booking_id = ?
    `).get(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking record not found for verification.' });
    }

    // Idempotency check: if already confirmed, return success immediately
    if (booking.booking_status === 'CONFIRMED' && booking.payment_status === 'SUCCESS') {
      return res.json({
        success: true,
        alreadyProcessed: true,
        bookingId: booking.booking_id,
        accessToken: booking.access_token,
        booking: booking
      });
    }

    // 2. Cryptographic signature check
    const verification = PaymentService.verifyPaymentSignature({
      orderId,
      paymentId,
      signature,
      bookingId,
      amount: booking.booking_amount
    });

    if (!verification.verified) {
      // Record payment failure in payments table
      db.prepare(`
        UPDATE payments 
        SET status = 'FAILED', notes = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE booking_id = ? AND gateway_order_id = ?
      `).run(verification.reason || 'Signature verification failed', booking.id, orderId);

      return res.status(400).json({
        success: false,
        error: 'Payment verification failed: ' + (verification.reason || 'Invalid gateway signature')
      });
    }

    // 3. Database Transaction: Confirm Booking & Payment
    const officialBookingId = generateOfficialBookingId(booking.id);
    const paidAmount = booking.booking_amount;
    const remainingAmount = Math.max(0, booking.total_amount - paidAmount);

    const transaction = db.transaction(() => {
      // Update Payment Record
      db.prepare(`
        UPDATE payments
        SET gateway_payment_id = ?, status = 'SUCCESS', payment_method = ?, paid_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE booking_id = ? AND (gateway_order_id = ? OR payment_reference = ?)
      `).run(paymentId, paymentMethod, booking.id, orderId, orderId);

      // Update Booking Record
      db.prepare(`
        UPDATE bookings
        SET booking_id = ?, booking_status = 'CONFIRMED', payment_status = 'SUCCESS',
            paid_amount = ?, remaining_amount = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(officialBookingId, paidAmount, remainingAmount, booking.id);

      // Increment booked seats for package
      const travelerCount = booking.adults + booking.children;
      db.prepare(`
        UPDATE packages
        SET booked_seats = booked_seats + ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(travelerCount, booking.package_id);

      // Log audit
      db.prepare(`
        INSERT INTO audit_logs (action, details, admin_user)
        VALUES ('BOOKING_CONFIRMED', ?, 'Payment Gateway')
      `).run(`Booking ${officialBookingId} confirmed with payment ${paymentId} for ₹${paidAmount}`);
    });

    transaction();

    // 4. Fetch updated confirmed booking
    const confirmedBooking = db.prepare(`
      SELECT b.*, p.name as package_name, p.slug as package_slug, p.destination, p.duration_days, p.duration_nights,
             p.thumbnail, p.hotel_info, p.transport_info, p.meals_info, p.inclusions, p.exclusions, p.itinerary,
             c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.address as customer_address
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      JOIN customers c ON b.customer_id = c.id
      WHERE b.id = ?
    `).get(booking.id);

    // 5. Asynchronous notifications
    NotificationService.sendCustomerConfirmation(confirmedBooking, {
      name: confirmedBooking.customer_name,
      email: confirmedBooking.customer_email,
      phone: confirmedBooking.customer_phone
    }, { name: confirmedBooking.package_name }).catch(console.error);

    NotificationService.sendAdminAlert(confirmedBooking, {
      name: confirmedBooking.customer_name,
      email: confirmedBooking.customer_email,
      phone: confirmedBooking.customer_phone
    }, { name: confirmedBooking.package_name }, { id: paymentId, amount: paidAmount }).catch(console.error);

    res.json({
      success: true,
      message: 'Payment verified and booking confirmed successfully.',
      bookingId: officialBookingId,
      accessToken: confirmedBooking.access_token,
      paymentId: paymentId,
      booking: confirmedBooking
    });
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ success: false, error: 'Server error during payment verification: ' + err.message });
  }
});

/**
 * POST /api/payment/webhook — Idempotent Webhook Handler
 */
paymentsRouter.post('/webhook', (req, res) => {
  try {
    const payload = req.body;
    console.log('[Webhook] Received payment gateway event:', payload?.event || 'generic');

    // Return 200 OK immediately for webhook acknowledgment
    res.status(200).json({ received: true, status: 'acknowledged' });
  } catch (err) {
    console.error('[Webhook Error]', err);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});
