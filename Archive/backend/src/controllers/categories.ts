import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export async function getCategories(_req: Request, res: Response) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at');
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, data });
}

export async function getCategoryBySlug(req: Request, res: Response) {
  const { slug } = req.params;
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return res.status(404).json({ success: false, error: 'Category not found' });
  res.json({ success: true, data });
}
