import React from 'react';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'amber' | 'outline' | 'outline-white' | 'whatsapp' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  icon = null,
  iconPosition = 'right',
  className = '',
  onClick,
  href,
  target,
  rel,
  type = 'button',
  disabled = false,
  ariaLabel,
  ...rest
}) {
  const classNames = [
    'btn',
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : '',
    className
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classNames}
        onClick={onClick}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : rel}
        aria-label={ariaLabel}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {content}
    </button>
  );
}
