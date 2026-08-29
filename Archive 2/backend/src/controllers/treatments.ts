import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export async function getTreatments(req: Request, res: Response) {
  const { category, is_premier, is_popular, sort } = req.query;

  let query = supabase.from('treatments').select('*');

  if (category) query = query.eq('category_name', category as string);
  if (is_premier === 'true') query = query.eq('is_premier', true);
  if (is_popular === 'true') query = query.eq('is_popular', true);

  if (sort === 'price-asc') query = query.order('price', { ascending: true });
  else if (sort === 'name') query = query.order('name', { ascending: true });
  else query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, data });
}

export async function getTreatmentById(req: Request, res: Response) {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('treatments')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return res.status(404).json({ success: false, error: 'Treatment not found' });
  res.json({ success: true, data });
}

export async function getTreatmentByName(req: Request, res: Response) {
  const name = decodeURIComponent(req.params.name);
  const { data, error } = await supabase
    .from('treatments')
    .select('*')
    .ilike('name', name)
    .single();
  if (error) return res.status(404).json({ success: false, error: 'Treatment not found' });
  res.json({ success: true, data });
}
