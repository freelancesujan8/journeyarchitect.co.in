import express from 'express';
import { db } from '../db/database.js';

export const settingsRouter = express.Router();

/**
 * GET /api/settings/contact — Public endpoint to fetch active contact settings
 */
settingsRouter.get('/contact', (req, res) => {
  try {
    const row = db.prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'contact_info'").get();
    if (row && row.setting_value) {
      const parsed = JSON.parse(row.setting_value);
      res.json({
        success: true,
        contact: parsed
      });
    } else {
      res.json({
        success: true,
        contact: null
      });
    }
  } catch (err) {
    console.error('Error fetching contact settings:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch contact settings' });
  }
});

/**
 * GET /api/settings/branding — Public endpoint to fetch active website logo & branding settings
 */
settingsRouter.get('/branding', (req, res) => {
  try {
    const row = db.prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'branding_settings'").get();
    if (row && row.setting_value) {
      res.json({
        success: true,
        branding: JSON.parse(row.setting_value)
      });
    } else {
      res.json({
        success: true,
        branding: {
          logo_url: '/logoo.png',
          logo_white_url: '/logo-white.png',
          logo_height: 120,
          logo_alt: 'Journey Architect'
        }
      });
    }
  } catch (err) {
    console.error('Error fetching branding settings:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch branding settings',
      branding: {
        logo_url: '/logoo.png',
        logo_white_url: '/logo-white.png',
        logo_height: 120,
        logo_alt: 'Journey Architect'
      }
    });
  }
});
