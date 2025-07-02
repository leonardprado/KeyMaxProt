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
        vehicle_id: vehicle_id,
        shop_id: shop_id,
        service_id: service_id,
        dateTime: date
    });

    await newAppointment.save();

    res.status(201).json({
        success: true,
        data: newAppointment
    });
});

// @desc    Get available time slots for a service on a given date
// @route   GET /api/appointments/availability/:serviceId
// @access  Public (or Private, depending on requirements - starting as Public)
exports.getAvailableSlots = asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const { date } = req.query;

    if (!date) {
        return next(new ErrorResponse('Date parameter is required', 400));
    }

    // --- Logic to calculate available slots ---
    // This is a simplified example. A real implementation would consider:
    // 1. Shop operating hours (if appointments are tied to shops)
    // 2. Service duration
    // 3. Existing appointments for the service/shop/technician on that date
    // 4. Buffer time between appointments
    // 5. Staff/resource availability

    // For now, let's simulate some slots based on existing appointments
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // Start of the day

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999); // End of the day

    // Find existing appointments for the service on the target date
    const existingAppointments = await Appointment.find({
        service: serviceId,
        dateTime: {
            $gte: targetDate,
            $lte: endOfDay
        }
    }).select('dateTime'); // Only fetch dateTime

    // Simulate slots (e.g., every hour from 9 AM to 5 PM)
    const officeHoursStart = 9; // 9 AM
    const officeHoursEnd = 17; // 5 PM
    const slotDurationMinutes = 60; // 1 hour slots

    const availableSlots = [];
    let currentSlotTime = new Date(targetDate);
    currentSlotTime.setHours(officeHoursStart, 0, 0, 0);

    const officeEndTime = new Date(targetDate);
    officeEndTime.setHours(officeHoursEnd, 0, 0, 0);

    while (currentSlotTime < officeEndTime) {
        const slotEndTime = new Date(currentSlotTime.getTime() + slotDurationMinutes * 60000);

        // Check if this slot overlaps with any existing appointment
        const isBooked = existingAppointments.some(appt => {
            const apptTime = new Date(appt.dateTime);
            // Simple overlap check: does the appointment time fall within the slot?
            return apptTime >= currentSlotTime && apptTime < slotEndTime;
        });

        availableSlots.push({
            time: currentSlotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            dateTime: currentSlotTime.toISOString(),
            available: !isBooked
        });

        // Move to the next slot
        currentSlotTime = slotEndTime;
    }

    res.status(200).json({
        success: true,
        count: availableSlots.length,
        data: availableSlots
    });
});

// @desc    Get recent appointments (for admin dashboard)
// @route   GET /api/appointments/recent
// @access  Private/Admin
exports.getRecentAppointments = asyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit, 10) || 10; // Default a 10 citas recientes

    const recentAppointments = await Appointment.find()
        .sort({ dateTime: -1 })
        .limit(limit)
        .populate('user', 'name email')
        .populate('vehicle', 'brand model license_plate')
        .populate('shop', 'name address')
        .populate('service', 'name default_price');

    res.status(200).json({
        success: true,
        count: recentAppointments.length,
        data: recentAppointments
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
        return next(new ErrorResponse('Appointment not found', 404));
    }

    // Ensure only the owner or authorized users can view the appointment
    if (appointmentDetails.user_id._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to view this appointment', 403));
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