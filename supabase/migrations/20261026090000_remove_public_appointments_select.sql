/*
# Remove Public Read Access to Appointments

## Problem
The `appointments` table had a SELECT policy for the `anon` role with `USING (true)`.
Because the public anon key ships in the frontend bundle, anyone could read every
appointment — including each patient's name, email and phone — directly from Supabase.

## Change
Drop the anon/authenticated SELECT policy on `appointments`. Appointment data is now
served exclusively by the API (`/api/appointments` GET) using the service-role key,
behind the admin password (`ADMIN_TOKEN`).

Public booking is unaffected: the booking endpoint inserts the row, and the INSERT
policy for public bookings remains in place.
*/

DROP POLICY IF EXISTS "anon_select_appointments" ON appointments;
