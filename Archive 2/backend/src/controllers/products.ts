import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export async function getProducts(_req: Request, res: Response) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at');
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, data });
}

export async function getProductById(req: Request, res: Response) {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, data });
}
