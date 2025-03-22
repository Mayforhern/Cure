const ErrorHander = require("../utils/errorHander");
const Appointment = require("../models/appointmentModel.js");
const User = require("../models/userModel.js");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const catchAsyncError = require("../middleware/catchAsyncError");

const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 12);
};

exports.newAppointment = catchAsyncError(async (req, res, next) => {
    const { doctor, description, day, time } = req.body;

    if (!doctor || !description || !day || !time) {
        return next(new ErrorHander("Please provide all required fields", 400));
    }
    const doctorExists = await User.findOne({ _id: doctor, role: "doctor" });
    if (!doctorExists) {
        return next(new ErrorHander("Doctor not found", 404));
    }

    const existingAppointment = await Appointment.findOne({
        doctor,
        day,
        time
    });
    if (existingAppointment) {
        return next(new ErrorHander("This time slot is already booked", 400));
    }

    // Generate a random roomId
    const roomId = generateRoomId();

    const appointment = await Appointment.create({
        patient: req.user._id,
        doctor,
        description,
        day,
        time,
        roomId // Add the roomId to the appointment
    });

    const message = `
    Dear ${req.user.name},

    Your appointment has been successfully scheduled with Dr. ${doctorExists.name}.

    Appointment Details:
    -------------------
    Date: ${day}
    Time: ${time}
    Doctor: Dr. ${doctorExists.name}
    Speciality: ${doctorExists.speciality}
    Description: ${description}
    Room ID: ${roomId}

    Please arrive 10 minutes before your scheduled appointment time.
    If you need to reschedule or cancel your appointment, please do so at least 24 hours in advance.

    Best regards,
    TeleConnect Team
    `;
    try {
        await sendEmail({
            email: req.user.email,
            subject: `Welcome to TeleConnect`,
            message,
        });
    } catch (error) {
        return next(new ErrorHander(error.message, 500));
    }

    res.status(201).json({
        success: true,
        appointment
    });
});

exports.allAppointments = catchAsyncError(async (req, res, next) => {
    let appointments;
    if (req.user.role == 'doctor') {
        appointments = await Appointment.find({ doctor: req.user._id })
            .populate('patient', 'name email')
            .populate('doctor', 'name speciality availablity')
            .sort({ day: -1, time: -1 }); // Most recent appointments first
    } else {
        appointments = await Appointment.find({ patient: req.user._id })
            .populate('doctor', 'name speciality availablity')
            .populate('patient', 'name email')
            .sort({ day: -1, time: -1 }); // Most recent appointments first
    }

    if (!appointments || appointments.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No appointments found",
            appointments: []
        });
    }

    // Format appointments for better readability
    const formattedAppointments = appointments.map(appointment => ({
        _id: appointment._id,
        patient: {
            id: appointment.patient._id,
            name: appointment.patient.name,
            email: appointment.patient.email
        },
        doctor: {
            id: appointment.doctor._id,
            name: appointment.doctor.name,
            speciality: appointment.doctor.speciality,
            availability: appointment.doctor.availablity
        },
        description: appointment.description,
        day: appointment.day,
        time: appointment.time,
        status: appointment.status,
        roomId: appointment.roomId, // Add roomId to the response
        createdAt: appointment.createdAt
    }));

    res.status(200).json({
        success: true,
        count: appointments.length,
        appointments: formattedAppointments
    });
});

exports.deleteAppointment = catchAsyncError(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return next(new ErrorHander('Appointment not found', 404));
    }

    // Check if user owns this appointment
    if (appointment.patient.toString() !== req.user._id.toString()) {
        return next(new ErrorHander('You can only delete your own appointments', 403));
    }

    await appointment.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Appointment cancelled successfully'
    });
});

// Get single appointment details
exports.getSingleAppointment = catchAsyncError(async (req, res, next) => {
    if (!req.params.id) {
        return next(new ErrorHander("Please provide appointment ID", 400));
    }

    const appointment = await Appointment.findById(req.params.id)
        .populate('doctor', 'name speciality')
        .populate('patient', 'name');

    if (!appointment) {
        return next(new ErrorHander('Appointment not found', 404));
    }

    res.status(200).json({
        success: true,
        appointment
    });
});