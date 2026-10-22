import React, { useState, useEffect } from 'react';
import { BUSINESS_CONFIG } from '../../config/businessConfig';
import { ApiClient } from '../../api/client';

/**
 * Journey Architect — Official Brand Logo
 * Prominently renders the official brand logo with crisp high-DPI scaling,
 * transparent background blending, and real-time synchronization with the Admin Panel logo uploader.
 */
export function Logo({ className = '', light = false, size = 'default', height = null, isScrolled = false }) {
  const [branding, setBranding] = useState(() => {
    try {
      const cached = localStorage.getItem('ja_branding');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    let isMounted = true;
    ApiClient.getBrandingSettings()
      .then((res) => {
        if (isMounted && res?.branding) {
          setBranding(res.branding);
          try {
            localStorage.setItem('ja_branding', JSON.stringify(res.branding));
          } catch (e) {}
        }
      })
      .catch(() => {});

    const handleUpdate = (e) => {
      if (e.detail) {
        setBranding(e.detail);
      }
    };
    window.addEventListener('ja_branding_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('ja_branding_updated', handleUpdate);
    };
  }, []);

  // Determine base height from admin branding setting (fallback 120px)
  const baseHeight = branding?.logo_height ? Number(branding.logo_height) : 120;
  // If scrolled in header, scale down smoothly for sticky navigation
  const activeHeaderHeight = isScrolled ? Math.max(65, Math.round(baseHeight * 0.72)) : baseHeight;

  let calculatedHeight;
  if (height) {
    calculatedHeight = typeof height === 'number' ? `${height}px` : height;
  } else if (size === 'header') {
    calculatedHeight = `${activeHeaderHeight}px`;
  } else if (size === 'footer') {
    calculatedHeight = `${Math.min(baseHeight, 140)}px`;
  } else if (size === 'lg') {
    calculatedHeight = `${baseHeight}px`;
  } else if (size === 'sm') {
    calculatedHeight = '56px';
  } else {
    calculatedHeight = `${baseHeight}px`;
  }

  // Active logo source
  let logoSrc;
  if (light) {
    logoSrc = branding?.logo_white_url || '/logo-white.png';
  } else {
    logoSrc = branding?.logo_url || '/logoo.png';
  }

  const logoAlt = branding?.logo_alt || BUSINESS_CONFIG.name;

  return (
    <div
      className={`logo-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        backgroundColor: 'transparent',
        padding: 0,
        margin: 0,
        borderRadius: 0,
        boxShadow: 'none',
        border: 'none',
        lineHeight: 0,
        transition: 'all 0.25s ease'
      }}
      title={logoAlt}
    >
      <img
        src={logoSrc}
        alt={logoAlt}
        className={size === 'header' ? 'brand-header-logo-img' : 'brand-logo-img'}
        style={{
          height: calculatedHeight,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
          transition: 'height 0.25s ease'
        }}
        onError={(e) => {
          if (e.target.src.indexOf('logo-white.png') !== -1) {
            e.target.src = '/logoo.png';
          } else if (e.target.src.indexOf('logoo.png') !== -1) {
            e.target.src = '/logo.png';
          }
        }}
      />
    </div>
  );
}
export default Logo;
