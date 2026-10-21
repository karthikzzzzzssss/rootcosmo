import { Resend } from 'resend';

export interface AppointmentEmailResult {
  patientEmailSent: boolean;
  clinicNotificationSent: boolean;
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

export async function sendAppointmentConfirmation(data: {
  patient_name: string;
  email: string;
  phone: string;
  treatment_name: string | null;
  appointment_date: string;
  appointment_time: string;
  notes: string | null;
}): Promise<AppointmentEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.error('Appointment email configuration is missing RESEND_API_KEY or EMAIL_FROM.');
    return { patientEmailSent: false, clinicNotificationSent: false };
  }

  const resend = new Resend(apiKey);
  const clinicEmail = process.env.CLINIC_EMAIL || 'ku680911@gmail.com';
  const patientName = escapeHtml(data.patient_name);
  const patientEmail = escapeHtml(data.email);
  const phone = escapeHtml(data.phone);
  const treatment = escapeHtml(data.treatment_name || 'General Consultation');
  const appointmentDate = escapeHtml(data.appointment_date);
  const appointmentTime = escapeHtml(data.appointment_time);
  const notes = data.notes ? escapeHtml(data.notes) : '';
  const clinicPhone = process.env.CLINIC_PHONE;
  let patientEmailSent = false;
  let clinicNotificationSent = false;

  try {
    const result = await resend.emails.send({
      from,
      replyTo: from,
      to: data.email,
      subject: 'Appointment Confirmation - RootCosmo Clinic',
      text: `Hello ${data.patient_name}, your appointment is booked for ${data.appointment_date} at ${data.appointment_time}. Service: ${data.treatment_name || 'General Consultation'}.${clinicPhone ? ` Contact the clinic at ${clinicPhone}.` : ''}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#5b0fa8">RootCosmo Clinic</h2>
          <h3>Your appointment is booked</h3>
          <p>Hello <strong>${patientName}</strong>,</p>
          <p>Your appointment has been saved. Here are the details:</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:8px;color:#6b7280">Service</td><td style="padding:8px;font-weight:600">${treatment}</td></tr>
            <tr><td style="padding:8px;color:#6b7280">Date</td><td style="padding:8px;font-weight:600">${appointmentDate}</td></tr>
            <tr><td style="padding:8px;color:#6b7280">Time</td><td style="padding:8px;font-weight:600">${appointmentTime}</td></tr>
            <tr><td style="padding:8px;color:#6b7280">Phone</td><td style="padding:8px;font-weight:600">${phone}</td></tr>
            ${notes ? `<tr><td style="padding:8px;color:#6b7280">Notes</td><td style="padding:8px">${notes}</td></tr>` : ''}
          </table>
          ${clinicPhone ? `<p style="color:#6b7280;font-size:13px">For assistance, contact the clinic at <strong>${escapeHtml(clinicPhone)}</strong>.</p>` : ''}
          <p style="color:#6b7280;font-size:13px">A clinic representative will contact you if any further confirmation is needed.</p>
          <p style="color:#5b0fa8;font-weight:600">RootCosmo Clinic, Hyderabad</p>
        </div>
      `,
    });

    if (result.error) {
      console.error('Resend rejected the patient confirmation email:', result.error.message);
    } else if (result.data?.id) {
      patientEmailSent = true;
    }
  } catch (error) {
    console.error('Patient confirmation email failed:', error instanceof Error ? error.message : 'Unknown email error');
  }

  try {
    const result = await resend.emails.send({
      from,
      to: clinicEmail,
      subject: `New Appointment - ${data.patient_name} on ${data.appointment_date}`,
      html: `
        <div style="font-family:sans-serif;padding:16px">
          <h3 style="color:#5b0fa8">New Appointment Booking</h3>
          <p><strong>Patient:</strong> ${patientName}</p>
          <p><strong>Email:</strong> ${patientEmail}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Service:</strong> ${treatment}</p>
          <p><strong>Date:</strong> ${appointmentDate}</p>
          <p><strong>Time:</strong> ${appointmentTime}</p>
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        </div>
      `,
    });

    if (result.error) {
      console.error('Resend rejected the clinic notification email:', result.error.message);
    } else if (result.data?.id) {
      clinicNotificationSent = true;
    }
  } catch (error) {
    console.error('Clinic notification email failed:', error instanceof Error ? error.message : 'Unknown email error');
  }

  return { patientEmailSent, clinicNotificationSent };
}