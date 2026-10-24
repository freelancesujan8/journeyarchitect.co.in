import express from 'express';
import { db } from '../db/database.js';
import { requireAdminAuth } from './admin.js';

export const calendarRouter = express.Router();

// Enforce admin authentication across all calendar endpoints
calendarRouter.use(requireAdminAuth);

/**
 * GET /api/admin/calendar
 * Fetch calendar events with flexible filtering (month, date range, category, status, search)
 */
calendarRouter.get('/', (req, res) => {
  try {
    const { month, startDate, endDate, category, status, priority, search } = req.query;

    let query = 'SELECT * FROM calendar_events WHERE 1=1';
    const params = [];

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      query += ' AND event_date LIKE ?';
      params.push(`${month}%`);
    } else if (startDate && endDate) {
      query += ' AND event_date >= ? AND event_date <= ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ' AND event_date >= ?';
      params.push(startDate);
    }

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (priority && priority !== 'all') {
      query += ' AND priority = ?';
      params.push(priority);
    }

    if (search && search.trim()) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    query += ' ORDER BY event_date ASC, is_all_day DESC, start_time ASC, id ASC';

    const events = db.prepare(query).all(...params);

    res.json({
      success: true,
      events,
      count: events.length
    });
  } catch (err) {
    console.error('Error fetching calendar events:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch calendar events: ' + err.message });
  }
});

/**
 * GET /api/admin/calendar/summary
 * Quick metrics for the dashboard & calendar views
 */
calendarRouter.get('/summary', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7);

    const totalEvents = db.prepare('SELECT COUNT(*) as count FROM calendar_events').get().count;
    const monthEvents = db.prepare('SELECT COUNT(*) as count FROM calendar_events WHERE event_date LIKE ?').get(`${currentMonth}%`).count;
    const todayEvents = db.prepare('SELECT COUNT(*) as count FROM calendar_events WHERE event_date = ?').get(today).count;
    const pendingReminders = db.prepare("SELECT COUNT(*) as count FROM calendar_events WHERE status = 'pending' AND (category = 'reminder' OR category = 'note')").get().count;
    const urgentItems = db.prepare("SELECT COUNT(*) as count FROM calendar_events WHERE status = 'pending' AND priority = 'urgent'").get().count;

    res.json({
      success: true,
      summary: {
        totalEvents,
        monthEvents,
        todayEvents,
        pendingReminders,
        urgentItems,
        todayDate: today,
        currentMonth
      }
    });
  } catch (err) {
    console.error('Error fetching calendar summary:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch summary: ' + err.message });
  }
});

/**
 * GET /api/admin/calendar/date/:date
 * Retrieve all events and notes for a specific calendar date (YYYY-MM-DD)
 */
calendarRouter.get('/date/:date', (req, res) => {
  try {
    const { date } = req.params;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, error: 'Invalid date format. Expected YYYY-MM-DD' });
    }

    const events = db.prepare(`
      SELECT * FROM calendar_events 
      WHERE event_date = ? 
      ORDER BY is_all_day DESC, start_time ASC, id ASC
    `).all(date);

    res.json({
      success: true,
      date,
      events,
      count: events.length
    });
  } catch (err) {
    console.error('Error fetching events for date:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch events: ' + err.message });
  }
});

/**
 * POST /api/admin/calendar
 * Create a new event, note, or reminder
 */
calendarRouter.post('/', (req, res) => {
  try {
    const {
      title,
      event_date,
      start_time = '',
      end_time = '',
      is_all_day = 1,
      category = 'event',
      priority = 'normal',
      status = 'pending',
      description = '',
      color = '#2563EB'
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Event title is required' });
    }

    if (!event_date || !/^\d{4}-\d{2}-\d{2}$/.test(event_date)) {
      return res.status(400).json({ success: false, error: 'Valid event date (YYYY-MM-DD) is required' });
    }

    const stmt = db.prepare(`
      INSERT INTO calendar_events (
        title, event_date, start_time, end_time, is_all_day,
        category, priority, status, description, color, created_by
      ) VALUES (
        @title, @event_date, @start_time, @end_time, @is_all_day,
        @category, @priority, @status, @description, @color, 'Admin'
      )
    `);

    const result = stmt.run({
      title: title.trim(),
      event_date,
      start_time: start_time || '',
      end_time: end_time || '',
      is_all_day: is_all_day ? 1 : 0,
      category: category || 'event',
      priority: priority || 'normal',
      status: status || 'pending',
      description: (description || '').trim(),
      color: color || '#2563EB'
    });

    const newEvent = db.prepare('SELECT * FROM calendar_events WHERE id = ?').get(result.lastInsertRowid);

    // Audit log
    try {
      db.prepare(`
        INSERT INTO audit_logs (action, details, admin_user)
        VALUES ('Created Calendar Entry', ?, 'Super Admin')
      `).run(`Created ${category}: "${title}" for ${event_date}`);
    } catch (logErr) {
      console.warn('Audit log write error:', logErr.message);
    }

    res.status(201).json({
      success: true,
      event: newEvent,
      message: 'Calendar entry created successfully'
    });
  } catch (err) {
    console.error('Error creating calendar event:', err);
    res.status(500).json({ success: false, error: 'Failed to create calendar event: ' + err.message });
  }
});

/**
 * PUT /api/admin/calendar/:id
 * Update an existing event or note
 */
calendarRouter.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM calendar_events WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Calendar event not found' });
    }

    const {
      title,
      event_date,
      start_time,
      end_time,
      is_all_day,
      category,
      priority,
      status,
      description,
      color
    } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ success: false, error: 'Event title cannot be empty' });
    }

    if (event_date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(event_date)) {
      return res.status(400).json({ success: false, error: 'Valid event date (YYYY-MM-DD) is required' });
    }

    const updatedData = {
      title: title !== undefined ? title.trim() : existing.title,
      event_date: event_date !== undefined ? event_date : existing.event_date,
      start_time: start_time !== undefined ? (start_time || '') : existing.start_time,
      end_time: end_time !== undefined ? (end_time || '') : existing.end_time,
      is_all_day: is_all_day !== undefined ? (is_all_day ? 1 : 0) : existing.is_all_day,
      category: category !== undefined ? category : existing.category,
      priority: priority !== undefined ? priority : existing.priority,
      status: status !== undefined ? status : existing.status,
      description: description !== undefined ? description.trim() : existing.description,
      color: color !== undefined ? color : existing.color,
      id
    };

    db.prepare(`
      UPDATE calendar_events SET
        title = @title,
        event_date = @event_date,
        start_time = @start_time,
        end_time = @end_time,
        is_all_day = @is_all_day,
        category = @category,
        priority = @priority,
        status = @status,
        description = @description,
        color = @color,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `).run(updatedData);

    const updatedEvent = db.prepare('SELECT * FROM calendar_events WHERE id = ?').get(id);

    // Audit log
    try {
      db.prepare(`
        INSERT INTO audit_logs (action, details, admin_user)
        VALUES ('Updated Calendar Entry', ?, 'Super Admin')
      `).run(`Updated ${updatedEvent.category}: "${updatedEvent.title}" (ID: ${id})`);
    } catch (logErr) {
      console.warn('Audit log write error:', logErr.message);
    }

    res.json({
      success: true,
      event: updatedEvent,
      message: 'Calendar entry updated successfully'
    });
  } catch (err) {
    console.error('Error updating calendar event:', err);
    res.status(500).json({ success: false, error: 'Failed to update calendar event: ' + err.message });
  }
});

/**
 * DELETE /api/admin/calendar/:id
 * Remove a calendar event or note
 */
calendarRouter.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM calendar_events WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Calendar event not found' });
    }

    db.prepare('DELETE FROM calendar_events WHERE id = ?').run(id);

    // Audit log
    try {
      db.prepare(`
        INSERT INTO audit_logs (action, details, admin_user)
        VALUES ('Deleted Calendar Entry', ?, 'Super Admin')
      `).run(`Deleted ${existing.category}: "${existing.title}" on ${existing.event_date}`);
    } catch (logErr) {
      console.warn('Audit log write error:', logErr.message);
    }

    res.json({
      success: true,
      message: 'Calendar entry deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting calendar event:', err);
    res.status(500).json({ success: false, error: 'Failed to delete calendar event: ' + err.message });
  }
});

/**
 * PATCH /api/admin/calendar/:id/toggle
 * Quickly toggle completion status between pending and completed
 */
calendarRouter.patch('/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM calendar_events WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Calendar event not found' });
    }

    const nextStatus = existing.status === 'completed' ? 'pending' : 'completed';

    db.prepare(`
      UPDATE calendar_events SET
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(nextStatus, id);

    const updatedEvent = db.prepare('SELECT * FROM calendar_events WHERE id = ?').get(id);

    res.json({
      success: true,
      event: updatedEvent,
      message: `Status changed to ${nextStatus}`
    });
  } catch (err) {
    console.error('Error toggling calendar event status:', err);
    res.status(500).json({ success: false, error: 'Failed to toggle status: ' + err.message });
  }
});
