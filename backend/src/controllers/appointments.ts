import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import ExcelJS from 'exceljs';
import { supabase } from '../lib/supabase';
import { sendAppointmentConfirmation } from '../lib/email';

export async function getAppointments(_req: Request, res: Response) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, data });
}

export async function getAppointmentById(req: Request, res: Response) {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return res.status(404).json({ success: false, error: 'Appointment not found' });
  res.json({ success: true, data });
}

export async function createAppointment(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }

  const {
    patient_name, email, phone,
    appointment_date, appointment_time,
    treatment_id, treatment_name, notes,
  } = req.body;

  const { data, error } = await supabase.from('appointments').insert({
    patient_name,
    email,
    phone,
    appointment_date,
    appointment_time,
    treatment_id: treatment_id || null,
    treatment_name: treatment_name || null,
    notes: notes || null,
    status: 'pending',
  }).select().single();

  if (error) return res.status(500).json({ success: false, error: error.message });

  // Send confirmation emails (non-blocking)
  sendAppointmentConfirmation({
    patient_name, email, phone,
    treatment_name: treatment_name || null,
    appointment_date, appointment_time,
    notes: notes || null,
  }).catch(err => console.error('Email error:', err));

  res.status(201).json({ success: true, data, message: 'Appointment booked successfully' });
}

export async function updateAppointmentStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status value' });
  }

  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, data });
}

export async function deleteAppointment(req: Request, res: Response) {
  const { id } = req.params;
  const { error } = await supabase.from('appointments').delete().eq('id', id);
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, message: 'Appointment deleted' });
}

export async function exportAppointmentsExcel(_req: Request, res: Response) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ success: false, error: error.message });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'RootCosmo Clinic';
  const sheet = workbook.addWorksheet('Appointments');

  sheet.columns = [
    { header: 'S.No',             key: 'sno',              width: 6  },
    { header: 'Patient Name',     key: 'patient_name',     width: 22 },
    { header: 'Email',            key: 'email',            width: 28 },
    { header: 'Phone',            key: 'phone',            width: 16 },
    { header: 'Treatment',        key: 'treatment_name',   width: 28 },
    { header: 'Date',             key: 'appointment_date', width: 14 },
    { header: 'Time',             key: 'appointment_time', width: 12 },
    { header: 'Status',           key: 'status',           width: 12 },
    { header: 'Notes',            key: 'notes',            width: 30 },
    { header: 'Booked At',        key: 'created_at',       width: 22 },
  ];

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5B0FA8' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = { bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } } };
  });
  headerRow.height = 28;

  // Add data rows
  (data || []).forEach((appt, i) => {
    const row = sheet.addRow({
      sno:              i + 1,
      patient_name:     appt.patient_name,
      email:            appt.email,
      phone:            appt.phone,
      treatment_name:   appt.treatment_name || 'General Consultation',
      appointment_date: appt.appointment_date,
      appointment_time: appt.appointment_time,
      status:           appt.status,
      notes:            appt.notes || '',
      created_at:       new Date(appt.created_at).toLocaleString('en-IN'),
    });
    row.eachCell(cell => {
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
      if (i % 2 === 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F0FF' } };
      }
    });
    row.height = 20;
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="rootcosmo-appointments-${new Date().toISOString().split('T')[0]}.xlsx"`);
  
  try {
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Excel export error:', err);
    res.status(500).json({ success: false, error: 'Failed to generate Excel file' });
  }
}
