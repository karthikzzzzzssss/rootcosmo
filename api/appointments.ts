import { createClient } from '@supabase/supabase-js';

declare const process: { env: Record<string, string | undefined> };

type AppointmentRequest = {
  method?: string;
  body?: unknown;
};

type AppointmentResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => AppointmentResponse;
  json: (body: unknown) => void;
  end: () => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export default async function handler(req: AppointmentRequest, res: AppointmentResponse) {
  res.setHeader('Allow', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const body = isRecord(req.body) ? req.body : null;
  const patientName = typeof body?.patient_name === 'string' ? body.patient_name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
  const appointmentDate = typeof body?.appointment_date === 'string' ? body.appointment_date : '';
  const appointmentTime = typeof body?.appointment_time === 'string' ? body.appointment_time.trim() : '';
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!patientName || !emailIsValid || !phone || !appointmentDate || !appointmentTime) {
    return res.status(400).json({ success: false, error: 'Please provide valid contact details and appointment information.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Appointment API is missing Supabase configuration.');
    return res.status(500).json({ success: false, error: 'Booking is temporarily unavailable. Please call the clinic.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const treatmentId = typeof body?.treatment_id === 'string' ? body.treatment_id : null;
  const treatmentName = typeof body?.treatment_name === 'string' ? body.treatment_name : null;
  const notes = typeof body?.notes === 'string' ? body.notes.trim() || null : null;

  const { error } = await supabase.from('appointments').insert({
    patient_name: patientName,
    email,
    phone,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    treatment_id: treatmentId,
    treatment_name: treatmentName,
    notes,
    status: 'pending',
  });

  if (error) {
    console.error('Appointment insert failed:', { code: error.code, message: error.message });
    return res.status(500).json({ success: false, error: 'Unable to save your appointment. Please try again or call the clinic.' });
  }

  return res.status(201).json({ success: true, message: 'Appointment booked successfully' });
}