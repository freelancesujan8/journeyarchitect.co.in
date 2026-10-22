import React, { useState } from 'react';
import { Car, Calendar, Users, MapPin, Send, CheckCircle2, MessageCircle, AlertCircle, Shield } from 'lucide-react';
import { Button } from '../common/Button';
import { ApiClient } from '../../api/client';
import { formatWhatsAppNumber } from '../../utils/whatsappInvoice';

const CAR_TYPES = [
  { label: 'Sedan (Swift Dzire / Toyota Etios) — 4 Seater', value: 'Sedan (Dzire / Etios)' },
  { label: 'Spacious SUV (Innova Crysta / Ertiga) — 6-7 Seater', value: 'Innova / Ertiga (SUV)' },
  { label: 'Compact Hatchback (WagonR / Swift) — 4 Seater', value: 'Hatchback (Swift / WagonR)' },
  { label: 'Tempo Traveller (12 / 17 / 26 Seater Luxury)', value: 'Tempo Traveller / Mini-Bus' },
  { label: 'Luxury Sedan / Premium SUV', value: 'Luxury / Premium' }
];

const TRIP_TYPES = [
  'Outstation Round-Trip',
  'Outstation One-Way',
  'Airport Pickup / Drop (Kolkata CCU)',
  'Local Kolkata Full-Day (8 Hrs / 80 Kms)',
  'Multi-Day Sightseeing Tour (North Bengal / Odisha / Bihar)'
];

export function CarRentalEnquiryForm({ onSuccess, isModal = false }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp_number: '',
    sameAsPhone: true,
    email: '',
    travel_date: '',
    return_date: '',
    pickup_location: '',
    drop_location: '',
    car_type: 'Sedan (Dzire / Etios)',
    passengers_count: 2,
    trip_type: 'Outstation Round-Trip',
    service_requirements: ''
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
    if (!formData.travel_date) {
      setErrorMessage('Please choose your travel pickup date.');
      return;
    }
    if (!formData.pickup_location.trim()) {
      setErrorMessage('Please specify your pickup location or city.');
      return;
    }
    if (!formData.drop_location.trim()) {
      setErrorMessage('Please specify your destination or drop location.');
      return;
    }

    setStatus('submitting');

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        whatsapp_number: (formData.sameAsPhone ? formData.phone : (formData.whatsapp_number || formData.phone)).trim(),
        email: formData.email.trim(),
        travel_date: formData.travel_date,
        return_date: formData.return_date || null,
        pickup_location: formData.pickup_location.trim(),
        drop_location: formData.drop_location.trim(),
        car_type: formData.car_type,
        passengers_count: parseInt(formData.passengers_count, 10) || 1,
        trip_type: formData.trip_type,
        service_requirements: formData.service_requirements.trim()
      };

      const res = await ApiClient.submitCarRentalEnquiry(payload);
      if (res && res.success) {
        setSubmittedLeadId(res.leadId);
        setStatus('success');
        if (onSuccess) onSuccess(res.leadId);
      } else {
        throw new Error(res?.error || 'Failed to submit enquiry');
      }
    } catch (err) {
      console.error('Car rental form submission error:', err);
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again or message us on WhatsApp.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    const waText = encodeURIComponent(
      `Hello Journey Architect Fleet Desk,\n\nI have submitted car rental enquiry #${submittedLeadId} for ${formData.car_type} on ${formData.travel_date} (${formData.pickup_location} to ${formData.drop_location}). Please confirm car availability and tariff.`
    );

    return (
      <div style={{ textAlign: 'center', padding: isModal ? '2rem 1rem' : '3rem 2rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(37, 211, 102, 0.15)', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <CheckCircle2 size={36} />
        </div>
        <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
          Car Rental Request Received!
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          Thank you, <strong>{formData.name}</strong>. Your cab booking enquiry reference is <strong>#{submittedLeadId}</strong>. Our fleet coordinator will verify sanitized vehicle availability and send an all-inclusive quotation to your WhatsApp/phone.
        </p>

        <div style={{ display: 'inline-flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="whatsapp"
            href={`https://wa.me/917980331022?text=${waText}`}
            target="_blank"
            icon={<MessageCircle size={16} />}
          >
            Chat with Fleet Desk on WhatsApp
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
                travel_date: '',
                return_date: '',
                pickup_location: '',
                drop_location: '',
                car_type: 'Sedan (Dzire / Etios)',
                passengers_count: 2,
                trip_type: 'Outstation Round-Trip',
                service_requirements: ''
              });
            }}
          >
            Submit Another Car Booking
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#FFFFFF', padding: isModal ? '1.5rem' : '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '1rem' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(2, 132, 199, 0.12)', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Car size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', margin: 0 }}>
            Commercial Car Rental & Taxi Enquiry
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Clean AC Sedans, SUVs, and Tempo Travellers with Professional Chauffeurs
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
            placeholder="e.g. Joydeb Ghosh"
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
            placeholder="e.g. 79803 31022"
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
            placeholder="e.g. 98303 54307"
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
            placeholder="e.g. joydeb@example.com"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
          />
        </div>

        {/* Pickup Location */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
            Pickup Location / Address *
          </label>
          <input
            type="text"
            name="pickup_location"
            required
            placeholder="e.g. Bongaon Court / Kolkata Airport / Salt Lake"
            value={formData.pickup_location}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
          />
        </div>

        {/* Drop Location */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
            Drop-off Location / Destination *
          </label>
          <input
            type="text"
            name="drop_location"
            required
            placeholder="e.g. Digha / Siliguri / Mayapur / Kolkata Airport"
            value={formData.drop_location}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
          />
        </div>

        {/* Travel Pickup Date */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
            Pickup Date *
          </label>
          <input
            type="date"
            name="travel_date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={formData.travel_date}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
          />
        </div>

        {/* Return Date */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
            Return Date (Optional for Round-Trip)
          </label>
          <input
            type="date"
            name="return_date"
            min={formData.travel_date || new Date().toISOString().split('T')[0]}
            value={formData.return_date}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
          />
        </div>

        {/* Car Type Preferred */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
            Preferred Vehicle Type *
          </label>
          <select
            name="car_type"
            value={formData.car_type}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem', backgroundColor: '#FFFFFF' }}
          >
            {CAR_TYPES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Passengers Count */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
            Number of Passengers *
          </label>
          <input
            type="number"
            name="passengers_count"
            required
            min="1"
            max="40"
            value={formData.passengers_count}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
          />
        </div>

        {/* Trip Type */}
        <div style={{ gridColumn: 'span 1' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
            Trip Type
          </label>
          <select
            name="trip_type"
            value={formData.trip_type}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem', backgroundColor: '#FFFFFF' }}
          >
            {TRIP_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Special Requirements & Luggage */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>
          Special Instructions (AC preference, flight numbers, luggage details, multiple stops)
        </label>
        <textarea
          name="service_requirements"
          rows={3}
          placeholder="e.g. Arriving on Indigo 6E 405 at 11:30 AM with 3 large suitcases. Need airport pickup with name placard."
          value={formData.service_requirements}
          onChange={handleChange}
          style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem', resize: 'vertical' }}
        />
      </div>

      {/* Submit Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
          <Shield size={16} color="var(--color-secondary)" />
          <span>Transparent rates, commercial permits, and reliable on-time arrival guaranteed.</span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === 'submitting'}
          icon={<Send size={16} />}
        >
          {status === 'submitting' ? 'Submitting Cab Request...' : 'Submit Car Rental Enquiry'}
        </Button>
      </div>
    </form>
  );
}

export default CarRentalEnquiryForm;
