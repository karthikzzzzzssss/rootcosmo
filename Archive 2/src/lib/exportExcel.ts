import ExcelJS from 'exceljs';
import type { Appointment, Category, Product, Treatment } from '../types';

type WorkbookData = {
  appointments: Appointment[];
  categories: Category[];
  treatments: Treatment[];
  products: Product[];
};

function addSheet<T>(
  workbook: ExcelJS.Workbook,
  name: string,
  rows: T[],
  columns: { header: string; key: keyof T; width?: number }[],
) {
  const sheet = workbook.addWorksheet(name);
  sheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key as string,
    width: col.width ?? 22,
  }));

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF6D28D9' },
  };
  sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  rows.forEach((row) => sheet.addRow(row));

  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: rows.length + 1, column: columns.length },
  };
}

function fmtDate(value: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toISOString().replace('T', ' ').slice(0, 19);
}

export async function exportWorkbook(data: WorkbookData): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'RootCosmo Admin';
  workbook.created = new Date();

  addSheet(workbook, 'Appointments', data.appointments, [
    { header: 'Patient Name', key: 'patient_name', width: 24 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'Phone', key: 'phone', width: 18 },
    { header: 'Treatment', key: 'treatment_name', width: 26 },
    { header: 'Date', key: 'appointment_date', width: 14 },
    { header: 'Time', key: 'appointment_time', width: 14 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Notes', key: 'notes', width: 32 },
    { header: 'Booked At', key: 'created_at', width: 20 },
  ]);

  addSheet(workbook, 'Categories', data.categories, [
    { header: 'Name', key: 'name', width: 24 },
    { header: 'Slug', key: 'slug', width: 20 },
    { header: 'Service Count', key: 'service_count', width: 14 },
    { header: 'Image URL', key: 'image_url', width: 40 },
    { header: 'Created At', key: 'created_at', width: 20 },
  ]);

  addSheet(workbook, 'Treatments', data.treatments, [
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Category', key: 'category_name', width: 20 },
    { header: 'Price', key: 'price', width: 12 },
    { header: 'Premier', key: 'is_premier', width: 10 },
    { header: 'Popular', key: 'is_popular', width: 10 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Image URL', key: 'image_url', width: 40 },
    { header: 'Created At', key: 'created_at', width: 20 },
  ]);

  addSheet(workbook, 'Products', data.products, [
    { header: 'Name', key: 'name', width: 28 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Price', key: 'price', width: 12 },
    { header: 'Image URL', key: 'image_url', width: 40 },
    { header: 'Created At', key: 'created_at', width: 20 },
  ]);

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function buildExportFilename(): string {
  const stamp = new Date().toISOString().slice(0, 10);
  return `rootcosmo-export-${stamp}.xlsx`;
}

export { fmtDate };
