import React, { useState } from 'react';
import { Utensils, Calendar, Users, MapPin, Send, CheckCircle2, MessageCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { ApiClient } from '../../api/client';
import { formatWhatsAppNumber } from '../../utils/whatsappInvoice';

const EVENT_TYPES = [
  'Wedding Ceremony / Reception',
  'Picnic / Get-Together',
  'Birthday / Anniversary Celebration',
  'Corporate Event / Conference',
  'Private Family Gathering',
  'Social / Cultural Function'
];

const FOOD_PREFERENCES = [
  'Authentic Bengali Feast (Fish, Mutton & Sweets)',
  'Multi-Cuisine Buffet (Bengali + North Indian)',
  'Live Counters & Hot Starters',
  'North Indian & Mughlai Special',
  'Chinese & Continental Delicacies',
  'Pure Vegetarian Special (Jain/Satvik Available)'
];

export function CateringEnquiryForm({ onSuccess, isModal = false }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp_number: '',
    sameAsPhone: true,
    email: '',
    event_date: '',
    guests_count: 50,
    event_location: '',
    event_type: 'Picnic / Get-Together',
    selectedPreferences: ['Authentic Bengali Feast (Fish, Mutton & Sweets)'],
    special_requirements: '',
    budget_range: ''
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedLeadId, setSubmittedLeadId] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'sameAsPhone') {
      setFormData(prev => ({
        ...prev,
        sameAsPhone: checked,
        whatsapp_number: checked ? prev.phone : ''
      }));
    } else if (name === 'phone') {
      setFormData(prev => ({
        ...prev,
        phone: value,
        whatsapp_number: prev.sameAsPhone ? value : prev.whatsapp_number
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTogglePreference = (pref) => {
    setFormData(prev => {
      const exists = prev.selectedPreferences.includes(pref);
      const updated = exists
        ? prev.selectedPreferences.filter(p => p !== pref)
        : [...prev.selectedPreferences, pref];
      return { ...prev, selectedPreferences: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.event_date) {
      setErrorMessage('Please choose your event date.');
      return;
    }
    if (!formData.event_location.trim()) {
      setErrorMessage('Please specify the event venue or city.');
      return;
    }

    setStatus('submitting');

    try {
      const combinedRequirements = [
        formData.selectedPreferences.length > 0 ? `Preferences: ${formData.selectedPreferences.join(', ')}` : '',
        formData.special_requirements.trim() ? `Notes: ${formData.special_requirements.trim()}` : ''
      ].filter(Boolean).join(' | ');

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        whatsapp_number: (formData.sameAsPhone ? formData.phone : (formData.whatsapp_number || formData.phone)).trim(),
        email: formData.email.trim(),
        event_date: formData.event_date,
        guests_count: parseInt(formData.guests_count, 10) || 50,
        event_location: formData.event_location.trim(),
        event_type: formData.event_type,
        service_requirements: combinedRequirements,
        budget_range: formData.budget_range.trim()
      };

      const res = await ApiClient.submitCateringEnquiry(payload);
      if (res && res.success) {
        setSubmittedLeadId(res.leadId);
        setStatus('success');
        if (onSuccess) onSuccess(res.leadId);
      } else {
        throw new Error(res?.error || 'Failed to submit enquiry');
      }
    } catch (err) {
      console.error('Catering form submission error:', err);
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again or message us on WhatsApp.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    const waPhone = formatWhatsAppNumber(formData.sameAsPhone ? formData.phone : formData.whatsapp_number);
    const waText = encodeURIComponent(
      `Hello Chef Dipankar Mitra & Journey Architect,\n\nI have submitted a catering enquiry #${submittedLeadId} for my event on ${formData.event_date} at ${formData.event_location} for approximately ${formData.guests_count} guests. Please share available menu packages and quotation.`
    );

    return (
      <div style={{ textAlign: 'center', padding: isModal ? '2rem 1rem' : '3rem 2rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(37, 211, 102, 0.15)', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <CheckCircle2 size={36} />
        </div>
        <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
          Catering Enquiry Received!
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          Thank you, <strong>{formData.name}</strong>. Your catering request has been assigned reference <strong>#{submittedLeadId}</strong>. Co-Founder & Executive Chef Dipankar Mitra and our catering team will review your menu requirements.
        </p>

        <div style={{ display: 'inline-flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="whatsapp"
            href={`https://wa.me/919563395633?text=${waText}`}
            target="_blank"
            icon={<MessageCircle size={16} />}
          >
            Chat with Chef Dipankar on WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setStatus('idle');
              setFormData({
                name: '',
                phone: '',
                whatsapp_number: '',
                sameAsPhone: true,
                email: '',
                event_date: '',
                guests_count: 50,
                event_location: '',
                event_type: 'Picnic / Get-Together',
                selectedPreferences: ['Authentic Bengali Feast (Fish, Mutton & Sweets)'],
                special_requirements: '',
                budget_range: ''
              });
            }}
          >
            Submit Another Enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#FFFFFF', padding: isModal ? '1.5rem' : '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '1rem' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Utensils size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', margin: 0 }}>
            Catering Services Enquiry
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Led by Executive Chef Dipankar Mitra & 23 Spice Lane Culinary Team
          </span>
        </div>
      </div>

      {errorMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#FEE2E2', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid of Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Full Name */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Subrata Mukherjee"
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
          />
        </div>

        {/* Calling Phone */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
            Calling Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="e.g. 98303 54307"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
          />
        </div>

        {/* WhatsApp Number with same-as-phone toggle */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              WhatsApp Number *
            </label>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="sameAsPhone"
                checked={formData.sameAsPhone}
                onChange={handleChange}
              />
              Same as phone
            </label>
          </div>
          <input
            type="tel"
            name="whatsapp_number"
            disabled={formData.sameAsPhone}
            placeholder="e.g. 79803 31022"
            value={formData.sameAsPhone ? formData.phone : formData.whatsapp_number}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              fontSize: '0.95rem',
              backgroundColor: formData.sameAsPhone ? 'var(--color-bg)' : '#FFFFFF'
            }}
          />
        </div>

        {/* Email Address */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
            Email Address (Optional)
          </label>
          <input
            type="email"
            name="email"
            placeholder="e.g. subrata@gmail.com"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
          />
        </div>

        {/* Event Date */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
            Event Date *
          </label>
          <input
            type="date"
            name="event_date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={formData.event_date}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
          />
        </div>

        {/* Guest Count */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
            Estimated Number of Guests *
          </label>
          <input
            type="number"
            name="guests_count"
            required
            min="5"
            max="5000"
            placeholder="e.g. 100"
            value={formData.guests_count}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
          />
        </div>

        {/* Event Location */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
            Event Location / Venue *
          </label>
          <input
            type="text"
            name="event_location"
            required
            placeholder="e.g. Bongaon, Habra, Kolkata, Barasat"
            value={formData.event_location}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
          />
        </div>

        {/* Event Type */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
            Occasion / Event Type
          </label>
          <select
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem', backgroundColor: '#FFFFFF' }}
          >
            {EVENT_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu / Food Preferences Checkboxes */}
      <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--color-bg)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
          Food & Menu Preferences (Select options):
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
          {FOOD_PREFERENCES.map(pref => {
            const isChecked = formData.selectedPreferences.includes(pref);
            return (
              <label
                key={pref}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: isChecked ? '#FFFFFF' : 'transparent',
                  border: `1px solid ${isChecked ? 'var(--color-secondary)' : 'transparent'}`,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: isChecked ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  fontWeight: isChecked ? 600 : 400
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleTogglePreference(pref)}
                />
                <span>{pref}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Special Requirements & Notes */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
          Specific Dishes, Dietary Needs, or Special Requests
        </label>
        <textarea
          name="special_requirements"
          rows={3}
          placeholder="e.g. Need Ilish Macher Paturi for main course, live chaat counter for starters, no onion/garlic options for 10 elderly guests."
          value={formData.special_requirements}
          onChange={handleChange}
          style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem', resize: 'vertical' }}
        />
      </div>

      {/* Submit Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
          🔒 Your details are private. Chef Dipankar Mitra will respond with an itemized quote.
        </span>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === 'submitting'}
          icon={<Send size={16} />}
        >
          {status === 'submitting' ? 'Submitting Enquiry...' : 'Submit Catering Enquiry'}
        </Button>
      </div>
    </form>
  );
}

export default CateringEnquiryForm;
