import express from 'express';
import { db } from '../db/database.js';
import { NotificationService } from '../services/notificationService.js';

export const homestaysRouter = express.Router();

function safeParseJson(data, fallback = []) {
  if (!data) return fallback;
  if (typeof data === 'object') return data;
  try {
    const parsed = JSON.parse(data);
    return parsed;
  } catch {
    return fallback;
  }
}

/**
 * GET /api/homestays/settings — Public settings check (Enabled / Disabled)
 */
homestaysRouter.get('/settings', (req, res) => {
  try {
    const row = db.prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'homestay_settings'").get();
    let settings = {
      enabled: 1,
      section_title: 'Handpicked Mountain & Forest Homestays',
      section_subtitle: 'Experience authentic Himalayan warmth, organic local home-cooked feasts, and peaceful offbeat stays curated by Journey Architect.'
    };
    if (row && row.setting_value) {
      settings = { ...settings, ...JSON.parse(row.setting_value) };
    }
    res.json({ success: true, settings });
  } catch (err) {
    console.error('Error fetching homestay settings:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch settings' });
  }
});

/**
 * GET /api/homestays — Fetch all active homestays for public website
 */
homestaysRouter.get('/', (req, res) => {
  try {
    // 1. Check if homestays feature is toggled ON or OFF
    const settingRow = db.prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'homestay_settings'").get();
    let isEnabled = true;
    let settingsObj = {
      enabled: 1,
      section_title: 'Handpicked Mountain & Forest Homestays',
      section_subtitle: 'Experience authentic Himalayan warmth, organic local home-cooked feasts, and peaceful offbeat stays curated by Journey Architect.'
    };

    if (settingRow && settingRow.setting_value) {
      try {
        const parsed = JSON.parse(settingRow.setting_value);
        settingsObj = { ...settingsObj, ...parsed };
        isEnabled = parsed.enabled === 1 || parsed.enabled === true || parsed.enabled === '1';
      } catch (e) {}
    }

    // If disabled by admin, return empty list with enabled: false
    if (!isEnabled) {
      return res.json({
        success: true,
        enabled: false,
        settings: settingsObj,
        homestays: []
      });
    }

    const rows = db.prepare(`
      SELECT * FROM homestays 
      WHERE is_active = 1 
      ORDER BY featured DESC, display_order ASC, id ASC
    `).all();

    const homestays = rows.map((h) => ({
      ...h,
      amenities: safeParseJson(h.amenities, []),
      gallery_images: safeParseJson(h.gallery_images, []),
      food_menu: safeParseJson(h.food_menu, []),
      nearby_attractions: safeParseJson(h.nearby_attractions, [])
    }));

    res.json({
      success: true,
      enabled: true,
      settings: settingsObj,
      count: homestays.length,
      homestays
    });
  } catch (err) {
    console.error('Error fetching homestays:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch homestays' });
  }
});

/**
 * GET /api/homestays/:slug — Fetch single homestay details
 */
homestaysRouter.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const row = db.prepare("SELECT * FROM homestays WHERE (slug = ? OR homestay_id = ? OR id = ?) AND is_active = 1").get(slug, slug, slug);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Homestay not found' });
    }

    res.json({
      success: true,
      homestay: {
        ...row,
        amenities: safeParseJson(row.amenities, []),
        gallery_images: safeParseJson(row.gallery_images, []),
        food_menu: safeParseJson(row.food_menu, []),
        nearby_attractions: safeParseJson(row.nearby_attractions, [])
      }
    });
  } catch (err) {
    console.error('Error fetching homestay details:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch homestay' });
  }
});

/**
 * POST /api/homestays/book — Public booking request for a homestay
 */
homestaysRouter.post('/book', async (req, res) => {
  try {
    const {
      homestay_id,
      guest_name = '',
      phone = '',
      whatsapp_number = '',
      whatsapp = '',
      email = '',
      check_in = '',
      check_out = '',
      guests_count = 2,
      rooms_count = 1,
      special_requests = ''
    } = req.body;

    // 1. Basic validation
    if (!guest_name.trim()) {
      return res.status(400).json({ success: false, error: 'Please enter your full name.' });
    }
    if (!phone.trim() || phone.trim().length < 8) {
      return res.status(400).json({ success: false, error: 'Please enter a valid phone number.' });
    }
    if (!check_in) {
      return res.status(400).json({ success: false, error: 'Please select a check-in date.' });
    }
    if (!check_out) {
      return res.status(400).json({ success: false, error: 'Please select a check-out date.' });
    }

    const homestay = db.prepare("SELECT * FROM homestays WHERE id = ? OR homestay_id = ?").get(homestay_id, homestay_id);
    if (!homestay) {
      return res.status(404).json({ success: false, error: 'Selected homestay property was not found.' });
    }

    // 2. Compute nights & amounts
    const inDate = new Date(check_in);
    const outDate = new Date(check_out);
    let diffDays = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
    if (isNaN(diffDays) || diffDays < 1) diffDays = 1;

    const rooms = parseInt(rooms_count, 10) || 1;
    const guests = parseInt(guests_count, 10) || 2;
    const pricePerNight = Number(homestay.price_per_night) || 1500;
    const totalAmount = pricePerNight * diffDays * rooms;
    const advancePercent = homestay.booking_advance_percent || 25;
    const advanceAmount = Math.round((totalAmount * advancePercent) / 100);

    // 3. Generate unique Booking ID
    const countRow = db.prepare('SELECT COUNT(*) as count FROM homestay_bookings').get();
    const nextSeq = (countRow ? countRow.count : 0) + 1;
    const bookingId = `JA-HOME-${new Date().getFullYear()}-${String(nextSeq).padStart(4, '0')}`;

    const cleanWhatsapp = (whatsapp_number || whatsapp || phone).trim().replace(/[^0-9+]/g, '');

    // 4. Save to database
    const stmt = db.prepare(`
      INSERT INTO homestay_bookings (
        booking_id, homestay_id, homestay_name, guest_name, phone, whatsapp_number, email,
        check_in, check_out, nights, guests_count, rooms_count, total_amount, advance_amount,
        booking_status, payment_status, special_requests
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        'PENDING', 'PENDING', ?
      )
    `);

    const result = stmt.run(
      bookingId,
      homestay.id,
      homestay.name,
      guest_name.trim(),
      phone.trim(),
      cleanWhatsapp,
      email.trim(),
      check_in,
      check_out,
      diffDays,
      guests,
      rooms,
      totalAmount,
      advanceAmount,
      special_requests.trim()
    );

    // 5. Fire async notification
    try {
      if (NotificationService && NotificationService.sendGenericNotification) {
        NotificationService.sendGenericNotification({
          type: 'HOMESTAY_BOOKING',
          recipient: process.env.BOOKING_NOTIFICATION_EMAIL || process.env.SMTP_USER || 'contact@journeyarchitect.co.in',
          subject: `🏡 New Homestay Booking Request: ${homestay.name} (${bookingId})`,
          textContent: `New Homestay Booking Request received!\n\nBooking ID: ${bookingId}\nHomestay: ${homestay.name} (${homestay.location})\nGuest: ${guest_name}\nPhone: ${phone}\nCheck-in: ${check_in}\nCheck-out: ${check_out} (${diffDays} night(s))\nGuests: ${guests} | Rooms: ${rooms}\nTotal Amount: ₹${totalAmount.toLocaleString('en-IN')}\nAdvance Required: ₹${advanceAmount.toLocaleString('en-IN')}\nNotes: ${special_requests || 'None'}`
        }).catch(() => {});
      }
    } catch (e) {}

    res.json({
      success: true,
      message: 'Homestay booking request submitted successfully!',
      booking: {
        id: result.lastInsertRowid,
        booking_id: bookingId,
        homestay_name: homestay.name,
        location: homestay.location,
        guest_name: guest_name.trim(),
        phone: phone.trim(),
        whatsapp_number: cleanWhatsapp,
        check_in,
        check_out,
        nights: diffDays,
        guests,
        rooms,
        total_amount: totalAmount,
        advance_amount: advanceAmount,
        booking_status: 'PENDING'
      }
    });
  } catch (err) {
    console.error('Error creating homestay booking:', err);
    res.status(500).json({ success: false, error: 'Failed to submit homestay booking: ' + err.message });
  }
});
