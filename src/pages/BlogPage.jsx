import React, { useState, useEffect } from 'react';
import {
  Search, BookOpen, Clock, Calendar, User, Tag, ArrowRight, X,
  CheckCircle2, Compass, MessageCircle, MapPin, Sparkles, ChevronRight, Share2
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Button } from '../components/common/Button';
import { BLOG_CATEGORIES } from '../data/blogData';
import { ApiClient } from '../api/client';
import { getWhatsAppUrl } from '../config/businessConfig';

export function BlogPage({ onOpenTripPlanner, navigate }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Guides");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadBlogs() {
      try {
        setLoading(true);
        const res = await ApiClient.getBlogs();
        if (isMounted && res && res.success && Array.isArray(res.blogs)) {
          setBlogs(res.blogs);
        } else if (isMounted) {
          setBlogs([]);
        }
      } catch (err) {
        console.warn('BlogPage: Error loading blogs from API:', err);
        if (isMounted) setBlogs([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadBlogs();
    return () => { isMounted = false; };
  }, []);

  // Close modal on Escape key
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

  // Filter blog posts by category and search query
  const filteredPosts = blogs.filter((post) => {
    const matchesCategory =
      selectedCategory === "All Guides" || post.category === selectedCategory;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      post.title?.toLowerCase().includes(q) ||
      post.excerpt?.toLowerCase().includes(q) ||
      post.category?.toLowerCase().includes(q) ||
      (Array.isArray(post.tags) && post.tags.some((tag) => tag.toLowerCase().includes(q)));

    return matchesCategory && matchesSearch;
  });

  const featuredPost =
    selectedCategory === "All Guides" && !searchQuery
      ? blogs.find((p) => p.featured) || blogs[0]
      : null;

  const regularPosts = featuredPost
    ? filteredPosts.filter((p) => p.id !== featuredPost.id)
    : filteredPosts;

  const handleShare = (article) => {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <>
      <SEOHead
        title="Travel Blog & Destination Guides | Journey Architect"
        description="Read in-depth travel guides, Sikkim Silk Route insights, North Bengal mountain retreats, Sundarbans tips, and expert packing advice from Journey Architect."
        path="/blog"
      />

      {/* Hero Banner Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #1a4263 100%)',
          color: '#FFFFFF',
          padding: 'clamp(3rem, 6vw, 4.5rem) 0 clamp(2.5rem, 5vw, 3.5rem)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(22, 124, 128, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.75)',
              marginBottom: '1.25rem'
            }}
          >
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              style={{ color: '#FFFFFF', textDecoration: 'none', opacity: 0.85 }}
            >
              Home
            </a>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Travel Blog & Guides</span>
          </nav>

          <div style={{ maxWidth: '820px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(244, 163, 64, 0.2)',
                color: 'var(--color-accent)',
                fontSize: '0.825rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
                border: '1px solid rgba(244, 163, 64, 0.35)'
              }}
            >
              <Compass size={15} />
              <span>Travel Stories & Local Insights</span>
            </span>

            <h1
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.18,
                marginBottom: '1rem',
                letterSpacing: '-0.02em'
              }}
            >
              Journey Architect Travel Blog
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '720px'
              }}
            >
              Curated itineraries, route advisories, authentic Bengali food stories, and field-tested mountain packing guides authored directly by our tour architects.
            </p>

            {/* Live Search Bar */}
            <div
              style={{
                position: 'relative',
                maxWidth: '600px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '16px',
                  color: '#6B7280',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by destination, keyword, tips (e.g. Zuluk, Sundarbans, Packing)..."
                style={{
                  width: '100%',
                  padding: '14px 44px 14px 46px',
                  borderRadius: 'var(--radius-lg)',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.95rem',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-primary)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px'
                  }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Navigation Bar */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: '72px',
          zIndex: 40,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              padding: '12px 0',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {BLOG_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count =
                cat === "All Guides"
                  ? blogs.length
                  : blogs.filter((p) => p.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected
                      ? '1px solid var(--color-secondary)'
                      : '1px solid var(--color-border)',
                    backgroundColor: isSelected
                      ? 'var(--color-secondary)'
                      : 'var(--color-bg)',
                    color: isSelected ? '#FFFFFF' : 'var(--color-text-main)',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{cat}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isSelected
                        ? 'rgba(255, 255, 255, 0.25)'
                        : 'var(--color-border)',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                      fontWeight: 700
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Blog Content Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px', borderColor: 'var(--color-teal)', borderTopColor: 'transparent' }} />
              <p style={{ color: 'var(--color-text-muted)' }}>Loading travel stories and guides...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', maxWidth: '600px', margin: '0 auto' }}>
              <BookOpen size={48} color="var(--color-secondary)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '8px' }}>
                No travel articles currently published
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
                Our team is writing fresh travel tales and travel tips. In the meantime, explore our holiday tour packages or plan your dream trip!
              </p>
              <Button
                variant="secondary"
                size="medium"
                icon={<Compass size={16} />}
                onClick={() => navigate('/tours')}
              >
                Browse Tour Packages
              </Button>
            </div>
          ) : (
            <>
              {/* Active Search & Filter Status indicator */}
              {(searchQuery || selectedCategory !== "All Guides") && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '2rem',
                    backgroundColor: '#FFFFFF',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-light)'
                  }}
                >
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                    Showing <strong>{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'article' : 'articles'}
                    {selectedCategory !== "All Guides" && (
                      <span> in <strong>{selectedCategory}</strong></span>
                    )}
                    {searchQuery && (
                      <span> matching "<strong>{searchQuery}</strong>"</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("All Guides");
                      setSearchQuery("");
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-secondary)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Featured Post Spotlight (shown when viewing all guides with no search) */}
              {featuredPost && (
                <div style={{ marginBottom: '3.5rem' }}>
                  <div
                    className="card-base"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-xl)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-md)',
                      display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  alignItems: 'stretch',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                {/* Featured Image */}
                <div
                  style={{
                    position: 'relative',
                    minHeight: '340px',
                    backgroundImage: `url(${featuredPost.heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '18px',
                      left: '18px',
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--color-primary)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Sparkles size={14} />
                    <span>Featured Guide</span>
                  </span>
                </div>

                {/* Featured Text Content */}
                <div
                  style={{
                    padding: 'clamp(2rem, 4vw, 3rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '0.8rem',
                      color: 'var(--color-text-muted)',
                      marginBottom: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: 'var(--color-secondary-subtle)',
                        color: 'var(--color-secondary)',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 700
                      }}
                    >
                      {featuredPost.category}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} />
                      {featuredPost.readTime}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      {featuredPost.publishedDate}
                    </span>
                  </div>

                  <h2
                    style={{
                      fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                      fontWeight: 800,
                      color: 'var(--color-primary)',
                      lineHeight: 1.25,
                      marginBottom: '1rem',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {featuredPost.title}
                  </h2>

                  <p
                    style={{
                      fontSize: '0.975rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.65,
                      marginBottom: '1.5rem'
                    }}
                  >
                    {featuredPost.excerpt}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--color-border-light)',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-secondary)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}
                      >
                        {featuredPost.author.avatar}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.875rem', color: 'var(--color-primary)', display: 'block' }}>
                          {featuredPost.author.name}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {featuredPost.author.role}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveArticle(featuredPost)}
                      icon={<BookOpen size={16} />}
                    >
                      Read Complete Guide
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Articles */}
          {regularPosts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2rem'
              }}
            >
              {regularPosts.map((post) => (
                <article
                  key={post.id}
                  className="card-base"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => setActiveArticle(post)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  {/* Card Thumbnail Image */}
                  <div
                    style={{
                      position: 'relative',
                      height: '210px',
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
                        transition: 'transform 0.4s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(18, 48, 74, 0.85)',
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
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={12} />
                        {post.readTime}
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
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

                    {/* Card Footer with Author & Action */}
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
                          {post.author.avatar}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-main)', fontWeight: 600 }}>
                          {post.author.name}
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
                        <span>Read</span>
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 1.5rem',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                border: '1px dashed var(--color-border)'
              }}
            >
              <Compass size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                No travel guides found
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                We couldn't find any articles matching your search query or selected category.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory("All Guides");
                  setSearchQuery("");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
          </>
        )}
        </div>
      </section>

      {/* Full Article Reader Modal */}
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
            {/* Header Hero in Modal */}
            <div
              style={{
                position: 'relative',
                height: 'clamp(240px, 35vw, 340px)',
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
                  transition: 'background-color 0.2s ease',
                  zIndex: 2
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)')}
              >
                <X size={20} />
              </button>

              {/* Article Hero Overlay Text */}
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

            {/* Modal Body Content */}
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
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-secondary-subtle)',
                      color: 'var(--color-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.95rem'
                    }}
                  >
                    {activeArticle.author.avatar}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.925rem', color: 'var(--color-primary)', display: 'block' }}>
                      {activeArticle.author.name}
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {activeArticle.author.role} • Journey Architect Bongaon
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

              {/* Introduction */}
              <p
                style={{
                  fontSize: '1.08rem',
                  lineHeight: 1.75,
                  color: 'var(--color-primary)',
                  fontWeight: 500,
                  marginBottom: '2rem'
                }}
              >
                {activeArticle.content.introduction}
              </p>

              {/* Detailed Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2.5rem' }}>
                {activeArticle.content.sections.map((sec, idx) => (
                  <div key={idx}>
                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                        marginBottom: '0.65rem'
                      }}
                    >
                      {sec.heading}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                        color: 'var(--color-text-secondary)',
                        margin: 0
                      }}
                    >
                      {sec.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Tips Box */}
              {activeArticle.content.quickTips && (
                <div
                  style={{
                    backgroundColor: 'var(--color-secondary-subtle)',
                    border: '1px solid rgba(22, 124, 128, 0.25)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    marginBottom: '2.5rem'
                  }}
                >
                  <h4
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--color-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '1rem'
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>Essential Travel Takeaways & Expert Advice</span>
                  </h4>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '0.9rem',
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

              {/* Tags */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '2rem'
                }}
              >
                <Tag size={15} color="var(--color-text-muted)" />
                {activeArticle.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: '0.78rem',
                      backgroundColor: 'var(--color-bg)',
                      color: 'var(--color-text-secondary)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--color-border-light)'
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Modal Booking CTA Bar */}
              <div
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', margin: '0 0 4px 0' }}>
                    Want to visit this destination?
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                    Journey Architect arranges sanitized cabs, verified homestays, permits, and Bengali tour meals.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Button
                    variant="whatsapp"
                    size="sm"
                    href={getWhatsAppUrl(`Hello Journey Architect, I read your article "${activeArticle.title}" and would like to plan a tour.`)}
                    target="_blank"
                    icon={<MessageCircle size={16} />}
                  >
                    WhatsApp Enquiry
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

      {/* Bottom Inspiration & Planning CTA */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          padding: 'clamp(3rem, 6vw, 4.5rem) 0',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '720px' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--color-secondary)',
              letterSpacing: '0.08em',
              display: 'block',
              marginBottom: '0.5rem'
            }}
          >
            Turn Stories Into Memories
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
              fontWeight: 800,
              color: 'var(--color-primary)',
              lineHeight: 1.25,
              marginBottom: '1rem'
            }}
          >
            Ready to Plan Your Next Journey?
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              marginBottom: '2rem'
            }}
          >
            From Darjeeling and the high-altitude Silk Route of Sikkim to the mangrove channels of Sundarbans and Puri beaches, our local team crafts smooth, stress-free family holidays.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => onOpenTripPlanner && onOpenTripPlanner('holiday')}
              icon={<Compass size={18} />}
            >
              Plan My Holiday Trip
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/tours')}
            >
              Browse Tour Packages
            </Button>
            <Button
              variant="whatsapp"
              size="lg"
              href={getWhatsAppUrl("Hello Journey Architect, I would like to enquire about holiday tour packages.")}
              target="_blank"
              icon={<MessageCircle size={18} />}
            >
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogPage;
