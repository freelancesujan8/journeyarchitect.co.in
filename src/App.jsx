import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Footer } from './components/common/Footer';
import { StickyMobileCTA } from './components/common/StickyMobileCTA';
import { WhatsAppFloating } from './components/common/WhatsAppFloating';
import { PlanMyTripModal } from './components/forms/PlanMyTripModal';
import { LegalModal } from './components/legal/LegalModal';

// Existing Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ToursPage } from './pages/ToursPage';
import { CustomizedToursPage } from './pages/CustomizedToursPage';
import { ServicesDetailPage } from './pages/ServicesDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';

// Booking & Admin Pages
import PackageDetailPage from './pages/PackageDetailPage';
import BookingCheckoutPage from './pages/BookingCheckoutPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import BookingLookupPage from './pages/BookingLookupPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

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
        {renderCurrentPage()}
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
