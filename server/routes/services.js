import express from 'express';
import { db } from '../db/database.js';

export const servicesRouter = express.Router();

function safeParseJson(data, fallback = []) {
  if (!data) return fallback;
  if (typeof data === 'object') return data;
  try {
    const parsed = JSON.parse(data);
    if (typeof parsed === 'string') {
      try { return JSON.parse(parsed); } catch { return parsed; }
    }
    return parsed;
  } catch (err) {
    return fallback;
  }
}

function parseServiceFields(s) {
  if (!s) return null;
  return {
    ...s,
    key_features: safeParseJson(s.key_features, []),
    offerings: safeParseJson(s.offerings, []),
    faqs: safeParseJson(s.faqs, [])
  };
}

/**
 * GET /api/services — List active services
 */
servicesRouter.get('/', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT * FROM services 
      WHERE is_active = 1 
      ORDER BY display_order ASC, id ASC
    `).all();

    res.json({ success: true, count: rows.length, services: rows.map(parseServiceFields) });
  } catch (err) {
    console.error('Error fetching public services:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch services' });
  }
});

/**
 * GET /api/services/:slug — Get single service by slug or id
 */
servicesRouter.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    let s = db.prepare('SELECT * FROM services WHERE slug = ?').get(slug);
    if (!s) {
      s = db.prepare('SELECT * FROM services WHERE service_id = ? OR id = ?').get(slug, slug);
    }

    if (!s) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    res.json({ success: true, service: parseServiceFields(s) });
  } catch (err) {
    console.error('Error fetching service details:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch service details' });
  }
});
