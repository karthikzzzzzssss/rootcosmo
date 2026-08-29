import { Router } from 'express';
import { body } from 'express-validator';
import { getCategories, getCategoryBySlug } from '../controllers/categories';
import { getTreatments, getTreatmentById, getTreatmentByName } from '../controllers/treatments';
import {
  getAppointments, getAppointmentById,
  createAppointment, updateAppointmentStatus, deleteAppointment,
} from '../controllers/appointments';
import { getProducts, getProductById } from '../controllers/products';
import { exportAppointmentsExcel } from '../controllers/appointments';

const router = Router();

// ── Categories ──────────────────────────────────────────
router.get('/categories', getCategories);
router.get('/categories/:slug', getCategoryBySlug);

// ── Treatments ──────────────────────────────────────────
// ?category=Dental Care  &is_premier=true  &is_popular=true  &sort=price-asc|name
router.get('/treatments', getTreatments);
router.get('/treatments/by-name/:name', getTreatmentByName);
router.get('/treatments/:id', getTreatmentById);

// ── Appointments ────────────────────────────────────────
router.get('/appointments', getAppointments);
router.get('/appointments/export/excel', exportAppointmentsExcel);
router.get('/appointments/:id', getAppointmentById);
router.post('/appointments', [
  body('patient_name').trim().notEmpty().withMessage('Patient name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('appointment_date').isDate().withMessage('Valid date is required'),
  body('appointment_time').trim().notEmpty().withMessage('Time slot is required'),
], createAppointment);
router.patch('/appointments/:id/status', updateAppointmentStatus);
router.delete('/appointments/:id', deleteAppointment);

// ── Products ────────────────────────────────────────────
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

export default router;
