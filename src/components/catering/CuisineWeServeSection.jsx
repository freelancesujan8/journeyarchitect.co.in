import React, { useState, useEffect } from 'react';
import { 
  Utensils, Sparkles, ChefHat, Check, ArrowRight, MessageCircle, 
  Search, Flame, Heart, Award, Filter
} from 'lucide-react';
import { ApiClient } from '../../api/client';
import { getWhatsAppUrl } from '../../config/businessConfig';

export const isCategoryMatch = (itemCat, filterCat) => {
  if (!filterCat || filterCat === 'All' || filterCat === 'ALL') return true;
  if (!itemCat) return false;
  if (itemCat === filterCat) return true;
  const a = itemCat.toLowerCase().replace(/[^a-z0-9]/g, '');
  const b = filterCat.toLowerCase().replace(/[^a-z0-9]/g, '');
  return a === b;
};

export const CUISINE_CATEGORIES = [
  { 
    id: 'All', 
    label: 'All Cuisines', 
    emoji: '🍽️', 
    description: 'Explore our full catering repertoire across all culinary traditions.' 
  },
  { 
    id: 'Indian', 
    label: 'Indian', 
    emoji: '🍛', 
    description: 'Royal North Indian curries, rich gravies, slow-cooked Dal Makhani & Awadhi Biryani.' 
  },
  { 
    id: 'Tandoor', 
    label: 'Tandoor', 
    emoji: '🔥', 
    description: 'Clay-oven charcoal roasted delicacies: Bhatia Murgh, Malai Kebabs, Paneer Tikka & Naans.' 
  },
  { 
    id: 'Bengali authentic cuisine', 
    label: 'Bengali authentic cuisine', 
    emoji: '🐟', 
    description: 'Heritage Bengali masterpieces: Bhetki Paturi, Chingri Malaikari, Kosha Mangsho, Luchi & Ilish Bhapa.' 
  },
  { 
    id: 'South Indian', 
    label: 'South Indian', 
    emoji: '🥞', 
    description: 'Crispy Ghee Roast Dosas, Podi Idlis, Medu Vada, fragrant Sambar & fiery Chettinad preparations.' 
  },
  { 
    id: 'Indo-Chinese', 
    label: 'Indo chinese', 
    emoji: '🥡', 
    description: 'Iconic Kolkata Tangra-style Chilli Chicken, Hakka noodles, Manchurian & Honey Chilli Crisps.' 
  },
  { 
    id: 'Continental', 
    label: 'Continental', 
    emoji: '🥩', 
    description: 'Pan-seared Herb Grilled Chicken, Creamy Au Gratin, Kolkata Fish Florentine & vegetable steaks.' 
  },
  { 
    id: 'Italian', 
    label: 'Italian', 
    emoji: '🍕', 
    description: 'Artisanal stone-baked pizzas, handmade egg pasta, rich layered lasagna & herb antipasti.' 
  },
  { 
    id: 'Chinese', 
    label: 'Chinese', 
    emoji: '🥢', 
    description: 'Authentic Cantonese steamed dim sums, Sichuan Kung Pao stir-fries & high-flame wok rice.' 
  }
];

export function CuisineWeServeSection({ onSelectDish }) {
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDishModal, setActiveDishModal] = useState(null);

  useEffect(() => {
    fetchCuisines();
  }, []);

  const fetchCuisines = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.getCateringCuisines();
      if (res && res.cuisines && res.cuisines.length > 0) {
        setCuisines(res.cuisines);
      }
    } catch (err) {
      console.warn('[Catering] Failed to fetch cuisines from server, using cached default:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCuisines = cuisines.filter(item => {
    const matchesCategory = isCategoryMatch(item.category, selectedCategory);
    const matchesSearch = !searchQuery.trim() || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('bengali')) {
      return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' };
    }
    if (cat.includes('tandoor')) {
      return { bg: '#FFEDD5', text: '#C2410C', border: '#FED7AA' };
    }
    if (cat.includes('south')) {
      return { bg: '#FEF9C3', text: '#A16207', border: '#FEF08A' };
    }
    if (cat.includes('continental')) {
      return { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' };
    }
    if (cat.includes('indo') || (cat.includes('chinese') && cat.includes('indo'))) {
      return { bg: '#EDE9FE', text: '#6D28D9', border: '#DDD6FE' };
    }
    if (cat.includes('chinese')) {
      return { bg: '#FEE2E2', text: '#B91C1C', border: '#FECACA' };
    }
    if (cat.includes('italian')) {
      return { bg: '#FCE7F3', text: '#BE185D', border: '#FBCFE8' };
    }
    if (cat.includes('indian')) {
      return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
    }
    return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' };
  };

  const activeCategoryMeta = CUISINE_CATEGORIES.find(c => c.id === selectedCategory) || CUISINE_CATEGORIES[0];

  return (
    <section 
      id="cuisine-we-serve-section"
      style={{
        marginTop: '4rem',
        marginBottom: '4rem',
        padding: 'clamp(2.5rem, 5vw, 4.5rem) 0',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF9 50%, #FDF8F0 100%)',
        borderRadius: 'var(--radius-2xl, 24px)',
        border: '1px solid #F3E8D8',
        boxShadow: '0 20px 45px -15px rgba(217, 119, 6, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Decorative Background Accents */}
      <div 
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0) 70%)',
          pointerEvents: 'none'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-80px',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(22, 124, 128, 0.10) 0%, rgba(22, 124, 128, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2.5rem auto' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: '#FEF3C7',
              border: '1px solid #FDE68A',
              color: '#B45309',
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '1rem',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.15)'
            }}
          >
            <ChefHat size={16} />
            <span>Master Chef Curation • 23 Spice Lane Kitchens</span>
          </div>

          <h2 
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.85rem)',
              fontWeight: 900,
              color: 'var(--color-primary, #12304A)',
              letterSpacing: '-0.02em',
              margin: '0 0 1rem 0',
              lineHeight: 1.15
            }}
          >
            Cuisines We Serve
          </h2>

          <p 
            style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              color: '#4B5563',
              lineHeight: 1.65,
              margin: '0 auto'
            }}
          >
            Curated by Co-Founder & Executive Chef <strong>Dipankar Mitra</strong>, our catering repertoire spans authentic regional Bengali feasts, charcoal-fired Tandoor, rich North & South Indian, gourmet Continental, artisanal Italian, and legendary Kolkata Indo-Chinese delicacies. Every dish is cooked fresh with premium unadulterated ingredients.
          </p>
        </div>

        {/* Category Filter Pills & Search */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}
        >
          {/* Filter Pills */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '6px',
              backgroundColor: '#FFFFFF',
              borderRadius: '9999px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)'
            }}
          >
            {CUISINE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = cat.id === 'All' 
                ? cuisines.length 
                : cuisines.filter(c => isCategoryMatch(c.category, cat.id)).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '9999px',
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 800 : 600,
                    backgroundColor: isSelected ? 'var(--color-primary, #12304A)' : 'transparent',
                    color: isSelected ? '#FFFFFF' : '#4B5563',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isSelected ? '0 4px 12px rgba(18, 48, 74, 0.25)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span 
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#F3F4F6',
                      color: isSelected ? '#FFFFFF' : '#6B7280'
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Category Description Banner */}
          <div 
            style={{
              fontSize: '0.92rem',
              color: '#6B7280',
              textAlign: 'center',
              maxWidth: '640px',
              fontStyle: 'italic'
            }}
          >
            ✨ {activeCategoryMeta.description}
          </div>
        </div>

        {/* Dishes Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#6B7280' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍲</div>
            <p>Loading mouthwatering culinary delicacies...</p>
          </div>
        ) : filteredCuisines.length === 0 ? (
          <div 
            style={{
              textAlign: 'center',
              padding: '3.5rem 1.5rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px dashed #D1D5DB'
            }}
          >
            <p style={{ color: '#4B5563', fontSize: '1.05rem', margin: '0 0 1rem 0' }}>
              No dishes found matching your criteria in this category.
            </p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary, #12304A)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              View All Cuisines
            </button>
          </div>
        ) : (
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {filteredCuisines.map((dish) => {
              const catColors = getCategoryColor(dish.category);
              return (
                <div
                  key={dish.id || dish.dish_id}
                  className="card-base"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: '1px solid #EDE8DF',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.06)',
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 18px 36px -8px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(0, 0, 0, 0.06)';
                  }}
                >
                  {/* Dish Image Container */}
                  <div 
                    style={{
                      position: 'relative',
                      height: '210px',
                      overflow: 'hidden',
                      backgroundColor: '#F3F4F6',
                      cursor: 'pointer'
                    }}
                    onClick={() => setActiveDishModal(dish)}
                  >
                    <img
                      src={dish.image_url}
                      alt={dish.name}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        display: 'block'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80';
                      }}
                    />

                    {/* Category Tag Overlay */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        backgroundColor: catColors.bg,
                        color: catColors.text,
                        border: `1px solid ${catColors.border}`,
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                      }}
                    >
                      {dish.category}
                    </div>

                    {/* Price/Chef Indicator Badge */}
                    {dish.price_indicator && (
                      <div 
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(18, 48, 74, 0.9)',
                          color: '#F4A340',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backdropFilter: 'blur(4px)',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}
                      >
                        ⭐ {dish.price_indicator}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div 
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <h3 
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: 'var(--color-primary, #12304A)',
                          margin: '0 0 8px 0',
                          lineHeight: 1.3
                        }}
                      >
                        {dish.name}
                      </h3>

                      <p 
                        style={{
                          fontSize: '0.85rem',
                          color: '#4B5563',
                          lineHeight: 1.55,
                          margin: '0 0 1rem 0'
                        }}
                      >
                        {dish.description}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div 
                      style={{
                        paddingTop: '0.85rem',
                        borderTop: '1px solid #F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const formEl = document.getElementById('enquiry-form-section');
                          if (formEl) {
                            formEl.scrollIntoView({ behavior: 'smooth' });
                          }
                          if (onSelectDish) onSelectDish(dish);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          color: 'var(--color-secondary, #167C80)',
                          fontWeight: 700,
                          fontSize: '0.825rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <span>Add to Enquiry</span>
                        <ArrowRight size={14} />
                      </button>

                      <a
                        href={getWhatsAppUrl(`Hello Chef Dipankar, I would like to include "${dish.name}" in my catering menu. Could you share package options?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          backgroundColor: '#25D366',
                          color: '#FFFFFF',
                          textDecoration: 'none',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          boxShadow: '0 2px 6px rgba(37,211,102,0.25)'
                        }}
                      >
                        <MessageCircle size={13} />
                        <span>WhatsApp Chef</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Executive Chef Feature Banner */}
        <div 
          style={{
            marginTop: '3.5rem',
            padding: '2rem clamp(1.5rem, 4vw, 2.75rem)',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #12304A 0%, #173D5E 100%)',
            color: '#FFFFFF',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            alignItems: 'center',
            gap: '2rem',
            boxShadow: '0 20px 40px -10px rgba(18, 48, 74, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#F4A340',
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px'
              }}
            >
              <Award size={16} />
              <span>Tailored Gastronomic Experience</span>
            </div>

            <h3 
              style={{
                fontSize: 'clamp(1.35rem, 3vw, 1.85rem)',
                fontWeight: 800,
                margin: '0 0 10px 0',
                color: '#FFFFFF',
                lineHeight: 1.25
              }}
            >
              Have a Specific Celebration Menu in Mind?
            </h3>

            <p style={{ fontSize: '0.925rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6, margin: 0 }}>
              Whether you require a traditional Bengali wedding spread with ilish & kosha mangsho, a live wood-fired pizza counter, or strict Satvik / Jain meal preparations, Executive Chef Dipankar Mitra crafts bespoke banquet menus tailored to your budget and guest expectations.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start', justifySelf: 'end' }}>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('enquiry-form-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '10px',
                backgroundColor: '#F4A340',
                color: '#12304A',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(244, 163, 64, 0.35)',
                whiteSpace: 'nowrap'
              }}
            >
              <span>Submit Custom Catering Enquiry</span>
              <ArrowRight size={16} />
            </button>

            <a
              href={getWhatsAppUrl("Hello Chef Dipankar, I would like to schedule a customized catering consultation for an upcoming celebration.")}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                whiteSpace: 'nowrap'
              }}
            >
              <MessageCircle size={16} color="#25D366" />
              <span>Direct WhatsApp: 95633 95633</span>
            </a>
          </div>
        </div>

      </div>

      {/* Dish Lightbox Modal */}
      {activeDishModal && (
        <div 
          onClick={() => setActiveDishModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(14, 34, 53, 0.85)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '600px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
              position: 'relative'
            }}
          >
            <div style={{ position: 'relative', height: '300px' }}>
              <img
                src={activeDishModal.image_url}
                alt={activeDishModal.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <button
                type="button"
                onClick={() => setActiveDishModal(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
              <div 
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(18, 48, 74, 0.9)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}
              >
                {activeDishModal.category}
              </div>
            </div>

            <div style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary, #12304A)', margin: '0 0 8px 0' }}>
                {activeDishModal.name}
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#4B5563', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                {activeDishModal.description}
              </p>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <a
                  href={getWhatsAppUrl(`Hello Chef Dipankar, I saw "${activeDishModal.name}" (${activeDishModal.category}) in your catering gallery and would like to request package pricing.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  <MessageCircle size={15} />
                  <span>Enquire on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setActiveDishModal(null);
                    const el = document.getElementById('enquiry-form-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-primary, #12304A)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Book for Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CuisineWeServeSection;
