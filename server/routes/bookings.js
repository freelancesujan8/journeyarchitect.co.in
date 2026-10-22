import express from 'express';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { PaymentService } from '../services/paymentService.js';
import { NotificationService } from '../services/notificationService.js';

export const bookingsRouter = express.Router();

/**
 * Helper: Independently calculate server-side pricing
 */
export function calculateServerPricing(pkg, adultsCount = 1, childrenCount = 0) {
  const adults = Math.max(1, parseInt(adultsCount, 10) || 1);
  const children = Math.max(0, parseInt(childrenCount, 10) || 0);

  const rawTotalPrice = Number(pkg.total_price);
  const totalPrice = !isNaN(rawTotalPrice) && rawTotalPrice > 0 ? rawTotalPrice : 15000;

  const rawAdultPrice = Number(pkg.adult_price);
  const adultPrice = !isNaN(rawAdultPrice) && rawAdultPrice > 0 ? rawAdultPrice : Math.round(totalPrice / 2);

  const rawChildPrice = Number(pkg.child_price);
  const childPrice = !isNaN(rawChildPrice) && rawChildPrice > 0 ? rawChildPrice : Math.round(totalPrice * 0.35);

  let totalAmount = 0;
  if (adultPrice > 0) {
    totalAmount = (adults * adultPrice) + (children * childPrice);
  } else {
    totalAmount = totalPrice * (adults >= 2 ? (adults / 2) : 1);
  }

  totalAmount = Math.round(Number(totalAmount) || totalPrice || 15000);

  let bookingAmount = 0;
  if (pkg.payment_type === 'full') {
    bookingAmount = totalAmount;
  } else if (pkg.payment_type === 'percentage') {
    const rawPct = Number(pkg.booking_percentage);
    const pct = !isNaN(rawPct) && rawPct > 0 ? rawPct : 20;
    bookingAmount = Math.round(totalAmount * (pct / 100));
  } else {
    // Fixed booking amount (per traveler or base)
    const rawBaseBooking = Number(pkg.booking_amount);
    const baseBooking = !isNaN(rawBaseBooking) && rawBaseBooking > 0 ? rawBaseBooking : 2500;
    bookingAmount = Math.min(totalAmount, baseBooking * (adults >= 2 ? (adults / 2) : 1));
    bookingAmount = Math.round(Number(bookingAmount) || 2500);
  }

  const remainingAmount = Math.max(0, totalAmount - bookingAmount);

  return {
    totalAmount,
    bookingAmount,
    remainingAmount,
    paymentType: pkg.payment_type || 'fixed',
    adults,
    children
  };
}

/**
 * POST /api/bookings/calculate-price — Real-time server-side price calculation
 */
bookingsRouter.post('/calculate-price', (req, res) => {
  try {
    const { packageId, slug, adults, children } = req.body;
    let pkg = null;

    if (packageId) {
      pkg = db.prepare('SELECT * FROM packages WHERE id = ?').get(packageId);
    } else if (slug) {
      pkg = db.prepare('SELECT * FROM packages WHERE slug = ?').get(slug);
    }

    if (!pkg) {
      return res.status(404).json({ success: false, error: 'Tour package not found' });
    }

    const pricing = calculateServerPricing(pkg, adults, children);
    res.json({ success: true, pricing });
  } catch (err) {
    console.error('Error calculating price:', err);
    res.status(500).json({ success: false, error: 'Failed to calculate pricing' });
  }
});

/**
 * POST /api/bookings/create-order — Create pending booking and payment order
 */
bookingsRouter.post('/create-order', async (req, res) => {
  try {
    const {
      packageId,
      slug,
      travelDate,
      returnDate,
      adults = 1,
      children = 0,
      customer = {},
      travelers = [],
      pickupLocation,
      specialRequirements,
      foodPreferences,
      notes
    } = req.body;

    // 1. Validate package
    let pkg = null;
    if (packageId) {
      pkg = db.prepare('SELECT * FROM packages WHERE id = ?').get(packageId);
    } else if (slug) {
      pkg = db.prepare('SELECT * FROM packages WHERE slug = ?').get(slug);
    }

    if (!pkg) {
      return res.status(404).json({ success: false, error: 'Tour package not found' });
    }

    if (pkg.availability_status === 'sold_out' || pkg.availability_status === 'archived') {
      return res.status(400).json({ success: false, error: 'This tour package is currently unavailable or sold out.' });
    }

    // 2. Validate travel date (cannot be in the past)
    if (!travelDate) {
      return res.status(400).json({ success: false, error: 'Please select a valid travel date.' });
    }
    const selectedDate = new Date(travelDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return res.status(400).json({ success: false, error: 'Travel date cannot be in the past.' });
    }

    // 3. Validate seat availability
    const totalTravelers = (parseInt(adults, 10) || 1) + (parseInt(children, 10) || 0);
    if (pkg.max_seats && (pkg.booked_seats + totalTravelers > pkg.max_seats)) {
      const remainingSeats = Math.max(0, pkg.max_seats - pkg.booked_seats);
      return res.status(400).json({
        success: false,
        error: `Only ${remainingSeats} seat(s) remaining for this package.`
      });
    }

    // 4. Validate customer details
    if (!customer.name || !customer.phone) {
      return res.status(400).json({ success: false, error: 'Customer name and phone number are required.' });
    }

    // 5. Server-side price calculation
    const pricing = calculateServerPricing(pkg, adults, children);

    // 6. DB Transaction to create customer, pending booking, and travelers
    const tempBookingId = `PKHM-TMP-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const accessToken = crypto.randomBytes(24).toString('hex');

    const transaction = db.transaction(() => {
      // Find or insert customer
      let customerId;
      const rawWhatsapp = (customer.whatsapp_number || customer.whatsapp || customer.phone || '').trim().replace(/[^0-9+]/g, '');
      const cleanWhatsapp = rawWhatsapp.length >= 10 ? rawWhatsapp : customer.phone;

      const existingCustomer = db.prepare('SELECT id FROM customers WHERE phone = ?').get(customer.phone);
      if (existingCustomer) {
        customerId = existingCustomer.id;
        db.prepare('UPDATE customers SET name = ?, email = ?, whatsapp_number = COALESCE(NULLIF(?, ""), whatsapp_number), address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .run(customer.name, customer.email || '', cleanWhatsapp, customer.address || '', customerId);
      } else {
        const custResult = db.prepare('INSERT INTO customers (name, email, phone, whatsapp_number, address) VALUES (?, ?, ?, ?, ?)')
          .run(customer.name, customer.email || '', customer.phone, cleanWhatsapp, customer.address || '');
        customerId = custResult.lastInsertRowid;
      }

      // Insert booking record (status: PENDING_PAYMENT)
      const bookingResult = db.prepare(`
        INSERT INTO bookings (
          booking_id, access_token, package_id, customer_id, travel_date, return_date,
          adults, children, total_amount, booking_amount, paid_amount, remaining_amount,
          booking_status, payment_status, pickup_location, special_requirements, food_preferences, notes, whatsapp_number
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, 0, ?,
          'PENDING_PAYMENT', 'PENDING', ?, ?, ?, ?, ?
        )
      `).run(
        tempBookingId,
        accessToken,
        pkg.id,
        customerId,
        travelDate,
        returnDate || null,
        pricing.adults,
        pricing.children,
        pricing.totalAmount,
        pricing.bookingAmount,
        pricing.totalAmount, // Initially remaining is total until payment confirmed
        pickupLocation || '',
        specialRequirements || '',
        foodPreferences || '',
        notes || '',
        cleanWhatsapp
      );

      const dbBookingId = bookingResult.lastInsertRowid;

      // Insert travelers
      const insertTravelerStmt = db.prepare(`
        INSERT INTO travelers (booking_id, name, age, gender, id_type, id_number)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      if (travelers && Array.isArray(travelers) && travelers.length > 0) {
        for (const t of travelers) {
          if (t.name) {
            insertTravelerStmt.run(dbBookingId, t.name, t.age || null, t.gender || '', t.id_type || '', t.id_number || '');
          }
        }
      } else {
        // Add primary customer as default traveler
        insertTravelerStmt.run(dbBookingId, customer.name, null, '', '', '');
      }

      return { dbBookingId, tempBookingId, customerId };
    });

    const { dbBookingId } = transaction();

    // 7. Create Payment Gateway Order
    const paymentOrder = await PaymentService.createPaymentOrder({
      bookingId: tempBookingId,
      amount: pricing.bookingAmount,
      customer: customer
    });

    // Record pending payment in payments table
    db.prepare(`
      INSERT INTO payments (
        payment_reference, booking_id, gateway, gateway_order_id, amount, status
      ) VALUES (?, ?, ?, ?, ?, 'PENDING')
    `).run(
      paymentOrder.orderId,
      dbBookingId,
      paymentOrder.gateway,
      paymentOrder.orderId,
      pricing.bookingAmount
    );

    res.json({
      success: true,
      bookingId: tempBookingId,
      accessToken: accessToken,
      package: {
        id: pkg.id,
        name: pkg.name,
        slug: pkg.slug,
        duration: `${pkg.duration_days} Days / ${pkg.duration_nights} Nights`
      },
      pricing: pricing,
      paymentOrder: paymentOrder
    });
  } catch (err) {
    console.error('Error creating booking order:', err);
    res.status(500).json({ success: false, error: 'Failed to create booking order: ' + err.message });
  }
});

/**
 * POST /api/bookings/direct-book — Direct package booking with NO online payment required
 */
bookingsRouter.post('/direct-book', async (req, res) => {
  try {
    const {
      packageId,
      slug,
      travelDate,
      returnDate,
      adults = 1,
      children = 0,
      customer = {},
      travelers = [],
      pickupLocation,
      specialRequirements,
      notes
    } = req.body;

    // 1. Validate package
    let pkg = null;
    if (packageId) {
      pkg = db.prepare('SELECT * FROM packages WHERE id = ?').get(packageId);
    } else if (slug) {
      pkg = db.prepare('SELECT * FROM packages WHERE slug = ?').get(slug);
    }

    if (!pkg) {
      return res.status(404).json({ success: false, error: 'Tour package not found' });
    }

    if (pkg.availability_status === 'sold_out' || pkg.availability_status === 'archived') {
      return res.status(400).json({ success: false, error: 'This tour package is currently unavailable or sold out.' });
    }

    // 2. Validate travel date
    if (!travelDate) {
      return res.status(400).json({ success: false, error: 'Please select a valid travel date.' });
    }

    // 3. Validate customer details
    if (!customer.name || !customer.phone) {
      return res.status(400).json({ success: false, error: 'Customer name and phone number are required.' });
    }

    // 4. Calculate Server Pricing
    const pricing = calculateServerPricing(pkg, adults, children);

    // 5. Generate official booking reference ID & access token
    const countRow = db.prepare('SELECT COUNT(*) as count FROM bookings').get();
    const nextSeq = (countRow ? countRow.count : 0) + 1;
    const officialBookingId = `JA-${new Date().getFullYear()}-${String(nextSeq).padStart(4, '0')}`;
    const accessToken = crypto.randomBytes(24).toString('hex');

    // 6. DB Transaction to insert customer, booking and travelers
    const transaction = db.transaction(() => {
      let customerId;
      const rawWhatsapp = (customer.whatsapp_number || customer.whatsapp || customer.phone || '').trim().replace(/[^0-9+]/g, '');
      const cleanWhatsapp = rawWhatsapp.length >= 10 ? rawWhatsapp : customer.phone;

      const existingCustomer = db.prepare('SELECT id FROM customers WHERE phone = ?').get(customer.phone);
      if (existingCustomer) {
        customerId = existingCustomer.id;
        db.prepare('UPDATE customers SET name = ?, email = ?, whatsapp_number = COALESCE(NULLIF(?, ""), whatsapp_number), address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .run(customer.name, customer.email || '', cleanWhatsapp, customer.address || '', customerId);
      } else {
        const custResult = db.prepare('INSERT INTO customers (name, email, phone, whatsapp_number, address) VALUES (?, ?, ?, ?, ?)')
          .run(customer.name, customer.email || '', customer.phone, cleanWhatsapp, customer.address || '');
        customerId = custResult.lastInsertRowid;
      }

      // Insert directly as CONFIRMED (No online payment required)
      const bookingResult = db.prepare(`
        INSERT INTO bookings (
          booking_id, access_token, package_id, customer_id, travel_date, return_date,
          adults, children, total_amount, booking_amount, paid_amount, remaining_amount,
          booking_status, payment_status, pickup_location, special_requirements, notes, whatsapp_number
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, 0, 0, ?,
          'CONFIRMED', 'PAY_ON_ARRIVAL', ?, ?, ?, ?
        )
      `).run(
        officialBookingId,
        accessToken,
        pkg.id,
        customerId,
        travelDate,
        returnDate || null,
        pricing.adults,
        pricing.children,
        pricing.totalAmount,
        pricing.totalAmount,
        pickupLocation || '',
        specialRequirements || '',
        notes || 'Direct Tour Booking (No online payment required). Balance to be settled offline / on tour.',
        cleanWhatsapp
      );

      const dbBookingId = bookingResult.lastInsertRowid;

      // Insert travelers
      const insertTravelerStmt = db.prepare(`
        INSERT INTO travelers (booking_id, name, age, gender, id_type, id_number)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      if (travelers && Array.isArray(travelers) && travelers.length > 0) {
        for (const t of travelers) {
          if (t.name) {
            insertTravelerStmt.run(dbBookingId, t.name, t.age || null, t.gender || '', t.id_type || '', t.id_number || '');
          }
        }
      } else {
        insertTravelerStmt.run(dbBookingId, customer.name, null, '', '', '');
      }

      // Increment booked seats
      const travelerCount = pricing.adults + pricing.children;
      db.prepare(`
        UPDATE packages
        SET booked_seats = booked_seats + ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(travelerCount, pkg.id);

      // Audit log
      db.prepare(`
        INSERT INTO audit_logs (action, details, admin_user)
        VALUES ('DIRECT_BOOKING_CONFIRMED', ?, 'Direct Booking')
      `).run(`Booking ${officialBookingId} confirmed directly for ${customer.name} (${customer.phone}) - Total ₹${pricing.totalAmount}`);

      return { dbBookingId, officialBookingId, customerId };
    });

    const result = transaction();

    // Asynchronously dispatch admin booking alert email to dynamic notification email
    NotificationService.sendAdminAlert({
      booking: {
        id: result.dbBookingId,
        booking_id: result.officialBookingId,
        travel_date: travelDate,
        return_date: returnDate,
        adults: pricing.adults,
        children: pricing.children,
        total_amount: pricing.totalAmount,
        paid_amount: 0,
        remaining_amount: pricing.totalAmount,
        booking_status: 'CONFIRMED',
        payment_status: 'PAY_ON_ARRIVAL',
        pickup_location: pickupLocation,
        special_requirements: specialRequirements,
        notes: notes
      },
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address
      },
      pkg: {
        name: pkg.name,
        destination: pkg.destination,
        tour_category: pkg.tour_category,
        duration: `${pkg.duration_days} Days / ${pkg.duration_nights} Nights`
      },
      travelers: travelers
    }).catch(err => console.error('[Bookings] Error sending direct booking email alert:', err));

    res.json({
      success: true,
      bookingId: result.officialBookingId,
      accessToken: accessToken,
      package: {
        id: pkg.id,
        name: pkg.name,
        slug: pkg.slug,
        duration: `${pkg.duration_days} Days / ${pkg.duration_nights} Nights`
      },
      pricing: pricing,
      message: 'Booking confirmed successfully without online payment.'
    });
  } catch (err) {
    console.error('Error creating direct booking:', err);
    res.status(500).json({ success: false, error: 'Failed to confirm booking: ' + err.message });
  }
});

/**
 * POST /api/bookings/enquiry — Submit trip planning enquiry & lead
 */
bookingsRouter.post('/enquiry', async (req, res) => {
  try {
    const {
      destination = '',
      tripType = 'holiday',
      travelDate = '',
      returnDate = '',
      adults = 2,
      children = 0,
      budget = '',
      name = '',
      phone = '',
      whatsapp = '',
      whatsapp_number = '',
      email = '',
      message = ''
    } = req.body;

    if (!name.trim()) {
      return res.status(400).json({ success: false, error: 'Please provide your full name.' });
    }
    if (!phone.trim() || phone.trim().length < 8) {
      return res.status(400).json({ success: false, error: 'Please provide a valid contact number.' });
    }

    const rawWhatsapp = (whatsapp || whatsapp_number || phone).trim().replace(/[^0-9+]/g, '');
    const cleanWhatsapp = rawWhatsapp.length >= 10 ? rawWhatsapp : phone.trim();

    // Match package by destination or use default
    let pkg = null;
    if (destination.trim()) {
      pkg = db.prepare('SELECT * FROM packages WHERE name LIKE ? OR destination LIKE ? LIMIT 1')
        .get(`%${destination.trim()}%`, `%${destination.trim()}%`);
    }
    if (!pkg) {
      pkg = db.prepare('SELECT * FROM packages LIMIT 1').get();
    }

    const countRow = db.prepare('SELECT COUNT(*) as count FROM bookings').get();
    const nextSeq = (countRow ? countRow.count : 0) + 1;
    const enquiryId = `JA-ENQ-${new Date().getFullYear()}-${String(nextSeq).padStart(4, '0')}`;
    const accessToken = crypto.randomBytes(24).toString('hex');

    const rawBudget = parseInt(String(budget).replace(/[^0-9]/g, ''), 10);
    const estimatedTotal = !isNaN(rawBudget) && rawBudget > 0 ? rawBudget : (pkg ? Number(pkg.total_price) || 15000 : 15000);

    const transaction = db.transaction(() => {
      // Find or insert customer
      let customerId;
      const existingCustomer = db.prepare('SELECT id FROM customers WHERE phone = ?').get(phone.trim());
      if (existingCustomer) {
        customerId = existingCustomer.id;
        db.prepare('UPDATE customers SET name = ?, email = ?, whatsapp_number = COALESCE(NULLIF(?, ""), whatsapp_number), updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .run(name.trim(), email.trim() || '', cleanWhatsapp, customerId);
      } else {
        const custResult = db.prepare('INSERT INTO customers (name, email, phone, whatsapp_number, address) VALUES (?, ?, ?, ?, ?)')
          .run(name.trim(), email.trim() || '', phone.trim(), cleanWhatsapp, destination.trim() || '');
        customerId = custResult.lastInsertRowid;
      }

      // Insert enquiry record into bookings table
      const formattedDate = travelDate || new Date().toISOString().split('T')[0];
      const leadNotes = `[Website Trip Enquiry] Destination: ${destination || 'Custom'} | Trip Type: ${tripType} | Budget: ₹${estimatedTotal}${message ? ` | Note: ${message}` : ''}`;

      const bookingResult = db.prepare(`
        INSERT INTO bookings (
          booking_id, access_token, package_id, customer_id, travel_date, return_date,
          adults, children, total_amount, booking_amount, paid_amount, remaining_amount,
          booking_status, payment_status, pickup_location, special_requirements, notes, whatsapp_number
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, 0, 0, ?,
          'PENDING_PAYMENT', 'PENDING', ?, ?, ?, ?
        )
      `).run(
        enquiryId,
        accessToken,
        pkg ? pkg.id : 1,
        customerId,
        formattedDate,
        returnDate || null,
        Number(adults) || 1,
        Number(children) || 0,
        estimatedTotal,
        estimatedTotal,
        destination || '',
        message || '',
        leadNotes,
        cleanWhatsapp
      );

      const dbBookingId = bookingResult.lastInsertRowid;

      // Insert primary traveler
      db.prepare(`
        INSERT INTO travelers (booking_id, name, age, gender)
        VALUES (?, ?, ?, ?)
      `).run(dbBookingId, name.trim(), 30, 'Lead Traveler');

      // Log in audit table
      db.prepare(`
        INSERT INTO audit_logs (action, details, admin_user)
        VALUES ('NEW_TRIP_ENQUIRY', ?, 'Website Visitor')
      `).run(`New enquiry ${enquiryId} from ${name.trim()} (${phone.trim()}) for ${destination || 'Custom Trip'}`);

      return { dbBookingId, enquiryId };
    });

    const result = transaction();

    // Asynchronously dispatch admin alert for new lead / enquiry
    NotificationService.sendAdminAlert({
      booking: {
        id: result.dbBookingId,
        booking_id: result.enquiryId,
        travel_date: formattedDate,
        return_date: returnDate,
        adults: Number(adults) || 1,
        children: Number(children) || 0,
        total_amount: estimatedTotal,
        paid_amount: 0,
        remaining_amount: estimatedTotal,
        booking_status: 'ENQUIRY',
        payment_status: 'PENDING',
        pickup_location: destination,
        special_requirements: message,
        notes: leadNotes
      },
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: destination.trim()
      },
      pkg: {
        name: pkg ? pkg.name : (destination || 'Custom Tour'),
        destination: destination || (pkg ? pkg.destination : 'North Bengal / Sikkim'),
        tour_category: tripType,
        duration: 'Custom Itinerary'
      },
      travelers: [{ name: name.trim() }]
    }).catch(err => console.error('[Bookings] Error sending enquiry email alert:', err));

    res.json({
      success: true,
      bookingId: result.enquiryId,
      accessToken,
      message: 'Enquiry submitted successfully! Our travel team will contact you shortly.'
    });
  } catch (err) {
    console.error('Error submitting enquiry:', err);
    res.status(500).json({ success: false, error: 'Failed to record enquiry: ' + err.message });
  }
});

/**
 * GET /api/bookings/:bookingId — Secure lookup for booking details
 */
bookingsRouter.get('/:bookingId', (req, res) => {
  try {
    const { bookingId } = req.params;
    const { token, phone } = req.query;

    const booking = db.prepare(`
      SELECT b.*, p.name as package_name, p.slug as package_slug, p.destination, p.duration_days,
             p.duration_nights, p.thumbnail, p.hotel_info, p.transport_info, p.meals_info,
             c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.address as customer_address
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      JOIN customers c ON b.customer_id = c.id
      WHERE b.booking_id = ?
    `).get(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking record not found' });
    }

    // Security verification: require matching access token or phone verification (or admin)
    const isAdmin = req.headers['x-admin-auth'] === 'journeyarchitect_admin_session_valid';
    if (!isAdmin && token && token !== booking.access_token) {
      return res.status(403).json({ success: false, error: 'Unauthorized booking access' });
    }
    if (!isAdmin && !token && phone && phone !== booking.customer_phone) {
      return res.status(403).json({ success: false, error: 'Phone number does not match booking record' });
    }

    // Fetch travelers
    const travelers = db.prepare('SELECT * FROM travelers WHERE booking_id = ?').all(booking.id);

    // Fetch payment transactions
    const payments = db.prepare('SELECT * FROM payments WHERE booking_id = ? ORDER BY id DESC').all(booking.id);

    res.json({
      success: true,
      booking: {
        ...booking,
        travelers,
        payments
      }
    });
  } catch (err) {
    console.error('Error looking up booking:', err);
    res.status(500).json({ success: false, error: 'Failed to lookup booking' });
  }
});
