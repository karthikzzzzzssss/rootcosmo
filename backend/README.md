# RootCosmo Backend

## Commands

Run these commands from the `backend` directory:

```sh
npm install
npm test
npm run build
npm start
```

`npm test` builds the TypeScript backend and exercises the real Express appointment route with mocked Supabase and Resend HTTP requests. Tests do not create production records or send real email.

## Render Configuration

The Render web service runs from the `backend` directory on the `main` branch. Its build command is `npm install && npm run build`; its start command is `npm start`.

Configure these Render environment variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes for confirmations | Private Resend API key. Keep it in Render, never in source control or a `VITE_*` variable. |
| `EMAIL_FROM` | Yes for confirmations | Sender in the format `RootCosmo <appointments@verified-domain.example>`. The domain must be verified in Resend. |
| `SUPABASE_URL` | Yes | Supabase project URL used by the API. |
| `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY` | Yes, one of them | Database key used by the backend. Prefer the service-role key in Render and keep it private. |
| `CLINIC_EMAIL` | No | Clinic booking notification recipient. Defaults to the existing clinic address in the email utility. |
| `CLINIC_PHONE` | No | Clinic phone shown in the customer confirmation when configured. |
| `FRONTEND_URL` | No | CORS origin. Defaults to `https://rootcosmo.vercel.app`. |
| `PORT` | No | Render supplies this automatically. |

The frontend's `VITE_API_URL` is configured in Vercel and should point to the Render API origin. The Vercel `/api/appointments` fallback also uses `RESEND_API_KEY` and `EMAIL_FROM`; if that fallback is enabled, provide those variables in Vercel as well as in Render.

## Sender Verification And Delivery

The configured sender currently uses `appointments@send.rootcosmo.com`. The domain `send.rootcosmo.com` must show **Verified** in Resend before production sending can work. Publish the exact DNS records Resend displays at the DNS provider currently authoritative for `rootcosmo.com`; do not replace the domain's nameservers to add mail records.

An accepted Resend response means the provider accepted the request, not that the message reached the inbox. Check the email's status and any rejection reason in Resend's Emails or Logs dashboard. For end-to-end verification, submit a booking using an address you control after the domain is verified, then confirm the recipient in Resend and inspect the destination inbox and spam folder.