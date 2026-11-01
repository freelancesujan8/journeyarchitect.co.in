import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { SEED_PACKAGES } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data folder exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'journeyarchitect.db');
export const db = new Database(dbPath);

// Enable WAL mode & foreign keys for concurrent performance and integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initial seed gallery items (Complete collection of 13 photos & videos)
const SEED_GALLERY_ITEMS = [
  {
    title: 'Darjeeling Tea Valley at Sunrise',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    category: 'mountains',
    location: 'Darjeeling, West Bengal',
    caption: 'Golden morning light breaking over emerald tea hills and mist-covered Himalayan slopes.',
    display_order: 1,
    is_active: 1
  },
  {
    title: 'Sikkim Highland Roads & Mountain Passes',
    media_type: 'video',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-curvy-road-in-a-mountain-valley-41549-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: 'mountains',
    location: 'North Sikkim (15,000+ ft)',
    caption: 'Drone capture of winding mountain highways along snow-clad valleys in North Sikkim.',
    display_order: 2,
    is_active: 1
  },
  {
    title: 'Gangtok & Mt. Kanchenjunga',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=900&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=900&q=80',
    category: 'mountains',
    location: 'Gangtok, Sikkim',
    caption: 'Misty mountain ridge looking towards the majestic Kanchenjunga peaks in Sikkim.',
    display_order: 3,
    is_active: 1
  },
  {
    title: 'Dooars Lataguri Forest Safari Expedition',
    media_type: 'video',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
    category: 'nature',
    location: 'Lataguri & Gorumara National Park',
    caption: 'Cruising through dense sal canopies and tea estates during a jungle jeep safari.',
    display_order: 4,
    is_active: 1
  },
  {
    title: 'Dooars Lataguri Tea Trail & Wildlife',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
    category: 'nature',
    location: 'Dooars, North Bengal',
    caption: 'Lush green canopy and scenic wildlife trails across Lataguri and Dooars forests.',
    display_order: 5,
    is_active: 1
  },
  {
    title: 'Puri Sea Beach Golden Hour Waves',
    media_type: 'video',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    category: 'coastal',
    location: 'Puri Coast, Odisha',
    caption: 'Gentle sunset waves rolling onto Puri Golden Beach with travelers enjoying the evening sea breeze.',
    display_order: 6,
    is_active: 1
  },
  {
    title: 'Puri Golden Beach & Ocean Sunset',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    category: 'coastal',
    location: 'Puri Coast, Odisha',
    caption: 'Peaceful golden waves, evening breeze, and serene horizon at Puri Sea Beach.',
    display_order: 7,
    is_active: 1
  },
  {
    title: 'Himalayan Road Trip Adventure',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80',
    category: 'group',
    location: 'North Sikkim Highway',
    caption: 'Scenic road journeys through high mountain valleys and pine-covered ridges.',
    display_order: 8,
    is_active: 1
  },
  {
    title: 'Group Holiday Moments & Hill Campfire',
    media_type: 'video',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-friends-laughing-and-enjoying-a-bonfire-at-night-42284-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=900&q=80',
    category: 'group',
    location: 'Kalimpong Retreat',
    caption: 'Unfiltered laughter, music, and bonfire moments from our client group tour in the hills.',
    display_order: 9,
    is_active: 1
  },
  {
    title: 'Gurudongmar High Altitude Lake',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    category: 'mountains',
    location: 'North Sikkim',
    caption: 'Crystal turquoise glacial lake surrounded by snow-capped peaks at 17,800 feet.',
    display_order: 10,
    is_active: 1
  },
  {
    title: 'Sundarbans Mangrove Waterway',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    category: 'nature',
    location: 'Sundarbans, West Bengal',
    caption: 'Riverboat cruise navigating through the mystical mangrove creeks of the Sundarbans delta.',
    display_order: 11,
    is_active: 1
  },
  {
    title: 'Pine Forests of Kalimpong & Lava',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    category: 'mountains',
    location: 'Kalimpong, West Bengal',
    caption: 'Quiet canopy walks through towering pine and cedar trees in the Eastern Himalayas.',
    display_order: 12,
    is_active: 1
  },
  {
    title: 'Family Getaways & Joyous Moments',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=900&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=900&q=80',
    category: 'group',
    location: 'Dooars Jungle Resort',
    caption: 'Unforgettable memories, peaceful tea resort stays, and shared smiles with loved ones.',
    display_order: 13,
    is_active: 1
  }
];

// Initial seed contact settings
const DEFAULT_CONTACT_SETTINGS = {
  founder_name: "Sudipta Nandi",
  founder_phone: "79803 31022",
  founder_phone_alt: "98303 54307, 82401 12378",
  cofounder_name: "Dipankar Mitra",
  cofounder_phone: "95633 95633",
  travel_partner_name: "",
  travel_partner_phone: "",
  whatsapp_number: "917980331022",
  whatsapp_message: "Hello Journey Architect, I would like to plan a tour / enquiry.",
  email_primary: "sudiptajourneys@gmail.com",
  email_support: "contact@journeyarchitect.in",
  address_street: "Tower 02, Flat No - 6B3, Elgin 1, New Batanagar Road",
  address_city: "Maheshtala, Batanagar",
  address_state: "West Bengal",
  address_pincode: "700140",
  address_full: "Tower 02, Flat No - 6B3, Elgin 1, New Batanagar Road, Maheshtala, Batanagar, West Bengal, India, 700140",
  branch_address: "P-23, Michael nagar , Kolkata - 700 133",
  google_map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.8521039864223!2d88.225574!3d22.496587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02796075908b9b%3A0x6b09312521c379a!2sBatanagar%2C%20Maheshtala%2C%20West%20Bengal%20700140!5e0!3m2!1sen!2sin!4v1700000000000",
  trade_license_no: "0917P299826472603",
  facebook_url: "https://www.facebook.com/share/1BiZE547Cc/",
  instagram_url: "https://www.instagram.com/journeyarchitect2026?xtok=MWg3YXl2N3Q3cWk5Mg==",
  twitter_url: "https://x.com/nan59130",
  youtube_url: "https://www.youtube.com/@SUDIPTANANDI-t9b",
  business_hours: "Monday – Sunday: 8:00 AM – 10:00 PM (24/7 on call for on-tour guests)",
  is_active: 1
};

/**
 * Initialize all database tables
 */
export function initDatabase() {
  // 1. Packages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      package_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      destination TEXT NOT NULL,
      tour_category TEXT NOT NULL,
      short_description TEXT,
      description TEXT,
      thumbnail TEXT,
      featured_image TEXT,
      gallery_images TEXT, -- JSON array
      duration_days INTEGER NOT NULL,
      duration_nights INTEGER NOT NULL,
      total_price REAL NOT NULL,
      adult_price REAL,
      child_price REAL,
      infant_price REAL,
      payment_type TEXT NOT NULL DEFAULT 'fixed', -- 'fixed', 'percentage', 'full'
      booking_amount REAL DEFAULT 0,
      booking_percentage REAL DEFAULT 20,
      availability_status TEXT NOT NULL DEFAULT 'available', -- 'available', 'temporarily_unavailable', 'sold_out', 'draft', 'archived'
      max_seats INTEGER DEFAULT 30,
      booked_seats INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft', 'archived'
      hotel_info TEXT,
      transport_info TEXT,
      meals_info TEXT,
      start_date TEXT,
      end_date TEXT,
      important_notes TEXT,
      terms_and_conditions TEXT,
      cancellation_policy TEXT,
      inclusions TEXT, -- JSON array
      exclusions TEXT, -- JSON array
      itinerary TEXT, -- JSON array of day objects
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Run dynamic schema migrations for existing SQLite database files
  const packageCols = db.prepare(`PRAGMA table_info(packages)`).all().map((c) => c.name);
  if (!packageCols.includes('start_date')) {
    db.exec(`ALTER TABLE packages ADD COLUMN start_date TEXT;`);
  }
  if (!packageCols.includes('end_date')) {
    db.exec(`ALTER TABLE packages ADD COLUMN end_date TEXT;`);
  }
  if (!packageCols.includes('hotel_info')) {
    db.exec(`ALTER TABLE packages ADD COLUMN hotel_info TEXT;`);
  }
  if (!packageCols.includes('transport_info')) {
    db.exec(`ALTER TABLE packages ADD COLUMN transport_info TEXT;`);
  }
  if (!packageCols.includes('meals_info')) {
    db.exec(`ALTER TABLE packages ADD COLUMN meals_info TEXT;`);
  }

  // 2. Customers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Bookings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id TEXT UNIQUE NOT NULL,
      access_token TEXT UNIQUE NOT NULL,
      package_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      travel_date TEXT NOT NULL,
      return_date TEXT,
      adults INTEGER NOT NULL DEFAULT 1,
      children INTEGER NOT NULL DEFAULT 0,
      infants INTEGER NOT NULL DEFAULT 0,
      total_amount REAL NOT NULL,
      booking_amount REAL NOT NULL,
      paid_amount REAL NOT NULL DEFAULT 0,
      remaining_amount REAL NOT NULL,
      booking_status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
      payment_status TEXT NOT NULL DEFAULT 'PENDING',
      pickup_location TEXT,
      special_requirements TEXT,
      food_preferences TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (package_id) REFERENCES packages(id),
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
  `);

  // Migrations for whatsapp_number support
  const custCols = db.prepare('PRAGMA table_info(customers)').all().map(c => c.name);
  if (!custCols.includes('whatsapp_number')) {
    db.exec(`ALTER TABLE customers ADD COLUMN whatsapp_number TEXT;`);
  }

  const bookingCols = db.prepare('PRAGMA table_info(bookings)').all().map(c => c.name);
  if (!bookingCols.includes('whatsapp_number')) {
    db.exec(`ALTER TABLE bookings ADD COLUMN whatsapp_number TEXT;`);
  }

  // 4. Travelers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS travelers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      id_type TEXT,
      id_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    );
  `);

  // 5. Payments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      payment_reference TEXT UNIQUE NOT NULL,
      booking_id INTEGER NOT NULL,
      gateway TEXT NOT NULL,
      gateway_order_id TEXT,
      gateway_payment_id TEXT,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'INR',
      status TEXT NOT NULL DEFAULT 'PENDING',
      payment_method TEXT,
      raw_reference TEXT,
      paid_at DATETIME,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    );
  `);

  // 6. Notifications table
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER,
      type TEXT NOT NULL,
      recipient TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      error_message TEXT,
      sent_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
    );
  `);

  const notifCols = db.prepare('PRAGMA table_info(notifications)').all().map(c => c.name);
  if (!notifCols.includes('subject')) {
    db.exec(`ALTER TABLE notifications ADD COLUMN subject TEXT;`);
  }
  if (!notifCols.includes('content')) {
    db.exec(`ALTER TABLE notifications ADD COLUMN content TEXT;`);
  }

  // 7. Audit logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      details TEXT,
      admin_user TEXT DEFAULT 'Super Admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 8. Gallery items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS gallery_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      media_type TEXT NOT NULL DEFAULT 'image', -- 'image' or 'video'
      media_url TEXT NOT NULL,
      thumbnail_url TEXT,
      category TEXT DEFAULT 'mountains',
      location TEXT DEFAULT 'Bengal & Himalayas',
      caption TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 9. Site Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key TEXT UNIQUE NOT NULL,
      setting_value TEXT NOT NULL, -- JSON stringified
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 10. Services table
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      badge TEXT DEFAULT '',
      icon TEXT DEFAULT 'Compass',
      short_tagline TEXT DEFAULT '',
      description TEXT DEFAULT '',
      overview TEXT DEFAULT '',
      hero_image TEXT DEFAULT '',
      lead_name TEXT DEFAULT '',
      lead_phone TEXT DEFAULT '',
      lead_alt_phones TEXT DEFAULT '',
      key_features TEXT DEFAULT '[]',
      offerings TEXT DEFAULT '[]',
      faqs TEXT DEFAULT '[]',
      display_order INTEGER DEFAULT 1,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 11. Blogs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      blog_id TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      category TEXT DEFAULT 'North Bengal & Darjeeling',
      author_name TEXT DEFAULT 'Sudipta Nandi',
      author_role TEXT DEFAULT 'Founder & Tour Architect',
      author_avatar TEXT DEFAULT 'SN',
      published_date TEXT DEFAULT '',
      read_time TEXT DEFAULT '5 min read',
      hero_image TEXT DEFAULT '',
      tags TEXT DEFAULT '[]',
      content TEXT DEFAULT '{}',
      featured INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 1,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 12. Catering Leads table
  db.exec(`
    CREATE TABLE IF NOT EXISTS catering_leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      whatsapp_number TEXT,
      email TEXT,
      event_date TEXT NOT NULL,
      guests_count INTEGER NOT NULL,
      event_location TEXT NOT NULL,
      event_type TEXT DEFAULT 'General Gathering',
      service_requirements TEXT,
      budget_range TEXT,
      status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 13. Car Rental Leads table
  db.exec(`
    CREATE TABLE IF NOT EXISTS car_rental_leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      whatsapp_number TEXT,
      email TEXT,
      travel_date TEXT NOT NULL,
      return_date TEXT,
      pickup_location TEXT NOT NULL,
      drop_location TEXT NOT NULL,
      car_type TEXT NOT NULL,
      passengers_count INTEGER NOT NULL DEFAULT 1,
      trip_type TEXT DEFAULT 'Outstation Round-Trip',
      service_requirements TEXT,
      status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 14. Catering Cuisines table (Cuisine We Serve)
  db.exec(`
    CREATE TABLE IF NOT EXISTS catering_cuisines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dish_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL, -- 'Indian' | 'Chinese' | 'Italian' | 'Indo-Chinese'
      description TEXT,
      image_url TEXT NOT NULL,
      diet_type TEXT DEFAULT 'Both',
      price_indicator TEXT,
      display_order INTEGER DEFAULT 1,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 15. Calendar events & notes table (Admin Only)
  db.exec(`
    CREATE TABLE IF NOT EXISTS calendar_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      event_date TEXT NOT NULL,          -- Format 'YYYY-MM-DD'
      start_time TEXT DEFAULT '',        -- e.g. '09:30'
      end_time TEXT DEFAULT '',          -- e.g. '11:00'
      is_all_day INTEGER DEFAULT 1,      -- 1 for all-day, 0 for timed
      category TEXT DEFAULT 'event',     -- 'event', 'reminder', 'note', 'meeting', 'holiday'
      priority TEXT DEFAULT 'normal',    -- 'low', 'normal', 'high', 'urgent'
      status TEXT DEFAULT 'pending',     -- 'pending', 'completed', 'cancelled'
      description TEXT DEFAULT '',       -- multi-line details / note text / checklist
      color TEXT DEFAULT '#2563EB',      -- custom color hex code
      created_by TEXT DEFAULT 'Admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(event_date);
    CREATE INDEX IF NOT EXISTS idx_calendar_events_category ON calendar_events(category);
    CREATE INDEX IF NOT EXISTS idx_calendar_events_status ON calendar_events(status);
  `);

  // Seed initial packages (Only insert if not already present in database, never overwrite admin edits)
  const insertPackage = db.prepare(`
    INSERT INTO packages (
      package_id, name, slug, destination, tour_category, short_description, description,
      thumbnail, featured_image, gallery_images, duration_days, duration_nights,
      total_price, adult_price, child_price, infant_price, payment_type, booking_amount,
      booking_percentage, availability_status, max_seats, booked_seats, featured, status,
      hotel_info, transport_info, meals_info, start_date, end_date, important_notes, terms_and_conditions,
      cancellation_policy, inclusions, exclusions, itinerary
    ) VALUES (
      @package_id, @name, @slug, @destination, @tour_category, @short_description, @description,
      @thumbnail, @featured_image, @gallery_images, @duration_days, @duration_nights,
      @total_price, @adult_price, @child_price, @infant_price, @payment_type, @booking_amount,
      @booking_percentage, @availability_status, @max_seats, @booked_seats, @featured, @status,
      @hotel_info, @transport_info, @meals_info, @start_date, @end_date, @important_notes, @terms_and_conditions,
      @cancellation_policy, @inclusions, @exclusions, @itinerary
    )
    ON CONFLICT(slug) DO NOTHING
  `);

  const insertMany = db.transaction((packages) => {
    for (const pkg of packages) {
      insertPackage.run(pkg);
    }
  });

  insertMany(SEED_PACKAGES);

  // Seed/Sync gallery items (Inserts any missing gallery item safely without removing existing ones)
  const insertGal = db.prepare(`
    INSERT INTO gallery_items (
      title, media_type, media_url, thumbnail_url, category, location, caption, display_order, is_active
    ) VALUES (
      @title, @media_type, @media_url, @thumbnail_url, @category, @location, @caption, @display_order, @is_active
    )
  `);

  const checkGal = db.prepare('SELECT id FROM gallery_items WHERE title = ?');

  const syncGallery = db.transaction((items) => {
    for (const item of items) {
      const existing = checkGal.get(item.title);
      if (!existing) {
        insertGal.run(item);
      }
    }
  });

  syncGallery(SEED_GALLERY_ITEMS);

  // Seed initial services
  const SEED_SERVICES = [
    {
      service_id: 'SRV-001',
      slug: 'tour-and-travel',
      title: 'Tour & Travel Packages',
      badge: 'Most Popular',
      icon: 'Compass',
      short_tagline: 'Customized Holiday Packages, Domestic & International Tours',
      description: 'Complete domestic and international tour packages with personalized itineraries, verified hotel bookings, mountain permits, and dedicated tour coordinators from Bongaon.',
      overview: 'Journey Architect specializes in turning your travel dreams into seamless, memorable holidays. Whether you seek the misty mountains of Darjeeling & Sikkim, the wilderness of Dooars, the holy shores of Puri, or customized packages across India, we arrange end-to-end travel logistics with honesty, transparent rates, and round-the-clock ground assistance.',
      hero_image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      lead_name: 'Sudipta Nandi (Founder)',
      lead_phone: '79803 31022',
      lead_alt_phones: '98303 54307, 82401 12378',
      key_features: JSON.stringify([
        'Customized family, couple, and group itineraries',
        'Handpicked 3-star, 4-star, and boutique homestay options',
        'All-inclusive plans: Transport, Stays, Meals & Guided Sightseeing',
        'North Sikkim, Darjeeling, Dooars, Puri, Vizag, Kashmir, Andaman & Goa specialists',
        'Train & Air ticket booking consultation and hassle-free permit approvals',
        'Dedicated 24/7 tour manager support during your entire journey'
      ]),
      offerings: JSON.stringify([
        { title: 'North Bengal & Sikkim Hill Retreats', desc: 'Darjeeling, Kalimpong, Gangtok, Pelling, Ravangla, Lachen, Lachung, and Gurudongmar Lake tours.' },
        { title: 'Wildlife & Tea Forest Trails', desc: 'Dooars, Lataguri, Jaldapara, Gorumara Safari, and tranquil tea estate bungalow stays.' },
        { title: 'Coastal & Heritage Pilgrimage', desc: 'Puri Jagannath Darshan, Konark Sun Temple, Chilika Lake, Vizag-Araku, and Digha-Mandarmani getaways.' },
        { title: 'All-India Holiday Packages', desc: 'Kashmir, Himachal, Kerala Backwaters, Golden Triangle, Andaman Islands & South India tours.' }
      ]),
      faqs: JSON.stringify([
        { q: 'How can I book a customized tour package?', a: 'You can click Plan My Trip or call us at 79803 31022. We discuss your preferred dates, group size, and budget to prepare a tailored itinerary.' },
        { q: 'Are stays and meals included in the packages?', a: 'Yes! We offer both CP (Breakfast only) and MAP/AP (Breakfast + Lunch/Dinner) plans as per your preference.' }
      ]),
      display_order: 1,
      is_active: 1
    },
    {
      service_id: 'SRV-002',
      slug: 'car-rental',
      title: 'Car Rental & Transport Services',
      badge: '24x7 Available',
      icon: 'Car',
      short_tagline: 'Clean AC/Non-AC Cabs, SUVs, Tempo Travellers & Luxury Buses',
      description: 'Reliable commercial vehicle rentals for local tours, outstation trips, airport & railway station transfers, weddings, and corporate events with experienced, licensed drivers.',
      overview: 'Journey Architect operates a dependable fleet of sanitized, well-maintained vehicles. From quick Kolkata Airport (CCU) drops from Bongaon to multi-day hill station road trips across North Bengal, Sikkim, and Odisha, we guarantee punctual service and courteous drivers.',
      hero_image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      lead_name: 'Journey Architect Transport Desk',
      lead_phone: '79803 31022',
      lead_alt_phones: '95633 95633, 98303 54307',
      key_features: JSON.stringify([
        'Clean, sanitized, and commercial-permit verified vehicles',
        'Experienced mountain and highway drivers with local route mastery',
        'Transparent per-km and fixed daily package rates with no hidden surcharges',
        'Kolkata Airport (CCU), Howrah, Sealdah & Bongaon Junction pickup & drop',
        'AC Sedans, Ertiga, Innova Crysta, Scorpio, Bolero, and Tempo Travellers',
        'Special vehicle fleets for weddings, ceremonies, school/college excursions & picnics'
      ]),
      offerings: JSON.stringify([
        { title: 'Sedans & Hatchbacks (Swift Dzire, Honda Amaze, WagonR)', desc: 'Ideal for 1-4 passengers, airport drops, local errands, and budget outstation trips.' },
        { title: 'Premium SUVs (Innova Crysta, Ertiga, Scorpio, Bolero)', desc: 'Comfortable seating for 6-7 passengers, mountain drives, family vacations & long distance road journeys.' },
        { title: 'Tempo Travellers (13, 17 & 26 Seater)', desc: 'Pushback AC seats, ample luggage space, sound systems, perfect for extended family & friend groups.' },
        { title: 'Luxury Tourist Buses (32 to 50+ Seaters)', desc: 'Full AC coach buses for school tours, community pilgrimages, corporate trips & marriage guest transfers.' }
      ]),
      faqs: JSON.stringify([
        { q: 'How are car rental charges calculated?', a: 'We provide both flat all-inclusive package rates (covering toll, parking, driver allowance) and transparent per-km billing based on your itinerary.' },
        { q: 'Can I book a cab for Kolkata Airport drop at midnight?', a: 'Yes! Our 24x7 on-call dispatch ensures on-time airport and station pickup/drop at any hour.' }
      ]),
      display_order: 2,
      is_active: 1
    },
    {
      service_id: 'SRV-003',
      slug: 'hotel-booking',
      title: 'Hotel & Homestay Bookings',
      badge: 'Best Rates',
      icon: 'Hotel',
      short_tagline: 'Verified 3-Star, Luxury Resorts, Boutique Homestays & River Camps',
      description: 'Handpicked and physically inspected accommodation across Darjeeling, Gangtok, Pelling, Dooars, Puri, Kashmir, and all major tourist destinations at guaranteed discounted partner tariffs.',
      overview: 'Enjoy peaceful nights in clean, hygienic, and scenic accommodations. We negotiate directly with trusted hoteliers and boutique homestay owners to offer you comfortable stays with scenic mountain, forest, or sea views, hot water facilities, delicious Bengali & multi-cuisine meals, and authentic hospitality.',
      hero_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      lead_name: 'Dipankar Mitra (Co-Founder)',
      lead_phone: '95633 95633',
      lead_alt_phones: '79803 31022, 98303 54307',
      key_features: JSON.stringify([
        'Verified rooms with clean linens, geysers, TV, and mountain/sea views',
        'Authentic local boutique homestays in Darjeeling, Kalimpong & North Sikkim',
        'Forest bungalows & wildlife resort bookings in Dooars & Jaldapara',
        'Sea-facing hotels and luxury resorts in Puri, Vizag, and Digha',
        'Complimentary breakfast & customizable full-meal plans (Bengali food available)',
        'Instant confirmed vouchers with flexible check-in support'
      ]),
      offerings: JSON.stringify([
        { title: 'Boutique Himalayan Homestays', desc: 'Warm hospitality, organic home-cooked meals, and breathtaking mountain valley views.' },
        { title: 'Standard & Deluxe 3-Star Hotels', desc: 'Modern amenities, Wi-Fi, 24/7 room service, and prime central locations.' },
        { title: 'Forest Resorts & Eco Camps', desc: 'Riverside stays, bonfire setups, and tranquil nature retreats in Dooars & Sundarbans.' },
        { title: 'Beachfront Properties & Sea Resorts', desc: 'Direct beach access, swimming pools, and ocean-facing balconies in Puri & coastal hubs.' }
      ]),
      faqs: JSON.stringify([
        { q: 'Can I book only hotels without transport?', a: 'Yes! We offer standalone hotel and homestay bookings across all destinations at discounted agent tariffs.' },
        { q: 'Is Bengali food available at the hotels?', a: 'Yes, we partner with properties that provide fresh, authentic Bengali meals on request.' }
      ]),
      display_order: 3,
      is_active: 1
    }
  ];

  const insertSrv = db.prepare(`
    INSERT OR IGNORE INTO services (
      service_id, slug, title, badge, icon, short_tagline, description, overview, hero_image,
      lead_name, lead_phone, lead_alt_phones, key_features, offerings, faqs, display_order, is_active
    ) VALUES (
      @service_id, @slug, @title, @badge, @icon, @short_tagline, @description, @overview, @hero_image,
      @lead_name, @lead_phone, @lead_alt_phones, @key_features, @offerings, @faqs, @display_order, @is_active
    )
  `);

  const syncServices = db.transaction((services) => {
    for (const s of services) {
      insertSrv.run(s);
    }
  });

  syncServices(SEED_SERVICES);

  // Seed initial blogs
  const insertBlog = db.prepare(`
    INSERT INTO blogs (
      blog_id, slug, title, excerpt, category, author_name, author_role, author_avatar,
      published_date, read_time, hero_image, tags, content, featured, display_order, is_active
    ) VALUES (
      @blog_id, @slug, @title, @excerpt, @category, @author_name, @author_role, @author_avatar,
      @published_date, @read_time, @hero_image, @tags, @content, @featured, @display_order, @is_active
    )
    ON CONFLICT(slug) DO NOTHING
  `);

  const syncBlogs = db.transaction((blogs) => {
    for (const b of blogs) {
      insertBlog.run(b);
    }
  });

  syncBlogs(SEED_BLOGS);

  // Seed contact settings if empty
  const contactSetting = db.prepare("SELECT * FROM site_settings WHERE setting_key = 'contact_info'").get();
  if (!contactSetting) {
    db.prepare(`
      INSERT INTO site_settings (setting_key, setting_value)
      VALUES ('contact_info', ?)
    `).run(JSON.stringify(DEFAULT_CONTACT_SETTINGS));
  }

  // Seed booking notification email settings if empty
  const notifSetting = db.prepare("SELECT * FROM site_settings WHERE setting_key = 'notification_settings'").get();
  if (!notifSetting) {
    db.prepare(`
      INSERT INTO site_settings (setting_key, setting_value)
      VALUES ('notification_settings', ?)
    `).run(JSON.stringify({
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
    }));
  }

  // Seed branding & website logo settings if empty
  const brandingSetting = db.prepare("SELECT * FROM site_settings WHERE setting_key = 'branding_settings'").get();
  if (!brandingSetting) {
    db.prepare(`
      INSERT INTO site_settings (setting_key, setting_value)
      VALUES ('branding_settings', ?)
    `).run(JSON.stringify({
      logo_url: '/logoo.png',
      logo_white_url: '/logo-white.png',
      logo_height: 120,
      logo_alt: 'Journey Architect'
    }));
  }

  // Seed initial catering cuisines
  const insertCuisine = db.prepare(`
    INSERT INTO catering_cuisines (
      dish_id, name, category, description, image_url,
      diet_type, price_indicator, display_order, is_active
    ) VALUES (
      @dish_id, @name, @category, @description, @image_url,
      @diet_type, @price_indicator, @display_order, @is_active
    )
    ON CONFLICT(dish_id) DO NOTHING
  `);

  const syncCuisines = db.transaction((cuisines) => {
    for (const c of cuisines) {
      insertCuisine.run(c);
    }
  });

  syncCuisines(SEED_CUISINES);

  // Seed initial calendar events & notes if none exist
  const existingEventsCount = db.prepare('SELECT COUNT(*) as count FROM calendar_events').get().count;
  if (existingEventsCount === 0) {
    const formatDate = (offsetDays) => {
      const d = new Date();
      d.setDate(d.getDate() + offsetDays);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    const initialEvents = [
      {
        title: 'Client Consultation — North Sikkim Silk Route',
        event_date: formatDate(0),
        start_time: '11:00',
        end_time: '12:30',
        is_all_day: 0,
        category: 'meeting',
        priority: 'high',
        status: 'pending',
        description: 'Review custom itinerary adjustments and hotel upgrades for the 6-member group booking.',
        color: '#2563EB'
      },
      {
        title: 'Payment Follow-up: Puri Beach Tour Booking',
        event_date: formatDate(0),
        start_time: '15:00',
        end_time: '15:30',
        is_all_day: 0,
        category: 'reminder',
        priority: 'urgent',
        status: 'pending',
        description: 'Call Mr. Anirban Roy regarding remaining 50% deposit balance before issuing official travel voucher.',
        color: '#D97706'
      },
      {
        title: 'Darjeeling & Kalimpong Autumn Tour Departure',
        event_date: formatDate(1),
        start_time: '06:00',
        end_time: '08:30',
        is_all_day: 0,
        category: 'event',
        priority: 'high',
        status: 'pending',
        description: 'Tour departure from Howrah Station. Verify driver arrival, coordinate luggage loading and hand over welcome kits.',
        color: '#059669'
      },
      {
        title: 'Vehicle Fleet Servicing & AC Inspection',
        event_date: formatDate(3),
        start_time: '14:00',
        end_time: '16:00',
        is_all_day: 0,
        category: 'note',
        priority: 'normal',
        status: 'pending',
        description: 'Scheduled maintenance check for Innova Crysta (WB 24 X 8920) before weekend Dooars wildlife safari tour.',
        color: '#7C3AED'
      },
      {
        title: 'Catering Menu Tasting — Sharma Wedding Banquet',
        event_date: formatDate(5),
        start_time: '16:30',
        end_time: '18:00',
        is_all_day: 0,
        category: 'meeting',
        priority: 'normal',
        status: 'pending',
        description: 'Chef live tasting session for 350-guest Bengali & Mughlai wedding buffet menu selections.',
        color: '#DB2777'
      },
      {
        title: 'Hotel Vouchers Dispatched: Gangtok Retreat',
        event_date: formatDate(-2),
        start_time: '',
        end_time: '',
        is_all_day: 1,
        category: 'reminder',
        priority: 'normal',
        status: 'completed',
        description: 'All 4 deluxe valley-view rooms locked with breakfast vouchers emailed to lead guest.',
        color: '#475569'
      }
    ];

    const insertEvent = db.prepare(`
      INSERT INTO calendar_events (
        title, event_date, start_time, end_time, is_all_day,
        category, priority, status, description, color, created_by
      ) VALUES (
        @title, @event_date, @start_time, @end_time, @is_all_day,
        @category, @priority, @status, @description, @color, 'Admin'
      )
    `);

    const insertAllEvents = db.transaction((events) => {
      for (const ev of events) {
        insertEvent.run(ev);
      }
    });

    insertAllEvents(initialEvents);
  }
}

export const SEED_BLOGS = [
  {
    blog_id: 'BLG-001',
    slug: 'silk-route-sikkim-guide',
    title: 'The Complete Old Silk Route Sikkim Guide: Zuluk Zig-Zag, Kupup Lake & High-Altitude Permits',
    excerpt: "Discover the breathtaking beauty of East Sikkim's historical trade trail. From the dramatic 32 hairpin bends of Zuluk to misty sunrise at Thambi Viewpoint and the sacred Elephant Lake.",
    category: 'Sikkim & Silk Route',
    author_name: 'Sudipta Nandi',
    author_role: 'Founder & Tour Architect',
    author_avatar: 'SN',
    published_date: 'Oct 12, 2026',
    read_time: '7 min read',
    hero_image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    tags: JSON.stringify(['Old Silk Route', 'Zuluk', 'East Sikkim', 'Himalayas', 'Adventure Travel']),
    featured: 1,
    display_order: 1,
    is_active: 1,
    content: JSON.stringify({
      introduction: "The Old Silk Route in East Sikkim is one of the most mesmerizing, untouched mountain circuits in the Indian Himalayas. Once part of the ancient trade corridor connecting Lhasa in Tibet to India through the Jelep La Pass, today this high-altitude haven offers virgin alpine landscapes, traditional homestays, and panoramic views of Mt. Kanchenjunga.",
      sections: [
        {
          heading: "1. The Marvelous 32 Hairpin Curves of Zuluk",
          text: "Perched at 9,400 feet, Zuluk is a tiny historic village famous for its winding mountain road with 32 hairpin loops. As early morning light sweeps across Thambi Viewpoint (11,200 ft), you can witness the sun illuminate Kanchenjunga while the mist rolls across the serpent-like road below. It is considered one of the greatest road engineering spectacles in India."
        },
        {
          heading: "2. Exploring Nathang Valley & Kupup (Elephant) Lake",
          text: "Further up at 13,500 feet lies Gnathang (Nathang) Valley, known as the 'Ladakh of the East' for its snow-dusted, barren alpine grandeur. Nearby lies the mystical Kupup Lake, resembling an elephant trunk, alongside Baba Mandir and the world's highest golf course at Kupup."
        },
        {
          heading: "3. Essential Permits & Documentation",
          text: "Because East Sikkim lies adjacent to the international border, Special Inner Line Permits (ILP) are mandatory. Indian citizens must carry voter IDs or Passports (Aadhaar is not always accepted by military checkpoints) and at least 4 passport-size photographs. Journey Architect manages all border permits, military clearance, and vehicle paperwork smoothly in advance."
        },
        {
          heading: "4. Best Season to Visit",
          text: "Spring (April to June) brings blankets of blooming rhododendrons and wild primulas across the valleys. Autumn (October to November) delivers crystal-clear blue skies and the sharpest mountain views. For snow lovers, December to February transforms Zuluk into a silent winter wonderland."
        }
      ],
      quickTips: [
        "Pack heavy thermal innerwear and windproof down jackets; temperatures drop below freezing even in autumn nights.",
        "Stay in verified homestays in Zuluk, Rongli, or Padamchen for warm hospitality and locally cooked organic meals.",
        "Ensure your vehicle has high ground clearance (Scorpio, Bolero, or Innova) and an experienced mountain driver."
      ],
      relatedPackageSlug: "darjeeling-gangtok-delight"
    })
  },
  {
    blog_id: 'BLG-002',
    slug: 'north-bengal-offbeat-lava-rishop-lolegaon',
    title: "Offbeat North Bengal Escapes: Why Lava, Rishop & Lolegaon are West Bengal's Most Serene Mountain Havens",
    excerpt: 'Tired of crowded hill stations? Unwind in the pine-scented silence of the Kalimpong foothills, with pine forests, canopy walkways, and the sacred Lava Buddhist Monastery.',
    category: 'North Bengal & Darjeeling',
    author_name: 'Sudipta Nandi',
    author_role: 'Founder & Tour Architect',
    author_avatar: 'SN',
    published_date: 'Oct 05, 2026',
    read_time: '5 min read',
    hero_image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    tags: JSON.stringify(['North Bengal', 'Lava', 'Rishop', 'Lolegaon', 'Offbeat Hills']),
    featured: 0,
    display_order: 2,
    is_active: 1,
    content: JSON.stringify({
      introduction: "While Darjeeling remains the undisputed Queen of the Hills, travelers seeking peace, chirping mountain birds, and dense misty pine trees are increasingly flocking to the tri-village hamlet of Lava, Rishop, and Lolegaon in the Kalimpong hills.",
      sections: [
        {
          heading: "1. The Sacred Serenity of Lava Monastery",
          text: "Lava sits at 7,011 feet, surrounded by deep pine and birch forests. The Kagyu Thegchen Ling Monastery (Lava Monastery) offers a tranquil atmosphere where prayer flags flutter in the breeze and young monks practice age-old chants. The nearby Nature Interpretation Centre introduces visitors to the endemic wildlife of Neora Valley National Park."
        },
        {
          heading: "2. Rishop: A 360-Degree Kanchenjunga Vantage Point",
          text: "Just 4 km uphill from Lava, Rishop is a sleepy hamlet accessible by a scenic trekking trail or a rugged mountain jeep ride. From Tiffin Dara viewpoint, travelers can experience an uninterrupted 360-degree panorama of Mt. Kanchenjunga, Mt. Pandim, and the Sikkim Himalayan range at dawn."
        },
        {
          heading: "3. Lolegaon and the Forest Canopy Walk",
          text: "Famous for its hanging footbridge suspended high among giant moss-covered oak and cypress trees, the Canopy Walk in Lolegaon is a favorite for nature lovers and families. Walking through the forest canopy as clouds brush against you is an unforgettable experience."
        }
      ],
      quickTips: [
        "Direct cab rides from NJP or Bagdogra take approximately 3.5 to 4 hours via Gorubathan or Kalimpong.",
        "Try fresh local momos, handmade Wai-Wai soup, and fermented bamboo shoot delicacies at village eateries.",
        "Ideal for a relaxing 3 to 4-day weekend trip from Kolkata or Bongaon."
      ],
      relatedPackageSlug: "darjeeling-gangtok-delight"
    })
  },
  {
    blog_id: 'BLG-003',
    slug: 'sundarbans-mangrove-safari-guide',
    title: 'Sundarbans Delta Expedition: How to Experience Royal Bengal Tigers, Mangrove Creeks & Fresh Bengali Boat Meals',
    excerpt: 'Everything you need to know about booking an authentic Sundarbans boat safari: watch towers, saltwater crocodiles, tidal canals, and freshly caught local fish feasts.',
    category: 'Sundarbans & Wildlife',
    author_name: 'Dipankar Mitra',
    author_role: 'Co-Founder & Culinary Head',
    author_avatar: 'DM',
    published_date: 'Sep 28, 2026',
    read_time: '6 min read',
    hero_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    tags: JSON.stringify(['Sundarbans', 'Wildlife Safari', 'Royal Bengal Tiger', 'Bengal Delta', 'Eco Tourism']),
    featured: 0,
    display_order: 3,
    is_active: 1,
    content: JSON.stringify({
      introduction: "The Sundarbans, the world's largest contiguous mangrove forest and a UNESCO World Heritage site, is a mysterious wilderness where tides rule life and Bengal tigers swim across brackish rivers. Just a few hours from Kolkata and Bongaon, it offers an untamed natural safari like nowhere else on Earth.",
      sections: [
        {
          heading: "1. The Boat Safari Experience",
          text: "Unlike jeep safaris in typical national parks, Sundarbans exploration happens entirely on motorized safari boats. As your boat glides quietly through narrow creeks like Panchamukhani and Pirkhali, trained naturalist guides help you spot spotted deer, wild boars, monitor lizards, kingfishers, and giant saltwater crocodiles sunbathing on mudbanks."
        },
        {
          heading: "2. Watch Towers: Sajnekhali, Sudhanyakhali & Dobanki",
          text: "Key vantage points include Sajnekhali Watch Tower (with its Mangrove Interpretation Centre and crocodile breeding pond), Sudhanyakhali (overlooking a sweet-water pond where tigers frequently come to drink), and Dobanki's 496-meter canopy walk shielded by high wire netting."
        },
        {
          heading: "3. Authentic Dining Aboard the Safari Boat",
          text: "At Journey Architect, our private culinary team cooks hot, freshly caught bhetki, ilish, prawn malai curry, and local village vegetables directly on the lower deck of the vessel, accompanied by aromatic Bengali Basmati rice, chutney, and local gur sweets."
        }
      ],
      quickTips: [
        "Carry government-issued photo ID cards for forest department passes at Godkhali jetty.",
        "Wear earthy or neutral-colored clothes (khaki, olive, brown); avoid bright fluorescent outfits.",
        "Bring binoculars and telephoto lenses for birdwatching and wildlife photography."
      ],
      relatedPackageSlug: "sundarbans-mangrove-safari"
    })
  },
  {
    blog_id: 'BLG-004',
    slug: 'puri-chilika-4-day-coastal-itinerary',
    title: 'The Perfect 4-Day Puri, Konark & Chilika Lake Road Trip from West Bengal: Temples, Beaches & Irrawaddy Dolphins',
    excerpt: 'Planning a coastal getaway? Here is our curated road trip itinerary covering Lord Jagannath Temple darshan, the Sun Temple at Konark, golden beaches, and dolphin boat cruises at Chilika.',
    category: 'Sea Beaches & Odisha',
    author_name: 'Sudipta Nandi',
    author_role: 'Founder & Tour Architect',
    author_avatar: 'SN',
    published_date: 'Sep 18, 2026',
    read_time: '6 min read',
    hero_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tags: JSON.stringify(['Puri', 'Konark Sun Temple', 'Chilika Lake', 'Odisha Road Trip', 'Family Holiday']),
    featured: 0,
    display_order: 4,
    is_active: 1,
    content: JSON.stringify({
      introduction: "Puri has been the heart of coastal pilgrimage and seaside recreation for generations of travelers from Bengal. With smooth highways from Kolkata and Bongaon, a 4-day tour lets you soak in spiritual history, marvel at 13th-century stone architecture, and explore Asia's largest brackish lagoon.",
      sections: [
        {
          heading: "1. Day 1: Jagannath Temple Darshan & Golden Beach Sunset",
          text: "Begin with a guided morning visit to the sacred Shree Jagannath Temple. Savor the authentic Mahaprasad (Chhappan Bhog) served inside the Ananda Bazar. In the afternoon, unwind at Puri's certified Blue Flag Golden Beach as the sun dips below the Bay of Bengal."
        },
        {
          heading: "2. Day 2: Marine Drive & The Architectural Wonder of Konark",
          text: "Drive along the scenic Puri-Konark Marine Drive with casuarina trees on both sides. Arrive at the Konark Sun Temple, a UNESCO World Heritage site built in the shape of a colossal 24-wheeled stone chariot pulled by seven horses. Conclude the day with fresh seafood at Chandrabhaga Beach."
        },
        {
          heading: "3. Day 3: Chilika Lake (Satapada) & Irrawaddy Dolphins",
          text: "Take a 50 km drive to Satapada on the banks of Chilika Lake. Board a scenic motorized boat cruise into the lagoon to spot rare Irrawaddy dolphins breaching the surface, and visit Rajhans Island where the lagoon meets the open sea."
        }
      ],
      quickTips: [
        "Leather items, smartphones, and cameras are strictly prohibited inside the Jagannath Temple premises.",
        "Hire authorized temple and ASI guides to understand the historical legends of Konark.",
        "Buy authentic handwoven Sambalpuri and Kotki sarees from government handloom outlets in Puri."
      ],
      relatedPackageSlug: "puri-konark-weekend-escape"
    })
  },
  {
    blog_id: 'BLG-005',
    slug: 'himalayan-road-trip-packing-guide',
    title: 'Essential Himalayan Packing Checklist: Everything You Need for North Sikkim, High Passes & Cold Climates',
    excerpt: 'Heading to high-altitude destinations like Gurudongmar Lake, Yumthang Valley, or Zuluk? Review our field-tested checklist of clothing, medications, and essentials.',
    category: 'Travel Tips & Planning',
    author_name: 'Journey Architect Team',
    author_role: 'Mountain Operations Desk',
    author_avatar: 'JA',
    published_date: 'Sep 10, 2026',
    read_time: '5 min read',
    hero_image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80',
    tags: JSON.stringify(['Packing Tips', 'High Altitude', 'Sikkim Travel', 'Checklist', 'Mountain Safety']),
    featured: 0,
    display_order: 5,
    is_active: 1,
    content: JSON.stringify({
      introduction: "High-altitude travel in Sikkim and North Bengal requires mindful preparation. At elevations exceeding 12,000 to 17,000 feet, sudden weather shifts, sharp temperature drops, and thin oxygen levels demand the right gear to ensure your trip remains enjoyable and stress-free.",
      sections: [
        {
          heading: "1. The 3-Layer Clothing Rule",
          text: "Instead of one bulky jacket, dress in three breathable layers: a moisture-wicking thermal base layer (top and bottom), a fleece or wool mid-layer for insulation, and a water-resistant, windproof down outer jacket. This lets you adjust as daytime mountain sun alternates with biting winds."
        },
        {
          heading: "2. Footwear & Accessories",
          text: "Sturdy sports or trekking shoes with deep rubber treads are essential for rocky trails and snow patches. Don't forget woolen socks, insulated gloves, a woolen beanie that covers your ears, and UV400 sunglasses to protect your eyes from intense mountain glare."
        },
        {
          heading: "3. Health & High-Altitude Acclimatization",
          text: "Drink plenty of water and warm fluids; avoid heavy alcohol consumption before climbing above 10,000 feet. Carry personal prescription medicines, motion sickness tablets (for twisty ghat roads), glucose powder, camphor tablets for easy breathing, and lip balm with SPF."
        }
      ],
      quickTips: [
        "Keep at least 6 copies of government photo IDs and passport photos handy in an accessible pouch.",
        "High-altitude cold drains smartphone batteries fast; pack a high-capacity 20,000 mAh power bank.",
        "Cash is king in remote mountain hamlets; ATMs are scarce beyond Gangtok or Kalimpong."
      ],
      relatedPackageSlug: "darjeeling-gangtok-delight"
    })
  },
  {
    blog_id: 'BLG-006',
    slug: 'bengali-culinary-heritage-on-tour',
    title: 'Serving Warm Bengali Feasts at 10,000 Feet: How Journey Architect Crafts Authentic Meals on Mountain Tours',
    excerpt: 'Why settle for cold, generic hotel buffets when you can relish piping-hot Gobindobhog khichuri, mutton curry, and fresh fish preparations on your vacation? Learn about our touring culinary service.',
    category: 'Food & Catering',
    author_name: 'Dipankar Mitra',
    author_role: 'Co-Founder & Culinary Head',
    author_avatar: 'DM',
    published_date: 'Aug 29, 2026',
    read_time: '5 min read',
    hero_image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
    tags: JSON.stringify(['Bengali Cuisine', 'Tour Catering', 'Food Travel', 'Hospitality', 'Group Tours']),
    featured: 0,
    display_order: 6,
    is_active: 1,
    content: JSON.stringify({
      introduction: "Food is the emotional backbone of any memorable vacation. When travelers from Bengal embark on long journeys to the chilly mountains of Sikkim or the remote coastal strips of Odisha, returning to a warm, homely, and authentic Bengali meal turns a good holiday into an extraordinary one.",
      sections: [
        {
          heading: "1. Dedicated Traveling Kitchen & Private Chefs",
          text: "For our escorted group packages and customized tours, Journey Architect deploys experienced cooks and dedicated kitchen helpers with sanitized cookware, fresh spices, and locally sourced ingredients. Whether it's breakfast luchi with chholar dal or dinner chicken kosha, meals are cooked fresh in real-time."
        },
        {
          heading: "2. Tailored Menus for Seniors & Children",
          text: "We understand that spicy or unfamiliar restaurant food can upset digestion during mountain travel. We accommodate individual dietary requests, offering light dal, boiled vegetables, jhol, or satvik/no-onion-garlic options for elderly family members."
        },
        {
          heading: "3. Hygiene & Water Safety Above All",
          text: "All cooking uses purified drinking water and food-grade safety standards. Utensils and cutlery are thoroughly sanitized at every halt, ensuring our guests remain healthy and energetic throughout their vacation."
        }
      ],
      quickTips: [
        "Customized dietary preferences can be specified during booking for personalized meal plans.",
        "Special outdoor picnics and camp dinners can be arranged at scenic riverbanks and pine glades upon request.",
        "Available for private family bookings, educational trips, wedding parties, and corporate offsites."
      ],
      relatedPackageSlug: "darjeeling-gangtok-delight"
    })
  }
];

export const SEED_CUISINES = [
  // --- Indian ---
  {
    dish_id: 'DISH-IND-001',
    name: 'Awadhi Shahi Dum Biryani',
    category: 'Indian',
    description: 'Long-grain aged basmati rice slow-cooked in handi with saffron, whole aromatic spices, and tender cuts / paneer cubes, served with burani raita.',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Both',
    price_indicator: "Chef's Signature",
    display_order: 1,
    is_active: 1
  },
  {
    dish_id: 'DISH-IND-002',
    name: 'Butter Chicken & Paneer Butter Masala',
    category: 'Indian',
    description: 'Silky, velvety slow-simmered tomato butter gravy enriched with cashew paste, fresh cream, and aromatic dried fenugreek leaves (kasuri methi).',
    image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Both',
    price_indicator: 'Classic Favorite',
    display_order: 2,
    is_active: 1
  },
  {
    dish_id: 'DISH-IND-003',
    name: 'Kolkata Kosha Mangsho & Fluffy Luchi',
    category: 'Indian',
    description: 'Slow-braised rich mutton or chicken cooked to dark caramelized perfection in traditional Bengali spices, served alongside golden fried luchis.',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Non-Veg',
    price_indicator: 'Bengali Heritage',
    display_order: 3,
    is_active: 1
  },
  {
    dish_id: 'DISH-IND-004',
    name: 'Dal Makhani & Tandoori Garlic Naan',
    category: 'Indian',
    description: 'Black lentils slow-cooked overnight over gentle charcoal embers with fresh churned white butter, paired with crisp garlic-brushed naan.',
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Veg',
    price_indicator: 'Overnight Slow Cooked',
    display_order: 4,
    is_active: 1
  },

  // --- Tandoor ---
  {
    dish_id: 'DISH-TAN-001',
    name: 'Bhatia Murgh Tandoori & Chicken Tikka',
    category: 'Tandoor',
    description: 'Whole tender spring chicken and juicy boneless cuts marinated in thick hung curd, Kashmiri deggi mirch, cold-pressed mustard oil, and whole roasted spices, charred over live clay oven charcoal.',
    image_url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Non-Veg',
    price_indicator: 'Charcoal Clay Oven',
    display_order: 5,
    is_active: 1
  },
  {
    dish_id: 'DISH-TAN-002',
    name: 'Amritsari Paneer Tikka Shashlik',
    category: 'Tandoor',
    description: 'Thick succulent slabs of fresh cottage cheese steeped in carom seeds (ajwain), roasted gram flour, and spiced yogurt with bell peppers and onions, roasted to a golden smoky blister.',
    image_url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Veg',
    price_indicator: 'Clay Oven Specialty',
    display_order: 6,
    is_active: 1
  },
  {
    dish_id: 'DISH-TAN-003',
    name: 'Murgh Malai Kebab & Reshmi Tikka',
    category: 'Tandoor',
    description: 'Melt-in-mouth chicken chunks steeped in fresh clotted cream, cream cheese, green cardamom, and white pepper, broiled over slow heat until delicate and succulent.',
    image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Non-Veg',
    price_indicator: 'Cream & Cardamom Infused',
    display_order: 7,
    is_active: 1
  },
  {
    dish_id: 'DISH-TAN-004',
    name: 'Tandoori Bharwan Mushroom & Soya Chaap',
    category: 'Tandoor',
    description: 'Plump button mushrooms stuffed with spiced cottage cheese and herbs, along with soya chaap skewers basted in spiced mustard glaze and roasted over glowing embers.',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Veg',
    price_indicator: 'Vegetarian Tandoor Star',
    display_order: 8,
    is_active: 1
  },

  // --- Bengali authentic cuisine ---
  {
    dish_id: 'DISH-BEN-001',
    name: 'Authentic Bhetki Machher Paturi',
    category: 'Bengali authentic cuisine',
    description: 'Fresh Kolkata Bhetki fish fillets marinated in freshly ground yellow & black mustard, poppy seeds (posto), green chili, and cold-pressed kachi ghani mustard oil, parcelled in banana leaves and slow-steamed.',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Non-Veg',
    price_indicator: 'Heritage Banana Leaf Wrap',
    display_order: 9,
    is_active: 1
  },
  {
    dish_id: 'DISH-BEN-002',
    name: 'Golda Chingri Malaikari & Daab Chingri',
    category: 'Bengali authentic cuisine',
    description: 'Jumbo freshwater tiger prawns gently simmered in rich coconut cream, green cardamom, cinnamon, and mild Bengali spices, finished inside tender green coconut.',
    image_url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Non-Veg',
    price_indicator: 'Royal Coconut Feast',
    display_order: 10,
    is_active: 1
  },
  {
    dish_id: 'DISH-BEN-003',
    name: 'Kolkata Kosha Mangsho & Basanti Pulao',
    category: 'Bengali authentic cuisine',
    description: 'Dark, rich caramelized goat mutton slow-braised patiently in mustard oil, ginger, garlic, and whole garam masala, paired with fragrant saffron sweet Gobindobhog pulao.',
    image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Non-Veg',
    price_indicator: 'Slow Braised Classic',
    display_order: 11,
    is_active: 1
  },
  {
    dish_id: 'DISH-BEN-004',
    name: 'Traditional Dhokar Dalna & Chhanar Kofta',
    category: 'Bengali authentic cuisine',
    description: 'Diamond-shaped steamed & golden-fried spiced chana dal lentil cakes simmered in a velvety cumin, ginger, tomato, and hing gravy without onion or garlic, finished with pure ghee.',
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Veg',
    price_indicator: 'Pure Bengali Niramish',
    display_order: 12,
    is_active: 1
  },

  // --- South Indian ---
  {
    dish_id: 'DISH-SOU-001',
    name: 'Crispy Desi Ghee Roast Masala Dosa',
    category: 'South Indian',
    description: 'Golden, paper-thin naturally fermented rice & urad dal crepes roasted with pure desi ghee, filled with spiced mustard-potato bhaji, served with coconut chutney, tomato chutney, and piping hot sambar.',
    image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Veg',
    price_indicator: 'Desi Ghee Roast',
    display_order: 13,
    is_active: 1
  },
  {
    dish_id: 'DISH-SOU-002',
    name: 'Steamed Button Idli & Crispy Medu Vada Platter',
    category: 'South Indian',
    description: 'Cloud-soft steamed rice cakes and golden-crisp lentil doughnuts flavored with crushed peppercorns and curry leaves, accompanied by fiery gunpowder (milagai podi) and ghee.',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Veg',
    price_indicator: 'Breakfast & Tiffin Favorite',
    display_order: 14,
    is_active: 1
  },
  {
    dish_id: 'DISH-SOU-003',
    name: 'Chettinad Pepper Chicken / Paneer Roast',
    category: 'South Indian',
    description: 'Authentic Karaikudi-style spicy dry roast featuring hand-pounded Tellicherry black peppercorns, star anise, kalpasi (stone flower), fresh coconut shreds, and crackling curry leaves.',
    image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Both',
    price_indicator: 'Fiery Chettinad Spiced',
    display_order: 15,
    is_active: 1
  },
  {
    dish_id: 'DISH-SOU-004',
    name: 'Malabar Parotta & Vegetable / Chicken Kurma',
    category: 'South Indian',
    description: 'Flaky multi-layered spiral flatbread grilled on iron tawa, paired with a mildly spiced fragrant coconut, cashew, and fennel gravy with farm vegetables or tender chicken.',
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Both',
    price_indicator: 'Coastal Kerala Specialty',
    display_order: 16,
    is_active: 1
  },

  // --- Continental ---
  {
    dish_id: 'DISH-CON-001',
    name: 'Herb Grilled Chicken Breast with Wild Mushroom Jus',
    category: 'Continental',
    description: 'Tender chicken supreme marinated in fresh rosemary, thyme, garlic, and Dijon mustard, flame-seared and draped in a velvety wild forest mushroom reduction, served with creamy buttered mash and glazed baby vegetables.',
    image_url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Non-Veg',
    price_indicator: 'Cast Iron Seared',
    display_order: 17,
    is_active: 1
  },
  {
    dish_id: 'DISH-CON-002',
    name: 'Classic Creamy Baked Vegetable Au Gratin',
    category: 'Continental',
    description: 'Tender broccoli florets, baby corn, zucchini, and carrots bathed in rich nutmeg-infused cheese béchamel sauce, topped with sharp aged Cheddar and baked till bubbling and golden.',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Veg',
    price_indicator: 'Golden Oven Baked',
    display_order: 18,
    is_active: 1
  },
  {
    dish_id: 'DISH-CON-003',
    name: 'Pan-Seared Fish Florentine with Butter Tossed Greens',
    category: 'Continental',
    description: 'Fresh Kolkata Bhetki fillet gently pan-seared in white wine and lemon butter, resting on a bed of sautéed garlic spinach, finished under salamander with mornay cheese glaze.',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Non-Veg',
    price_indicator: 'Continental Gourmet Fish',
    display_order: 19,
    is_active: 1
  },
  {
    dish_id: 'DISH-CON-004',
    name: 'Char-Grilled Cottage Cheese Steak in Pepper Herb Sauce',
    category: 'Continental',
    description: 'Thick herbed paneer slab grilled with grill marks, served over ratatouille vegetables and roasted herb baby potatoes with a cracked black peppercorn reduction.',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Veg',
    price_indicator: "Chef's Vegetarian Steak",
    display_order: 20,
    is_active: 1
  },

  // --- Chinese ---
  {
    dish_id: 'DISH-CHN-001',
    name: 'Artisanal Steamed Dim Sums & Momos',
    category: 'Chinese',
    description: 'Hand-pleated delicate translucent parcels filled with finely minced garden vegetables, water chestnuts, and chicken, accompanied by spicy scallion chili oil.',
    image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Both',
    price_indicator: 'Steamed Fresh',
    display_order: 5,
    is_active: 1
  },
  {
    dish_id: 'DISH-CHN-002',
    name: 'Cantonese Golden Wok Fried Rice',
    category: 'Chinese',
    description: 'High-heat wok-tossed jasmine rice infused with light soy, scallions, sweet baby corn, crisp bell peppers, and delicate scrambled eggs.',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Both',
    price_indicator: 'Wok Hei Specialty',
    display_order: 6,
    is_active: 1
  },
  {
    dish_id: 'DISH-CHN-003',
    name: 'Szechuan Kung Pao Chicken & Tofu',
    category: 'Chinese',
    description: 'Authentic Sichuan-style stir-fry featuring roasted peanuts, charred whole red chilies, Sichuan peppercorns, and a glossy sweet-savory glaze.',
    image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Both',
    price_indicator: 'Fiery & Savory',
    display_order: 7,
    is_active: 1
  },
  {
    dish_id: 'DISH-CHN-004',
    name: 'Szechuan Dan Dan Noodles',
    category: 'Chinese',
    description: 'Springy hand-tossed wheat noodles in a rich sesame broth laced with roasted chili oil, preserved mustard greens, and toasted sesame seeds.',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Both',
    price_indicator: 'Hand Tossed',
    display_order: 8,
    is_active: 1
  },

  // --- Italian ---
  {
    dish_id: 'DISH-ITA-001',
    name: 'Wood-Fired Neapolitan Margherita',
    category: 'Italian',
    description: 'Slow-fermented artisanal dough baked with San Marzano plum tomatoes, fresh Fior di Latte mozzarella, extra virgin olive oil, and sweet garden basil.',
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Veg',
    price_indicator: 'Stone Baked',
    display_order: 9,
    is_active: 1
  },
  {
    dish_id: 'DISH-ITA-002',
    name: 'Fettuccine Alfredo with Truffle Essence',
    category: 'Italian',
    description: 'Fresh handmade ribbons of egg pasta enrobed in aged Parmigiano-Reggiano, churned butter, roasted garlic, and a delicate whisper of black truffle oil.',
    image_url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Veg',
    price_indicator: 'Handmade Pasta',
    display_order: 10,
    is_active: 1
  },
  {
    dish_id: 'DISH-ITA-003',
    name: 'Baked Classic Lasagna Bolognese',
    category: 'Italian',
    description: 'Seven comforting layers of pasta sheets, slow-braised herb ragu, creamy velvety béchamel sauce, and bubbling melted golden mozzarella.',
    image_url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Both',
    price_indicator: 'Oven Baked Layered',
    display_order: 11,
    is_active: 1
  },
  {
    dish_id: 'DISH-ITA-004',
    name: 'Bruschetta al Pomodoro & Burrata',
    category: 'Italian',
    description: 'Charred garlic-rubbed sourdough crusts crowned with heirloom cherry tomatoes, creamy burrata cheese, and reduced Modena balsamic glaze.',
    image_url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Veg',
    price_indicator: 'Artisanal Antipasti',
    display_order: 12,
    is_active: 1
  },

  // --- Indo-Chinese ---
  {
    dish_id: 'DISH-IDC-001',
    name: 'Tangra Chilli Chicken & Chilli Paneer',
    category: 'Indo-Chinese',
    description: 'The iconic Kolkata Chinatown recipe of crispy batter-fried bites tossed with crunchy capsicum, sweet shallots, and spicy green chili dark soya.',
    image_url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Both',
    price_indicator: 'Kolkata Tangra Style',
    display_order: 13,
    is_active: 1
  },
  {
    dish_id: 'DISH-IDC-002',
    name: 'Classic Kolkata Hakka Noodles',
    category: 'Indo-Chinese',
    description: 'Smoky high-flame wok-tossed noodles with shredded cabbage, carrots, bell peppers, aromatic white pepper, and dark seasoning.',
    image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Both',
    price_indicator: 'Party Essential',
    display_order: 14,
    is_active: 1
  },
  {
    dish_id: 'DISH-IDC-003',
    name: 'Vegetable Manchurian in Hot Garlic Gravy',
    category: 'Indo-Chinese',
    description: 'Golden-fried vegetable dumplings bathed in a glossy, pungent fresh coriander and hot garlic sauce that perfectly balances tangy and spicy notes.',
    image_url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Veg',
    price_indicator: 'Tangy Garlic Glaze',
    display_order: 15,
    is_active: 1
  },
  {
    dish_id: 'DISH-IDC-004',
    name: 'Crispy Honey Chilli Potatoes',
    category: 'Indo-Chinese',
    description: 'Twice-fried crisp potato batons glazed with wildflower honey, toasted white sesame seeds, and crushed fiery red chili paste.',
    image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
    diet_type: 'Veg',
    price_indicator: 'Crispy Sweet & Spicy',
    display_order: 16,
    is_active: 1
  }
];
