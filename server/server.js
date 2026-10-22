import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db/database.js';
import { packagesRouter } from './routes/packages.js';
import { bookingsRouter } from './routes/bookings.js';
import { paymentsRouter } from './routes/payments.js';
import { adminRouter } from './routes/admin.js';
import { galleryRouter } from './routes/gallery.js';
import { settingsRouter } from './routes/settings.js';
import { servicesRouter } from './routes/services.js';
import { blogsRouter } from './routes/blogs.js';
import { cateringRouter } from './routes/catering.js';
import { carRentalRouter } from './routes/carRental.js';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded assets statically
app.use('/uploads', express.static(uploadsDir));

// Initialize SQLite Schema & Seed Data
initDatabase();

// Mount Routes
app.use('/api/packages', packagesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payment', paymentsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/services', servicesRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/catering', cateringRouter);
app.use('/api/car-rental', carRentalRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/admin', adminRouter);

// Health check endpoints for Hostinger container probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Journey Architect', uptime: process.uptime() });
});
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Journey Architect Booking Backend', timestamp: new Date().toISOString() });
});

// Serve frontend production build if dist directory exists
const possibleDistPaths = [
  path.resolve(__dirname, '..', 'dist'),
  path.resolve(process.cwd(), 'dist'),
  path.resolve(__dirname, 'dist')
];
const distPath = possibleDistPaths.find(p => fs.existsSync(path.join(p, 'index.html'))) || possibleDistPaths[0];
console.log(`[Journey Architect] Frontend dist path: ${distPath} (exists: ${fs.existsSync(distPath)})`);

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Express 5 compatible SPA fallback
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Start Server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Journey Architect Booking API] Successfully started on http://0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error('[Server Start Error]:', err);
});

process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]:', reason);
});

