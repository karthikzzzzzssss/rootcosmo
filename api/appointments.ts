import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

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

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character);
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

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  let emailSent = false;

  if (smtpUser && smtpPass) {
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const fromEmail = process.env.SMTP_FROM_EMAIL || smtpUser;
    const safeName = escapeHtml(patientName);
    const safePhone = escapeHtml(phone);
    const safeTreatment = escapeHtml(treatmentName || 'General Consultation');
    const safeDate = escapeHtml(appointmentDate);
    const safeTime = escapeHtml(appointmentTime);
    const safeNotes = notes ? escapeHtml(notes) : '';
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: smtpPort,
      secure: smtpPort === 465,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
      auth: { user: smtpUser, pass: smtpPass },
    });

    try {
      await transporter.sendMail({
        from: `"RootCosmo Clinic" <${fromEmail}>`,
        replyTo: fromEmail,
        to: email,
        subject: 'Appointment received - RootCosmo Clinic',
        text: `Hello ${patientName}, we received your appointment request for ${appointmentDate} at ${appointmentTime}. The clinic will contact you to confirm.`,
        html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px"><h2 style="color:#5b0fa8">Appointment request received</h2><p>Hello <strong>${safeName}</strong>,</p><p>We received your appointment request. The clinic will contact you to confirm it.</p><table style="width:100%;border-collapse:collapse"><tr><td style="padding:8px;color:#6b7280">Service</td><td style="padding:8px">${safeTreatment}</td></tr><tr><td style="padding:8px;color:#6b7280">Date</td><td style="padding:8px">${safeDate}</td></tr><tr><td style="padding:8px;color:#6b7280">Time</td><td style="padding:8px">${safeTime}</td></tr><tr><td style="padding:8px;color:#6b7280">Phone</td><td style="padding:8px">${safePhone}</td></tr>${safeNotes ? `<tr><td style="padding:8px;color:#6b7280">Notes</td><td style="padding:8px">${safeNotes}</td></tr>` : ''}</table><p style="color:#5b0fa8;font-weight:600">RootCosmo Clinic, Hyderabad</p></div>`,
      });
      emailSent = true;
    } catch (mailError) {
      console.error('Appointment confirmation email failed:', mailError instanceof Error ? mailError.message : 'Unknown mail error');
    }

    const clinicEmail = process.env.CLINIC_EMAIL;
    if (clinicEmail) {
      try {
        await transporter.sendMail({
          from: `"RootCosmo Booking" <${fromEmail}>`,
          to: clinicEmail,
          subject: 'New appointment request',
          text: `Patient: ${patientName}\nEmail: ${email}\nPhone: ${phone}\nService: ${treatmentName || 'General Consultation'}\nDate: ${appointmentDate}\nTime: ${appointmentTime}${notes ? `\nNotes: ${notes}` : ''}`,
        });
      } catch (mailError) {
        console.error('Clinic appointment notification failed:', mailError instanceof Error ? mailError.message : 'Unknown mail error');
      }
    }
  } else {
    console.error('Appointment saved, but SMTP_USER or SMTP_PASS is not configured.');
  }

  return res.status(201).json({ success: true, email_sent: emailSent, message: 'Appointment booked successfully' });
}