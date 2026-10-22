import { Plus, Trash2, User } from 'lucide-react';

export default function TravelerFields({ travelers, onChange, maxTravelers = 10 }) {
  const handleAddTraveler = () => {
    if (travelers.length >= maxTravelers) return;
    onChange([
      ...travelers,
      { name: '', age: '', gender: 'Male', id_type: 'Aadhaar', id_number: '' }
    ]);
  };

  const handleRemoveTraveler = (index) => {
    if (travelers.length <= 1) return;
    const updated = travelers.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...travelers];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {travelers.map((traveler, index) => (
        <div
          key={index}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '16px 20px',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--color-navy)', fontSize: '0.95rem' }}>
              <User size={18} color="var(--color-teal)" />
              <span>Traveler #{index + 1} {index === 0 ? '(Lead Passenger)' : ''}</span>
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => handleRemoveTraveler(index)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#DC2626',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '4px' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Subrata Mukherjee"
                value={traveler.name}
                onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '4px' }}>
                Age
              </label>
              <input
                type="number"
                min="1"
                max="110"
                placeholder="e.g. 34"
                value={traveler.age}
                onChange={(e) => handleFieldChange(index, 'age', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '4px' }}>
                Gender
              </label>
              <select
                value={traveler.gender}
                onChange={(e) => handleFieldChange(index, 'gender', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      {travelers.length < maxTravelers && (
        <button
          type="button"
          onClick={handleAddTraveler}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1.5px dashed var(--color-teal)',
            backgroundColor: 'rgba(22, 124, 128, 0.04)',
            color: 'var(--color-teal)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Plus size={16} /> Add Another Traveler
        </button>
      )}
    </div>
  );
}
