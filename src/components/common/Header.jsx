import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageCircle, Send, ChevronRight } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from './Button';
import { NAV_LINKS } from '../../config/navigation';
import { getWhatsAppUrl, getPhoneCallUrl } from '../../config/businessConfig';

export function Header({ currentPath, navigate, onOpenTripPlanner }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll for header background styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e, path) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHomePage = currentPath === '/';
  const isHeaderTransparent = isHomePage && !isScrolled && !mobileMenuOpen;

  return (
    <header
      className={`site-header ${isScrolled ? 'site-header-scrolled' : ''} ${isHeaderTransparent ? 'site-header-transparent' : 'site-header-solid'}`}
      style={{
        position: isHomePage ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 'var(--z-header)',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease',
        backgroundColor: isHeaderTransparent ? 'transparent' : 'rgba(255, 255, 255, 0.98)',
        backdropFilter: isHeaderTransparent ? 'none' : 'blur(16px)',
        borderBottom: isHeaderTransparent ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid var(--color-border)',
        boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
        padding: isScrolled ? '4px 0' : '6px 0'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo - 120px height on desktop, seamlessly blending without background */}
        <a
          href="/"
          onClick={(e) => handleNavClick(e, '/')}
          aria-label="Journey Architect - Return to homepage"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '2px 0' }}
        >
          <Logo
            light={isHeaderTransparent}
            size="header"
            isScrolled={isScrolled}
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav
          className="desktop-nav"
          aria-label="Main Navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem'
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = currentPath === link.path || (link.id === 'tours' && currentPath.startsWith('/tours')) || (link.id === 'blog' && currentPath.startsWith('/blog'));

            return (
              <a
                key={link.id}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isHeaderTransparent
                    ? isActive ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.95)'
                    : isActive ? 'var(--color-secondary)' : 'var(--color-text-main)',
                  position: 'relative',
                  padding: '8px 0',
                  textDecoration: 'none',
                  transition: 'color var(--transition-fast)'
                }}
              >
                {link.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2.5px',
                      backgroundColor: isHeaderTransparent ? 'var(--color-accent)' : 'var(--color-secondary)',
                      borderRadius: '2px'
                    }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Header Right Action Area */}
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button
            variant={isHeaderTransparent ? 'amber' : 'primary'}
            size="sm"
            onClick={() => onOpenTripPlanner()}
            className="desktop-only-btn"
            icon={<Send size={15} />}
          >
            Plan My Trip
          </Button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            style={{
              display: 'none',
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              background: isHeaderTransparent ? 'rgba(255, 255, 255, 0.2)' : 'var(--color-bg)',
              color: isHeaderTransparent ? '#FFFFFF' : 'var(--color-primary)',
              border: isHeaderTransparent ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid var(--color-border)'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-overlay animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            top: 'var(--header-height)',
            backgroundColor: 'rgba(18, 48, 74, 0.5)',
            backdropFilter: 'blur(6px)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="mobile-drawer-content animate-slide-up"
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxHeight: 'calc(100vh - var(--header-height))',
              overflowY: 'auto',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-xl)',
              borderBottom: '2px solid var(--color-border)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Brand Logo in mobile menu */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--color-border-light)',
                marginBottom: '1rem'
              }}
            >
              <Logo size="sm" />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--color-secondary-subtle)',
                  color: 'var(--color-secondary)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}
              >
                Official Portal
              </span>
            </div>

            {/* Mobile Nav Links */}
            <nav aria-label="Mobile Navigation" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {NAV_LINKS.map((link) => {
                const isActive = currentPath === link.path || (link.id === 'tours' && currentPath.startsWith('/tours')) || (link.id === 'blog' && currentPath.startsWith('/blog'));

                return (
                  <a
                    key={link.id}
                    href={link.path}
                    onClick={(e) => handleNavClick(e, link.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isActive ? 'var(--color-secondary-subtle)' : 'transparent',
                      color: isActive ? 'var(--color-secondary)' : 'var(--color-text-main)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '1.05rem',
                      textDecoration: 'none'
                    }}
                  >
                    <span>{link.label}</span>
                    <ChevronRight size={18} opacity={isActive ? 1 : 0.4} />
                  </a>
                );
              })}
            </nav>

            {/* Mobile Actions in Drawer */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTripPlanner();
                }}
                icon={<Send size={18} />}
                style={{ width: '100%' }}
              >
                Plan My Trip
              </Button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Button
                  variant="whatsapp"
                  href={getWhatsAppUrl()}
                  target="_blank"
                  icon={<MessageCircle size={16} />}
                >
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  href={getPhoneCallUrl()}
                  icon={<Phone size={16} />}
                >
                  Call Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Component Styles */}
      <style>{`
        @media (max-width: 992px) {
          .desktop-nav, .desktop-only-btn {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
export default Header;
