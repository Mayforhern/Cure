import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, CalendarCheck, UserPlus, Mail, Stethoscope } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, allDoctors } from '../../actions/appointmentActions';
import BookingModal from './BookingModal'

const DoctorCard = ({ doctor, onBook }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="p-6">
      <div className="flex items-center space-x-4">
        <img
          src={"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300"}
          alt={doctor.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-blue-50"
        />
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-gray-900">{doctor.name}</h2>
          <div className="flex items-center text-gray-500 mt-1">
            <Stethoscope className="h-4 w-4 mr-2" />
            <span className="text-sm">{doctor.speciality}</span>
          </div>
          <div className="flex items-center text-gray-500 mt-1">
            <Mail className="h-4 w-4 mr-2" />
            <span className="text-sm">{doctor.email}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => onBook(doctor)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book Appointment
        </button>
      </div>
    </div>
  </div>
);

const Appointment = () => {
    const [activeTab, setActiveTab] = useState('book');
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.user);
    const { loading, error, doctors } = useSelector((state) => state.allDoctors);

    useEffect(() => {
        dispatch(allDoctors());
    }, [dispatch]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={() => dispatch(clearErrors())}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!doctors || doctors.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <p className="text-gray-600">No doctors available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-xl font-bold text-gray-900">Medical Appointments</h1>
                        <a
                            href="/myappointments"
                            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            <CalendarCheck className="h-5 w-5 mr-2" />
                            My Appointments
                        </a>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Available Doctors</h2>
                    <p className="mt-2 text-gray-600">Choose a doctor and book your appointment</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                        <DoctorCard
                            key={doctor._id}
                            doctor={doctor}
                            onBook={() => setSelectedDoctor(doctor)}
                        />
                    ))}
                </div>
            </main>

            {selectedDoctor && (
                <BookingModal
                    doctor={selectedDoctor}
                    isOpen={true}
                    onClose={() => setSelectedDoctor(null)}
                />
            )}
        </div>
    );
};

export default Appointment;