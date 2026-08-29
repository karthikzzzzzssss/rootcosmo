import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendAppointmentConfirmation(data: {
  patient_name: string;
  email: string;
  phone: string;
  treatment_name: string | null;
  appointment_date: string;
  appointment_time: string;
  notes: string | null;
}) {
  const clinicEmail = process.env.CLINIC_EMAIL || 'ku680911@gmail.com';
  const transporter = createTransporter();

  console.log('Sending email to patient:', data.email);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASS set:', !!process.env.SMTP_PASS);

  // Email to patient
  await transporter.sendMail({
    from: `"RootCosmo Clinic" <${process.env.SMTP_USER}>`,
    replyTo: process.env.SMTP_USER,
    to: data.email,
    subject: 'Appointment Confirmation – RootCosmo Clinic',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#5b0fa8">Your Appointment is Confirmed!</h2>
        <p>Hi <strong>${data.patient_name}</strong>,</p>
        <p>Thank you for booking with RootCosmo Clinic. Here are your appointment details:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px;color:#6b7280;font-size:14px">Treatment</td><td style="padding:8px;font-weight:600">${data.treatment_name || 'General Consultation'}</td></tr>
          <tr style="background:#f9fafb"><td style="padding:8px;color:#6b7280;font-size:14px">Date</td><td style="padding:8px;font-weight:600">${data.appointment_date}</td></tr>
          <tr><td style="padding:8px;color:#6b7280;font-size:14px">Time</td><td style="padding:8px;font-weight:600">${data.appointment_time}</td></tr>
          <tr style="background:#f9fafb"><td style="padding:8px;color:#6b7280;font-size:14px">Phone</td><td style="padding:8px;font-weight:600">${data.phone}</td></tr>
          ${data.notes ? `<tr><td style="padding:8px;color:#6b7280;font-size:14px">Notes</td><td style="padding:8px">${data.notes}</td></tr>` : ''}
        </table>
        <p style="color:#6b7280;font-size:13px">If you need to reschedule, please call us at <strong>+91 78423 70707</strong>.</p>
        <p style="color:#5b0fa8;font-weight:600">RootCosmo Clinic, Hyderabad</p>
      </div>
    `,
  });

  console.log('Patient email sent. Sending clinic notification to:', clinicEmail);

  // Notification to clinic
  await transporter.sendMail({
    from: `"RootCosmo Booking" <${process.env.SMTP_USER}>`,
    to: clinicEmail,
    subject: `New Appointment – ${data.patient_name} on ${data.appointment_date}`,
    html: `
      <div style="font-family:sans-serif;padding:16px">
        <h3 style="color:#5b0fa8">New Appointment Booking</h3>
        <p><strong>Patient:</strong> ${data.patient_name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Treatment:</strong> ${data.treatment_name || 'General Consultation'}</p>
        <p><strong>Date:</strong> ${data.appointment_date}</p>
        <p><strong>Time:</strong> ${data.appointment_time}</p>
        ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
      </div>
    `,
  });
}
