-- Replace the unrestricted INSERT policy on public.appointments.
-- The previous policy had WITH CHECK (true), allowing any row to be inserted
-- by anon/authenticated roles without validation. The new policy constrains
-- public booking inserts to rows that:
--   1. Have a pending status (public cannot self-confirm or self-cancel)
--   2. Contain the required contact/booking fields (non-empty)
-- This preserves the public booking flow while closing the unrestricted-access hole.

DROP POLICY IF EXISTS anon_insert_appointments ON public.appointments;

CREATE POLICY anon_insert_appointments ON public.appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND patient_name IS NOT NULL AND btrim(patient_name) <> ''
    AND email IS NOT NULL AND btrim(email) <> ''
    AND phone IS NOT NULL AND btrim(phone) <> ''
    AND appointment_date IS NOT NULL
    AND appointment_time IS NOT NULL AND btrim(appointment_time) <> ''
  );
