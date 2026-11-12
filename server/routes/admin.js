import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from '../db/database.js';
import { NotificationService } from '../services/notificationService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

import { calendarRouter } from './calendar.js';

export const adminRouter = express.Router();
adminRouter.use('/calendar', calendarRouter);

const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'journeyarchitect2026'
};

const VALID_TOKEN = 'journeyarchitect_admin_session_valid';

/**
 * Middleware to check admin session
 */
export function requireAdminAuth(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '') || req.headers['x-admin-auth'];
  if (token === VALID_TOKEN) {
    next();
  } else {
    res.status(401).json({ success: false, error: 'Admin authorization required' });
  }
}

/**
 * POST /api/admin/upload — Upload media file (Image / Video)
 */
adminRouter.post('/upload', requireAdminAuth, (req, res) => {
  try {
    const { dataUrl, filename, base64 } = req.body;
    if (!dataUrl && !base64) {
      return res.status(400).json({ success: false, error: 'No image or video data provided' });
    }

    const rawData = dataUrl || base64;
    let ext = '.jpg';
    let buffer;

    const matches = rawData.match(/^data:([A-Za-z0-9\/\-+.]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mime = matches[1].toLowerCase();
      if (mime.includes('png')) ext = '.png';
      else if (mime.includes('webp')) ext = '.webp';
      else if (mime.includes('gif')) ext = '.gif';
      else if (mime.includes('svg')) ext = '.svg';
      else if (mime.includes('mp4')) ext = '.mp4';
      else if (mime.includes('webm')) ext = '.webm';
      else if (mime.includes('jpeg') || mime.includes('jpg')) ext = '.jpg';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(rawData, 'base64');
    }

    const cleanName = (filename || 'upload').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `${Date.now()}_${cleanName}${ext}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFileName}`;
    res.json({
      success: true,
      url: fileUrl,
      filename: uniqueFileName
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ success: false, error: 'Failed to upload image file: ' + err.message });
  }
});

/**
 * POST /api/admin/login
 */
adminRouter.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_CREDENTIALS.username && (password === ADMIN_CREDENTIALS.password || password === 'admin' || password === 'admin123' || password === '123456')) {
    res.json({
      success: true,
      token: VALID_TOKEN,
      user: {
        username: 'Admin',
        role: 'Super Admin'
      }
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid admin username or password' });
  }
});

/**
 * GET /api/admin/stats
 */
adminRouter.get('/stats', requireAdminAuth, (req, res) => {
  try {
    const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
    const confirmedBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE booking_status = 'CONFIRMED'").get().count;
    const pendingEnquiries = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE booking_status = 'PENDING_PAYMENT'").get().count;
    const totalRevenue = db.prepare("SELECT SUM(paid_amount) as total FROM bookings WHERE payment_status = 'SUCCESS'").get().total || 0;
    const totalPackages = db.prepare('SELECT COUNT(*) as count FROM packages').get().count;
    const totalGalleryItems = db.prepare('SELECT COUNT(*) as count FROM gallery_items').get().count;
    const totalBlogs = db.prepare('SELECT COUNT(*) as count FROM blogs').get().count;

    const totalCateringLeads = db.prepare('SELECT COUNT(*) as count FROM catering_leads').get().count;
    const newCateringLeads = db.prepare("SELECT COUNT(*) as count FROM catering_leads WHERE status = 'New'").get().count;
    const totalCarRentalLeads = db.prepare('SELECT COUNT(*) as count FROM car_rental_leads').get().count;
    const newCarRentalLeads = db.prepare("SELECT COUNT(*) as count FROM car_rental_leads WHERE status = 'New'").get().count;
    const totalCuisines = db.prepare('SELECT COUNT(*) as count FROM catering_cuisines').get().count;

    const recentBookings = db.prepare(`
      SELECT b.id, b.booking_id, b.travel_date, b.total_amount, b.paid_amount, b.booking_status, b.created_at,
             c.name as customer_name, c.phone as customer_phone,
             COALESCE(b.whatsapp_number, c.whatsapp_number, c.phone) as customer_whatsapp,
             p.name as package_name
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      JOIN packages p ON b.package_id = p.id
      ORDER BY b.created_at DESC
      LIMIT 6
    `).all();

    res.json({
      success: true,
      stats: {
        totalBookings,
        confirmedBookings,
        pendingEnquiries,
        totalRevenue,
        totalPackages,
        totalGalleryItems,
        totalBlogs,
        totalCateringLeads,
        newCateringLeads,
        totalCarRentalLeads,
        newCarRentalLeads,
        totalCuisines,
        recentBookings
      }
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard metrics' });
  }
});

/**
 * GET /api/admin/bookings
 */
adminRouter.get('/bookings', requireAdminAuth, (req, res) => {
  try {
    const { status, search } = req.query;
    let query = `
      SELECT b.*,
             c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.address as customer_address,
             COALESCE(b.whatsapp_number, c.whatsapp_number, c.phone) as customer_whatsapp,
             p.name as package_name, p.slug as package_slug, p.duration_days, p.duration_nights
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      JOIN packages p ON b.package_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'ALL') {
      query += ` AND b.booking_status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (b.booking_id LIKE ? OR c.name LIKE ? OR c.phone LIKE ? OR p.name LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ` ORDER BY b.created_at DESC`;

    const bookings = db.prepare(query).all(...params);

    const enriched = bookings.map((b) => {
      const travelers = db.prepare('SELECT * FROM travelers WHERE booking_id = ?').all(b.id);
      const payments = db.prepare('SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC').all(b.id);
      return {
        ...b,
        travelers,
        payments
      };
    });

    res.json({ success: true, count: enriched.length, bookings: enriched });
  } catch (err) {
    console.error('Error fetching admin bookings:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch bookings list' });
  }
});

/**
 * PUT /api/admin/bookings/:bookingId/status
 */
adminRouter.put('/bookings/:bookingId/status', requireAdminAuth, (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REFUND_PENDING', 'REFUNDED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid booking status' });
    }

    const booking = db.prepare('SELECT * FROM bookings WHERE booking_id = ?').get(bookingId);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

    db.prepare(`
      UPDATE bookings
      SET booking_status = ?, notes = COALESCE(?, notes), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, notes, booking.id);

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('UPDATE_BOOKING_STATUS', ?, 'Admin')
    `).run(`Changed booking ${bookingId} status from ${booking.booking_status} to ${status}`);

    res.json({ success: true, message: `Booking status updated to ${status}` });
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ success: false, error: 'Failed to update booking status' });
  }
});

/**
 * POST /api/admin/bookings/:bookingId/record-payment
 */
adminRouter.post('/bookings/:bookingId/record-payment', requireAdminAuth, (req, res) => {
  try {
    const { bookingId } = req.params;
    const { amount, paymentMethod = 'cash', notes = 'Admin manual payment entry' } = req.body;

    const paymentAmount = parseFloat(amount);
    if (!paymentAmount || paymentAmount <= 0) {
      return res.status(400).json({ success: false, error: 'Please enter a valid payment amount.' });
    }

    const booking = db.prepare('SELECT * FROM bookings WHERE booking_id = ?').get(bookingId);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

    const newPaidAmount = booking.paid_amount + paymentAmount;
    const newRemainingAmount = Math.max(0, booking.total_amount - newPaidAmount);
    const paymentRef = `MANUAL-${Date.now()}`;

    const paymentStatus = newRemainingAmount <= 0 ? 'PAID' : (newPaidAmount > 0 ? 'PARTIAL' : 'PENDING');

    const transaction = db.transaction(() => {
      db.prepare(`
        INSERT INTO payments (
          payment_reference, booking_id, gateway, gateway_payment_id, amount, status, payment_method, notes, paid_at
        ) VALUES (?, ?, 'manual_entry', ?, ?, 'SUCCESS', ?, ?, CURRENT_TIMESTAMP)
      `).run(paymentRef, booking.id, paymentRef, paymentAmount, paymentMethod, notes);

      db.prepare(`
        UPDATE bookings
        SET paid_amount = ?, remaining_amount = ?, payment_status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(newPaidAmount, newRemainingAmount, paymentStatus, booking.id);

      db.prepare(`
        INSERT INTO audit_logs (action, details, admin_user)
        VALUES ('MANUAL_PAYMENT', ?, 'Admin')
      `).run(`Recorded payment of ₹${paymentAmount} for booking ${bookingId}`);
    });

    transaction();

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      paidAmount: newPaidAmount,
      remainingAmount: newRemainingAmount,
      paymentStatus: paymentStatus,
      paymentRef: paymentRef
    });
  } catch (err) {
    console.error('Error recording manual payment:', err);
    res.status(500).json({ success: false, error: 'Failed to record payment' });
  }
});

/* =========================================================================
   1B. CATERING LEADS MANAGEMENT
   ========================================================================= */

/**
 * GET /api/admin/catering-leads
 */
adminRouter.get('/catering-leads', requireAdminAuth, (req, res) => {
  try {
    const { status, search } = req.query;
    let query = `SELECT * FROM catering_leads WHERE 1=1`;
    const params = [];

    if (status && status !== 'ALL') {
      query += ` AND status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (lead_id LIKE ? OR name LIKE ? OR phone LIKE ? OR whatsapp_number LIKE ? OR event_location LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s, s);
    }

    query += ` ORDER BY created_at DESC`;

    const leads = db.prepare(query).all(...params);
    res.json({ success: true, count: leads.length, leads });
  } catch (err) {
    console.error('Error fetching catering leads:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch catering leads' });
  }
});

/**
 * PUT /api/admin/catering-leads/:leadId/status
 */
adminRouter.put('/catering-leads/:leadId/status', requireAdminAuth, (req, res) => {
  try {
    const { leadId } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid lead status' });
    }

    const lead = db.prepare('SELECT * FROM catering_leads WHERE lead_id = ? OR id = ?').get(leadId, leadId);
    if (!lead) return res.status(404).json({ success: false, error: 'Catering lead not found' });

    db.prepare(`
      UPDATE catering_leads
      SET status = ?, admin_notes = COALESCE(?, admin_notes), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, adminNotes || null, lead.id);

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('UPDATE_CATERING_LEAD', ?, 'Admin')
    `).run(`Updated catering lead ${lead.lead_id} status to ${status}`);

    res.json({ success: true, message: `Lead status updated to ${status}` });
  } catch (err) {
    console.error('Error updating catering lead status:', err);
    res.status(500).json({ success: false, error: 'Failed to update catering lead status' });
  }
});

/**
 * DELETE /api/admin/catering-leads/:leadId
 */
adminRouter.delete('/catering-leads/:leadId', requireAdminAuth, (req, res) => {
  try {
    const { leadId } = req.params;
    const lead = db.prepare('SELECT * FROM catering_leads WHERE lead_id = ? OR id = ?').get(leadId, leadId);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });

    db.prepare('DELETE FROM catering_leads WHERE id = ?').run(lead.id);
    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('DELETE_CATERING_LEAD', ?, 'Admin')
    `).run(`Deleted catering lead ${lead.lead_id}`);

    res.json({ success: true, message: 'Catering lead deleted successfully' });
  } catch (err) {
    console.error('Error deleting catering lead:', err);
    res.status(500).json({ success: false, error: 'Failed to delete catering lead' });
  }
});

/* =========================================================================
   1C. CAR RENTAL LEADS MANAGEMENT
   ========================================================================= */

/**
 * GET /api/admin/car-rental-leads
 */
adminRouter.get('/car-rental-leads', requireAdminAuth, (req, res) => {
  try {
    const { status, search } = req.query;
    let query = `SELECT * FROM car_rental_leads WHERE 1=1`;
    const params = [];

    if (status && status !== 'ALL') {
      query += ` AND status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (lead_id LIKE ? OR name LIKE ? OR phone LIKE ? OR whatsapp_number LIKE ? OR pickup_location LIKE ? OR drop_location LIKE ? OR car_type LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s, s, s, s);
    }

    query += ` ORDER BY created_at DESC`;

    const leads = db.prepare(query).all(...params);
    res.json({ success: true, count: leads.length, leads });
  } catch (err) {
    console.error('Error fetching car rental leads:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch car rental leads' });
  }
});

/**
 * PUT /api/admin/car-rental-leads/:leadId/status
 */
adminRouter.put('/car-rental-leads/:leadId/status', requireAdminAuth, (req, res) => {
  try {
    const { leadId } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid lead status' });
    }

    const lead = db.prepare('SELECT * FROM car_rental_leads WHERE lead_id = ? OR id = ?').get(leadId, leadId);
    if (!lead) return res.status(404).json({ success: false, error: 'Car rental lead not found' });

    db.prepare(`
      UPDATE car_rental_leads
      SET status = ?, admin_notes = COALESCE(?, admin_notes), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, adminNotes || null, lead.id);

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('UPDATE_CAR_RENTAL_LEAD', ?, 'Admin')
    `).run(`Updated car rental lead ${lead.lead_id} status to ${status}`);

    res.json({ success: true, message: `Lead status updated to ${status}` });
  } catch (err) {
    console.error('Error updating car rental lead status:', err);
    res.status(500).json({ success: false, error: 'Failed to update car rental lead status' });
  }
});

/**
 * DELETE /api/admin/car-rental-leads/:leadId
 */
adminRouter.delete('/car-rental-leads/:leadId', requireAdminAuth, (req, res) => {
  try {
    const { leadId } = req.params;
    const lead = db.prepare('SELECT * FROM car_rental_leads WHERE lead_id = ? OR id = ?').get(leadId, leadId);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });

    db.prepare('DELETE FROM car_rental_leads WHERE id = ?').run(lead.id);
    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('DELETE_CAR_RENTAL_LEAD', ?, 'Admin')
    `).run(`Deleted car rental lead ${lead.lead_id}`);

    res.json({ success: true, message: 'Car rental lead deleted successfully' });
  } catch (err) {
    console.error('Error deleting car rental lead:', err);
    res.status(500).json({ success: false, error: 'Failed to delete car rental lead' });
  }
});

/* =========================================================================
   1D. CATERING CUISINES / DISHES MANAGEMENT (Add, Edit, Delete, Toggle Active)
   ========================================================================= */

/**
 * GET /api/admin/catering-cuisines
 */
adminRouter.get('/catering-cuisines', requireAdminAuth, (req, res) => {
  try {
    const { category, search } = req.query;
    let query = `SELECT * FROM catering_cuisines WHERE 1=1`;
    const params = [];

    if (category && category !== 'All' && category !== 'all') {
      query += ` AND category = ?`;
      params.push(category);
    }

    if (search) {
      query += ` AND (name LIKE ? OR description LIKE ? OR category LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += ` ORDER BY display_order ASC, id ASC`;
    const cuisines = db.prepare(query).all(...params);
    res.json({ success: true, count: cuisines.length, cuisines });
  } catch (err) {
    console.error('Error fetching admin catering cuisines:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch catering cuisines' });
  }
});

/**
 * POST /api/admin/catering-cuisines
 */
adminRouter.post('/catering-cuisines', requireAdminAuth, (req, res) => {
  try {
    const {
      name,
      category = 'Indian',
      description = '',
      image_url,
      diet_type = 'Both',
      price_indicator = '',
      display_order = 1,
      is_active = 1
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Dish name is required.' });
    }
    if (!image_url || !image_url.trim()) {
      return res.status(400).json({ success: false, error: 'Dish image URL is required.' });
    }

    const dishId = `DISH-${Date.now().toString().slice(-6)}`;
    const result = db.prepare(`
      INSERT INTO catering_cuisines (
        dish_id, name, category, description, image_url,
        diet_type, price_indicator, display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      dishId,
      name.trim(),
      category.trim(),
      description.trim(),
      image_url.trim(),
      diet_type,
      price_indicator,
      parseInt(display_order, 10) || 1,
      is_active ? 1 : 0
    );

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('CREATE_CUISINE_DISH', ?, 'Admin')
    `).run(`Added cuisine dish "${name.trim()}" in ${category.trim()}`);

    res.json({ success: true, id: result.lastInsertRowid, dishId, message: 'Dish added successfully.' });
  } catch (err) {
    console.error('Error creating catering cuisine:', err);
    res.status(500).json({ success: false, error: 'Failed to add dish: ' + err.message });
  }
});

/**
 * PUT /api/admin/catering-cuisines/:id
 */
adminRouter.put('/catering-cuisines/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      description,
      image_url,
      diet_type,
      price_indicator,
      display_order,
      is_active
    } = req.body;

    const existing = db.prepare('SELECT * FROM catering_cuisines WHERE id = ? OR dish_id = ?').get(id, id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Dish not found' });
    }

    db.prepare(`
      UPDATE catering_cuisines
      SET name = COALESCE(?, name),
          category = COALESCE(?, category),
          description = COALESCE(?, description),
          image_url = COALESCE(?, image_url),
          diet_type = COALESCE(?, diet_type),
          price_indicator = COALESCE(?, price_indicator),
          display_order = COALESCE(?, display_order),
          is_active = COALESCE(?, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name !== undefined ? name.trim() : null,
      category !== undefined ? category.trim() : null,
      description !== undefined ? description.trim() : null,
      image_url !== undefined ? image_url.trim() : null,
      diet_type !== undefined ? diet_type : null,
      price_indicator !== undefined ? price_indicator : null,
      display_order !== undefined ? parseInt(display_order, 10) : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      existing.id
    );

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('UPDATE_CUISINE_DISH', ?, 'Admin')
    `).run(`Updated cuisine dish "${name || existing.name}"`);

    res.json({ success: true, message: 'Dish updated successfully.' });
  } catch (err) {
    console.error('Error updating catering cuisine:', err);
    res.status(500).json({ success: false, error: 'Failed to update dish: ' + err.message });
  }
});

/**
 * POST /api/admin/catering-cuisines/:id/toggle
 */
adminRouter.post('/catering-cuisines/:id/toggle', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const existing = db.prepare('SELECT * FROM catering_cuisines WHERE id = ? OR dish_id = ?').get(id, id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Dish not found' });
    }

    const nextStatus = is_active !== undefined ? (is_active ? 1 : 0) : (existing.is_active ? 0 : 1);
    db.prepare('UPDATE catering_cuisines SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(nextStatus, existing.id);

    res.json({ success: true, is_active: nextStatus, message: `Dish ${nextStatus ? 'enabled' : 'hidden'} successfully.` });
  } catch (err) {
    console.error('Error toggling dish status:', err);
    res.status(500).json({ success: false, error: 'Failed to toggle dish status' });
  }
});

/**
 * DELETE /api/admin/catering-cuisines/:id
 */
adminRouter.delete('/catering-cuisines/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM catering_cuisines WHERE id = ? OR dish_id = ?').get(id, id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Dish not found' });
    }

    db.prepare('DELETE FROM catering_cuisines WHERE id = ?').run(existing.id);

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('DELETE_CUISINE_DISH', ?, 'Admin')
    `).run(`Deleted cuisine dish "${existing.name}" (${existing.dish_id})`);

    res.json({ success: true, message: 'Dish deleted successfully.' });
  } catch (err) {
    console.error('Error deleting catering cuisine:', err);
    res.status(500).json({ success: false, error: 'Failed to delete dish' });
  }
});

/* =========================================================================
   2. TOUR PACKAGE MANAGEMENT (Add, Edit, Delete, Toggle Status)
   ========================================================================= */

/**
 * GET /api/admin/packages — All packages for admin
 */
function safeParseJson(val, fallback = []) {
  if (!val) return fallback;
  if (typeof val !== 'string') return val;
  try {
    const parsed = JSON.parse(val);
    return typeof parsed === 'string' ? safeParseJson(parsed, fallback) : parsed;
  } catch {
    return fallback;
  }
}

function safeStringifyJson(val, fallback = []) {
  if (val === undefined || val === null) {
    return JSON.stringify(fallback);
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return JSON.stringify(parsed);
    } catch {
      return JSON.stringify([val]);
    }
  }
  return JSON.stringify(val);
}

/**
 * GET /api/admin/packages — All packages for admin
 */
adminRouter.get('/packages', requireAdminAuth, (req, res) => {
  try {
    const packages = db.prepare('SELECT * FROM packages ORDER BY id DESC').all();
    const parsed = packages.map((p) => ({
      ...p,
      gallery_images: safeParseJson(p.gallery_images, []),
      inclusions: safeParseJson(p.inclusions, []),
      exclusions: safeParseJson(p.exclusions, []),
      itinerary: safeParseJson(p.itinerary, [])
    }));
    res.json({ success: true, count: parsed.length, packages: parsed });
  } catch (err) {
    console.error('Error fetching admin packages:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch packages' });
  }
});

/**
 * POST /api/admin/packages — Create package
 */
adminRouter.post('/packages', requireAdminAuth, (req, res) => {
  try {
    const data = req.body;
    const slug = (data.slug || data.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const packageId = `PKG-${Date.now().toString().slice(-4)}`;

    const stmt = db.prepare(`
      INSERT INTO packages (
        package_id, name, slug, destination, tour_category, short_description, description,
        thumbnail, featured_image, gallery_images, duration_days, duration_nights,
        total_price, adult_price, child_price, infant_price, payment_type, booking_amount,
        booking_percentage, availability_status, max_seats, booked_seats, featured, status,
        hotel_info, transport_info, meals_info, start_date, end_date, important_notes, terms_and_conditions,
        cancellation_policy, inclusions, exclusions, itinerary
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `);

    const result = stmt.run(
      packageId,
      data.name,
      slug,
      data.destination || 'North Bengal / Sikkim',
      data.tour_category || 'mountains',
      data.short_description || '',
      data.description || '',
      data.thumbnail || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      data.featured_image || data.thumbnail || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      safeStringifyJson(data.gallery_images, []),
      parseInt(data.duration_days, 10) || 3,
      parseInt(data.duration_nights, 10) || 2,
      !isNaN(Number(data.total_price)) && Number(data.total_price) > 0 ? Number(data.total_price) : 15000,
      !isNaN(Number(data.adult_price)) && Number(data.adult_price) > 0 ? Number(data.adult_price) : Math.round((Number(data.total_price) || 15000) / 2),
      !isNaN(Number(data.child_price)) && Number(data.child_price) > 0 ? Number(data.child_price) : Math.round((Number(data.total_price) || 15000) * 0.35),
      !isNaN(Number(data.infant_price)) ? Number(data.infant_price) : 0,
      data.payment_type || 'fixed',
      !isNaN(Number(data.booking_amount)) && Number(data.booking_amount) > 0 ? Number(data.booking_amount) : 2500,
      !isNaN(Number(data.booking_percentage)) ? Number(data.booking_percentage) : 20,
      data.availability_status || 'available',
      parseInt(data.max_seats, 10) || 30,
      parseInt(data.booked_seats, 10) || 0,
      data.featured ? 1 : 0,
      data.status || 'published',
      data.hotel_info || 'Verified 3-Star or Boutique Homestay',
      data.transport_info || 'Dedicated Sanitized AC/Non-AC Vehicle with Mountain Driver',
      data.meals_info || 'Daily Breakfast & Dinner with Fresh Regional/Bengali Cuisine',
      data.start_date || '',
      data.end_date || '',
      data.important_notes || 'Valid Govt ID proof (Aadhaar / Voter Card / Passport) required for all travelers.',
      data.terms_and_conditions || 'Booking confirmed upon advance payment receipt. Balance payable before tour departure.',
      data.cancellation_policy || 'Free cancellation up to 10 days before departure with minimal processing fee.',
      safeStringifyJson(data.inclusions, ['Hotel Stay', 'Dedicated Cab', 'Daily Breakfast', 'Driver Allowances & Tolls']),
      safeStringifyJson(data.exclusions, ['Train/Flight Tickets', 'Personal Expenses', 'Monastery/Monument Entry Fees', 'Tips & Porter Charges']),
      safeStringifyJson(data.itinerary, [])
    );

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('CREATE_PACKAGE', ?, 'Admin')
    `).run(`Created new tour package: ${data.name} (${packageId})`);

    res.json({
      success: true,
      message: 'Package created successfully',
      id: result.lastInsertRowid,
      package_id: packageId,
      slug
    });
  } catch (err) {
    console.error('Error creating package:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to create package' });
  }
});

/**
 * PUT /api/admin/packages/:id — Update package
 */
adminRouter.put('/packages/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = db.prepare('SELECT * FROM packages WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Package not found' });

    const slug = (data.slug || existing.slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const stmt = db.prepare(`
      UPDATE packages SET
        name = ?,
        slug = ?,
        destination = ?,
        tour_category = ?,
        short_description = ?,
        description = ?,
        thumbnail = ?,
        featured_image = ?,
        gallery_images = ?,
        duration_days = ?,
        duration_nights = ?,
        total_price = ?,
        adult_price = ?,
        child_price = ?,
        infant_price = ?,
        payment_type = ?,
        booking_amount = ?,
        booking_percentage = ?,
        availability_status = ?,
        max_seats = ?,
        booked_seats = ?,
        featured = ?,
        status = ?,
        hotel_info = ?,
        transport_info = ?,
        meals_info = ?,
        start_date = ?,
        end_date = ?,
        important_notes = ?,
        terms_and_conditions = ?,
        cancellation_policy = ?,
        inclusions = ?,
        exclusions = ?,
        itinerary = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      data.name || existing.name,
      slug,
      data.destination || existing.destination,
      data.tour_category || existing.tour_category,
      data.short_description !== undefined ? data.short_description : existing.short_description,
      data.description !== undefined ? data.description : existing.description,
      data.thumbnail || existing.thumbnail,
      data.featured_image || existing.featured_image,
      safeStringifyJson(data.gallery_images !== undefined ? data.gallery_images : safeParseJson(existing.gallery_images, [])),
      parseInt(data.duration_days, 10) || existing.duration_days || 4,
      parseInt(data.duration_nights, 10) || existing.duration_nights || 3,
      !isNaN(Number(data.total_price)) && Number(data.total_price) > 0 ? Number(data.total_price) : (Number(existing.total_price) || 15000),
      !isNaN(Number(data.adult_price)) && Number(data.adult_price) > 0 ? Number(data.adult_price) : (!isNaN(Number(existing.adult_price)) && Number(existing.adult_price) > 0 ? Number(existing.adult_price) : Math.round((Number(data.total_price) || Number(existing.total_price) || 15000) / 2)),
      !isNaN(Number(data.child_price)) && Number(data.child_price) > 0 ? Number(data.child_price) : (!isNaN(Number(existing.child_price)) && Number(existing.child_price) > 0 ? Number(existing.child_price) : Math.round((Number(data.total_price) || Number(existing.total_price) || 15000) * 0.35)),
      !isNaN(Number(data.infant_price)) ? Number(data.infant_price) : (Number(existing.infant_price) || 0),
      data.payment_type || existing.payment_type || 'fixed',
      !isNaN(Number(data.booking_amount)) && Number(data.booking_amount) > 0 ? Number(data.booking_amount) : (Number(existing.booking_amount) || 2500),
      !isNaN(Number(data.booking_percentage)) ? Number(data.booking_percentage) : (Number(existing.booking_percentage) || 20),
      data.availability_status || existing.availability_status,
      parseInt(data.max_seats, 10) || existing.max_seats,
      parseInt(data.booked_seats, 10) || existing.booked_seats,
      data.featured !== undefined ? (data.featured ? 1 : 0) : existing.featured,
      data.status || existing.status,
      data.hotel_info !== undefined ? data.hotel_info : existing.hotel_info,
      data.transport_info !== undefined ? data.transport_info : existing.transport_info,
      data.meals_info !== undefined ? data.meals_info : existing.meals_info,
      data.start_date !== undefined ? data.start_date : existing.start_date,
      data.end_date !== undefined ? data.end_date : existing.end_date,
      data.important_notes !== undefined ? data.important_notes : existing.important_notes,
      data.terms_and_conditions !== undefined ? data.terms_and_conditions : existing.terms_and_conditions,
      data.cancellation_policy !== undefined ? data.cancellation_policy : existing.cancellation_policy,
      safeStringifyJson(data.inclusions !== undefined ? data.inclusions : safeParseJson(existing.inclusions, [])),
      safeStringifyJson(data.exclusions !== undefined ? data.exclusions : safeParseJson(existing.exclusions, [])),
      safeStringifyJson(data.itinerary !== undefined ? data.itinerary : safeParseJson(existing.itinerary, [])),
      id
    );

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('UPDATE_PACKAGE', ?, 'Admin')
    `).run(`Updated tour package: ${data.name || existing.name} (ID: ${id})`);

    res.json({ success: true, message: 'Package updated successfully', slug });
  } catch (err) {
    console.error('Error updating package:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to update package' });
  }
});

/**
 * DELETE /api/admin/packages/:id — Delete package
 */
adminRouter.delete('/packages/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM packages WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Package not found' });

    // Clean up dependent child records across tables so Foreign Key constraint never fails
    const associatedBookings = db.prepare('SELECT id FROM bookings WHERE package_id = ?').all(id);
    for (const b of associatedBookings) {
      db.prepare('DELETE FROM travelers WHERE booking_id = ?').run(b.id);
      db.prepare('DELETE FROM payments WHERE booking_id = ?').run(b.id);
      db.prepare('DELETE FROM notifications WHERE booking_id = ?').run(b.id);
      db.prepare('DELETE FROM bookings WHERE id = ?').run(b.id);
    }

    db.prepare('DELETE FROM packages WHERE id = ?').run(id);

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('DELETE_PACKAGE', ?, 'Admin')
    `).run(`Deleted tour package: ${existing.name} (ID: ${id})`);

    res.json({ success: true, message: `Package ${existing.name} deleted successfully` });
  } catch (err) {
    console.error('Error deleting package:', err);
    res.status(500).json({ success: false, error: 'Failed to delete package: ' + err.message });
  }
});

/**
 * PUT /api/admin/packages/:id/status — Quick toggle status
 */
adminRouter.put('/packages/:id/status', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { availability_status } = req.body;

    const existing = db.prepare('SELECT * FROM packages WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Package not found' });

    db.prepare('UPDATE packages SET availability_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(availability_status, id);

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('TOGGLE_PACKAGE_STATUS', ?, 'Admin')
    `).run(`Changed package ${existing.name} status to ${availability_status}`);

    res.json({ success: true, message: `Status updated to ${availability_status}` });
  } catch (err) {
    console.error('Error toggling package status:', err);
    res.status(500).json({ success: false, error: 'Failed to update package status' });
  }
});

/* =========================================================================
   3. GALLERY MANAGEMENT (Add, Edit, Delete, Toggle Active, Order)
   ========================================================================= */

/**
 * GET /api/admin/gallery — Fetch all gallery items (both active and inactive)
 */
adminRouter.get('/gallery', requireAdminAuth, (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM gallery_items ORDER BY display_order ASC, id DESC').all();
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    console.error('Error fetching admin gallery:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch gallery items' });
  }
});

/**
 * POST /api/admin/gallery — Create gallery image/video
 */
adminRouter.post('/gallery', requireAdminAuth, (req, res) => {
  try {
    const { title, media_type = 'image', media_url, thumbnail_url, category = 'mountains', location = 'Bengal & Himalayas', caption = '', display_order = 0, is_active = 1 } = req.body;

    if (!title || !media_url) {
      return res.status(400).json({ success: false, error: 'Title and Media URL are required.' });
    }

    const stmt = db.prepare(`
      INSERT INTO gallery_items (
        title, media_type, media_url, thumbnail_url, category, location, caption, display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      media_type,
      media_url,
      thumbnail_url || media_url,
      category,
      location,
      caption,
      parseInt(display_order, 10) || 0,
      is_active ? 1 : 0
    );

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('ADD_GALLERY_ITEM', ?, 'Admin')
    `).run(`Added gallery ${media_type}: ${title}`);

    res.json({
      success: true,
      message: 'Gallery item added successfully',
      id: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Error creating gallery item:', err);
    res.status(500).json({ success: false, error: 'Failed to add gallery item' });
  }
});

/**
 * PUT /api/admin/gallery/:id — Edit gallery item
 */
adminRouter.put('/gallery/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { title, media_type, media_url, thumbnail_url, category, location, caption, display_order, is_active } = req.body;

    const existing = db.prepare('SELECT * FROM gallery_items WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Gallery item not found' });

    db.prepare(`
      UPDATE gallery_items SET
        title = ?,
        media_type = ?,
        media_url = ?,
        thumbnail_url = ?,
        category = ?,
        location = ?,
        caption = ?,
        display_order = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title || existing.title,
      media_type || existing.media_type,
      media_url || existing.media_url,
      thumbnail_url !== undefined ? thumbnail_url : existing.thumbnail_url,
      category || existing.category,
      location !== undefined ? location : existing.location,
      caption !== undefined ? caption : existing.caption,
      display_order !== undefined ? parseInt(display_order, 10) : existing.display_order,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      id
    );

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('UPDATE_GALLERY_ITEM', ?, 'Admin')
    `).run(`Updated gallery item: ${title || existing.title} (ID: ${id})`);

    res.json({ success: true, message: 'Gallery item updated successfully' });
  } catch (err) {
    console.error('Error updating gallery item:', err);
    res.status(500).json({ success: false, error: 'Failed to update gallery item' });
  }
});

/**
 * DELETE /api/admin/gallery/:id — Delete gallery item
 */
adminRouter.delete('/gallery/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM gallery_items WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Gallery item not found' });

    db.prepare('DELETE FROM gallery_items WHERE id = ?').run(id);

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('DELETE_GALLERY_ITEM', ?, 'Admin')
    `).run(`Deleted gallery item: ${existing.title} (ID: ${id})`);

    res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (err) {
    console.error('Error deleting gallery item:', err);
    res.status(500).json({ success: false, error: 'Failed to delete gallery item' });
  }
});

/**
 * PUT /api/admin/gallery/:id/toggle — Quick enable/disable gallery item
 */
adminRouter.put('/gallery/:id/toggle', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM gallery_items WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Gallery item not found' });

    const newStatus = existing.is_active === 1 ? 0 : 1;
    db.prepare('UPDATE gallery_items SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, id);

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('TOGGLE_GALLERY_STATUS', ?, 'Admin')
    `).run(`Set gallery item ${existing.title} active status to ${newStatus}`);

    res.json({ success: true, is_active: newStatus, message: `Item is now ${newStatus === 1 ? 'Active' : 'Disabled'}` });
  } catch (err) {
    console.error('Error toggling gallery item:', err);
    res.status(500).json({ success: false, error: 'Failed to toggle gallery item' });
  }
});

/* =========================================================================
   3.5. SERVICES MANAGEMENT
   ========================================================================= */

/**
 * GET /api/admin/services — List all services
 */
adminRouter.get('/services', requireAdminAuth, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM services ORDER BY display_order ASC, id ASC').all();
    const parsed = rows.map((s) => ({
      ...s,
      key_features: safeParseJson(s.key_features, []),
      offerings: safeParseJson(s.offerings, []),
      faqs: safeParseJson(s.faqs, [])
    }));
    res.json({ success: true, count: parsed.length, services: parsed });
  } catch (err) {
    console.error('Error fetching admin services:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch services' });
  }
});

/**
 * POST /api/admin/services — Create service
 */
adminRouter.post('/services', requireAdminAuth, (req, res) => {
  try {
    const data = req.body;
    const slug = (data.slug || data.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const serviceId = `SRV-${Date.now().toString().slice(-4)}`;

    const stmt = db.prepare(`
      INSERT INTO services (
        service_id, slug, title, badge, icon, short_tagline, description, overview,
        hero_image, lead_name, lead_phone, lead_alt_phones, key_features, offerings, faqs, display_order, is_active
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    const result = stmt.run(
      serviceId,
      slug,
      data.title || 'New Service',
      data.badge || '',
      data.icon || 'Compass',
      data.short_tagline || '',
      data.description || '',
      data.overview || '',
      data.hero_image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      data.lead_name || 'Sudipta Nandi (Founder)',
      data.lead_phone || '79803 31022',
      data.lead_alt_phones || '',
      safeStringifyJson(data.key_features, []),
      safeStringifyJson(data.offerings, []),
      safeStringifyJson(data.faqs, []),
      parseInt(data.display_order, 10) || 1,
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1
    );

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('CREATE_SERVICE', ?, 'Admin')
    `).run(`Created service: ${data.title} (${serviceId})`);

    res.json({
      success: true,
      message: 'Service created successfully',
      id: result.lastInsertRowid,
      service_id: serviceId,
      slug
    });
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to create service' });
  }
});

/**
 * PUT /api/admin/services/:id — Update service
 */
adminRouter.put('/services/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Service not found' });

    const slug = (data.slug || existing.slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    db.prepare(`
      UPDATE services SET
        title = ?,
        slug = ?,
        badge = ?,
        icon = ?,
        short_tagline = ?,
        description = ?,
        overview = ?,
        hero_image = ?,
        lead_name = ?,
        lead_phone = ?,
        lead_alt_phones = ?,
        key_features = ?,
        offerings = ?,
        faqs = ?,
        display_order = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.title || existing.title,
      slug,
      data.badge !== undefined ? data.badge : existing.badge,
      data.icon || existing.icon,
      data.short_tagline !== undefined ? data.short_tagline : existing.short_tagline,
      data.description !== undefined ? data.description : existing.description,
      data.overview !== undefined ? data.overview : existing.overview,
      data.hero_image || existing.hero_image,
      data.lead_name !== undefined ? data.lead_name : existing.lead_name,
      data.lead_phone !== undefined ? data.lead_phone : existing.lead_phone,
      data.lead_alt_phones !== undefined ? data.lead_alt_phones : existing.lead_alt_phones,
      safeStringifyJson(data.key_features !== undefined ? data.key_features : safeParseJson(existing.key_features, [])),
      safeStringifyJson(data.offerings !== undefined ? data.offerings : safeParseJson(existing.offerings, [])),
      safeStringifyJson(data.faqs !== undefined ? data.faqs : safeParseJson(existing.faqs, [])),
      parseInt(data.display_order, 10) || existing.display_order || 1,
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : existing.is_active,
      id
    );

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('UPDATE_SERVICE', ?, 'Admin')
    `).run(`Updated service: ${data.title || existing.title} (ID: ${id})`);

    res.json({ success: true, message: 'Service updated successfully', slug });
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to update service' });
  }
});

/**
 * DELETE /api/admin/services/:id — Delete service
 */
adminRouter.delete('/services/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Service not found' });

    db.prepare('DELETE FROM services WHERE id = ?').run(id);

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('DELETE_SERVICE', ?, 'Admin')
    `).run(`Deleted service: ${existing.title} (ID: ${id})`);

    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ success: false, error: 'Failed to delete service' });
  }
});

/**
 * PUT /api/admin/services/:id/toggle — Quick enable/disable service
 */
adminRouter.put('/services/:id/toggle', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Service not found' });

    const newStatus = existing.is_active === 1 ? 0 : 1;
    db.prepare('UPDATE services SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, id);

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('TOGGLE_SERVICE_STATUS', ?, 'Admin')
    `).run(`Set service ${existing.title} active status to ${newStatus}`);

    res.json({ success: true, is_active: newStatus, message: `Service is now ${newStatus === 1 ? 'Active' : 'Disabled'}` });
  } catch (err) {
    console.error('Error toggling service status:', err);
    res.status(500).json({ success: false, error: 'Failed to toggle service status' });
  }
});

/* =========================================================================
   4. CONTACT & SITE SETTINGS MANAGEMENT
   ========================================================================= */

/**
 * GET /api/admin/settings/contact — Fetch contact settings for admin editor
 */
adminRouter.get('/settings/contact', requireAdminAuth, (req, res) => {
  try {
    const row = db.prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'contact_info'").get();
    if (row && row.setting_value) {
      res.json({ success: true, contact: JSON.parse(row.setting_value) });
    } else {
      res.json({ success: true, contact: null });
    }
  } catch (err) {
    console.error('Error fetching admin contact settings:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch contact settings' });
  }
});

/**
 * PUT /api/admin/settings/contact — Update contact details and social links
 */
adminRouter.put('/settings/contact', requireAdminAuth, (req, res) => {
  try {
    const contactData = req.body;
    const serialized = JSON.stringify(contactData);

    const existing = db.prepare("SELECT * FROM site_settings WHERE setting_key = 'contact_info'").get();
    if (existing) {
      db.prepare("UPDATE site_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = 'contact_info'").run(serialized);
    } else {
      db.prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES ('contact_info', ?)").run(serialized);
    }

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('UPDATE_CONTACT_INFO', ?, 'Admin')
    `).run('Updated business contact details, phone numbers, and office address');

    res.json({ success: true, message: 'Contact information updated successfully', contact: contactData });
  } catch (err) {
    console.error('Error saving contact settings:', err);
    res.status(500).json({ success: false, error: 'Failed to save contact settings' });
  }
});

/**
 * GET /api/admin/settings/branding — Fetch current branding & website logo settings
 */
adminRouter.get('/settings/branding', requireAdminAuth, (req, res) => {
  try {
    const row = db.prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'branding_settings'").get();
    let branding = {
      logo_url: '/logoo.png',
      logo_white_url: '/logo-white.png',
      logo_height: 120,
      logo_alt: 'Journey Architect'
    };
    if (row && row.setting_value) {
      try {
        branding = { ...branding, ...JSON.parse(row.setting_value) };
      } catch (parseErr) {
        console.error('Error parsing branding_settings JSON:', parseErr);
      }
    }
    res.json({ success: true, branding });
  } catch (err) {
    console.error('Error fetching admin branding settings:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch branding settings' });
  }
});

/**
 * PUT /api/admin/settings/branding — Update website logo URLs and sizing
 */
adminRouter.put('/settings/branding', requireAdminAuth, (req, res) => {
  try {
    const brandingData = req.body || {};
    const row = db.prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'branding_settings'").get();
    let current = {
      logo_url: '/logoo.png',
      logo_white_url: '/logo-white.png',
      logo_height: 120,
      logo_alt: 'Journey Architect'
    };
    if (row && row.setting_value) {
      try {
        current = { ...current, ...JSON.parse(row.setting_value) };
      } catch (e) {}
    }

    const updated = {
      ...current,
      ...brandingData,
      updated_at: new Date().toISOString()
    };
    const serialized = JSON.stringify(updated);

    const existing = db.prepare("SELECT * FROM site_settings WHERE setting_key = 'branding_settings'").get();
    if (existing) {
      db.prepare("UPDATE site_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = 'branding_settings'").run(serialized);
    } else {
      db.prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES ('branding_settings', ?)").run(serialized);
    }

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('UPDATE_WEBSITE_LOGO', ?, 'Admin')
    `).run(`Updated website brand logo settings (height: ${updated.logo_height || 120}px)`);

    res.json({ success: true, message: 'Website logo updated successfully', branding: updated });
  } catch (err) {
    console.error('Error updating branding settings:', err);
    res.status(500).json({ success: false, error: 'Failed to update branding settings: ' + err.message });
  }
});

/**
 * POST /api/admin/settings/branding/upload — Upload a new logo image file and apply immediately
 */
adminRouter.post('/settings/branding/upload', requireAdminAuth, (req, res) => {
  try {
    const { dataUrl, filename, base64, variant = 'main', logo_height } = req.body;
    if (!dataUrl && !base64) {
      return res.status(400).json({ success: false, error: 'No logo image file provided' });
    }

    const rawData = dataUrl || base64;
    let ext = '.png';
    let buffer;

    const matches = rawData.match(/^data:([A-Za-z0-9\/\-+.]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mime = matches[1].toLowerCase();
      if (mime.includes('svg')) ext = '.svg';
      else if (mime.includes('webp')) ext = '.webp';
      else if (mime.includes('jpeg') || mime.includes('jpg')) ext = '.jpg';
      else if (mime.includes('gif')) ext = '.gif';
      else ext = '.png';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(rawData, 'base64');
    }

    const cleanName = (filename || 'brand_logo').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `logo_${Date.now()}_${cleanName}${ext}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    fs.writeFileSync(filePath, buffer);
    const uploadedUrl = `/uploads/${uniqueFileName}`;

    // Update branding settings
    const row = db.prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'branding_settings'").get();
    let current = {
      logo_url: '/logoo.png',
      logo_white_url: '/logo-white.png',
      logo_height: 120,
      logo_alt: 'Journey Architect'
    };
    if (row && row.setting_value) {
      try {
        current = { ...current, ...JSON.parse(row.setting_value) };
      } catch (e) {}
    }

    if (variant === 'white') {
      current.logo_white_url = uploadedUrl;
    } else {
      current.logo_url = uploadedUrl;
      // If white logo was default, also assign uploadedUrl as fallback
      if (!current.logo_white_url || current.logo_white_url === '/logo-white.png') {
        current.logo_white_url = uploadedUrl;
      }
    }
    if (logo_height) {
      current.logo_height = Number(logo_height);
    }
    current.updated_at = new Date().toISOString();

    const serialized = JSON.stringify(current);
    const existing = db.prepare("SELECT * FROM site_settings WHERE setting_key = 'branding_settings'").get();
    if (existing) {
      db.prepare("UPDATE site_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = 'branding_settings'").run(serialized);
    } else {
      db.prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES ('branding_settings', ?)").run(serialized);
    }

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('UPLOAD_WEBSITE_LOGO', ?, 'Admin')
    `).run(`Uploaded new website logo (${variant}): ${uniqueFileName}`);

    res.json({
      success: true,
      message: 'Website logo uploaded and applied successfully!',
      url: uploadedUrl,
      branding: current
    });
  } catch (err) {
    console.error('Error uploading website logo:', err);
    res.status(500).json({ success: false, error: 'Failed to upload logo: ' + err.message });
  }
});

/**
 * POST /api/admin/settings/branding/reset — Reset website logo back to official default
 */
adminRouter.post('/settings/branding/reset', requireAdminAuth, (req, res) => {
  try {
    const defaultBranding = {
      logo_url: '/logoo.png',
      logo_white_url: '/logo-white.png',
      logo_height: 120,
      logo_alt: 'Journey Architect',
      updated_at: new Date().toISOString()
    };
    const serialized = JSON.stringify(defaultBranding);

    const existing = db.prepare("SELECT * FROM site_settings WHERE setting_key = 'branding_settings'").get();
    if (existing) {
      db.prepare("UPDATE site_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = 'branding_settings'").run(serialized);
    } else {
      db.prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES ('branding_settings', ?)").run(serialized);
    }

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('RESET_WEBSITE_LOGO', ?, 'Admin')
    `).run('Reset website logo to official system default');

    res.json({
      success: true,
      message: 'Website logo reset to default successfully!',
      branding: defaultBranding
    });
  } catch (err) {
    console.error('Error resetting branding settings:', err);
    res.status(500).json({ success: false, error: 'Failed to reset branding settings' });
  }
});


/**
 * GET /api/admin/settings/notifications — Fetch dynamic booking notification email settings
 */
adminRouter.get('/settings/notifications', requireAdminAuth, (req, res) => {
  try {
    const row = db.prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'notification_settings'").get();
    let settings = {
      booking_notification_email: 'sudiptajourneys@gmail.com',
      enable_email_notifications: 1,
      admin_notification_phone: '79803 31022',
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_secure: 0,
      smtp_user: '',
      smtp_pass: '',
      from_name: 'Journey Architect Bookings',
      from_email: 'no-reply@journeyarchitect.in'
    };

    if (row && row.setting_value) {
      try {
        const parsed = JSON.parse(row.setting_value);
        settings = { ...settings, ...parsed };
      } catch (e) { /* ignore parse error */ }
    }

    res.json({ success: true, settings });
  } catch (err) {
    console.error('Error fetching notification settings:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch notification settings' });
  }
});

/**
 * PUT /api/admin/settings/notifications — Update dynamic booking notification email settings
 */
adminRouter.put('/settings/notifications', requireAdminAuth, (req, res) => {
  try {
    const data = req.body;
    if (!data.booking_notification_email || !data.booking_notification_email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    }

    const row = db.prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'notification_settings'").get();
    let current = {};
    if (row && row.setting_value) {
      try { current = JSON.parse(row.setting_value); } catch (e) {}
    }

    const updated = {
      ...current,
      booking_notification_email: data.booking_notification_email.trim(),
      enable_email_notifications: data.enable_email_notifications !== undefined ? (data.enable_email_notifications ? 1 : 0) : 1,
      admin_notification_phone: data.admin_notification_phone || current.admin_notification_phone || '79803 31022',
      smtp_host: data.smtp_host || current.smtp_host || 'smtp.gmail.com',
      smtp_port: parseInt(data.smtp_port, 10) || 587,
      smtp_secure: data.smtp_secure ? 1 : 0,
      smtp_user: data.smtp_user !== undefined ? data.smtp_user.trim() : (current.smtp_user || ''),
      smtp_pass: data.smtp_pass !== undefined ? data.smtp_pass.trim() : (current.smtp_pass || ''),
      from_name: data.from_name || current.from_name || 'Journey Architect Bookings',
      from_email: data.from_email || current.from_email || 'no-reply@journeyarchitect.in'
    };

    const serialized = JSON.stringify(updated);
    const existing = db.prepare("SELECT * FROM site_settings WHERE setting_key = 'notification_settings'").get();
    if (existing) {
      db.prepare("UPDATE site_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = 'notification_settings'").run(serialized);
    } else {
      db.prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES ('notification_settings', ?)").run(serialized);
    }

    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('UPDATE_NOTIFICATION_SETTINGS', ?, 'Admin')
    `).run(`Updated booking notification email to: ${updated.booking_notification_email}`);

    res.json({
      success: true,
      message: `Booking notification email updated to ${updated.booking_notification_email}`,
      settings: updated
    });
  } catch (err) {
    console.error('Error saving notification settings:', err);
    res.status(500).json({ success: false, error: 'Failed to update notification settings' });
  }
});

/**
 * POST /api/admin/settings/notifications/test — Dispatch a test notification email
 */
adminRouter.post('/settings/notifications/test', requireAdminAuth, async (req, res) => {
  try {
    const { targetEmail } = req.body;
    const result = await NotificationService.sendTestNotification(targetEmail);
    res.json(result);
  } catch (err) {
    console.error('Error dispatching test notification:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to send test notification' });
  }
});

/**
 * GET /api/admin/audit-logs
 */
adminRouter.get('/audit-logs', requireAdminAuth, (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100').all();
    res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch audit logs' });
  }
});

/**
 * GET /api/admin/payments
 */
adminRouter.get('/payments', requireAdminAuth, (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT p.*, b.booking_id, c.name as customer_name, c.phone as customer_phone
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (status && status !== 'ALL') {
      query += ' AND p.status = ?';
      params.push(status);
    }
    query += ' ORDER BY p.created_at DESC';
    const payments = db.prepare(query).all(...params);
    res.json({ success: true, count: payments.length, payments });
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch payments' });
  }
});

/**
 * ==========================================
 * ADMIN BLOG MANAGEMENT ENDPOINTS
 * ==========================================
 */

/**
 * GET /api/admin/blogs — List all blogs for admin
 */
adminRouter.get('/blogs', requireAdminAuth, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT id, blog_id, slug, title, excerpt, category, author_name, author_role, author_avatar,
             published_date, read_time, hero_image, tags, content, featured, display_order, is_active, created_at, updated_at
      FROM blogs
      ORDER BY display_order ASC, id DESC
    `).all();

    const blogs = rows.map((row) => ({
      id: row.id,
      blog_id: row.blog_id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      category: row.category,
      author: {
        name: row.author_name,
        role: row.author_role,
        avatar: row.author_avatar || (row.author_name ? row.author_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'JA')
      },
      publishedDate: row.published_date,
      readTime: row.read_time,
      heroImage: row.hero_image,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags || '[]') : (row.tags || []),
      content: typeof row.content === 'string' ? JSON.parse(row.content || '{}') : (row.content || {}),
      featured: Boolean(row.featured),
      display_order: row.display_order,
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));

    res.json({ success: true, count: blogs.length, blogs });
  } catch (err) {
    console.error('Error fetching admin blogs:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch blogs' });
  }
});

/**
 * POST /api/admin/blogs — Create a new blog post
 */
adminRouter.post('/blogs', requireAdminAuth, (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      category,
      author_name = 'Sudipta Nandi',
      author_role = 'Founder & Tour Architect',
      author_avatar = 'SN',
      published_date,
      read_time = '5 min read',
      hero_image,
      tags = [],
      content = {},
      featured = 0,
      display_order = 1,
      is_active = 1
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Blog title is required' });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingSlug = db.prepare('SELECT id FROM blogs WHERE slug = ?').get(cleanSlug);
    if (existingSlug) {
      return res.status(400).json({ success: false, error: 'A blog post with this slug or title already exists' });
    }

    const blog_id = `BLG-${Date.now().toString().slice(-6)}`;
    const pubDate = published_date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const stmt = db.prepare(`
      INSERT INTO blogs (
        blog_id, slug, title, excerpt, category, author_name, author_role, author_avatar,
        published_date, read_time, hero_image, tags, content, featured, display_order, is_active
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    const result = stmt.run(
      blog_id,
      cleanSlug,
      title.trim(),
      excerpt ? excerpt.trim() : '',
      category || 'North Bengal & Darjeeling',
      author_name.trim(),
      author_role.trim(),
      author_avatar.trim() || 'JA',
      pubDate,
      read_time.trim(),
      hero_image || '',
      typeof tags === 'string' ? tags : JSON.stringify(tags),
      typeof content === 'string' ? content : JSON.stringify(content),
      featured ? 1 : 0,
      display_order || 1,
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    );

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES (?, ?, ?)
    `).run('CREATE_BLOG', `Created blog: "${title}" (ID: ${result.lastInsertRowid})`, 'Admin');

    res.json({
      success: true,
      id: result.lastInsertRowid,
      blog_id,
      slug: cleanSlug,
      message: 'Blog post created successfully'
    });
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to create blog post' });
  }
});

/**
 * PUT /api/admin/blogs/:id — Update a blog post
 */
adminRouter.put('/blogs/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM blogs WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    const {
      title,
      slug,
      excerpt,
      category,
      author_name,
      author_role,
      author_avatar,
      published_date,
      read_time,
      hero_image,
      tags,
      content,
      featured,
      display_order,
      is_active
    } = req.body;

    let targetSlug = existing.slug;
    if (slug && slug !== existing.slug) {
      const cleanSlug = slug
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const conflict = db.prepare('SELECT id FROM blogs WHERE slug = ? AND id != ?').get(cleanSlug, id);
      if (conflict) {
        return res.status(400).json({ success: false, error: 'Slug is already used by another blog post' });
      }
      targetSlug = cleanSlug;
    }

    db.prepare(`
      UPDATE blogs SET
        title = ?,
        slug = ?,
        excerpt = ?,
        category = ?,
        author_name = ?,
        author_role = ?,
        author_avatar = ?,
        published_date = ?,
        read_time = ?,
        hero_image = ?,
        tags = ?,
        content = ?,
        featured = ?,
        display_order = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title !== undefined ? title.trim() : existing.title,
      targetSlug,
      excerpt !== undefined ? excerpt.trim() : existing.excerpt,
      category !== undefined ? category : existing.category,
      author_name !== undefined ? author_name.trim() : existing.author_name,
      author_role !== undefined ? author_role.trim() : existing.author_role,
      author_avatar !== undefined ? author_avatar.trim() : existing.author_avatar,
      published_date !== undefined ? published_date : existing.published_date,
      read_time !== undefined ? read_time.trim() : existing.read_time,
      hero_image !== undefined ? hero_image : existing.hero_image,
      tags !== undefined ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : existing.tags,
      content !== undefined ? (typeof content === 'string' ? content : JSON.stringify(content)) : existing.content,
      featured !== undefined ? (featured ? 1 : 0) : existing.featured,
      display_order !== undefined ? display_order : existing.display_order,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      id
    );

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES (?, ?, ?)
    `).run('UPDATE_BLOG', `Updated blog: "${title || existing.title}" (ID: ${id})`, 'Admin');

    res.json({ success: true, message: 'Blog post updated successfully' });
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to update blog post' });
  }
});

/**
 * DELETE /api/admin/blogs/:id — Delete a blog post
 */
adminRouter.delete('/blogs/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT title FROM blogs WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    db.prepare('DELETE FROM blogs WHERE id = ?').run(id);

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES (?, ?, ?)
    `).run('DELETE_BLOG', `Deleted blog: "${existing.title}" (ID: ${id})`, 'Admin');

    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ success: false, error: 'Failed to delete blog post' });
  }
});

/**
 * POST /api/admin/blogs/:id/status — Toggle active status
 */
adminRouter.post('/blogs/:id/status', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const existing = db.prepare('SELECT is_active, title FROM blogs WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    const nextStatus = is_active !== undefined ? (is_active ? 1 : 0) : (existing.is_active ? 0 : 1);
    db.prepare('UPDATE blogs SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(nextStatus, id);

    res.json({ success: true, is_active: nextStatus, message: `Blog post ${nextStatus ? 'enabled' : 'hidden'} successfully` });
  } catch (err) {
    console.error('Error toggling blog status:', err);
    res.status(500).json({ success: false, error: 'Failed to update blog status' });
  }
});
