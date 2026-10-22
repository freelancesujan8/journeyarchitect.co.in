import express from 'express';
import { db } from '../db/database.js';
import { NotificationService } from '../services/notificationService.js';

export const cateringRouter = express.Router();

/**
 * GET /api/catering/cuisines
 * Fetch active dishes for "Cuisine We Serve" section with optional category filter
 */
cateringRouter.get('/cuisines', (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM catering_cuisines WHERE is_active = 1';
    const params = [];

    if (category && category !== 'All' && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY display_order ASC, id ASC';
    const cuisines = db.prepare(query).all(...params);
    res.json({ success: true, count: cuisines.length, cuisines });
  } catch (err) {
    console.error('[Catering] Error fetching cuisines:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch cuisines' });
  }
});

/**
 * POST /api/catering/enquiry
 * Submit dedicated catering service enquiry
 */
cateringRouter.post('/enquiry', async (req, res) => {
  try {
    const {
      name = '',
      phone = '',
      whatsapp_number = '',
      whatsapp = '',
      email = '',
      event_date = '',
      guests_count = 50,
      event_location = '',
      event_type = 'General Gathering',
      service_requirements = '',
      budget_range = ''
    } = req.body;

    // 1. Validations
    if (!name.trim()) {
      return res.status(400).json({ success: false, error: 'Please provide your full name.' });
    }
    if (!phone.trim() || phone.trim().length < 8) {
      return res.status(400).json({ success: false, error: 'Please provide a valid contact phone number.' });
    }
    if (!event_date) {
      return res.status(400).json({ success: false, error: 'Please select an event date.' });
    }
    if (!event_location.trim()) {
      return res.status(400).json({ success: false, error: 'Please specify the event venue or location.' });
    }

    const guests = parseInt(guests_count, 10) || 50;
    if (guests < 5) {
      return res.status(400).json({ success: false, error: 'Minimum guest count is 5.' });
    }

    // Sanitize WhatsApp number
    const rawWhatsapp = (whatsapp_number || whatsapp || phone).trim().replace(/[^0-9+]/g, '');
    const cleanWhatsapp = rawWhatsapp.length >= 10 ? rawWhatsapp : phone.trim();

    // 2. Generate unique lead ID
    const countRow = db.prepare('SELECT COUNT(*) as count FROM catering_leads').get();
    const nextSeq = (countRow ? countRow.count : 0) + 1;
    const leadId = `JA-CAT-${new Date().getFullYear()}-${String(nextSeq).padStart(4, '0')}`;

    // 3. Insert into catering_leads
    const result = db.prepare(`
      INSERT INTO catering_leads (
        lead_id, name, phone, whatsapp_number, email,
        event_date, guests_count, event_location, event_type,
        service_requirements, budget_range, status
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, 'New'
      )
    `).run(
      leadId,
      name.trim(),
      phone.trim(),
      cleanWhatsapp,
      email.trim() || '',
      event_date,
      guests,
      event_location.trim(),
      event_type.trim() || 'General Gathering',
      service_requirements.trim() || '',
      budget_range.trim() || ''
    );

    const dbId = result.lastInsertRowid;

    // Also update / insert into customers table so contact is saved in CRM
    try {
      const existingCustomer = db.prepare('SELECT id FROM customers WHERE phone = ?').get(phone.trim());
      if (existingCustomer) {
        db.prepare('UPDATE customers SET name = ?, email = COALESCE(NULLIF(?, ""), email), whatsapp_number = COALESCE(NULLIF(?, ""), whatsapp_number), updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .run(name.trim(), email.trim(), cleanWhatsapp, existingCustomer.id);
      } else {
        db.prepare('INSERT INTO customers (name, email, phone, whatsapp_number, address) VALUES (?, ?, ?, ?, ?)')
          .run(name.trim(), email.trim(), phone.trim(), cleanWhatsapp, event_location.trim());
      }
    } catch (e) {
      console.warn('[Catering] Customer profile sync warning:', e.message);
    }

    // 4. Log in audit_logs
    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('NEW_CATERING_LEAD', ?, 'Website Visitor')
    `).run(`New catering lead ${leadId} for ${name.trim()} (${guests} guests on ${event_date} at ${event_location.trim()})`);

    // 5. Dispatch non-blocking admin email alert
    NotificationService.sendCateringAlert({
      lead: {
        id: dbId,
        lead_id: leadId,
        name: name.trim(),
        phone: phone.trim(),
        whatsapp_number: cleanWhatsapp,
        email: email.trim(),
        event_date,
        guests_count: guests,
        event_location: event_location.trim(),
        event_type: event_type.trim() || 'General Gathering',
        service_requirements: service_requirements.trim(),
        budget_range: budget_range.trim(),
        status: 'New'
      }
    }).catch(err => console.error('[Catering] Error sending email notification:', err.message));

    res.json({
      success: true,
      leadId: leadId,
      message: 'Thank you! Your catering enquiry has been submitted. Chef Dipankar Mitra and our catering team will review your menu requirements and get back to you promptly.'
    });
  } catch (err) {
    console.error('Error submitting catering enquiry:', err);
    res.status(500).json({ success: false, error: 'Failed to submit catering enquiry: ' + err.message });
  }
});

export default cateringRouter;
