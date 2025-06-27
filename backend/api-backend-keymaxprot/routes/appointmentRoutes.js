const express = require('express');
const router = express.Router();
const { createAppointment, getAppointmentDetails, getMyAppointments } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createAppointment);
router.route('/my').get(protect, getMyAppointments);
router.route('/:id').get(protect, getAppointmentDetails);

module.exports = router;