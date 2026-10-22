import express from 'express';
import { db } from '../db/database.js';

export const packagesRouter = express.Router();

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

function parsePackageJsonFields(pkg) {
  if (!pkg) return null;
  return {
    ...pkg,
    gallery_images: safeParseJson(pkg.gallery_images, []),
    inclusions: safeParseJson(pkg.inclusions, []),
    exclusions: safeParseJson(pkg.exclusions, []),
    itinerary: safeParseJson(pkg.itinerary, [])
  };
}

/**
 * GET /api/packages — Get all active/available packages
 */
packagesRouter.get('/', (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = "SELECT * FROM packages WHERE status = 'published'";
    const params = [];

    if (category && category !== 'all') {
      query += ' AND tour_category = ?';
      params.push(category);
    }

    if (featured === '1' || featured === 'true') {
      query += ' AND featured = 1';
    }

    query += ' ORDER BY featured DESC, id ASC';
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    const parsed = rows.map(parsePackageJsonFields);
    res.json({ success: true, packages: parsed });
  } catch (err) {
    console.error('Error fetching packages:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch tour packages' });
  }
});

/**
 * GET /api/packages/:slug — Get package details by slug or ID
 */
packagesRouter.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    let stmt = db.prepare("SELECT * FROM packages WHERE slug = ?");
    let row = stmt.get(slug);

    if (!row) {
      stmt = db.prepare("SELECT * FROM packages WHERE package_id = ? OR id = ?");
      row = stmt.get(slug, slug);
    }

    if (!row) {
      return res.status(404).json({ success: false, error: 'Tour package not found' });
    }

    res.json({ success: true, package: parsePackageJsonFields(row) });
  } catch (err) {
    console.error('Error fetching package by slug:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch package details' });
  }
});
