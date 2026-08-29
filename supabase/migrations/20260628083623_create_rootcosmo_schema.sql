/*
# RootCosmo Clinic - Initial Schema

## Overview
Creates tables for categories, treatments, appointments, and products for the RootCosmo dental and aesthetics clinic website.

## New Tables

### categories
Stores service categories (e.g., Dental Care, Face Aesthetics, Hair Care).
- id: uuid primary key
- name: display name
- slug: URL-friendly identifier
- service_count: number of services in this category
- image_url: Pexels image URL for the category card
- created_at: timestamp

### treatments
Individual treatment/service offerings.
- id: uuid primary key
- name: treatment name
- category_id: foreign key to categories
- category_name: denormalized for display convenience
- price: numeric price in INR
- image_url: Pexels image URL
- is_premier: boolean — shown in Premier Treatments section
- is_popular: boolean — shown in Most Popular Treatments section
- description: optional short description
- created_at: timestamp

### appointments
Patient appointment bookings.
- id: uuid primary key
- patient_name: full name
- email: patient email
- phone: contact number
- treatment_id: optional foreign key to treatments
- treatment_name: denormalized treatment name at booking time
- appointment_date: date of appointment
- appointment_time: time slot string
- notes: optional additional notes
- status: pending | confirmed | cancelled
- created_at: timestamp

### products
Clinic retail products shown in the products section.
- id: uuid primary key
- name: product name
- category: product category label
- price: numeric price in INR
- image_url: Pexels image URL
- created_at: timestamp

## Security
- RLS enabled on all tables.
- All tables use anon + authenticated policies (no sign-in required).
*/

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  service_count integer NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE
  TO anon, authenticated USING (true);

-- TREATMENTS
CREATE TABLE IF NOT EXISTS treatments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  category_name text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 399.00,
  image_url text NOT NULL DEFAULT '',
  is_premier boolean NOT NULL DEFAULT false,
  is_popular boolean NOT NULL DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_treatments" ON treatments;
CREATE POLICY "anon_select_treatments" ON treatments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_treatments" ON treatments;
CREATE POLICY "anon_insert_treatments" ON treatments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_treatments" ON treatments;
CREATE POLICY "anon_update_treatments" ON treatments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_treatments" ON treatments;
CREATE POLICY "anon_delete_treatments" ON treatments FOR DELETE
  TO anon, authenticated USING (true);

-- APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  treatment_id uuid REFERENCES treatments(id) ON DELETE SET NULL,
  treatment_name text,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_appointments" ON appointments;
CREATE POLICY "anon_select_appointments" ON appointments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;
CREATE POLICY "anon_insert_appointments" ON appointments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_appointments" ON appointments;
CREATE POLICY "anon_update_appointments" ON appointments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_appointments" ON appointments;
CREATE POLICY "anon_delete_appointments" ON appointments FOR DELETE
  TO anon, authenticated USING (true);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 999.00,
  image_url text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);
