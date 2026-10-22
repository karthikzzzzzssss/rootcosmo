const assert = require('node:assert/strict');
const http = require('node:http');
const test = require('node:test');

process.env.SUPABASE_URL = 'https://supabase.test';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.CLINIC_EMAIL = 'clinic@example.com';
process.env.CLINIC_PHONE = '+1 555 0100';
process.env.RESEND_API_KEY = 're_test_placeholder';
process.env.EMAIL_FROM = 'RootCosmo <appointments@send.rootcosmo.com>';

const requests = [];
let respondToResend;
global.fetch = async (input, init = {}) => {
  const url = new URL(input instanceof URL ? input.href : typeof input === 'string' ? input : input.url);
  requests.push({ url, init });

  if (url.hostname === 'supabase.test') {
    return new Response(JSON.stringify({ id: 'appointment-test-id' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', 'Content-Range': '0-0/*' },
    });
  }

  if (url.hostname === 'api.resend.com') {
    return respondToResend(url, init);
  }

  throw new Error(`Unexpected outbound request to ${url.hostname}`);
};

const express = require('express');
const routes = require('../dist/routes').default;
const { sendAppointmentConfirmation } = require('../dist/lib/email');
const app = express();
app.use(express.json());
app.use('/api', routes);

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

test.beforeEach(() => {
  requests.length = 0;
  process.env.RESEND_API_KEY = 're_test_placeholder';
  process.env.EMAIL_FROM = 'RootCosmo <appointments@send.rootcosmo.com>';
  respondToResend = async () => new Response(JSON.stringify({ id: 'resend-test-id' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});

function appointment(overrides = {}) {
  return {
    patient_name: 'Asha Patient',
    email: 'customer@example.com',
    phone: '+91 90000 00000',
    appointment_date: '2026-11-05',
    appointment_time: '10:30 AM',
    treatment_id: 'treatment-1',
    treatment_name: 'Dental Care',
    notes: null,
    ...overrides,
  };
}

function postAppointment(body) {
  return new Promise((resolve, reject) => {
    const request = http.request(`${baseUrl}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, response => {
      let responseBody = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { responseBody += chunk; });
      response.on('end', () => resolve({ status: response.statusCode, body: JSON.parse(responseBody) }));
    });
    request.on('error', reject);
    request.end(JSON.stringify(body));
  });
}

function appointmentInsertRequests() {
  return requests.filter(({ url }) => url.hostname === 'supabase.test' && url.pathname.endsWith('/appointments'));
}

function resendRequests() {
  return requests.filter(({ url }) => url.hostname === 'api.resend.com');
}

test('rejects an invalid customer email before inserting or sending', async () => {
  const result = await postAppointment(appointment({ email: 'not-an-email' }));

  assert.equal(result.status, 400);
  assert.equal(result.body.success, false);
  assert.equal(appointmentInsertRequests().length, 0);
  assert.equal(resendRequests().length, 0);
});

test('mailer rejects an invalid recipient before calling Resend', async () => {
  const result = await sendAppointmentConfirmation(appointment({ email: 'invalid' }));

  assert.equal(result.patientEmailSent, false);
  assert.equal(result.clinicNotificationSent, false);
  assert.equal(resendRequests().length, 0);
});

test('sends the confirmation to the submitted customer and keeps the clinic notification separate', async () => {
  respondToResend = async (_url, init) => {
    const message = JSON.parse(init.body);
    if (message.to.includes('customer@example.com')) {
      return new Response(JSON.stringify({ id: 'patient-message-id' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({
      name: 'validation_error',
      message: 'clinic notification unavailable',
    }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const result = await postAppointment(appointment({ patient_name: '<Asha>' }));
  const sentMessages = resendRequests().map(({ init }) => JSON.parse(init.body));

  assert.equal(result.status, 201);
  assert.equal(result.body.success, true);
  assert.equal(result.body.email_sent, true);
  assert.equal(appointmentInsertRequests().length, 1);
  assert.deepEqual(sentMessages[0].to, ['customer@example.com']);
  assert.deepEqual(sentMessages[1].to, ['clinic@example.com']);
  assert.match(sentMessages[0].html, /&lt;Asha&gt;/);
  assert.match(sentMessages[0].html, /Dental Care/);
  assert.match(sentMessages[0].text, /2026-11-05 at 10:30 AM/);
});

test('keeps the appointment saved and reports email failure when Resend rejects the patient message', async () => {
  respondToResend = async (_url, init) => {
    const message = JSON.parse(init.body);
    if (message.to.includes('customer@example.com')) {
      return new Response(JSON.stringify({
        name: 'validation_error',
        message: 'The sender domain is not verified',
      }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ id: 'clinic-message-id' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const result = await postAppointment(appointment());

  assert.equal(result.status, 201);
  assert.equal(result.body.success, true);
  assert.equal(result.body.email_sent, false);
  assert.match(result.body.message, /appointment is saved|Appointment saved/i);
  assert.equal(appointmentInsertRequests().length, 1);
});

test('keeps the appointment saved when the Resend HTTPS request throws', async () => {
  respondToResend = async () => {
    throw new Error('simulated network failure');
  };

  const result = await postAppointment(appointment());

  assert.equal(result.status, 201);
  assert.equal(result.body.success, true);
  assert.equal(result.body.email_sent, false);
  assert.equal(appointmentInsertRequests().length, 1);
});

test('does not attempt email delivery when Resend configuration is missing', async () => {
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_FROM;

  const result = await postAppointment(appointment());

  assert.equal(result.status, 201);
  assert.equal(result.body.success, true);
  assert.equal(result.body.email_sent, false);
  assert.equal(appointmentInsertRequests().length, 1);
  assert.equal(resendRequests().length, 0);
});