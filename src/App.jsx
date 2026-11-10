import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/common/Header';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Footer } from './components/common/Footer';
import { StickyMobileCTA } from './components/common/StickyMobileCTA';
import { WhatsAppFloating } from './components/common/WhatsAppFloating';
import { PlanMyTripModal } from './components/forms/PlanMyTripModal';
import { LegalModal } from './components/legal/LegalModal';

// Homepage is loaded eagerly for instant First Contentful Paint (FCP)
import { HomePage } from './pages/HomePage';

// Subpages and Admin portals are lazy-loaded on demand to keep initial bundle tiny
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ToursPage = lazy(() => import('./pages/ToursPage').then(m => ({ default: m.ToursPage })));
const CustomizedToursPage = lazy(() => import('./pages/CustomizedToursPage').then(m => ({ default: m.CustomizedToursPage })));
const ServicesDetailPage = lazy(() => import('./pages/ServicesDetailPage').then(m => ({ default: m.ServicesDetailPage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then(m => ({ default: m.GalleryPage })));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage').then(m => ({ default: m.ReviewsPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then(m => ({ default: m.FAQPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));

// Heavy Booking & Admin Portals
const PackageDetailPage = lazy(() => import('./pages/PackageDetailPage'));
const BookingCheckoutPage = lazy(() => import('./pages/BookingCheckoutPage'));
const BookingSuccessPage = lazy(() => import('./pages/BookingSuccessPage'));
const BookingLookupPage = lazy(() => import('./pages/BookingLookupPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));

const PageLoadingSpinner = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #E5E7EB',
      borderTopColor: '#C48B28',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
  </div>
);

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  // Trip Planning Modal State
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [tripModalParams, setTripModalParams] = useState({ tripType: 'holiday', destination: '' });

  // Legal Modal State
  const [legalModalPolicy, setLegalModalPolicy] = useState(null);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  const handleOpenTripPlanner = (tripType = 'holiday', destination = '') => {
    setTripModalParams({ tripType, destination });
    setIsTripModalOpen(true);
  };

  const handleCloseTripPlanner = () => {
    setIsTripModalOpen(false);
  };

  const handleOpenLegalModal = (policyId) => {
    setLegalModalPolicy(policyId);
  };

  const handleCloseLegalModal = () => {
    setLegalModalPolicy(null);
  };

  // Helper to extract query parameters safely
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return {
      token: searchParams.get('token') || ''
    };
  };

  const cleanPath = (currentPath.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/').toLowerCase();
  const isAdminRoute = cleanPath === '/admin' || currentPath.startsWith('/admin');

  // Render appropriate page component based on route
  const renderCurrentPage = () => {
    // 1. Dynamic route: /tours/:slug
    if (currentPath.startsWith('/tours/') && currentPath.length > 7) {
      const slug = currentPath.replace('/tours/', '').split('?')[0];
      return <PackageDetailPage slug={slug} onNavigate={navigate} />;
    }

    // 2. Dynamic route: /services/:slug
    if (currentPath.startsWith('/services/') && currentPath.length > 10) {
      const slug = currentPath.replace('/services/', '').split('?')[0];
      return (
        <ServicesDetailPage
          initialServiceSlug={slug}
          onOpenTripPlanner={handleOpenTripPlanner}
          navigate={navigate}
        />
      );
    }

    // 3. Dynamic route: /book/:slug
    if (currentPath.startsWith('/book/') && currentPath.length > 6) {
      const slug = currentPath.replace('/book/', '').split('?')[0];
      return <BookingCheckoutPage slug={slug} onNavigate={navigate} />;
    }

    // 4. Dynamic route: /booking/success/:bookingId
    if (currentPath.startsWith('/booking/success/')) {
      const bookingId = currentPath.replace('/booking/success/', '').split('?')[0];
      const { token } = getQueryParams();
      return <BookingSuccessPage bookingId={bookingId} token={token} onNavigate={navigate} />;
    }

    // 5. Booking lookup portal: /booking/lookup
    if (cleanPath === '/booking/lookup') {
      return <BookingLookupPage onNavigate={navigate} />;
    }

    // 6. Admin Dashboard portal: /admin
    if (isAdminRoute) {
      return <AdminDashboardPage onNavigate={navigate} />;
    }

    // Standard static routes
    switch (cleanPath) {
      case '/services':
        return (
          <ServicesDetailPage
            initialServiceSlug="tour-and-travel"
            onOpenTripPlanner={handleOpenTripPlanner}
            navigate={navigate}
          />
        );
      case '/about':
        return <AboutPage onOpenTripPlanner={() => handleOpenTripPlanner('holiday')} />;
      case '/tours':
        return <ToursPage onOpenTripPlanner={handleOpenTripPlanner} navigate={navigate} />;
      case '/customized-tours':
        return <CustomizedToursPage onOpenTripPlanner={() => handleOpenTripPlanner('customized')} />;
      case '/blog':
        return <BlogPage onOpenTripPlanner={handleOpenTripPlanner} navigate={navigate} />;
      case '/gallery':
        return <GalleryPage onOpenTripPlanner={() => handleOpenTripPlanner('holiday')} />;
      case '/reviews':
        return <ReviewsPage onOpenTripPlanner={() => handleOpenTripPlanner('holiday')} />;
      case '/faq':
        return <FAQPage onOpenTripPlanner={() => handleOpenTripPlanner('holiday')} />;
      case '/contact':
        return <ContactPage />;
      case '/':
      default:
        return <HomePage onOpenTripPlanner={handleOpenTripPlanner} navigate={navigate} />;
    }
  };

  return (
    <div className="app-layout" style={{ margin: 0, padding: 0 }}>
      {/* Main Header (Hidden on Admin) */}
      {!isAdminRoute && (
        <Header
          currentPath={currentPath}
          navigate={navigate}
          onOpenTripPlanner={() => handleOpenTripPlanner('holiday')}
        />
      )}

      {/* Main Page Content */}
      <main id="main-content" className="main-content">
        <Suspense fallback={<PageLoadingSpinner />}>
          {renderCurrentPage()}
        </Suspense>
      </main>

      {/* Footer (Hidden on Admin) */}
      {!isAdminRoute && (
        <Footer
          navigate={navigate}
          onOpenLegalModal={handleOpenLegalModal}
          onOpenTripPlanner={() => handleOpenTripPlanner('holiday')}
        />
      )}

      {/* Sticky Mobile CTA Bar (Hidden on Admin) */}
      {!isAdminRoute && <StickyMobileCTA onOpenTripPlanner={() => handleOpenTripPlanner('holiday')} />}

      {/* Floating WhatsApp Bubble (Hidden on Admin) */}
      {!isAdminRoute && <WhatsAppFloating />}

      {/* Plan My Trip Modal Dialog */}
      <PlanMyTripModal
        isOpen={isTripModalOpen}
        onClose={handleCloseTripPlanner}
        initialDestination={tripModalParams.destination}
        initialTripType={tripModalParams.tripType}
      />

      {/* Legal & Policy Modal Dialog */}
      <LegalModal
        policyId={legalModalPolicy}
        isOpen={Boolean(legalModalPolicy)}
        onClose={handleCloseLegalModal}
      />
    </div>
  );
}

export default App;
