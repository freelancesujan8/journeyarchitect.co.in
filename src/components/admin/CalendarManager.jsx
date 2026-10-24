import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Check,
  CalendarCheck,
  ListFilter,
  Grid,
  Users,
  Bell,
  Sparkles,
  RefreshCw,
  Bookmark
} from 'lucide-react';
import { ApiClient } from '../../api/client';

const CATEGORIES = [
  { id: 'all', label: 'All Categories', color: '#64748B' },
  { id: 'event', label: 'Tour & Event', color: '#2563EB', icon: CalendarIcon },
  { id: 'reminder', label: 'Follow-up & Reminder', color: '#D97706', icon: Bell },
  { id: 'note', label: 'Operations & Note', color: '#7C3AED', icon: FileText },
  { id: 'meeting', label: 'Client Meeting', color: '#DB2777', icon: Users },
  { id: 'holiday', label: 'Holiday / Peak Day', color: '#059669', icon: Sparkles }
];

const PRIORITIES = [
  { id: 'low', label: 'Low', badgeColor: '#64748B', lightBg: '#F1F5F9' },
  { id: 'normal', label: 'Normal', badgeColor: '#2563EB', lightBg: '#EFF6FF' },
  { id: 'high', label: 'High', badgeColor: '#D97706', lightBg: '#FFFBEB' },
  { id: 'urgent', label: 'Urgent', badgeColor: '#DC2626', lightBg: '#FEF2F2' }
];

const PRESET_COLORS = [
  '#2563EB', // Blue
  '#059669', // Emerald
  '#D97706', // Amber
  '#7C3AED', // Purple
  '#DB2777', // Pink
  '#DC2626', // Red
  '#0D9488', // Teal
  '#475569'  // Slate
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarManager({ token, onShowToast }) {
  // Navigation State
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'agenda'

  // Data State
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  // 1. Date Click Popup (Day Detail Modal)
  const [selectedDate, setSelectedDate] = useState(null); // 'YYYY-MM-DD' string
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  // 2. Add / Edit Event Form Modal
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [savingEvent, setSavingEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    event_date: '',
    start_time: '',
    end_time: '',
    is_all_day: 1,
    category: 'event',
    priority: 'normal',
    status: 'pending',
    description: '',
    color: '#2563EB'
  });

  // Load events for the selected month
  const fetchMonthEvents = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
      const res = await ApiClient.getAdminCalendarEvents(token, {
        month: monthStr,
        category: selectedCategory,
        status: selectedStatus,
        search: searchQuery
      });
      if (res && res.success) {
        setEvents(res.events || []);
      }

      // Fetch summary stats
      const sumRes = await ApiClient.getAdminCalendarSummary(token);
      if (sumRes && sumRes.success) {
        setSummary(sumRes.summary);
      }
    } catch (err) {
      console.error('Error fetching calendar data:', err);
      if (onShowToast) onShowToast('Failed to load calendar events: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthEvents();
  }, [token, currentYear, currentMonth, selectedCategory, selectedStatus, searchQuery]);

  // Navigate Months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleGoToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Build Calendar Grid Days
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const cells = [];

    // 1. Previous month leading days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      cells.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }

    // 2. Current month days
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday =
        today.getFullYear() === currentYear &&
        today.getMonth() === currentMonth &&
        today.getDate() === day;

      cells.push({
        dayNum: day,
        dateStr,
        isCurrentMonth: true,
        isToday
      });
    }

    // 3. Next month trailing days to complete 35 or 42 grid cells
    const remainingCells = (7 - (cells.length % 7)) % 7;
    const totalNeeded = cells.length + remainingCells < 35 ? 35 - cells.length : remainingCells;
    for (let day = 1; day <= totalNeeded; day++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({
        dayNum: day,
        dateStr,
        isCurrentMonth: false,
        isNextMonth: true
      });
    }

    return cells;
  }, [currentYear, currentMonth, today]);

  // Map events to date strings for quick lookup
  const eventsByDate = useMemo(() => {
    const map = {};
    for (const ev of events) {
      if (!map[ev.event_date]) {
        map[ev.event_date] = [];
      }
      map[ev.event_date].push(ev);
    }
    return map;
  }, [events]);

  // Handle Day Click -> Open Date Click Popup Modal
  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    setIsDayModalOpen(true);
  };

  // Open Event Create Modal (optionally for a specific date)
  const handleOpenCreateModal = (dateStr = null) => {
    const targetDate = dateStr || selectedDate || `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setEditingEvent(null);
    setEventForm({
      title: '',
      event_date: targetDate,
      start_time: '',
      end_time: '',
      is_all_day: 1,
      category: 'event',
      priority: 'normal',
      status: 'pending',
      description: '',
      color: '#2563EB'
    });
    setIsEventFormOpen(true);
  };

  // Open Event Edit Modal
  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      event_date: event.event_date,
      start_time: event.start_time || '',
      end_time: event.end_time || '',
      is_all_day: event.is_all_day ? 1 : 0,
      category: event.category || 'event',
      priority: event.priority || 'normal',
      status: event.status || 'pending',
      description: event.description || '',
      color: event.color || '#2563EB'
    });
    setIsEventFormOpen(true);
  };

  // Submit Event Form (Save / Update)
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) {
      alert('Please enter an event title');
      return;
    }
    if (!eventForm.event_date) {
      alert('Please select an event date');
      return;
    }

    setSavingEvent(true);
    try {
      if (editingEvent) {
        const res = await ApiClient.updateAdminCalendarEvent(token, editingEvent.id, eventForm);
        if (res.success) {
          if (onShowToast) onShowToast('Calendar event updated successfully');
          setIsEventFormOpen(false);
          await fetchMonthEvents();
        }
      } else {
        const res = await ApiClient.createAdminCalendarEvent(token, eventForm);
        if (res.success) {
          if (onShowToast) onShowToast('Calendar event created successfully');
          setIsEventFormOpen(false);
          await fetchMonthEvents();
        }
      }
    } catch (err) {
      console.error('Error saving event:', err);
      alert('Failed to save event: ' + err.message);
    } finally {
      setSavingEvent(false);
    }
  };

  // Delete Event
  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    try {
      const res = await ApiClient.deleteAdminCalendarEvent(token, id);
      if (res.success) {
        if (onShowToast) onShowToast('Calendar entry removed');
        await fetchMonthEvents();
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event: ' + err.message);
    }
  };

  // Toggle Event Status (Pending / Completed)
  const handleToggleStatus = async (id) => {
    try {
      const res = await ApiClient.toggleAdminCalendarEventStatus(token, id);
      if (res.success) {
        await fetchMonthEvents();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('Failed to update status: ' + err.message);
    }
  };

  // Events for currently selected date popup
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return eventsByDate[selectedDate] || [];
  }, [selectedDate, eventsByDate]);

  // Formatted selected date string (e.g. "Saturday, 24 October 2026")
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return '';
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  // Relative badge for selected date (e.g., "Today", "Tomorrow")
  const selectedDateRelativeLabel = useMemo(() => {
    if (!selectedDate) return null;
    const [y, m, d] = selectedDate.split('-').map(Number);
    const target = new Date(y, m - 1, d);
    const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffTime = target.getTime() - todayClean.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
    return null;
  }, [selectedDate, today]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* ================= TOP METRIC CARDS ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem'
        }}
      >
        {/* Metric 1: Month Events */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB'
            }}
          >
            <CalendarIcon size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Events This Month
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary, #0E2235)', marginTop: '2px' }}>
              {summary?.monthEvents ?? events.length}
            </div>
          </div>
        </div>

        {/* Metric 2: Today's Schedule */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981'
            }}
          >
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Today's Schedule
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
              {summary?.todayEvents ?? 0}
            </div>
          </div>
        </div>

        {/* Metric 3: Pending Reminders */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: '#FFFBEB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706'
            }}
          >
            <Bell size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pending Reminders
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#B45309', marginTop: '2px' }}>
              {summary?.pendingReminders ?? 0}
            </div>
          </div>
        </div>

        {/* Metric 4: Urgent Items */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DC2626'
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Urgent Items
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#DC2626', marginTop: '2px' }}>
              {summary?.urgentItems ?? 0}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CALENDAR CARD ================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Calendar Card Header & Navigation Bar */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            backgroundColor: '#FAFCFD'
          }}
        >
          {/* Month / Year Title & Fast Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={handlePrevMonth}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Previous Month"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={handleNextMonth}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Next Month"
              >
                <ChevronRight size={18} />
              </button>

              <button
                type="button"
                onClick={handleGoToToday}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-primary, #0E2235)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Jump to Today"
              >
                <CalendarIcon size={14} color="var(--color-secondary, #167C80)" />
                <span>Today</span>
              </button>
            </div>

            {/* Quick Month & Year Dropdown Selectors */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(parseInt(e.target.value, 10))}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--color-primary, #0E2235)',
                  cursor: 'pointer'
                }}
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>

              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value, 10))}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--color-primary, #0E2235)',
                  cursor: 'pointer'
                }}
              >
                {Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i).map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Toolbar: View Toggle & Add Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* View Switcher: Grid vs Agenda */}
            <div style={{ display: 'flex', backgroundColor: '#EDF2F7', padding: '3px', borderRadius: '8px' }}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--color-primary, #0E2235)' : '#64748B',
                  boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                <Grid size={15} />
                <span>Month Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('agenda')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: viewMode === 'agenda' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'agenda' ? 'var(--color-primary, #0E2235)' : '#64748B',
                  boxShadow: viewMode === 'agenda' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                <ListFilter size={15} />
                <span>Agenda List</span>
              </button>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={fetchMonthEvents}
              disabled={loading}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              title="Refresh Calendar"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>

            {/* Add Event Button */}
            <button
              type="button"
              onClick={() => handleOpenCreateModal()}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-secondary, #167C80)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(22, 124, 128, 0.3)'
              }}
            >
              <Plus size={18} />
              <span>Add Event / Note</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {CATEGORIES.map((cat) => {
              const isSel = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: isSel ? 700 : 500,
                    backgroundColor: isSel ? cat.color : '#F1F5F9',
                    color: isSel ? '#FFFFFF' : '#475569',
                    border: '1px solid',
                    borderColor: isSel ? cat.color : '#E2E8F0',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search events, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 32px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.825rem'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94A3B8',
                  padding: 0
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ================= VIEW 1: MONTH GRID VIEW ================= */}
        {viewMode === 'grid' && (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <div style={{ minWidth: '760px', width: '100%' }}>
              {/* Day Name Header Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  backgroundColor: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: '#64748B'
                }}
              >
                {DAY_NAMES.map((dayName, idx) => (
                  <div
                    key={dayName}
                    style={{
                      padding: '10px 0',
                      borderRight: idx < 6 ? '1px solid #E2E8F0' : 'none',
                      color: idx === 0 || idx === 6 ? '#0E2235' : '#64748B'
                    }}
                  >
                    {dayName}
                  </div>
                ))}
              </div>

              {/* Calendar Grid Cells */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  backgroundColor: '#E2E8F0',
                  gap: '1px' // Creates clean grid lines
                }}
              >
                {calendarGrid.map((cell, idx) => {
                  const dayEvents = eventsByDate[cell.dateStr] || [];
                  const isCurrentMonth = cell.isCurrentMonth;
                  const isToday = cell.isToday;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleDayClick(cell.dateStr)}
                      style={{
                        minHeight: '115px',
                        backgroundColor: isToday ? '#F0FDF4' : isCurrentMonth ? '#FFFFFF' : '#FAFAFA',
                        padding: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (!isToday) e.currentTarget.style.backgroundColor = '#F8FAFC';
                      }}
                      onMouseLeave={(e) => {
                        if (!isToday) e.currentTarget.style.backgroundColor = isCurrentMonth ? '#FFFFFF' : '#FAFAFA';
                      }}
                      title={`Click to view notes and events for ${cell.dateStr}`}
                    >
                      {/* Day Number Header */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '6px'
                        }}
                      >
                        <span
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem',
                            fontWeight: isToday ? 800 : isCurrentMonth ? 700 : 400,
                            color: isToday ? '#FFFFFF' : isCurrentMonth ? '#1E293B' : '#94A3B8',
                            backgroundColor: isToday ? 'var(--color-secondary, #167C80)' : 'transparent',
                            boxShadow: isToday ? '0 2px 6px rgba(22, 124, 128, 0.4)' : 'none'
                          }}
                        >
                          {cell.dayNum}
                        </span>

                        {isToday && (
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              color: '#059669',
                              backgroundColor: '#DCFCE7',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              textTransform: 'uppercase'
                            }}
                          >
                            Today
                          </span>
                        )}

                        {dayEvents.length > 0 && !isToday && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              color: '#64748B'
                            }}
                          >
                            {dayEvents.length} {dayEvents.length === 1 ? 'item' : 'items'}
                          </span>
                        )}
                      </div>

                      {/* Event Chips List (Up to 3 chips) */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                        {dayEvents.slice(0, 3).map((ev) => {
                          const isCompleted = ev.status === 'completed';
                          const isUrgent = ev.priority === 'urgent';

                          return (
                            <div
                              key={ev.id}
                              style={{
                                fontSize: '0.72rem',
                                padding: '3px 6px',
                                borderRadius: '4px',
                                backgroundColor: isCompleted ? '#F1F5F9' : `${ev.color || '#2563EB'}18`,
                                borderLeft: `3px solid ${isCompleted ? '#94A3B8' : ev.color || '#2563EB'}`,
                                color: isCompleted ? '#64748B' : '#0F172A',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textDecoration: isCompleted ? 'line-through' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title={`${ev.title} (${ev.category}) - Click date to manage`}
                            >
                              {isUrgent && (
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EF4444', flexShrink: 0 }} />
                              )}
                              {ev.start_time && (
                                <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 500, flexShrink: 0 }}>
                                  {ev.start_time}
                                </span>
                              )}
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {ev.title}
                              </span>
                            </div>
                          );
                        })}

                        {dayEvents.length > 3 && (
                          <div
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              color: 'var(--color-secondary, #167C80)',
                              padding: '2px 4px',
                              textAlign: 'center',
                              backgroundColor: 'rgba(22, 124, 128, 0.08)',
                              borderRadius: '4px'
                            }}
                          >
                            +{dayEvents.length - 3} more entries
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: AGENDA / TIMELINE LIST VIEW ================= */}
        {viewMode === 'agenda' && (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                <CalendarIcon size={44} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary, #0E2235)' }}>
                  No Events or Notes Found
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
                  There are no scheduled events matching your current filters for this month.
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenCreateModal()}
                  style={{
                    marginTop: '1rem',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-secondary, #167C80)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} />
                  <span>Create First Entry</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {events.map((ev) => {
                  const isCompleted = ev.status === 'completed';
                  const isUrgent = ev.priority === 'urgent';
                  const priorityMeta = PRIORITIES.find((p) => p.id === ev.priority) || PRIORITIES[1];

                  return (
                    <div
                      key={ev.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        padding: '1.25rem',
                        borderRadius: '10px',
                        backgroundColor: isCompleted ? '#F8FAFC' : '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderLeft: `4px solid ${ev.color || '#2563EB'}`,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        gap: '1rem',
                        flexWrap: 'wrap'
                      }}
                    >
                      {/* Left: Date Badge & Content */}
                      <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '260px' }}>
                        {/* Date Box */}
                        <div
                          style={{
                            minWidth: '70px',
                            padding: '8px',
                            borderRadius: '8px',
                            backgroundColor: '#F1F5F9',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                            {new Date(ev.event_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary, #0E2235)', lineHeight: 1.1 }}>
                            {ev.event_date.split('-')[2]}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>
                            {new Date(ev.event_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                        </div>

                        {/* Event Details */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                            {/* Category Badge */}
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: `${ev.color || '#2563EB'}15`,
                                color: ev.color || '#2563EB'
                              }}
                            >
                              {ev.category}
                            </span>

                            {/* Priority Badge */}
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: priorityMeta.lightBg,
                                color: priorityMeta.badgeColor
                              }}
                            >
                              {priorityMeta.label} Priority
                            </span>

                            {/* Time Badge */}
                            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={13} />
                              <span>{ev.is_all_day ? 'All Day' : `${ev.start_time || 'TBD'} ${ev.end_time ? `- ${ev.end_time}` : ''}`}</span>
                            </span>
                          </div>

                          <h4
                            style={{
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: isCompleted ? '#64748B' : 'var(--color-primary, #0E2235)',
                              textDecoration: isCompleted ? 'line-through' : 'none',
                              margin: '0 0 4px 0'
                            }}
                          >
                            {ev.title}
                          </h4>

                          {ev.description && (
                            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '4px 0 0 0', whiteSpace: 'pre-line' }}>
                              {ev.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(ev.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: isCompleted ? '#ECFDF5' : '#FFFFFF',
                            color: isCompleted ? '#059669' : '#475569',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                        >
                          <CheckCircle2 size={15} color={isCompleted ? '#059669' : '#94A3B8'} />
                          <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(ev)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: '#FFFFFF',
                            color: '#1E40AF',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Edit"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #FECACA',
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL 1: DATE CLICK POPUP (DAY DETAILS) ================= */}
      {isDayModalOpen && (
        <div
          onClick={() => setIsDayModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 24, 38, 0.75)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            overflowY: 'auto'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary, #0E2235)', margin: 0 }}>
                    {formattedSelectedDate}
                  </h3>
                  {selectedDateRelativeLabel && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: '#059669',
                        backgroundColor: '#DCFCE7',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {selectedDateRelativeLabel}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                  {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'entry' : 'entries'} scheduled
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    handleOpenCreateModal(selectedDate);
                  }}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-secondary, #167C80)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} />
                  <span>Add To This Date</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDayModalOpen(false)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#F1F5F9',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: Events List */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {selectedDateEvents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748B' }}>
                  <CalendarCheck size={42} color="#CBD5E1" style={{ margin: '0 auto 10px auto' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', margin: 0 }}>
                    No Events or Notes for This Date
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '4px', maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto' }}>
                    Click below to create a tour schedule, client reminder, or personal memo for {selectedDate}.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenCreateModal(selectedDate)}
                    style={{
                      marginTop: '1rem',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-secondary, #167C80)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={16} />
                    <span>Create Entry for {selectedDate}</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {selectedDateEvents.map((ev) => {
                    const isCompleted = ev.status === 'completed';
                    const priorityMeta = PRIORITIES.find((p) => p.id === ev.priority) || PRIORITIES[1];

                    return (
                      <div
                        key={ev.id}
                        style={{
                          borderRadius: '10px',
                          border: '1px solid #E2E8F0',
                          borderLeft: `4px solid ${ev.color || '#2563EB'}`,
                          backgroundColor: isCompleted ? '#F8FAFC' : '#FFFFFF',
                          padding: '1rem',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.6rem'
                        }}
                      >
                        {/* Meta header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: `${ev.color || '#2563EB'}15`,
                                color: ev.color || '#2563EB'
                              }}
                            >
                              {ev.category}
                            </span>

                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: priorityMeta.lightBg,
                                color: priorityMeta.badgeColor
                              }}
                            >
                              {priorityMeta.label} Priority
                            </span>

                            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '4px' }}>
                              <Clock size={13} />
                              <span>{ev.is_all_day ? 'All Day' : `${ev.start_time || 'TBD'} ${ev.end_time ? `- ${ev.end_time}` : ''}`}</span>
                            </span>
                          </div>

                          {/* Quick Toggle Status */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(ev.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: isCompleted ? '#059669' : '#64748B',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: isCompleted ? '#ECFDF5' : '#F1F5F9'
                            }}
                          >
                            <CheckCircle2 size={14} color={isCompleted ? '#059669' : '#94A3B8'} />
                            <span>{isCompleted ? 'Completed' : 'Pending'}</span>
                          </button>
                        </div>

                        {/* Title */}
                        <div
                          style={{
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: isCompleted ? '#64748B' : 'var(--color-primary, #0E2235)',
                            textDecoration: isCompleted ? 'line-through' : 'none'
                          }}
                        >
                          {ev.title}
                        </div>

                        {/* Description / Notes */}
                        {ev.description && (
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: '#334155',
                              backgroundColor: '#F8FAFC',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid #E2E8F0',
                              whiteSpace: 'pre-line',
                              lineHeight: 1.45
                            }}
                          >
                            {ev.description}
                          </div>
                        )}

                        {/* Card Action Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', paddingTop: '4px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              handleOpenEditModal(ev);
                            }}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: '#FFFFFF',
                              color: '#1E40AF',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Edit3 size={13} />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(ev.id, ev.title)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: '1px solid #FECACA',
                              backgroundColor: '#FEF2F2',
                              color: '#DC2626',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#F8FAFC',
                borderBottomLeftRadius: '16px',
                borderBottomRightRadius: '16px'
              }}
            >
              <button
                type="button"
                onClick={() => setIsDayModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handleOpenCreateModal(selectedDate)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-secondary, #167C80)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} />
                <span>Add Another Entry</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ADD / EDIT EVENT FORM MODAL ================= */}
      {isEventFormOpen && (
        <div
          onClick={() => setIsEventFormOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 24, 38, 0.75)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            overflowY: 'auto'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary, #0E2235)', margin: 0 }}>
                  {editingEvent ? 'Edit Calendar Entry' : 'Add New Calendar Entry'}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                  Save reminders, client notes, tour departures, and events
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEventFormOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary, #0E2235)', marginBottom: '4px' }}>
                  Title / Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Follow-up: Advance Payment / Tour Departure"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Date & All-Day Switch */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary, #0E2235)', marginBottom: '4px' }}>
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventForm.event_date}
                    onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ paddingTop: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={eventForm.is_all_day === 1 || eventForm.is_all_day === true}
                      onChange={(e) => setEventForm({ ...eventForm, is_all_day: e.target.checked ? 1 : 0 })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span>All-Day Entry</span>
                  </label>
                </div>
              </div>

              {/* Start & End Time (if not all day) */}
              {!eventForm.is_all_day && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary, #0E2235)', marginBottom: '4px' }}>
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={eventForm.start_time}
                      onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary, #0E2235)', marginBottom: '4px' }}>
                      End Time (Optional)
                    </label>
                    <input
                      type="time"
                      value={eventForm.end_time}
                      onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Category & Priority */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary, #0E2235)', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      const matched = CATEGORIES.find((c) => c.id === cat);
                      setEventForm({
                        ...eventForm,
                        category: cat,
                        color: matched && matched.color ? matched.color : eventForm.color
                      });
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="event">📅 Tour & Event</option>
                    <option value="reminder">🔔 Follow-up & Reminder</option>
                    <option value="note">📝 Operations & Note</option>
                    <option value="meeting">👥 Client Meeting</option>
                    <option value="holiday">✨ Holiday / Peak Day</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary, #0E2235)', marginBottom: '4px' }}>
                    Priority Level
                  </label>
                  <select
                    value={eventForm.priority}
                    onChange={(e) => setEventForm({ ...eventForm, priority: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="low">Low Priority</option>
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">🚨 Urgent Priority</option>
                  </select>
                </div>
              </div>

              {/* Status & Color Preset */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary, #0E2235)', marginBottom: '4px' }}>
                    Status
                  </label>
                  <select
                    value={eventForm.status}
                    onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="pending">⏳ Pending / In-Progress</option>
                    <option value="completed">✅ Completed</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary, #0E2235)', marginBottom: '6px' }}>
                    Badge Color Accent
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {PRESET_COLORS.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setEventForm({ ...eventForm, color: col })}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: col,
                          border: eventForm.color === col ? '3px solid #0E2235' : '1px solid #CBD5E1',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          padding: 0
                        }}
                      >
                        {eventForm.color === col && <Check size={12} strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description / Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary, #0E2235)', marginBottom: '4px' }}>
                  Details & Notes (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Add notes, client contact numbers, agenda items, hotel names, or checklist instructions..."
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={() => setIsEventFormOpen(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingEvent}
                  style={{
                    padding: '9px 22px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-secondary, #167C80)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: savingEvent ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 6px rgba(22, 124, 128, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {savingEvent ? 'Saving...' : editingEvent ? 'Save Changes' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarManager;
