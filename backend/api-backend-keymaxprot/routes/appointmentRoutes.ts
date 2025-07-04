const express = require('express');
const router = express.Router();
const { createAppointment, getAppointmentDetails, getMyAppointments, getRecentAppointments, getAvailableSlots } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').post(protect, createAppointment);
router.route('/my').get(protect, getMyAppointments);
router.route('/recent').get(protect, authorize('admin'), getRecentAppointments); // Nueva ruta para citas recientes
// New route for checking service availability
router.route('/availability/:serviceId').get(getAvailableSlots);
router.route('/:id').get(protect, getAppointmentDetails);

export default router;