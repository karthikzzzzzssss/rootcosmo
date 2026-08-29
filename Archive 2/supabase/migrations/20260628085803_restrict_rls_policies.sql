/*
# Restrict RLS Policies — Remove Unrestricted Write Access

## Problem
All tables had INSERT, UPDATE, and DELETE policies with `USING (true)` / `WITH CHECK (true)`,
allowing any anonymous user to modify or delete any row — including clinic catalog data.

## Changes

### categories, treatments, products (read-only catalog)
- DROP INSERT, UPDATE, DELETE policies for anon/authenticated.
- Keep only SELECT (public read). Catalog changes are managed via the Supabase dashboard
  or service-role key, not through the public anon key.

### appointments (patient bookings)
- Keep SELECT and INSERT for anon (so visitors can book appointments).
- DROP UPDATE and DELETE — visitors must not be able to modify or cancel
  other people's bookings. Appointment management is done by clinic staff
  via the dashboard with the service-role key.
*/

-- ── categories: drop write policies, keep SELECT ──────────────────────────
DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
DROP POLICY IF EXISTS "anon_update_categories" ON categories;
DROP POLICY IF EXISTS "anon_delete_categories" ON categories;

-- ── treatments: drop write policies, keep SELECT ──────────────────────────
DROP POLICY IF EXISTS "anon_insert_treatments" ON treatments;
DROP POLICY IF EXISTS "anon_update_treatments" ON treatments;
DROP POLICY IF EXISTS "anon_delete_treatments" ON treatments;

-- ── products: drop write policies, keep SELECT ────────────────────────────
DROP POLICY IF EXISTS "anon_insert_products" ON products;
DROP POLICY IF EXISTS "anon_update_products" ON products;
DROP POLICY IF EXISTS "anon_delete_products" ON products;

-- ── appointments: keep SELECT + INSERT, drop UPDATE + DELETE ──────────────
DROP POLICY IF EXISTS "anon_update_appointments" ON appointments;
DROP POLICY IF EXISTS "anon_delete_appointments" ON appointments;
