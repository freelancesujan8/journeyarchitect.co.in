import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  CreditCard,
  Utensils,
  Car,
  Package,
  UtensilsCrossed,
  BookOpen,
  Image as ImageIcon,
  Sparkles,
  Phone,
  FileText,
  Globe,
  LogOut,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

/**
 * Modern Admin Sidebar Navigation
 */
export function AdminSidebar({
  activeTab,
  setActiveTab,
  onNavigate,
  handleLogout,
  isOpen,
  onClose,
  counts = {}
}) {
  const navSections = [
    {
      title: 'Main Dashboard',
      items: [
        {
          id: 'overview',
          label: 'Overview',
          icon: LayoutDashboard
        },
        {
          id: 'calendar',
          label: 'Calendar & Schedule',
          icon: Calendar,
          badge: counts.calendarTodayCount > 0 ? `${counts.calendarTodayCount} Today` : null,
          badgeColor: '#10B981'
        },
        {
          id: 'bookings',
          label: 'Tour Bookings',
          icon: CalendarCheck,
          badge: counts.bookingsPendingCount > 0 ? `${counts.bookingsPendingCount} New` : counts.bookingsCount ? `${counts.bookingsCount}` : null,
          badgeColor: counts.bookingsPendingCount > 0 ? '#EF4444' : '#6B7280'
        },
        {
          id: 'payments',
          label: 'Payments & Receipts',
          icon: CreditCard,
          badge: counts.paymentsCount ? `${counts.paymentsCount}` : null
        }
      ]
    },
    {
      title: 'Operations & Leads',
      items: [
        {
          id: 'catering',
          label: 'Catering Leads',
          icon: Utensils,
          badge: counts.cateringNewCount > 0 ? `${counts.cateringNewCount} New` : counts.cateringCount ? `${counts.cateringCount}` : null,
          badgeColor: counts.cateringNewCount > 0 ? '#F59E0B' : '#6B7280'
        },
        {
          id: 'car-rental',
          label: 'Car Rental Leads',
          icon: Car,
          badge: counts.carRentalNewCount > 0 ? `${counts.carRentalNewCount} New` : counts.carRentalCount ? `${counts.carRentalCount}` : null,
          badgeColor: counts.carRentalNewCount > 0 ? '#F59E0B' : '#6B7280'
        }
      ]
    },
    {
      title: 'Content Management',
      items: [
        {
          id: 'packages',
          label: 'Tour Packages',
          icon: Package,
          badge: counts.packagesCount ? `${counts.packagesCount}` : null
        },
        {
          id: 'cuisines',
          label: 'Cuisine Menu',
          icon: UtensilsCrossed,
          badge: counts.cuisinesCount ? `${counts.cuisinesCount}` : null
        },
        {
          id: 'blogs',
          label: 'Travel Blogs',
          icon: BookOpen,
          badge: counts.blogsCount ? `${counts.blogsCount}` : null
        },
        {
          id: 'gallery',
          label: 'Gallery Media',
          icon: ImageIcon,
          badge: counts.galleryCount ? `${counts.galleryCount}` : null
        }
      ]
    },
    {
      title: 'System & Settings',
      items: [
        {
          id: 'branding',
          label: 'Website Logo & Branding',
          icon: Sparkles
        },
        {
          id: 'contact',
          label: 'Contact & Settings',
          icon: Phone
        },
        {
          id: 'logs',
          label: 'Audit Activity Logs',
          icon: FileText
        }
      ]
    }
  ];

  const handleItemClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 25, 47, 0.7)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 998,
            transition: 'opacity 0.25s ease'
          }}
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        style={{
          width: '270px',
          backgroundColor: '#0A1826',
          color: '#E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.25)',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 999,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          // On desktop (min-width 1024px), sidebar is always visible
          // Handled via inline media query logic in parent or styles
        }}
        className="admin-sidebar"
      >
        {/* Sidebar Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.25rem 1rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(22, 124, 128, 0.15) 0%, rgba(10, 24, 38, 0) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-secondary, #167C80)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(22, 124, 128, 0.4)'
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  lineHeight: 1.2
                }}
              >
                Journey Architect
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'var(--color-accent, #E5A93C)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                Admin Control Center
              </div>
            </div>
          </div>

          {/* Close button for Mobile */}
          <button
            type="button"
            onClick={onClose}
            className="mobile-sidebar-close"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#94A3B8',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              display: 'none', // Shown on mobile via CSS
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Navigation Menu */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          {navSections.map((section, sIdx) => (
            <div key={sIdx}>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#64748B',
                  padding: '0 0.6rem 0.4rem 0.6rem'
                }}
              >
                {section.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemClick(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? '#FFFFFF' : '#94A3B8',
                        backgroundColor: isSelected ? 'rgba(22, 124, 128, 0.28)' : 'transparent',
                        border: isSelected ? '1px solid rgba(22, 124, 128, 0.5)' : '1px solid transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.color = '#F1F5F9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#94A3B8';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon
                          size={18}
                          color={isSelected ? 'var(--color-accent, #E5A93C)' : '#64748B'}
                          style={{ flexShrink: 0 }}
                        />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.label}
                        </span>
                      </div>

                      {item.badge && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '2px 7px',
                            borderRadius: '10px',
                            backgroundColor: item.badgeColor || 'rgba(255, 255, 255, 0.12)',
                            color: '#FFFFFF',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer User & Quick Actions */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          {/* User Profile Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 8px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)'
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #167C80 0%, #0E2235 100%)',
                border: '2px solid rgba(229, 169, 60, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.85rem'
              }}
            >
              A
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                Administrator
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 6px #10B981'
                  }}
                />
                <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Active Session</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Live Site & Logout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#CBD5E1',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '7px 8px',
                borderRadius: '6px',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              title="Return to Public Live Website"
            >
              <Globe size={13} />
              <span>Live Site</span>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#F87171',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                padding: '7px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              title="Sign Out of Admin"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
