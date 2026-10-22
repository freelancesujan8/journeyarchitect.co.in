import React, { useState, useEffect } from 'react';
import { Clock, Calendar, ArrowRight, BookOpen, Compass, ChevronRight, X, CheckCircle2, MessageCircle, Share2, Tag } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { ApiClient } from '../../api/client';
import { BLOG_POSTS } from '../../data/blogData';
import { getWhatsAppUrl } from '../../config/businessConfig';

export function HomeBlogSection({ navigate, onOpenTripPlanner }) {
  const [blogs, setBlogs] = useState(BLOG_POSTS.slice(0, 3));
  const [activeArticle, setActiveArticle] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch latest 3 blogs from database
  useEffect(() => {
    let isMounted = true;
    async function loadLatestBlogs() {
      try {
        const res = await ApiClient.getBlogs(undefined, undefined, 3);
        if (isMounted && res && res.blogs && res.blogs.length > 0) {
          setBlogs(res.blogs.slice(0, 3));
        }
      } catch (err) {
        console.warn('HomeBlogSection: Using fallback blog data:', err);
      }
    }
    loadLatestBlogs();
    return () => { isMounted = false; };
  }, []);

  // Escape key handler for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeArticle) {
        setActiveArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeArticle]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeArticle]);

  const handleShare = (article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: `${window.location.origin}/blog`
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${window.location.origin}/blog`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section className="section-padding bg-warm" id="travel-blog" style={{ position: 'relative' }}>
      <div className="container">
        {/* Section Heading */}
        <SectionHeading
          eyebrow="Stories & Insights"
          eyebrowVariant="teal"
          title="Latest Travel Stories & Guides"
          subtitle="Expert route tips, local food culture, high-altitude preparation, and packing checklists curated by our travel team."
        />

        {/* 3 Blogs Grid on Scroll */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2.25rem)',
            marginBottom: '3rem'
          }}
        >
          {blogs.map((post, idx) => (
            <article
              key={post.id || post.blog_id || idx}
              className="card-base"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
                cursor: 'pointer',
                border: '1px solid var(--color-border-light)'
              }}
              onClick={() => setActiveArticle(post)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              {/* Thumbnail Image */}
              <div
                style={{
                  position: 'relative',
                  height: '220px',
                  overflow: 'hidden',
                  backgroundColor: '#E5E7EB'
                }}
              >
                <img
                  src={post.heroImage}
                  alt={post.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />

                {/* Category Pill on Image */}
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(18, 48, 74, 0.88)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {post.category}
                </span>

                {post.featured && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--color-primary)',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-full)',
                      textTransform: 'uppercase'
                    }}
                  >
                    Featured
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '0.75rem'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    {post.publishedDate}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.18rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    lineHeight: 1.35,
                    marginBottom: '0.75rem',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {post.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '1.25rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {post.excerpt}
                </p>

                {/* Card Footer */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--color-border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-secondary-subtle)',
                        color: 'var(--color-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.75rem'
                      }}
                    >
                      {post.author?.avatar || 'JA'}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-main)', fontWeight: 600 }}>
                      {post.author?.name}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      color: 'var(--color-secondary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Read Article</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Blogs Button */}
        <div style={{ textAlign: 'center' }}>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              if (navigate) navigate('/blog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            icon={<BookOpen size={17} />}
          >
            Explore All Travel Guides & Stories
          </Button>
        </div>
      </div>

      {/* Quick Article Reader Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeArticle.title}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(10, 25, 40, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(1rem, 3vw, 2.5rem)'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveArticle(null);
            }
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Modal Hero Banner */}
            <div
              style={{
                position: 'relative',
                height: 'clamp(220px, 32vw, 320px)',
                backgroundImage: `url(${activeArticle.heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(18, 48, 74, 0.92) 0%, rgba(18, 48, 74, 0.3) 60%, rgba(0,0,0,0.5) 100%)'
                }}
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label="Close article modal"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2
                }}
              >
                <X size={20} />
              </button>

              {/* Title & Info on Hero */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  color: '#FFFFFF'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '8px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--color-primary)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {activeArticle.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} />
                    {activeArticle.readTime}
                  </span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} />
                    {activeArticle.publishedDate}
                  </span>
                </div>

                <h2
                  style={{
                    fontSize: 'clamp(1.3rem, 3vw, 1.95rem)',
                    fontWeight: 800,
                    lineHeight: 1.25,
                    color: '#FFFFFF',
                    margin: 0
                  }}
                >
                  {activeArticle.title}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'var(--color-text-main)' }}>
              {/* Author & Share Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--color-border-light)',
                  marginBottom: '1.75rem',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-secondary-subtle)',
                      color: 'var(--color-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}
                  >
                    {activeArticle.author?.avatar || 'JA'}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.925rem', color: 'var(--color-primary)', display: 'block' }}>
                      {activeArticle.author?.name}
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {activeArticle.author?.role} • Journey Architect Bongaon
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleShare(activeArticle)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <Share2 size={15} />
                  <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>

              {/* Intro */}
              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                  color: 'var(--color-primary)',
                  fontWeight: 500,
                  marginBottom: '1.75rem'
                }}
              >
                {activeArticle.content?.introduction || activeArticle.excerpt}
              </p>

              {/* Sections */}
              {activeArticle.content?.sections && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                  {activeArticle.content.sections.map((sec, i) => (
                    <div key={i}>
                      <h4
                        style={{
                          fontSize: '1.18rem',
                          fontWeight: 700,
                          color: 'var(--color-primary)',
                          marginBottom: '0.5rem'
                        }}
                      >
                        {sec.heading}
                      </h4>
                      <p
                        style={{
                          fontSize: '0.95rem',
                          lineHeight: 1.68,
                          color: 'var(--color-text-secondary)',
                          margin: 0
                        }}
                      >
                        {sec.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Tips */}
              {activeArticle.content?.quickTips && (
                <div
                  style={{
                    backgroundColor: 'var(--color-secondary-subtle)',
                    border: '1px solid rgba(22, 124, 128, 0.25)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    marginBottom: '2rem'
                  }}
                >
                  <h4
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--color-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Essential Travel Tips</span>
                  </h4>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      fontSize: '0.875rem',
                      color: 'var(--color-primary)',
                      lineHeight: 1.55
                    }}
                  >
                    {activeArticle.content.quickTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', margin: '0 0 2px 0' }}>
                    Want to plan this trip?
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.825rem', color: 'rgba(255,255,255,0.8)' }}>
                    Get sanitized cars, verified homestays, and meals with Journey Architect.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Button
                    variant="whatsapp"
                    size="sm"
                    href={getWhatsAppUrl(`Hello Journey Architect, I read "${activeArticle.title}" and would like to plan a trip.`)}
                    target="_blank"
                    icon={<MessageCircle size={15} />}
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => {
                      setActiveArticle(null);
                      if (onOpenTripPlanner) onOpenTripPlanner('holiday', activeArticle.title);
                    }}
                  >
                    Plan Custom Trip
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HomeBlogSection;
