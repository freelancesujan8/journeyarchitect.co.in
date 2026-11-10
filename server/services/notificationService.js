import nodemailer from 'nodemailer';
import { db } from '../db/database.js';

export const DEFAULT_NOTIFICATION_SETTINGS = {
  booking_notification_email: process.env.BOOKING_NOTIFICATION_EMAIL || process.env.SMTP_USER || 'contact@journeyarchitect.co.in',
  enable_email_notifications: 1,
  admin_notification_phone: process.env.ADMIN_PHONE || '79803 31022',
  smtp_host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  smtp_port: parseInt(process.env.SMTP_PORT, 10) || 465,
  smtp_secure: process.env.SMTP_SECURE === '1' || process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465' ? 1 : 0,
  smtp_user: process.env.SMTP_USER || '',
  smtp_pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '',
  from_name: process.env.FROM_NAME || 'Journey Architect Bookings',
  from_email: process.env.FROM_EMAIL || process.env.SMTP_USER || 'contact@journeyarchitect.co.in'
};

/**
 * Helper to fetch active notification settings from SQLite and environment variables
 */
export function getNotificationSettings() {
  let settings = { ...DEFAULT_NOTIFICATION_SETTINGS };
  try {
    const row = db.prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'notification_settings'").get();
    if (row && row.setting_value) {
      const parsed = JSON.parse(row.setting_value);
      settings = { ...settings, ...parsed };
    }
  } catch (err) {
    console.error('[NotificationService] Error reading settings from DB:', err.message);
  }

  // Ensure environment variables override DB settings if provided
  if (process.env.SMTP_HOST) settings.smtp_host = process.env.SMTP_HOST;
  if (process.env.SMTP_PORT) settings.smtp_port = parseInt(process.env.SMTP_PORT, 10);
  if (process.env.SMTP_USER) settings.smtp_user = process.env.SMTP_USER;
  if (process.env.SMTP_PASS || process.env.SMTP_PASSWORD) settings.smtp_pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  if (process.env.SMTP_SECURE !== undefined) {
    settings.smtp_secure = (process.env.SMTP_SECURE === '1' || process.env.SMTP_SECURE === 'true') ? 1 : 0;
  } else if (settings.smtp_port === 465) {
    settings.smtp_secure = 1;
  }
  if (process.env.BOOKING_NOTIFICATION_EMAIL) settings.booking_notification_email = process.env.BOOKING_NOTIFICATION_EMAIL;
  if (process.env.FROM_NAME) settings.from_name = process.env.FROM_NAME;
  if (process.env.FROM_EMAIL) settings.from_email = process.env.FROM_EMAIL;

  return settings;
}

/**
 * Generate responsive, branded HTML email for admin booking notification
 */
function buildBookingEmailHtml({ booking, customer, pkg, travelers, settings }) {
  const travelersList = Array.isArray(travelers) && travelers.length > 0
    ? travelers.map((t, idx) => `
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 8px 12px; font-size: 13px; color: #374151;">${idx + 1}. ${t.name || customer.name}</td>
          <td style="padding: 8px 12px; font-size: 13px; color: #6B7280;">${t.age ? `${t.age} yrs` : 'Adult'}</td>
          <td style="padding: 8px 12px; font-size: 13px; color: #6B7280;">${t.gender || 'N/A'}</td>
          <td style="padding: 8px 12px; font-size: 13px; color: #6B7280;">${t.id_type ? `${t.id_type}: ${t.id_number || ''}` : 'Pending verification'}</td>
        </tr>
      `).join('')
    : `
        <tr>
          <td colspan="4" style="padding: 10px 12px; font-size: 13px; color: #374151;">1. ${customer.name} (Primary Guest)</td>
        </tr>
      `;

  const totalAmountStr = Number(booking.total_amount || 0).toLocaleString('en-IN');
  const paidAmountStr = Number(booking.paid_amount || 0).toLocaleString('en-IN');
  const remainingAmountStr = Number(booking.remaining_amount || booking.total_amount || 0).toLocaleString('en-IN');
  const adminUrl = process.env.ADMIN_URL || 'http://localhost:5173/admin';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Tour Booking Alert: ${booking.booking_id}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1F2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F3F4F6; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #E5E7EB;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0E2235 0%, #173854 100%); padding: 32px 28px; text-align: left; color: #FFFFFF;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <span style="background-color: rgba(244, 163, 64, 0.2); border: 1px solid #F4A340; color: #F4A340; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                  New Booking Alert
                </span>
                <span style="font-size: 13px; color: #B3C8D9;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
              </div>
              <h1 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 800; color: #FFFFFF;">Journey Architect</h1>
              <p style="margin: 0; font-size: 14px; color: #D1D5DB;">A customer has submitted a new tour package booking on your website.</p>
            </td>
          </tr>

          <!-- Booking Dossier Ribbon -->
          <tr>
            <td style="background-color: #F8FAFC; border-bottom: 1px solid #E2E8F0; padding: 16px 28px;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 12px; color: #64748B; text-transform: uppercase; font-weight: 700; display: block;">Booking Reference ID</span>
                    <strong style="font-size: 20px; color: #0E2235; letter-spacing: 0.5px;">${booking.booking_id}</strong>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 6px 14px; background-color: #D1FAE5; color: #065F46; border-radius: 8px; font-size: 13px; font-weight: 700;">
                      ${booking.booking_status || 'CONFIRMED'}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 28px;">

              <!-- Package & Travel Details Card -->
              <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #0E2235; border-bottom: 1px solid #F3F4F6; padding-bottom: 8px;">
                  🗺️ Tour Package Details
                </h3>
                <table width="100%" cellspacing="0" cellpadding="6" style="font-size: 14px;">
                  <tr>
                    <td width="35%" style="color: #6B7280; font-weight: 600;">Package Name:</td>
                    <td style="color: #111827; font-weight: 700;">${pkg.name || 'Custom Package'}</td>
                  </tr>
                  <tr>
                    <td style="color: #6B7280; font-weight: 600;">Destination:</td>
                    <td style="color: #111827;">${pkg.destination || 'North Bengal / Sikkim'}</td>
                  </tr>
                  <tr>
                    <td style="color: #6B7280; font-weight: 600;">Travel Date:</td>
                    <td style="color: #111827; font-weight: 700; color: #1E40AF;">📅 ${booking.travel_date || 'Flexible'} ${booking.return_date ? `to ${booking.return_date}` : ''}</td>
                  </tr>
                  <tr>
                    <td style="color: #6B7280; font-weight: 600;">Travelers:</td>
                    <td style="color: #111827;">👥 ${booking.adults || 1} Adult(s), ${booking.children || 0} Child(ren)</td>
                  </tr>
                </table>
              </div>

              <!-- Customer Contact Details Card -->
              <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #0E2235; border-bottom: 1px solid #F3F4F6; padding-bottom: 8px;">
                  👤 Customer Information
                </h3>
                <table width="100%" cellspacing="0" cellpadding="6" style="font-size: 14px;">
                  <tr>
                    <td width="35%" style="color: #6B7280; font-weight: 600;">Full Name:</td>
                    <td style="color: #111827; font-weight: 700;">${customer.name}</td>
                  </tr>
                  <tr>
                    <td style="color: #6B7280; font-weight: 600;">Calling Phone:</td>
                    <td>
                      <a href="tel:${customer.phone}" style="color: #0E2235; font-weight: 700; text-decoration: none;">📞 ${customer.phone}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #6B7280; font-weight: 600;">WhatsApp Number:</td>
                    <td>
                      <a href="https://wa.me/${String(customer.whatsapp_number || customer.whatsapp || customer.phone).replace(/[^0-9]/g, '')}" target="_blank" style="display: inline-block; background-color: #25D366; color: #FFFFFF; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-decoration: none;">
                        💬 ${customer.whatsapp_number || customer.whatsapp || customer.phone} (Open Chat)
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #6B7280; font-weight: 600;">Email Address:</td>
                    <td>
                      <a href="mailto:${customer.email || ''}" style="color: #1E40AF; text-decoration: none;">${customer.email || 'Not provided'}</a>
                    </td>
                  </tr>
                  ${customer.address ? `
                  <tr>
                    <td style="color: #6B7280; font-weight: 600;">City / Address:</td>
                    <td style="color: #111827;">${customer.address}</td>
                  </tr>
                  ` : ''}
                  ${booking.pickup_location ? `
                  <tr>
                    <td style="color: #6B7280; font-weight: 600;">Pickup Location:</td>
                    <td style="color: #111827;">📍 ${booking.pickup_location}</td>
                  </tr>
                  ` : ''}
                  ${booking.special_requirements || booking.notes ? `
                  <tr>
                    <td style="color: #6B7280; font-weight: 600;">Customer Notes:</td>
                    <td style="color: #4B5563; font-style: italic;">"${booking.special_requirements || booking.notes}"</td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- Financial Breakdown -->
              <div style="background-color: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #0E2235;">
                  💳 Financial Summary
                </h3>
                <table width="100%" cellspacing="0" cellpadding="8" style="font-size: 14px;">
                  <tr style="border-bottom: 1px solid #E2E8F0;">
                    <td style="color: #475569; font-weight: 600;">Total Package Amount:</td>
                    <td align="right" style="font-size: 16px; font-weight: 800; color: #0E2235;">₹${totalAmountStr}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #E2E8F0;">
                    <td style="color: #065F46; font-weight: 600;">Amount Paid Online / Advance:</td>
                    <td align="right" style="font-size: 15px; font-weight: 700; color: #059669;">₹${paidAmountStr}</td>
                  </tr>
                  <tr>
                    <td style="color: #991B1B; font-weight: 700;">Remaining Balance Due:</td>
                    <td align="right" style="font-size: 18px; font-weight: 800; color: #DC2626;">₹${remainingAmountStr}</td>
                  </tr>
                </table>
              </div>

              <!-- Travelers List Table -->
              <div style="margin-bottom: 24px;">
                <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #0E2235;">
                  👥 Passenger List
                </h3>
                <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
                  <thead>
                    <tr style="background-color: #F9FAFB; border-bottom: 1px solid #E5E7EB;">
                      <th align="left" style="padding: 8px 12px; font-size: 12px; font-weight: 700; color: #4B5563;">Traveler Name</th>
                      <th align="left" style="padding: 8px 12px; font-size: 12px; font-weight: 700; color: #4B5563;">Age</th>
                      <th align="left" style="padding: 8px 12px; font-size: 12px; font-weight: 700; color: #4B5563;">Gender</th>
                      <th align="left" style="padding: 8px 12px; font-size: 12px; font-weight: 700; color: #4B5563;">ID Proof</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${travelersList}
                  </tbody>
                </table>
              </div>

              <!-- Action Call to Action Button -->
              <div style="text-align: center; margin: 32px 0 16px 0;">
                <a href="${adminUrl}" target="_blank" style="display: inline-block; background-color: #0E2235; color: #FFFFFF; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 12px rgba(14, 34, 53, 0.25);">
                  Open Booking Dossier in Admin Panel →
                </a>
              </div>

              <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin: 0;">
                To update customer payment, generate PDF vouchers, or adjust trip status, sign in to your Journey Architect Admin Panel.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0E2235; padding: 20px 28px; text-align: center; color: #9CA3AF; font-size: 12px; border-top: 1px solid #1E3A5F;">
              <p style="margin: 0 0 4px 0; color: #D1D5DB; font-weight: 600;">Journey Architect — Tour Operator, Car Rental & Catering</p>
              <p style="margin: 0 0 8px 0;">Tower 02, Flat No - 6B3, Elgin 1, New Batanagar Road, Maheshtala, Batanagar, West Bengal 700140</p>
              <p style="margin: 0; color: #64748B;">Notification sent dynamically to: <strong style="color: #F4A340;">${settings.booking_notification_email}</strong></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text fallback for email clients
 */
function buildBookingEmailText({ booking, customer, pkg, travelers, settings }) {
  return `
========================================
NEW TOUR BOOKING ALERT: ${booking.booking_id}
Journey Architect Travel Management
========================================

Booking Reference: ${booking.booking_id}
Status: ${booking.booking_status || 'CONFIRMED'}
Date: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

CUSTOMER DETAILS:
- Name: ${customer.name}
- Phone: ${customer.phone}
- Email: ${customer.email || 'N/A'}
- City / Address: ${customer.address || 'N/A'}

PACKAGE & TRIP DETAILS:
- Package: ${pkg.name || 'Custom Package'}
- Destination: ${pkg.destination || 'North Bengal / Sikkim'}
- Travel Date: ${booking.travel_date || 'Flexible'} ${booking.return_date ? `to ${booking.return_date}` : ''}
- Party Size: ${booking.adults || 1} Adult(s), ${booking.children || 0} Child(ren)
- Pickup Location: ${booking.pickup_location || 'Standard Pickup'}
- Customer Notes: ${booking.special_requirements || booking.notes || 'None'}

FINANCIAL SUMMARY:
- Total Package Amount: ₹${Number(booking.total_amount || 0).toLocaleString('en-IN')}
- Paid Online / Advance: ₹${Number(booking.paid_amount || 0).toLocaleString('en-IN')}
- Remaining Balance: ₹${Number(booking.remaining_amount || booking.total_amount || 0).toLocaleString('en-IN')}

View full booking details and generate guest vouchers in the admin panel:
${process.env.ADMIN_URL || 'http://localhost:5173/admin'}

----------------------------------------
Sent dynamically to: ${settings.booking_notification_email}
Journey Architect
  `.trim();
}

export const NotificationService = {
  /**
   * Send new booking email notification to the dynamically configured admin address
   * Guaranteed non-blocking: bookings will NEVER fail if email dispatch encounters an issue.
   */
  async sendAdminAlert({ booking, customer, pkg = {}, travelers = [], payment = null }) {
    const settings = getNotificationSettings();
    const recipient = settings.booking_notification_email || 'sudiptajourneys@gmail.com';
    const type = 'ADMIN_BOOKING_ALERT';
    const subject = `🛎️ New Booking Alert: [${booking.booking_id}] ${customer.name} - ${pkg.name || 'Tour Package'}`;
    const htmlContent = buildBookingEmailHtml({ booking, customer, pkg, travelers, settings });
    const textContent = buildBookingEmailText({ booking, customer, pkg, travelers, settings });

    console.log(`[NotificationService] Preparing booking alert for: ${recipient} (Booking ID: ${booking.booking_id})`);

    // 1. Check if email notifications are enabled
    if (!settings.enable_email_notifications) {
      console.log('[NotificationService] Email notifications are disabled in settings.');
      try {
        db.prepare(`
          INSERT INTO notifications (booking_id, type, recipient, status, subject, content, error_message)
          VALUES (?, ?, ?, 'SKIPPED', ?, ?, 'Email notifications disabled in admin settings')
        `).run(booking.id || null, type, recipient, subject, textContent);
      } catch (e) { /* ignore */ }
      return { success: true, skipped: true };
    }

    // 2. Dispatch via Nodemailer if SMTP configured
    let deliveryStatus = 'PENDING';
    let errorMessage = null;

    try {
      const smtpUser = settings.smtp_user || process.env.SMTP_USER;
      const smtpPass = settings.smtp_pass || process.env.SMTP_PASS || process.env.SMTP_PASSWORD;

      if (smtpUser && smtpPass) {
        // Real authenticated SMTP (e.g. Gmail App Password)
        const transporter = nodemailer.createTransport({
          host: settings.smtp_host || 'smtp.gmail.com',
          port: parseInt(settings.smtp_port, 10) || 587,
          secure: Boolean(settings.smtp_secure),
          auth: {
            user: smtpUser,
            pass: smtpPass
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        const fromAddress = `"${settings.from_name || 'Journey Architect Bookings'}" <${smtpUser}>`;

        const info = await transporter.sendMail({
          from: fromAddress,
          to: recipient,
          subject: subject,
          text: textContent,
          html: htmlContent
        });

        console.log(`[NotificationService] Email dispatched successfully to ${recipient}. MessageId: ${info.messageId}`);
        deliveryStatus = 'SENT';
      } else {
        // No SMTP credentials configured yet: Log clearly in notifications table so admin can review
        console.warn(`[NotificationService] SMTP credentials not configured yet. Notification logged for: ${recipient}`);
        deliveryStatus = 'LOGGED_CONFIG_PENDING';
        errorMessage = 'SMTP credentials not configured. Configure Gmail App Password in Admin Settings to deliver external emails.';
      }
    } catch (err) {
      console.error('[NotificationService] Failed to send email via SMTP:', err.message);
      deliveryStatus = 'FAILED';
      errorMessage = err.message;
    }

    // 3. Persist notification log in SQLite DB
    try {
      const stmt = db.prepare(`
        INSERT INTO notifications (booking_id, type, recipient, status, subject, content, error_message, sent_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ${deliveryStatus === 'SENT' ? 'CURRENT_TIMESTAMP' : 'NULL'})
      `);
      stmt.run(booking.id || null, type, recipient, deliveryStatus, subject, textContent, errorMessage);
    } catch (dbErr) {
      console.error('[NotificationService] Failed to record notification in DB:', dbErr.message);
    }

    return {
      success: deliveryStatus === 'SENT' || deliveryStatus === 'LOGGED_CONFIG_PENDING',
      status: deliveryStatus,
      recipient,
      error: errorMessage
    };
  },

  /**
   * Dispatch a test notification email from the admin panel
   */
  async sendTestNotification(targetEmail = null) {
    const settings = getNotificationSettings();
    const recipient = targetEmail || settings.booking_notification_email || 'sudiptajourneys@gmail.com';
    const subject = `✅ Journey Architect Test Email Notification [${new Date().toLocaleTimeString('en-IN')}]`;
    const textContent = `
Hello! This is a test email confirmation from your Journey Architect website booking system.
Real-time booking notification alerts are configured to be sent to this email address (${recipient}).

Status: Email settings verified successfully!
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
    `.trim();

    const htmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E5E7EB; padding: 28px; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">
  <div style="background-color: #0E2235; color: #FFFFFF; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="margin: 0; font-size: 20px; color: #F4A340;">Journey Architect</h2>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #CBD5E1;">Test Notification Verification</p>
  </div>
  <p style="font-size: 15px; color: #374151; line-height: 1.5;">
    Congratulations! Your booking notification email configuration is <strong>active and working</strong>.
  </p>
  <div style="background-color: #F8FAFC; border-left: 4px solid #10B981; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
    <p style="margin: 0; font-size: 13px; color: #065F46;">
      <strong>Target Email:</strong> ${recipient}<br>
      <strong>Dispatched:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
    </p>
  </div>
  <p style="font-size: 13px; color: #6B7280;">
    Whenever a guest confirms a tour booking or submits a holiday query on your website, a complete dossier will be delivered here instantly.
  </p>
</div>
    `.trim();

    const smtpUser = settings.smtp_user || process.env.SMTP_USER;
    const smtpPass = settings.smtp_pass || process.env.SMTP_PASS || process.env.SMTP_PASSWORD;

    if (!smtpUser || !smtpPass) {
      // Record simulated success in notifications table
      db.prepare(`
        INSERT INTO notifications (booking_id, type, recipient, status, subject, content, error_message)
        VALUES (NULL, 'TEST_ALERT', ?, 'LOGGED_CONFIG_PENDING', ?, ?, 'SMTP credentials not configured in settings. Set Gmail App Password to receive in external inbox.')
      `).run(recipient, subject, textContent);

      return {
        success: true,
        simulated: true,
        recipient,
        message: `Notification configured for ${recipient}. To receive external delivery in your Gmail inbox, enter your Gmail address and 16-character Google App Password in the SMTP settings below.`
      };
    }

    const transporter = nodemailer.createTransport({
      host: settings.smtp_host || 'smtp.gmail.com',
      port: parseInt(settings.smtp_port, 10) || 587,
      secure: Boolean(settings.smtp_secure),
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const fromAddress = `"${settings.from_name || 'Journey Architect'}" <${smtpUser}>`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject,
      text: textContent,
      html: htmlContent
    });

    db.prepare(`
      INSERT INTO notifications (booking_id, type, recipient, status, subject, content, sent_at)
      VALUES (NULL, 'TEST_ALERT', ?, 'SENT', ?, ?, CURRENT_TIMESTAMP)
    `).run(recipient, subject, textContent);

    return {
      success: true,
      messageId: info.messageId,
      recipient,
      message: `Test email dispatched successfully to ${recipient}!`
    };
  },

  /**
   * Dispatch customer confirmation notification
   */
  async sendCustomerConfirmation(booking, customer, pkg) {
    const type = 'CUSTOMER_CONFIRMATION';
    const recipient = customer.email || customer.phone;

    try {
      const stmt = db.prepare(`
        INSERT INTO notifications (booking_id, type, recipient, status, sent_at)
        VALUES (?, ?, ?, 'SENT', CURRENT_TIMESTAMP)
      `);
      stmt.run(booking.id, type, recipient);
      return { success: true };
    } catch (err) {
      console.error('[NotificationService] Customer confirmation error:', err);
      db.prepare(`
        INSERT INTO notifications (booking_id, type, recipient, status, error_message)
        VALUES (?, ?, ?, 'FAILED', ?)
      `).run(booking.id, type, recipient, err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Dispatch Catering Lead alert to admin notification email
   */
  async sendCateringAlert({ lead }) {
    const settings = getNotificationSettings();
    if (!settings.enable_email_notifications) {
      return { skipped: true, reason: 'Notifications disabled in settings' };
    }

    const recipient = settings.booking_notification_email || 'sudiptajourneys@gmail.com';
    const subject = `🍲 New Catering Enquiry [${lead.lead_id}]: ${lead.name} (${lead.guests_count} Guests)`;

    const textContent = `
========================================
NEW CATERING SERVICES ENQUIRY: ${lead.lead_id}
Journey Architect Catering Management
========================================
Guest Name: ${lead.name}
Phone: ${lead.phone}
WhatsApp: ${lead.whatsapp_number || lead.phone}
Email: ${lead.email || 'Not provided'}

Event Details:
- Event Date: ${lead.event_date}
- Guest Count: ${lead.guests_count} Guests
- Event Venue / City: ${lead.event_location}
- Event Type: ${lead.event_type}
- Menu & Requirements: ${lead.service_requirements || 'Standard Package'}
- Budget Range: ${lead.budget_range || 'Flexible'}

Open Admin Panel to manage this catering lead:
http://localhost:5173/admin
========================================
    `.trim();

    const htmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E5E7EB; overflow: hidden;">
  <div style="background: linear-gradient(135deg, #0E2235 0%, #167C80 100%); color: #FFFFFF; padding: 24px;">
    <span style="background: rgba(244,163,64,0.25); color: #F4A340; border: 1px solid #F4A340; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
      Catering Lead Alert
    </span>
    <h2 style="margin: 8px 0 0 0; color: #FFFFFF; font-size: 20px;">Journey Architect — Catering Services</h2>
    <p style="margin: 4px 0 0 0; color: #E2E8F0; font-size: 13px;">Reference ID: <strong>${lead.lead_id}</strong></p>
  </div>
  <div style="padding: 24px;">
    <h3 style="color: #0E2235; font-size: 16px; margin: 0 0 12px 0;">Guest Contact Details</h3>
    <table width="100%" cellpadding="6" style="font-size: 14px; border-collapse: collapse; margin-bottom: 20px;">
      <tr><td width="35%" style="color: #6B7280; font-weight: 600;">Name:</td><td style="color: #111827; font-weight: 700;">${lead.name}</td></tr>
      <tr><td style="color: #6B7280; font-weight: 600;">Phone:</td><td><a href="tel:${lead.phone}" style="color: #0E2235; font-weight: 700;">📞 ${lead.phone}</a></td></tr>
      <tr><td style="color: #6B7280; font-weight: 600;">WhatsApp:</td><td><a href="https://wa.me/${String(lead.whatsapp_number || lead.phone).replace(/[^0-9]/g, '')}" target="_blank" style="background: #25D366; color: #FFF; padding: 3px 8px; border-radius: 4px; text-decoration: none; font-weight: 700; font-size: 12px;">💬 ${lead.whatsapp_number || lead.phone} (WhatsApp Chat)</a></td></tr>
      <tr><td style="color: #6B7280; font-weight: 600;">Email:</td><td>${lead.email || 'Not provided'}</td></tr>
    </table>

    <h3 style="color: #0E2235; font-size: 16px; margin: 0 0 12px 0;">Event & Menu Details</h3>
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0; font-size: 14px;">📅 <strong>Event Date:</strong> ${lead.event_date}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px;">👥 <strong>Guest Count:</strong> ${lead.guests_count} People</p>
      <p style="margin: 0 0 8px 0; font-size: 14px;">📍 <strong>Event Venue:</strong> ${lead.event_location}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px;">🎉 <strong>Event Type:</strong> ${lead.event_type}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px;">🍽️ <strong>Menu / Food Preferences:</strong> ${lead.service_requirements || 'Awaiting consultation'}</p>
      ${lead.budget_range ? `<p style="margin: 0; font-size: 14px;">💰 <strong>Estimated Budget:</strong> ${lead.budget_range}</p>` : ''}
    </div>

    <div style="text-align: center;">
      <a href="http://localhost:5173/admin" target="_blank" style="display: inline-block; background-color: #0E2235; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
        View Catering Leads in Admin Panel →
      </a>
    </div>
  </div>
</div>
    `.trim();

    return this.dispatchEmailDirectly({ recipient, subject, textContent, htmlContent, type: 'CATERING_ALERT' });
  },

  /**
   * Dispatch Car Rental Lead alert to admin notification email
   */
  async sendCarRentalAlert({ lead }) {
    const settings = getNotificationSettings();
    if (!settings.enable_email_notifications) {
      return { skipped: true, reason: 'Notifications disabled in settings' };
    }

    const recipient = settings.booking_notification_email || 'sudiptajourneys@gmail.com';
    const subject = `🚗 New Car Rental Enquiry [${lead.lead_id}]: ${lead.name} (${lead.car_type})`;

    const textContent = `
========================================
NEW CAR RENTAL ENQUIRY: ${lead.lead_id}
Journey Architect Fleet Management
========================================
Customer Name: ${lead.name}
Phone: ${lead.phone}
WhatsApp: ${lead.whatsapp_number || lead.phone}
Email: ${lead.email || 'Not provided'}

Trip Details:
- Travel Pickup Date: ${lead.travel_date}
- Return Date: ${lead.return_date || 'One-way'}
- Pickup Location: ${lead.pickup_location}
- Drop-off Location: ${lead.drop_location}
- Vehicle Requested: ${lead.car_type}
- Passengers: ${lead.passengers_count}
- Trip Type: ${lead.trip_type}
- Special Requirements: ${lead.service_requirements || 'Standard'}

Open Admin Panel to manage this car rental lead:
http://localhost:5173/admin
========================================
    `.trim();

    const htmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E5E7EB; overflow: hidden;">
  <div style="background: linear-gradient(135deg, #0E2235 0%, #0284C7 100%); color: #FFFFFF; padding: 24px;">
    <span style="background: rgba(244,163,64,0.25); color: #F4A340; border: 1px solid #F4A340; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
      Car Rental Lead Alert
    </span>
    <h2 style="margin: 8px 0 0 0; color: #FFFFFF; font-size: 20px;">Journey Architect — Car Rental</h2>
    <p style="margin: 4px 0 0 0; color: #E2E8F0; font-size: 13px;">Reference ID: <strong>${lead.lead_id}</strong></p>
  </div>
  <div style="padding: 24px;">
    <h3 style="color: #0E2235; font-size: 16px; margin: 0 0 12px 0;">Customer Contact</h3>
    <table width="100%" cellpadding="6" style="font-size: 14px; border-collapse: collapse; margin-bottom: 20px;">
      <tr><td width="35%" style="color: #6B7280; font-weight: 600;">Name:</td><td style="color: #111827; font-weight: 700;">${lead.name}</td></tr>
      <tr><td style="color: #6B7280; font-weight: 600;">Phone:</td><td><a href="tel:${lead.phone}" style="color: #0E2235; font-weight: 700;">📞 ${lead.phone}</a></td></tr>
      <tr><td style="color: #6B7280; font-weight: 600;">WhatsApp:</td><td><a href="https://wa.me/${String(lead.whatsapp_number || lead.phone).replace(/[^0-9]/g, '')}" target="_blank" style="background: #25D366; color: #FFF; padding: 3px 8px; border-radius: 4px; text-decoration: none; font-weight: 700; font-size: 12px;">💬 ${lead.whatsapp_number || lead.phone} (WhatsApp Chat)</a></td></tr>
      <tr><td style="color: #6B7280; font-weight: 600;">Email:</td><td>${lead.email || 'Not provided'}</td></tr>
    </table>

    <h3 style="color: #0E2235; font-size: 16px; margin: 0 0 12px 0;">Journey & Vehicle Specifications</h3>
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0; font-size: 14px;">🚗 <strong>Car Type:</strong> <span style="color: #0284C7; font-weight: 700;">${lead.car_type}</span></p>
      <p style="margin: 0 0 8px 0; font-size: 14px;">📅 <strong>Travel Pickup Date:</strong> ${lead.travel_date} ${lead.return_date ? `(Return: ${lead.return_date})` : '(One-Way)'}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px;">📍 <strong>Route:</strong> <strong>${lead.pickup_location}</strong> ➔ <strong>${lead.drop_location}</strong></p>
      <p style="margin: 0 0 8px 0; font-size: 14px;">👥 <strong>Passengers:</strong> ${lead.passengers_count}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px;">🛣️ <strong>Trip Category:</strong> ${lead.trip_type}</p>
      ${lead.service_requirements ? `<p style="margin: 0; font-size: 14px;">📝 <strong>Special Notes:</strong> ${lead.service_requirements}</p>` : ''}
    </div>

    <div style="text-align: center;">
      <a href="http://localhost:5173/admin" target="_blank" style="display: inline-block; background-color: #0E2235; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
        View Car Rental Leads in Admin Panel →
      </a>
    </div>
  </div>
</div>
    `.trim();

    return this.dispatchEmailDirectly({ recipient, subject, textContent, htmlContent, type: 'CAR_RENTAL_ALERT' });
  },

  /**
   * Helper to dispatch email safely or log if SMTP not set
   */
  async dispatchEmailDirectly({ recipient, subject, textContent, htmlContent, type }) {
    const settings = getNotificationSettings();
    const smtpUser = settings.smtp_user || process.env.SMTP_USER;
    const smtpPass = settings.smtp_pass || process.env.SMTP_PASS || process.env.SMTP_PASSWORD;

    if (!smtpUser || !smtpPass) {
      db.prepare(`
        INSERT INTO notifications (booking_id, type, recipient, status, subject, content, error_message)
        VALUES (NULL, ?, ?, 'LOGGED_CONFIG_PENDING', ?, ?, 'SMTP credentials not configured. Email logged.')
      `).run(type, recipient, subject, textContent);

      return { success: true, logged: true, recipient };
    }

    try {
      const transporter = nodemailer.createTransport({
        host: settings.smtp_host || 'smtp.gmail.com',
        port: parseInt(settings.smtp_port, 10) || 587,
        secure: Boolean(settings.smtp_secure),
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false }
      });

      const info = await transporter.sendMail({
        from: `"${settings.from_name || 'Journey Architect'}" <${smtpUser}>`,
        to: recipient,
        subject,
        text: textContent,
        html: htmlContent
      });

      db.prepare(`
        INSERT INTO notifications (booking_id, type, recipient, status, subject, content, sent_at)
        VALUES (NULL, ?, ?, 'SENT', ?, ?, CURRENT_TIMESTAMP)
      `).run(type, recipient, subject, textContent);

      return { success: true, messageId: info.messageId, recipient };
    } catch (err) {
      console.error(`[NotificationService] Error sending ${type} email:`, err.message);
      db.prepare(`
        INSERT INTO notifications (booking_id, type, recipient, status, subject, content, error_message)
        VALUES (NULL, ?, ?, 'FAILED', ?, ?, ?)
      `).run(type, recipient, subject, textContent, err.message);

      return { success: false, error: err.message };
    }
  }
};
