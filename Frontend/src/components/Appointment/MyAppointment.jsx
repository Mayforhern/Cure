import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, myAppointments } from '../../actions/appointmentActions';
import { Calendar, Clock, MapPin, Users, CalendarCheck, UserPlus, X, Calendar as CalendarIcon, Clock as ClockIcon, FileText, User, UserCheck } from 'lucide-react';

const MyAppointment = () => {
    const dispatch = useDispatch();
    // Changed from myAppointments to myAppointment to match the store
    const { loading, error, appointments } = useSelector((state) => state.myAppointment);
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
      };
    
      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
        }
        dispatch(myAppointments());
    }, [dispatch, error]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen ">
            <h2 className="text-2xl font-bold mb-4">Appointments</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
                {appointments.map((appt) => (
                    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{appt.doctor.name}</h3>
                                <p className="text-sm text-gray-600">{appt.doctor.speciality}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[appt.status]}`}>
                                RoomId: {appt.roomId}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center text-gray-600">
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                <span>{formatDate(appt.day)}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <ClockIcon className="h-4 w-4 mr-2" />
                                <span>{appt.time}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <User className="h-4 w-4 mr-2" />
                                <span>{appt.patient.name}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <UserCheck className="h-4 w-4 mr-2" />
                                <span>{appt.patient.email}</span>
                            </div>
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <div className="flex items-start">
                                <FileText className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                                <p className="text-sm text-gray-600">{appt.description}</p>
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 mt-4">
                            Booked on {formatDate(appt.createdAt)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyAppointment;
