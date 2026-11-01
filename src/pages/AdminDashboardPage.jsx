import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Package, Image as ImageIcon, Phone, CalendarCheck, Calendar, CreditCard,
  Search, Plus, Eye, Edit3, Trash2, CheckCircle2, Clock, AlertCircle,
  TrendingUp, Users, DollarSign, Lock, LogOut, MessageCircle, FileText,
  Video, Globe, Shield, Sparkles, MapPin, Check, X, ArrowUpDown, ExternalLink,
  UploadCloud, Upload, Briefcase, Utensils, UtensilsCrossed, Car, Compass, Hotel, Layers,
  BookOpen, Bookmark, Tag, Mail, Send, Bell, RotateCcw, Menu
} from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { ApiClient } from '../api/client';
import { generateBookingPDF } from '../utils/pdfGenerator';
import { getWhatsAppUrl } from '../config/businessConfig';
import { openWhatsAppInvoice, formatWhatsAppNumber } from '../utils/whatsappInvoice';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { CalendarManager } from '../components/admin/CalendarManager';

/**
 * Reusable Media Upload & Preview Field
 */
function MediaUploadField({
  label,
  sublabel,
  value,
  onChange,
  token,
  accept = 'image/*',
  mediaType = 'image',
  placeholder = 'https://... or upload a file'
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert('File is too large. Please select a file under 25MB.');
      return;
    }

    setUploading(true);
    setUploadError('');
    try {
      const res = await ApiClient.uploadAdminMedia(token, file);
      if (res && res.url) {
        onChange(res.url);
      } else {
        throw new Error(res?.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Upload failed');
      alert('Failed to upload file: ' + (err.message || 'Please try again'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>{label}</label>
        {sublabel && <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{sublabel}</span>}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #D1D5DB',
            fontSize: '0.85rem'
          }}
        />

        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileSelected}
          style={{ display: 'none' }}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            padding: '8px 14px',
            backgroundColor: uploading ? '#9CA3AF' : '#1E40AF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'background 0.2s'
          }}
          title="Upload image directly from computer or phone"
        >
          {uploading ? (
            <>
              <span style={{ width: '12px', height: '12px', border: '2px solid #FFF', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud size={16} />
              <span>Upload File</span>
            </>
          )}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            title="Clear"
            style={{
              padding: '8px 10px',
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              border: '1px solid #FECACA',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {uploadError && (
        <div style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px' }}>
          ⚠️ {uploadError}
        </div>
      )}

      {/* Real-time Preview Box */}
      {value && mediaType === 'image' && (
        <div style={{ marginTop: '8px', position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB', backgroundColor: '#0E2235' }}>
          <img
            src={value}
            alt="Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'; }}
          />
          <span style={{ position: 'absolute', bottom: '6px', right: '6px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFFFFF', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
            {label} Preview
          </span>
        </div>
      )}

      {value && mediaType === 'video' && (
        <div style={{ marginTop: '8px', position: 'relative', height: '160px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB', backgroundColor: '#000' }}>
          <video
            src={value}
            controls
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage({ onNavigate }) {
  const [token, setToken] = useState(sessionStorage.getItem('journeyarchitect_admin_token') || '');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [calendarSummary, setCalendarSummary] = useState(null);

  // Login State
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Data State
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [services, setServices] = useState([]);
  const [contactSettings, setContactSettings] = useState(null);
  const [payments, setPayments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Filter & Search States
  const [bookingFilter, setBookingFilter] = useState('ALL');
  const [bookingSearch, setBookingSearch] = useState('');
  const [packageSearch, setPackageSearch] = useState('');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('all');

  // Modals & Editors
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [manualPaymentAmount, setManualPaymentAmount] = useState('');
  const [manualPaymentMethod, setManualPaymentMethod] = useState('cash');

  // Catering & Car Rental Leads State
  const [cateringLeads, setCateringLeads] = useState([]);
  const [cateringFilter, setCateringFilter] = useState('ALL');
  const [cateringSearch, setCateringSearch] = useState('');
  const [selectedCateringLead, setSelectedCateringLead] = useState(null);

  const [carRentalLeads, setCarRentalLeads] = useState([]);
  const [carRentalFilter, setCarRentalFilter] = useState('ALL');
  const [carRentalSearch, setCarRentalSearch] = useState('');
  const [selectedCarRentalLead, setSelectedCarRentalLead] = useState(null);

  // Catering Cuisines Management State
  const [cuisines, setCuisines] = useState([]);
  const [cuisineCategoryFilter, setCuisineCategoryFilter] = useState('ALL');
  const [cuisineSearch, setCuisineSearch] = useState('');
  const [isCuisineModalOpen, setIsCuisineModalOpen] = useState(false);
  const [editingCuisine, setEditingCuisine] = useState(null);
  const [cuisineForm, setCuisineForm] = useState(getInitialCuisineForm());

  // Package Editor Modal
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageForm, setPackageForm] = useState(getInitialPackageForm());
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState('');
  const [uploadingPackageGallery, setUploadingPackageGallery] = useState(false);
  const [newInclusionInput, setNewInclusionInput] = useState('');
  const [newExclusionInput, setNewExclusionInput] = useState('');

  // Gallery Item Editor Modal
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [galleryForm, setGalleryForm] = useState(getInitialGalleryForm());
  const [uploadingBatchGallery, setUploadingBatchGallery] = useState(false);

  // Services Editor Modal
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState(getInitialServiceForm());
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newOfferingTitle, setNewOfferingTitle] = useState('');
  const [newOfferingDesc, setNewOfferingDesc] = useState('');

  // Contact Form State
  const [contactForm, setContactForm] = useState(getInitialContactForm());
  const [savingContact, setSavingContact] = useState(false);

  // Dynamic Booking Notification Email Settings State
  const [notificationSettings, setNotificationSettings] = useState({
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
  });
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailFeedback, setTestEmailFeedback] = useState('');
  const [showSmtpConfig, setShowSmtpConfig] = useState(false);

  // Website Logo & Branding State
  const [brandingSettings, setBrandingSettings] = useState({
    logo_url: '/logoo.png',
    logo_white_url: '/logo-white.png',
    logo_height: 120,
    logo_alt: 'Journey Architect'
  });
  const [savingBranding, setSavingBranding] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingWhiteLogo, setUploadingWhiteLogo] = useState(false);

  // Blog Management State
  const [blogs, setBlogs] = useState([]);
  const [blogSearch, setBlogSearch] = useState('');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('ALL');
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState(getInitialBlogForm());

  function getInitialBlogForm() {
    return {
      title: '',
      slug: '',
      category: 'Himalayas & Hills',
      excerpt: '',
      hero_image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      author_name: 'Sudipta Nandi',
      author_role: 'Founder & Lead Travel Planner',
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      published_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read_time: '5 min read',
      tags_input: 'Travel Guide, North Bengal, Himalayas',
      intro: '',
      sections: [
        { title: 'Overview & Highlights', content: '' }
      ],
      tips_input: 'Carry valid photo ID\nPack comfortable footwear\nKeep copies of travel itinerary',
      featured: false,
      is_active: 1
    };
  }

  function getInitialServiceForm() {
    return {
      title: '',
      slug: '',
      badge: '',
      icon: 'Compass',
      short_tagline: '',
      description: '',
      overview: '',
      hero_image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      lead_name: 'Sudipta Nandi (Founder)',
      lead_phone: '79803 31022',
      lead_alt_phones: '98303 54307, 82401 12378',
      key_features: [
        'Customized family, couple, and group itineraries',
        '24/7 on-call coordinator assistance'
      ],
      offerings: [
        { title: 'Himalayan Retreats', desc: 'Custom hill station trips with verified stays and dedicated vehicles.' }
      ],
      faqs: [],
      display_order: 1,
      is_active: 1
    };
  }

  function getInitialPackageForm() {
    return {
      name: '',
      slug: '',
      destination: '',
      tour_category: 'mountains',
      short_description: '',
      description: '',
      thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      featured_image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      gallery_images: [],
      duration_days: 4,
      duration_nights: 3,
      total_price: 15000,
      adult_price: 7500,
      child_price: 4500,
      booking_amount: 2500,
      availability_status: 'available',
      status: 'published',
      featured: 0,
      hotel_info: 'Verified 3-Star or Boutique Homestay',
      transport_info: 'Dedicated Sanitized AC/Non-AC Vehicle with Mountain Driver',
      meals_info: 'Daily Breakfast & Dinner with Fresh Regional/Bengali Cuisine',
      start_date: '',
      end_date: '',
      inclusions: ['Hotel Stay', 'Dedicated Cab', 'Daily Breakfast', 'Driver Allowances & Tolls'],
      exclusions: ['Train/Flight Tickets', 'Personal Expenses', 'Monastery/Monument Entry Fees', 'Tips & Porter Charges'],
      itinerary: [
        { day: 1, title: 'Arrival & Scenic Transfer', activities: 'Pickup from NJP/Bagdogra and scenic drive to hotel. Evening walk around the local market.', meals: 'Dinner', stay: 'Hotel / Homestay' },
        { day: 2, title: 'Local Sightseeing & Viewpoints', activities: 'Full day sightseeing of key attractions, sunrise viewpoints, and heritage points.', meals: 'Breakfast, Dinner', stay: 'Hotel / Homestay' }
      ]
    };
  }

  function getInitialGalleryForm() {
    return {
      title: '',
      media_type: 'image',
      media_url: '',
      thumbnail_url: '',
      category: 'mountains',
      location: 'Bengal & Himalayas',
      caption: '',
      display_order: 1,
      is_active: 1
    };
  }

  function getInitialContactForm() {
    return {
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
      udyam_registration_no: "UDYAM-WB-18-0199709",
      facebook_url: "https://www.facebook.com/share/1BiZE547Cc/",
      instagram_url: "https://www.instagram.com/journeyarchitect2026?xtok=MWg3YXl2N3Q3cWk5Mg==",
      twitter_url: "https://x.com/nan59130",
      youtube_url: "https://www.youtube.com/@SUDIPTANANDI-t9b",
      business_hours: "Monday – Sunday: 8:00 AM – 10:00 PM (24/7 on call for on-tour guests)",
      is_active: 1
    };
  }

  const isCuisineCategoryMatch = (itemCat, filterCat) => {
    if (!filterCat || filterCat === 'All' || filterCat === 'ALL') return true;
    if (!itemCat) return false;
    if (itemCat === filterCat) return true;
    const a = itemCat.toLowerCase().replace(/[^a-z0-9]/g, '');
    const b = filterCat.toLowerCase().replace(/[^a-z0-9]/g, '');
    return a === b;
  };

  function getInitialCuisineForm() {
    return {
      dish_id: '',
      name: '',
      category: 'Indian',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
      diet_type: 'non-veg',
      price_indicator: "Chef's Special",
      display_order: 0,
      is_active: 1
    };
  }

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    try {
      const res = await ApiClient.adminLogin(username, password);
      sessionStorage.setItem('journeyarchitect_admin_token', res.token);
      setToken(res.token);
    } catch (err) {
      setLoginError(err.message || 'Invalid admin credentials');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('journeyarchitect_admin_token');
    setToken('');
  };

  // Load Dashboard Data
  const loadDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsRes, bookingsRes, packagesRes, galleryRes, servicesRes, contactRes, paymentsRes, logsRes, blogsRes, notifRes, cateringRes, carRentalRes, cuisinesRes, brandingRes, calendarRes] = await Promise.all([
        ApiClient.getAdminStats(token),
        ApiClient.getAdminBookings(token, bookingFilter, bookingSearch),
        ApiClient.getAdminPackages(token),
        ApiClient.getAdminGallery(token),
        ApiClient.getAdminServices(token),
        ApiClient.getAdminContactSettings(token),
        ApiClient.getAdminPayments(token),
        ApiClient.getAdminAuditLogs(token),
        ApiClient.getAdminBlogs(token),
        ApiClient.getAdminNotificationSettings(token).catch(() => null),
        ApiClient.getAdminCateringLeads(token, cateringFilter, cateringSearch).catch(() => ({ leads: [] })),
        ApiClient.getAdminCarRentalLeads(token, carRentalFilter, carRentalSearch).catch(() => ({ leads: [] })),
        ApiClient.getAdminCateringCuisines(token, cuisineCategoryFilter === 'ALL' ? '' : cuisineCategoryFilter, cuisineSearch).catch(() => ({ cuisines: [] })),
        ApiClient.getAdminBrandingSettings(token).catch(() => null),
        ApiClient.getAdminCalendarSummary(token).catch(() => null)
      ]);

      if (statsRes?.stats) setStats(statsRes.stats);
      if (bookingsRes?.bookings) setBookings(bookingsRes.bookings);
      if (packagesRes?.packages) setPackages(packagesRes.packages);
      if (galleryRes?.items) setGalleryItems(galleryRes.items);
      if (servicesRes?.services) setServices(servicesRes.services);
      if (contactRes?.contact) {
        setContactSettings(contactRes.contact);
        setContactForm(contactRes.contact);
      }
      if (paymentsRes?.payments) setPayments(paymentsRes.payments);
      if (logsRes?.logs) setAuditLogs(logsRes.logs);
      if (blogsRes?.blogs) setBlogs(blogsRes.blogs);
      if (notifRes?.settings) setNotificationSettings(notifRes.settings);
      if (cateringRes?.leads) setCateringLeads(cateringRes.leads);
      if (carRentalRes?.leads) setCarRentalLeads(carRentalRes.leads);
      if (cuisinesRes?.cuisines) setCuisines(cuisinesRes.cuisines);
      if (brandingRes?.branding) setBrandingSettings(brandingRes.branding);
      if (calendarRes?.summary) setCalendarSummary(calendarRes.summary);
    } catch (err) {
      console.error('Error loading admin data:', err);
      if (err.message && err.message.includes('authorization')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [token, bookingFilter, cateringFilter, carRentalFilter, cuisineCategoryFilter]);

  const showFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  // ================= 1. TOUR PACKAGE MANAGEMENT HANDLERS =================

  const handleOpenNewPackageModal = () => {
    setEditingPackage(null);
    setPackageForm(getInitialPackageForm());
    setIsPackageModalOpen(true);
  };

  const handleOpenEditPackageModal = (pkg) => {
    if (!pkg) return;

    let safeInclusions = [];
    if (Array.isArray(pkg.inclusions)) {
      safeInclusions = pkg.inclusions;
    } else if (typeof pkg.inclusions === 'string') {
      try { safeInclusions = JSON.parse(pkg.inclusions); } catch { safeInclusions = []; }
    }

    let safeExclusions = [];
    if (Array.isArray(pkg.exclusions)) {
      safeExclusions = pkg.exclusions;
    } else if (typeof pkg.exclusions === 'string') {
      try { safeExclusions = JSON.parse(pkg.exclusions); } catch { safeExclusions = []; }
    }

    let safeGallery = [];
    if (Array.isArray(pkg.gallery_images)) {
      safeGallery = pkg.gallery_images;
    } else if (typeof pkg.gallery_images === 'string') {
      try { safeGallery = JSON.parse(pkg.gallery_images); } catch { safeGallery = []; }
    }

    let safeItinerary = [];
    if (Array.isArray(pkg.itinerary)) {
      safeItinerary = pkg.itinerary;
    } else if (typeof pkg.itinerary === 'string') {
      try { safeItinerary = JSON.parse(pkg.itinerary); } catch { safeItinerary = []; }
    }
    
    // Normalize each itinerary item so both description & activities are populated
    safeItinerary = (safeItinerary || []).map((d, i) => ({
      day: d.day || i + 1,
      title: d.title || `Day ${i + 1}`,
      activities: d.activities || d.description || '',
      description: d.description || d.activities || '',
      meals: d.meals || 'Breakfast, Dinner',
      stay: d.stay || 'Hotel / Resort'
    }));

    if (safeItinerary.length === 0) {
      safeItinerary = [
        { day: 1, title: 'Arrival & Scenic Transfer', activities: '', description: '', meals: 'Dinner', stay: 'Hotel / Homestay' }
      ];
    }

    setEditingPackage(pkg);
    setNewGalleryImageUrl('');
    setPackageForm({
      ...getInitialPackageForm(),
      ...pkg,
      gallery_images: safeGallery,
      inclusions: safeInclusions,
      exclusions: safeExclusions,
      itinerary: safeItinerary,
      start_date: pkg.start_date || '',
      end_date: pkg.end_date || ''
    });
    setIsPackageModalOpen(true);
  };

  const handleUploadPackageGalleryImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingPackageGallery(true);
    const uploadedUrls = [];
    for (const file of files) {
      try {
        const res = await ApiClient.uploadAdminMedia(token, file);
        if (res && res.url) {
          uploadedUrls.push(res.url);
        }
      } catch (err) {
        console.error('Error uploading gallery image:', err);
      }
    }
    if (uploadedUrls.length > 0) {
      setPackageForm(prev => ({
        ...prev,
        gallery_images: [...(prev.gallery_images || []), ...uploadedUrls]
      }));
      showFeedback(`Uploaded ${uploadedUrls.length} gallery photo(s)!`);
    }
    setUploadingPackageGallery(false);
    e.target.value = '';
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    try {
      if (editingPackage) {
        await ApiClient.updateAdminPackage(token, editingPackage.id, packageForm);
        showFeedback(`Package "${packageForm.name}" updated successfully!`);
      } else {
        await ApiClient.createAdminPackage(token, packageForm);
        showFeedback(`New package "${packageForm.name}" created successfully!`);
      }
      setIsPackageModalOpen(false);
      await loadDashboardData();
    } catch (err) {
      alert('Error saving package: ' + err.message);
    }
  };

  const handleDeletePackage = async (pkg) => {
    if (!window.confirm(`Are you sure you want to delete tour package: "${pkg.name}"?`)) return;
    try {
      await ApiClient.deleteAdminPackage(token, pkg.id);
      showFeedback(`Package "${pkg.name}" deleted successfully.`);
      await loadDashboardData();
    } catch (err) {
      alert('Error deleting package: ' + err.message);
    }
  };

  const handleTogglePackageStatus = async (pkg) => {
    const nextStatus = pkg.availability_status === 'available' ? 'temporarily_unavailable' : 'available';
    try {
      await ApiClient.toggleAdminPackageStatus(token, pkg.id, nextStatus);
      showFeedback(`Package status changed to: ${nextStatus}`);
      await loadDashboardData();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  // Itinerary helper inside Package Form
  const handleAddItineraryDay = () => {
    const nextDayNum = (packageForm.itinerary?.length || 0) + 1;
    setPackageForm({
      ...packageForm,
      itinerary: [
        ...(packageForm.itinerary || []),
        { day: nextDayNum, title: `Day ${nextDayNum} Exploration`, activities: '', description: '', meals: 'Breakfast, Dinner', stay: 'Hotel / Homestay' }
      ]
    });
  };

  const handleRemoveItineraryDay = (index) => {
    const updated = packageForm.itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }));
    setPackageForm({ ...packageForm, itinerary: updated });
  };

  const handleItineraryChange = (index, field, value) => {
    const updated = [...(packageForm.itinerary || [])];
    if (!updated[index]) return;
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    if (field === 'activities') {
      updated[index].description = value;
    } else if (field === 'description') {
      updated[index].activities = value;
    }
    setPackageForm({ ...packageForm, itinerary: updated });
  };

  // Inclusions/Exclusions tags helpers
  const handleAddInclusion = (text) => {
    if (!text.trim()) return;
    setPackageForm({ ...packageForm, inclusions: [...(packageForm.inclusions || []), text.trim()] });
  };
  const handleRemoveInclusion = (idx) => {
    setPackageForm({ ...packageForm, inclusions: packageForm.inclusions.filter((_, i) => i !== idx) });
  };

  const handleAddExclusion = (text) => {
    if (!text.trim()) return;
    setPackageForm({ ...packageForm, exclusions: [...(packageForm.exclusions || []), text.trim()] });
  };
  const handleRemoveExclusion = (idx) => {
    setPackageForm({ ...packageForm, exclusions: packageForm.exclusions.filter((_, i) => i !== idx) });
  };

  // ================= 2. GALLERY MANAGEMENT HANDLERS =================

  const handleOpenNewGalleryModal = () => {
    setEditingGalleryItem(null);
    setGalleryForm(getInitialGalleryForm());
    setIsGalleryModalOpen(true);
  };

  const handleOpenEditGalleryModal = (item) => {
    setEditingGalleryItem(item);
    setGalleryForm({
      title: item.title,
      media_type: item.media_type,
      media_url: item.media_url,
      thumbnail_url: item.thumbnail_url || item.media_url,
      category: item.category,
      location: item.location || '',
      caption: item.caption || '',
      display_order: item.display_order || 0,
      is_active: item.is_active
    });
    setIsGalleryModalOpen(true);
  };

  const handleSaveGalleryItem = async (e) => {
    e.preventDefault();
    try {
      if (editingGalleryItem) {
        await ApiClient.updateAdminGalleryItem(token, editingGalleryItem.id, galleryForm);
        showFeedback(`Gallery item "${galleryForm.title}" updated successfully!`);
      } else {
        await ApiClient.createAdminGalleryItem(token, galleryForm);
        showFeedback(`New gallery item "${galleryForm.title}" added!`);
      }
      setIsGalleryModalOpen(false);
      loadDashboardData();
    } catch (err) {
      alert('Error saving gallery item: ' + err.message);
    }
  };

  const handleBatchUploadGalleryPhotos = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingBatchGallery(true);
    let count = 0;
    for (const file of files) {
      try {
        const uploadRes = await ApiClient.uploadAdminMedia(token, file);
        if (uploadRes && uploadRes.url) {
          const rawTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
          await ApiClient.createAdminGalleryItem(token, {
            title: title || 'Tour Highlight',
            media_type: 'image',
            media_url: uploadRes.url,
            thumbnail_url: uploadRes.url,
            category: 'mountains',
            location: 'Bengal & Himalayas',
            caption: 'Customer vacation experience captured live on tour.',
            display_order: (galleryItems.length + count + 1),
            is_active: 1
          });
          count++;
        }
      } catch (err) {
        console.error('Error batch uploading gallery photo:', err);
      }
    }
    if (count > 0) {
      showFeedback(`Successfully uploaded and added ${count} photo(s) to Gallery!`);
      await loadDashboardData();
    }
    setUploadingBatchGallery(false);
    e.target.value = '';
  };

  const handleDeleteGalleryItem = async (item) => {
    if (!window.confirm(`Delete gallery item: "${item.title}"?`)) return;
    try {
      await ApiClient.deleteAdminGalleryItem(token, item.id);
      showFeedback(`Gallery item deleted.`);
      loadDashboardData();
    } catch (err) {
      alert('Error deleting gallery item: ' + err.message);
    }
  };

  const handleToggleGalleryItem = async (item) => {
    try {
      const res = await ApiClient.toggleAdminGalleryItem(token, item.id);
      showFeedback(res.message || 'Gallery item status updated.');
      loadDashboardData();
    } catch (err) {
      alert('Error toggling status: ' + err.message);
    }
  };

  // ================= 3. CONTACT INFO MANAGEMENT HANDLERS =================

  const handleSaveContactSettings = async (e) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      await ApiClient.updateAdminContactSettings(token, contactForm);
      showFeedback('Contact information & business details updated successfully!');
      loadDashboardData();
    } catch (err) {
      alert('Error saving contact settings: ' + err.message);
    } finally {
      setSavingContact(false);
    }
  };

  // ================= 3A. WEBSITE LOGO & BRANDING HANDLERS =================
  const handleLogoUpload = (file, variant = 'main') => {
    if (!file) return;
    if (variant === 'white') setUploadingWhiteLogo(true);
    else setUploadingLogo(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target.result;
        const res = await ApiClient.uploadAdminLogo(token, {
          dataUrl,
          filename: file.name,
          variant,
          logo_height: brandingSettings.logo_height || 120
        });
        if (res?.branding) {
          setBrandingSettings(res.branding);
          try {
            localStorage.setItem('ja_branding', JSON.stringify(res.branding));
          } catch (err) {}
          window.dispatchEvent(new CustomEvent('ja_branding_updated', { detail: res.branding }));
          showFeedback(`Website ${variant === 'white' ? 'light/footer' : 'primary'} logo uploaded & updated successfully!`);
        }
      } catch (uploadErr) {
        alert('Error uploading logo: ' + uploadErr.message);
      } finally {
        setUploadingLogo(false);
        setUploadingWhiteLogo(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBranding = async (e) => {
    if (e) e.preventDefault();
    setSavingBranding(true);
    try {
      const res = await ApiClient.updateAdminBrandingSettings(token, brandingSettings);
      if (res?.branding) {
        setBrandingSettings(res.branding);
        try {
          localStorage.setItem('ja_branding', JSON.stringify(res.branding));
        } catch (err) {}
        window.dispatchEvent(new CustomEvent('ja_branding_updated', { detail: res.branding }));
        showFeedback('Website logo & branding settings saved successfully!');
      }
    } catch (err) {
      alert('Error saving branding settings: ' + err.message);
    } finally {
      setSavingBranding(false);
    }
  };

  const handleResetLogo = async () => {
    if (!confirm('Are you sure you want to reset the website logo back to the official default logo?')) return;
    setSavingBranding(true);
    try {
      const res = await ApiClient.resetAdminBrandingSettings(token);
      if (res?.branding) {
        setBrandingSettings(res.branding);
        try {
          localStorage.setItem('ja_branding', JSON.stringify(res.branding));
        } catch (err) {}
        window.dispatchEvent(new CustomEvent('ja_branding_updated', { detail: res.branding }));
        showFeedback('Website logo reset to official default successfully!');
      }
    } catch (err) {
      alert('Error resetting logo: ' + err.message);
    } finally {
      setSavingBranding(false);
    }
  };

  // ================= 3B. BLOG POST MANAGEMENT HANDLERS =================

  const handleOpenNewBlogModal = () => {
    setEditingBlog(null);
    setBlogForm(getInitialBlogForm());
    setIsBlogModalOpen(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    let tagsInput = '';
    if (Array.isArray(blog.tags)) {
      tagsInput = blog.tags.join(', ');
    } else if (typeof blog.tags === 'string') {
      try {
        const parsed = JSON.parse(blog.tags);
        tagsInput = Array.isArray(parsed) ? parsed.join(', ') : blog.tags;
      } catch {
        tagsInput = blog.tags;
      }
    }

    let intro = '';
    let sections = [{ title: 'Overview & Highlights', content: '' }];
    let tipsInput = '';

    if (blog.content) {
      let contentObj = blog.content;
      if (typeof contentObj === 'string') {
        try {
          contentObj = JSON.parse(contentObj);
        } catch {}
      }
      if (contentObj) {
        intro = contentObj.intro || '';
        if (Array.isArray(contentObj.sections) && contentObj.sections.length > 0) {
          sections = contentObj.sections;
        }
        if (Array.isArray(contentObj.tips)) {
          tipsInput = contentObj.tips.join('\n');
        }
      }
    }

    setBlogForm({
      title: blog.title || '',
      slug: blog.slug || '',
      category: blog.category || 'Himalayas & Hills',
      excerpt: blog.excerpt || '',
      hero_image: blog.hero_image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      author_name: blog.author_name || 'Sudipta Nandi',
      author_role: blog.author_role || 'Founder & Lead Travel Planner',
      author_avatar: blog.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      published_date: blog.published_date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read_time: blog.read_time || '5 min read',
      tags_input: tagsInput,
      intro,
      sections,
      tips_input: tipsInput,
      featured: !!blog.featured,
      is_active: blog.is_active !== undefined ? (blog.is_active ? 1 : 0) : 1
    });
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    if (!blogForm.title.trim()) {
      alert('Please enter a blog title.');
      return;
    }
    try {
      const tags = (blogForm.tags_input || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const tips = (blogForm.tips_input || '')
        .split('\n')
        .map(t => t.trim())
        .filter(Boolean);

      const content = {
        intro: blogForm.intro,
        sections: blogForm.sections.filter(s => s.title || s.content),
        tips
      };

      const payload = {
        title: blogForm.title,
        slug: blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: blogForm.category,
        excerpt: blogForm.excerpt,
        hero_image: blogForm.hero_image,
        author_name: blogForm.author_name,
        author_role: blogForm.author_role,
        author_avatar: blogForm.author_avatar,
        published_date: blogForm.published_date,
        read_time: blogForm.read_time,
        tags,
        content,
        featured: blogForm.featured ? 1 : 0,
        is_active: blogForm.is_active ? 1 : 0
      };

      if (editingBlog) {
        await ApiClient.updateAdminBlog(token, editingBlog.id, payload);
        showFeedback(`Blog post "${payload.title}" updated successfully!`);
      } else {
        await ApiClient.createAdminBlog(token, payload);
        showFeedback(`New blog post "${payload.title}" published!`);
      }
      setIsBlogModalOpen(false);
      await loadDashboardData();
    } catch (err) {
      alert('Error saving blog: ' + err.message);
    }
  };

  const handleDeleteBlog = async (blog) => {
    if (!window.confirm(`Are you sure you want to delete blog: "${blog.title}"?`)) return;
    try {
      await ApiClient.deleteAdminBlog(token, blog.id);
      showFeedback(`Blog "${blog.title}" deleted.`);
      await loadDashboardData();
    } catch (err) {
      alert('Error deleting blog: ' + err.message);
    }
  };

  const handleToggleBlogStatus = async (blog) => {
    try {
      await ApiClient.toggleAdminBlogStatus(token, blog.id);
      showFeedback(`Blog "${blog.title}" visibility toggled.`);
      await loadDashboardData();
    } catch (err) {
      alert('Error toggling blog status: ' + err.message);
    }
  };

  const handleAddBlogSection = () => {
    setBlogForm(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', content: '' }]
    }));
  };

  const handleRemoveBlogSection = (idx) => {
    setBlogForm(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== idx)
    }));
  };

  const handleUpdateBlogSection = (idx, field, val) => {
    setBlogForm(prev => {
      const nextSections = [...prev.sections];
      nextSections[idx] = { ...nextSections[idx], [field]: val };
      return { ...prev, sections: nextSections };
    });
  };

  // ================= 4. BOOKINGS HANDLERS =================

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await ApiClient.updateBookingStatus(token, bookingId, newStatus);
      showFeedback(`Booking ${bookingId} status updated to ${newStatus}`);
      loadDashboardData();
      if (selectedBooking && selectedBooking.booking_id === bookingId) {
        setSelectedBooking({ ...selectedBooking, booking_status: newStatus });
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedBooking || !manualPaymentAmount) return;
    try {
      const res = await ApiClient.recordAdminPayment(token, selectedBooking.booking_id, {
        amount: manualPaymentAmount,
        paymentMethod: manualPaymentMethod,
        notes: 'Manual entry from Admin Panel'
      });
      const recordedAmt = manualPaymentAmount;
      setManualPaymentAmount('');
      showFeedback(`Payment of ₹${recordedAmt} recorded for ${selectedBooking.booking_id}!`);
      
      // Update selectedBooking in-place so modal balances immediately reflect without closing!
      if (res && res.paidAmount !== undefined) {
        setSelectedBooking(prev => prev ? ({
          ...prev,
          paid_amount: res.paidAmount,
          remaining_amount: res.remainingAmount,
          payment_status: res.paymentStatus || (res.remainingAmount <= 0 ? 'PAID' : 'PARTIAL')
        }) : null);
      }
      await loadDashboardData();
    } catch (err) {
      alert('Error recording payment: ' + err.message);
    }
  };

  // Catering Leads Handlers
  const handleUpdateCateringStatus = async (leadId, newStatus) => {
    try {
      await ApiClient.updateAdminCateringLeadStatus(token, leadId, newStatus);
      setCateringLeads(prev => prev.map(l => l.lead_id === leadId ? { ...l, status: newStatus } : l));
      if (selectedCateringLead && selectedCateringLead.lead_id === leadId) {
        setSelectedCateringLead(prev => ({ ...prev, status: newStatus }));
      }
      showFeedback(`Catering lead ${leadId} status set to ${newStatus}`);
    } catch (err) {
      alert('Failed to update catering lead status: ' + err.message);
    }
  };

  const handleDeleteCateringLead = async (leadId) => {
    if (!window.confirm(`Delete catering lead ${leadId}? This action cannot be undone.`)) return;
    try {
      await ApiClient.deleteAdminCateringLead(token, leadId);
      setCateringLeads(prev => prev.filter(l => l.lead_id !== leadId));
      if (selectedCateringLead?.lead_id === leadId) setSelectedCateringLead(null);
      showFeedback(`Catering lead ${leadId} deleted`);
    } catch (err) {
      alert('Failed to delete lead: ' + err.message);
    }
  };

  // Car Rental Leads Handlers
  const handleUpdateCarRentalStatus = async (leadId, newStatus) => {
    try {
      await ApiClient.updateAdminCarRentalLeadStatus(token, leadId, newStatus);
      setCarRentalLeads(prev => prev.map(l => l.lead_id === leadId ? { ...l, status: newStatus } : l));
      if (selectedCarRentalLead && selectedCarRentalLead.lead_id === leadId) {
        setSelectedCarRentalLead(prev => ({ ...prev, status: newStatus }));
      }
      showFeedback(`Car rental lead ${leadId} status set to ${newStatus}`);
    } catch (err) {
      alert('Failed to update car rental lead status: ' + err.message);
    }
  };

  const handleDeleteCarRentalLead = async (leadId) => {
    if (!window.confirm(`Delete car rental lead ${leadId}? This action cannot be undone.`)) return;
    try {
      await ApiClient.deleteAdminCarRentalLead(token, leadId);
      setCarRentalLeads(prev => prev.filter(l => l.lead_id !== leadId));
      if (selectedCarRentalLead?.lead_id === leadId) setSelectedCarRentalLead(null);
      showFeedback(`Car rental lead ${leadId} deleted`);
    } catch (err) {
      alert('Failed to delete lead: ' + err.message);
    }
  };

  // Catering Cuisines Handlers
  const handleOpenNewCuisineModal = () => {
    setEditingCuisine(null);
    setCuisineForm(getInitialCuisineForm());
    setIsCuisineModalOpen(true);
  };

  const handleOpenEditCuisineModal = (dish) => {
    setEditingCuisine(dish);
    setCuisineForm({
      dish_id: dish.dish_id || '',
      name: dish.name || '',
      category: dish.category || 'Indian',
      description: dish.description || '',
      image_url: dish.image_url || '',
      diet_type: dish.diet_type || 'non-veg',
      price_indicator: dish.price_indicator || '',
      display_order: dish.display_order ?? 0,
      is_active: dish.is_active ?? 1
    });
    setIsCuisineModalOpen(true);
  };

  const handleSaveCuisine = async (e) => {
    e.preventDefault();
    if (!cuisineForm.name?.trim()) {
      alert('Please enter a dish name');
      return;
    }
    if (!cuisineForm.category?.trim()) {
      alert('Please select a category');
      return;
    }
    if (!cuisineForm.image_url?.trim()) {
      alert('Please provide a dish image URL or upload an image');
      return;
    }

    try {
      if (editingCuisine) {
        await ApiClient.updateAdminCateringCuisine(token, editingCuisine.id, cuisineForm);
        showFeedback(`Dish "${cuisineForm.name}" updated successfully!`);
      } else {
        await ApiClient.createAdminCateringCuisine(token, cuisineForm);
        showFeedback(`New dish "${cuisineForm.name}" added to ${cuisineForm.category} menu!`);
      }
      setIsCuisineModalOpen(false);
      loadDashboardData();
    } catch (err) {
      alert('Error saving dish: ' + err.message);
    }
  };

  const handleToggleCuisineStatus = async (dishId, currentStatus) => {
    const newStatus = currentStatus === 1 || currentStatus === true ? 0 : 1;
    try {
      await ApiClient.toggleAdminCateringCuisine(token, dishId, newStatus);
      setCuisines(prev => prev.map(d => d.id === dishId ? { ...d, is_active: newStatus } : d));
      showFeedback(`Dish visibility set to ${newStatus === 1 ? 'Live on Site' : 'Hidden'}`);
    } catch (err) {
      alert('Failed to toggle dish visibility: ' + err.message);
    }
  };

  const handleDeleteCuisine = async (dish) => {
    if (!window.confirm(`Are you sure you want to delete "${dish.name}" from the ${dish.category} cuisine menu? This action cannot be undone.`)) return;
    try {
      await ApiClient.deleteAdminCateringCuisine(token, dish.id);
      setCuisines(prev => prev.filter(d => d.id !== dish.id));
      showFeedback(`Dish "${dish.name}" deleted successfully`);
    } catch (err) {
      alert('Failed to delete dish: ' + err.message);
    }
  };

  const handleSaveNotificationSettings = async (e) => {
    if (e) e.preventDefault();
    setSavingNotifications(true);
    setTestEmailFeedback('');
    try {
      const res = await ApiClient.updateAdminNotificationSettings(token, notificationSettings);
      showFeedback(`Booking notification email updated to ${notificationSettings.booking_notification_email}`);
      if (res?.settings) setNotificationSettings(res.settings);
    } catch (err) {
      alert('Error updating notification settings: ' + err.message);
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleSendTestNotificationEmail = async () => {
    setTestingEmail(true);
    setTestEmailFeedback('');
    try {
      const res = await ApiClient.sendTestNotificationEmail(token, notificationSettings.booking_notification_email);
      setTestEmailFeedback(res.message || `Test notification sent to ${notificationSettings.booking_notification_email}`);
      showFeedback(`Test email sent to ${notificationSettings.booking_notification_email}!`);
    } catch (err) {
      setTestEmailFeedback('Test email failed: ' + err.message);
    } finally {
      setTestingEmail(false);
    }
  };

  // ================= AUTH SCREEN =================
  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B1B2B', padding: '1.5rem' }}>
        <SEOHead title="Admin Login | Journey Architect" description="Admin authentication portal" />
        <div style={{ maxWidth: '420px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 24px 64px rgba(0,0,0,0.45)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(244, 163, 64, 0.15)', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Lock size={28} color="var(--color-secondary)" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 6px 0' }}>
              Journey Architect Admin
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Enter administrator credentials to manage packages, gallery, bookings, and contact details.
            </p>
          </div>

          {loginError && (
            <div style={{ padding: '10px 14px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} flexShrink={0} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                marginTop: '0.5rem'
              }}
            >
              {loggingIn ? 'Authenticating...' : 'Sign In to Admin Portal'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
              style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 600 }}
            >
              ← Return to Main Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN DASHBOARD =================
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', position: 'relative' }}>
      <SEOHead title="Admin Dashboard | Journey Architect" description="Control center" />

      {/* Modern Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigate={onNavigate}
        handleLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        counts={{
          packagesCount: packages.length,
          blogsCount: blogs.length,
          galleryCount: galleryItems.length,
          cuisinesCount: cuisines.length,
          cateringCount: cateringLeads.length,
          cateringNewCount: cateringLeads.filter(l => l.status === 'NEW').length,
          carRentalCount: carRentalLeads.length,
          carRentalNewCount: carRentalLeads.filter(l => l.status === 'NEW').length,
          bookingsCount: bookings.length,
          bookingsPendingCount: bookings.filter(b => b.booking_status === 'PENDING_PAYMENT').length,
          paymentsCount: payments.length,
          calendarTodayCount: calendarSummary?.todayEvents || 0,
          calendarPendingCount: calendarSummary?.pendingReminders || 0
        }}
      />

      {/* Main Workspace Wrapper */}
      <div
        className="admin-main-wrapper"
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F8FAFC',
          minHeight: '100vh'
        }}
      >
        {/* Modern Sticky Top Navigation Bar */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 90,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            padding: '0.85rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Left: Mobile Sidebar Toggle + Breadcrumb / Active Tab Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className="mobile-sidebar-toggle"
              onClick={() => setIsSidebarOpen(true)}
              style={{
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '8px',
                color: '#1E293B',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Toggle navigation drawer"
            >
              <Menu size={20} />
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Admin Portal /
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-secondary, #167C80)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {activeTab.replace('-', ' ')}
                </span>
              </div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary, #0E2235)', margin: 0, lineHeight: 1.2 }}>
                {activeTab === 'calendar' ? 'Calendar & Event Management' :
                 activeTab === 'overview' ? 'Overview & Analytics' :
                 activeTab === 'packages' ? 'Tour Packages Catalog' :
                 activeTab === 'blogs' ? 'Travel Blogs & Stories' :
                 activeTab === 'gallery' ? 'Photo & Video Media Gallery' :
                 activeTab === 'cuisines' ? 'Cuisine & Catering Menu' :
                 activeTab === 'catering' ? 'Catering Leads & Requests' :
                 activeTab === 'car-rental' ? 'Car Rental Leads & Bookings' :
                 activeTab === 'branding' ? 'Website Logo & Branding' :
                 activeTab === 'contact' ? 'Contact Info & Notifications' :
                 activeTab === 'bookings' ? 'Customer Tour Bookings' :
                 activeTab === 'payments' ? 'Payments & Financial Logs' :
                 activeTab === 'logs' ? 'System Audit Activity Logs' : 'Dashboard'}
              </h1>
            </div>
          </div>

          {/* Right: Date Badge, Quick Actions, User Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Live Today's Date Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F1F5F9',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#334155'
              }}
            >
              <Calendar size={14} color="var(--color-secondary, #167C80)" />
              <span>
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {/* Quick Link to Live Website */}
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: '#475569',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                transition: 'all 0.15s ease'
              }}
              title="Return to Public Website"
            >
              <Globe size={14} />
              <span>Live Site</span>
            </a>

            {/* Quick Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.825rem',
                color: '#DC2626',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.15s ease'
              }}
              title="Sign Out"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Toast Notification Bar */}
        {feedbackMsg && (
          <div style={{ backgroundColor: '#10B981', color: '#FFFFFF', padding: '10px 20px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CheckCircle2 size={18} />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Workspace Tab Contents */}
        <div style={{ maxWidth: '1600px', width: '100%', margin: '0 auto', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* TAB 0: CALENDAR MANAGEMENT (NEW) */}
          {activeTab === 'calendar' && (
            <CalendarManager
              token={token}
              onShowToast={(msg) => setFeedbackMsg(msg)}
            />
          )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E5E7EB', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Total Bookings</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px' }}>
                  {stats?.totalBookings || bookings.length}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>Active in database</span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E5E7EB', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Confirmed Revenue</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                  ₹{(stats?.totalRevenue || 135000).toLocaleString('en-IN')}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Verified receipts</span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E5E7EB', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Tour Packages</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-secondary)', marginTop: '4px' }}>
                  {packages.length}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Live on frontend</span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E5E7EB', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Gallery Photos & Videos</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8B5CF6', marginTop: '4px' }}>
                  {galleryItems.length}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Media assets</span>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 8px 0' }}>
                  📦 Tour Package Control
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1rem', lineHeight: 1.5 }}>
                  Add new tour packages, customize day-wise itineraries, update prices, hotel info, and availability.
                </p>
                <button
                  type="button"
                  onClick={() => { setActiveTab('packages'); handleOpenNewPackageModal(); }}
                  style={{ padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  + Add New Package
                </button>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 8px 0' }}>
                  🖼️ Gallery Manager
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1rem', lineHeight: 1.5 }}>
                  Upload new trip photos, link scenic tour videos (MP4/YouTube), and manage customer highlight reels.
                </p>
                <button
                  type="button"
                  onClick={() => { setActiveTab('gallery'); handleOpenNewGalleryModal(); }}
                  style={{ padding: '8px 16px', backgroundColor: 'var(--color-secondary)', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  + Add Media to Gallery
                </button>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 8px 0' }}>
                  📞 Contact Information
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1rem', lineHeight: 1.5 }}>
                  Update phone numbers for Founder, Co-Founder, Partner, WhatsApp, email addresses, and address.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('contact')}
                  style={{ padding: '8px 16px', backgroundColor: '#F3F4F6', color: 'var(--color-primary)', border: '1px solid #D1D5DB', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Edit Contact Info →
                </button>
              </div>
            </div>

            {/* Recent Bookings & Inquiries on Overview */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarCheck size={20} color="var(--color-secondary)" />
                    <span>Recent Customer Inquiries & Bookings ({bookings.length})</span>
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: '#6B7280', margin: '4px 0 0 0' }}>
                    Live customer submissions from the website "Plan Your Journey" modal, Contact page, and direct tour bookings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('bookings')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer' }}
                >
                  <span>View All Bookings & Leads →</span>
                </button>
              </div>

              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6B7280' }}>
                  No customer bookings or inquiries recorded yet.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB', color: '#374151' }}>
                        <th style={{ padding: '10px 12px' }}>Reference</th>
                        <th style={{ padding: '10px 12px' }}>Customer</th>
                        <th style={{ padding: '10px 12px' }}>Package / Destination</th>
                        <th style={{ padding: '10px 12px' }}>Travel Date</th>
                        <th style={{ padding: '10px 12px' }}>Party Size</th>
                        <th style={{ padding: '10px 12px' }}>Status</th>
                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 8).map((b) => (
                        <tr key={b.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                          <td style={{ padding: '10px 12px' }}>
                            <strong style={{ color: 'var(--color-secondary)', fontSize: '0.85rem' }}>{b.booking_id}</strong>
                            <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{b.created_at ? new Date(b.created_at).toLocaleDateString('en-IN') : ''}</div>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <strong style={{ display: 'block', color: 'var(--color-primary)', fontSize: '0.9rem' }}>{b.customer_name}</strong>
                            <a
                              href={`https://wa.me/91${String(b.customer_phone || '').replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: '0.78rem', color: '#059669', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              📞 {b.customer_phone}
                            </a>
                          </td>
                          <td style={{ padding: '10px 12px', color: '#374151' }}>
                            <div style={{ fontWeight: 600 }}>{b.package_name || 'Custom Trip'}</div>
                            {b.pickup_location && (
                              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>📍 {b.pickup_location}</div>
                            )}
                          </td>
                          <td style={{ padding: '10px 12px', color: '#374151' }}>{b.travel_date || 'Flexible'}</td>
                          <td style={{ padding: '10px 12px', color: '#374151' }}>
                            {b.adults} Adults {b.children > 0 ? `, ${b.children} Children` : ''}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor: b.booking_status === 'CONFIRMED' ? '#D1FAE5' : b.booking_status === 'COMPLETED' ? '#DBEAFE' : '#FEF3C7',
                              color: b.booking_status === 'CONFIRMED' ? '#065F46' : b.booking_status === 'COMPLETED' ? '#1E40AF' : '#92400E'
                            }}>
                              {b.booking_status === 'PENDING_PAYMENT' ? 'New Enquiry / Lead' : b.booking_status}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedBooking(b)}
                              style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', border: 'none', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TOUR PACKAGE MANAGEMENT */}
        {activeTab === 'packages' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                  Tour Package Management
                </h2>
                <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                  All packages are stored in SQLite database and dynamically displayed on the website.
                </span>
              </div>
              <button
                type="button"
                onClick={handleOpenNewPackageModal}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                <Plus size={16} />
                <span>Add New Package</span>
              </button>
            </div>

            {/* Packages Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB', color: '#374151' }}>
                    <th style={{ padding: '12px' }}>Tour Package</th>
                    <th style={{ padding: '12px' }}>Destination</th>
                    <th style={{ padding: '12px' }}>Duration</th>
                    <th style={{ padding: '12px' }}>Total Price</th>
                    <th style={{ padding: '12px' }}>Advance Req.</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={pkg.thumbnail}
                            alt={pkg.name}
                            style={{ width: '48px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80'; }}
                          />
                          <div>
                            <strong style={{ color: 'var(--color-primary)', display: 'block' }}>{pkg.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>/{pkg.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#4B5563' }}>{pkg.destination}</td>
                      <td style={{ padding: '12px', color: '#4B5563' }}>{pkg.duration_days}D / {pkg.duration_nights}N</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
                        ₹{Number(pkg.total_price || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--color-secondary)', fontWeight: 600 }}>
                        ₹{Number(pkg.booking_amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          type="button"
                          onClick={() => handleTogglePackageStatus(pkg)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: pkg.availability_status === 'available' ? '#D1FAE5' : '#FEE2E2',
                            color: pkg.availability_status === 'available' ? '#065F46' : '#991B1B'
                          }}
                          title="Click to toggle status"
                        >
                          {pkg.availability_status === 'available' ? '● Available' : '○ Unavailable'}
                        </button>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <a
                            href={`/tours/${pkg.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#F3F4F6', color: '#4B5563' }}
                            title="View on site"
                          >
                            <ExternalLink size={15} />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleOpenEditPackageModal(pkg)}
                            style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#E0E7FF', color: '#3730A3', border: 'none', cursor: 'pointer' }}
                            title="Edit Package"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePackage(pkg)}
                            style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#FEE2E2', color: '#991B1B', border: 'none', cursor: 'pointer' }}
                            title="Delete Package"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2B: TRAVEL BLOG MANAGEMENT */}
        {activeTab === 'blogs' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
            {/* Tab Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={22} color="var(--color-secondary)" />
                  <span>Travel Blog & Stories Management ({blogs.length})</span>
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '4px 0 0 0' }}>
                  Create and manage destination guides, tour stories, and tips displayed on the Home & Blog pages
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenNewBlogModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  backgroundColor: 'var(--color-secondary)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(22, 124, 128, 0.25)'
                }}
              >
                <Plus size={16} />
                <span>Write New Blog Post</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '1.25rem', backgroundColor: '#F9FAFB', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#9CA3AF' }} />
                <input
                  type="text"
                  placeholder="Search blogs by title, tag, author..."
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6B7280' }}>Category:</span>
                <select
                  value={blogCategoryFilter}
                  onChange={(e) => setBlogCategoryFilter(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  <option value="ALL">All Categories</option>
                  <option value="Himalayas & Hills">Himalayas & Hills</option>
                  <option value="Wildlife & Deltas">Wildlife & Deltas</option>
                  <option value="Heritage & Pilgrimage">Heritage & Pilgrimage</option>
                  <option value="Travel Tips">Travel Tips</option>
                  <option value="Regional Culture & Food">Regional Culture & Food</option>
                  <option value="Custom Tours">Custom Tours</option>
                </select>
              </div>
            </div>

            {/* Blog Posts Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5E7EB', color: '#6B7280', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '10px 12px' }}>Article</th>
                    <th style={{ padding: '10px 12px' }}>Category</th>
                    <th style={{ padding: '10px 12px' }}>Author & Date</th>
                    <th style={{ padding: '10px 12px' }}>Read Time</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs
                    .filter(b => {
                      if (blogCategoryFilter !== 'ALL' && b.category !== blogCategoryFilter) return false;
                      if (!blogSearch.trim()) return true;
                      const q = blogSearch.toLowerCase();
                      const tagsStr = Array.isArray(b.tags) ? b.tags.join(' ') : (b.tags || '');
                      return (
                        (b.title || '').toLowerCase().includes(q) ||
                        (b.excerpt || '').toLowerCase().includes(q) ||
                        (b.author_name || '').toLowerCase().includes(q) ||
                        tagsStr.toLowerCase().includes(q)
                      );
                    })
                    .map((blog) => {
                      const isLive = blog.is_active === 1 || blog.is_active === true;
                      return (
                        <tr key={blog.id || blog.slug} style={{ borderBottom: '1px solid #F3F4F6' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={blog.hero_image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=120&q=80'}
                                alt={blog.title}
                                style={{ width: '56px', height: '42px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0, border: '1px solid #E5E7EB' }}
                              />
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                                    {blog.title}
                                  </strong>
                                  {blog.featured ? (
                                    <span style={{ fontSize: '0.68rem', backgroundColor: 'rgba(244, 163, 64, 0.15)', color: '#B45309', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                      ★ Featured
                                    </span>
                                  ) : null}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block', maxWidth: '340px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {blog.excerpt}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '12px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--color-bg)', color: 'var(--color-secondary)', border: '1px solid var(--color-border-light)' }}>
                              {blog.category}
                            </span>
                          </td>

                          <td style={{ padding: '12px', fontSize: '0.8rem', color: '#4B5563' }}>
                            <div style={{ fontWeight: 600 }}>{blog.author_name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{blog.published_date}</div>
                          </td>

                          <td style={{ padding: '12px', fontSize: '0.8rem', color: '#6B7280' }}>
                            {blog.read_time}
                          </td>

                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleBlogStatus(blog)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: isLive ? '#DEF7EC' : '#F3F4F6',
                                color: isLive ? '#03543F' : '#6B7280'
                              }}
                              title="Click to toggle visibility"
                            >
                              {isLive ? '● Live' : '○ Hidden'}
                            </button>
                          </td>

                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <a
                                href={`/blog#${blog.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#F3F4F6', color: '#4B5563', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                title="View on Site"
                              >
                                <ExternalLink size={14} />
                              </a>
                              <button
                                type="button"
                                onClick={() => handleEditBlog(blog)}
                                style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#E0E7FF', color: '#3730A3', border: 'none', cursor: 'pointer' }}
                                title="Edit Blog"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteBlog(blog)}
                                style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#FEE2E2', color: '#991B1B', border: 'none', cursor: 'pointer' }}
                                title="Delete Blog"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                  {blogs.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                        No travel blog posts found. Click "+ Write New Blog Post" above to publish your first article!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                  Gallery Management (Images & Videos)
                </h2>
                <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                  Manage client vacation photos, drone videos, and holiday highlights.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  backgroundColor: uploadingBatchGallery ? '#9CA3AF' : '#059669',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: uploadingBatchGallery ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 4px rgba(5,150,105,0.2)'
                }}>
                  {uploadingBatchGallery ? (
                    <>
                      <span style={{ width: '14px', height: '14px', border: '2px solid #FFF', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                      <span>Uploading Photos...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={17} />
                      <span>+ Bulk Upload Photos</span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={uploadingBatchGallery}
                    style={{ display: 'none' }}
                    onChange={handleBatchUploadGalleryPhotos}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleOpenNewGalleryModal}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', backgroundColor: 'var(--color-secondary)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  <Plus size={16} />
                  <span>Add Image / Video</span>
                </button>
              </div>
            </div>

            {/* Gallery Media Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: '#FAFAFA',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Media Preview Box */}
                  <div style={{ position: 'relative', height: '170px', backgroundColor: '#0E2235' }}>
                    <img
                      src={item.thumbnail_url || item.media_url}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'; }}
                    />
                    {/* Media Type Badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: item.media_type === 'video' ? '#EF4444' : '#12304A',
                        color: '#FFFFFF',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {item.media_type === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                      <span>{item.media_type === 'video' ? 'VIDEO' : 'PHOTO'}</span>
                    </span>

                    {/* Active Status Badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: item.is_active ? '#10B981' : '#6B7280',
                        color: '#FFFFFF',
                        padding: '3px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {item.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)', marginBottom: '4px', display: 'block' }}>
                      {item.title}
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary)', fontWeight: 600, marginBottom: '6px' }}>
                      📍 {item.location || 'Bengal & Himalayas'} • Order: #{item.display_order || 0}
                    </span>
                    <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 1rem 0', lineHeight: 1.4, flex: 1 }}>
                      {item.caption || 'No caption provided.'}
                    </p>

                    {/* Action Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleGalleryItem(item)}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #D1D5DB',
                          backgroundColor: '#FFFFFF',
                          cursor: 'pointer'
                        }}
                      >
                        {item.is_active ? 'Disable' : 'Enable'}
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditGalleryModal(item)}
                          style={{ padding: '5px 8px', borderRadius: '4px', backgroundColor: '#E0E7FF', color: '#3730A3', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryItem(item)}
                          style={{ padding: '5px 8px', borderRadius: '4px', backgroundColor: '#FEE2E2', color: '#991B1B', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CONTACT & SITE SETTINGS MANAGEMENT */}
        {activeTab === 'contact' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.75rem' }}>
            
            {/* Real-Time Booking Notification Email Settings Card */}
            <div style={{ backgroundColor: '#F0FDF4', border: '2px solid #86EFAC', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem', borderBottom: '1px solid #BBF7D0', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#14532D', margin: 0 }}>
                      Booking Notification Email Settings
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: '#166534' }}>
                      All customer tour bookings & enquiries are dispatched dynamically to this email address.
                    </span>
                  </div>
                </div>

                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #86EFAC', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block' }} />
                  Active Receiver: {notificationSettings.booking_notification_email || 'sudiptajourneys@gmail.com'}
                </span>
              </div>

              <form onSubmit={handleSaveNotificationSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#14532D', marginBottom: '6px' }}>
                      Notification Email Address (Changeable anytime)
                    </label>
                    <input
                      type="email"
                      required
                      value={notificationSettings.booking_notification_email}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, booking_notification_email: e.target.value })}
                      placeholder="sudiptajourneys@gmail.com"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #86EFAC', fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', backgroundColor: '#FFFFFF' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#166534', marginTop: '4px', display: 'block' }}>
                      💡 Every new booking dossier is immediately emailed here with customer, travel, & payment info.
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, color: '#14532D' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(notificationSettings.enable_email_notifications)}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, enable_email_notifications: e.target.checked ? 1 : 0 })}
                        style={{ width: '18px', height: '18px', accentColor: '#16A34A', cursor: 'pointer' }}
                      />
                      <span>Enable real-time email dispatch on every booking</span>
                    </label>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '4px', paddingLeft: '26px' }}>
                      Keep checked to receive instant notifications when guests book tours or submit leads.
                    </span>
                  </div>
                </div>

                {/* Collapsible SMTP details toggle */}
                <div style={{ borderTop: '1px solid #BBF7D0', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowSmtpConfig(!showSmtpConfig)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803D', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', padding: 0 }}
                  >
                    <span>⚙️ {showSmtpConfig ? 'Hide SMTP / Gmail App Password Settings' : 'Configure SMTP / Gmail App Password (Optional)'}</span>
                  </button>

                  {showSmtpConfig && (
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #D1D5DB', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>SMTP Host</label>
                        <input
                          type="text"
                          value={notificationSettings.smtp_host || 'smtp.gmail.com'}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, smtp_host: e.target.value })}
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>SMTP Port</label>
                        <input
                          type="number"
                          value={notificationSettings.smtp_port || 587}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, smtp_port: e.target.value })}
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Gmail / SMTP Username</label>
                        <input
                          type="text"
                          placeholder="e.g. sudiptajourneys@gmail.com"
                          value={notificationSettings.smtp_user || ''}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, smtp_user: e.target.value })}
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Google App Password</label>
                        <input
                          type="password"
                          placeholder="16-character App Password"
                          value={notificationSettings.smtp_pass || ''}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, smtp_pass: e.target.value })}
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                          ℹ️ To deliver to external Gmail inboxes, visit Google Account &gt; Security &gt; 2-Step Verification &gt; App Passwords, generate a 16-character password for "Mail", and paste it here.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {testEmailFeedback && (
                  <div style={{ padding: '8px 12px', backgroundColor: testEmailFeedback.includes('failed') ? '#FEE2E2' : '#DCFCE7', color: testEmailFeedback.includes('failed') ? '#991B1B' : '#166534', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                    {testEmailFeedback}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                  <button
                    type="submit"
                    disabled={savingNotifications}
                    style={{ padding: '10px 20px', backgroundColor: '#16A34A', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700, cursor: savingNotifications ? 'not-allowed' : 'pointer' }}
                  >
                    {savingNotifications ? 'Saving Settings...' : 'Save Notification Email'}
                  </button>

                  <button
                    type="button"
                    disabled={testingEmail}
                    onClick={handleSendTestNotificationEmail}
                    style={{ padding: '10px 18px', backgroundColor: '#FFFFFF', color: '#16A34A', border: '1.5px solid #16A34A', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700, cursor: testingEmail ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Send size={15} />
                    <span>{testingEmail ? 'Sending Test...' : `Send Test Email to ${notificationSettings.booking_notification_email || 'Email'}`}</span>
                  </button>
                </div>
              </form>
            </div>

            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 4px 0' }}>
                Contact Information & Business Details
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                Update team contact numbers, office location, licenses, WhatsApp, and social profiles.
              </span>
            </div>

            <form onSubmit={handleSaveContactSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Team Contacts Grid */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                  👥 Key Team & Founder Contacts
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Founder Name</label>
                    <input
                      type="text"
                      value={contactForm.founder_name || ''}
                      onChange={(e) => setContactForm({ ...contactForm, founder_name: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Founder Primary Phone</label>
                    <input
                      type="text"
                      value={contactForm.founder_phone || ''}
                      onChange={(e) => setContactForm({ ...contactForm, founder_phone: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Founder Secondary Phone(s)</label>
                    <input
                      type="text"
                      value={contactForm.founder_phone_alt || ''}
                      onChange={(e) => setContactForm({ ...contactForm, founder_phone_alt: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Co-Founder Name</label>
                    <input
                      type="text"
                      value={contactForm.cofounder_name || ''}
                      onChange={(e) => setContactForm({ ...contactForm, cofounder_name: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Co-Founder Phone</label>
                    <input
                      type="text"
                      value={contactForm.cofounder_phone || ''}
                      onChange={(e) => setContactForm({ ...contactForm, cofounder_phone: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Travel & Transport Partner Name</label>
                    <input
                      type="text"
                      value={contactForm.travel_partner_name || ''}
                      onChange={(e) => setContactForm({ ...contactForm, travel_partner_name: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Travel Partner Phone</label>
                    <input
                      type="text"
                      value={contactForm.travel_partner_phone || ''}
                      onChange={(e) => setContactForm({ ...contactForm, travel_partner_phone: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp & Email */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                  💬 WhatsApp & Email Coordinates
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>WhatsApp Number (with Country Code e.g. 917980331022)</label>
                    <input
                      type="text"
                      value={contactForm.whatsapp_number || ''}
                      onChange={(e) => setContactForm({ ...contactForm, whatsapp_number: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Primary Booking Email</label>
                    <input
                      type="email"
                      value={contactForm.email_primary || ''}
                      onChange={(e) => setContactForm({ ...contactForm, email_primary: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Customer Support Email</label>
                    <input
                      type="email"
                      value={contactForm.email_support || ''}
                      onChange={(e) => setContactForm({ ...contactForm, email_support: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                </div>
              </div>

              {/* Physical Office Address & Licenses */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                  📍 Physical Address & Government Certifications
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Head Office Address</label>
                    <input
                      type="text"
                      value={contactForm.address_full || ''}
                      onChange={(e) => setContactForm({ ...contactForm, address_full: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Branch Office Address</label>
                    <input
                      type="text"
                      placeholder="e.g. P-23, Michael nagar , Kolkata - 700 133"
                      value={contactForm.branch_address || ''}
                      onChange={(e) => setContactForm({ ...contactForm, branch_address: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Trade License No.</label>
                    <input
                      type="text"
                      value={contactForm.trade_license_no || ''}
                      onChange={(e) => setContactForm({ ...contactForm, trade_license_no: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>UDYAM (MSME) No.</label>
                    <input
                      type="text"
                      value={contactForm.udyam_registration_no || ''}
                      onChange={(e) => setContactForm({ ...contactForm, udyam_registration_no: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Google Maps Embed URL</label>
                    <input
                      type="text"
                      value={contactForm.google_map_embed || ''}
                      onChange={(e) => setContactForm({ ...contactForm, google_map_embed: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                  🌐 Social Media & Operational Hours
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Facebook Page URL</label>
                    <input
                      type="text"
                      value={contactForm.facebook_url || ''}
                      onChange={(e) => setContactForm({ ...contactForm, facebook_url: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Instagram URL</label>
                    <input
                      type="text"
                      value={contactForm.instagram_url || ''}
                      onChange={(e) => setContactForm({ ...contactForm, instagram_url: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>X (Twitter) URL</label>
                    <input
                      type="text"
                      value={contactForm.twitter_url || ''}
                      onChange={(e) => setContactForm({ ...contactForm, twitter_url: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>YouTube URL</label>
                    <input
                      type="text"
                      value={contactForm.youtube_url || ''}
                      onChange={(e) => setContactForm({ ...contactForm, youtube_url: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Operational Hours</label>
                    <input
                      type="text"
                      value={contactForm.business_hours || ''}
                      onChange={(e) => setContactForm({ ...contactForm, business_hours: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
                <button
                  type="submit"
                  disabled={savingContact}
                  style={{
                    padding: '12px 28px',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(18, 48, 74, 0.2)'
                  }}
                >
                  {savingContact ? 'Saving Changes...' : 'Save All Contact Information'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: WEBSITE LOGO & BRANDING */}
        {activeTab === 'branding' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '2rem' }}>
            {/* Header info banner */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(244, 163, 64, 0.15)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={26} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 4px 0' }}>
                    Website Logo & Brand Identity
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
                    Upload and manage the official brand logo displayed across the header, footer, invoices, and mobile navigation.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleResetLogo}
                  disabled={savingBranding || uploadingLogo}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    color: '#4B5563',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RotateCcw size={15} />
                  <span>Reset to Default</span>
                </button>

                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ExternalLink size={15} />
                  <span>Preview Live Website</span>
                </a>
              </div>
            </div>

            {/* Interactive Live Previews */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1F2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} color="var(--color-secondary)" />
                <span>Live Logo Previews</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {/* Preview 1: Header / Light Surface View */}
                <div style={{ border: '1.5px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>
                      ☀️ Light Header View (Sticky Navigation)
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', backgroundColor: '#E5E7EB', padding: '2px 8px', borderRadius: '10px' }}>
                      Height: {brandingSettings.logo_height || 120}px
                    </span>
                  </div>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '24px 20px', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={brandingSettings.logo_url || '/logoo.png'}
                      alt="Primary Logo Preview"
                      style={{
                        height: `${brandingSettings.logo_height || 120}px`,
                        maxWidth: '100%',
                        objectFit: 'contain',
                        display: 'block'
                      }}
                      onError={(e) => { e.target.src = '/logoo.png'; }}
                    />
                  </div>
                  <div style={{ backgroundColor: '#F9FAFB', padding: '10px 16px', borderTop: '1px solid #E5E7EB', fontSize: '0.78rem', color: '#6B7280' }}>
                    Used on white header, light cards, booking documents & emails.
                  </div>
                </div>

                {/* Preview 2: Dark / Navy Footer View */}
                <div style={{ border: '1.5px solid #102A42', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#0B1E30', borderBottom: '1px solid #1E3A5F', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F4A340' }}>
                      🌙 Dark Navy Footer & Hero View
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#E2E8F0', backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                      Transparent Blend
                    </span>
                  </div>
                  <div style={{ background: 'linear-gradient(180deg, #12304A 0%, #0A1E30 100%)', padding: '24px 20px', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={brandingSettings.logo_white_url || brandingSettings.logo_url || '/logo-white.png'}
                      alt="White/Footer Logo Preview"
                      style={{
                        height: `${Math.min(brandingSettings.logo_height || 120, 110)}px`,
                        maxWidth: '100%',
                        objectFit: 'contain',
                        display: 'block'
                      }}
                      onError={(e) => { e.target.src = '/logo-white.png'; }}
                    />
                  </div>
                  <div style={{ backgroundColor: '#0B1E30', padding: '10px 16px', borderTop: '1px solid #1E3A5F', fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>
                    Used on deep navy footer and homepage transparent hero banner.
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Upload & Sizing Controls Card */}
            <form onSubmit={handleSaveBranding} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                
                {/* 1. Primary Logo Uploader */}
                <div style={{ backgroundColor: '#F8FAFC', border: '1.5px dashed #CBD5E1', borderRadius: '12px', padding: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                    1. Upload Primary Logo (Main Header & Pages)
                  </label>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 1rem 0' }}>
                    Recommended: PNG with transparent background, SVG, or WebP.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '1.5rem',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '10px',
                        cursor: uploadingLogo ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*,.svg,.png,.webp,.jpg,.jpeg"
                        disabled={uploadingLogo}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoUpload(file, 'main');
                        }}
                        style={{ display: 'none' }}
                      />
                      <UploadCloud size={30} color={uploadingLogo ? '#94A3B8' : 'var(--color-secondary)'} />
                      <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>
                        {uploadingLogo ? 'Uploading & Applying...' : 'Click or Drag to Upload Primary Logo'}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Supports PNG, SVG, WebP, JPG (Max 10MB)
                      </span>
                    </label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        value={brandingSettings.logo_url || ''}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, logo_url: e.target.value })}
                        placeholder="/uploads/... or https://..."
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', color: '#334155' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. White / Footer Logo Uploader */}
                <div style={{ backgroundColor: '#F8FAFC', border: '1.5px dashed #CBD5E1', borderRadius: '12px', padding: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                    2. Upload Light / White Logo (Footer & Hero Banner)
                  </label>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 1rem 0' }}>
                    White/gold version designed for dark backgrounds. If not uploaded, the primary logo is used.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '1.5rem',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '10px',
                        cursor: uploadingWhiteLogo ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*,.svg,.png,.webp,.jpg,.jpeg"
                        disabled={uploadingWhiteLogo}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoUpload(file, 'white');
                        }}
                        style={{ display: 'none' }}
                      />
                      <UploadCloud size={30} color={uploadingWhiteLogo ? '#94A3B8' : '#D97706'} />
                      <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>
                        {uploadingWhiteLogo ? 'Uploading Light Logo...' : 'Click or Drag to Upload Light/White Logo'}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Transparent PNG with white/gold lettering recommended
                      </span>
                    </label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        value={brandingSettings.logo_white_url || ''}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, logo_white_url: e.target.value })}
                        placeholder="/uploads/... or https://..."
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', color: '#334155' }}
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Logo Sizing & Brand Attributes */}
              <div style={{ backgroundColor: '#F1F5F9', borderRadius: '12px', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>
                      Header Logo Height (Desktop)
                    </label>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)', backgroundColor: '#FFFFFF', padding: '3px 10px', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                      {brandingSettings.logo_height || 120} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="220"
                    step="5"
                    value={brandingSettings.logo_height || 120}
                    onChange={(e) => setBrandingSettings({ ...brandingSettings, logo_height: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginTop: '4px' }}>
                    <span>Compact (60px)</span>
                    <span>Standard (120px)</span>
                    <span>Large (160px)</span>
                    <span>Hero (220px)</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
                    Brand Logo Accessibility Alt Text
                  </label>
                  <input
                    type="text"
                    value={brandingSettings.logo_alt || ''}
                    onChange={(e) => setBrandingSettings({ ...brandingSettings, logo_alt: e.target.value })}
                    placeholder="Journey Architect"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                    Screen readers and search engines read this text.
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E5E7EB', paddingTop: '1.25rem' }}>
                <button
                  type="submit"
                  disabled={savingBranding || uploadingLogo || uploadingWhiteLogo}
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    padding: '12px 28px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(18, 48, 74, 0.2)'
                  }}
                >
                  <Check size={18} />
                  <span>{savingBranding ? 'Saving Settings...' : 'Save & Apply Brand Settings'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: BOOKINGS & LEADS */}
        {activeTab === 'bookings' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                  Customer Bookings & Trip Enquiries
                </h2>
                <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                  Manage customer inquiries, view voucher PDFs, and log manual payments.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'All Records' },
                  { id: 'PENDING_PAYMENT', label: 'New Enquiries / Leads' },
                  { id: 'CONFIRMED', label: 'Confirmed Bookings' },
                  { id: 'COMPLETED', label: 'Completed' },
                  { id: 'CANCELLED', label: 'Cancelled' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBookingFilter(item.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      border: '1px solid #D1D5DB',
                      backgroundColor: bookingFilter === item.id ? 'var(--color-primary)' : '#FFFFFF',
                      color: bookingFilter === item.id ? '#FFFFFF' : '#374151',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB', color: '#374151' }}>
                    <th style={{ padding: '12px' }}>Booking ID</th>
                    <th style={{ padding: '12px' }}>Customer & Contact</th>
                    <th style={{ padding: '12px' }}>Package</th>
                    <th style={{ padding: '12px' }}>Travel Date</th>
                    <th style={{ padding: '12px' }}>Total Amount</th>
                    <th style={{ padding: '12px' }}>Paid / Due</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '12px' }}>
                        <strong style={{ color: 'var(--color-secondary)' }}>{b.booking_id}</strong>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <strong style={{ display: 'block', color: 'var(--color-primary)' }}>{b.customer_name}</strong>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                          <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>📞 {b.customer_phone}</span>
                          {(b.customer_whatsapp || b.whatsapp_number || b.customer_phone) && (
                            <a
                              href={`https://wa.me/${formatWhatsAppNumber(b.customer_whatsapp || b.whatsapp_number || b.customer_phone)}?text=${encodeURIComponent(`Hi ${b.customer_name}, greetings from Journey Architect regarding your booking ${b.booking_id}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#16A34A', fontWeight: 600, textDecoration: 'none' }}
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={12} /> {b.customer_whatsapp || b.whatsapp_number || b.customer_phone}
                            </a>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#374151' }}>{b.package_name}</td>
                      <td style={{ padding: '12px', color: '#374151' }}>{b.travel_date}</td>
                      <td style={{ padding: '12px', fontWeight: 700 }}>₹{Number(b.total_amount || 0).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ color: '#059669', fontWeight: 700 }}>₹{b.paid_amount}</span> / <span style={{ color: '#DC2626' }}>₹{b.remaining_amount}</span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: b.booking_status === 'CONFIRMED' ? '#D1FAE5' : b.booking_status === 'COMPLETED' ? '#DBEAFE' : '#FEF3C7',
                          color: b.booking_status === 'CONFIRMED' ? '#065F46' : b.booking_status === 'COMPLETED' ? '#1E40AF' : '#92400E'
                        }}>
                          {b.booking_status === 'PENDING_PAYMENT' ? 'New Enquiry' : b.booking_status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => openWhatsAppInvoice(b)}
                            title="Send Invoice on WhatsApp directly to customer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              backgroundColor: '#25D366',
                              color: '#FFFFFF',
                              border: 'none',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              boxShadow: '0 1px 3px rgba(37,211,102,0.25)',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <MessageCircle size={13} />
                            <span>WhatsApp Invoice</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(b)}
                            style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', border: 'none', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: '#6B7280' }}>
                        No tour bookings found for the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CUISINE MENU MANAGEMENT */}
        {activeTab === 'cuisines' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UtensilsCrossed size={22} color="var(--color-secondary)" />
                  Cuisine We Serve — Menu Gallery
                </h2>
                <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                  Manage dishes across Indian, Chinese, Italian, and Indo-Chinese categories displayed on the Catering Services page.
                </span>
              </div>
              <button
                type="button"
                onClick={handleOpenNewCuisineModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-secondary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(22, 124, 128, 0.25)'
                }}
              >
                <Plus size={18} /> Add New Dish
              </button>
            </div>

            {/* Filter Pills & Search */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'All Cuisines', count: cuisines.length },
                  { id: 'Indian', label: 'Indian', count: cuisines.filter(c => isCuisineCategoryMatch(c.category, 'Indian')).length },
                  { id: 'Tandoor', label: 'Tandoor', count: cuisines.filter(c => isCuisineCategoryMatch(c.category, 'Tandoor')).length },
                  { id: 'Bengali authentic cuisine', label: 'Bengali authentic cuisine', count: cuisines.filter(c => isCuisineCategoryMatch(c.category, 'Bengali authentic cuisine')).length },
                  { id: 'South Indian', label: 'South Indian', count: cuisines.filter(c => isCuisineCategoryMatch(c.category, 'South Indian')).length },
                  { id: 'Indo-Chinese', label: 'Indo chinese', count: cuisines.filter(c => isCuisineCategoryMatch(c.category, 'Indo-Chinese')).length },
                  { id: 'Continental', label: 'Continental', count: cuisines.filter(c => isCuisineCategoryMatch(c.category, 'Continental')).length },
                  { id: 'Italian', label: 'Italian', count: cuisines.filter(c => isCuisineCategoryMatch(c.category, 'Italian')).length },
                  { id: 'Chinese', label: 'Chinese', count: cuisines.filter(c => isCuisineCategoryMatch(c.category, 'Chinese')).length }
                ].map((item) => {
                  const isSel = cuisineCategoryFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCuisineCategoryFilter(item.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: isSel ? 700 : 500,
                        backgroundColor: isSel ? 'var(--color-primary)' : '#F3F4F6',
                        color: isSel ? '#FFFFFF' : '#374151',
                        border: '1px solid',
                        borderColor: isSel ? 'var(--color-primary)' : '#E5E7EB',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{item.label}</span>
                      <span style={{
                        fontSize: '0.72rem',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        backgroundColor: isSel ? 'rgba(255,255,255,0.25)' : '#E5E7EB',
                        color: isSel ? '#FFFFFF' : '#4B5563'
                      }}>
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', minWidth: '260px' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type="text"
                  placeholder="Search dishes by name, description..."
                  value={cuisineSearch}
                  onChange={(e) => setCuisineSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.85rem'
                  }}
                />
                {cuisineSearch && (
                  <button
                    type="button"
                    onClick={() => setCuisineSearch('')}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '0.9rem' }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Dishes Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB', color: '#4B5563', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 14px' }}>Dish / Image</th>
                    <th style={{ padding: '12px 14px' }}>Category</th>
                    <th style={{ padding: '12px 14px' }}>Description</th>
                    <th style={{ padding: '12px 14px' }}>Diet & Highlights</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Display Order</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Live Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cuisines
                    .filter((dish) => {
                      if (cuisineCategoryFilter !== 'ALL' && !isCuisineCategoryMatch(dish.category, cuisineCategoryFilter)) return false;
                      if (!cuisineSearch) return true;
                      const q = cuisineSearch.toLowerCase();
                      return (
                        dish.name?.toLowerCase().includes(q) ||
                        dish.description?.toLowerCase().includes(q) ||
                        dish.category?.toLowerCase().includes(q) ||
                        dish.price_indicator?.toLowerCase().includes(q)
                      );
                    })
                    .map((dish) => {
                      const getAdminCuisineBadge = (cat) => {
                        const c = (cat || '').toLowerCase();
                        if (c.includes('bengali')) return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' };
                        if (c.includes('tandoor')) return { bg: '#FFEDD5', text: '#C2410C', border: '#FED7AA' };
                        if (c.includes('south')) return { bg: '#FEF9C3', text: '#A16207', border: '#FEF08A' };
                        if (c.includes('continental')) return { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' };
                        if (c.includes('indo')) return { bg: '#FAF5FF', text: '#7E22CE', border: '#F3E8FF' };
                        if (c.includes('chinese')) return { bg: '#FEF2F2', text: '#B91C1C', border: '#FEE2E2' };
                        if (c.includes('italian')) return { bg: '#FDF2F8', text: '#BE185D', border: '#FCE7F3' };
                        if (c.includes('indian')) return { bg: '#FFF7ED', text: '#C2410C', border: '#FFEDD5' };
                        return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' };
                      };
                      const col = getAdminCuisineBadge(dish.category);

                      return (
                        <tr key={dish.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#0E2235', border: '1px solid #E5E7EB' }}>
                                <img
                                  src={dish.image_url}
                                  alt={dish.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80'; }}
                                />
                                <span style={{
                                  position: 'absolute',
                                  top: '4px',
                                  right: '4px',
                                  width: '9px',
                                  height: '9px',
                                  borderRadius: '50%',
                                  backgroundColor: dish.diet_type === 'veg' || dish.diet_type === 'vegan' ? '#16A34A' : '#DC2626',
                                  border: '1.5px solid #FFFFFF'
                                }} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem' }}>{dish.name}</div>
                                <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontFamily: 'monospace' }}>ID: {dish.dish_id || dish.id}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: col.bg,
                              color: col.text,
                              border: `1px solid ${col.border}`
                            }}>
                              {dish.category}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', maxWidth: '300px', color: '#4B5563', fontSize: '0.82rem', lineHeight: '1.4' }}>
                            <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {dish.description}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', textTransform: 'capitalize' }}>
                                {dish.diet_type === 'veg' ? '🌱 Vegetarian' : dish.diet_type === 'vegan' ? '🌿 100% Vegan' : '🍖 Non-Veg'}
                              </span>
                              {dish.price_indicator && (
                                <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
                                  ★ {dish.price_indicator}
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600, color: '#6B7280' }}>
                            {dish.display_order ?? 0}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleCuisineStatus(dish.id, dish.is_active)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: dish.is_active === 1 || dish.is_active === true ? '#D1FAE5' : '#FEE2E2',
                                color: dish.is_active === 1 || dish.is_active === true ? '#065F46' : '#991B1B'
                              }}
                              title="Click to toggle live display on Catering Services page"
                            >
                              {dish.is_active === 1 || dish.is_active === true ? '● Live on Site' : '○ Hidden'}
                            </button>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditCuisineModal(dish)}
                                title="Edit Dish"
                                style={{
                                  padding: '6px',
                                  borderRadius: '6px',
                                  backgroundColor: '#EEF2FF',
                                  color: '#4F46E5',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCuisine(dish)}
                                title="Delete Dish"
                                style={{
                                  padding: '6px',
                                  borderRadius: '6px',
                                  backgroundColor: '#FEE2E2',
                                  color: '#DC2626',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  {cuisines.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
                        No cuisine dishes found. Click "+ Add New Dish" above to add your first catering dish.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CATERING LEADS */}
        {activeTab === 'catering' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Utensils size={22} color="var(--color-secondary)" />
                  Catering Service Enquiries & Leads
                </h2>
                <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                  Manage catering requests for weddings, parties, corporate events, and gatherings.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'All Enquiries' },
                  { id: 'NEW', label: 'New' },
                  { id: 'CONTACTED', label: 'Contacted' },
                  { id: 'CONFIRMED', label: 'Confirmed' },
                  { id: 'COMPLETED', label: 'Completed' },
                  { id: 'CANCELLED', label: 'Cancelled' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCateringFilter(item.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      border: '1px solid #D1D5DB',
                      backgroundColor: cateringFilter === item.id ? 'var(--color-primary)' : '#FFFFFF',
                      color: cateringFilter === item.id ? '#FFFFFF' : '#374151',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div style={{ marginBottom: '1.25rem', maxWidth: '360px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search catering leads by name, phone, venue..."
                  value={cateringSearch}
                  onChange={(e) => setCateringSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB', color: '#374151' }}>
                    <th style={{ padding: '12px' }}>Lead ID</th>
                    <th style={{ padding: '12px' }}>Customer & Contact</th>
                    <th style={{ padding: '12px' }}>Event Date & Type</th>
                    <th style={{ padding: '12px' }}>Guests</th>
                    <th style={{ padding: '12px' }}>Location</th>
                    <th style={{ padding: '12px' }}>Menu Preference</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cateringLeads
                    .filter(lead => {
                      if (!cateringSearch) return true;
                      const q = cateringSearch.toLowerCase();
                      return (
                        lead.lead_id?.toLowerCase().includes(q) ||
                        lead.name?.toLowerCase().includes(q) ||
                        lead.phone?.includes(q) ||
                        lead.whatsapp_number?.includes(q) ||
                        lead.event_location?.toLowerCase().includes(q) ||
                        lead.event_type?.toLowerCase().includes(q)
                      );
                    })
                    .map((lead) => {
                      const whatsappNum = lead.whatsapp_number || lead.phone;
                      return (
                        <tr key={lead.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                          <td style={{ padding: '12px' }}>
                            <strong style={{ color: 'var(--color-secondary)' }}>{lead.lead_id}</strong>
                            <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{lead.created_at?.slice(0, 10)}</div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <strong style={{ display: 'block', color: 'var(--color-primary)' }}>{lead.name}</strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>📞 {lead.phone}</span>
                              {whatsappNum && (
                                <a
                                  href={`https://wa.me/${formatWhatsAppNumber(whatsappNum)}?text=${encodeURIComponent(`Hi ${lead.name}, thank you for contacting Journey Architect Catering regarding your ${lead.event_type || 'event'} enquiry (${lead.lead_id}). How can we assist you?`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#16A34A', fontWeight: 600, textDecoration: 'none' }}
                                  title="Chat on WhatsApp"
                                >
                                  <MessageCircle size={12} /> {whatsappNum}
                                </a>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '12px', color: '#374151' }}>
                            <div style={{ fontWeight: 600 }}>{lead.event_type || 'Event'}</div>
                            <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>📅 {lead.event_date || 'Flexible'}</div>
                          </td>
                          <td style={{ padding: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
                            👥 {lead.guest_count}
                          </td>
                          <td style={{ padding: '12px', color: '#4B5563', maxWidth: '180px' }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={lead.event_location}>
                              📍 {lead.event_location || 'Not specified'}
                            </div>
                          </td>
                          <td style={{ padding: '12px', fontSize: '0.8rem', color: '#374151' }}>
                            <div>{lead.food_preference || 'Standard'}</div>
                            <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{lead.meal_type}</span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateCateringStatus(lead.lead_id, e.target.value)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                border: '1px solid #D1D5DB',
                                backgroundColor:
                                  lead.status === 'CONFIRMED' ? '#D1FAE5' :
                                  lead.status === 'COMPLETED' ? '#DBEAFE' :
                                  lead.status === 'CONTACTED' ? '#FEF3C7' :
                                  lead.status === 'CANCELLED' ? '#FEE2E2' : '#F3F4F6',
                                color:
                                  lead.status === 'CONFIRMED' ? '#065F46' :
                                  lead.status === 'COMPLETED' ? '#1E40AF' :
                                  lead.status === 'CONTACTED' ? '#92400E' :
                                  lead.status === 'CANCELLED' ? '#991B1B' : '#374151',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="NEW">New</option>
                              <option value="CONTACTED">Contacted</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                              <a
                                href={`https://wa.me/${formatWhatsAppNumber(whatsappNum)}?text=${encodeURIComponent(`Hi ${lead.name}, greetings from Journey Architect Catering Services regarding your enquiry (${lead.lead_id}). Let us know if you would like custom menu suggestions.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: '#25D366',
                                  color: '#FFFFFF',
                                  textDecoration: 'none',
                                  fontWeight: 700,
                                  fontSize: '0.75rem'
                                }}
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle size={13} /> Chat
                              </a>
                              <button
                                type="button"
                                onClick={() => setSelectedCateringLead(lead)}
                                style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', border: 'none', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
                              >
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCateringLead(lead.lead_id)}
                                title="Delete Lead"
                                style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  {cateringLeads.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: '#6B7280' }}>
                        No catering enquiries found. New enquiries submitted on the website will appear here in real-time.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CAR RENTAL LEADS */}
        {activeTab === 'car-rental' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Car size={22} color="var(--color-secondary)" />
                  Car Rental Enquiries & Fleet Leads
                </h2>
                <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                  Manage car and cab rental inquiries for local, outstation, airport transfers, and events.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'All Enquiries' },
                  { id: 'NEW', label: 'New' },
                  { id: 'CONTACTED', label: 'Contacted' },
                  { id: 'CONFIRMED', label: 'Confirmed' },
                  { id: 'COMPLETED', label: 'Completed' },
                  { id: 'CANCELLED', label: 'Cancelled' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCarRentalFilter(item.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      border: '1px solid #D1D5DB',
                      backgroundColor: carRentalFilter === item.id ? 'var(--color-primary)' : '#FFFFFF',
                      color: carRentalFilter === item.id ? '#FFFFFF' : '#374151',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div style={{ marginBottom: '1.25rem', maxWidth: '360px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search rental leads by name, phone, route, car..."
                  value={carRentalSearch}
                  onChange={(e) => setCarRentalSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB', color: '#374151' }}>
                    <th style={{ padding: '12px' }}>Lead ID</th>
                    <th style={{ padding: '12px' }}>Customer & Contact</th>
                    <th style={{ padding: '12px' }}>Travel Date & Trip</th>
                    <th style={{ padding: '12px' }}>Route (Pickup ➔ Drop)</th>
                    <th style={{ padding: '12px' }}>Vehicle & Passengers</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {carRentalLeads
                    .filter(lead => {
                      if (!carRentalSearch) return true;
                      const q = carRentalSearch.toLowerCase();
                      return (
                        lead.lead_id?.toLowerCase().includes(q) ||
                        lead.name?.toLowerCase().includes(q) ||
                        lead.phone?.includes(q) ||
                        lead.whatsapp_number?.includes(q) ||
                        lead.pickup_location?.toLowerCase().includes(q) ||
                        lead.dropoff_location?.toLowerCase().includes(q) ||
                        lead.car_type?.toLowerCase().includes(q)
                      );
                    })
                    .map((lead) => {
                      const whatsappNum = lead.whatsapp_number || lead.phone;
                      return (
                        <tr key={lead.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                          <td style={{ padding: '12px' }}>
                            <strong style={{ color: 'var(--color-secondary)' }}>{lead.lead_id}</strong>
                            <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{lead.created_at?.slice(0, 10)}</div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <strong style={{ display: 'block', color: 'var(--color-primary)' }}>{lead.name}</strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>📞 {lead.phone}</span>
                              {whatsappNum && (
                                <a
                                  href={`https://wa.me/${formatWhatsAppNumber(whatsappNum)}?text=${encodeURIComponent(`Hi ${lead.name}, thank you for contacting Journey Architect Car Rental regarding your trip from ${lead.pickup_location || 'your location'} (${lead.lead_id}). How can we assist you?`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#16A34A', fontWeight: 600, textDecoration: 'none' }}
                                  title="Chat on WhatsApp"
                                >
                                  <MessageCircle size={12} /> {whatsappNum}
                                </a>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '12px', color: '#374151' }}>
                            <div style={{ fontWeight: 600 }}>{lead.trip_type || 'Car Rental'}</div>
                            <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>📅 {lead.travel_date}</div>
                            {lead.return_date && <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Return: {lead.return_date}</div>}
                          </td>
                          <td style={{ padding: '12px', color: '#4B5563', maxWidth: '200px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{lead.pickup_location || 'N/A'}</div>
                            <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>➔ {lead.dropoff_location || 'Local / Sightseeing'}</div>
                          </td>
                          <td style={{ padding: '12px', fontSize: '0.8rem', color: '#374151' }}>
                            <div style={{ fontWeight: 700 }}>🚗 {lead.car_type || 'Standard Cab'}</div>
                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>👥 {lead.passengers || 1} passenger(s)</span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateCarRentalStatus(lead.lead_id, e.target.value)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                border: '1px solid #D1D5DB',
                                backgroundColor:
                                  lead.status === 'CONFIRMED' ? '#D1FAE5' :
                                  lead.status === 'COMPLETED' ? '#DBEAFE' :
                                  lead.status === 'CONTACTED' ? '#FEF3C7' :
                                  lead.status === 'CANCELLED' ? '#FEE2E2' : '#F3F4F6',
                                color:
                                  lead.status === 'CONFIRMED' ? '#065F46' :
                                  lead.status === 'COMPLETED' ? '#1E40AF' :
                                  lead.status === 'CONTACTED' ? '#92400E' :
                                  lead.status === 'CANCELLED' ? '#991B1B' : '#374151',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="NEW">New</option>
                              <option value="CONTACTED">Contacted</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                              <a
                                href={`https://wa.me/${formatWhatsAppNumber(whatsappNum)}?text=${encodeURIComponent(`Hi ${lead.name}, greetings from Journey Architect Car Rental regarding your enquiry (${lead.lead_id}) for ${lead.car_type || 'a vehicle'} on ${lead.travel_date}. We have sanitized vehicles and experienced drivers ready.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: '#25D366',
                                  color: '#FFFFFF',
                                  textDecoration: 'none',
                                  fontWeight: 700,
                                  fontSize: '0.75rem'
                                }}
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle size={13} /> Chat
                              </a>
                              <button
                                type="button"
                                onClick={() => setSelectedCarRentalLead(lead)}
                                style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', border: 'none', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
                              >
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCarRentalLead(lead.lead_id)}
                                title="Delete Lead"
                                style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  {carRentalLeads.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: '#6B7280' }}>
                        No car rental enquiries found. New enquiries submitted on the website will appear here in real-time.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: PAYMENTS */}
        {activeTab === 'payments' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 1rem 0' }}>
              Payment Transaction Records
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                    <th style={{ padding: '12px' }}>Reference</th>
                    <th style={{ padding: '12px' }}>Booking ID</th>
                    <th style={{ padding: '12px' }}>Customer</th>
                    <th style={{ padding: '12px' }}>Amount</th>
                    <th style={{ padding: '12px' }}>Method</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.payment_reference}</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{p.booking_id}</td>
                      <td style={{ padding: '12px' }}>{p.customer_name} ({p.customer_phone})</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#059669' }}>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px', textTransform: 'uppercase', fontSize: '0.75rem' }}>{p.payment_method}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: p.status === 'SUCCESS' ? '#D1FAE5' : '#FEE2E2', color: p.status === 'SUCCESS' ? '#065F46' : '#991B1B' }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.8rem', color: '#6B7280' }}>{p.paid_at || p.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 1rem 0' }}>
              System Activity & Audit Logs
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {auditLogs.map((log) => (
                <div key={log.id} style={{ padding: '10px 14px', backgroundColor: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                  <div>
                    <strong style={{ color: 'var(--color-primary)', marginRight: '8px' }}>[{log.action}]</strong>
                    <span>{log.details}</span>
                  </div>
                  <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>{log.created_at}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      </div>

      {/* ================= MODAL: ADD / EDIT TOUR PACKAGE ================= */}
      {isPackageModalOpen && (
        <div
          onClick={() => setIsPackageModalOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(14, 34, 53, 0.75)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', overflowY: 'auto' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: '860px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)', margin: 'auto' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                {editingPackage ? `Edit Tour Package: ${editingPackage.name}` : 'Add New Tour Package'}
              </h2>
              <button type="button" onClick={() => setIsPackageModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSavePackage} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Row 1: Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Package Name *</label>
                  <input
                    type="text"
                    required
                    value={packageForm.name}
                    onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                    placeholder="e.g. Darjeeling & Kalimpong Retreat"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Destination Region *</label>
                  <input
                    type="text"
                    required
                    value={packageForm.destination}
                    onChange={(e) => setPackageForm({ ...packageForm, destination: e.target.value })}
                    placeholder="e.g. Darjeeling, West Bengal"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Category</label>
                  <select
                    value={packageForm.tour_category}
                    onChange={(e) => setPackageForm({ ...packageForm, tour_category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  >
                    <option value="long-distance">Long distance</option>
                    <option value="weekend">Weekend</option>
                    <option value="day-trip">Day Trip</option>
                    <option value="picnic">Get togethor / Picnic</option>
                    <option value="upcoming">Upcomeing</option>
                    <option value="mountains">Mountains & Hills</option>
                    <option value="nature">Nature & Wildlife</option>
                    <option value="coastal">Coastal & Sea</option>
                    <option value="heritage">Heritage & Pilgrimage</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Duration, Pricing, Availability & Start Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Days</label>
                  <input
                    type="number"
                    min="1"
                    value={packageForm.duration_days}
                    onChange={(e) => setPackageForm({ ...packageForm, duration_days: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Nights</label>
                  <input
                    type="number"
                    min="0"
                    value={packageForm.duration_nights}
                    onChange={(e) => setPackageForm({ ...packageForm, duration_nights: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Total Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={packageForm.total_price}
                    onChange={(e) => setPackageForm({ ...packageForm, total_price: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Booking / Advance (₹)</label>
                  <input
                    type="number"
                    value={packageForm.booking_amount}
                    onChange={(e) => setPackageForm({ ...packageForm, booking_amount: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Availability</label>
                  <select
                    value={packageForm.availability_status}
                    onChange={(e) => setPackageForm({ ...packageForm, availability_status: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  >
                    <option value="available">Available (Booking Open)</option>
                    <option value="temporarily_unavailable">Temporarily Unavailable</option>
                    <option value="sold_out">Sold Out</option>
                  </select>
                </div>
              </div>

              {/* Row 2.5: Interactive Tour Calendar & Departure Schedule */}
              <div style={{ padding: '14px 16px', backgroundColor: '#F0FDF4', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} />
                    <span>Tour Departure Calendar & Season Schedule *</span>
                  </label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + ((7 - d.getDay() + 5) % 7 || 7)); // Next Friday
                        const startStr = d.toISOString().split('T')[0];
                        const endD = new Date(d);
                        endD.setDate(endD.getDate() + (parseInt(packageForm.duration_days, 10) || 4));
                        const endStr = endD.toISOString().split('T')[0];
                        setPackageForm({ ...packageForm, start_date: startStr, end_date: endStr });
                      }}
                      style={{ padding: '3px 8px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      ⚡ Next Friday
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setMonth(d.getMonth() + 1, 1); // 1st of next month
                        const startStr = d.toISOString().split('T')[0];
                        const endD = new Date(d);
                        endD.setDate(endD.getDate() + (parseInt(packageForm.duration_days, 10) || 4));
                        const endStr = endD.toISOString().split('T')[0];
                        setPackageForm({ ...packageForm, start_date: startStr, end_date: endStr });
                      }}
                      style={{ padding: '3px 8px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      ⚡ Next Month 1st
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPackageForm({ ...packageForm, start_date: 'Every Friday & Custom Dates', end_date: 'Year-Round Validity' });
                      }}
                      style={{ padding: '3px 8px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#E0E7FF', color: '#3730A3', border: '1px solid #C7D2FE', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      🔄 Recurring (Every Friday)
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>
                      📅 Tour Start Date (Calendar Pick / Text)
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        value={packageForm.start_date || ''}
                        onChange={(e) => setPackageForm({ ...packageForm, start_date: e.target.value })}
                        placeholder="YYYY-MM-DD or Schedule"
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #86EFAC', backgroundColor: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600 }}
                      />
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          if (e.target.value) {
                            const startStr = e.target.value;
                            const d = new Date(startStr);
                            d.setDate(d.getDate() + (parseInt(packageForm.duration_days, 10) || 4));
                            const endStr = d.toISOString().split('T')[0];
                            setPackageForm({ ...packageForm, start_date: startStr, end_date: endStr });
                          }
                        }}
                        style={{ width: '42px', padding: '6px', borderRadius: '6px', border: '1px solid #86EFAC', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                        title="Open interactive calendar"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>
                      🏁 Tour End Date (Auto-calculated / Text)
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        value={packageForm.end_date || ''}
                        onChange={(e) => setPackageForm({ ...packageForm, end_date: e.target.value })}
                        placeholder="YYYY-MM-DD or Validity"
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #86EFAC', backgroundColor: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600 }}
                      />
                      <input
                        type="date"
                        min={packageForm.start_date && !isNaN(Date.parse(packageForm.start_date)) ? packageForm.start_date : new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          if (e.target.value) {
                            setPackageForm({ ...packageForm, end_date: e.target.value });
                          }
                        }}
                        style={{ width: '42px', padding: '6px', borderRadius: '6px', border: '1px solid #86EFAC', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                        title="Open interactive calendar"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Images with Direct File Upload & Live Visual Previews */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <MediaUploadField
                  label="Thumbnail Image"
                  sublabel="Card Photo (16:10 Ratio)"
                  value={packageForm.thumbnail}
                  onChange={(url) => setPackageForm({ ...packageForm, thumbnail: url })}
                  token={token}
                  placeholder="https://... or click Upload File"
                />

                <MediaUploadField
                  label="Hero / Featured Image"
                  sublabel="Banner Header Cover"
                  value={packageForm.featured_image}
                  onChange={(url) => setPackageForm({ ...packageForm, featured_image: url })}
                  token={token}
                  placeholder="https://... or click Upload File"
                />
              </div>

              {/* Package Gallery Images Section (Carousel / Slider) */}
              <div style={{ border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#F8FAFC' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ImageIcon size={18} color="var(--color-secondary)" />
                      <span>📸 Package Photo Gallery ({(packageForm.gallery_images || []).length} Photos)</span>
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      These photos are shown on the website in the package detail page slider and gallery carousel.
                    </span>
                  </div>

                  {/* Multi-Upload Button */}
                  <label style={{
                    padding: '8px 16px',
                    backgroundColor: uploadingPackageGallery ? '#9CA3AF' : '#059669',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: uploadingPackageGallery ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 4px rgba(5,150,105,0.2)'
                  }}>
                    {uploadingPackageGallery ? (
                      <>
                        <span style={{ width: '12px', height: '12px', border: '2px solid #FFF', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={16} />
                        <span>+ Upload Photos</span>
                      </>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={uploadingPackageGallery}
                      style={{ display: 'none' }}
                      onChange={handleUploadPackageGalleryImages}
                    />
                  </label>
                </div>

                {/* Add Photo by URL */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                  <input
                    type="url"
                    placeholder="Or paste direct image URL (https://...)"
                    value={newGalleryImageUrl}
                    onChange={(e) => setNewGalleryImageUrl(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newGalleryImageUrl.trim()) return;
                      setPackageForm({
                        ...packageForm,
                        gallery_images: [...(packageForm.gallery_images || []), newGalleryImageUrl.trim()]
                      });
                      setNewGalleryImageUrl('');
                    }}
                    style={{ padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add URL
                  </button>
                </div>

                {/* Gallery Thumbnails Grid */}
                {(packageForm.gallery_images || []).length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                    {packageForm.gallery_images.map((imgUrl, gIdx) => (
                      <div
                        key={gIdx}
                        style={{
                          position: 'relative',
                          height: '95px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1.5px solid #E2E8F0',
                          backgroundColor: '#0E2235'
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery ${gIdx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=300&q=80'; }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = packageForm.gallery_images.filter((_, i) => i !== gIdx);
                            setPackageForm({ ...packageForm, gallery_images: updated });
                          }}
                          title="Delete photo"
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: 'rgba(239, 68, 68, 0.92)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                          }}
                        >
                          <X size={14} />
                        </button>
                        <span style={{ position: 'absolute', bottom: '4px', left: '4px', backgroundColor: 'rgba(0,0,0,0.65)', color: '#FFF', fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                          #{gIdx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1.5rem', border: '1.5px dashed #CBD5E1', borderRadius: '8px', color: '#64748B', fontSize: '0.85rem', backgroundColor: '#FFFFFF' }}>
                    No gallery images added yet. Click <strong>+ Upload Photos</strong> to select pictures from your device or paste a URL.
                  </div>
                )}
              </div>

              {/* Descriptions */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Short Tagline / Summary</label>
                <input
                  type="text"
                  value={packageForm.short_description}
                  onChange={(e) => setPackageForm({ ...packageForm, short_description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Full Package Description</label>
                <textarea
                  rows="3"
                  value={packageForm.description}
                  onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                />
              </div>

              {/* Hotel, Transport, Meals */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Hotel / Stay Details</label>
                  <input
                    type="text"
                    value={packageForm.hotel_info || ''}
                    onChange={(e) => setPackageForm({ ...packageForm, hotel_info: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Vehicle / Transport Details</label>
                  <input
                    type="text"
                    value={packageForm.transport_info || ''}
                    onChange={(e) => setPackageForm({ ...packageForm, transport_info: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Meal Inclusions</label>
                  <input
                    type="text"
                    value={packageForm.meals_info || ''}
                    onChange={(e) => setPackageForm({ ...packageForm, meals_info: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  />
                </div>
              </div>

              {/* Inclusions & Exclusions Manager */}
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1.25rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 4px 0' }}>
                    ✅ Package Inclusions & Exclusions
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                    Edit the exact list of what is included and excluded for this package. These display on the website package details page.
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {/* What's Included Card */}
                  <div style={{ backgroundColor: '#F0FDF4', borderRadius: '12px', border: '1.5px solid #86EFAC', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 800, fontSize: '0.95rem' }}>
                        <CheckCircle2 size={18} />
                        <span>What's Included ({(packageForm.inclusions || []).length})</span>
                      </div>
                    </div>

                    {/* Tags List */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '40px' }}>
                      {(packageForm.inclusions || []).map((inc, idx) => (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: '#DCFCE7',
                            color: '#15803D',
                            border: '1px solid #86EFAC',
                            borderRadius: '20px',
                            padding: '4px 10px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>✓ {inc}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveInclusion(idx)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803D', padding: 0, display: 'flex', alignItems: 'center', fontSize: '14px', lineHeight: 1 }}
                            title="Remove"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {(!packageForm.inclusions || packageForm.inclusions.length === 0) && (
                        <span style={{ fontSize: '0.8rem', color: '#9CA3AF', fontStyle: 'italic' }}>No inclusions added yet. Add below:</span>
                      )}
                    </div>

                    {/* Add New Inclusion Input */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="e.g. Daily Breakfast, Dedicated AC Cab..."
                        value={newInclusionInput}
                        onChange={(e) => setNewInclusionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newInclusionInput.trim()) {
                              handleAddInclusion(newInclusionInput);
                              setNewInclusionInput('');
                            }
                          }
                        }}
                        style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #86EFAC', fontSize: '0.85rem', backgroundColor: '#FFFFFF' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newInclusionInput.trim()) {
                            handleAddInclusion(newInclusionInput);
                            setNewInclusionInput('');
                          }
                        }}
                        style={{ padding: '7px 14px', backgroundColor: '#16A34A', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        + Add
                      </button>
                    </div>

                    {/* Quick Suggestions */}
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#65A30D', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Quick Suggestions:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {['Hotel Stay', 'Dedicated Cab', 'Daily Breakfast', 'Driver Allowances & Tolls', 'Sightseeing Permits', 'Airport/Station Transfers'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              if (!(packageForm.inclusions || []).includes(preset)) {
                                handleAddInclusion(preset);
                              }
                            }}
                            style={{
                              fontSize: '0.72rem',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #86EFAC',
                              color: '#15803D',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* What's Excluded Card */}
                  <div style={{ backgroundColor: '#FEF2F2', borderRadius: '12px', border: '1.5px solid #FCA5A5', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626', fontWeight: 800, fontSize: '0.95rem' }}>
                        <X size={18} />
                        <span>What's Excluded ({(packageForm.exclusions || []).length})</span>
                      </div>
                    </div>

                    {/* Tags List */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '40px' }}>
                      {(packageForm.exclusions || []).map((exc, idx) => (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: '#FEE2E2',
                            color: '#B91C1C',
                            border: '1px solid #FCA5A5',
                            borderRadius: '20px',
                            padding: '4px 10px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>✕ {exc}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExclusion(idx)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B91C1C', padding: 0, display: 'flex', alignItems: 'center', fontSize: '14px', lineHeight: 1 }}
                            title="Remove"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {(!packageForm.exclusions || packageForm.exclusions.length === 0) && (
                        <span style={{ fontSize: '0.8rem', color: '#9CA3AF', fontStyle: 'italic' }}>No exclusions added yet. Add below:</span>
                      )}
                    </div>

                    {/* Add New Exclusion Input */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="e.g. Train/Flight Tickets, Personal Expenses..."
                        value={newExclusionInput}
                        onChange={(e) => setNewExclusionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newExclusionInput.trim()) {
                              handleAddExclusion(newExclusionInput);
                              setNewExclusionInput('');
                            }
                          }
                        }}
                        style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #FCA5A5', fontSize: '0.85rem', backgroundColor: '#FFFFFF' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newExclusionInput.trim()) {
                            handleAddExclusion(newExclusionInput);
                            setNewExclusionInput('');
                          }
                        }}
                        style={{ padding: '7px 14px', backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        + Add
                      </button>
                    </div>

                    {/* Quick Suggestions */}
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Quick Suggestions:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {['Train/Flight Tickets', 'Personal Expenses', 'Monastery/Monument Entry Fees', 'Tips & Porter Charges', 'Lunch', 'Room Heater Charges'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              if (!(packageForm.exclusions || []).includes(preset)) {
                                handleAddExclusion(preset);
                              }
                            }}
                            style={{
                              fontSize: '0.72rem',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #FCA5A5',
                              color: '#B91C1C',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day-Wise Itinerary Builder */}
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                    📅 Day-Wise Itinerary Builder ({packageForm.itinerary?.length || 0} Days)
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddItineraryDay}
                    style={{ padding: '6px 12px', backgroundColor: 'var(--color-secondary)', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add Day
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {packageForm.itinerary?.map((dayItem, index) => (
                    <div key={index} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>Day {dayItem.day}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItineraryDay(index)}
                          style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Remove Day
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Day Title (e.g. Arrival & NJP Transfer)"
                        value={dayItem.title || ''}
                        onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                        style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #D1D5DB', fontWeight: 600 }}
                      />

                      <textarea
                        rows="2"
                        placeholder="Activities and sightseeing for this day..."
                        value={dayItem.activities || ''}
                        onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)}
                        style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Meals (e.g. Breakfast, Dinner)"
                          value={dayItem.meals || ''}
                          onChange={(e) => handleItineraryChange(index, 'meals', e.target.value)}
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #D1D5DB', fontSize: '0.8rem' }}
                        />
                        <input
                          type="text"
                          placeholder="Stay / Hotel (e.g. Darjeeling Homestay)"
                          value={dayItem.stay || ''}
                          onChange={(e) => handleItineraryChange(index, 'stay', e.target.value)}
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #D1D5DB', fontSize: '0.8rem' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Interactive Package Card Preview in Modal */}
              <div style={{ border: '1px solid #E0E7FF', backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '1.25rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Eye size={18} color="var(--color-primary)" />
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                      Frontend Website Card Preview
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#E0E7FF', color: '#3730A3', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    Live Simulated Render
                  </span>
                </div>

                {/* Simulated Tour Card Preview */}
                <div style={{ maxWidth: '420px', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 8px 24px rgba(18,48,74,0.1)' }}>
                  {/* Card Image Container */}
                  <div style={{ position: 'relative', height: '210px', backgroundColor: '#0E2235', overflow: 'hidden' }}>
                    <img
                      src={packageForm.thumbnail || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'; }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(14, 34, 53, 0.35) 0%, transparent 35%, rgba(14, 34, 53, 0.7) 100%)', pointerEvents: 'none' }} />
                    
                    {/* Top row */}
                    <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ backgroundColor: 'rgba(14, 34, 53, 0.88)', color: '#FFFFFF', padding: '3px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        {packageForm.tour_category || 'Mountains'}
                      </span>
                      <span style={{ backgroundColor: 'rgba(244, 163, 64, 0.95)', color: '#12304A', padding: '3px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>
                        🔥 Online Booking
                      </span>
                    </div>

                    {/* Bottom row */}
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: 'var(--color-primary)', padding: '3px 8px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <MapPin size={11} color="var(--color-secondary)" />
                        <span>{packageForm.destination || 'Destination'}</span>
                      </span>
                      <span style={{ backgroundColor: 'rgba(14, 34, 53, 0.85)', color: '#FFFFFF', padding: '3px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600 }}>
                        {packageForm.duration_days || 4}D / {packageForm.duration_nights || 3}N
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '1.25rem' }}>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)', display: 'block', marginBottom: '4px' }}>
                      {packageForm.name || 'Your Package Title'}
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      📅 Starts: {packageForm.start_date || 'Every Friday & Custom Dates'}
                    </span>
                    <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: '0 0 10px 0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {packageForm.short_description || packageForm.description || 'Package description and highlights...'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: '10px', marginTop: '6px' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase' }}>Package Price</span>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)' }}>₹{Number(packageForm.total_price || 0).toLocaleString('en-IN')}</div>
                      </div>
                      <span style={{ padding: '6px 14px', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                        Book (₹{packageForm.booking_amount || 0})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #E5E7EB', paddingTop: '1rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsPackageModalOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  {editingPackage ? 'Save Package Changes' : 'Publish Tour Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT GALLERY ITEM ================= */}
      {isGalleryModalOpen && (
        <div
          onClick={() => setIsGalleryModalOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(14, 34, 53, 0.75)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', overflowY: 'auto' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)', margin: 'auto' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                {editingGalleryItem ? 'Edit Gallery Media' : 'Add Photo / Video to Gallery'}
              </h2>
              <button type="button" onClick={() => setIsGalleryModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryItem} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Media Type Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>Media Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setGalleryForm({ ...galleryForm, media_type: 'image' })}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      border: galleryForm.media_type === 'image' ? '2px solid var(--color-primary)' : '1px solid #D1D5DB',
                      backgroundColor: galleryForm.media_type === 'image' ? '#EFF6FF' : '#FFFFFF',
                      color: galleryForm.media_type === 'image' ? 'var(--color-primary)' : '#4B5563',
                      cursor: 'pointer'
                    }}
                  >
                    <ImageIcon size={16} />
                    <span>Photo / Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalleryForm({ ...galleryForm, media_type: 'video' })}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      border: galleryForm.media_type === 'video' ? '2px solid #EF4444' : '1px solid #D1D5DB',
                      backgroundColor: galleryForm.media_type === 'video' ? '#FEF2F2' : '#FFFFFF',
                      color: galleryForm.media_type === 'video' ? '#DC2626' : '#4B5563',
                      cursor: 'pointer'
                    }}
                  >
                    <Video size={16} />
                    <span>Tour Video (MP4/Link)</span>
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Title *</label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="e.g. Sunset at Puri Golden Beach"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                />
              </div>

              <MediaUploadField
                label={galleryForm.media_type === 'video' ? 'Video File (MP4 / Direct Link) *' : 'Gallery Image (Photo) *'}
                sublabel={galleryForm.media_type === 'video' ? 'Select MP4 / WebM' : 'High Resolution Photo'}
                value={galleryForm.media_url}
                onChange={(url) => setGalleryForm({ ...galleryForm, media_url: url })}
                token={token}
                accept={galleryForm.media_type === 'video' ? 'video/mp4,video/webm,video/*' : 'image/*'}
                mediaType={galleryForm.media_type}
                placeholder={galleryForm.media_type === 'video' ? 'https://... or upload MP4 video' : 'https://... or upload photo'}
              />

              <MediaUploadField
                label="Poster / Thumbnail Image"
                sublabel="Cover Photo (for Video or Card Preview)"
                value={galleryForm.thumbnail_url}
                onChange={(url) => setGalleryForm({ ...galleryForm, thumbnail_url: url })}
                token={token}
                placeholder="https://... or upload cover image"
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Category</label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  >
                    <option value="mountains">Mountains & Hills</option>
                    <option value="nature">Forest & Safari</option>
                    <option value="coastal">Coastal & Sea</option>
                    <option value="group">Travel Moments</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Location</label>
                  <input
                    type="text"
                    value={galleryForm.location}
                    onChange={(e) => setGalleryForm({ ...galleryForm, location: e.target.value })}
                    placeholder="e.g. North Sikkim"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Display Order Number</label>
                  <input
                    type="number"
                    value={galleryForm.display_order}
                    onChange={(e) => setGalleryForm({ ...galleryForm, display_order: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '22px' }}>
                  <input
                    type="checkbox"
                    id="gal_active"
                    checked={galleryForm.is_active === 1}
                    onChange={(e) => setGalleryForm({ ...galleryForm, is_active: e.target.checked ? 1 : 0 })}
                  />
                  <label htmlFor="gal_active" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active (Visible on Website)</label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Caption / Description</label>
                <textarea
                  rows="2"
                  value={galleryForm.caption}
                  onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                  placeholder="Short description of this moment..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-secondary)', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  {editingGalleryItem ? 'Save Media Changes' : 'Upload to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: VIEW BOOKING DETAILS & PAYMENT ================= */}
      {selectedBooking && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>Booking Dossier</span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                  {selectedBooking.booking_id}
                </h2>
              </div>
              <button type="button" onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Customer & Package Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Customer</span>
                  <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-primary)' }}>{selectedBooking.customer_name}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#4B5563', display: 'block' }}>📞 {selectedBooking.customer_phone}</span>
                  {(selectedBooking.customer_whatsapp || selectedBooking.whatsapp_number || selectedBooking.customer_phone) && (
                    <a
                      href={`https://wa.me/${formatWhatsAppNumber(selectedBooking.customer_whatsapp || selectedBooking.whatsapp_number || selectedBooking.customer_phone)}?text=${encodeURIComponent(`Hi ${selectedBooking.customer_name}, greetings from Journey Architect regarding your booking ${selectedBooking.booking_id}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#16A34A', fontWeight: 700, textDecoration: 'none', marginTop: '2px' }}
                    >
                      <MessageCircle size={14} /> WhatsApp: {selectedBooking.customer_whatsapp || selectedBooking.whatsapp_number || selectedBooking.customer_phone}
                    </a>
                  )}
                  <span style={{ fontSize: '0.85rem', color: '#4B5563', display: 'block', marginTop: '2px' }}>✉️ {selectedBooking.customer_email || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Tour Package</span>
                  <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-primary)' }}>{selectedBooking.package_name}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#4B5563', display: 'block' }}>📅 Travel Date: {selectedBooking.travel_date}</span>
                  <span style={{ fontSize: '0.85rem', color: '#4B5563' }}>👥 {selectedBooking.adults} Adults, {selectedBooking.children} Children</span>
                </div>
              </div>

              {/* Financial Balance */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                <div style={{ padding: '10px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Total Amount</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>₹{selectedBooking.total_amount}</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#D1FAE5', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#065F46' }}>Paid Amount</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>₹{selectedBooking.paid_amount}</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#FEE2E2', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#991B1B' }}>Remaining Due</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#DC2626' }}>₹{selectedBooking.remaining_amount}</div>
                </div>
              </div>

              {/* Update Status Dropdown */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>Update Booking Status</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateBookingStatus(selectedBooking.booking_id, st)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        border: '1px solid #D1D5DB',
                        backgroundColor: selectedBooking.booking_status === st ? 'var(--color-primary)' : '#FFFFFF',
                        color: selectedBooking.booking_status === st ? '#FFFFFF' : '#374151',
                        cursor: 'pointer'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Payment Logger */}
              <form onSubmit={handleRecordPayment} style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 8px 0' }}>
                  💵 Record Manual Payment (Cash / UPI / Bank)
                </h4>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={manualPaymentAmount}
                    onChange={(e) => setManualPaymentAmount(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', width: '140px' }}
                  />
                  <select
                    value={manualPaymentMethod}
                    onChange={(e) => setManualPaymentMethod(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  >
                    <option value="cash">Cash Payment</option>
                    <option value="upi">UPI / GPay / PhonePe</option>
                    <option value="bank_transfer">Bank Transfer / IMPS</option>
                  </select>
                  <button
                    type="submit"
                    style={{ padding: '8px 16px', backgroundColor: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Record Payment
                  </button>
                </div>
              </form>

              {/* PDF Voucher Generator & WhatsApp Invoice */}
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => openWhatsAppInvoice(selectedBooking)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      backgroundColor: '#25D366',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(37,211,102,0.3)'
                    }}
                  >
                    <MessageCircle size={16} />
                    <span>Send Invoice on WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => generateBookingPDF(selectedBooking)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    <FileText size={16} />
                    <span>Download Voucher PDF</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  style={{ padding: '8px 16px', backgroundColor: '#E5E7EB', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CATERING ENQUIRY DOSSIER ================= */}
      {selectedCateringLead && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>Catering Enquiry Dossier</span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Utensils size={20} color="var(--color-secondary)" />
                  {selectedCateringLead.lead_id}
                </h2>
              </div>
              <button type="button" onClick={() => setSelectedCateringLead(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Customer & Event Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Customer Information</span>
                  <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-primary)', marginTop: '4px' }}>{selectedCateringLead.name}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#4B5563', display: 'block', marginTop: '2px' }}>📞 Phone: {selectedCateringLead.phone}</span>
                  {(selectedCateringLead.whatsapp_number || selectedCateringLead.phone) && (
                    <a
                      href={`https://wa.me/${formatWhatsAppNumber(selectedCateringLead.whatsapp_number || selectedCateringLead.phone)}?text=${encodeURIComponent(`Hi ${selectedCateringLead.name}, greetings from Journey Architect Catering Services regarding your enquiry (${selectedCateringLead.lead_id}). How can we assist you?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#16A34A', fontWeight: 700, textDecoration: 'none', marginTop: '2px' }}
                    >
                      <MessageCircle size={14} /> WhatsApp: {selectedCateringLead.whatsapp_number || selectedCateringLead.phone}
                    </a>
                  )}
                  <span style={{ fontSize: '0.85rem', color: '#4B5563', display: 'block', marginTop: '2px' }}>✉️ Email: {selectedCateringLead.email || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Event & Date</span>
                  <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-primary)', marginTop: '4px' }}>{selectedCateringLead.event_type || 'Special Event'}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#4B5563', display: 'block', marginTop: '2px' }}>📅 Date: {selectedCateringLead.event_date || 'Flexible'}</span>
                  <span style={{ fontSize: '0.85rem', color: '#4B5563', display: 'block', marginTop: '2px' }}>👥 Guests: <strong>{selectedCateringLead.guest_count} attendees</strong></span>
                  <span style={{ fontSize: '0.85rem', color: '#4B5563', display: 'block', marginTop: '2px' }}>📍 Venue: {selectedCateringLead.event_location || 'Not specified'}</span>
                </div>
              </div>

              {/* Menu & Service Requirements */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Menu Preference</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>
                    {selectedCateringLead.food_preference || 'Standard Feast'}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#4B5563' }}>Meal Type: {selectedCateringLead.meal_type || 'Lunch / Dinner'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Budget Expectation</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669', marginTop: '4px' }}>
                    {selectedCateringLead.budget_range ? `₹${selectedCateringLead.budget_range}` : 'To be discussed'}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Submitted on {selectedCateringLead.created_at?.slice(0, 16)}</span>
                </div>
              </div>

              {/* Requirements & Notes */}
              {(selectedCateringLead.service_requirements || selectedCateringLead.special_notes) && (
                <div style={{ padding: '1rem', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Special Requirements & Notes</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#78350F', whiteSpace: 'pre-wrap' }}>
                    {selectedCateringLead.service_requirements || selectedCateringLead.special_notes}
                  </p>
                </div>
              )}

              {/* Update Status Buttons */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>Update Enquiry Status</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateCateringStatus(selectedCateringLead.lead_id, st)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        border: '1px solid #D1D5DB',
                        backgroundColor: selectedCateringLead.status === st ? 'var(--color-primary)' : '#FFFFFF',
                        color: selectedCateringLead.status === st ? '#FFFFFF' : '#374151',
                        cursor: 'pointer'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <a
                  href={`https://wa.me/${formatWhatsAppNumber(selectedCateringLead.whatsapp_number || selectedCateringLead.phone)}?text=${encodeURIComponent(`Hi ${selectedCateringLead.name}, greetings from Journey Architect Catering Services regarding your enquiry (${selectedCateringLead.lead_id}) for ${selectedCateringLead.guest_count} guests on ${selectedCateringLead.event_date}. We would love to discuss custom menu selections.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(37,211,102,0.3)'
                  }}
                >
                  <MessageCircle size={16} />
                  <span>Chat on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedCateringLead(null)}
                  style={{ padding: '8px 16px', backgroundColor: '#E5E7EB', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CAR RENTAL ENQUIRY DOSSIER ================= */}
      {selectedCarRentalLead && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>Car Rental Enquiry Dossier</span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Car size={20} color="var(--color-secondary)" />
                  {selectedCarRentalLead.lead_id}
                </h2>
              </div>
              <button type="button" onClick={() => setSelectedCarRentalLead(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Customer & Trip Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Customer Information</span>
                  <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-primary)', marginTop: '4px' }}>{selectedCarRentalLead.name}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#4B5563', display: 'block', marginTop: '2px' }}>📞 Phone: {selectedCarRentalLead.phone}</span>
                  {(selectedCarRentalLead.whatsapp_number || selectedCarRentalLead.phone) && (
                    <a
                      href={`https://wa.me/${formatWhatsAppNumber(selectedCarRentalLead.whatsapp_number || selectedCarRentalLead.phone)}?text=${encodeURIComponent(`Hi ${selectedCarRentalLead.name}, greetings from Journey Architect Car Rental regarding your enquiry (${selectedCarRentalLead.lead_id}). How can we assist you?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#16A34A', fontWeight: 700, textDecoration: 'none', marginTop: '2px' }}
                    >
                      <MessageCircle size={14} /> WhatsApp: {selectedCarRentalLead.whatsapp_number || selectedCarRentalLead.phone}
                    </a>
                  )}
                  <span style={{ fontSize: '0.85rem', color: '#4B5563', display: 'block', marginTop: '2px' }}>✉️ Email: {selectedCarRentalLead.email || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Trip Details</span>
                  <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-primary)', marginTop: '4px' }}>{selectedCarRentalLead.trip_type || 'Car Rental'}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#4B5563', display: 'block', marginTop: '2px' }}>📅 Travel Date: {selectedCarRentalLead.travel_date}</span>
                  {selectedCarRentalLead.return_date && (
                    <span style={{ fontSize: '0.85rem', color: '#4B5563', display: 'block', marginTop: '2px' }}>🔄 Return Date: {selectedCarRentalLead.return_date}</span>
                  )}
                  <span style={{ fontSize: '0.85rem', color: '#4B5563', display: 'block', marginTop: '2px' }}>👥 Passengers: <strong>{selectedCarRentalLead.passengers || 1} passenger(s)</strong></span>
                </div>
              </div>

              {/* Route & Vehicle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Route Details</span>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-primary)', marginTop: '4px' }}>
                    <strong>From:</strong> {selectedCarRentalLead.pickup_location || 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#4B5563', marginTop: '2px' }}>
                    <strong>To:</strong> {selectedCarRentalLead.dropoff_location || 'Local / Sightseeing'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Vehicle Selected</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>
                    🚗 {selectedCarRentalLead.car_type || 'Standard Cab'}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#4B5563' }}>
                    Luggage: {selectedCarRentalLead.luggage_count || 0} bags | Driver: Included
                  </span>
                </div>
              </div>

              {/* Requirements & Notes */}
              {selectedCarRentalLead.special_requirements && (
                <div style={{ padding: '1rem', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Special Requirements & Notes</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#78350F', whiteSpace: 'pre-wrap' }}>
                    {selectedCarRentalLead.special_requirements}
                  </p>
                </div>
              )}

              {/* Update Status Buttons */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>Update Enquiry Status</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateCarRentalStatus(selectedCarRentalLead.lead_id, st)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        border: '1px solid #D1D5DB',
                        backgroundColor: selectedCarRentalLead.status === st ? 'var(--color-primary)' : '#FFFFFF',
                        color: selectedCarRentalLead.status === st ? '#FFFFFF' : '#374151',
                        cursor: 'pointer'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <a
                  href={`https://wa.me/${formatWhatsAppNumber(selectedCarRentalLead.whatsapp_number || selectedCarRentalLead.phone)}?text=${encodeURIComponent(`Hi ${selectedCarRentalLead.name}, greetings from Journey Architect Car Rental regarding your enquiry (${selectedCarRentalLead.lead_id}) for ${selectedCarRentalLead.car_type || 'a vehicle'} on ${selectedCarRentalLead.travel_date}. We have sanitized cabs and verified drivers ready.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(37,211,102,0.3)'
                  }}
                >
                  <MessageCircle size={16} />
                  <span>Chat on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedCarRentalLead(null)}
                  style={{ padding: '8px 16px', backgroundColor: '#E5E7EB', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Post Editor Modal */}
      {isBlogModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '840px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: '#FFFFFF', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={20} color="var(--color-secondary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                  {editingBlog ? `Edit Blog: ${editingBlog.title}` : 'Write New Travel Blog Story'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBlogModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBlog} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="e.g. Silk Route Sikkim: The Ultimate High-Altitude Circuit"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                    placeholder="e.g. silk-route-sikkim-ultimate-guide (auto-generated if empty)"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                  >
                    <option value="Himalayas & Hills">Himalayas & Hills</option>
                    <option value="Wildlife & Deltas">Wildlife & Deltas</option>
                    <option value="Heritage & Pilgrimage">Heritage & Pilgrimage</option>
                    <option value="Travel Tips">Travel Tips</option>
                    <option value="Regional Culture & Food">Regional Culture & Food</option>
                    <option value="Custom Tours">Custom Tours</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={blogForm.read_time}
                    onChange={(e) => setBlogForm({ ...blogForm, read_time: e.target.value })}
                    placeholder="e.g. 5 min read"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    Publish Date
                  </label>
                  <input
                    type="text"
                    value={blogForm.published_date}
                    onChange={(e) => setBlogForm({ ...blogForm, published_date: e.target.value })}
                    placeholder="e.g. Oct 18, 2026"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Hero Image Upload */}
              <MediaUploadField
                label="Hero Cover Image"
                sublabel="Select an image or paste image URL"
                value={blogForm.hero_image}
                onChange={(url) => setBlogForm({ ...blogForm, hero_image: url })}
                token={token}
                placeholder="https://images.unsplash.com/..."
              />

              {/* Author Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={blogForm.author_name}
                    onChange={(e) => setBlogForm({ ...blogForm, author_name: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    Author Role
                  </label>
                  <input
                    type="text"
                    value={blogForm.author_role}
                    onChange={(e) => setBlogForm({ ...blogForm, author_role: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                  Excerpt / Short Summary *
                </label>
                <textarea
                  required
                  rows={2}
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="2-3 sentences summarizing the journey, key sights, and traveler advice."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                />
              </div>

              {/* Tags Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={blogForm.tags_input}
                  onChange={(e) => setBlogForm({ ...blogForm, tags_input: e.target.value })}
                  placeholder="Sikkim, Silk Route, High Altitude, Homestay, Snow"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                />
              </div>

              {/* Introduction Paragraph */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                  Article Introduction
                </label>
                <textarea
                  rows={3}
                  value={blogForm.intro}
                  onChange={(e) => setBlogForm({ ...blogForm, intro: e.target.value })}
                  placeholder="Opening narrative describing the destination atmosphere, season, and route..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                />
              </div>

              {/* Dynamic Content Sections */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    Story Sections & Highlights ({blogForm.sections.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddBlogSection}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '0.78rem', backgroundColor: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    <Plus size={14} /> Add Section
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {blogForm.sections.map((sec, idx) => (
                    <div key={idx} style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280' }}>
                          Section #{idx + 1}
                        </span>
                        {blogForm.sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveBlogSection(idx)}
                            style={{ padding: '2px 6px', fontSize: '0.7rem', color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Section Heading (e.g. Navigating the 32 Hairpin Bends)"
                        value={sec.title}
                        onChange={(e) => handleUpdateBlogSection(idx, 'title', e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #D1D5DB', fontSize: '0.85rem', fontWeight: 600 }}
                      />
                      <textarea
                        rows={3}
                        placeholder="Section content, personal travel insights, must-visit viewpoints..."
                        value={sec.content}
                        onChange={(e) => handleUpdateBlogSection(idx, 'content', e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                  Quick Travel Tips (One tip per line)
                </label>
                <textarea
                  rows={3}
                  value={blogForm.tips_input}
                  onChange={(e) => setBlogForm({ ...blogForm, tips_input: e.target.value })}
                  placeholder="Carry 4 passport photos and voter ID for military permits&#10;Pack thermal inners and windproof jacket&#10;Carry cash as ATMs are sparse"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                />
              </div>

              {/* Checkboxes: Featured & Active */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={blogForm.featured}
                    onChange={(e) => setBlogForm({ ...blogForm, featured: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>★ Feature on Home Page Top 3</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={blogForm.is_active === 1 || blogForm.is_active === true}
                    onChange={(e) => setBlogForm({ ...blogForm, is_active: e.target.checked ? 1 : 0 })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Publish as Live on Site</span>
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: '6px', backgroundColor: '#F3F4F6', color: '#4B5563', border: '1px solid #D1D5DB', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 24px', borderRadius: '6px', backgroundColor: 'var(--color-secondary)', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 6px rgba(22, 124, 128, 0.25)' }}
                >
                  {editingBlog ? 'Save Changes' : 'Publish Blog Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT CATERING DISH ================= */}
      {isCuisineModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', maxWidth: '640px', width: '100%', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', borderTopLeftRadius: '14px', borderTopRightRadius: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                  {editingCuisine ? `Edit Dish: ${editingCuisine.name}` : 'Add New Catering Dish'}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                  Assign dishes to Indian, Chinese, Italian, or Indo-Chinese menus.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCuisineModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCuisine} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Dish Name & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kolkata Dum Biryani"
                    value={cuisineForm.name}
                    onChange={(e) => setCuisineForm({ ...cuisineForm, name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    Cuisine Category *
                  </label>
                  <select
                    value={cuisineForm.category}
                    onChange={(e) => setCuisineForm({ ...cuisineForm, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    <option value="Indian">Indian</option>
                    <option value="Tandoor">Tandoor</option>
                    <option value="Bengali authentic cuisine">Bengali authentic cuisine</option>
                    <option value="South Indian">South Indian</option>
                    <option value="Indo-Chinese">Indo chinese</option>
                    <option value="Continental">Continental</option>
                    <option value="Italian">Italian</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div>
              </div>

              {/* Media Upload Field for Dish Image */}
              <MediaUploadField
                label="Dish High-Resolution Image *"
                sublabel="Upload a mouthwatering food photo (Max 25MB) or specify an image URL"
                value={cuisineForm.image_url}
                onChange={(url) => setCuisineForm({ ...cuisineForm, image_url: url })}
                token={token}
                placeholder="https://images.unsplash.com/... or upload"
              />

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                  Short Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Appetizing description detailing spices, preparation style, fresh ingredients, and serving suggestions..."
                  value={cuisineForm.description}
                  onChange={(e) => setCuisineForm({ ...cuisineForm, description: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              {/* Diet Type, Chef's Highlight & Display Order */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    Dietary Classification
                  </label>
                  <select
                    value={cuisineForm.diet_type}
                    onChange={(e) => setCuisineForm({ ...cuisineForm, diet_type: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                  >
                    <option value="non-veg">🍖 Non-Vegetarian</option>
                    <option value="veg">🌱 Vegetarian</option>
                    <option value="vegan">🌿 Vegan</option>
                    <option value="beverage">🍹 Beverage / Dessert</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    Chef's Badge / Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chef's Special / Woodfired"
                    value={cuisineForm.price_indicator}
                    onChange={(e) => setCuisineForm({ ...cuisineForm, price_indicator: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={cuisineForm.display_order}
                    onChange={(e) => setCuisineForm({ ...cuisineForm, display_order: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Live Visibility Switch */}
              <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={cuisineForm.is_active === 1 || cuisineForm.is_active === true}
                    onChange={(e) => setCuisineForm({ ...cuisineForm, is_active: e.target.checked ? 1 : 0 })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Publish as Live on Public Catering Page (Users can view & filter)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
                <button
                  type="button"
                  onClick={() => setIsCuisineModalOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: '6px', backgroundColor: '#F3F4F6', color: '#4B5563', border: '1px solid #D1D5DB', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 24px', borderRadius: '6px', backgroundColor: 'var(--color-secondary)', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 6px rgba(22, 124, 128, 0.25)' }}
                >
                  {editingCuisine ? 'Save Changes' : 'Create Dish'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
