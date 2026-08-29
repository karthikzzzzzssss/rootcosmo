export interface Category {
  id: string;
  name: string;
  slug: string;
  service_count: number;
  image_url: string;
  created_at: string;
}

export interface Treatment {
  id: string;
  name: string;
  category_id: string | null;
  category_name: string;
  price: number;
  image_url: string;
  is_premier: boolean;
  is_popular: boolean;
  description: string | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_name: string;
  email: string;
  phone: string;
  treatment_id: string | null;
  treatment_name: string | null;
  appointment_date: string;
  appointment_time: string;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
