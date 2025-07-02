const { Appointment, User, Vehicle, Shop} = require('../models/AllModels');
const APIFeatures = require('../utils/apiFeatures');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = asyncHandler(async (req, res) => {
    const { vehicle_id, shop_id, service_id, date } = req.body;

    // user_id comes from the authenticated user (req.user.id)
    const newAppointment = new Appointment({
        user_id: req.user.id,
        vehicle_id,
        shop_id,
        service_id,
        date
    });

    await newAppointment.save();

    res.status(201).json({
        success: true,
        data: newAppointment
    });
});

// @desc    Get appointment details by ID
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointmentDetails = asyncHandler(async (req, res) => {
    const appointmentDetails = await Appointment.findById(req.params.id)
        .populate('user_id', 'name email')
        .populate('vehicle_id', 'brand model license_plate')
        .populate('shop_id', 'name address')
        .populate('service_id', 'name default_price');

    if (!appointmentDetails) {
        return res.status(404).json({ message: 'Appointment not found' });
    }

    // Ensure only the owner or authorized users can view the appointment
    if (appointmentDetails.user_id._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    res.status(200).json({
        success: true,
        data: appointmentDetails
    });
});

// @desc    Get all appointments for a user
// @route   GET /api/appointments/my
// @access  Private
exports.getMyAppointments = asyncHandler(async (req, res) => {
    const features = new APIFeatures(Appointment.find({ user_id: req.user.id })
        .populate('vehicle_id', 'brand model license_plate')
        .populate('shop_id', 'name address')
        .populate('service_id', 'name default_price'), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const appointments = await features.query;

    res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
    });
});