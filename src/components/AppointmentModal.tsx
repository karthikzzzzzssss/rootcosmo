import { useState, useLayoutEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import type { Treatment } from '../types';
import { useI18n } from '../i18n/I18nContext';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const APPOINTMENT_ENDPOINT = API_URL ? `${API_URL}/api/appointments` : '/api/appointments';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTreatment?: Treatment | null;
}

const TIME_SLOTS = [
  '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM',
  '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM',
];

export default function AppointmentModal({ isOpen, onClose, selectedTreatment }: AppointmentModalProps) {
  const { t, tt } = useI18n();
  const [form, setForm] = useState({
    patient_name: '',
    email: '',
    phone: '',
    appointment_date: '',
    appointment_time: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setError('');
      setForm({ patient_name: '', email: '', phone: '', appointment_date: '', appointment_time: '', notes: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.patient_name || !form.email || !form.phone || !form.appointment_date || !form.appointment_time) {
      setError(t('pleaseFillAll'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(APPOINTMENT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: form.patient_name,
          email: form.email,
          phone: form.phone,
          appointment_date: form.appointment_date,
          appointment_time: form.appointment_time,
          notes: form.notes || null,
          treatment_id: selectedTreatment?.id ?? null,
          treatment_name: selectedTreatment?.name ?? null,
          category_name: selectedTreatment?.category_name ?? null,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || t('somethingWrong'));
      } else {
        setSuccess(true);
      }
    } catch {
      setError(t('somethingWrong'));
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 rounded-t-2xl"
          style={{ background: 'linear-gradient(135deg, #5b0fa8 0%, #6d28d9 100%)' }}
        >
          <div>
            <h2 className="text-white font-bold text-xl">{t('bookAppointmentModal')}</h2>
            {selectedTreatment && (
              <p className="text-purple-200 text-sm mt-0.5">{tt(selectedTreatment.name)}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-8 flex flex-col items-center text-center">
            <CheckCircle2 className="text-green-500 mb-4" size={56} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('appointmentBooked')}</h3>
            <p className="text-gray-600 text-sm mb-6">
              {t('appointmentBookedMsg')} Please check your <strong>spam/junk folder</strong> if you don't see the confirmation email.
            </p>
            <button
              onClick={onClose}
              className="btn-purple px-8"
            >
              {t('close')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  {t('fullName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="patient_name"
                  value={form.patient_name}
                  onChange={handleChange}
                  placeholder={tt('Your full name')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  {t('phoneLabel')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={tt('+91 XXXXX XXXXX')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                {t('emailLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={tt('your@email.com')}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  {t('date')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="appointment_date"
                  value={form.appointment_date}
                  onChange={handleChange}
                  min={today}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  {t('timeSlot')} <span className="text-red-500">*</span>
                </label>
                <select
                  name="appointment_time"
                  value={form.appointment_time}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="">{t('selectTime')}</option>
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {!selectedTreatment && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  {t('treatmentService')}
                </label>
                <input
                  type="text"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder={tt("Describe what you're looking for...")}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}

            {selectedTreatment && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  {t('additionalNotes')}
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder={tt('Any specific concerns or questions...')}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-purple-700 text-white font-semibold py-3 rounded-full hover:bg-purple-800 transition-colors uppercase tracking-wide text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? t('booking') : t('confirmAppointment')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
