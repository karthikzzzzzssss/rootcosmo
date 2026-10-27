import { Resend } from 'resend';
import nodemailer from 'nodemailer';
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

  // Only keep treatment_id when it's a real DB UUID. Code-generated services
  // (e.g. "svc-dental-care-15") are not rows in the treatments table and would
  // break the uuid column; the treatment_name below still records the service.
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const rawTreatmentId = typeof body?.treatment_id === 'string' ? body.treatment_id : null;
  const treatmentId = rawTreatmentId && UUID_RE.test(rawTreatmentId) ? rawTreatmentId : null;
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

  let emailSent = false;

  const clinicPhone = process.env.CLINIC_PHONE;
  const clinicEmail = process.env.CLINIC_EMAIL;
  const changeContact = clinicPhone || clinicEmail;

  // Shared message content (used by whichever transport is active).
  const patientNameHtml = escapeHtml(patientName);
  const phoneHtml = escapeHtml(phone);
  const treatmentHtml = treatmentName ? escapeHtml(treatmentName) : null;
  const dateHtml = escapeHtml(appointmentDate);
  const timeHtml = escapeHtml(appointmentTime);
  const notesHtml = notes ? escapeHtml(notes) : null;

  const patientSubject = 'Your RootCosmo Appointment Confirmation';
  const patientText = `Hello ${patientName}, your appointment has been booked for ${appointmentDate} at ${appointmentTime}.${treatmentName ? ` Service: ${treatmentName}.` : ''}${changeContact ? ` To make a change, contact the clinic at ${changeContact}.` : ' To make a change, please contact the clinic.'}`;
  const patientHtml = `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#1f2937">
            <h1 style="color:#5b0fa8;margin-bottom:8px">RootCosmo</h1>
            <p style="margin-top:0;color:#6b7280">RootCosmo Clinic, Hyderabad</p>
            <p>Hello <strong>${patientNameHtml}</strong>,</p>
            <p>Your appointment has been booked. Here are the details:</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              ${treatmentHtml ? `<tr><td style="padding:8px;color:#6b7280">Service</td><td style="padding:8px;font-weight:600">${treatmentHtml}</td></tr>` : ''}
              <tr><td style="padding:8px;color:#6b7280">Date</td><td style="padding:8px;font-weight:600">${dateHtml}</td></tr>
              <tr><td style="padding:8px;color:#6b7280">Time</td><td style="padding:8px;font-weight:600">${timeHtml}</td></tr>
              <tr><td style="padding:8px;color:#6b7280">Phone</td><td style="padding:8px;font-weight:600">${phoneHtml}</td></tr>
              ${notesHtml ? `<tr><td style="padding:8px;color:#6b7280">Notes</td><td style="padding:8px">${notesHtml}</td></tr>` : ''}
            </table>
            ${clinicPhone ? `<p>Clinic contact: <strong>${escapeHtml(clinicPhone)}</strong></p>` : ''}
            <p>If you need to change your appointment, please contact the clinic.</p>
          </div>
        `;
  const clinicSubject = 'New RootCosmo appointment';
  const clinicText = `Patient: ${patientName}\nEmail: ${email}\nPhone: ${phone}\n${treatmentName ? `Service: ${treatmentName}\n` : ''}Date: ${appointmentDate}\nTime: ${appointmentTime}${notes ? `\nNotes: ${notes}` : ''}`;

  // Transport selection. Prefer SMTP (e.g. Hostinger) when configured: it sends
  // from a real authenticated mailbox and needs no Resend domain verification.
  // Fall back to Resend only when SMTP is not configured.
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.EMAIL_FROM || process.env.FROM_EMAIL;

  if (smtpHost && smtpUser && smtpPass) {
    // Most SMTP providers require the From to match the authenticated mailbox.
    const fromHeader = `RootCosmo <${smtpUser}>`;
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      const info = await transporter.sendMail({
        from: fromHeader,
        replyTo: smtpUser,
        to: email,
        subject: patientSubject,
        text: patientText,
        html: patientHtml,
      });

      if (info.accepted && info.accepted.length > 0) {
        emailSent = true;
        console.info('SMTP accepted the patient confirmation email.', { messageId: info.messageId });
      } else {
        console.error('SMTP did not accept the patient confirmation email.', { rejected: info.rejected });
      }

      if (clinicEmail) {
        try {
          await transporter.sendMail({
            from: fromHeader,
            to: clinicEmail,
            subject: clinicSubject,
            text: clinicText,
          });
        } catch (error) {
          console.error('SMTP clinic notification failed:', error instanceof Error ? error.message : 'Unknown email error');
        }
      }
    } catch (error) {
      console.error('SMTP patient confirmation email failed:', error instanceof Error ? error.message : 'Unknown email error');
    }
  } else if (resendKey && resendFrom) {
    const resend = new Resend(resendKey);
    try {
      const result = await resend.emails.send({
        from: resendFrom,
        replyTo: resendFrom,
        to: [email],
        subject: patientSubject,
        text: patientText,
        html: patientHtml,
      });

      if (result.error) {
        console.error('Resend rejected the patient confirmation email:', result.error.message);
      } else if (result.data?.id) {
        emailSent = true;
        console.info('Resend accepted the patient confirmation email.', { emailId: result.data.id });
      } else {
        console.error('Resend returned no ID for the patient confirmation email.');
      }
    } catch (error) {
      console.error('Patient confirmation email request failed:', error instanceof Error ? error.message : 'Unknown email error');
    }

    if (clinicEmail) {
      try {
        const clinicResult = await resend.emails.send({
          from: resendFrom,
          to: [clinicEmail],
          subject: clinicSubject,
          text: clinicText,
        });
        if (clinicResult.error) {
          console.error('Resend rejected the clinic notification email:', clinicResult.error.message);
        }
      } catch (error) {
        console.error('Clinic appointment notification failed:', error instanceof Error ? error.message : 'Unknown email error');
      }
    }
  } else {
    console.error('Appointment saved, but no email transport is configured (set SMTP_* or RESEND_API_KEY + FROM_EMAIL/EMAIL_FROM).');
  }

  return res.status(201).json({
    success: true,
    email_sent: emailSent,
    message: emailSent
      ? 'Appointment booked successfully.'
      : 'Appointment saved, but the confirmation email could not be sent. Please contact the clinic to confirm.',
  });
}