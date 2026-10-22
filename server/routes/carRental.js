import express from 'express';
import { db } from '../db/database.js';
import { NotificationService } from '../services/notificationService.js';

export const carRentalRouter = express.Router();

/**
 * POST /api/car-rental/enquiry
 * Submit dedicated car rental service enquiry
 */
carRentalRouter.post('/enquiry', async (req, res) => {
  try {
    const {
      name = '',
      phone = '',
      whatsapp_number = '',
      whatsapp = '',
      email = '',
      travel_date = '',
      return_date = '',
      pickup_location = '',
      drop_location = '',
      car_type = 'Dzire / Etios (Sedan)',
      passengers_count = 1,
      trip_type = 'Outstation Round-Trip',
      service_requirements = ''
    } = req.body;

    // 1. Validations
    if (!name.trim()) {
      return res.status(400).json({ success: false, error: 'Please provide your full name.' });
    }
    if (!phone.trim() || phone.trim().length < 8) {
      return res.status(400).json({ success: false, error: 'Please provide a valid contact phone number.' });
    }
    if (!travel_date) {
      return res.status(400).json({ success: false, error: 'Please select a travel pickup date.' });
    }
    if (!pickup_location.trim()) {
      return res.status(400).json({ success: false, error: 'Please specify the pickup location or city.' });
    }
    if (!drop_location.trim()) {
      return res.status(400).json({ success: false, error: 'Please specify the drop-off location or destination.' });
    }

    const passengers = parseInt(passengers_count, 10) || 1;

    // Sanitize WhatsApp number
    const rawWhatsapp = (whatsapp_number || whatsapp || phone).trim().replace(/[^0-9+]/g, '');
    const cleanWhatsapp = rawWhatsapp.length >= 10 ? rawWhatsapp : phone.trim();

    // 2. Generate unique lead ID
    const countRow = db.prepare('SELECT COUNT(*) as count FROM car_rental_leads').get();
    const nextSeq = (countRow ? countRow.count : 0) + 1;
    const leadId = `JA-CAB-${new Date().getFullYear()}-${String(nextSeq).padStart(4, '0')}`;

    // 3. Insert into car_rental_leads
    const result = db.prepare(`
      INSERT INTO car_rental_leads (
        lead_id, name, phone, whatsapp_number, email,
        travel_date, return_date, pickup_location, drop_location,
        car_type, passengers_count, trip_type, service_requirements, status
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, 'New'
      )
    `).run(
      leadId,
      name.trim(),
      phone.trim(),
      cleanWhatsapp,
      email.trim() || '',
      travel_date,
      return_date || null,
      pickup_location.trim(),
      drop_location.trim(),
      car_type.trim() || 'Dzire / Etios (Sedan)',
      passengers,
      trip_type.trim() || 'Outstation Round-Trip',
      service_requirements.trim() || ''
    );

    const dbId = result.lastInsertRowid;

    // Also update / insert into customers table
    try {
      const existingCustomer = db.prepare('SELECT id FROM customers WHERE phone = ?').get(phone.trim());
      if (existingCustomer) {
        db.prepare('UPDATE customers SET name = ?, email = COALESCE(NULLIF(?, ""), email), whatsapp_number = COALESCE(NULLIF(?, ""), whatsapp_number), updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .run(name.trim(), email.trim(), cleanWhatsapp, existingCustomer.id);
      } else {
        db.prepare('INSERT INTO customers (name, email, phone, whatsapp_number, address) VALUES (?, ?, ?, ?, ?)')
          .run(name.trim(), email.trim(), phone.trim(), cleanWhatsapp, pickup_location.trim());
      }
    } catch (e) {
      console.warn('[CarRental] Customer profile sync warning:', e.message);
    }

    // 4. Log in audit_logs
    db.prepare(`
      INSERT INTO audit_logs (action, details, admin_user)
      VALUES ('NEW_CAR_RENTAL_LEAD', ?, 'Website Visitor')
    `).run(`New car rental lead ${leadId} for ${name.trim()} (${car_type} from ${pickup_location.trim()} to ${drop_location.trim()} on ${travel_date})`);

    // 5. Dispatch non-blocking admin email alert
    NotificationService.sendCarRentalAlert({
      lead: {
        id: dbId,
        lead_id: leadId,
        name: name.trim(),
        phone: phone.trim(),
        whatsapp_number: cleanWhatsapp,
        email: email.trim(),
        travel_date,
        return_date,
        pickup_location: pickup_location.trim(),
        drop_location: drop_location.trim(),
        car_type: car_type.trim(),
        passengers_count: passengers,
        trip_type: trip_type.trim(),
        service_requirements: service_requirements.trim(),
        status: 'New'
      }
    }).catch(err => console.error('[CarRental] Error sending email notification:', err.message));

    res.json({
      success: true,
      leadId: leadId,
      message: 'Thank you! Your car rental enquiry has been received. Our fleet coordinator will check vehicle availability and send you a confirmed quotation via WhatsApp/call.'
    });
  } catch (err) {
    console.error('Error submitting car rental enquiry:', err);
    res.status(500).json({ success: false, error: 'Failed to submit car rental enquiry: ' + err.message });
  }
});

export default carRentalRouter;
