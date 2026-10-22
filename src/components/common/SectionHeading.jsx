import React from 'react';

export function SectionHeading({
  eyebrow,
  eyebrowVariant = 'teal', // 'teal' | 'amber' | 'navy'
  title,
  subtitle,
  align = 'center', // 'left' | 'center'
  light = false,
  className = ''
}) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : '';
  const eyebrowClass = eyebrowVariant === 'amber' 
    ? 'eyebrow eyebrow-amber' 
    : eyebrowVariant === 'navy' 
    ? 'eyebrow eyebrow-navy' 
    : 'eyebrow';

  return (
    <div className={`section-heading-wrapper ${alignClass} ${className}`} style={{ marginBottom: 'clamp(1.25rem, 2.5vw, 2rem)' }}>
      {eyebrow && (
        <span className={eyebrowClass}>
          {eyebrow}
        </span>
      )}
      
      {title && (
        <h2
          className="section-title"
          style={{ color: light ? '#FFFFFF' : 'var(--color-text-main)' }}
        >
          {title}
        </h2>
      )}
      
      {subtitle && (
        <p
          className={`section-subtitle ${align === 'center' ? 'mx-auto' : ''}`}
          style={{ color: light ? 'rgba(255, 255, 255, 0.85)' : 'var(--color-text-muted)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
