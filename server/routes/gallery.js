import express from 'express';
import { db } from '../db/database.js';

export const galleryRouter = express.Router();

/**
 * GET /api/gallery — Public endpoint to fetch active gallery photos & videos
 */
galleryRouter.get('/', (req, res) => {
  try {
    const { category = 'all' } = req.query;
    let query = `
      SELECT id, title, media_type, media_url, thumbnail_url, category, location, caption, display_order, is_active, created_at
      FROM gallery_items
      WHERE is_active = 1
    `;
    const params = [];

    if (category && category !== 'all') {
      query += ` AND category = ?`;
      params.push(category);
    }

    query += ` ORDER BY display_order ASC, id DESC`;

    const items = db.prepare(query).all(...params);

    const categoryLabels = {
      mountains: 'Mountains',
      nature: 'Forests & Wildlife',
      coastal: 'Coastal & Sea',
      group: 'Travel Moments'
    };

    // Map to frontend-friendly structure matching GALLERY_DATA contract
    const formatted = items.map((item, idx) => ({
      id: item.id,
      title: item.title,
      mediaType: item.media_type === 'video' ? 'video' : 'photo',
      media_type: item.media_type,
      image: item.thumbnail_url || item.media_url,
      posterImage: item.thumbnail_url || item.media_url,
      videoUrl: item.media_type === 'video' ? item.media_url : null,
      media_url: item.media_url,
      thumbnail_url: item.thumbnail_url,
      category: item.category,
      categoryLabel: categoryLabels[item.category] || 'Travel Moments',
      location: item.location || 'Bengal & Himalayas',
      caption: item.caption,
      alt: item.title,
      aspect: idx === 0 ? 'featured' : (idx % 3 === 0 ? 'portrait' : 'landscape'),
      featured: idx === 0 || item.display_order <= 2,
      display_order: item.display_order,
      is_active: item.is_active
    }));

    res.json({
      success: true,
      count: formatted.length,
      items: formatted
    });
  } catch (err) {
    console.error('Error fetching gallery:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch gallery items' });
  }
});
