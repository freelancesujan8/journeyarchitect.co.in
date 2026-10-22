/**
 * Journey Architect — WhatsApp Invoice & Message Helper
 */

/**
 * Format phone/whatsapp string to international format suitable for wa.me
 * Example: '9830354307' -> '919830354307'
 */
export function formatWhatsAppNumber(phone) {
  if (!phone) return '917980331022';
  const digits = String(phone).replace(/[^0-9]/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  return digits || '917980331022';
}

/**
 * Generate formatted WhatsApp invoice message for a booking
 */
export function generateWhatsAppInvoiceText(booking) {
  const totalAmt = Number(booking.total_amount || 0).toLocaleString('en-IN');
  const paidAmt = Number(booking.paid_amount || 0).toLocaleString('en-IN');
  const remAmt = Number(booking.remaining_amount || 0).toLocaleString('en-IN');
  
  const paymentBadge = Number(booking.paid_amount) >= Number(booking.total_amount) && Number(booking.total_amount) > 0
    ? 'PAID IN FULL'
    : (Number(booking.paid_amount) > 0 ? 'PARTIAL PAYMENT' : 'PAY ON ARRIVAL / PENDING');

  const lines = [
    `*JOURNEY ARCHITECT* — TOUR BOOKING INVOICE`,
    `========================================`,
    `📋 *Booking Reference:* ${booking.booking_id}`,
    `👤 *Guest Name:* ${booking.customer_name || 'Valued Guest'}`,
    `📞 *Contact Number:* ${booking.customer_phone || 'N/A'}`,
    booking.customer_whatsapp ? `💬 *WhatsApp:* ${booking.customer_whatsapp}` : null,
    ``,
    `🏔️ *Package:* ${booking.package_name || 'Custom Tour Package'}`,
    `📅 *Travel Departure Date:* ${booking.travel_date || 'Flexible'}`,
    booking.return_date ? `🔄 *Return Date:* ${booking.return_date}` : null,
    `👥 *Travelers:* ${booking.adults || 1} Adult(s)${booking.children ? `, ${booking.children} Child(ren)` : ''}`,
    booking.pickup_location ? `📍 *Pickup Point:* ${booking.pickup_location}` : null,
    ``,
    `----------------------------------------`,
    `💰 *BILLING & INVOICE BREAKDOWN*`,
    `• Starting / Total Fare: ₹${totalAmt}`,
    `• Amount Paid: ₹${paidAmt} [${paymentBadge}]`,
    `• Balance Due: ₹${remAmt}`,
    `----------------------------------------`,
    ``,
    `✅ *Booking Status:* ${booking.booking_status || 'CONFIRMED'}`,
    booking.notes ? `📝 *Special Notes:* ${booking.notes}` : null,
    ``,
    `ℹ️ *Payment Instructions:*`,
    `Remaining balance can be settled directly on tour / departure via Cash, UPI, or Net Banking.`,
    ``,
    `🏢 *Journey Architect*`,
    `Govt. MSME UDYAM & WB Trade Licensed Tour Operator`,
    `📍 Tower 02, Flat No - 6B3, Elgin 1, New Batanagar Road, Maheshtala, Batanagar, WB 700140`,
    `📞 Helpline: 79803 31022 / 98303 54307 / 95633 95633`,
    `🌐 Website: https://journeyarchitect.in`
  ].filter(Boolean);

  return lines.join('\n');
}

/**
 * Generate direct WhatsApp URL to send invoice to customer
 */
export function getWhatsAppInvoiceUrl(booking) {
  const targetPhone = booking.customer_whatsapp || booking.customer_phone || booking.whatsapp_number;
  const cleanNumber = formatWhatsAppNumber(targetPhone);
  const message = generateWhatsAppInvoiceText(booking);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Open WhatsApp directly with prefilled invoice message
 */
export function openWhatsAppInvoice(booking) {
  const url = getWhatsAppInvoiceUrl(booking);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
